import type { JSX } from 'solid-js'
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { IconClose } from '~/components/system/Icons'

interface PopoverVolumeProps {
  apiSlider: any
  children: JSX.Element
  popoverLabel: JSX.Element
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
      <button class="z-50" {...apiPopover().triggerProps}>
        {props.children}
      </button>
      <div {...apiPopover().positionerProps} class="z-30 bg-white shadow p-2 rounded-lg">
        <div class="flex items-center flex-col" {...apiPopover().contentProps}>
          <div class="sr-only" {...apiPopover().titleProps}>
            Track volume controls
          </div>
          <div class="sr-only" {...apiPopover().descriptionProps}>
            Control the volume of this track by moving the slider below.
          </div>
          <div class="animate-appear pb-2" {...props.apiSlider().rootProps}>
            <label class="sr-only" {...props.apiSlider().labelProps}>
              {props.popoverLabel}
            </label>
            <output class="text-[0.7rem] font-medium text-interactive-9 inline" {...props.apiSlider().outputProps}>
              {parseInt(props.apiSlider().value * 100)}%
            </output>
            <div class="pt-0.5 text-[0.7rem] w-7" {...props.apiSlider().controlProps}>
              <div class="rounded-md h-32 w-full bg-interactive-1" {...props.apiSlider().trackProps}>
                <div class="rounded-md w-full bg-interactive-5" {...props.apiSlider().rangeProps} />
              </div>
              <div class="w-full" {...props.apiSlider().thumbProps}>
                <input {...props.apiSlider().hiddenInputProps} />
              </div>
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
