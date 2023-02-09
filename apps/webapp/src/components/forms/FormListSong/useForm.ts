import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { createOrEditSongSchema as schema } from '~/schemas/create-or-edit-song'
import { z } from 'zod'

export function useForm(args: {
  onSubmit: (values: z.infer<typeof schema>) => void
  initialValues: z.infer<typeof schema>
}): {
  formListSong: any
} {
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: args.onSubmit,
    extend: validator({ schema }),
    initialValues: args?.initialValues,
  })

  return {
    formListSong: storeForm,
  }
}
