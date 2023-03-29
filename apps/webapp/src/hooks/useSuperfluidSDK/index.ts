import { createMutation, useQueryClient } from '@tanstack/solid-query'
import { Framework } from '@superfluid-finance/sdk-core'
import { fetchSigner, getNetwork, getProvider } from '@wagmi/core'
import { useAuthentication } from '~/hooks/useAuthentication'
import { useToast } from '~/hooks/useToast'
import type { Signer } from '@wagmi/core'

export function useSuperfluidSDK() {
  const toast = useToast()
  const queryClient = useQueryClient()
  //@ts-ignore
  const { currentUser } = useAuthentication()

  // Create a money flow using Superfluid SDK
  const mutationCreateFlow = createMutation(
    async (args: {
      recipient: `0x${string}`
      feeFlowRate: number
      flowRate: number
      tokenSymbol: string
      sender: `0x${string}`
      toast: {
        success: {
          title: string
          text: string
        }
      }
    }) => {
        const signer = await fetchSigner()
        const provider = await getProvider()
        const network = await getNetwork()
        const chainId = network?.chain?.id
        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider,
        })

        const superSigner = sf.createSigner({ signer: signer as Signer })
        const superToken = await sf.loadSuperToken(args?.tokenSymbol)

        const createFlowOperation = superToken.createFlow({
          sender: await superSigner.getAddress(),
          receiver: args?.recipient,
          flowRate: `${args?.flowRate}`,
        })

        const result = await createFlowOperation.exec(superSigner)
        await result?.wait()
        return result

    },
    {
      onSettled() {
        // Whether or not the transaction is successful, invalidate user balance query
        // this way we will refresh the balance
        queryClient.invalidateQueries(['balance-supertoken'])
      },
      async onSuccess(data, variables) {
        //@ts-ignore
        toast().create({
          title: variables?.toast?.success?.title,
          description: variables?.toast?.success?.text,
          type: 'success',
          placement: 'bottom-right',
        })
        mutationDeleteFlow.reset()
        // Wait 5 sec, then refresh
        setTimeout(async () => {
          await queryClient.invalidateQueries(['streams-sender', currentUser()?.address])
          await queryClient.invalidateQueries(['stream', currentUser()?.address, variables?.recipient])
        }, 4000)
      },
    },
  )

  // Delete/cancel a money flow using Superfluid SDK
  const mutationDeleteFlow = createMutation(
    async (args: {
      recipient: `0x${string}`
      superTokenSymbol: string
      toast: {
        success: {
          title: string
          text: string
        }
      }
    }) => {
        const signer = await fetchSigner()
        const provider = await getProvider()
        const network = await getNetwork()
        const chainId = network?.chain?.id
        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider,
        })

        const superSigner = sf.createSigner({ signer: signer as Signer })
        const supertoken = await sf.loadSuperToken(args?.superTokenSymbol)

        const deleteFlowOperation = supertoken.deleteFlow({
          sender: (await signer?.getAddress()) as string,
          receiver: args?.recipient,
        })

        const result = await deleteFlowOperation.exec(superSigner)
        await result?.wait()

        return result
    },
    {
      onSettled() {
        queryClient.invalidateQueries(['balance-supertoken'])
      },
      async onSuccess(data, variables) {
        setTimeout(async () => {
          await queryClient.invalidateQueries(['streams-sender', currentUser()?.address])
          await queryClient.invalidateQueries(['stream', currentUser()?.address, variables?.recipient])
        }, 4000)
        //@ts-ignore
        toast().create({
          title: variables?.toast?.success?.title,
          description: variables?.toast?.success?.text,
          type: 'success',
          placement: 'bottom-right',
        })

        mutationCreateFlow.reset()
      },
    },
  )

  return {
    mutationCreateFlow,
    mutationDeleteFlow,
  }
}

export default useSuperfluidSDK
