import { SUBGRAPH_SUPERFLUID_URL } from './config'

/**
 * Retrieve ongoing streams of a given address (receiver)
 */
export async function getReceiverActiveStreams(args: { address: `0x${string}` }) {
  //@ts-ignore
  const result = await fetch(SUBGRAPH_SUPERFLUID_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query ReceiverActiveStreams($receiver: String!) {
        streams(
          first: 1
          where: {receiver_contains_nocase: $receiver, currentFlowRate_gt: 0}
        ) {
          id
          currentFlowRate
          createdAtTimestamp
          deposit
          token {
            name
            symbol
            underlyingAddress
          }
        }
      }
      `,
      variables: {
        receiver: args?.address,
      },
    }),
  })

  return result
}

export default getReceiverActiveStreams
