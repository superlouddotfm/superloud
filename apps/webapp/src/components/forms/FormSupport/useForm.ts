import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { supportSchema as schema } from '~/schemas/support'
import { z } from 'zod'

export function useForm(args: {
  onSubmit: (values: z.infer<typeof schema>) => void
  initialValues: z.infer<typeof schema>
}): {
  formSupport: any
} {
  // Form state manager
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: args.onSubmit,
    extend: validator({ schema }),
    initialValues: args?.initialValues,
  })

  return {
    formSupport: storeForm,
  }
}
