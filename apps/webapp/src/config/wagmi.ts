import { configureChains, createClient } from '@wagmi/core'
import { polygonMumbai } from '@wagmi/core/chains'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { publicProvider } from '@wagmi/core/providers/public'
import { ArcanaConnector } from '@arcana/auth-wagmi'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS

const appChains = [polygonMumbai]

export const { chains, provider } = configureChains(appChains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `${import.meta.env.VITE_RPC_URL_MUMBAI_QUICKNODE}`,
    }),
  }),
  infuraProvider({ apiKey: `${import.meta.env.VITE_IPFS_INFURA_PROJECT_ID}` }),
  publicProvider(),
])

export const client = createClient({
  provider,
  autoConnect: false,
  connectors: [
    new InjectedConnector({ chains }),
    new ArcanaConnector({
      chains: chains,
      options: {
        appId: ARCANA_APP_ADDRESS,
        theme: 'light',
        alwaysVisible: false,
        position: 'left',
      },
    }),
  ],
})

export default client
