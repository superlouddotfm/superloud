import { createQuery } from '@tanstack/solid-query'
import { fetchBalance } from '@wagmi/core'
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createEffect, createMemo, createUniqueId, Match, Show, Switch } from 'solid-js'
import Button from '~/components/system/Button'
import shortenEthereumAddress from '~/helpers/shortenEthereumAddress'
import { useAuthentication } from '~/hooks/useAuthentication'

export const MenuCurrentUser = () => {
  const { currentUser, mutationDisconnect } = useAuthentication()
  const [state, send] = useMachine(menu.machine({ id: createUniqueId(), 'aria-label': 'User actions' }))

  const api = createMemo(() => menu.connect(state, send, normalizeProps))

  const queryTokenBalance = createQuery(
    () => ['user-balance', currentUser()?.address],
    async () => {
      try {
        const balance = await fetchBalance({
          address: currentUser()?.address,
        })

        return balance
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
    if (mutationDisconnect.isSuccess && !currentUser() && api().isOpen) {
      api().close()
    }
  })
  return (
    <div>
      <Button class="pointer-events-auto" intent="neutral-outline" scale="xs" {...api().triggerProps}>
        <Switch>
          <Match when={currentUser()?.name && currentUser()?.name !== ''}>{currentUser()?.name}</Match>
          <Match when={currentUser()?.email && currentUser()?.email !== ''}>{currentUser()?.email}</Match>
          <Match when={currentUser()?.address && currentUser()?.address !== ''}>
            {shortenEthereumAddress(currentUser()?.address)}
          </Match>
        </Switch>

        <span
          class=" mis-1ex"
          classList={{
            'rotate-180': api().isOpen === true,
          }}
          aria-hidden
        >
          ▾
        </span>
      </Button>
      <div {...api().positionerProps} class="w-full max-w-48 pointer-events-auto">
        <div
          {...api().contentProps}
          class="text-2xs shadow-md overflow-hidden bg-white border border-accent-5 rounded-md"
        >
          <div class="px-3 py-1.5 border-b border-accent-4">
            <span class="text-[0.725rem] font-medium text-neutral-5">Logged in as :</span>
            <span class="block overflow-hidden text-ellipsis text-[0.7rem] text-neutral-7">
              <Show when={currentUser()?.address && currentUser()?.address !== ''}>
                {shortenEthereumAddress(currentUser()?.address)}
              </Show>
            </span>
            <Show when={queryTokenBalance?.isSuccess && queryTokenBalance?.data?.formatted}>
              <div class="pt-1 text-[0.75rem]">
                <span class="text-primary-12">Balance:&nbsp;</span>
                <span class="font-bold text-primary-10">
                  {parseFloat(queryTokenBalance?.data?.formatted).toFixed(5)} {queryTokenBalance?.data?.symbol}
                </span>
              </div>
            </Show>
          </div>
          <button
            {...api().getItemProps({ id: 'logout' })}
            class="data-[focus]:text-interactive-12 data-[focus]:bg-interactive-3 cursor-pointer py-1.5 px-3 text-start font-semibold w-full hover:bg-interactive-1 focus:bg-interactive-3 hover:text-interactive-11 focus:text-interactive-12"
            onClick={() => mutationDisconnect.mutate()}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
