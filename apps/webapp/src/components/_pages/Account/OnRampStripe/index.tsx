import { useAuthentication } from '~/hooks/useAuthentication'
import { createSignal, Match, onMount, Show, Switch } from 'solid-js'
import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'
import { createMutation } from '@tanstack/solid-query'
import Button from '~/components/system/Button'

export const OnRampStripe = () => {
  const [safeOnRamp, setSafeOnRamp] = createSignal(null)
  const { currentUser } = useAuthentication()

  onMount(async () => {
    try {
      const _safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
        onRampProviderConfig: {
          stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY as string, // You should get your own public and private keys from Stripe
          onRampBackendUrl: import.meta.env.VITE_SAFE_STRIPE_BACKEND_BASE_URL as string, // You should deploy your own server
        },
      })
      setSafeOnRamp(_safeOnRamp)
    } catch (e) {
      console.error(e)
    }
  })

  const mutationOpenOnRampWidget = createMutation(async () => {
    try {
      const sessionData = await safeOnRamp()?.open({
        walletAddress: currentUser()?.address,
        networks: ['polygon'],
        element: '#stripe-root',
        sessionId: 'cos_1Mei3cKSn9ArdBimJhkCt1XC', // Optional, if you want to use a specific created session
        events: {
          onLoaded: () => console.log('Loaded'),
          onPaymentSuccessful: () => console.log('Payment successful'),
          onPaymentError: () => console.log('Payment failed'),
          onPaymentProcessing: () => console.log('Payment processing'),
        },
      })
      console.log(sessionData)
      return sessionData
    } catch (e) {
      console.error(e)
    }
  })
  return (
    <div class="text-center bg-accent-3 flex flex-col items-center justify-center px-3 pt-6 pb-6 rounded-md">
      <p class="font-bold">Want to send tips with crypto or organize challenges ?</p>
      <p class="text-xs mb-2 text-accent-10">
        You can easily buy crypto in a fast and secure way on Superloud via Stripe.
      </p>
      <Show when={!mutationOpenOnRampWidget?.isSuccess}>
        <Button
          isLoading={mutationOpenOnRampWidget?.isLoading}
          scale="sm"
          intent="primary-outline"
          onClick={() => mutationOpenOnRampWidget.mutateAsync()}
        >
          <span
            classList={{
              'pis-1ex': mutationOpenOnRampWidget?.isLoading,
            }}
          >
            <Switch>
              <Match when={mutationOpenOnRampWidget?.isLoading}>Connecting with Stripe...</Match>
              <Match when={!mutationOpenOnRampWidget?.isLoading}>Top-up your account</Match>
            </Switch>
          </span>
        </Button>
      </Show>
      <div
        classList={{
          'w-full h-72 rounded-md bg-accent-8 animate-pulse': mutationOpenOnRampWidget?.isLoading,
        }}
        class="mt-3"
        id="stripe-root"
      />
    </div>
  )
}

export default OnRampStripe
