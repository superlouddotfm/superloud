import { Match, Show, Switch, createMemo } from 'solid-js'
import { AudioState } from '@solid-primitives/audio'
import { Lyrics, Controls, useKaraokeControls } from '~/components/system/Karaoke'
import Button from '~/components/system/Button'
import { Portal } from 'solid-js/web'
import { normalizeProps, useMachine } from '@zag-js/solid'
import * as accordion from '@zag-js/accordion'
import { useSearchParams } from 'solid-start'
import { IconDoubleChevronDown } from '~/components/system/Icons'
import { createQuery } from '@tanstack/solid-query'

interface PlayKaraokeProps {
  song: {
    url_isolated_vocal_track: string
    url_isolated_instrumental_track: string
    url_lrc: string
  }
}

export const PlayKaraoke = (props: PlayKaraokeProps) => {
  const {
    mutationCreateSessionAudioReplay,
    livestream: { mutationCreateLivepeerStream },
    recorder: { apiDialogSession, apiPopoverRecorder, mutationPermissions, start, isRecording, permissions, audio },
    isPlaying,
    time,
    instrumental,
    vocals,
    lyrics,
  } = useKaraokeControls({
    isPlaying: false,
    time: {
      disableControls: false,
      initialValue: 0,
    },
    vocals: {
      uriFile: props.song.url_isolated_vocal_track,
      disableControls: false,
      volume: {
        disableControls: false,
        initialValue: 0,
      },
    },
    instrumental: {
      uriFile: props.song.url_isolated_instrumental_track,
      volume: {
        disableControls: false,
        initialValue: 1,
      },
    },
    lyrics: {
      display: true,
      uriFile: props.song.url_lrc,
    },
    recording: {
      shouldRecord: true,
      disableControls: false,
    },
  })
  const [searchParams, setSearchParams] = useSearchParams()

  // Livestream UI
  const [stateAccordionLivestream, sendAccordionLivestream] = useMachine(
    accordion.machine({ id: '1', collapsible: true }),
  )
  const apiAccordionLivestream = createMemo(() =>
    accordion.connect(stateAccordionLivestream, sendAccordionLivestream, normalizeProps),
  )
  // Query for playback video
  const queryPlaybackVideo = createQuery(
    () => [`playback`, searchParams?.playbackId],
    async () => {
      try {
        const response = await fetch(`https://livepeer.studio/api/playback/${searchParams?.playbackId}`)
        const result = await response.json()
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      get enabled() {
        return searchParams?.playbackId && !searchParams?.streamId && !isRecording() ? true : false
      },
    },
  )

  return (
    <div class="flex flex-col flex-grow max-w-prose w-full mx-auto pt-12">
      <h1 class="text-start xs:text-center text-2xl text-neutral-9 font-bold mb-1">Ready to rock ?</h1>
      <p class="text-start xs:text-center text-xs mt-2 mb-4 text-neutral-7 font-medium">
        It's your time to shine with "{props.song.original_song_title}" by{' '}
        <span class="text-primary-11">{props.song.original_song_artist_name}</span> on Superloud.
      </p>

      <div class="mb-4" {...apiAccordionLivestream().rootProps}>
        <div {...apiAccordionLivestream().getItemProps({ value: 'livestream' })}>
          <button
            classList={{
              'rounded-b-none': apiAccordionLivestream().value === 'livestream',
            }}
            class="rounded-md flex items-center text-start w-full text-2xs font-bold p-3 bg-accent-1 border-accent-5 border text-accent-12"
            {...apiAccordionLivestream().getTriggerProps({ value: 'livestream' })}
          >
            <Show when={!searchParams?.streamId}>Want to livestream your performance ?</Show>
            <Show when={searchParams?.streamId}>Your livestream</Show>
            <IconDoubleChevronDown
              classList={{
                'rotate-180': apiAccordionLivestream().value === 'livestream',
              }}
              class="mis-auto pis-1ex text-accent-9 w-6 h-6 transition-all"
            />
          </button>
          <div
            class="text-2xs border bg-accent-1 border-t-0 border-accent-5 rounded-b-md"
            {...apiAccordionLivestream().getContentProps({ value: 'livestream' })}
          >
            <ol class="pis-6 pie-2 py-4 space-y-2 list-decimal">
              <li>Get a compatible app on your phone (Larix Broadcaster etc. ...)</li>
              <Show when={!searchParams?.streamId}>
                <li>
                  Generate your stream key:{' '}
                  <Button
                    class="!text-[0.75rem] !px-2"
                    disabled={
                      mutationCreateLivepeerStream.isLoading ||
                      searchParams?.streamId ||
                      mutationCreateLivepeerStream?.data?.streamId
                    }
                    onClick={async () => {
                      await mutationCreateLivepeerStream.mutateAsync(`${props.song.title} - My karaoke session`)
                    }}
                    scale="xs"
                    intent="neutral-on-light-layer"
                  >
                    Generate key
                  </Button>
                </li>
              </Show>
              <li>
                In the settings of your app, add{' '}
                <code class="font-mono text-interactive-11">rtmp://rtmp.livepeer.com/live</code> as the{' '}
                <strong class="text-secondary-11 bg-secondary-3">RTMP ingest URL</strong> and
                <span class="font-mono text-interactive-11">
                  <Switch fallback={' your stream key '}>
                    <Match when={searchParams?.streamId}>{searchParams?.streamId}</Match>
                  </Switch>
                </span>
                &nbsp; in the <strong class="text-secondary-11 bg-secondary-3">Stream key</strong> value.
              </li>
              <li>Go live and enjoy yourself !</li>
              <li>Your livestream will automatically finish once the song finishes.</li>
            </ol>
            <Show when={searchParams?.playbackId}>
              <div class="p-4">
                <iframe
                  class="w-full aspect-video"
                  src={`https://lvpr.tv?v=${searchParams?.playbackId}`}
                  allowfullscreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                ></iframe>
                <a
                  rel="nofollow noreferrer"
                  href={`https://https://lvpr.tv/${searchParams?.playbackId}`}
                  class="link py-6 text-center"
                >
                  Open livestream in a new tab
                </a>
              </div>
            </Show>
          </div>
        </div>
      </div>

      <Switch>
        <Match
          when={
            lyrics.loaded() === false ||
            instrumental.stateMachine.state === AudioState.LOADING ||
            vocals.stateMachine.state === AudioState.LOADING
          }
        >
          <div class="flex items-center m-auto justify-center gap-3 text-neutral-7 animate-appear">
            <p class="animate-pulse font-bold">Loading files for the session, one moment...</p>
          </div>
        </Match>
        <Match when={lyrics.loaded() === true}>
          <Switch>
            <Match when={instrumental.stateMachine.state === AudioState.READY}>
              <div class="rounded-md m-auto flex flex-col space-y-3 items-center px-6 py-3 justify-center bg-accent-3 ">
                <p class="text-2xs text-start xs:text-center text-accent-11">
                  Pro tip: to record the best karaoke session possible, wear headphones if you can !
                </p>
                <p class="font-semibold  text-start xs:text-center mb-3">
                  Before starting, please make sure to activate and test your microphone !
                </p>
                <Switch>
                  <Match when={permissions?.mic() !== 'granted'}>
                    <Button
                      scale="xs"
                      intent="neutral-on-light-layer"
                      onClick={() =>
                        mutationPermissions.mutateAsync({
                          audio: true,
                          video: false,
                        })
                      }
                    >
                      Activate mic
                    </Button>
                  </Match>
                  <Match when={!audio?.constraints()}>
                    <Button
                      scale="xs"
                      intent="neutral-on-light-layer"
                      onClick={() => audio?.setConstraints({ audio: true })}
                      title="We need user interaction to run an audio context"
                    >
                      Test mic
                    </Button>
                  </Match>

                  <Match when={!isRecording() && audio?.constraints()}>
                    <Button scale="xs" class="shadow-lg" onClick={start}>
                      I'm all set up, let's sing !
                    </Button>
                  </Match>
                </Switch>
              </div>
            </Match>

            <Portal>
              <div
                {...apiPopoverRecorder().positionerProps}
                classList={{
                  'top-14 !left-1/2 !-translate-x-1/2 !opacity-100':
                    audio?.constraints() && permissions?.mic() === 'granted',
                }}
              >
                <div
                  {...apiPopoverRecorder().contentProps}
                  class="px-2 pt-2 pb-3 flex flex-col bg-accent-12 text-accent-1 shadow-2xl rounded-md"
                >
                  <div class="sr-only" {...apiPopoverRecorder().titleProps}>
                    Mic recorder controls
                  </div>
                  <Show when={isRecording()}>
                    <p class="animate-pulse text-2xs font-bold text-accent-7">Recording in progress...</p>
                  </Show>
                  <Show when={audio?.constraints()}>
                    <p class="mb-1 text-[0.75rem] text-accent-8">Your mic level: </p>
                    <meter min="0" max="100" value={audio?.level()} />
                  </Show>

                  <Show when={apiDialogSession().isOpen}>
                    <Portal>
                      <div
                        class="bg-accent-12 fixed inset-0 w-full h-full z-50 bg-opacity-75"
                        {...apiDialogSession().backdropProps}
                      />
                      <div
                        class="px-2 sm:px-4 inset-0 flex items-center justify-center h-screen w-screen fixed z-50"
                        {...apiDialogSession().containerProps}
                      >
                        <div
                          class="max-w-[calc(100vw-1rem)] sm:max-w-screen-xs rounded-md bg-accent-1 shadow-2xl"
                          {...apiDialogSession().contentProps}
                        >
                          <h2
                            class="border-b border-accent-4 text-start xs:text-center px-4 py-3 text-md font-bold text-accent-12"
                            {...apiDialogSession().titleProps}
                          >
                            That's a wrap !
                          </h2>
                          <div class="px-3 pt-6 pb-6">
                            <p
                              class="font-bold text-neutral-7 text-start xs:text-center text-xs"
                              {...apiDialogSession().descriptionProps}
                            >
                              Your karaoke session was recorded - you can listen to your session below !
                            </p>
                            <Show when={true}>
                              <div class="flex flex-col items-center bg-accent-3 p-6 rounded-md mt-3">
                                <p class="text-2xs mb-4 uppercase font-bold text-accent-10 tracking-widest">
                                  Your vocal track:{' '}
                                </p>

                                <audio src={audio?.recorded()} controls />

                                <div class="mt-4 flex flex-col gap-3">
                                  <Button
                                    class="mx-auto w-full xs:w-fit-content"
                                    intent="primary-outline"
                                    type="button"
                                    isLoading={mutationCreateSessionAudioReplay.isLoading}
                                    scale="xs"
                                    onClick={async () => await mutationCreateSessionAudioReplay.mutateAsync()}
                                  >
                                    Merge vocal track with instrumental track
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      let link = document.createElement('a')
                                      link.href = audio?.recorded()
                                      link.download = 'karaoke_session_vocals_only'

                                      // this is necessary as link.click() does not work on the latest firefox
                                      link.dispatchEvent(
                                        new MouseEvent('click', {
                                          bubbles: true,
                                          cancelable: true,
                                          view: window,
                                        }),
                                      )
                                    }}
                                    class="mb-4 mx-auto w-full xs:w-fit-content"
                                    intent="primary-outline"
                                    type="button"
                                    scale="xs"
                                  >
                                    Download vocal track
                                  </Button>

                                  <Switch>
                                    <Match when={mutationCreateSessionAudioReplay.isError}>
                                      <p class="text-start xs:text-center text-xs font-bold text-negative-9">
                                        Something went wrong.
                                      </p>
                                    </Match>
                                    <Match when={mutationCreateSessionAudioReplay.isLoading}>
                                      <p class="text-start xs:text-center text-xs animate-pulse font-bold">
                                        Creating audio replay please wait...
                                      </p>
                                    </Match>
                                    <Match when={mutationCreateSessionAudioReplay.isSuccess}>
                                      <p class="pb-3 text-xs text-start xs:text-center">
                                        Your vocal track and the instrumental tracks were merged successfully ! Check it
                                        out below :
                                      </p>

                                      <p class="text-2xs text-start xs:text-center mt-4 mb-1 uppercase font-bold text-accent-10 tracking-widest">
                                        Your complete karaoke session:{' '}
                                      </p>
                                      <audio src={mutationCreateSessionAudioReplay?.data?.url} controls />
                                      <Button
                                        onClick={() => {
                                          let link = document.createElement('a')
                                          link.href = mutationCreateSessionAudioReplay.data?.url
                                          link.download = 'karaoke_session_complete'

                                          // this is necessary as link.click() does not work on the latest firefox
                                          link.dispatchEvent(
                                            new MouseEvent('click', {
                                              bubbles: true,
                                              cancelable: true,
                                              view: window,
                                            }),
                                          )
                                        }}
                                        class="mt-2 mx-auto w-full xs:w-fit-content"
                                        type="button"
                                        scale="sm"
                                      >
                                        Download merged session
                                      </Button>
                                    </Match>
                                  </Switch>
                                </div>
                              </div>
                            </Show>
                          </div>

                          <button
                            class="border-t border-accent-4 w-full uppercase font-bold text-[0.75rem] text-accent-9 p-4 tracking-widest"
                            {...apiDialogSession().closeTriggerProps}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </Portal>
                  </Show>
                </div>
              </div>
            </Portal>

            <Show when={[AudioState.PLAYING, AudioState.PAUSED].includes(instrumental.stateMachine.state)}>
              <Portal>
                <div class="animate-appear border-t border-accent-5 fixed z-30 bottom-0 left-0 bg-white py-2 w-full">
                  <Controls isPlaying={isPlaying} time={time} vocals={vocals} instrumental={instrumental} />
                </div>
              </Portal>
            </Show>
          </Switch>
          <div
            classList={{
              blur: ![AudioState.PLAYING, AudioState.COMPLETE, AudioState.STOPPED].includes(
                instrumental.stateMachine.state,
              ),
            }}
            class="py-8"
          >
            <Lyrics lyrics={lyrics} isKaraokePlaying={isPlaying()} />
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default PlayKaraoke
