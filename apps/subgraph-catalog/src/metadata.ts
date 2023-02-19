import { json, Bytes, dataSource } from '@graphprotocol/graph-ts'
import { metadataKaraokeVersion } from '../generated/schema'

export function handleMetadata(content: Bytes): void {
  let metadata = new metadataKaraokeVersion(dataSource.stringParam())
  if (content) {
    const value = json.fromBytes(content).toObject()
    if (value) {
      let title = value.get('title')
      let description = value.get('description')
      let genre = value.get('genre')
      let original_song_id = value.get('original_song_id')
      let original_song_title = value.get('original_song_title')
      let original_song_artist_id = value.get('original_song_artist_id')
      let original_song_artist_name = value.get('original_song_artist_name')
      let original_song_artwork_url = value.get('original_song_artwork_url')
      let original_song_audio_url = value.get('original_song_audio_url')
      let original_song_supporting_artist = value.get('original_song_supporting_artist')
      let uri_isolated_vocal_track = value.get('uri_isolated_vocal_track')
      let uri_isolated_instrumental_track = value.get('uri_isolated_instrumental_track')
      let uri_lrc = value.get('uri_lrc')

      if (title) {
        metadata.title = title.toString()
      } else {
        metadata.title = ''
      }
      if (description) {
        metadata.description = description.toString()
      } else {
        metadata.description = ''
      }
      if (genre) {
        metadata.genre = genre.toString()
      } else {
        metadata.genre = ''
      }

      if (original_song_id) {
        metadata.original_song_id = original_song_id.toString()
      } else {
        metadata.original_song_id = ''
      }

      if (original_song_title) {
        metadata.original_song_title = original_song_title.toString()
      } else {
        metadata.original_song_title = ''
      }

      if (original_song_artist_id) {
        metadata.original_song_artist_id = original_song_artist_id.toString()
      } else {
        metadata.original_song_artist_id = ''
      }

      if (original_song_artist_name) {
        metadata.original_song_artist_name = original_song_artist_name.toString()
      } else {
        metadata.original_song_artist_name = ''
      }

      if (original_song_artwork_url) {
        metadata.original_song_artwork_url = original_song_artwork_url.toString()
      } else {
        metadata.original_song_artwork_url = ''
      }

      if (original_song_audio_url) {
        metadata.original_song_audio_url = original_song_audio_url.toString()
      } else {
        metadata.original_song_audio_url = ''
      }

      if (original_song_supporting_artist) {
        metadata.original_song_supporting_artist = original_song_supporting_artist.toString()
      } else {
        metadata.original_song_supporting_artist = ''
      }

      if (uri_lrc) {
        metadata.uri_lrc = uri_lrc.toString()
      } else {
        metadata.uri_lrc = ''
      }

      if (uri_isolated_vocal_track) {
        metadata.uri_isolated_vocal_track = uri_isolated_vocal_track.toString()
      } else {
        metadata.uri_isolated_vocal_track = ''
      }

      if (uri_isolated_instrumental_track) {
        metadata.uri_isolated_instrumental_track = uri_isolated_instrumental_track.toString()
      } else {
        metadata.uri_isolated_instrumental_track = ''
      }
      metadata.save()
    }
  }
}
