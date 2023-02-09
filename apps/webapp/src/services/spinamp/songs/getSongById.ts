import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve song by its  id
 */
export async function getSongById(args: { id: string | `0x${string}`; offset: number; first: number }) {
  const result = await fetch(SPINAMP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query SongById($id: String!) {
        processedTrackById(id: $id) {
          title
          description
          lossyArtworkUrl
          lossyAudioUrl
          websiteUrl
          createdAtTime
          artistId
          artistByArtistId {
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
      `,
      variables: {
        id: args.id,
      },
    }),
  })

  return result
}

export default getSongById
