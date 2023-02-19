import { Match, Switch, createEffect, createSignal } from 'solid-js'
import FormInput from '~/components/system/FormInput'
import useSearchSongs from '~/hooks/useSearchSongs'
import { debounce } from '@solid-primitives/scheduled'
import FormField from '~/components/system/FormField'
import { ListOriginalSongs } from './ListOriginalSongs'

interface SearchSongProps {
  storeForm: any
}
export const SearchSong = (props: SearchSongProps) => {
  const [debouncedSearchQueryValue, setDebouncedSearchQueryValue] = createSignal(
    props.storeForm.data().text_query_search_song_by_keyword,
  )
  const [first, setFirst] = createSignal(30)
  const [offset, setOffset] = createSignal(0)
  const { querySongsByKeyword } = useSearchSongs({
    query: debouncedSearchQueryValue,
    offset: offset,
    first: first,
    options: {
      refetchOnWindowFocus: false,
      get enabled() {
        return debouncedSearchQueryValue() &&
          debouncedSearchQueryValue()?.length &&
          debouncedSearchQueryValue()?.trim() !== ''
          ? true
          : false
      },
    },
  })
  const trigger = debounce((value: string) => setDebouncedSearchQueryValue(value), 1150)
  createEffect(() => {
    if (
      props.storeForm.data().text_query_search_song_by_keyword &&
      props.storeForm.data().text_query_search_song_by_keyword?.length
    )
      trigger(props.storeForm.data().text_query_search_song_by_keyword)
  })

  return (
    <>
      <div class="flex justify-center">
        <FormField>
          <FormField.Label
            hasError={false}
            class="justify-center !text-[0.75rem]"
            for="text_query_search_song_by_keyword"
          >
            Search a song
          </FormField.Label>

          <FormInput name="text_query_search_song_by_keyword" hasError={false} type="search" scale="sm" />
        </FormField>
      </div>
      <Switch>
        <Match
          when={
            !props.storeForm.data()?.text_query_search_song_by_keyword ||
            props.storeForm.data()?.text_query_search_song_by_keyword?.trim() === ''
          }
        >
          <div class="mt-6 animate-appear text-center italic text-accent-9 text-xs">
            <p>Use the search bar above to find a song indexed by Spinamp</p>
          </div>
        </Match>
        <Match
          when={
            querySongsByKeyword?.isLoading &&
            props.storeForm.data()?.text_query_search_song_by_keyword &&
            props.storeForm.data()?.text_query_search_song_by_keyword?.trim() !== ''
          }
        >
          <div class="mt-2 animate-appear min-h-[28rem] flex items-center justify-center">
            <p class="text-text-accent-9 text-xs animate-pulse text-center">
              Searching songs for "{props.storeForm.data().text_query_search_song_by_keyword}"
            </p>
          </div>
        </Match>
        <Match
          when={
            querySongsByKeyword?.isSuccess && querySongsByKeyword?.data?.data?.allProcessedTracks?.edges?.length === 0
          }
        >
          <div class="mt-2 animate-appear text-center italic text-accent-9 text-xs">
            <p>No songs relevant for "{props.storeForm.data().text_query_search_song_by_keyword}"</p>
          </div>
        </Match>
        <Match
          when={
            querySongsByKeyword?.isSuccess && querySongsByKeyword?.data?.data?.allProcessedTracks?.edges?.length > 0
          }
        >
          <div class="animate-appear">
            <ListOriginalSongs
              storeForm={props.storeForm}
              list={querySongsByKeyword?.data?.data?.allProcessedTracks?.edges}
            />
          </div>
        </Match>
      </Switch>
    </>
  )
}
