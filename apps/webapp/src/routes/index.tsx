import { createEffect, Match, Show, Switch } from 'solid-js'
import { A } from 'solid-start'
import Counter from '~/components/Counter'
import Button from '~/components/system/Button'

export default function Home() {
  /*
  const {
    mutationPermissions,
    recorder: { start, stop, isRecording, permissions, audio },
  } = useKaraokeSession()

  */
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      {/*      <Switch>
        <Match when={permissions?.mic() !== 'granted'}>
          <div class="animate-appear bg-interactive-3 text-interactive-11">
            <p>Activate your microphone to start your karaoke session</p>
            <Button
              onClick={() =>
                mutationPermissions.mutateAsync({
                  audio: true,
                  video: false,
                })
              }
            >
              Activate mic
            </Button>
          </div>
        </Match>
        <Match when={permissions?.mic() === 'granted'}>
          <div>
            Test your microphone below and click on "Start recording" when you're ready to play !
            <Show
              when={audio?.constraints()}
              fallback={
                <button
                  onClick={() => audio?.setConstraints({ audio: true })}
                  title="We need user interaction to run an audio context"
                >
                  Click to start amplitude level
                </button>
              }
            >
              <meter min="0" max="100" value={audio?.level()} />
            </Show>
          </div>

          <div class="flex space-i-4">
            <Switch>
              <Match when={isRecording() === true}>
                <Button onClick={stop} scale="sm">
                  Stop recording
                </Button>
              </Match>
              <Match when={isRecording() === false}>
                <Button onClick={start} scale="sm">
                  Start recording
                </Button>
              </Match>
            </Switch>
          </div>
          <Show when={isRecording() === true}>
            <p class="animate-pulse font-bold">Recording in progress...</p>
          </Show>
        </Match>
      </Switch>

      <Show when={audio?.recorded() !== null}>
        <audio src={audio?.recorded()} controls />
            </Show>*/}
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Hello world!</h1>
      <Counter />
      <p class="mt-8">
        Visit{' '}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <span>Home</span>
        {' - '}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{' '}
      </p>
    </main>
  )
}
