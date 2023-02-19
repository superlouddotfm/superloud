import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve song by its  id
 */
export async function getSongById(args: { id: string | `0x${string}`; offset: number; first: number }) {
  const response = await fetch(SPINAMP_API_ENDPOINT, {
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
          nftsProcessedTracksByProcessedTrackId(first: 1) {
            nodes {
              nftByNftId {
                chainId
                contractAddress
              }
            }
          }
          artistId
          artistByArtistId {
            id
            address
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
  const result = await response.json()
  return result
}

export default getSongById
