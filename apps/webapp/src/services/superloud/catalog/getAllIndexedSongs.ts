import { SUBGRAPH_CATALOG_URL } from '../config'

/**
 * Retrieve all (indexed) karaoke version from the subgraph
 */
export async function getAllIndexedSongs(args: { first?: number; skip?: number }) {
  //@ts-ignore
  const result = await fetch(SUBGRAPH_CATALOG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query AllSongs($first: Int!, $skip: Int!) {
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
      },
    }),
  })

  return result
}

export default getAllIndexedSongs
