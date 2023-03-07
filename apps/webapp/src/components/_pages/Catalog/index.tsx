import { For } from 'solid-js'
import CardSong from './CardSong'

export const Catalog = (props) => {
  return (
    <ul class="gap-4 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
      <For each={props?.songs}>
        {(song) => (
          <li class="relative border h-full bg-accent-1 border-accent-4 p-3 rounded-md">
            <CardSong song={song} />
          </li>
        )}
      </For>
    </ul>
  )
}

export default Catalog
