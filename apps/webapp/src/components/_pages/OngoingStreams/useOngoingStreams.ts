import { createQuery } from '@tanstack/solid-query'
import { getSenderActiveStreams, getReceiverActiveStreams } from '~/services/superfluid'
import { useAuthentication } from '~/hooks/useAuthentication'
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'

export function useOngoingStreams() {
  const { currentUser } = useAuthentication()
  const [stateTabs, sendTabs] = useMachine(tabs.machine({ id: createUniqueId(), value: 'sender' }))
  const apiTabsStreams = createMemo(() => tabs.connect(stateTabs, sendTabs, normalizeProps))

  const queryStreamsSender = createQuery(
    () => ['streams-sender', currentUser()?.address],
    async () => {
      try {
        const result = await getSenderActiveStreams({
          address: currentUser()?.address,
        })

        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      get enabled() {
        return currentUser()?.address ? true : false
      },
      select: async (data) => data?.data ?? data,
    },
  )

  const queryStreamsReceiver = createQuery(
    () => ['streams-receiver', currentUser()?.address],
    async () => {
      try {
        const result = await getReceiverActiveStreams({
          address: currentUser()?.address,
        })

        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      get enabled() {
        return currentUser()?.address ? true : false
      },
      select: (data) => data?.data ?? data,
    },
  )

  return {
    queryStreamsSender,
    queryStreamsReceiver,
    apiTabsStreams,
  }
}

export default useOngoingStreams
