import type { Accessor } from 'solid-js'
import { Switch, Match } from 'solid-js'
import {
  IconPlayBackwards,
  IconPause,
  IconPlay,
  IconPlayForwards,
  IconSpeakerWave,
  IconRecording,
} from '~/components/system/Icons'
import PopoverVolume from './PopoverVolume'

interface ControlsProps {
  time: {
    play: any
    pause: any
    api: any
  }
  vocals: {
    api: any
  }
  instrumental: {
    api: any
  }
  isPlaying: Accessor<boolean>
}

export const Controls = (props: ControlsProps) => {
  return (
    <>
      <div class="animate-appear pb-2" {...props.time.api().rootProps}>
        <label class="sr-only" {...props.time.api().labelProps}>
          Current timestamp
        </label>
        <output class="text-[0.7rem] font-medium text-interactive-9 inline" {...props.time.api().outputProps}>
          {parseInt(props.time.api().percent)}%
        </output>
        <div class="w-full h-1.5" {...props.time.api().controlProps}>
          <div class="rounded-md h-full w-full bg-interactive-1" {...props.time.api().trackProps}>
            <div class="rounded-md h-full bg-interactive-5" {...props.time.api().rangeProps} />
          </div>
          <div class="bg-white h-4 w-4 shadow z-10 relative" {...props.time.api().thumbProps}>
            <input {...props.time.api().hiddenInputProps} />
          </div>
        </div>
      </div>

      <div class="flex justify-center w-full items-center">
        <button>
          <IconPlayBackwards class="w-8 h-8" />
        </button>
        <button
          type="button"
          onClick={() => {
            props.isPlaying() ? props.time.pause() : props.time.play()
          }}
        >
          <Switch>
            <Match when={props.isPlaying() === true}>
              <IconPause class="h-10 w-10" />
            </Match>
            <Match when={props.isPlaying() === false}>
              <IconPlay class="h-10 w-10" />
            </Match>
          </Switch>
          <span class="sr-only">{props.isPlaying() === true ? 'Pause' : 'Play'}</span>
        </button>
        <button>
          <IconPlayForwards class="w-8 h-8" />
          <span class="sr-only">Advance 10 sec</span>
        </button>
      </div>
      <div class="">
        <PopoverVolume popoverLabel="Instrumental track volume" apiSlider={props.instrumental.api}>
          <IconSpeakerWave class="w-6 h-6" />
        </PopoverVolume>

        <PopoverVolume popoverLabel="Vocals track volume" apiSlider={props.vocals.api}>
          <span class="flex">
            <IconRecording class="w-6 h-6" />
            <IconSpeakerWave class="w-4 h-4" />
          </span>
        </PopoverVolume>
      </div>
    </>
  )
}
