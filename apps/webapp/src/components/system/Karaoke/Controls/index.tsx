import { Accessor } from 'solid-js'
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
    currentTime: Accessor<string>
    duration: Accessor<string>
  }
  vocals: {
    api: any
    stateMachine: any
  }
  instrumental: {
    api: any
    stateMachine: any
  }
  isPlaying: Accessor<boolean>
}

export const Controls = (props: ControlsProps) => {
  return (
    <div class="mx-auto max-w-screen-sm">
      <div class="animate-appear pb-2" {...props.time.api().rootProps}>
        <div class="flex justify-between pb-2">
          <label class="sr-only" {...props.time.api().labelProps}>
            Current time:
          </label>
          <output class="text-[0.7rem] font-medium text-interactive-11 inline" {...props.time.api().outputProps}>
            {props.time.currentTime()}
          </output>
          <span class="text-[0.7rem] font-medium text-accent-11 inline" {...props.time.api().outputProps}>
            <span class="sr-only">Duration:</span>
            {props.time.duration()}
          </span>
        </div>

        <div class="w-full h-1.5 relative" {...props.time.api().controlProps}>
          <div class="cursor-pointer rounded-md h-full w-full bg-interactive-4" {...props.time.api().trackProps}>
            <div {...props.time.api().rangeProps} class="rounded-md h-full bg-transparent" />
          </div>
          <div
            {...props.time.api().thumbProps}
            class="bg-white rounded-full h-5 w-5 shadow absolute top-1/2 -translate-y-1/2 z-10"
            style={{
              'inset-inline-start': `${
                (props.instrumental.stateMachine.currentTime / props.instrumental.stateMachine.duration) * 100
              }%`,
              left: 'unset !important',
            }}
          >
            <input {...props.time.api().hiddenInputProps} />
          </div>
          <div
            class="rounded-md h-full top-0 inline-start-0 bg-interactive-10 z-10 pointer-events-none absolute"
            style={{
              width: `${
                (props.instrumental.stateMachine.currentTime / props.instrumental.stateMachine.duration) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div class="max-w-40 2xs:max-w-64 xs:max-w-72 justify-between flex mx-auto w-full items-center">
        <button>
          <IconPlayBackwards class="text-neutral-6 w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => {
            props.isPlaying() ? props.time.pause() : props.time.play()
          }}
        >
          <Switch>
            <Match when={props.isPlaying() === true}>
              <IconPause class="h-8 w-8" />
            </Match>
            <Match when={props.isPlaying() === false}>
              <IconPlay class="h-8 w-8" />
            </Match>
          </Switch>
          <span class="sr-only">{props.isPlaying() === true ? 'Pause' : 'Play'}</span>
        </button>
        <button>
          <IconPlayForwards class="w-6 h-6 text-neutral-6" />
          <span class="sr-only">Advance 10 sec</span>
        </button>
      </div>
      <div class="flex justify-between">
        <PopoverVolume
          volume={props.instrumental.stateMachine.volume}
          popoverLabel="Instrumental track volume"
          apiSlider={props.instrumental.api}
        >
          <IconSpeakerWave class="w-5 h-5 " />
        </PopoverVolume>

        <PopoverVolume
          volume={props.vocals.stateMachine.volume}
          popoverLabel="Vocals track volume"
          apiSlider={props.vocals.api}
        >
          <span class="flex items-baseline ">
            <IconRecording class="w-5 h-5" />
            <IconSpeakerWave class="w-4 h-4" />
          </span>
        </PopoverVolume>
      </div>
    </div>
  )
}
