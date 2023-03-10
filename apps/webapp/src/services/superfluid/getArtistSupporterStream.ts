import { SUBGRAPH_SUPERFLUID_URL } from './config'

/**
 * Retrieve last ongoing stream between a supporter and an artist
 */
export async function getArtistSupporterStream(args: {
  addressArtist: `0x${string}`
  addressSupporter: `0x${string}`
}) {
  //@ts-ignore
  const response = await fetch(SUBGRAPH_SUPERFLUID_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query SupporterArtistStream($sender: String!, $receiver: String!) {
        streams(
          first: 1
          where: {sender_contains_nocase: $sender, receiver_contains_nocase: $receiver, currentFlowRate_gt: 0}
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
        sender: args?.addressSupporter,
        receiver: args?.addressArtist,
      },
    }),
  })
  const result = await response.json()

  return result
}

export default getArtistSupporterStream
