import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve songs by keyword
 */
export async function searchSongs(args: { query: string; offset: number; first: number }) {
  const response = await fetch(SPINAMP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query SearchSongs($query: String!) {
        allProcessedTracks(filter: {or: [
          {title: {includesInsensitive: $query}},
          {description: {includesInsensitive: $query}}
        ]}) {
          edges {
            node {
              id
              artistId
              lossyArtworkUrl
              lossyAudioUrl
              supportingArtist
              title
              websiteUrl
              artistByArtistId {
                id
                name
              }
            }
          }
        }
      }
            `,
      variables: {
        query: args.query,
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

export default searchSongs
