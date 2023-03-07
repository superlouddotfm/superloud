import { A } from 'solid-start'
import { ROUTE_CATALOG_SONG_BY_ID } from '~/config/routes'

export const CardSong = (props) => {
  return (
    <article class="leading-loose flex flex-col">
      <div class="relative">
        <img
          loading="lazy"
          width="64px"
          height="64px"
          class="rounded-md w-full aspect-square object-cover"
          src={props?.song.metadata.original_song_artwork_url}
          alt=""
        />
      </div>

      <h2 class="pt-6 font-bold text-xs text-accent-12">{props?.song?.metadata?.title}</h2>
      <p class="text-[0.75rem] font-medium italic text-accent-9">
        Original song by <span class="text-primary-9 mt-auto">{props?.song?.metadata?.original_song_artist_name}</span>
      </p>
      <p class="text-[0.75rem] leading-normal pb-6  pt-1 overflow-hidden text-ellipsis text-accent-11">
        Curated by {props?.song?.curator_address}
      </p>
      <mark class="text-[0.65rem] bg-secondary-3 px-2 font-bold rounded-md w-fit-content text-secondary-11">
        {props?.song?.metadata?.genre}
      </mark>
      <span class="mt-6 link text-[0.85rem]">Check karaoke version</span>
      <A
        class="opacity-0 absolute w-full h-full inset-0"
        href={ROUTE_CATALOG_SONG_BY_ID.replace('[idSong]', props?.song.id_karaoke_version)}
      >
        View karaoke version
      </A>
    </article>
  )
}

export default CardSong
