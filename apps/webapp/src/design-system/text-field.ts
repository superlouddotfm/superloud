import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// textual inputs (like textarea and text/number/url input)
export const textField = cva(
  [
    'appearance-none focus:outline-none',
    'border-solid border-opacity-10 disabled:border-opacity-20 disabled:hover:border-opacity-20 hover:border-opacity-25 focus:border-opacity-25',
    'bg-opacity-3.5 focus:bg-opacity-7.5',
    'input overflow-hidden text-ellipsis placeholder:text-opacity-30',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      intent: {
        default: ['placeholder:text-neutral-8 bg-neutral-3 text-neutral-10 border-neutral-8'],
        'pseudo-disabled':
          'placeholder:text-neutral-8 bg-neutral-2 text-neutral-10 border-neutral-4 opacity-50 pointer-events-none border-opacity-20 hover:border-opacity-20',
        error: ['input--invalid'],
      },
      scale: {
        default: ['px-3 py-1 text-sm', 'border'],
        sm: ['px-3 py-0.5 text-xs', 'border'],
        md: ['px-4 py-1.5 text-md', 'border'],
      },
      appearance: {
        square: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      intent: 'default',
      scale: 'default',
      appearance: 'square',
    },
  },
)

export type SystemUiTextFieldProps = VariantProps<typeof textField>

export default textField
