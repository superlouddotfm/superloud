import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve artist by id
 * @param args: - { id } Ethereum address or ID
 */
export async function getArtistById(args: { id: `0x${string}` | string }) {
  const response = await fetch(SPINAMP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query ArtistByAddress(
        $id: String!
      ) {
        allArtists(filter: { id: { includesInsensitive: $id } }) {
          edges {
            node {
              id
              address
              artistProfilesByArtistId {
                edges {
                  node {
                    name
                    avatarUrl
                    websiteUrl
                    platformId
                  }
                }
              }
            }
          }
        }
      }
      `,
      variables: {
        id: args.id,
      },
    }),
  })
  const result = await response.json()
  return result
}

export default getArtistById
