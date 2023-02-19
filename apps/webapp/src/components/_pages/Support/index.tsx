import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { formatDistance } from 'date-fns'
import { supportSchema as schema } from '~/schemas/support'
import { z } from 'zod'
import { useCreateFlow } from '~/components/forms/FormSupport'
import FormSupport from '~/components/forms/FormSupport/FormSupport'
import { ethers } from 'ethers'
import { useAuthentication } from '~/hooks/useAuthentication'
import { createQuery } from '@tanstack/solid-query'
import getArtistSupporterStream from '~/services/superfluid/getArtistSupporterStream'
import { Show } from 'solid-js'

export const Support = (props: any) => {
  const { mutationCreateFlow } = useCreateFlow()
  const { currentUser } = useAuthentication()
  const queryLatestStreamBetweenCurrentUserAndArtist = createQuery(
    () => ['latest-stream-between-supporter-artist', currentUser()?.address, props?.address],
    async () => {
      try {
        const response = await getArtistSupporterStream({
          addressArtist: props.address,
          addressSupporter: currentUser()?.address,
        })

        const result = await response.json()

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
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: async (values) => {
      const amountPerMonth = ethers.utils.parseEther(values?.super_token_amount_per_month.toString())
      const flowRate = Math.floor(amountPerMonth / 3600 / 24 / 30)

      await mutationCreateFlow.mutateAsync({
        recipient: values?.recipient_wallet_address as `0x${string}`,
        flowRate: flowRate,
        tokenSymbol: values?.super_token_symbol,
      })
    },
    initialValues: {
      recipient_wallet_address: props.address,
    },
    extend: validator({ schema }),
  })

  return (
    <>
      <FormSupport status={mutationCreateFlow.status} storeForm={storeForm} />
    </>
  )
}
