import { debounce } from '@solid-primitives/scheduled'
import { createQuery } from '@tanstack/solid-query'
import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'
import FormInput from '~/components/system/FormInput'
import { Catalog } from '~/components/_pages/Catalog'
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
      <div class="max-w-prose w-full mx-auto">
        <h1 class="text-start xs:text-center text-2xl text-neutral-9 font-bold mb-1">Be Superloud.</h1>
      </div>
      <main>
        <div class="max-w-prose w-full mx-auto">
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
        <div class="pt-20 w-full mx-auto 2xs:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl">
          <Switch>
            <Match when={queryCatalog.isError}>Something went wrong</Match>
            <Match when={queryCatalog.isLoading}>
              <p class="font-bold animate-pulse py-12 text-center">Searching for songs...</p>
            </Match>
            <Match when={queryCatalog.isSuccess}>
              <Show when={queryCatalog?.data?.length > 0}>
                <Catalog songs={queryCatalog?.data} />
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
