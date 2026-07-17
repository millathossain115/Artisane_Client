import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '../redux/store'

type StoreProviderProps = {
  children: ReactNode
}

function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
