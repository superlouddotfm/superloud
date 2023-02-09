import { Match, Show, splitProps, Switch } from 'solid-js'
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'
import Button from '~/components/system/Button'
import FormField from '~/components/system/FormField'
import FormInput from '~/components/system/FormInput'
import FormInputSwitch from '~/components/system/FormInputSwitch'
import FormTextarea from '~/components/system/FormTextarea'
import PreviewKaraoke from './PreviewKaraoke'

interface FormListSongProps {
  storeForm: any
}
export const FormListSong = (props: FormListSongProps) => {
  const [local] = splitProps(props, ['storeForm'])
  const { form, errors, data, setData, invalid } = local.storeForm
  const [stateTabs, send] = useMachine(tabs.machine({ id: createUniqueId(), value: 'upload-files' }))
  const api = createMemo(() => tabs.connect(stateTabs, send, normalizeProps))

  return (
    <>
      <div class="text-xs space-y-1 mb-4">
        <p class="text-start">
          To create a karaoke version of a song and list it on the Superloud catalog, you will need to isolate both the
          instrumental and vocal tracks and to create a LRC file.
        </p>
        <p class="text-start">
          To isolate the audio tracks, you can use tools like{' '}
          <a rel="noreferrer nofollow" target="_blank" href="https://vocalremover.org">
            Vocalremover
          </a>
          ,{' '}
          <a
            href="https://www.lalal.ai/?referral=RLmCbtAn&utm_source=referral_promo&utm_medium=link&utm_campaign=RLmCbtAn"
            rel="noreferrer nofollow"
            target="_blank"
          >
            Lalal.ai
          </a>
          <a rel="noreferrer nofollow" target="_blank" href="https://x-minus.pro/">
            X-Minus Pro
          </a>
          , <a href="https://www.notta.ai/en/tools/online-vocal-remover">Notta AI</a>...
        </p>
        <p class="text-start">
          An{' '}
          <a rel="noreferrer nofollow" target="_blank" href="https://en.wikipedia.org/wiki/LRC_(file_format)">
            LRC file
          </a>{' '}
          is a file that will synchronize the song lyrics to audio. You can use different online tools, like{' '}
          <a href="https://lrc-maker.github.io/#/" rel="noreferrer nofollow" target="_blank">
            Akari's LRC Maker
          </a>{' '}
          or{' '}
          <a rel="noreferrer nofollow" target="_blank" href="https://lrcgenerator.com/">
            LRCGenerator
          </a>
          .
        </p>
      </div>
      {/* @ts-ignore */}
      <form use:form>
        <div class="space-y-4 pb-8">
          <fieldset>
            <legend class="sr-only">Info</legend>
            <div class="space-y-4">
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={errors()?.title?.length > 0 ? true : false} for="title">
                    Song title
                  </FormField.Label>
                  <FormField.Description id="title-description">The title of the song.</FormField.Description>
                  <FormInput
                    placeholder="eg: Dope song [REMIX]"
                    name="title"
                    id="title"
                    hasError={errors()?.title?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={errors()?.title?.length > 0 ? true : false} for="title">
                    Description
                  </FormField.Label>
                  <FormField.Description id="title-description">The title of the song.</FormField.Description>
                  <FormTextarea
                    placeholder="eg: This remix of Dope song has that slowed/reverb thing and more backing vocals. Try to make a perfect score !"
                    name="title"
                    id="title"
                    rows="10"
                    hasError={errors()?.title?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
            </div>
          </fieldset>

          <fieldset>
            <legend class="sr-only">Tracks and lyrics</legend>
            <div class="border rounded border-neutral-2" {...api().rootProps}>
              <div class="flex divide-i divide-neutral-2  border-b border-neutral-2" {...api().tablistProps}>
                <button
                  class="bg-neutral-1 data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50 p-8"
                  {...api().getTriggerProps({ value: 'upload-files' })}
                >
                  Upload files
                </button>
                <button
                  class="bg-neutral-1 data-[selected]:bg-white py-2 px-4 font-semibold text-2xs disabled:opacity-50"
                  {...api().getTriggerProps({
                    value: 'karaoke-preview',
                    disabled:
                      !data()?.isolated_instrumental_track_uri || !data()?.lrc_uri || !data()?.isolated_vocal_track_uri,
                  })}
                >
                  Preview karaoke mode
                </button>
              </div>

              <div class="p-4 bg-white" {...api().getContentProps({ value: 'upload-files' })}>
                <div class="space-y-4">
                  <div class="relative">
                    <FormField>
                      <FormField.Label
                        hasError={errors()?.isolated_vocal_track_file?.length > 0 ? true : false}
                        for="isolated_vocal_track_file"
                      >
                        Isolated vocals track
                      </FormField.Label>
                      <div class="border-2 border-neutral-2 focus-within:border-neutral-3 border-dashed p-6 rounded-md">
                        <input
                          onChange={(e) => {
                            // local URI
                            //@ts-ignore
                            if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                              //@ts-ignore
                              const src = URL.createObjectURL(e.currentTarget.files[0])
                              setData('isolated_vocal_track_uri', src)
                            }
                          }}
                          accept="audio/*"
                          class="absolute opacity-0 w-full h-full z-10 inset-0"
                          type="file"
                          id="isolated_vocal_track_file"
                          name="isolated_vocal_track_file"
                        />
                        <Show when={!data()?.isolated_vocal_track_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            🗣️🎤
                          </span>
                          <span class="italic text-xs text-neutral-6">Pick the isolated vocal track in your files</span>
                        </Show>
                        <Show when={data()?.isolated_vocal_track_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            🗣️🎤
                          </span>
                          <span class="italic text-xs text-neutral-6">Isolated vocal track audio file</span>
                          <audio class="mx-auto relative z-20" controls src={data()?.isolated_vocal_track_uri} />
                        </Show>
                      </div>
                    </FormField>
                  </div>

                  <div class="relative">
                    <FormField>
                      <FormField.Label
                        hasError={errors()?.isolated_instrumental_track_file?.length > 0 ? true : false}
                        for="isolated_instrumental_track_file"
                      >
                        Isolated instrumental track
                      </FormField.Label>
                      <div class="border-2 border-neutral-2 focus-within:border-neutral-3 border-dashed p-6 rounded-md">
                        <input
                          onChange={(e) => {
                            // local URI
                            //@ts-ignore
                            if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                              //@ts-ignore
                              const src = URL.createObjectURL(e.currentTarget.files[0])
                              setData('isolated_instrumental_track_uri', src)
                            }
                          }}
                          accept="audio/*"
                          class="absolute opacity-0 w-full h-full z-10 inset-0"
                          type="file"
                          id="isolated_instrumental_track_file"
                          name="isolated_instrumental_track_file"
                        />
                        <Show when={!data()?.isolated_instrumental_track_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            🎸 🥁 🎹 🎷
                          </span>
                          <span class="italic text-xs text-neutral-6">
                            Pick the isolated instrumental track in your files
                          </span>
                        </Show>
                        <Show when={data()?.isolated_instrumental_track_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            🎸 🥁 🎹 🎷
                          </span>
                          <span class="italic text-xs text-neutral-6">Isolated instrumental track audio file</span>
                          <audio class="mx-auto relative z-20" controls src={data()?.isolated_instrumental_track_uri} />
                        </Show>
                      </div>
                    </FormField>
                  </div>

                  <div class="relative">
                    <FormField>
                      <FormField.Label
                        hasError={errors()?.isolated_vocal_track_file?.length > 0 ? true : false}
                        for="isolated_vocal_track_file"
                      >
                        LRC file (lyrics)
                      </FormField.Label>
                      <div class="border-2 border-neutral-2 focus-within:border-neutral-3 border-dashed p-6 rounded-md">
                        <input
                          onChange={(e) => {
                            // local URI
                            //@ts-ignore
                            if (e.currentTarget.files[0] && e.currentTarget.files[0] !== null) {
                              //@ts-ignore
                              const src = URL.createObjectURL(e.currentTarget.files[0])
                              setData('lrc_uri', src)
                            }
                          }}
                          accept=".lrc"
                          class="absolute opacity-0 w-full h-full z-10 inset-0"
                          type="file"
                          id="lrc_file"
                          name="lrc_file"
                        />
                        <Show when={!data()?.lrc_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            📄
                          </span>
                          <span class="italic text-xs text-neutral-6">
                            Pick the <code>.lrc</code> file that synchronizes the lyrics to the music in your files
                          </span>
                        </Show>
                        <Show when={data()?.lrc_uri}>
                          <span class="block mb-1.5 text-2xl" aria-hidden="true">
                            📄
                          </span>
                          <br />
                          <Switch>
                            <Match when={data()?.lrc_file && data()?.lrc_uri}>
                              <span class="italic pb-3 text-xs text-neutral-6">LRC file picked</span>
                              <code class="font-bold text-sm text-neutral-8">{data()?.lrc_file?.name}</code>
                            </Match>
                          </Switch>
                          <Show when={!data()?.lrc_file && data()?.lrc_uri}>
                            <span class="italic pb-3 text-xs text-neutral-6">LRC file available at this URI:</span>
                            <code class="font-bold text-sm text-neutral-8">{data()?.lrc_uri}</code>
                          </Show>
                        </Show>
                      </div>
                    </FormField>
                  </div>
                  <Switch>
                    <Match
                      when={
                        !data()?.isolated_instrumental_track_uri ||
                        !data()?.lrc_uri ||
                        !data()?.isolated_vocal_track_uri
                      }
                    >
                      <p class="mt-6 mb-4 font-medium text-sm bg-secondary-1 py-0.5 rounded-md mx-auto w-fit-content px-1.5 text-secondary-6">
                        Make sure to upload the instrumental track, vocal track, and lrc file to unlock the karaoke
                        preview.
                      </p>
                    </Match>
                    <Match
                      when={
                        data()?.isolated_instrumental_track_uri && data()?.lrc_uri && data()?.isolated_vocal_track_uri
                      }
                    >
                      <p class="mt-6 mb-4 font-medium text-sm bg-interactive-1 py-0.5 rounded-md mx-auto w-fit-content px-1.5 text-interactive-6">
                        Don't forget to check the karaoke preview in the "Preview karaoke mode" tab!
                      </p>
                    </Match>
                  </Switch>
                </div>
              </div>
              <div class="p-4 relative bg-white" {...api().getContentProps({ value: 'karaoke-preview' })}>
                <Show
                  when={data()?.isolated_instrumental_track_uri && data()?.lrc_uri && data()?.isolated_vocal_track_uri}
                >
                  <PreviewKaraoke
                    configKaraokeControls={{
                      isPlaying: false,
                      time: {
                        disableControls: false,
                        initialValue: 0,
                      },
                      vocals: {
                        uriFile: data()?.isolated_vocal_track_uri,
                        disableControls: false,
                        volume: {
                          disableControls: false,
                          initialValue: 1,
                        },
                      },
                      instrumental: {
                        uriFile: data()?.isolated_instrumental_track_uri,
                        volume: {
                          disableControls: false,
                          initialValue: 1,
                        },
                      },
                      lyrics: {
                        display: true,
                        uriFile: data()?.lrc_uri,
                      },
                    }}
                  />
                </Show>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="sr-only">Visibility</legend>
            <FormField>
              <FormField.InputField>
                <FormInputSwitch
                  id="is_listed"
                  name="is_listed"
                  label="List on catalog"
                  helpText="Disabling this option will make this song invisible on the catalog."
                  hasError={errors()?.is_listed?.length > 0 ? true : false}
                  checked={data()?.is_listed}
                />
              </FormField.InputField>
            </FormField>
          </fieldset>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </>
  )
}

export default FormListSong
