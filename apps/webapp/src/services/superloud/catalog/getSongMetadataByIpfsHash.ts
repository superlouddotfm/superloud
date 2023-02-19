import type { BigNumber } from 'ethers'
import web3UriToUrl from '~/helpers/web3UriToUrl'

export async function getSongMetadataByIpfsHash(song: {
  id_karaoke_version: string
  created_at: BigNumber
  curator_address: `0x${string}`
  uri_metadata: string
  is_indexed: boolean
}) {
  const ipfsHash = song?.uri_metadata.replace('ipfs://', '')
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
    const result = await response.json()
    return {
      ...song,
      datetime_created_at: new Date(parseInt(`${song?.created_at}`) * 1000),
      ...result,
      url_isolated_instrumental_track: web3UriToUrl(result.uri_isolated_instrumental_track),
      url_isolated_vocal_track: web3UriToUrl(result.uri_isolated_vocal_track),
      url_lrc: web3UriToUrl(result.uri_lrc),
    }
  } catch (e) {
    console.error(e)
  }
}

export default getSongMetadataByIpfsHash
