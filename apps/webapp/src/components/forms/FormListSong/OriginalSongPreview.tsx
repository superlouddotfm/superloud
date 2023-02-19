import { createAudio, AudioState } from '@solid-primitives/audio'
import { createEffect, createSignal, Match, Switch } from 'solid-js'
import { IconPause, IconPlay, IconSpinner } from '~/components/system/Icons'
import formatMediaDuration from '~/helpers/formatMediaDuration'

interface OriginalSongPreviewProps {
  song: {
    node: {
      artistByArtistId: {
        id: string
        name: string
      }
      id: string
      title: string
      lossyArtworkUrl: string
      lossyAudioUrl: string
    }
  }
  storeForm: any
}
export const OriginalSongPreview = (props: OriginalSongPreviewProps) => {
  const [volumePreview] = createSignal(1)
  const [playPreview] = createSignal(false)

  const [previewAudio, actionPreviewAudio] = createAudio(props.song.node.lossyAudioUrl, playPreview, volumePreview)
  const [duration, setDuration] = createSignal('--:--')

  createEffect(() => {
    if (previewAudio.duration) {
      setDuration(formatMediaDuration(previewAudio?.duration))
    }
  })

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          props.storeForm?.setFields('title', props?.song?.node?.title)
          props.storeForm?.setFields('id_original_song', props?.song?.node?.id)
          props.storeForm?.setData('original_song', props?.song?.node)
        }}
        class="absolute w-full h-full z-10 cursor-pointer opacity-0 peer"
      />
      <div class="relative">
        <img
          loading="lazy"
          width="158"
          height="158"
          class="rounded-sm w-full aspect-square object-cover"
          src={props.song?.node?.lossyArtworkUrl}
          alt=""
        />
        <button
          onClick={() => {
            previewAudio.state !== AudioState.PLAYING ? actionPreviewAudio.play() : actionPreviewAudio.pause()
          }}
          class={
            'transition-all active:bg-primary-11 active:scale-90 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bottom-2 inline-end-2 aspect-square absolute z-20 bg-primary-9 hover:bg-primary-10 w-9 h-9 flex items-center justify-center rounded-full text-accent-1'
          }
          type="button"
          disabled={[AudioState.ERROR, AudioState.LOADING].includes(previewAudio.state)}
          title="Play preview"
        >
          <span class="sr-only">Play preview</span>
          <Switch>
            <Match when={previewAudio.state === AudioState.PLAYING}>
              <IconPause class="w-4 h-4" />
            </Match>
            <Match
              when={[AudioState.COMPLETE, AudioState.READY, AudioState.PAUSED, AudioState.STOPPED].includes(
                previewAudio.state,
              )}
            >
              <IconPlay class="w-4 h-4" />
            </Match>
            <Match when={previewAudio.state === AudioState.LOADING}>
              <IconSpinner class="animate-spin" />
            </Match>
          </Switch>
        </button>
      </div>
      <div class="text-2xs flex flex-col py-4 gap-1">
        <span class="font-medium text-accent-11 max-w-inherit">{props.song?.node?.title}</span>
        <span class="block overflow-hidden text-ellipsis text-[0.85em] font-medium text-accent-9 max-w-inherit">
          {props.song?.node?.artistByArtistId?.name}
        </span>
      </div>
      <div
        data-after=" "
        classList={{
          'after:bg-interactive-10 border-interactive-6 after:scale-105 after:bg-opacity-100':
            props.storeForm.data()?.id_original_song === props?.song?.node?.id,
          'border-accent-6 after:scale-0 after:bg-opacity-0':
            props.storeForm.data()?.id_original_song !== props?.song?.node?.id,
        }}
        class="relative after:rounded-full after:absolute after:w-2.5 after:h-2.5 after:left-1/2 after:top-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:content-[attr(data-after)]  mt-auto w-5 h-5 rounded-full border-2 bg-accent-1"
      />
    </>
  )
}

export default OriginalSongPreview
