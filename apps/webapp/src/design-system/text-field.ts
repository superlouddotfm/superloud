import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

// textual inputs (like textarea and text/number/url input)
export const textField = cva(
  [
    'appearance-none focus:outline-none',
    'border-solid',
    'focus:ring-2',
    'input overflow-hidden text-ellipsis placeholder:text-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      intent: {
        default: [
          'placeholder:text-accent-11 bg-accent-1 hover:bg-opacity-3.5 focus:bg-accent-12:bg-opacity-5  text-accent-12 border-accent-8',
        ],
        'pseudo-disabled':
          'placeholder:text-accent-12 bg-accent-12 text-accent-12 border-accent-12 opacity-50 pointer-events-none border-opacity-20 hover:border-opacity-20',
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
