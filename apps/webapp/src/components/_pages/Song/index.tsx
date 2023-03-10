import { A } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { ROUTE_KARAOKE_PLAY_SONG } from '~/config/routes'
import callToAction from '~/design-system/call-to-action'
import type { SongMetadata } from '~/services/superloud/catalog/getSongById'
import Support from '../Support'
interface SongProps {
  metadata: SongMetadata
}
export const Song = (props: SongProps) => {
  return (
    <>
      <div class="md:mt-7 min-h-[70vh] py-7 flex overflow-hidden relative -mx-4 px-4 bg-accent-12">
        <Show
          when={
            props?.metadata?.original_song_artwork_url &&
            props?.metadata?.original_song_artwork_url !== '' &&
            props?.metadata?.original_song_artwork_url !== null
          }
        >
          <img
            class="absolute opacity-15 w-full h-full object-cover blur-xl"
            src={props?.metadata?.original_song_artwork_url}
          />
        </Show>

        <div class="relative z-10 flex grow text-start items-center justify-end flex-col md:justify-start 2xl:justify-center 3xl:justify-start md:flex-row px-4 max-w-prose gap-y-7 gap-x-24 m-auto md:my-unset h-full w-full">
          <Show
            when={
              props?.metadata?.original_song_artwork_url &&
              props?.metadata?.original_song_artwork_url !== '' &&
              props?.metadata?.original_song_artwork_url !== null
            }
          >
            <img
              class="border border-accent-11 rounded-lg border-opacity-10 md:mie-0 shrink-0 relative w-64 h-64 aspect-square shadow-3xl"
              src={props?.metadata?.original_song_artwork_url}
            />
          </Show>
          <div class="flex overflow-hidden text-ellipsis flex-col w-full">
            <h1 class="overflow-hidden text-ellipsis flex flex-col text-3xl text-primary-1 font-bold">
              <span class="text-[0.65rem] uppercase text-primary-8 font-bold tracking-[0.25em]">Original song</span>
              <span>{props?.metadata?.original_song_title}</span>
            </h1>
            <p class="text-accent-7 overflow-hidden text-ellipsis">by {props.metadata.original_song_artist_name}</p>

            <p class="overflow-hidden text-ellipsis flex flex-col pt-7 text-xl text-primary-1 font-bold">
              <span class="text-[0.65rem] uppercase text-primary-8 font-bold tracking-[0.25em]">Karaoke version</span>
              <Show when={props?.metadata?.title !== props?.metadata?.original_song_title}>
                <span>{props?.metadata?.title}</span>
              </Show>
            </p>
            <p class="italic text-xs text-accent-8 overflow-hidden text-ellipsis">
              Curated by {props.metadata.curator_address}
            </p>
            <A
              class={callToAction({
                class: 'w-full xs:w-fit-content shadow-xl mt-5',
              })}
              href={ROUTE_KARAOKE_PLAY_SONG.replace('[idSong]', props.metadata.id_karaoke_version)}
            >
              Start singing
            </A>
          </div>
        </div>
      </div>

      <div class="flex flex-col 2xl:justify-center 3xl:justify-start relative space-y-7 divide-y divide-accent-4 w-full max-w-prose xs:px-4 pt-12 mx-auto">
        <section class="text-start">
          <h2 class="mb-4 text-2xs uppercase font-bold text-accent-10 tracking-widest">Curator notes</h2>
          <p
            classList={{
              'italic  text-accent-9 text-xs': props?.metadata?.description.trim() === '',
            }}
            class="max-w-prose prose"
          >
            <Show
              fallback={<span>The curator didn't add any notes about the karaoke version.</span>}
              when={props?.metadata?.description.trim() !== ''}
            >
              {props?.metadata?.description}
            </Show>
          </p>
        </section>
        <section class="text-start pt-7">
          <h2 class="text-2xs mb-4 uppercase font-bold text-accent-10 tracking-widest">About the original song</h2>
          <p
            classList={{
              'italic text-accent-9 text-xs': props?.metadata?.original_song?.description.trim() === '',
            }}
            class="max-w-prose prose"
          >
            <Show
              fallback={<span>There's no additional notes about the original version.</span>}
              when={props?.metadata?.original_song?.description.trim() !== ''}
            >
              {props?.metadata?.original_song?.description}
            </Show>
          </p>
        </section>

        <section class="text-start pt-7">
          <h2 class="text-2xs mb-4 uppercase font-bold text-accent-10 tracking-widest">About the collectible</h2>
          <ul>
            <li class="overflow-hidden text-ellipsis">
              Contract deployed on:{' '}
              <span class="font-bold text-primary-12 font-mono">
                {props.metadata.original_song.nftsProcessedTracksByProcessedTrackId?.nodes?.[0]?.nftByNftId?.chainId}
              </span>
            </li>
            <li class="overflow-hidden text-ellipsis">
              Contract address:{' '}
              <span class="font-bold text-primary-11 font-mono">
                {
                  props.metadata.original_song.nftsProcessedTracksByProcessedTrackId?.nodes?.[0]?.nftByNftId
                    ?.contractAddress
                }
              </span>
            </li>
          </ul>
        </section>
        <section class="text-start pt-7">
          <h2 class="text-2xs mb-4 uppercase font-bold text-accent-10 tracking-widest">Find the artist on</h2>
          <ul class="flex overflow-x-auto gap-4">
            <For each={props?.metadata?.artist_profiles}>
              {(profile) => (
                <li class="min-w-40 relative h-full focus-within:border-interactive-10 rounded-md border bg-accent-1 border-accent-4 p-6">
                  <article class="text-2xs leading-loose items-center flex flex-col">
                    <img
                      src={profile?.node?.avatarUrl}
                      loading="lazy"
                      class="rounded-full overflow-hidden w-16 h-16"
                      width="64px"
                      height="64px"
                    />
                    <p class="font-bold">{profile?.node?.name}</p>
                    <p class="text-[0.65rem] uppercase font-bold text-accent-9 tracking-widest">
                      {profile?.node?.platformId}
                    </p>
                  </article>
                  <a target="_blank" href={profile?.node?.websiteUrl} class="absolute w-full h-full opacity-0 inset-0">
                    View artist profile on {profile?.node?.platformInternalId}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </section>
        <Show when={props?.metadata?.artist_address}>
          <section class="rounded-md mx-auto bg-accent-1 p-6 !mt-24 border border-accent-4">
            <h2 class="font-bold xs:text-center text-lg text-accent-12 mb-3">Support the artist</h2>
            <Support address={props?.metadata?.artist_address} />
          </section>
        </Show>
      </div>
    </>
  )
}
