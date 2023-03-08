import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'

const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY, // You should get your own public and private keys from Stripe
    onRampBackendUrl: import.meta.env.VITE_SAFE_STRIPE_BACKEND_BASE_URL, // You should deploy your own server
  },
})
