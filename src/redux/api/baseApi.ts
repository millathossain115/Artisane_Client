import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_BASE_URL } from '../../config/api'
import { getAccessToken } from '../../features/auth/authApi'

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const accessToken = getAccessToken()

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }

      return headers
    },
  }),
  endpoints: () => ({}),
  reducerPath: 'baseApi',
  tagTypes: [
    'Auth',
    'Category',
    'Dashboard',
    'Product',
    'Order',
    'User',
    'Wishlist',
  ],
})
