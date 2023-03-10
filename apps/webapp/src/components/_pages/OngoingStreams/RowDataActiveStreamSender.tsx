import { createQuery } from '@tanstack/solid-query'
import { differenceInSeconds, formatDistance, fromUnixTime } from 'date-fns'
import { ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils.js'
import { createEffect, Match, Show, Switch } from 'solid-js'
import Button from '~/components/system/Button'
import useSuperfluidSDK from '~/hooks/useSuperfluidSDK'
import getArtistById from '~/services/spinamp/artists/getArtistById'
import shortenEthereumAddress from '~/helpers/shortenEthereumAddress'

export const RowDataActiveStreamSender = (props) => {
  const { mutationDeleteFlow } = useSuperfluidSDK()

  const queryArtistProfile = createQuery(
    () => ['artist-profile', props?.stream?.receiver?.id],
    async () => {
      try {
        const artist = await getArtistById({ id: props?.stream?.receiver?.id })

        return artist?.data?.allArtists?.edges?.[0]?.node?.artistProfilesByArtistId?.edges
      } catch (e) {
        console.error(e)
      }
    },
    {
      refetchOnWindowFocus: false,
      get enabled() {
        return isAddress(props?.stream?.receiver?.id)
      },
    },
  )

  return (
    <>
      <Show when={mutationDeleteFlow?.isSuccess === false}>
        <td class="flex items-baseline py-2 md:py-0.5 h-full px-3 text-ellipsis overflow-hidden">
          <div class="my-auto">
            <Show
              fallback={shortenEthereumAddress(props?.stream?.artist?.address)}
              when={queryArtistProfile?.data?.[0]?.node?.name && queryArtistProfile?.data?.[0]?.node?.name !== null}
            >
              <span>{queryArtistProfile?.data?.[0]?.node?.name} </span>&nbsp;
              <span class="text-[0.75em]">({shortenEthereumAddress(props?.stream?.artist?.address)})</span>
            </Show>
          </div>
        </td>
        <td class="flex items-center py-2 md:py-0.5 h-full px-3">
          {`${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(
            parseFloat(
              ethers.utils.formatEther(
                (parseFloat(props?.stream?.currentFlowRate.toString()) * 3600 * 24 * 30).toString(),
              ),
            ),
          )}`}{' '}
          {props?.stream?.token?.symbol}
        </td>
        <td class="flex items-center py-2 md:py-0.5 h-full px-3">
          {formatDistance(new Date(), fromUnixTime(parseInt(props?.stream?.createdAtTimestamp)))}
        </td>
        <td class="flex items-center py-2 md:py-0.5 h-full px-3">
          {`${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(
            parseFloat(
              ethers.utils.formatEther(
                (
                  parseFloat(props?.stream?.currentFlowRate.toString()) *
                  differenceInSeconds(new Date(), fromUnixTime(parseInt(props?.stream?.createdAtTimestamp)))
                ).toString(),
              ),
            ),
          )}`}{' '}
          {props?.stream?.token?.symbol}
        </td>
        <td class="flex items-center py-2 md:py-0.5 h-full px-3">
          <Button
            isLoading={mutationDeleteFlow?.isLoading}
            disabled={mutationDeleteFlow?.isLoading || mutationDeleteFlow?.isSuccess}
            scale="xs"
            intent="negative-ghost"
            onClick={async () => {
              await mutationDeleteFlow.mutateAsync({
                recipient: props?.stream?.receiver?.id,
                superTokenSymbol: `${props?.stream?.token?.symbol}` as string,
                toast: {
                  success: {
                    title: 'Your subscription was cancelled successfully !',
                    text: 'You start supporting this artist again whenever you want.',
                  },
                },
              })
            }}
            type="button"
          >
            <span class="pis-1ex">
              <Switch fallback="Cancel support">
                <Match when={mutationDeleteFlow?.isSuccess}>Cancelled</Match>
                <Match when={mutationDeleteFlow?.isLoading}>Cancelling...</Match>
              </Switch>
            </span>
          </Button>
        </td>
      </Show>
    </>
  )
}

export default RowDataActiveStreamSender
