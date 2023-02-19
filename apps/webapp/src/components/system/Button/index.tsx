import { IconSpinner } from '~/components/system/Icons'
import button from '~/design-system/call-to-action'
import type { SystemUiCTAProps } from '~/design-system/call-to-action'
import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'

export interface ButtonProps extends SystemUiCTAProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export const Button = (props: ButtonProps) => {
  const [local, buttonProps] = splitProps(props, ['children', 'isLoading', 'class', 'intent', 'scale'])
  return (
    <button
      class={button({
        intent: local.intent ?? 'primary',
        scale: local.scale ?? 'default',
        class: local.class ?? '',
      })}
      aria-disabled={buttonProps.disabled || local.isLoading === true}
      {...buttonProps}
    >
      {local.isLoading && (
        <IconSpinner
          classList={{
            'mie-1ex': local?.class?.includes('rounded-full'),
          }}
          class="animate-spin"
        />
      )}
      {local.children}
    </button>
  )
}

export default Button
