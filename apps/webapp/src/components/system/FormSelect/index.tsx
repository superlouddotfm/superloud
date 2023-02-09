import { textField } from '~/design-system/text-field'
import type { SystemUiTextFieldProps } from '~/design-system/text-field'
import styles from './styles.module.css'

import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'

interface FormSelectProps extends SystemUiTextFieldProps, JSX.SelectHTMLAttributes<HTMLSelectElement> {
  hasError: boolean
  classInput?: string
}

export const FormSelect = (props: FormSelectProps) => {
  const [local, inputProps] = splitProps(props, [
    'hasError',
    'children',
    'appearance',
    'class',
    'classInput',
    'intent',
    'scale',
  ])

  return (
    <div class={`${local?.class ?? ''} relative`}>
      <select
        class={`w-full ${textField({
          appearance: local.appearance ?? 'square',
          scale: local.scale ?? 'default',
          variant: local.hasError === true ? 'error' : 'default',
          //@ts-ignore
          class: `pie-10 ${local?.classInput ?? ''}`,
        })} [&>option]:bg-neutral-5 &[>option]:p-2 `}
        {...inputProps}
      >
        {local.children}
      </select>
      <div
        class={`${styles.indicator} absolute inline-end-0 top-0 aspect-square rounded-ie-md h-full z-10 pointer-events-none bg-neutral-12 bg-opacity-5 border-is border-neutral-12 border-opacity-10`}
      />
    </div>
  )
}

export default FormSelect
