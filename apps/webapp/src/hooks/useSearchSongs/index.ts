import { createQuery } from '@tanstack/solid-query'
import searchSongs from '~/services/spinamp/songs/querySongs'
import type { Accessor } from 'solid-js'
export function useSearchSongs(args: {
  query: Accessor<string>
  offset: Accessor<number>
  first: Accessor<number>
  options: any
}) {
  const querySongsByKeyword = createQuery(
    () => ['search-songs', args?.query(), args?.offset(), args?.first()],
    async () => {
      try {
        const result = await searchSongs({
          query: args?.query(),
          offset: args?.offset(),
          first: args?.first(),
        })
        return result
      } catch (e) {
        console.error(e)
      }
    },
    args?.options,
  )

  return {
    querySongsByKeyword,
  }
}

export default useSearchSongs
