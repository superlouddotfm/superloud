import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { IconClose } from '~/components/system/Icons'
import type { JSX } from 'solid-js'

interface PopoverVolumeProps {
  apiSlider: any
  children: JSX.Element
  popoverLabel: JSX.Element
  volume: number
}

export const PopoverVolume = (props: PopoverVolumeProps) => {
  // Popover
  const [statePopover, sendPopover] = useMachine(
    popover.machine({
      id: createUniqueId(),
    }),
  )
  const apiPopover = createMemo(() => popover.connect(statePopover, sendPopover, normalizeProps))
  return (
    <div class="relative">
      <button
        classList={{
          'text-neutral-6': apiPopover().isOpen === false,
          'text-interactive-10': apiPopover().isOpen === false,
        }}
        class="z-50"
        {...apiPopover().triggerProps}
      >
        {props.children}
      </button>
      <div
        {...apiPopover().positionerProps}
        class="z-30 bg-interactive-1 bg-opacity-50 backdrop-blur-xl shadow-xl border-accent-5 border p-2 rounded-lg"
      >
        <div class="flex items-center w-full flex-col" {...apiPopover().contentProps}>
          <div class="sr-only" {...apiPopover().titleProps}>
            Track volume controls
          </div>
          <div class="sr-only" {...apiPopover().descriptionProps}>
            Control the volume of this track by moving the slider below.
          </div>
          <div class="animate-appear pb-2 group" {...props.apiSlider().rootProps}>
            <label class="sr-only" {...props.apiSlider().labelProps}>
              {props.popoverLabel}
            </label>
            <output
              class="text-[0.7rem] font-medium text-interactive-11 inline pb-3"
              {...props.apiSlider().outputProps}
            >
              {parseInt(props.apiSlider().value)}%
            </output>
            <div {...props.apiSlider().controlProps} class="relative rounded-lg border border-interactive-7 rotate-180">
              <div {...props.apiSlider().trackProps} class="w-8 h-48">
                <div {...props.apiSlider().rangeProps} />
              </div>
              <div
                {...props.apiSlider().thumbProps}
                style={{
                  bottom: 'unset',
                  top: `${props.apiSlider().value}%`,
                }}
                class="focus:data-[part=thumb]:ring-2 left-0 rounded -translate-y-1/2 absolute w-full h-2 bg-white shadow z-30"
              >
                <input {...props.apiSlider().hiddenInputProps} />
              </div>
              <div
                class="absolute top-0 left-0 w-full pointer-events-none rounded-md bg-interactive-10"
                style={{
                  height: `${props.apiSlider().value}%`,
                }}
              />
            </div>
          </div>

          <button class="text-neutral-5 hover:text-neutral-6 focus:text-neutral-7" {...apiPopover().closeTriggerProps}>
            <span class="sr-only">Close</span>
            <IconClose class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopoverVolume
