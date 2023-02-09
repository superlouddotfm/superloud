import { SPINAMP_API_ENDPOINT } from '../config'

/**
 * Retrieve songs by keyword
 */
export async function searchSongs(args: { query: string; offset: number; first: number }) {
  const result = await fetch(SPINAMP_API_ENDPOINT, {
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

  return result
}

export default searchSongs
