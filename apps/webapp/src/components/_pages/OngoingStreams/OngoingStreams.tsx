import { differenceInSeconds, formatDistance, fromUnixTime } from 'date-fns'
import { ethers } from 'ethers'
import { For, Show } from 'solid-js'
import RowDataActiveStreamSender from './RowDataActiveStreamSender'
import { useOngoingStreams } from './useOngoingStreams'

export const OngoingStreams = () => {
  const { queryStreamsReceiver, queryStreamsSender, apiTabsStreams } = useOngoingStreams()

  return (
    <>
      <div class="border rounded-md border-accent-5 overflow-hidden" {...apiTabsStreams().rootProps}>
        <div class="flex divide-i divide-accent-5 border-b border-accent-5" {...apiTabsStreams().tablistProps}>
          <button
            class="flex items-center bg-accent-1 not:data-[selected]:bg-transparent data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50 p-8"
            {...apiTabsStreams().getTriggerProps({ value: 'sender' })}
          >
            Your subscriptions
          </button>
          <button
            class="flex items-center bg-accent-1 not:data-[selected]:bg-transparent data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50 p-8"
            {...apiTabsStreams().getTriggerProps({ value: 'receiver' })}
          >
            Your subscribers
          </button>
        </div>

        <div class="p-2 shrink-0 xs:p-4 bg-white" {...apiTabsStreams().getContentProps({ value: 'sender' })}>
          <h3 class="font-bold mb-3 text-primary-12">Your active subscriptions</h3>
          <table class="w-full border border-interactive-5 text-xs">
            <thead class="bg-interactive-2 border border-interactive-4">
              <tr class="grid gap-1 divide-i divide-interactive-5 md:grid-cols-5 text-2xs font-bold text-interactive-11">
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Artist</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Amount sent per month</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Supporting since</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Total sent</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3"></th>
              </tr>
            </thead>
            <tbody class="text-interactive-12 flex flex-col   divide-y divide-interactive-5">
              <Show when={queryStreamsSender?.data?.streams?.length > 0}>
                <For each={queryStreamsSender?.data?.streams}>
                  {(stream) => (
                    <tr class="divide-i divide-interactive-4 text-ellipsis overflow-hidden grid gap-1 md:grid-cols-5">
                      <RowDataActiveStreamSender stream={stream} />
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
        <div {...apiTabsStreams().getContentProps({ value: 'receiver' })} class="p-0.5 shrink-0 !grow xs:p-4 bg-white">
          <h3 class="font-bold mb-3 text-primary-12">Your active subscriptions</h3>
          <table class="w-full border border-interactive-5 text-xs">
            <thead class="bg-interactive-2 border border-interactive-4">
              <tr class="grid gap-1 md:divide-i md:divide-interactive-5 md:grid-cols-4 text-2xs font-bold text-interactive-11">
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Supporter</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Amount received per month</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Supporting since</th>
                <th class="flex items-center text-start py-2 md:py-0.5 px-3">Total received</th>
              </tr>
            </thead>
            <tbody class="text-interactive-12 flex flex-col divide-y divide-interactive-5">
              <Show when={queryStreamsReceiver?.data?.length > 0}>
                <For each={queryStreamsReceiver?.data}>
                  {(stream) => (
                    <tr class="md:divide-i md:divide-interactive-4 text-ellipsis overflow-hidden grid gap-1 md:grid-cols-4">
                      <td class="py-2 md:py-0.5 px-3 text-ellipsis overflow-hidden">{stream?.sender?.id}</td>

                      <td class="py-2 md:py-0.5 px-3">
                        {`${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(
                          parseFloat(
                            ethers.utils.formatEther(
                              (parseFloat(stream?.currentFlowRate.toString()) * 3600 * 24 * 30).toString(),
                            ),
                          ),
                        )}`}{' '}
                        {stream?.token?.symbol}
                      </td>
                      <td class="py-2 md:py-0.5 px-3">
                        {formatDistance(new Date(), fromUnixTime(parseInt(stream?.createdAtTimestamp)))}
                      </td>
                      <td class="py-2 md:py-0.5 px-3">
                        {`${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(
                          parseFloat(
                            ethers.utils.formatEther(
                              (
                                parseFloat(stream?.currentFlowRate.toString()) *
                                differenceInSeconds(new Date(), fromUnixTime(parseInt(stream?.createdAtTimestamp)))
                              ).toString(),
                            ),
                          ),
                        )}`}{' '}
                        {stream?.token?.symbol}
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default OngoingStreams
