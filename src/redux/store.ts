import { configureStore } from '@reduxjs/toolkit'

import cartReducer, { saveCartState } from '../features/cart/cartSlice'
import { baseApi } from './api/baseApi'

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
  },
})

store.subscribe(() => {
  saveCartState(store.getState().cart)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
