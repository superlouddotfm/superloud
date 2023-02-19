import { createRouteData, useRouteData } from 'solid-start'
import { getSongById } from '~/services/superloud/catalog/getSongById'
import { getSongById as getOriginalSongById } from '~/services/spinamp/songs/getSongById'
import { Match, Switch } from 'solid-js'
import { Song as PageSong } from '~/components/_pages/Song'
import type { RouteDataArgs } from 'solid-start'
import getArtistById from '~/services/spinamp/artists/getArtistById'

export function routeData({ location, params }: RouteDataArgs) {
  return createRouteData(async () => {
    try {
      const song = await getSongById({
        id: params.idSong,
      })
      const artist = await getArtistById({ id: song?.original_song_artist_id })
      const original = await getOriginalSongById({ id: song?.original_song_id })
      return {
        ...song,
        artist_address: artist?.data?.allArtists?.edges?.[0]?.node?.address,
        artist_profiles: artist?.data?.allArtists?.edges?.[0]?.node?.artistProfilesByArtistId?.edges,
        original_song: {
          ...original?.data?.processedTrackById,
        },
      }
    } catch (e) {
      console.error(e)
      return {
        ok: false,
      }
    }
  })
}

export default function Page() {
  const data = useRouteData<typeof routeData>()

  return (
    <Switch fallback={<div class="m-auto animate-pulse text-lg font-bold">Loading...</div>}>
      <Match when={data()?.ok === false}>
        <div class="m-auto text-lg font-bold">This song doesn't exist or was deleted.</div>
      </Match>

      <Match when={data()?.id_karaoke_version}>
        <PageSong metadata={data()} />
      </Match>
    </Switch>
  )
}
