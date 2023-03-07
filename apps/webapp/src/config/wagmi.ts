import { configureChains, createClient } from '@wagmi/core'
import { polygonMumbai } from '@wagmi/core/chains'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { publicProvider } from '@wagmi/core/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { Web3AuthCore } from '@web3auth/core'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID as string
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const AUTH0_DOMAIN = `https://${import.meta.env.VITE_AUTH0_DOMAIN}`
const appChains = [polygonMumbai]

export const { chains, provider } = configureChains(appChains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `${import.meta.env.VITE_RPC_URL_MUMBAI_POKT}`,
    }),
  }),
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `${import.meta.env.VITE_RPC_URL_MUMBAI_QUICKNODE}`,
    }),
  }),
  infuraProvider({ apiKey: `${import.meta.env.VITE_IPFS_INFURA_PROJECT_ID}` }),
  publicProvider(),
])

export const web3AuthInstance = new Web3AuthCore({
  clientId: WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: 'testnet', // mainnet, aqua, celeste, cyan or testnet
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0]?.blockExplorers.default?.url,
  },
})
const adapter = new OpenloginAdapter()
web3AuthInstance.configureAdapter(adapter)

export const CONNECTORS = {
  injected: new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),

  email_passwordless: new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: 'email_passwordless',
        extraLoginOptions: {
          domain: AUTH0_DOMAIN,
          client_id: AUTH0_CLIENT_ID,
          login_hint: '',
          verifierIdField: 'name',
          isVerifierIdCaseSensitive: false,
        },
      },
    },
  }),
  google: new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: 'google',
      },
    },
  }),

  twitch: new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: 'twitch',
      },
    },
  }),
}

export const client = createClient({
  provider,
  autoConnect: false,
  connectors: [CONNECTORS.injected, CONNECTORS.email_passwordless, CONNECTORS.google, CONNECTORS.twitch],
})

export default client
