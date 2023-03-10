import { SUBGRAPH_SUPERFLUID_URL } from './config'

/**
 * Retrieve ongoing streams (receiver)
 */
export async function getSenderActiveStreams(args: { address: `0x${string}` }) {
  //@ts-ignore
  const response = await fetch(SUBGRAPH_SUPERFLUID_URL, {
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
          receiver {
            id
          }
          sender {
            id
          }
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
  const result = await response.json()

  return result
}

export default getSenderActiveStreams
