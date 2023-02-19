import { AuthProvider, CHAIN } from '@arcana/auth' //From npm
import { createSignal, onMount, createContext } from 'solid-js'
import { createMutation, createQuery } from '@tanstack/solid-query'
import { ethers } from 'ethers'
import { connect, disconnect, getAccount, getProvider, InjectedConnector } from '@wagmi/core'
import { chains } from '~/config/wagmi'
import { polygonMumbai } from '@wagmi/core/chains'

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS
const RPC_URL_MUMBAI = import.meta.env.VITE_RPC_URL_MUMBAI_QUICKNODE
const CONFIG_ARCANA_MUMBAI = {
  chainId: CHAIN.POLYGON_MUMBAI_TESTNET,
  rpcUrl: RPC_URL_MUMBAI,
}
const auth = new AuthProvider(ARCANA_APP_ADDRESS, {
  //required
  network: 'testnet',
  position: 'left',
  theme: 'light',
  alwaysVisible: false,
  chainConfig: CONFIG_ARCANA_MUMBAI,
})

export const ContextAuthentication = createContext()
export const ProviderAuthentication = (props: any) => {
  const [currentUser, setCurrentUser] = createSignal()
  const [isReady, setIsReady] = createSignal(false)
  const [method, setMethod] = createSignal(null)
  const [isAuthenticated, setIsAuthenticated] = createSignal(false)
  const [provider, setProvider] = createSignal(null)
  const mutationSignIn = createMutation(
    async (args: {
      method: 'injected' | 'walletConnect' | 'twitch' | 'magiclink'
      email?: string
      connector?: 'injected' | 'walletConnect'
    }) => {
      try {
        let _provider = null
        switch (args.method) {
          case 'twitch':
            _provider = await auth.loginWithSocial('twitch')

            setProvider(new ethers.providers.Web3Provider(_provider))
            break
          case 'magiclink':
            _provider = await auth.loginWithLink(`${args?.email}`)
            setProvider(new ethers.providers.Web3Provider(_provider))
            break
          case 'injected':
            const connection = await connect({
              chainId: polygonMumbai.id,
              connector: new InjectedConnector({
                chains: chains,
              }),
            })
            _provider = connection?.provider
            setProvider(new ethers.providers.Web3Provider(_provider))
            break
          default:
            break
        }

        let currentUser
        if (args.method.includes('injected')) {
          currentUser = await getAccount()
        } else {
          currentUser = await auth.getUser()
        }
        if (!currentUser) throw new Error("Something went wrong and we couldn't sign you in.")

        return { currentUser }
      } catch (e) {
        console.error(e)
        setProvider(null)
        setMethod(null)
        setIsAuthenticated(false)
      }
    },
    {
      onSuccess(data, variables) {
        setMethod(variables?.method)
        if (data?.currentUser) {
          setIsAuthenticated(true)
          setCurrentUser(data?.currentUser)
        } else {
          setIsAuthenticated(false)
        }
      },
      onError() {
        setProvider(null)
        setMethod(null)
        setIsAuthenticated(false)
      },
    },
  )

  const mutationDisconnect = createMutation(async () => {
    if (isAuthenticated()) {
      if (['injected'].includes(method())) {
        await disconnect()
      } else {
        await auth.logout()
      }
    }
    setCurrentUser()
    setIsAuthenticated(false)
    setMethod(null)
    setProvider(null)
  })

  onMount(async () => {
    try {
      await auth.init()
      const isLoggedInWithSocials = await auth.isLoggedIn()
      if (isLoggedInWithSocials === true) {
        await auth.logout()
      }
      setIsReady(true)
    } catch (e) {
      console.error(e)
      setIsReady(false)
    }
  })

  const authentication = {
    isReady,
    currentUser,
    isAuthenticated,
    mutationSignIn,
    mutationDisconnect,
    method,
    provider,
  }

  return <ContextAuthentication.Provider value={authentication}>{props.children}</ContextAuthentication.Provider>
}
