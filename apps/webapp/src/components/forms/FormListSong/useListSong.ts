import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { createOrEditSongSchema as schema } from '~/schemas/create-or-edit-song'
import { z } from 'zod'
import { ipfsClient } from '~/config/ipfs'
import { ABI_SUPERLOUD_CATALOG, SUPERLOUD_CATALOG_CONTRACT_ADDRESS } from '~/abi/superloudCatalog'
import { getUnixTime } from 'date-fns'
import { useToast } from '~/hooks/useToast'
import * as popover from '@zag-js/popover'
import * as accordion from '@zag-js/accordion'
import { useMachine, normalizeProps } from '@zag-js/solid'
import { createEffect, createMemo, createUniqueId } from 'solid-js'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'

interface FormValues extends z.infer<typeof schema> {}

async function uploadFileToIPFS(file: any) {
  try {
    const result = await ipfsClient.add(file)
    const cid = result.path
    return `ipfs://${cid}`
  } catch (e) {
    console.error(e)
  }
}

export function useListSong() {
  const queryClient = useQueryClient()
  // UI
  const toast = useToast()
  const [statePopover, sendPopover] = useMachine(popover.machine({ id: createUniqueId(), portalled: true }))
  const apiPopoverListSongStatus = createMemo(() => popover.connect(statePopover, sendPopover, normalizeProps))
  const [stateAccordion, sendAccordion] = useMachine(accordion.machine({ id: createUniqueId(), collapsible: true }))
  const apiAccordionListSongStatus = createMemo(() => accordion.connect(stateAccordion, sendAccordion, normalizeProps))

  // Mutations
  const mutationUploadInstrumentalTrack = createMutation(uploadFileToIPFS)
  const mutationUploadVocalTrack = createMutation(uploadFileToIPFS)
  const mutationUploadLRC = createMutation(uploadFileToIPFS)
  const mutationUploadMetadata = createMutation(uploadFileToIPFS, {
    onSuccess() {
      apiAccordionListSongStatus().setValue('transaction-1')
    },
  })
  const mutationWriteContractCreateNewSong = createMutation(
    async (args: { idOriginalVersion: string; uriMetadata: string }) => {
      try {
        const config = await prepareWriteContract({
          address: SUPERLOUD_CATALOG_CONTRACT_ADDRESS,
          abi: ABI_SUPERLOUD_CATALOG,
          functionName: 'listNewKaraokeVersion',
          args: [args.idOriginalVersion, args.uriMetadata, getUnixTime(new Date())],
        })
        const transaction = await writeContract(config)
        return transaction.hash
      } catch (e) {
        console.error(e)
      }
    },
    {
      async onSuccess(data: `0x${string}`) {
        await mutationTxWaitCreateNewSong.mutateAsync(data)
      },
    },
  )

  const mutationTxWaitCreateNewSong = createMutation(
    async (hash: `0x${string}`) => {
      try {
        const receipt = await waitForTransaction({
          hash,
        })
        return receipt
      } catch (e) {
        console.error(e)
      }
    },
    {
      onSuccess() {
        //@ts-ignore
        toast().create({
          title: 'Karaoke version listed successfully!',
          description: 'The song was listed successfully on the Superloud catalog.',
          type: 'success',
          placement: 'bottom-right',
        })
      },
      onSettled() {
        // Whether or not the transaction is successful, invalidate user balance query
        // this way we will refresh the balance
        queryClient.invalidateQueries(['user-balance'])
      },
    },
  )

  async function prepareData(formValues: any) {
    apiAccordionListSongStatus().setValue('file-uploads')
    /**
     * 1 - Upload assets to IPFS
     * That includes: instrumental track, vocal track, lrc file and metadata
     */
    const promises = []
    if (!mutationUploadVocalTrack.isSuccess)
      promises.push(mutationUploadVocalTrack.mutateAsync(formValues?.isolated_vocal_track_file))
    if (!mutationUploadInstrumentalTrack.isSuccess)
      promises.push(mutationUploadInstrumentalTrack.mutateAsync(formValues?.isolated_instrumental_track_file))
    if (!mutationUploadLRC.isSuccess) promises.push(mutationUploadLRC.mutateAsync(formValues?.lrc_file))

    await Promise.all(promises)

    /**
     * 2 - Upload metadata to IPFS
     */

    const metadata = {
      original_song_id: formValues?.original_song?.id ?? '',
      original_song_title: formValues?.original_song?.title ?? '',
      original_song_artist_id: formValues?.original_song?.artistByArtistId?.id ?? '',
      original_song_artist_name: formValues?.original_song?.artistByArtistId?.name ?? '',
      original_song_audio_url: formValues?.original_song?.lossyAudioUrl ?? '',
      original_song_artwork_url: formValues?.original_song?.lossyArtworkUrl ?? '',
      original_song_website_url: formValues?.original_song?.website_url ?? '',
      original_song_supporting_artist:
        formValues?.original_song?.supportingArtist && formValues?.original_song?.supportingArtist !== null
          ? formValues?.original_song?.supportingArtist
          : '',
      title: formValues.title,
      genre: formValues?.genre ?? '',
      description: formValues?.description ?? '',
      uri_isolated_vocal_track: mutationUploadVocalTrack?.data,
      uri_isolated_instrumental_track: mutationUploadInstrumentalTrack?.data,
      uri_lrc: mutationUploadLRC?.data,
    }

    let uriMetadata
    if (!mutationUploadMetadata.isSuccess) {
      uriMetadata = await mutationUploadMetadata.mutateAsync(JSON.stringify(metadata))
    } else {
      uriMetadata = mutationUploadMetadata.data
    }

    return {
      uriMetadata,
    }
  }

  async function onSubmitNewSong(args: { formValues: FormValues }) {
    try {
      /**
       * Prepare data
       */
      const { uriMetadata } = await prepareData(args?.formValues)
      /**
       * Smart contract interaction
       */
      await mutationWriteContractCreateNewSong.mutateAsync({
        idOriginalVersion: args?.formValues?.id_original_song,
        uriMetadata: uriMetadata as string,
      })
    } catch (e) {
      console.error(e)
    }
  }

  // Omitted for now
  // async function onSubmitEditSong(args: { formValues: FormValues }) {}

  createEffect(() => {
    if (
      [
        mutationUploadInstrumentalTrack.status,
        mutationUploadVocalTrack.status,
        mutationUploadLRC.status,
        mutationUploadMetadata.status,
        // Contract interactions
        mutationWriteContractCreateNewSong.status,
        mutationTxWaitCreateNewSong.status,
      ].includes('loading') &&
      !apiPopoverListSongStatus().isOpen
    )
      apiPopoverListSongStatus().open()
  })
  return {
    // UI
    apiPopoverListSongStatus,
    apiAccordionListSongStatus,
    // Uploads
    mutationUploadInstrumentalTrack,
    mutationUploadVocalTrack,
    mutationUploadLRC,
    mutationUploadMetadata,
    // Contract interactions
    mutationWriteContractCreateNewSong,
    mutationTxWaitCreateNewSong,
    // Form submit event handlers
    onSubmitNewSong,
    // onSubmitEditSong,
  }
}

export default useListSong
