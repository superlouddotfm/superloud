import { useContext } from 'solid-js'
import { ContextAuthentication } from './Provider'

export function useAuthentication() {
  return useContext(ContextAuthentication)
}
