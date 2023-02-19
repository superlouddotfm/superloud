import { ethers } from 'ethers'
import { For, Match, Show, splitProps, Switch } from 'solid-js'
import Button from '~/components/system/Button'
import FormField from '~/components/system/FormField'
import FormInput from '~/components/system/FormInput'
import FormInputSwitch from '~/components/system/FormInputSwitch'
import FormSelect from '~/components/system/FormSelect'
import FormTextarea from '~/components/system/FormTextarea'
import { IconFolderOpen, IconSingingMic } from '~/components/system/Icons'
import { MUSIC_GENRE } from '~/config/musicGenres'
import { useAuthentication } from '~/hooks/useAuthentication'
import useSongsByArtistAddress from '~/hooks/useSongsByArtistAddress'
import { ListOriginalSongs } from './ListOriginalSongs'
import PreviewKaraoke from './PreviewKaraoke'
import { SearchSong } from './SearchSong'

interface FormListSongProps {
  storeForm: any
  apiTabs: any
  apiAccordion: any
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
}

export const FormListSong = (props: FormListSongProps) => {
  //@ts-ignore
  const { currentUser } = useAuthentication()
  const [local] = splitProps(props, ['storeForm', 'apiAccordion', 'apiTabs', 'isLoading', 'isError', 'isSuccess'])
  //@ts-ignore
  const { form } = local.storeForm
  const { querySongsByArtistAddress } = useSongsByArtistAddress({
    address: currentUser()?.address,
    offset: 0,
    first: 100,
    options: {
      refetchOnWindowFocus: false,
      get enabled() {
        return currentUser()?.address ? true : false
      },
    },
  })
  return (
    <>
      {/* @ts-ignore */}
      <Show when={!ethers.utils.isAddress(currentUser()?.address)}>
        <p class="animate-appear text-start xs:text-center mt-6 mb-4 font-medium text-2xs bg-secondary-3 py-2 rounded-md mx-auto w-fit-content px-4 text-secondary-11">
          Sign-in to get started.
        </p>
      </Show>
      {/* @ts-ignore */}
      <form use:form>
        <div class="border bg-accent-1 divide-y divide-neutral-4 rounded-md border-neutral-4 mb-8">
          <fieldset
            {...local
              .apiAccordion()
              .getItemProps({ value: 'source', disabled: !ethers.utils.isAddress(currentUser()?.address) })}
          >
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('source'),
                  'text-accent-6': !local.apiAccordion().value.includes('source'),
                }}
                class="pie-1ex"
              >
                #
              </span>
              <legend>Source</legend>
              <button
                class="disabled:cursor-not-allowed absolute inset-0 w-full h-full opacity-0"
                {...local
                  .apiAccordion()
                  .getTriggerProps({ value: 'source', disabled: !ethers.utils.isAddress(currentUser()?.address) })}
              >
                Toggle "Source" section
              </button>
            </div>

            <div
              class="pt-1.5 pb-6 px-3 sm:px-6"
              {...local
                .apiAccordion()
                .getContentProps({ value: 'source', disabled: !ethers.utils.isAddress(currentUser()?.address) })}
            >
              <div class="px-3 py-6 bg-accent-2 overflow-hidden rounded-md">
                <span class="block text-center text-xs text-accent-9 font-medium">Select one of your songs</span>
                <div class="w-full pb-6 border-accent-4 border-b">
                  <Switch>
                    <Match when={querySongsByArtistAddress.isLoading && currentUser()?.address}>
                      <div class="animate-appear min-h-[28rem] flex items-center justify-center">
                        <p class="text-text-accent-9 text-xs animate-pulse text-center">Checking your songs...</p>
                      </div>
                    </Match>
                    <Match
                      when={
                        querySongsByArtistAddress.isSuccess &&
                        querySongsByArtistAddress?.data?.data?.allProcessedTracks?.edges?.length === 0
                      }
                    >
                      <p class="text-center italic text-accent-9 text-sm text-opacity-75">
                        Looks like you don't have any songs listed on the Spinamp API.
                      </p>
                    </Match>
                    <Match
                      when={
                        querySongsByArtistAddress.isSuccess &&
                        //@ts-ignore
                        querySongsByArtistAddress?.data?.data?.allProcessedTracks?.edges?.length > 0
                      }
                    >
                      <ListOriginalSongs
                        storeForm={props.storeForm}
                        //@ts-ignore
                        list={querySongsByArtistAddress?.data?.data?.allProcessedTracks?.edges}
                      />
                    </Match>
                  </Switch>
                </div>

                <span class="pt-6 pb-4 block text-center text-2xs text-accent-9 font-medium">
                  Or curate an existing song indexed on Spinamp
                </span>
                <SearchSong storeForm={props.storeForm} />
              </div>
            </div>
          </fieldset>
          <fieldset
            class="disabled:opacity-50 disabled:cursor-not-allowed"
            {...local.apiAccordion().getItemProps({
              value: 'info',
              disabled:
                !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                  ? true
                  : false,
            })}
          >
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('info'),
                  'text-accent-6': !local.apiAccordion().value.includes('info'),
                }}
                class="pie-1ex"
              >
                #
              </span>

              <legend>Karaoke version info</legend>
              <button
                class="absolute disabled:cursor-not-allowed z-10 inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({
                  value: 'info',
                  disabled:
                    !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                      ? true
                      : false,
                })}
              >
                Toggle "Info" section
              </button>
            </div>
            <div
              class="pt-1.5 space-y-4 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({
                value: 'info',
                disabled:
                  !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                    ? true
                    : false,
              })}
            >
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={local.storeForm.errors()?.title?.length > 0 ? true : false} for="title">
                    Song title
                  </FormField.Label>
                  <FormField.Description id="title-description">The title of the song.</FormField.Description>
                  <FormInput
                    placeholder="eg: Dope song [REMIX]"
                    name="title"
                    id="title"
                    hasError={local.storeForm.errors()?.title?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={local.storeForm.errors()?.genre?.length > 0 ? true : false} for="genre">
                    Genre
                  </FormField.Label>
                  <FormField.Description id="genre-description">
                    The genre of this karaoke version.
                  </FormField.Description>
                  <FormSelect hasError={local.storeForm.errors()?.genre?.length > 0 ? true : false} name="genre">
                    <option disabled>Select a genre</option>

                    <For each={MUSIC_GENRE}>{(genre) => <option value={genre.value}>{genre.label}</option>}</For>
                  </FormSelect>
                </FormField.InputField>
              </FormField>
              <FormField>
                <FormField.InputField>
                  <FormField.Label
                    hasError={local.storeForm.errors()?.description?.length > 0 ? true : false}
                    for="description"
                  >
                    Description
                  </FormField.Label>
                  <FormField.Description id="description-description">
                    A description of the karaoke version.
                  </FormField.Description>
                  <FormTextarea
                    placeholder="eg: This remix of Dope song has that slowed/reverb thing and more backing vocals. Try to make a perfect score !"
                    name="description"
                    id="description"
                    rows="10"
                    hasError={local.storeForm.errors()?.description?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
            </div>
          </fieldset>

          <fieldset
            class="disabled:opacity-50 disabled:cursor-not-allowed"
            {...local.apiAccordion().getItemProps({
              value: 'files',
              disabled:
                !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                  ? true
                  : false,
            })}
          >
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('files'),
                  'text-accent-6': !local.apiAccordion().value.includes('files'),
                }}
                class="pie-1ex"
              >
                #
              </span>
              <legend>Files upload</legend>
              <button
                class="disabled:cursor-not-allowed absolute inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({
                  value: 'files',
                  disabled:
                    !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                      ? true
                      : false,
                })}
              >
                Toggle "Files" section
              </button>
            </div>
            <div
              class="pt-1.5 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({
                value: 'files',
                disabled:
                  !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                    ? true
                    : false,
              })}
            >
              <div class="border rounded-md border-accent-5 overflow-hidden" {...local.apiTabs().rootProps}>
                <div class="flex divide-i divide-accent-5 border-b border-accent-5" {...local.apiTabs().tablistProps}>
                  <button
                    class="flex items-center bg-accent-1 not:data-[selected]:bg-transparent data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50 p-8"
                    {...local.apiTabs().getTriggerProps({
                      value: 'upload-files',
                      disabled:
                        !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                          ? true
                          : false,
                    })}
                  >
                    <IconFolderOpen class="w-4 h-4 mie-1ex" />
                    Upload files
                  </button>
                  <button
                    class="flex items-center bg-accent-1 not:data-[selected]:bg-transparent data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50"
                    {...local.apiTabs().getTriggerProps({
                      value: 'karaoke-preview',
                      disabled: !local.storeForm?.data()?.id_original_song
                        ? true
                        : false ||
                          !local.storeForm?.data()?.isolated_instrumental_track_uri ||
                          !local.storeForm?.data()?.lrc_uri ||
                          !local.storeForm?.data()?.isolated_vocal_track_uri,
                    })}
                  >
                    <IconSingingMic class="w-4 h-4 mie-1ex" />
                    Preview karaoke mode
                  </button>
                </div>

                <div
                  class="p-0.5 xs:p-4 bg-white"
                  {...local.apiTabs().getContentProps({
                    value: 'upload-files',
                    disabled:
                      !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                        ? true
                        : false,
                  })}
                >
                  <div class="space-y-4 p-3">
                    <div class="relative text-center">
                      <FormField>
                        <FormField.Label
                          hasError={local.storeForm.errors()?.isolated_vocal_track_file?.length > 0 ? true : false}
                          for="isolated_vocal_track_file"
                        >
                          Isolated vocals track
                        </FormField.Label>

                        <div class="bg-accent-1 border-accent-6 border-dashed border-2 focus-within:ring-4 p-6 rounded-md">
                          <input
                            onChange={(e) => {
                              // local URI
                              //@ts-ignore
                              if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                                //@ts-ignore
                                const src = URL.createObjectURL(e.currentTarget.files[0])
                                local.storeForm.setData('isolated_vocal_track_uri', src)
                              }
                            }}
                            accept="audio/*"
                            class="absolute opacity-0 w-full h-full z-10 inset-0"
                            type="file"
                            id="isolated_vocal_track_file"
                            name="isolated_vocal_track_file"
                          />

                          <Show when={!local.storeForm?.data()?.isolated_vocal_track_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              🗣️🎤
                            </span>
                            <span class="italic text-xs text-accent-9">
                              Pick the isolated vocal track in your files
                            </span>
                          </Show>
                          <Show
                            when={
                              !local.storeForm?.data()?.isolated_vocal_track_uri &&
                              !local.storeForm?.data()?.isolated_vocal_track_file
                            }
                          >
                            <IconFolderOpen class="mx-auto text-accent-9 text-opacity-50 mt-4 h-8 w-8" />
                          </Show>

                          <Show when={local.storeForm.data()?.isolated_vocal_track_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              🗣️🎤
                            </span>
                            <span class="italic text-xs text-accent-9">Isolated vocal track audio file</span>
                            <audio
                              class="mx-auto relative z-20"
                              controls
                              src={local.storeForm.data()?.isolated_vocal_track_uri}
                            />
                          </Show>
                          <Show
                            when={
                              local.storeForm.data()?.isolated_vocal_track_file &&
                              local.storeForm.data()?.isolated_vocal_track_uri
                            }
                          >
                            <code class="pt-3 block font-bold text-sm text-accent-11">
                              {local.storeForm.data()?.isolated_vocal_track_file?.name}
                            </code>
                          </Show>
                        </div>
                      </FormField>
                    </div>

                    <div class="relative text-center">
                      <FormField>
                        <FormField.Label
                          hasError={
                            local.storeForm.errors()?.isolated_instrumental_track_file?.length > 0 ? true : false
                          }
                          for="isolated_instrumental_track_file"
                        >
                          Isolated instrumental track
                        </FormField.Label>

                        <div class="bg-accent-1 border-accent-6 border-dashed border-2 focus-within:ring-4 p-6 rounded-md">
                          <input
                            onChange={(e) => {
                              // local URI
                              //@ts-ignore
                              if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                                //@ts-ignore
                                const src = URL.createObjectURL(e.currentTarget.files[0])
                                local.storeForm.setData('isolated_instrumental_track_uri', src)
                              }
                            }}
                            accept="audio/*"
                            class="absolute opacity-0 w-full h-full z-10 inset-0"
                            type="file"
                            id="isolated_instrumental_track_file"
                            name="isolated_instrumental_track_file"
                          />
                          <Show when={!local.storeForm?.data()?.isolated_instrumental_track_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              🎸 🥁 🎹 🎷
                            </span>
                            <span class="italic text-xs text-accent-9">
                              Pick the isolated instrumental track in your files
                            </span>
                          </Show>
                          <Show
                            when={
                              !local.storeForm?.data()?.isolated_instrumental_track_uri &&
                              !local.storeForm?.data()?.isolated_instrumental_track_file
                            }
                          >
                            <IconFolderOpen class="mx-auto text-accent-9 text-opacity-50 mt-4 h-8 w-8" />
                          </Show>

                          <Show when={local.storeForm.data()?.isolated_instrumental_track_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              🎸 🥁 🎹 🎷
                            </span>
                            <span class="italic text-xs text-accent-9">Isolated instrumental track audio file</span>
                            <audio
                              class="mx-auto relative z-20"
                              controls
                              src={local.storeForm.data()?.isolated_instrumental_track_uri}
                            />
                          </Show>
                          <Show
                            when={
                              local.storeForm.data()?.isolated_instrumental_track_file &&
                              local.storeForm.data()?.isolated_instrumental_track_uri
                            }
                          >
                            <code class="pt-3 block font-bold text-sm text-accent-11">
                              {local.storeForm.data()?.isolated_instrumental_track_file?.name}
                            </code>
                          </Show>
                        </div>
                      </FormField>
                    </div>

                    <div class="relative text-center">
                      <FormField>
                        <FormField.Label
                          hasError={local.storeForm.errors()?.isolated_vocal_track_file?.length > 0 ? true : false}
                          for="isolated_vocal_track_file"
                        >
                          LRC file (lyrics)
                        </FormField.Label>
                        <div class="bg-accent-1 border-accent-6 border-dashed border-2 focus-within:ring-4 p-6 rounded-md">
                          <input
                            onChange={(e) => {
                              // local URI
                              //@ts-ignore
                              if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                                //@ts-ignore
                                const src = URL.createObjectURL(e.currentTarget.files[0])
                                local.storeForm.setData('lrc_uri', src)
                              }
                            }}
                            accept=".lrc"
                            class="absolute opacity-0 w-full h-full z-10 inset-0"
                            type="file"
                            id="lrc_file"
                            name="lrc_file"
                          />
                          <Show when={!local.storeForm?.data()?.lrc_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              📄
                            </span>
                            <span class="italic text-xs text-accent-9">
                              Pick the <code>.lrc</code> file that synchronizes the lyrics to the music in your files
                            </span>
                          </Show>
                          <Show when={!local.storeForm?.data()?.lrc_uri && !local.storeForm?.data()?.lrc_file}>
                            <IconFolderOpen class="mx-auto text-accent-9 text-opacity-50 mt-4 h-8 w-8" />
                          </Show>
                          <Show when={local.storeForm.data()?.lrc_uri}>
                            <span class="block mb-1.5 text-2xl" aria-hidden="true">
                              📄
                            </span>
                            <br />
                            <Show when={local.storeForm.data()?.lrc_file && local.storeForm.data()?.lrc_uri}>
                              <span class="block italic pb-1.5 text-xs text-accent-9">LRC file picked</span>
                              <code class="block font-bold text-sm text-accent-11">
                                {local.storeForm.data()?.lrc_file?.name}
                              </code>
                            </Show>
                            <Show when={!local.storeForm?.data()?.lrc_file && local.storeForm.data()?.lrc_uri}>
                              <span class="block italic pb-1.5 text-xs text-accent-9">
                                LRC file available at this URI:
                              </span>
                              <code class="block italic pb-1.5 font-bold text-sm text-accent-11">
                                {local.storeForm.data()?.lrc_uri}
                              </code>
                            </Show>
                          </Show>
                        </div>
                      </FormField>
                    </div>
                    <Switch>
                      <Match
                        when={
                          !local.storeForm?.data()?.isolated_instrumental_track_uri ||
                          !local.storeForm?.data()?.lrc_uri ||
                          !local.storeForm?.data()?.isolated_vocal_track_uri
                        }
                      >
                        <p class="text-start xs:text-center mt-6 mb-4 font-medium text-2xs bg-secondary-3 py-2 rounded-md mx-auto w-fit-content px-4 text-secondary-11">
                          Make sure to upload the instrumental track, vocal track, and lrc file to unlock the karaoke
                          preview.
                        </p>
                      </Match>
                      <Match
                        when={
                          local.storeForm.data()?.isolated_instrumental_track_uri &&
                          local.storeForm.data()?.lrc_uri &&
                          local.storeForm.data()?.isolated_vocal_track_uri
                        }
                      >
                        <div class="flex flex-col space-y-2 text-start xs:text-center mt-6 mb-4 font-medium text-2xs bg-interactive-3 py-2 rounded-md mx-auto w-fit-content px-4 text-interactive-11">
                          <p>Don't forget to check the karaoke preview in the "Preview karaoke mode" tab !</p>
                          <Button
                            class="mx-auto"
                            scale="xs"
                            type="button"
                            intent="neutral-on-light-layer"
                            {...local.apiTabs().getTriggerProps({
                              value: 'karaoke-preview',
                            })}
                          >
                            Open preview
                          </Button>
                        </div>
                      </Match>
                    </Switch>
                  </div>
                </div>
                <div class="p-0.5 xs:p-4 bg-white" {...local.apiTabs().getContentProps({ value: 'karaoke-preview' })}>
                  <Show
                    when={
                      local.storeForm.data()?.isolated_instrumental_track_uri &&
                      local.storeForm.data()?.lrc_uri &&
                      local.storeForm.data()?.isolated_vocal_track_uri
                    }
                  >
                    <PreviewKaraoke
                      configKaraokeControls={{
                        isPlaying: false,
                        time: {
                          disableControls: false,
                          initialValue: 0,
                        },
                        vocals: {
                          uriFile: local.storeForm.data()?.isolated_vocal_track_uri,
                          disableControls: false,
                          volume: {
                            disableControls: false,
                            initialValue: 1,
                          },
                        },
                        instrumental: {
                          uriFile: local.storeForm.data()?.isolated_instrumental_track_uri,
                          volume: {
                            disableControls: false,
                            initialValue: 1,
                          },
                        },
                        lyrics: {
                          display: true,
                          uriFile: local.storeForm.data()?.lrc_uri,
                        },
                        recording: {
                          shouldRecord: false,
                          disableControls: true,
                        },
                      }}
                    />
                  </Show>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset
            class="disabled:opacity-50 disabled:cursor-not-allowed"
            {...local.apiAccordion().getItemProps({
              value: 'visibility',
              disabled:
                !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                  ? true
                  : false,
            })}
          >
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('visibility'),
                  'text-accent-6': !local.apiAccordion().value.includes('visibility'),
                }}
                class="pie-1ex"
              >
                #
              </span>
              <legend>Visibility</legend>
              <button
                class="disabled:cursor-not-allowed absolute inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({
                  value: 'visibility',
                  disabled:
                    !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                      ? true
                      : false,
                })}
              >
                Toggle "Visibility" section
              </button>
            </div>
            <div
              class="pt-1.5 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({
                value: 'visibility',
                disabled:
                  !ethers.utils.isAddress(currentUser()?.address) || !local.storeForm?.data()?.id_original_song
                    ? true
                    : false,
              })}
            >
              {' '}
              <FormField>
                <FormField.InputField>
                  <FormInputSwitch
                    id="is_listed"
                    name="is_listed"
                    label="List on catalog"
                    helpText="Disabling this option will make this song invisible on the catalog."
                    hasError={local.storeForm.errors()?.is_listed?.length > 0 ? true : false}
                    checked={local.storeForm.data()?.is_listed}
                  />
                </FormField.InputField>
              </FormField>
              <input disabled hidden name="lrc_uri" />
              <input disabled hidden name="isolated_vocal_track_uri" />
              <input disabled hidden name="isolated_instrumental_track_uri" />
              <input disabled hidden name="id_original_song" />
            </div>
          </fieldset>
        </div>

        <Button
          disabled={
            local.isLoading ||
            !local.storeForm.data()?.id_original_song ||
            !local.storeForm.data()?.lrc_uri ||
            !local.storeForm.data()?.isolated_vocal_track_uri ||
            !local.storeForm.data()?.isolated_instrumental_track_uri
          }
          type="submit"
        >
          <Switch fallback="Create">
            <Match when={local.isError}>Try again</Match>
            <Match when={local.isLoading}>Creating...</Match>
            <Match when={local.isSuccess}>Create a new one</Match>
          </Switch>
        </Button>
      </form>
    </>
  )
}

export default FormListSong
