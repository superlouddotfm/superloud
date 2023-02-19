import { SUBGRAPH_CATALOG_URL } from '../config'

/**
 * Retrieve all (indexed) karaoke versions curated by a specific address from the subgraph
 */
export async function getAllSongsByCurator(args: { first?: number; skip?: number; address: `0x${string}` }) {
  //@ts-ignore
  const result = await fetch(SUBGRAPH_CATALOG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query AllSongsByCurator(
          $first: Int!,
          $skip: Int!,
        where: {
          curator_address: $address
        } ) {
            id
            id_karaoke_version
            created_at
            curator_address
            uri_metadata
            metadata {
              uri_lrc
              uri_isolated_vocal_track
              uri_isolated_instrumental_track
              title
              description
              genre
              original_song_id
              original_song_title
              original_song_artist_id
              original_song_audio_url
              original_song_artist_name
              original_song_artwork_url
              original_song_supporting_artist
            }
          }        
        }
      
      `,
      variables: {
        first: args?.first ?? 30,
        skip: args?.skip ?? 0,
        address: args?.address,
      },
    }),
  })

  return result
}

export default getAllSongsByCurator
