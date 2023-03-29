import { useContext } from 'solid-js'
import { ContextPolybase } from './Provider'

export function usePolybase() {
  return useContext(ContextPolybase)
}

export default usePolybase
