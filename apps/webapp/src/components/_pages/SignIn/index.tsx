import { Switch, Match, Show } from 'solid-js'
import { createForm } from '@felte/solid'
import { validator } from '@felte/validator-zod'
import { passwordlessSignInSchema as schema } from '~/schemas/passwordless-sign-in'
import { z } from 'zod'
import Button from '~/components/system/Button'
import FormInput from '~/components/system/FormInput'
import { IconBrowser, IconCheck, IconError, IconSpinner, IconTwitch } from '~/components/system/Icons'
import { useAuthentication } from '~/hooks/useAuthentication/useAuthentication'

export const SignIn = () => {
  const { isReady, mutationSignIn, isAuthenticated, currentUser } = useAuthentication()
  const { form, errors } = createForm<z.infer<typeof schema>>({
    onSubmit: async (values) => {
      await mutationSignIn.mutateAsync({
        method: 'magiclink',
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
              <IconCheck class="animate-appear shrink-0 text-positive-10 w-6 mie-1ex stroke-2" />
              You're all set ! Ready to rock ?
            </Match>
            <Match when={mutationSignIn.isError}>
              <IconError class="animate-appear shrink-0 text-negative-10 w-6 mie-1ex stroke-2" />
              Oops, something went wrong.
            </Match>
          </Switch>
        </h2>
        <p class="text-xs text-neutral-6 pt-1 pb-2 ">
          <Switch>
            <Match when={mutationSignIn.isIdle || (mutationSignIn.isSuccess && isAuthenticated() === false)}>
              <span class="animate-appear">
                You can connect to Superloud using a magic link, Twitch, or your injected wallet.
              </span>
            </Match>
            <Match when={mutationSignIn.isLoading}>
              <span class="animate-appear">
                <Switch>
                  <Match when={mutationSignIn.variables?.method === 'magiclink'}>
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
              <span class="animate-appear">
                You're connected and ready to use Superloud ! You can start listing songs, have a fun karaoke session or
                join challenges.
              </span>
            </Match>
            <Match when={mutationSignIn.isError}>
              <span class="animate-appear">Please try connecting again.</span>
            </Match>
          </Switch>
        </p>

        <Show when={!mutationSignIn.isSuccess || (mutationSignIn.isSuccess && isAuthenticated() === false)}>
          <div class="pt-2">
            <form use:form>
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
                  isLoading={mutationSignIn.variables?.method === 'magiclink' && mutationSignIn.isLoading}
                  scale="sm"
                  intent="primary-faint"
                  class="w-full xs:mx-auto xs:w-fit-content"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  type="submit"
                >
                  <span class="pis-1ex">Send me a magic link !</span>
                </Button>
              </div>
            </form>
            <div>
              <p class="text-center p-3 border-t border-accent-4 text-neutral-6 font-bold text-[0.75rem] ">
                Or continue with :
              </p>
              <div class="flex flex-wrap gap-4 justify-center items-center">
                <Button
                  isLoading={mutationSignIn.variables?.method === 'twitch' && mutationSignIn.isLoading}
                  title="Connect with Twitch"
                  intent="neutral-outline"
                  class="aspect-square w-12 !p-0 h-12 hover:border-[#9147FF] focus:border-[#9147FF]"
                  type="button"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  onClick={async () =>
                    await mutationSignIn.mutateAsync({
                      method: 'twitch',
                    })
                  }
                >
                  <Show when={!(mutationSignIn.variables?.method === 'twitch' && mutationSignIn.isLoading)}>
                    <IconTwitch class="text-black w-5 h-5" />
                  </Show>
                  <span class="sr-only">Connect with Twitch</span>
                </Button>
                <Button
                  isLoading={mutationSignIn.variables?.method === 'injected' && mutationSignIn.isLoading}
                  onClick={async () =>
                    await mutationSignIn.mutateAsync({
                      method: 'injected',
                    })
                  }
                  intent="neutral-outline"
                  class="aspect-square relative w-12 !p-0 h-12 hover:border-neutral-5 focus:border-neutral-6"
                  type="button"
                  disabled={mutationSignIn.isLoading || !isReady()}
                  title="Connect with a browser-extension wallet  (Coinbase, MetaMask, Tally Ho...)"
                >
                  <Show when={!(mutationSignIn.variables?.method === 'injected' && mutationSignIn.isLoading)}>
                    <IconBrowser class="text-black w-6 h-6" />
                  </Show>
                  <span class="sr-only">Connect with browser-extension wallet (Coinbase, MetaMask, Tally Ho...)</span>
                </Button>
              </div>
            </div>
          </div>
        </Show>
        <Show when={mutationSignIn.isSuccess && isAuthenticated() === true && currentUser()}>
          <div class="animate-appear">
            <section class="text-primary-11 text-xs">
              <h3 class="text-primary-12 font-semibold">Logged in as: </h3>
              <p class="overflow-hidden text-ellipsis">{currentUser()?.name}</p>
              <p class="overflow-hidden text-ellipsis">{currentUser()?.email}</p>
              <p class="overflow-hidden text-ellipsis">{currentUser()?.address}</p>
            </section>
          </div>
        </Show>
        <p class="mt-6 px-6 border-t border-accent-4 text-center py-3 -mx-6 rounded-b-md bg-accent-3 text-accent-9 text-[0.7rem]">
          Social wallet powered by Arcana Network
        </p>
      </div>
    </>
  )
}
