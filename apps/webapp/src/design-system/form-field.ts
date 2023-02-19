import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const formFieldLabel = cva(['flex text-[1.015em] font-bold items-center'], {
  variants: {
    intent: {
      default: ['text-neutral-12'],
    },
    scale: {
      default: ['leading-loose'],
    },
  },
  defaultVariants: {
    intent: 'default',
    scale: 'default',
  },
})

export type SystemUiFormFieldProps = VariantProps<typeof formFieldLabel>
