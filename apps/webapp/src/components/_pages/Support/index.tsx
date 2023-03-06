import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { formatDistance, fromUnixTime } from 'date-fns'
import { supportSchema as schema } from '~/schemas/support'
import { z } from 'zod'
import { useCreateFlow } from '~/components/forms/FormSupport'
import FormSupport from '~/components/forms/FormSupport/FormSupport'
import { ethers } from 'ethers'
import { useAuthentication } from '~/hooks/useAuthentication'
import { createQuery } from '@tanstack/solid-query'
import getArtistSupporterStream from '~/services/superfluid/getArtistSupporterStream'
import { Match, Switch } from 'solid-js'

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

        return {
          ...result?.data,
        }
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
      <Switch
        fallback={
          <>
            <FormSupport status={mutationCreateFlow.status} storeForm={storeForm} />
          </>
        }
      >
        <Match
          when={
            currentUser()?.address &&
            queryLatestStreamBetweenCurrentUserAndArtist?.status === 'success' &&
            queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.createdAtTimestamp
          }
        >
          <div class="space-y-2">
            <p class="text-center text-accent-11 text-2xs">
              {' '}
              You're currently supporting this artist at a rate of{' '}
              <span class="font-bold">
                {parseFloat(
                  ethers.utils.formatEther(
                    queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.currentFlowRate,
                  ),
                ) *
                  3600 *
                  24 *
                  30}{' '}
                {queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.token?.symbol} per month
              </span>{' '}
              (you're automatically sending{' '}
              {ethers.utils.formatEther(
                queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.currentFlowRate,
              )}
              &nbsp;
              {queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.token?.symbol}&nbsp; every second){' '}
            </p>
            <p class="text-center">
              You've been supporting this artist for the past{' '}
              <span class="font-bold">
                {formatDistance(
                  new Date(),
                  fromUnixTime(
                    parseInt(queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.createdAtTimestamp),
                  ),
                )}
                .
              </span>
            </p>
            <p class="text-center">
              So far, you've sent them{' '}
              <span class="font-bold text-primary-9">
                {ethers.utils.formatEther(queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.deposit)}{' '}
                {queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.token?.symbol}
              </span>
              .
            </p>
          </div>
        </Match>
      </Switch>
    </>
  )
}
