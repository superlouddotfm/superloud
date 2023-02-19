import { For } from 'solid-js'
import OriginalSongPreview from './OriginalSongPreview'

interface ListOriginalSongsProps {
  storeForm: any
  list: Array<any>
}

export const ListOriginalSongs = (props: ListOriginalSongsProps) => {
  return (
    <div class="group mt-2 gap-2 px-6 flex snap-mandatory snap-x overflow-x-scroll max-w-56 mx-auto 2xs:max-w-72 xs:max-w-screen-2xs py-4">
      <For each={props.list}>
        {(song) => (
          <div class="relative transition-all flex flex-col p-4 w-48 bg-white border-accent-4 border focus-within:ring-4 focus-within:border-interactive-4 focus-within:ring-offset-2 focus-within:ring-interactive-5 hover:shadow-lg hover:-translate-y-2 rounded-md snap-center shrink-0">
            <OriginalSongPreview song={song} storeForm={props.storeForm} />
          </div>
        )}
      </For>
    </div>
  )
}
