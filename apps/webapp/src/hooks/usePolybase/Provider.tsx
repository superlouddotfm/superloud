import { Polybase } from '@polybase/client'
import { createContext } from 'solid-js'

export const ContextPolybase = createContext()
export const ProviderPolybase = (props: any) => {
  const db = new Polybase({ defaultNamespace: 'pk/0xe762dc31848931f629dced5663de9412ac467b6b1475b99134dd41a51ca1e52ae61e096fcccae25ae11c80550cfbadebb3dcf69c639e762dcbdad4d6fe508a6e/superloud-sandbox' })
  const polybase = {
    db,
  }
  return <ContextPolybase.Provider value={polybase}>{props.children}</ContextPolybase.Provider>
}
