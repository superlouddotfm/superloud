import { debounce } from '@solid-primitives/scheduled'
import { createQuery } from '@tanstack/solid-query'
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js'
import { A } from 'solid-start'
import FormInput from '~/components/system/FormInput'
import { ROUTE_CATALOG_SONG_BY_ID } from '~/config/routes'
import getIndexedSongs from '~/services/superloud/catalog/getIndexedSongs'

export default function Page() {
  const [inputSearchValue, setInputSearchValue] = createSignal('')
  const [debouncedSearchQueryValue, setDebouncedSearchQueryValue] = createSignal('')
  const [first, setFirst] = createSignal(30)
  const [offset, setOffset] = createSignal(0)
  const [genre, setGenre] = createSignal('')

  const queryCatalog = createQuery(
    () => ['catalog', debouncedSearchQueryValue(), first(), offset()],
    async () => {
      try {
        const result = await getIndexedSongs({
          first: first(),
          offset: offset(),
          curatorAddress: '',
          genre: genre(),
          query: debouncedSearchQueryValue(),
        })

        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  const trigger = debounce((value: string) => setDebouncedSearchQueryValue(value), 1150)
  createEffect(() => {
    if (inputSearchValue()) trigger(inputSearchValue())
  })

  return (
    <div class="flex flex-col flex-grow pt-12">
      <div class="max-w-prose w-full mx-auto px-4">
        <h1 class="text-start xs:text-center text-2xl text-neutral-9 font-bold mb-1">Be Superloud.</h1>
      </div>
      <main>
        <div class="max-w-prose w-full mx-auto px-4">
          <p class="text-start mt-2  text-neutral-7 font-medium">
            Superloud is a karaoke platform that leverages web3 technology to connect fans, communities and artists.
          </p>
          <p class="text-start mt-2 mb-6 text-neutral-7 font-medium">
            <span class="text-accent-12 font-bold">Got a mic ? Grab a song</span> to get started. Not a big fan of
            singing ? No problem - help the Superloud karaoke catalog to grow by curating good karaoke songs.{' '}
          </p>
          <div class="">
            <FormInput
              class="w-full"
              hasError={false}
              onInput={(e) => {
                setInputSearchValue(e.currentTarget.value)
              }}
              placeholder="Search by title, keyword, artist name..."
            />
          </div>
        </div>
        <div class="pt-12 w-full mx-auto px-4 2xs:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl">
          <Switch>
            <Match when={queryCatalog.isError}>Something went wrong</Match>
            <Match when={queryCatalog.isLoading}>
              <p class="font-bold animate-pulse py-12 text-center">Searching for songs...</p>
            </Match>
            <Match when={queryCatalog.isSuccess}>
              <Show when={queryCatalog?.data?.length > 0}>
                <ul class="gap-4 grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
                  <For each={queryCatalog?.data}>
                    {(song) => (
                      <li class="relative border h-full bg-accent-1 border-accent-4 p-3 rounded-md">
                        <article class="leading-loose flex flex-col">
                          <div class="relative">
                            <img
                              loading="lazy"
                              width="64px"
                              height="64px"
                              class="rounded-md w-full aspect-square object-cover"
                              src={song.metadata.original_song_artwork_url}
                              alt=""
                            />
                            <div class="absolute rounded-b-md bottom-0 left-0 bg-accent-12 w-full h-1/3 "></div>
                          </div>

                          <h2 class="pt-6 font-bold text-xs text-accent-12">{song?.metadata?.title}</h2>
                          <p class="text-[0.75rem] font-medium italic text-accent-9">
                            Original song by{' '}
                            <span class="text-primary-9 mt-auto">{song?.metadata?.original_song_artist_name}</span>
                          </p>
                          <p class="text-[0.75rem] leading-normal pb-6  pt-1 overflow-hidden text-ellipsis text-accent-11">
                            Curated by {song?.curator_address}
                          </p>
                          <mark class="text-[0.65rem] bg-secondary-3 px-2 font-bold rounded-md w-fit-content text-secondary-11">
                            {song?.metadata?.genre}
                          </mark>
                          <span class="mt-6 link text-[0.85rem]">Check karaoke version</span>
                          <A
                            class="opacity-0 absolute w-full h-full inset-0"
                            href={ROUTE_CATALOG_SONG_BY_ID.replace('[idSong]', song.id_karaoke_version)}
                          >
                            View karaoke version
                          </A>
                        </article>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
              <Show when={queryCatalog?.data?.length === 0}>
                <p class="text-center italic py-12 text-accent-9 text-xs">There's no song matching your search.</p>
              </Show>
            </Match>
          </Switch>
        </div>
      </main>
    </div>
  )
}
