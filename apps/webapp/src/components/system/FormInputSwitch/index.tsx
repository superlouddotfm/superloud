import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'

interface FormInputSwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  hasError: boolean
  scale?: 'sm' | 'default'
  label: JSX.Element
  helpText?: JSX.Element
  classLabel?: string
  classHelpText?: string
}

export const FormInputSwitch = (props: FormInputSwitchProps) => {
  const [local, inputProps] = splitProps(props, [
    'checked',
    'label',
    'helpText',
    'classLabel',
    'classHelpText',
    'scale',
  ])

  return (
    <>
      <div class="flex flex-col">
        <div class="flex relative items-center">
          <label for={inputProps?.name} class={`order-2 flex flex-col font-bold ${local?.classLabel ?? 'text-sm'}`}>
            <span class="pie-2 pis-8">{local?.label}</span>
          </label>
          <input type="checkbox" {...inputProps} class="peer appearance-none absolute z-10 w-full h-full" />
          <div
            class={`absolute inline-start-0 top-1/2 -translate-y-1/2 bg-neutral-4 peer-checked:bg-interactive-5  h-5  w-10 order-1 ${
              local?.scale !== 'sm' ? 'lg:h-6 lg:w-12' : ''
            } rounded-full`}
            aria-hidden="true"
          />

          <span
            aria-hidden="true"
            class={`peer-checked:translate-x-[1.4rem] lg:peer-checked:translate-x-6 translate-x-0.5
              ${local?.scale !== 'sm' ? 'lg:h-5 lg:w-5 ' : ''}  
              pointer-events-none inline-block h-4 w-4  transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
          />
        </div>
        {local?.helpText && (
          <span class={`text-neutral-11 pt-1 ${local?.classHelpText ?? 'text-2xs'}`}>{local?.helpText}</span>
        )}
      </div>
    </>
  )
}

export default FormInputSwitch
