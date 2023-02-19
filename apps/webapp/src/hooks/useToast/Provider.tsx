import { useActor, useMachine, normalizeProps } from '@zag-js/solid'
import * as toast from '@zag-js/toast'
import { createMemo, createUniqueId, createContext, For } from 'solid-js'

export const Toast = (props: any) => {
  const [state, send] = useActor(props.actor)
  const api = createMemo(() => toast.connect(state, send, normalizeProps))

  return (
    <div class="p-2 max-w-72 w-full text-sm shadow-xl rounded-md border animate-appear" {...api().rootProps}>
      <h3 class="font-bold" {...api().titleProps}>
        {api().title}
      </h3>
      <p {...api().descriptionProps}>{api().description}</p>
      <button onClick={api().dismiss}>Close</button>
    </div>
  )
}

export const ToastContext = createContext()

export const ToastProvider = (props: any) => {
  const [state, send] = useMachine(toast.group.machine({ id: createUniqueId() }))

  const api = createMemo(() => toast.group.connect(state, send, normalizeProps))

  return (
    <ToastContext.Provider value={api}>
      <For each={Object.entries(api().toastsByPlacement)}>
        {([placement, toasts]) => (
          <div key={placement} {...api().getGroupProps({ placement })}>
            <For each={toasts}>{(toast) => <Toast key={toast.id} actor={toast} />}</For>
          </div>
        )}
      </For>

      {props.children}
    </ToastContext.Provider>
  )
}
