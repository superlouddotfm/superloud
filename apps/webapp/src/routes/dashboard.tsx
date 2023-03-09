import { debounce } from '@solid-primitives/scheduled'
import { createQuery } from '@tanstack/solid-query'
import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'
import getSenderActiveStreams from '~/services/superfluid/getSenderActiveStreams'
import { useAuthentication } from '~/hooks/useAuthentication'
import { useNavigate } from 'solid-start'
import { OnRampStripe } from '~/components/_pages/Account/OnRampStripe'
import { Identity } from '~/components/_pages/Account//Identity'

export default function Page() {
  const navigate = useNavigate()
  const { currentUser } = useAuthentication()

  const queryStreamsSender = createQuery(
    () => ['streams-sender', currentUser()?.address],
    async () => {
      try {
        const result = await getSenderActiveStreams({
          sender: currentUser()?.address,
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
    },
  )

  createEffect(() => {
    if (!currentUser()?.address) {
      navigate('/sign-in')
    }
  })

  return (
    <div class="flex flex-col flex-grow pt-12">
      <div class="max-w-prose w-full mx-auto px-4">
        <h1 class="text-start xs:text-center text-2xl text-neutral-9 font-bold mb-1">Dashboard</h1>
      </div>
      <main>
        <div class="pt-10 max-w-prose w-full mx-auto px-4">
          <Identity />
          <OnRampStripe />
        </div>
      </main>
    </div>
  )
}
