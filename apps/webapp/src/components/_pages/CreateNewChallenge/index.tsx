import {
  FormNewChallenge,
  createKaraokeChallengeSchema,
  useCreateChallenge,
  useForm,
} from '~/components/forms/FormNewChallenge'
import { z } from 'zod'

export const CreateNewChallenge = () => {
  const { onSubmitNewChallenge } = useCreateChallenge()
  const { formCreateNewChallenge, stateMachineAccordion } = useForm({
    //@ts-ignore
    initialValues: {},
    onSubmit: (values: z.infer<typeof createKaraokeChallengeSchema>) => {
      onSubmitNewChallenge({
        formValues: values,
      })
    },
  })
  return (
    <>
      <div class="w-full max-w-prose mx-auto ">
        <h1 class="text-2xl text-neutral-9 font-bold">Create new challenge</h1>
        <div class="space-y-1 text-xs mt-2 mb-4 text-neutral-7 font-medium">
          <p>Challenges are a fun way to connect with your fandom.</p>
          <p>All you need to do is to configure the rules of your challenge and define a prize for the winner?</p>
        </div>
        <FormNewChallenge apiAccordion={stateMachineAccordion} storeForm={formCreateNewChallenge} />
      </div>
    </>
  )
}

export default CreateNewChallenge
