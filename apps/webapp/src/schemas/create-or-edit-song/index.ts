import { any, boolean, object, string } from 'zod'

/**
 * - Superloud song -
 * Music NFTs can be listed on Superloud karaoke catalog.
 * To be listed, the artist needs to list that song.
 * Artists can upload different version of a song for karaoke (remix version, bass boosted version etc.)
 * The listed version of the song will point to the original metadata.
 * To list their song and make it available for karaoke session, artists will need  :
 * - the LRC file of the song
 * - the isolated vocal track(s)
 * - the instrumental track(s)
 *
 * If they desire, they can also add a lyrics video of the song.
 *
 * The listed song data can be edited whenever they want.
 *
 * Additionally, artists could decide to charge a one-time fee.
 */

export const createOrEditSongSchema = object({
  // Basic information
  id_original_song: string(),
  id_original_song_from_artist_discography: string().optional(),
  text_query_search_song_by_keyword: string().trim().optional(),
  title: string().trim().min(1),
  genre: string(),
  description: string().trim().optional(),
  is_listed: boolean(),

  // LRC file
  lrc_file: any().optional(),
  lrc_uri: string().optional(),

  // Vocal track
  isolated_vocal_track_file: any().optional(),
  isolated_vocal_track_uri: string().optional(),

  // Intrumental track
  isolated_instrumental_track_file: any().optional(),
  isolated_instrumental_track_uri: string().optional(),
})

export default createOrEditSongSchema
