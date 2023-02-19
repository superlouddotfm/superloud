import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { useAuthentication } from '~/hooks/useAuthentication'
import { Framework } from '@superfluid-finance/sdk-core'

export function useCreateFlow() {
  const { provider } = useAuthentication()
  const queryClient = useQueryClient()

  // Create a money flow using Superfluid SDK
  const mutationCreateFlow = createMutation(
    async (args: { recipient: `0x${string}`; flowRate: number; tokenSymbol: string }) => {
      const signer = provider()?.getSigner()
      const network = await provider().getNetwork()
      const chainId = network?.chainId
      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider(),
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
        console.log(result)
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
    },
  )

  return {
    mutationCreateFlow,
  }
}
