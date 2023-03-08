import { Switch, Match, Show } from 'solid-js'
import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { passwordlessSignInSchema as schema } from '~/schemas/passwordless-sign-in'
import { z } from 'zod'
import Button from '~/components/system/Button'
import FormInput from '~/components/system/FormInput'
import { IconBrowser, IconCheck, IconError, IconGoogle, IconSpinner, IconTwitch } from '~/components/system/Icons'
import { useAuthentication } from '~/hooks/useAuthentication/useAuthentication'
import { OnRampStripe } from '../Account/OnRampStripe'
import { Identity } from './../Account/Identity'

export const SignIn = () => {
  const { isReady, mutationSignIn, isAuthenticated, currentUser } = useAuthentication()
  const { form, errors } = createForm<z.infer<typeof schema>>({
    onSubmit: async (values) => {
      await mutationSignIn.mutateAsync({
        method: 'email_passwordless',
        email: values.sign_in_email,
      })
    },
    extend: validator({ schema }),
  })

  return (
    <>
      <h1 class="text-2xl text-neutral-9 font-bold">Join your friends and fans on Superloud !</h1>
      <p class="mt-2 mb-6 text-neutral-7 font-medium">
        Superloud is a fun karaoke app where people can list karaoke versions of their favourite songs and artists can
        create karaoke challenges for their songs.
      </p>
      <div class="px-6 pt-8 bg-accent-1 rounded-lg border border-accent-5">
        <h2 class="text-lg flex-wrap flex items-center font-bold text-neutral-8">
          <Switch>
            <Match when={mutationSignIn.isIdle || (mutationSignIn.isSuccess && isAuthenticated() === false)}>
              Sign-in to Superloud
            </Match>
            <Match when={mutationSignIn.isLoading}>
              <IconSpinner class="animate-spin shrink-0 text-xl mie-1ex" />
              Signing you in, one moment...
            </Match>
            <Match when={mutationSignIn.isSuccess && isAuthenticated() === true}>
              <IconCheck class=" shrink-0 text-positive-10 w-6 mie-1ex stroke-2" />
              You're all set ! Ready to rock ?
            </Match>
            <Match when={mutationSignIn.isError}>
              <IconError class=" shrink-0 text-negative-10 w-6 mie-1ex stroke-2" />
              Oops, something went wrong.
            </Match>
          </Switch>
        </h2>
        <p class="text-xs text-neutral-6 pt-1 pb-2 ">
          <Switch>
            <Match when={mutationSignIn.isIdle || (mutationSignIn.isSuccess && isAuthenticated() === false)}>
              <span class="">
                You can connect to Superloud using your in-browser wallet or with your favourite social account.
              </span>
            </Match>
            <Match when={mutationSignIn.isLoading}>
              <span class="">
                <Switch>
                  <Match when={mutationSignIn.variables?.method === 'email_passwordless'}>
                    Please check your inbox - there should be an unread{' '}
                    <span class="font-medium bg-interactive-4 rounded-md mx-auto w-fit-content px-0.25 text-interactive-11">
                      "Login in to superloud"
                    </span>{' '}
                    e-mail waiting for you. Click the link in this e-mail and wait a few seconds for your account to be
                    connected.
                  </Match>
                </Switch>
              </span>
            </Match>
            <Match when={mutationSignIn.isSuccess && isAuthenticated() === true}>
              <span class="">
                You're connected and ready to use Superloud ! You can start listing songs, have a fun karaoke session or
                join challenges.
              </span>
            </Match>
            <Match when={mutationSignIn.isError}>
              <span class="">Please try connecting again.</span>
            </Match>
          </Switch>
        </p>

        <Show when={!mutationSignIn.isSuccess || (mutationSignIn.isSuccess && isAuthenticated() === false)}>
          <div class="pt-2">
            {/*<form use:form>
              <div class="gap-2 pb-3 flex flex-col">
                <FormInput
                  class="w-full"
                  placeholder="email address"
                  disabled={!isReady()}
                  hasError={errors()?.sign_in_email?.length > 0 ? true : false}
                  type="email"
                  id="sign_in_email"
                  name="sign_in_email"
                />
                <Button
                  isLoading={mutationSignIn.variables?.method === 'email_passwordless' && mutationSignIn.isLoading}
                  scale="sm"
                  intent="primary-faint"
                  class="w-full xs:mx-auto xs:w-fit-content"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  type="submit"
                >
                  <span class="pis-1ex">Send me a magic link !</span>
                </Button>
              </div>
  </form>*/}
            <div>
              {/*<p class="text-center p-3 border-t border-accent-4 text-neutral-6 font-bold text-[0.75rem] ">
                Or continue with :
</p>*/}
              <p class="text-center p-3  text-neutral-6 font-bold text-[0.75rem] ">Continue with :</p>
              <div class="flex flex-col gap-4 justify-center items-center">
                <Button
                  isLoading={mutationSignIn.variables?.method === 'twitch' && mutationSignIn.isLoading}
                  title="Continue with Twitch"
                  intent="neutral-outline"
                  class="w-full hover:!bg-[#9147FF] hover:!text-neutral-1 !border-[#9147FF] !text-[#271346]"
                  type="button"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  onClick={async () =>
                    await mutationSignIn.mutateAsync({
                      method: 'twitch',
                    })
                  }
                >
                  <Show when={!(mutationSignIn.variables?.method === 'twitch' && mutationSignIn.isLoading)}>
                    <IconTwitch class="w-5 h-5" />
                  </Show>
                  <span class="pis-1ex">Continue with Twitch</span>
                </Button>
                <Button
                  isLoading={mutationSignIn.variables?.method === 'google' && mutationSignIn.isLoading}
                  title="Continue with Google"
                  intent="neutral-outline"
                  class="w-full hover:!bg-[#DF4032] hover:!text-neutral-1 !border-[#DF4032] !text-[#46130e]"
                  type="button"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  onClick={async () =>
                    await mutationSignIn.mutateAsync({
                      method: 'google',
                    })
                  }
                >
                  <Show when={!(mutationSignIn.variables?.method === 'google' && mutationSignIn.isLoading)}>
                    <IconGoogle class="w-5 h-5" />
                  </Show>
                  <span class="pis-1ex">Continue with Google</span>
                </Button>

                <Button
                  isLoading={mutationSignIn.variables?.method === 'injected' && mutationSignIn.isLoading}
                  onClick={async () =>
                    await mutationSignIn.mutateAsync({
                      method: 'injected',
                    })
                  }
                  intent="neutral-outline"
                  class="w-full !border-primary-10 hover:!bg-primary-10 hover:!text-primary-1 !hover:border-primary-5 !text-primary-12 !focus:border-primary-6"
                  type="button"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  title="Continue with a browser-extension wallet  (Coinbase, MetaMask, Tally Ho...)"
                >
                  <Show when={!(mutationSignIn.variables?.method === 'injected' && mutationSignIn.isLoading)}>
                    <IconBrowser class="w-6 h-6" />
                  </Show>
                  <span class="pis-1ex">Continue with browser wallet</span>
                </Button>
              </div>
            </div>
          </div>
        </Show>
        <Show when={mutationSignIn.isSuccess && isAuthenticated() === true && currentUser()}>
          <Identity />
          <section class="mt-6">
            <OnRampStripe />
          </section>
        </Show>
        <p class="mt-6 px-6 border-t border-accent-4 text-center py-3 -mx-6 rounded-b-md bg-accent-3 text-accent-9 text-[0.7rem]">
          Powered by Web3Auth
        </p>
      </div>
    </>
  )
}
