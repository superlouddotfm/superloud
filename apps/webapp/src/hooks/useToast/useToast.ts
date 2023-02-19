import { useContext } from 'solid-js'
import { ToastContext } from './Provider'
export function useToast() {
  return useContext(ToastContext)
}
