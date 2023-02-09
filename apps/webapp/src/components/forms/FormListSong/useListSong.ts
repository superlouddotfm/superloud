import { createMutation } from '@tanstack/solid-query'
import { createOrEditSongSchema as schema } from '~/schemas/create-or-edit-song'
import { z } from 'zod'

interface FormValues extends z.infer<typeof schema> {}

export function useListSong() {
  const mutationCreateNewSong = createMutation(async (values) => {})

  const mutationEditSong = createMutation(async (values) => {})

  async function onSubmitNewSong(args: { formValues: FormValues }) {}

  async function onSubmitEditSong(args: { formValues: FormValues }) {}
  return {
    onSubmitNewSong,
    onSubmitEditSong,
  }
}

export default useListSong
