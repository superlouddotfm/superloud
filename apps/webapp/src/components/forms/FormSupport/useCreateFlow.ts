import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { Framework } from '@superfluid-finance/sdk-core'
import { fetchSigner, getNetwork, getProvider } from '@wagmi/core'
import { useAuthentication } from '~/hooks/useAuthentication'

export function useCreateFlow() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuthentication()

  // Create a money flow using Superfluid SDK
  const mutationCreateFlow = createMutation(
    async (args: { recipient: `0x${string}`; flowRate: number; tokenSymbol: string; sender: `0x${string}` }) => {
      const signer = await fetchSigner()
      const provider = await getProvider()
      const network = await getNetwork()
      const chainId = network?.chain?.id
      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      })

      const superSigner = sf.createSigner({ signer: signer })
      const superToken = await sf.loadSuperToken(args?.tokenSymbol)

      try {
        const createFlowOperation = superToken.createFlow({
          sender: await superSigner.getAddress(),
          receiver: args?.recipient,
          flowRate: `${args?.flowRate}`,
        })

        const result = await createFlowOperation.exec(superSigner)
        await result?.wait()
        return result
      } catch (error) {
        console.error(error)
      }
    },
    {
      onSettled() {
        // Whether or not the transaction is successful, invalidate user balance query
        // this way we will refresh the balance
        queryClient.invalidateQueries(['balance-supertoken'])
      },
      onSuccess(data, variables) {
        // Wait 5 sec, then refresh
        setTimeout(() => {
          queryClient.invalidateQueries([
            'latest-stream-between-supporter-artist',
            currentUser()?.address,
            variables?.recipient,
          ])
        }, 5000)
      },
    },
  )

  return {
    mutationCreateFlow,
  }
}
