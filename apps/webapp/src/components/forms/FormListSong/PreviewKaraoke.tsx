import type { KaraokeScreenProps } from '~/components/system/Karaoke'
import { Match, Show, Switch } from 'solid-js'
import { AudioState } from '@solid-primitives/audio'
import { Lyrics, Controls, useKaraokeControls } from '~/components/system/Karaoke'
import { IconSpinner } from '~/components/system/Icons'
import { Portal } from 'solid-js/web'

export const PreviewKaraoke = (props: KaraokeScreenProps) => {
  const { isPlaying, time, instrumental, vocals, lyrics } = useKaraokeControls(props.configKaraokeControls)
  return (
    <>
      <Switch>
        <Match
          when={
            lyrics.loaded() === false ||
            instrumental.stateMachine.state === AudioState.LOADING ||
            vocals.stateMachine.state === AudioState.LOADING
          }
        >
          <div class="flex items-center gap-3 text-neutral-7 animate-appear">
            <IconSpinner class="text-md" />
            <p class="animate-pulse">Loading files for the session, one moment...</p>
          </div>
        </Match>
        <Match when={lyrics.loaded() === true}>
          <Portal>
            <div class="animate-appear border-t border-accent-5 fixed z-30 bottom-0 left-0 bg-white py-2 w-full">
              <Controls isPlaying={isPlaying} time={time} vocals={vocals} instrumental={instrumental} />
            </div>
          </Portal>
          <Show when={props.configKaraokeControls.lyrics.display === true}>
            {/* @ts-ignore */}
            <Lyrics lyrics={lyrics} isKaraokePlaying={isPlaying()} />
          </Show>
        </Match>
      </Switch>
    </>
  )
}

export default PreviewKaraoke
