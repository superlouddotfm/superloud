import { SUBGRAPH_CATALOG_URL } from '../config'

/**
 * Retrieve a filtered list of (indexed) karaoke versions
 */
export async function getIndexedSongs(args: {
  first?: number
  skip?: number
  curatorAddress?: `0x${string}`
  query?: string
  genre?: string
}) {
  const response = await fetch(SUBGRAPH_CATALOG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query Songs (
        $first: Int!
        $skip: Int!
        $query: String!
        $genre: String!
        $curatorAddress: String
      ){
      karaokeVersions (
        first: $first
        skip: $skip
      where: {
          curator_address_contains: $curatorAddress
          metadata_: {
              title_contains_nocase: $query
              original_song_title_contains_nocase: $query
              original_song_artist_name_contains_nocase: $query
              original_song_supporting_artist_contains_nocase: $query
              description_contains_nocase: $query
              genre_contains_nocase: $genre
            }
          }) {
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
        query: args?.query ?? '',
        curatorAddress: args?.curatorAddress ?? '',
        genre: args?.genre ?? '',
      },
    }),
  })

  const result = await response.json()
  return result?.data?.karaokeVersions
}

export default getIndexedSongs
