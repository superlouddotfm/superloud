import { FormListSong, useForm, useListSong, createOrEditSongSchema } from '~/components/forms/FormListSong'
import { z } from 'zod'

export const CreateNewSong = () => {
  const { onSubmitNewSong } = useListSong()
  const { formListSong } = useForm({
    initialValues: {
      is_listed: true,
      title: '',
    },
    onSubmit: (values: z.infer<typeof createOrEditSongSchema>) => {
      onSubmitNewSong({
        formValues: values,
      })
    },
  })
  return (
    <>
      <FormListSong storeForm={formListSong} />
    </>
  )
}

export default CreateNewSong
