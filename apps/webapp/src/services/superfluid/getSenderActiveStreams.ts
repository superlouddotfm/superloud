import { SUBGRAPH_SUPERFLUID_URL } from './config'

/**
 * Retrieve ongoing streams (receiver)
 */
export async function getSenderActiveStreams(args: { address: `0x${string}` }) {
  //@ts-ignore
  const result = await fetch(SUBGRAPH_SUPERFLUID_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query SenderActiveStreams($sender: String!) {
        streams(
          first: 1
          where: {sender_contains_nocase: $sender, currentFlowRate_gt: 0}
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
        sender: args?.address,
      },
    }),
  })

  return result
}

export default getSenderActiveStreams
