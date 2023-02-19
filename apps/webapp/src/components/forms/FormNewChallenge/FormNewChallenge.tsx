import { For, Show, splitProps } from 'solid-js'
import Button from '~/components/system/Button'
import FormField from '~/components/system/FormField'
import FormInput from '~/components/system/FormInput'
import FormInputSwitch from '~/components/system/FormInputSwitch'
import FormSelect from '~/components/system/FormSelect'
import FormTextarea from '~/components/system/FormTextarea'
import { SUPERTOKENS } from '~/config/superfluid'
import { formFieldLabel } from '~/design-system/form-field'
import { useKaraokeSession } from '~/hooks/useKaraokeSession/useKaraokeSession'

interface FormNewChallengeProps {
  storeForm: any
  apiAccordion: any
}
export const FormNewChallenge = (props: FormNewChallengeProps) => {
  const [local] = splitProps(props, ['storeForm', 'apiAccordion'])
  const { form, errors, data, setData, invalid } = local.storeForm
  return (
    <>
      {/* @ts-ignore */}
      <form use:form>
        <div class="border bg-accent-1 divide-y divide-neutral-4 rounded-md border-neutral-4 mb-8">
          <fieldset {...local.apiAccordion().getItemProps({ value: 'about' })}>
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('about') === 'about',
                  'text-accent-6': !local.apiAccordion().value.includes('about'),
                }}
                class="pie-1ex text-interactive-6"
              >
                #
              </span>

              <legend>About</legend>
              <button
                class="absolute inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({ value: 'about' })}
              >
                Toggle "Info" section
              </button>
            </div>
            <div
              class="pt-1.5 space-y-4 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({ value: 'about' })}
            >
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={errors()?.title?.length > 0 ? true : false} for="title">
                    Challenge title
                  </FormField.Label>
                  <FormField.Description id="title-description">The title of your challenge.</FormField.Description>
                  <FormInput
                    placeholder="eg: The best 'Dope song' cover!"
                    name="title"
                    id="title"
                    hasError={errors()?.title?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
              <FormField>
                <FormField.InputField>
                  <FormField.Label hasError={errors()?.creator_note?.length > 0 ? true : false} for="creator_note">
                    Creator's note
                  </FormField.Label>
                  <FormField.Description id="creator_note-description">
                    Anything to add about your challenge ? Feel free to write it down here.
                  </FormField.Description>
                  <FormTextarea
                    placeholder="eg: This remix of Dope song has that slowed/reverb thing and more backing vocals. Try to make a perfect score !"
                    name="creator_note"
                    id="creator_note"
                    rows="10"
                    hasError={errors()?.creator_note?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
            </div>
          </fieldset>
          <fieldset {...local.apiAccordion().getItemProps({ value: 'prize' })}>
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('prize'),
                  'text-accent-6': !local.apiAccordion().value.includes('prize'),
                }}
                class="pie-1ex text-interactive-6"
              >
                #
              </span>
              <legend>Winner & prize</legend>
              <button
                class="absolute inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({ value: 'prize' })}
              >
                Toggle "Prize" section
              </button>
            </div>
            <div
              class="pt-1.5 space-y-4 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({ value: 'prize' })}
            >
              <FormField>
                <FormField.InputField>
                  <FormInputSwitch
                    scale="sm"
                    id="is_winning_mode_vote"
                    name="is_winning_mode_vote"
                    label="Audience will vote for the winner"
                    helpText="Disabling this option means you, the creator, will handpick the winner instead of letting the audience vote."
                    hasError={errors()?.is_winning_mode_vote?.length > 0 ? true : false}
                    checked={data()?.is_winning_mode_vote}
                  />
                </FormField.InputField>
              </FormField>

              <FormField>
                <FormField.InputField>
                  <FormInputSwitch
                    scale="sm"
                    id="is_charity_challenge"
                    name="is_charity_challenge"
                    label="Charity challenge"
                    helpText="Enabling this option means the prize will be sent to a whitelisted charity picked by the winner."
                    hasError={errors()?.is_charity_challenge?.length > 0 ? true : false}
                    checked={data()?.is_charity_challenge}
                  />
                </FormField.InputField>
              </FormField>
              <div class="flex">
                <p class={formFieldLabel({ class: 'pie-1ex ' })}>Winner prize</p>
                <FormField.Label
                  class="sr-only"
                  hasError={errors()?.winner_rewards_super_token_amount?.length > 0 ? true : false}
                  for="winner_rewards_super_token_amount"
                >
                  Prize amount
                </FormField.Label>
                <FormField.Description class="sr-only" id="winner_rewards_super_token_amount-description">
                  The total amount of rewards that will be split between voters.
                </FormField.Description>
                <FormInput
                  class="rounded-ie-none"
                  type="number"
                  min={0}
                  step="any"
                  name="winner_rewards_super_token_amount"
                  id="winner_rewards_super_token_amount"
                  hasError={errors()?.winner_rewards_super_token_amount?.length > 0 ? true : false}
                />
                <FormField.Label
                  class="sr-only"
                  hasError={errors()?.winner_rewards_super_token_address?.length > 0 ? true : false}
                  for="winner_rewards_super_token_address"
                >
                  Prize token
                </FormField.Label>
                <FormField.Description class="sr-only" id="winner_rewards_super_token_address-description">
                  The Super token used as a reward for voters.
                </FormField.Description>
                <FormSelect
                  classInput="rounded-is-none border-is-0"
                  name="winner_rewards_super_token_address"
                  id="winner_rewards_super_token_address"
                  hasError={errors()?.winner_rewards_super_token_address?.length > 0 ? true : false}
                >
                  <For each={Object.keys(SUPERTOKENS.mumbai)}>
                    {(supertoken) => <option value={SUPERTOKENS.mumbai[supertoken]}>{supertoken}</option>}
                  </For>
                </FormSelect>
              </div>
              <p class="italic text-neutral-5 text-center pt-6 text-2xs">
                Prize distribution powered by{' '}
                <a class="link" href="https://superfluid.finance/" rel="nofollow noreferrer" target="_blank">
                  Superfluid
                </a>
              </p>
            </div>
          </fieldset>

          <fieldset {...local.apiAccordion().getItemProps({ value: 'rules' })}>
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('rules'),
                  'text-accent-6': !local.apiAccordion().value.includes('rules'),
                }}
                class="pie-1ex text-interactive-6"
              >
                #
              </span>
              <legend>Rules</legend>
              <button
                class="absolute inset-0 w-full h-full opacity-0"
                {...local.apiAccordion().getTriggerProps({ value: 'rules' })}
              >
                Toggle "Participation rules" section
              </button>
            </div>
            <div
              class="space-y-4 pt-1.5 pb-6 px-3 sm:px-6"
              {...local.apiAccordion().getContentProps({ value: 'rules' })}
            >
              <FormField>
                <FormField.InputField>
                  <FormField.Label
                    hasError={errors()?.number_of_takes?.length > 0 ? true : false}
                    for="number_of_takes"
                  >
                    Number of takes
                  </FormField.Label>
                  <FormField.Description id="number_of_takes-description">
                    By default, participants only have one shot, but you can increase this limit if you wish to.{' '}
                    <span class="font-bold">Participants will only be allowed to send one take.</span>
                  </FormField.Description>
                  <FormInput
                    name="number_of_takes"
                    min="0"
                    id="number_of_takes"
                    hasError={errors()?.number_of_takes?.length > 0 ? true : false}
                  />
                </FormField.InputField>
              </FormField>
              <div>
                <p class={formFieldLabel()}>Participation dates</p>
                <p class="text-2xs mb-2">Between which date can people participate to your challenge ?</p>
                <div class="grid gap-2 gris-cols-1 xs:grid-cols-2">
                  <FormField>
                    <FormField.InputField>
                      <div class="text-2xs">
                        <FormField.Label
                          hasError={errors()?.submissions_start_at?.length > 0 ? true : false}
                          for="submissions_start_at"
                        >
                          From :
                        </FormField.Label>
                      </div>
                      <div></div>
                      <FormField.Description class="sr-only" id="submissions_start_at-description">
                        When can people start participating to your challenge ?
                      </FormField.Description>
                      <FormInput
                        type="datetime-local"
                        name="submissions_start_at"
                        id="submissions_start_at"
                        hasError={errors()?.submissions_start_at?.length > 0 ? true : false}
                      />
                    </FormField.InputField>
                  </FormField>
                  <FormField>
                    <FormField.InputField>
                      <div class="text-2xs">
                        <FormField.Label
                          hasError={errors()?.submissions_end_at?.length > 0 ? true : false}
                          for="submissions_end_at"
                        >
                          To :
                        </FormField.Label>
                      </div>
                      <FormField.Description class="sr-only" id="submissions_end_at-description">
                        When can people start participating to your challenge ?
                      </FormField.Description>
                      <FormInput
                        type="datetime-local"
                        name="submissions_end_at"
                        id="submissions_end_at"
                        hasError={errors()?.submissions_end_at?.length > 0 ? true : false}
                      />
                    </FormField.InputField>
                  </FormField>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset
            disabled={data()?.is_winning_mode_vote !== true}
            class="disabled:opacity-50 disabled:cursor-not-allowed"
            {...local.apiAccordion().getItemProps({ value: 'votes', disabled: data()?.is_winning_mode_vote !== true })}
          >
            <div class="flex relative p-3 font-bold">
              <span
                classList={{
                  'text-interactive-7': local.apiAccordion().value.includes('votes'),
                  'text-accent-6': !local.apiAccordion().value.includes('votes'),
                }}
                class="pie-1ex text-interactive-6"
              >
                #
              </span>
              <legend>
                Votes
                <Show when={data()?.is_winning_mode_vote !== true}>
                  <span class="italic text-2xs font-medium">&nbsp;(disabled)</span>
                </Show>
              </legend>
              <button
                class="absolute inset-0 w-full h-full opacity-0"
                {...local
                  .apiAccordion()
                  .getTriggerProps({ value: 'votes', disabled: data()?.is_winning_mode_vote !== true })}
              >
                Toggle "Votes" section
              </button>
            </div>
            <div
              class="space-y-4 pt-1.5 pb-6 px-3 sm:px-6"
              {...local
                .apiAccordion()
                .getContentProps({ value: 'votes', disabled: data()?.is_winning_mode_vote !== true })}
            >
              <div>
                <p class={formFieldLabel()}>Vote dates</p>
                <p class="text-2xs mb-2">Between which date can the audience vote ?</p>
                <div class="grid gap-2 gris-cols-1 xs:grid-cols-2">
                  <FormField>
                    <FormField.InputField>
                      <div class="text-2xs">
                        <FormField.Label
                          hasError={errors()?.votes_start_at?.length > 0 ? true : false}
                          for="votes_start_at"
                        >
                          From :
                        </FormField.Label>
                      </div>
                      <div></div>
                      <FormField.Description class="sr-only" id="votes_start_at-description">
                        When can people start participating to your challenge ?
                      </FormField.Description>
                      <FormInput
                        disabled={data()?.is_winning_mode_vote !== true}
                        type="datetime-local"
                        name="votes_start_at"
                        id="votes_start_at"
                        hasError={errors()?.votes_start_at?.length > 0 ? true : false}
                      />
                    </FormField.InputField>
                  </FormField>
                  <FormField>
                    <FormField.InputField>
                      <div class="text-2xs">
                        <FormField.Label
                          hasError={errors()?.votes_end_at?.length > 0 ? true : false}
                          for="votes_end_at"
                        >
                          To :
                        </FormField.Label>
                      </div>
                      <FormField.Description class="sr-only" id="votes_end_at-description">
                        When can people start participating to your challenge ?
                      </FormField.Description>
                      <FormInput
                        type="datetime-local"
                        name="votes_end_at"
                        id="votes_end_at"
                        disabled={data()?.is_winning_mode_vote !== true}
                        hasError={errors()?.votes_end_at?.length > 0 ? true : false}
                      />
                    </FormField.InputField>
                  </FormField>
                </div>
              </div>

              <FormField>
                <FormField.InputField>
                  <FormInputSwitch
                    scale="sm"
                    disabled={data()?.is_winning_mode_vote !== true}
                    id="do_voters_get_rewards"
                    name="do_voters_get_rewards"
                    label="Voters will receive a pool prize"
                    helpText="Enabling this option means you will fund a pool prize that will be split between all voters."
                    hasError={errors()?.do_voters_get_rewards?.length > 0 ? true : false}
                    checked={data()?.do_voters_get_rewards}
                  />
                </FormField.InputField>
              </FormField>

              <div class="flex">
                <p class={formFieldLabel({ class: 'pie-1ex ' })}>Voters pool prize</p>

                <FormField.Label
                  class="sr-only"
                  hasError={errors()?.voters_rewards_super_token_amount?.length > 0 ? true : false}
                  for="voters_rewards_super_token_amount"
                >
                  Pool prize amount
                </FormField.Label>
                <FormField.Description class="sr-only" id="voters_rewards_super_token_amount-description">
                  The total amount of rewards that will be split between voters.
                </FormField.Description>
                <FormInput
                  class="rounded-ie-none"
                  type="number"
                  min={0}
                  step="any"
                  disabled={data()?.do_voters_get_rewards !== true || data()?.is_winning_mode_vote !== true}
                  name="voters_rewards_super_token_amount"
                  id="voters_rewards_super_token_amount"
                  hasError={errors()?.voters_rewards_super_token_amount?.length > 0 ? true : false}
                />
                <FormField.Label
                  class="sr-only"
                  hasError={errors()?.voters_rewards_super_token_address?.length > 0 ? true : false}
                  for="voters_rewards_super_token_address"
                >
                  Pool prize reward token
                </FormField.Label>
                <FormField.Description class="sr-only" id="voters_rewards_super_token_address-description">
                  The Super token used as a reward for voters.
                </FormField.Description>
                <FormSelect
                  classInput="rounded-is-none border-is-0"
                  disabled={data()?.do_voters_get_rewards !== true || data()?.is_winning_mode_vote !== true}
                  name="voters_rewards_super_token_address"
                  id="voters_rewards_super_token_address"
                  hasError={errors()?.voters_rewards_super_token_address?.length > 0 ? true : false}
                >
                  <For each={Object.keys(SUPERTOKENS.mumbai)}>
                    {(supertoken) => <option value={SUPERTOKENS.mumbai[supertoken]}>{supertoken}</option>}
                  </For>
                </FormSelect>
              </div>
              <p class="italic text-neutral-5 text-center pt-6 text-2xs">
                Pool prize distribution powered by{' '}
                <a class="link" href="https://superfluid.finance/" rel="nofollow noreferrer" target="_blank">
                  Superfluid
                </a>
              </p>
            </div>
          </fieldset>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </>
  )
}

export default FormNewChallenge
