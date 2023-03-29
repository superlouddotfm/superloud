import { createSignal, onMount, createContext } from 'solid-js'
import { createMutation } from '@tanstack/solid-query'
import { connect, disconnect, signMessage } from '@wagmi/core'
import  { CONNECTORS, web3AuthInstance } from '~/config/wagmi'
import { usePolybase } from '../usePolybase'

export const ContextAuthentication = createContext()
export const ProviderAuthentication = (props: any) => {
  const { db } = usePolybase()
  const [currentUser, setCurrentUser] = createSignal()
  const [isReady, setIsReady] = createSignal(false)
  const [method, setMethod] = createSignal(null)
  const [isAuthenticated, setIsAuthenticated] = createSignal(false)
  const [provider, setProvider] = createSignal(null)
  const mutationSignIn = createMutation(
    async (args: {
      method: 'injected' | 'walletConnect' | 'google' | 'twitch' | 'email_passwordless'
      email?: string
      connector?: 'injected' | 'walletConnect'
    }) => {
        let connector = CONNECTORS[args?.method]
        if (args?.method === 'email_passwordless' && args?.email) {
          connector.loginParams.extraLoginOptions.login_hint = args.email
        }
        const connection = await connect({
          chainId: 80001,
          connector,
        })
        let user
        if (['injected', 'walletConnect'].includes(args?.method)) {
          user = {
            address: connection?.account,
          }
        } else {
          const userInfo = await web3AuthInstance.getUserInfo()
          user = {
            ...userInfo,
            address: connection?.account,
          }
        }

        setProvider(connection?.provider)

        return {
          currentUser: user,
        }
    },
    {
      onSuccess(data, variables) {
        setMethod(variables?.method)
        if (data?.currentUser) {
          setIsAuthenticated(true)
          setCurrentUser(data?.currentUser)
          
          db.signer(async (data: string) => {
            const sig = await signMessage({
              message: data
            })
            return { h: 'eth-personal-sign', sig }
          })
          

        } else {
          setIsAuthenticated(false)
        }
      },
      onError() {
        console.error(e)
        setProvider(null)
        setMethod(null)
        setIsAuthenticated(false)
      },
    },
  )

  const mutationDisconnect = createMutation(async () => {
    disconnect()
    setCurrentUser()
    setIsAuthenticated(false)
    setMethod(null)
    setProvider(null)
  })

  onMount(async () => {
    try {
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
