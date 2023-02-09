import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve artist by id
 * @param args: - { id } Ethereum address or ID
 */
export async function getArtistById(args: { id: `0x${string}` | string }) {
  const result = await fetch(SPINAMP_API_ENDPOINT, {
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
              artistProfilesByArtistId {
                edges {
                  node {
                    platformInternalId
                    name
                    avatarUrl
                    websiteUrl
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

  return result
}

export default getArtistById
