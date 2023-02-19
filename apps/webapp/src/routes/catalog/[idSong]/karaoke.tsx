import { createRouteData, useRouteData } from 'solid-start'
import { getSongById } from '~/services/superloud/catalog/getSongById'
import { Match, Switch } from 'solid-js'
import { PlayKaraoke as PagePlayKaraoke } from '~/components/_pages/PlayKaraoke'
import type { RouteDataArgs } from 'solid-start'

export function routeData({ location, params }: RouteDataArgs) {
  return createRouteData(async () => {
    try {
      const song = await getSongById({
        id: params.idSong,
      })

      console.log(song)
      return {
        ...song,
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
        <PagePlayKaraoke song={data()} />
      </Match>
    </Switch>
  )
}
