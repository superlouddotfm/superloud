import { useAuthentication } from '~/hooks/useAuthentication'
import { createSignal, Match, onMount, Show, Switch } from 'solid-js'
import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'
import { createMutation } from '@tanstack/solid-query'
import Button from '~/components/system/Button'
import { useToast } from '~/hooks/useToast'

export const OnRampStripe = () => {
  const [safeOnRamp, setSafeOnRamp] = createSignal(null)
  const { currentUser } = useAuthentication()
  const toast = useToast()

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
      const sessionData = await safeOnRamp()?.open({
        walletAddress: currentUser()?.address,
        networks: ['gnosis'],
        element: '#stripe-root',
        events: {
          onPaymentSuccessful: () => {
            toast().create({
              title: 'Your payment was processed successfully !',
              type: 'success',
              placement: 'bottom-right',
            })
          },
          onPaymentError: () => {
            toast().create({
              title: "Something went wrong and your payment couldn't be processed.",
              type: 'error',
              placement: 'bottom-right',
            })
          },
          onPaymentProcessing: () => {
            toast().create({
              title: 'Your payment is processing, please wait a few moments...',
              type: 'info',
              placement: 'bottom-right',
            })
          },
        },
      })
      console.log(sessionData)
      return sessionData
  })
  return (
    <>
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
    </>
  )
}

export default OnRampStripe
