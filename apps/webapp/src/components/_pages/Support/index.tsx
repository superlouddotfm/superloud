import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { differenceInSeconds, formatDistance, fromUnixTime } from 'date-fns'
import { supportSchema as schema } from '~/schemas/support'
import { z } from 'zod'
import { useSuperfluidSDK } from '~/hooks/useSuperfluidSDK'
import FormSupport from '~/components/forms/FormSupport/FormSupport'
import { ethers } from 'ethers'
import { useAuthentication } from '~/hooks/useAuthentication'
import { createQuery } from '@tanstack/solid-query'
import getArtistSupporterStream from '~/services/superfluid/getArtistSupporterStream'
import { createSignal, Match, Switch } from 'solid-js'
import Button from '~/components/system/Button'

export const Support = (props: any) => {
  const { mutationCreateFlow, mutationDeleteFlow } = useSuperfluidSDK()
  const { currentUser } = useAuthentication()
  const [supportingSinceTimestamp, setSupportingSinceTimestamp] = createSignal(new Date())
  const [totalSupportSent, setTotalSupportSent] = createSignal(0)

  const queryLatestStreamBetweenCurrentUserAndArtist = createQuery(
    () => ['stream', currentUser()?.address, props?.address],
    async () => {
      try {
        const result = await getArtistSupporterStream({
          addressArtist: props.address,
          addressSupporter: currentUser()?.address,
        })
        const secondsSinceStreaming = differenceInSeconds(
          new Date(),
          fromUnixTime(parseInt(result?.data?.streams?.[0]?.createdAtTimestamp)),
        )

        setSupportingSinceTimestamp(fromUnixTime(parseInt(result?.data?.streams?.[0]?.createdAtTimestamp)))
        setTotalSupportSent(
          new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(
            parseFloat(
              ethers.utils.formatEther(
                (parseFloat(result?.data?.streams?.[0]?.currentFlowRate.toString()) * secondsSinceStreaming).toString(),
              ),
            ),
          ),
        )

        if (result?.data) {
          return {
            ...result?.data,
          }
        }
        return []
      } catch (e) {
        console.error(e)
      }
    },
    {
      refetchInterval: 6000,
      get enabled() {
        return currentUser()?.address ? true : false
      },
    },
  )
  const storeForm = createForm<z.infer<typeof schema>>({
    onSubmit: async (values) => {
      try {
        const feePerMonth = ethers.utils.parseEther((values?.super_token_amount_per_month * 0.005).toString())
        const amountPerMonth = ethers.utils.parseEther(values?.super_token_amount_per_month.toString())
        const flowRate = Math.floor(amountPerMonth / 3600 / 24 / 30)
        const feeFlowRate = Math.floor(feePerMonth / 3600 / 24 / 30)
        await mutationCreateFlow.mutateAsync({
          recipient: values?.recipient_wallet_address as `0x${string}`,
          flowRate: flowRate,
          feeFlowRate,
          tokenSymbol: values?.super_token_symbol,
          toast: {
            success: {
              title: "You're now supporting this artist !",
              text: 'You can cancel your support for free at any time.',
            },
          },
        })
      } catch (e) {
        console.error(e)
      }
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
            !mutationDeleteFlow?.isSuccess &&
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
                {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(
                  parseFloat(
                    ethers.utils.formatEther(
                      (
                        parseFloat(
                          queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.currentFlowRate.toString(),
                        ) *
                        3600 *
                        24 *
                        30
                      ).toString(),
                    ),
                  ),
                )}{' '}
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
              <span class="font-bold">{formatDistance(new Date(), supportingSinceTimestamp())}.</span>
            </p>
            <p class="text-center">
              So far, you've sent them{' '}
              <span class="font-bold text-primary-9">
                {totalSupportSent()} {queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.token?.symbol}
              </span>
              .
            </p>
            <p class="text-center">
              You can cancel your support stream at anytime. <br /> Please note that if the balance of the token you
              used hits 0,&nbsp;<span class="font-bold"> your stream will be closed automatically</span>.
            </p>
            <div class="pt-2 flex justify-center">
              <Button
                isLoading={mutationDeleteFlow?.isLoading}
                disabled={mutationDeleteFlow?.isLoading}
                onClick={async () => {
                  await mutationDeleteFlow.mutateAsync({
                    recipient: props?.address,
                    superTokenSymbol:
                      `${queryLatestStreamBetweenCurrentUserAndArtist?.data?.streams?.[0]?.token?.symbol}` as string,
                    toast: {
                      success: {
                        title: 'Your subscription was cancelled successfully !',
                        text: 'You start supporting this artist again whenever you want.',
                      },
                    },
                  })
                }}
                type="button"
                scale="sm"
                intent="primary-outline"
              >
                <span class="pis-1ex">
                  <Switch fallback="Cancel support">
                    <Match when={mutationDeleteFlow?.isLoading}>Cancelling...</Match>
                  </Switch>
                </span>
              </Button>
            </div>
          </div>
        </Match>
      </Switch>
    </>
  )
}

export default Support
