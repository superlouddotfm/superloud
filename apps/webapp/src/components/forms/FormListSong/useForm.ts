import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { createOrEditSongSchema as schema } from '~/schemas/create-or-edit-song'
import { z } from 'zod'
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/solid'
import * as accordion from '@zag-js/accordion'
import { createEffect, createMemo, createUniqueId } from 'solid-js'

export function useForm(args: {
  onSubmit: (values: z.infer<typeof schema>) => void
  initialValues: z.infer<typeof schema>
}): {
  formListSong: any
  stateMachineAccordion: any
  stateMachineTabs: any
} {
  // Form state manager
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: args.onSubmit,
    extend: validator({ schema }),
    initialValues: args?.initialValues,
  })

  // Tabs state machine
  // To manage whether to show the karaoke preview or not
  const [stateTabs, sendTabs] = useMachine(
    tabs.machine({
      id: createUniqueId(),

      value: 'upload-files', // 'karaoke-preview' , 'upload-files'
    }),
  )
  const apiTabs = createMemo(() => tabs.connect(stateTabs, sendTabs, normalizeProps))

  // Accordion state machine
  // To manage the current step in the form
  const [stateAccordion, sendAccordion] = useMachine(
    accordion.machine({
      id: createUniqueId(),
      value: ['source'], // 'source', 'info', 'files'
    }),
  )
  const apiAccordion = createMemo(() => accordion.connect(stateAccordion, sendAccordion, normalizeProps))

  // When karaoke tab is open, scroll to the top element of the preview
  createEffect(() => {
    if (apiTabs().value === 'karaoke-preview') {
      const element = apiTabs().getContentProps({ value: 'karaoke-preview' }).id
      //@ts-ignore
      document.getElementById(`${element}`).scrollIntoView()
    }
  })

  return {
    formListSong: storeForm,
    stateMachineAccordion: apiAccordion,
    stateMachineTabs: apiTabs,
  }
}
