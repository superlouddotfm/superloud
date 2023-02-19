import { FormListSong, useForm, useListSong, createOrEditSongSchema } from '~/components/forms/FormListSong'
import { z } from 'zod'
import { Match, Show, Switch } from 'solid-js'
import web3UriToUrl from '~/helpers/web3UriToUrl'
import Button from '~/components/system/Button'
import { IconCheck, IconDoubleChevronDown, IconError, IconExternal, IconSpinner } from '~/components/system/Icons'

export const CreateNewSong = () => {
  const {
    apiPopoverListSongStatus,
    apiAccordionListSongStatus,
    mutationUploadInstrumentalTrack,
    mutationUploadVocalTrack,
    mutationUploadLRC,
    mutationUploadMetadata,
    mutationWriteContractCreateNewSong,
    mutationTxWaitCreateNewSong,
    onSubmitNewSong,
  } = useListSong()
  const { formListSong, stateMachineAccordion, stateMachineTabs } = useForm({
    initialValues: {
      is_listed: true,
      title: '',
      description: '',
    },
    onSubmit: (values: z.infer<typeof createOrEditSongSchema>) => {
      onSubmitNewSong({
        formValues: values,
      })
    },
  })
  return (
    <>
      <div class="w-full max-w-prose mx-auto">
        <h1 class="text-2xl text-neutral-9 font-bold">List a song on the catalog</h1>
        <div class="space-y-1 text-xs mt-2 mb-4 text-neutral-7 font-medium">
          <p>
            To create a karaoke version of a song and list it on the Superloud catalog, you will need to isolate both
            the instrumental and vocal tracks and to create a LRC file.
          </p>
          <p>
            To isolate the audio tracks, you can use tools like{' '}
            <a rel="noreferrer nofollow" class="link" target="_blank" href="https://vocalremover.org">
              Vocalremover
            </a>
            ,{' '}
            <a
              href="https://www.lalal.ai/?referral=RLmCbtAn&utm_source=referral_promo&utm_medium=link&utm_campaign=RLmCbtAn"
              rel="noreferrer nofollow"
              class="link"
              target="_blank"
            >
              Lalal.ai
            </a>
            ,
            <a rel="noreferrer nofollow" class="link" target="_blank" href="https://x-minus.pro/">
              X-Minus Pro
            </a>
            ,{' '}
            <a
              class="link"
              rel="noreferrer nofollow"
              target="_blank"
              href="https://www.notta.ai/en/tools/online-vocal-remover"
            >
              Notta AI
            </a>
            ...
          </p>
          <p class="text-start">
            An{' '}
            <a
              rel="noreferrer nofollow"
              class="link"
              target="_blank"
              href="https://en.wikipedia.org/wiki/LRC_(file_format)"
            >
              LRC file
            </a>{' '}
            is a file that will synchronize the song lyrics to audio. You can use different online tools, like{' '}
            <a href="https://lrc-maker.github.io/#/" rel="noreferrer nofollow" class="link" target="_blank">
              Akari's LRC Maker
            </a>{' '}
            or{' '}
            <a rel="noreferrer nofollow" class="link" target="_blank" href="https://lrcgenerator.com/">
              LRCGenerator
            </a>
            .
          </p>
        </div>
        <FormListSong
          apiTabs={stateMachineTabs}
          apiAccordion={stateMachineAccordion}
          storeForm={formListSong}
          isError={[
            mutationTxWaitCreateNewSong.isError,
            mutationWriteContractCreateNewSong.isError,
            mutationUploadInstrumentalTrack.isError,
            mutationUploadMetadata.isError,
            mutationUploadVocalTrack.isError,
            mutationUploadLRC.isError,
          ].includes(true)}
          isError={[
            mutationTxWaitCreateNewSong.isError,
            mutationWriteContractCreateNewSong.isError,
            mutationUploadInstrumentalTrack.isError,
            mutationUploadMetadata.isError,
            mutationUploadVocalTrack.isError,
            mutationUploadLRC.isError,
          ].includes(true)}
          isLoading={[
            mutationTxWaitCreateNewSong.isLoading,
            mutationWriteContractCreateNewSong.isLoading,
            mutationUploadInstrumentalTrack.isLoading,
            mutationUploadMetadata.isLoading,
            mutationUploadVocalTrack.isLoading,
            mutationUploadLRC.isLoading,
          ].includes(true)}
          isSuccess={
            ![
              mutationTxWaitCreateNewSong.isSuccess,
              mutationWriteContractCreateNewSong.isSuccess,
              mutationUploadInstrumentalTrack.isSuccess,
              mutationUploadMetadata.isSuccess,
              mutationUploadVocalTrack.isSuccess,
              mutationUploadLRC.isSuccess,
            ].includes(false)
          }
        />
        <Show
          when={
            ['success', 'loading', 'error'].includes(mutationTxWaitCreateNewSong.status) ||
            ['success', 'loading', 'error'].includes(mutationWriteContractCreateNewSong.status) ||
            ['success', 'loading', 'error'].includes(mutationUploadInstrumentalTrack.status) ||
            ['success', 'loading', 'error'].includes(mutationUploadMetadata.status) ||
            ['success', 'loading', 'error'].includes(mutationUploadVocalTrack.status) ||
            ['success', 'loading', 'error'].includes(mutationUploadLRC.status)
          }
        >
          <div class="fixed w-full pointer-events-none z-50 pb-16 md:pb-0 bottom-0 md:top-0 inline-start-0 flex ">
            <div class="w-full mx-auto flex justify-center">
              <div class="relative h-fit-content">
                <button
                  classList={{
                    'shadow-md rounded-2xl md:rounded-t-none border-accent-9': !apiPopoverListSongStatus()?.isOpen,
                    'shadow-xl rounded-2xl md:rounded-t-none border-accent-11 border-opacity-75':
                      apiPopoverListSongStatus()?.isOpen,
                  }}
                  class="pointer-events-auto bg-accent-12 text-accent-1 hover:bg-neutral-12 hover:text-accent-1 focus:ring-2 border relative flex items-center font-semibold text-2xs px-5 py-1.5"
                  {...apiPopoverListSongStatus().triggerProps}
                >
                  <Switch>
                    <Match
                      when={[
                        mutationTxWaitCreateNewSong.isLoading,
                        mutationWriteContractCreateNewSong.isLoading,
                        mutationUploadInstrumentalTrack.isLoading,
                        mutationUploadMetadata.isLoading,
                        mutationUploadVocalTrack.isLoading,
                        mutationUploadLRC.isLoading,
                      ].includes(true)}
                    >
                      <IconSpinner class="animate-spin w-5 h-5 mie-1ex" />
                    </Match>
                    <Match
                      when={
                        ![
                          mutationTxWaitCreateNewSong.isSuccess,
                          mutationWriteContractCreateNewSong.isSuccess,

                          mutationUploadInstrumentalTrack.isSuccess,
                          mutationUploadMetadata.isSuccess,
                          mutationUploadVocalTrack.isSuccess,
                          mutationUploadLRC.isSuccess,
                        ].includes(false)
                      }
                    >
                      <IconCheck class="w-5 h-5 mie-1ex" />
                    </Match>
                  </Switch>
                  List new karaoke version
                </button>
                <div
                  {...apiPopoverListSongStatus().positionerProps}
                  class="absolute pointer-events-auto w-full min-w-[unset] top-0 md:-translate-y-full md:bottom-0 inline-start-0"
                >
                  <div
                    {...apiPopoverListSongStatus().contentProps}
                    class="bg-accent-12 border  border-accent-5 w-full rounded-xl md:rounded-t-0 shadow-2xl"
                  >
                    <div class="sr-only" {...apiPopoverListSongStatus().titleProps}>
                      List new karaoke version
                    </div>
                    <div class="sr-only" {...apiPopoverListSongStatus().descriptionProps}>
                      You can check the status of your different file uploads and other required interactions below.
                    </div>
                    <div
                      class="border-t divide-y divide-accent-11 divide-opacity-50 border-accent-7"
                      {...apiAccordionListSongStatus().rootProps}
                    >
                      <div {...apiAccordionListSongStatus().getItemProps({ value: 'file-uploads' })}>
                        <h3>
                          <button
                            class="w-full font-semibold flex justify-between text-start text-accent-6 text-[0.85rem] p-2"
                            {...apiAccordionListSongStatus().getTriggerProps({ value: 'file-uploads' })}
                          >
                            <Switch>
                              <Match
                                when={[
                                  mutationUploadInstrumentalTrack.isLoading,
                                  mutationUploadMetadata.isLoading,
                                  mutationUploadVocalTrack.isLoading,
                                  mutationUploadLRC.isLoading,
                                ].includes(true)}
                              >
                                <IconSpinner class="animate-spin w-5 h-5 mie-1ex" />
                              </Match>
                              <Match
                                when={
                                  ![
                                    mutationUploadInstrumentalTrack.isSuccess,
                                    mutationUploadMetadata.isSuccess,
                                    mutationUploadVocalTrack.isSuccess,
                                    mutationUploadLRC.isSuccess,
                                  ].includes(false)
                                }
                              >
                                <IconCheck class="w-5 h-5 mie-1ex" />
                              </Match>
                            </Switch>
                            File uploads{' '}
                            <IconDoubleChevronDown
                              classList={{
                                'rotate-180': apiAccordionListSongStatus()?.value === 'file-uploads',
                              }}
                              class="text-accent-6 w-5 h-5 pis-1ex"
                            />
                          </button>
                        </h3>
                        <div {...apiAccordionListSongStatus().getContentProps({ value: 'file-uploads' })}>
                          <ul class="pb-2 text-2xs space-y-1 px-2">
                            <li
                              classList={{
                                'text-accent-8': mutationUploadInstrumentalTrack?.isIdle,
                                'animate-pulse font-bold': mutationUploadInstrumentalTrack?.isLoading,
                                'text-accent-7': !mutationUploadInstrumentalTrack?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationUploadInstrumentalTrack?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationUploadInstrumentalTrack?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationUploadInstrumentalTrack?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>
                              <span>
                                <span>Instrumental track:&nbsp;</span>
                                <span>{mutationUploadInstrumentalTrack.status}</span>
                              </span>
                              <Show
                                when={
                                  mutationUploadInstrumentalTrack?.isSuccess && mutationUploadInstrumentalTrack?.data
                                }
                              >
                                <a
                                  class="block link"
                                  rel="noreferrer nofollow"
                                  href={web3UriToUrl(mutationUploadInstrumentalTrack?.data)}
                                  target="_blank"
                                >
                                  <span class="sr-only">View hosted </span> <IconExternal class="w-4 h-4 pis-1ex" />
                                </a>
                              </Show>
                            </li>
                            <li
                              classList={{
                                'text-accent-8': mutationUploadVocalTrack?.isIdle,
                                'animate-pulse font-bold': mutationUploadVocalTrack?.isLoading,
                                'text-accent-7': !mutationUploadVocalTrack?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationUploadVocalTrack?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationUploadVocalTrack?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationUploadVocalTrack?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>
                              <span>
                                <span>Vocal track:&nbsp;</span>
                                <span>{mutationUploadVocalTrack.status}</span>
                              </span>
                              <Show when={mutationUploadVocalTrack?.isSuccess && mutationUploadVocalTrack?.data}>
                                <a
                                  class="block link text-[0.75rem]"
                                  rel="noreferrer nofollow"
                                  href={web3UriToUrl(mutationUploadVocalTrack?.data)}
                                  target="_blank"
                                >
                                  <span class="sr-only">View hosted </span> <IconExternal class="w-4 h-4 pis-1ex" />
                                </a>
                              </Show>
                            </li>
                            <li
                              classList={{
                                'text-accent-8': mutationUploadLRC?.isIdle,
                                'animate-pulse font-bold': mutationUploadLRC?.isLoading,
                                'text-accent-7': !mutationUploadLRC?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationUploadLRC?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationUploadLRC?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationUploadLRC?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>
                              <span>
                                <span>LRC file:&nbsp;</span>
                                <span>{mutationUploadLRC.status}</span>
                              </span>
                              <Show when={mutationUploadLRC?.isSuccess && mutationUploadLRC?.data}>
                                <a
                                  class="block link text-[0.75rem]"
                                  rel="noreferrer nofollow"
                                  href={web3UriToUrl(mutationUploadLRC?.data)}
                                  target="_blank"
                                >
                                  <span class="sr-only">View hosted </span> <IconExternal class="w-4 h-4 pis-1ex" />
                                </a>
                              </Show>
                            </li>

                            <li
                              classList={{
                                'text-accent-8': mutationUploadMetadata?.isIdle,
                                'animate-pulse font-bold': mutationUploadMetadata?.isLoading,
                                'text-accent-7': !mutationUploadMetadata?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationUploadMetadata?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationUploadMetadata?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationUploadMetadata?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>
                              <span>
                                <span>Metadata:&nbsp;</span>
                                <span>{mutationUploadMetadata.status}</span>
                              </span>
                              <Show when={mutationUploadMetadata?.isSuccess && mutationUploadMetadata?.data}>
                                <a
                                  class="block link text-[0.75rem]"
                                  rel="noreferrer nofollow"
                                  href={web3UriToUrl(mutationUploadMetadata?.data)}
                                  target="_blank"
                                >
                                  <span class="sr-only">View hosted </span> <IconExternal class="w-4 h-4 pis-1ex" />
                                </a>
                              </Show>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div {...apiAccordionListSongStatus().getItemProps({ value: 'transaction-1' })}>
                        <h3>
                          <button
                            class="w-full font-semibold flex justify-between text-start text-accent-6 text-[0.85rem] p-2"
                            {...apiAccordionListSongStatus().getTriggerProps({ value: 'transaction-1' })}
                          >
                            <Switch>
                              <Match
                                when={[
                                  mutationWriteContractCreateNewSong.isLoading,
                                  mutationTxWaitCreateNewSong.isLoading,
                                ].includes(true)}
                              >
                                <IconSpinner class="animate-spin w-5 h-5 mie-1ex" />
                              </Match>
                              <Match
                                when={
                                  ![
                                    mutationWriteContractCreateNewSong.isSuccess,
                                    mutationTxWaitCreateNewSong.isSuccess,
                                  ].includes(false)
                                }
                              >
                                <IconCheck class="w-5 h-5 mie-1ex" />
                              </Match>
                            </Switch>
                            Blockchain interactions{' '}
                            <IconDoubleChevronDown
                              classList={{
                                'rotate-180': apiAccordionListSongStatus()?.value === 'transaction-1',
                              }}
                              class="text-accent-6 w-5 h-5 pis-1ex"
                            />
                          </button>
                        </h3>
                        <div {...apiAccordionListSongStatus().getContentProps({ value: 'transaction-1' })}>
                          <ol class="pb-2 text-2xs px-2 space-y-1">
                            <li
                              classList={{
                                'text-accent-8': mutationWriteContractCreateNewSong?.isIdle,
                                'animate-pulse font-bold': mutationWriteContractCreateNewSong?.isLoading,
                                'text-accent-7': !mutationWriteContractCreateNewSong?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationWriteContractCreateNewSong?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationWriteContractCreateNewSong?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationWriteContractCreateNewSong?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>

                              <Switch>
                                <Match when={mutationWriteContractCreateNewSong.status !== 'loading'}>
                                  <span>
                                    <span>Sign transaction in your wallet: &nbsp;</span>

                                    <Show
                                      when={['success', 'error'].includes(mutationWriteContractCreateNewSong.status)}
                                    >
                                      <span>{mutationWriteContractCreateNewSong.status}</span>
                                    </Show>
                                  </span>
                                </Match>

                                <Match when={mutationWriteContractCreateNewSong.status === 'loading'}>
                                  <span>Action required: Sign transaction in your wallet</span>
                                </Match>
                              </Switch>
                            </li>
                            <li
                              classList={{
                                'text-accent-8': mutationTxWaitCreateNewSong?.isIdle,
                                'animate-pulse font-bold': mutationTxWaitCreateNewSong?.isLoading,
                                'text-accent-7': !mutationTxWaitCreateNewSong?.isIdle,
                              }}
                              class="flex items-center"
                            >
                              <Switch>
                                <Match when={mutationTxWaitCreateNewSong?.isError}>
                                  <IconError class="w-4 h-4 shrink-0 mie-1ex text-negative-9" />
                                </Match>

                                <Match when={mutationTxWaitCreateNewSong?.isSuccess}>
                                  <IconCheck class="w-4 h-4 shrink-0 mie-1ex text-positive-9" />
                                </Match>
                                <Match when={mutationTxWaitCreateNewSong?.isLoading}>
                                  <IconSpinner class="w-4 h-4 shrink-0 mie-1ex animate-spin" />
                                </Match>
                              </Switch>
                              <span>
                                <span>Transaction status:&nbsp;</span> <span>{mutationTxWaitCreateNewSong.status}</span>
                              </span>
                            </li>
                          </ol>
                        </div>
                        <div class="pb-0.5 border-t border-accent-11 border-opacity-50">
                          <div class="px-2">
                            <Switch>
                              <Match
                                when={[
                                  mutationTxWaitCreateNewSong?.status,
                                  mutationWriteContractCreateNewSong.status,
                                  mutationUploadInstrumentalTrack.status,
                                  mutationUploadLRC.status,
                                  mutationUploadMetadata.status,
                                  mutationUploadVocalTrack.status,
                                ].includes('error')}
                              >
                                <div class="mb-4 animate-appear rounded-md text-2xs p-3 text-negative-11 border border-negative-5 bg-negative-3">
                                  <p class="font-semibold">Something went wrong.</p>
                                </div>
                              </Match>
                              <Match when={mutationTxWaitCreateNewSong?.isSuccess}>
                                <div class="my-4 text-2xs rounded-md animate-appear p-3 text-positive-11 border border-positive-5 bg-positive-3">
                                  <p class="font-semibold">
                                    Your song was listed on the Superloud karaoke catalog successfully !
                                  </p>
                                </div>
                              </Match>
                            </Switch>
                          </div>
                          <button class="text-center p-2 text-accent-10 w-full text-[0.75rem]">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}

export default CreateNewSong
