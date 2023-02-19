import { BigNumber, ethers } from 'ethers'
import { ABI_SUPERLOUD_CATALOG, SUPERLOUD_CATALOG_CONTRACT_ADDRESS } from '~/abi/superloudCatalog'
import getSongMetadataByIpfsHash from './getSongMetadataByIpfsHash'
export type SongMetadata = {
  id_karaoke_version: string
  created_at: BigNumber
  curator_address: `0x${string}`
  uri_metadata: string
  is_indexed: boolean
  datetime_created_at: Date
  url_isolated_instrumental_track: string
  url_isolated_vocal_track: string
  url_lrc: string
  uri_lrc: string
  uri_isolated_vocal_track: string
  uri_isolated_instrumental_track: string
  title: string
  description: string
  genre: string
  original_song_id: string
  original_song_title: string
  original_song_artist_id: string
  original_song_audio_url: string
  original_song_artist_name: string
  original_song_artwork_url: string
  original_song_supporting_artist: string
}
export async function getSongById(args: { id: string }) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL_MUMBAI_QUICKNODE)
    const contractSuperloudCatalog = new ethers.Contract(
      SUPERLOUD_CATALOG_CONTRACT_ADDRESS,
      ABI_SUPERLOUD_CATALOG,
      provider,
    )

    const rawResult = await contractSuperloudCatalog.getKaraokeVersionById(args.id)
    if (!rawResult?.id_karaoke_version || !rawResult?.uri_metadata) throw new Error('Not found')
    const song = {
      id_karaoke_version: rawResult.id_karaoke_version,
      created_at: rawResult.created_at,
      curator_address: rawResult.curator,
      uri_metadata: rawResult.uri_metadata,
      is_indexed: rawResult.is_indexed,
    }
    const metadata: SongMetadata = await getSongMetadataByIpfsHash(song)
    return metadata
  } catch (e) {
    console.error(e)
  }
}
