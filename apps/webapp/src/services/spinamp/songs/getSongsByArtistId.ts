import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve songs by artist  id
 */
export async function getSongsByArtistId(args: { id: string | `0x${string}`; offset: number; first: number }) {
  const response = await fetch(SPINAMP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query ArtistSongsByArtistId(
        $id: String!
        $first: Int!
        $offset: Int!
      ) {
        allProcessedTracks(
          first: $first
          offset: $offset
          filter: {
            or: [
              { artistId: { includesInsensitive: $id } }
              { supportingArtist: { includesInsensitive: $id } }
            ]
          }
        ) {
          edges {
            node {
              id
              title
              lossyAudioUrl
              lossyArtworkUrl
              description
              artistByArtistId {
                id
                name
              }
              supportingArtist 

            }
          }
        }
      }
      `,
      variables: {
        id: args.id,
        offset: args?.offset ?? 0,
        first: args?.first ?? 10,
      },
    }),
  })
  const result: {
    data: {
      allProcessedTracks: {
        edges: Array<{
          node: {
            id: string
            title: string
            lossyAudioUrl: string
            lossyArtworkUrl: string
            description: string
            artistByArtistId: {
              id: string
              name: string
            }
          }
        }>
      }
    }
  } = await response.json()
  return result
}

export default getSongsByArtistId
