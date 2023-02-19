import { createQuery } from '@tanstack/solid-query'
import getSongsByArtistId from '~/services/spinamp/songs/getSongsByArtistId'

export function useSongsByArtistAddress(args: { address: `0x${string}`; offset: number; first: number; options: any }) {
  const querySongsByArtistAddress = createQuery(
    () => ['songs-by-artist-address', args?.address, args?.offset, args?.first],
    async () => {
      try {
        const result = await getSongsByArtistId({
          id: args?.address,
          offset: args?.offset,
          first: args?.first,
        })
        return result
      } catch (e) {
        console.error(e)
      }
    },
    args?.options,
  )

  return {
    querySongsByArtistAddress,
  }
}

export default useSongsByArtistAddress
