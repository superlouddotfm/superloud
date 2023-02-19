import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { createKaraokeChallengeSchema as schema } from '~/schemas/create-karaoke-challenge'
import { z } from 'zod'
import { normalizeProps, useMachine } from '@zag-js/solid'
import * as accordion from '@zag-js/accordion'
import { createMemo, createUniqueId } from 'solid-js'

export function useForm(args: {
  onSubmit: (values: z.infer<typeof schema>) => void
  initialValues: z.infer<typeof schema>
}): {
  formCreateNewChallenge: any
  stateMachineAccordion: any
} {
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: args.onSubmit,
    extend: validator({ schema }),
    initialValues: args?.initialValues,
  })
  const [stateAccordion, sendAccordion] = useMachine(
    accordion.machine({
      collapsible: true,
      id: createUniqueId(),
      value: ['about'],
    }),
  )
  const apiAccordion = createMemo(() => accordion.connect(stateAccordion, sendAccordion, normalizeProps))

  return {
    formCreateNewChallenge: storeForm,
    stateMachineAccordion: apiAccordion,
  }
}
