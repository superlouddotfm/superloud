import { createQuery } from '@tanstack/solid-query'
import { fetchBalance } from '@wagmi/core'
import { createEffect, createSignal } from 'solid-js'

interface TokenBalanceProps {
  address: `0x${string}`
  token?: `0x${string}`
}

export function useTokenBalance(args: { address: `0x${string}`; token?: `0x${string}`; options: any }) {
  const [address, setAddress] = createSignal(args?.address)
  const [token, setToken] = createSignal(args?.token)

  const queryTokenBalance = createQuery(
    () => ['erc20-token-balance', address(), token()],
    async () => {
      try {
        const balance = await fetchBalance({
          address: address(),
          token: token(),
        })

        return balance
      } catch (e) {
        console.error(e)
      }
    },
    args?.options,
  )

  return {
    queryTokenBalance,
  }
}

export const TokenBalance = (props: TokenBalanceProps) => {
  const { queryTokenBalance } = useTokenBalance({ address: props?.address, token: props?.token })
  return <>{queryTokenBalance?.data?.formatted}</>
}

export default TokenBalance
