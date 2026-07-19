import { baseApi } from '../../redux/api/baseApi'
import type { Product } from '../products/productApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: WishlistListMeta
  errorSources?: { path: string; message: string }[]
}

export type WishlistItem = {
  _id: string
  createdAt?: string
  product?: Product | string
  updatedAt?: string
  user?: string
}

export type WishlistListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type WishlistListResult = {
  data: WishlistItem[]
  meta: WishlistListMeta
}

export type WishlistQueryParams = {
  limit?: number
  page?: number
}

function createWishlistParams(params?: WishlistQueryParams | void) {
  if (!params) {
    return undefined
  }

  const searchParams: Record<string, number> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams[key] = value
    }
  })

  return searchParams
}

function createWishlistListResult(
  response: ApiResponse<WishlistItem[]>,
  params?: WishlistQueryParams | void,
): WishlistListResult {
  const data = response.data ?? []
  const page = params?.page ?? 1
  const limit = params?.limit ?? data.length
  const total = response.meta?.total ?? data.length
  const totalPage =
    response.meta?.totalPage ?? Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data,
    meta: {
      limit: response.meta?.limit ?? limit,
      page: response.meta?.page ?? page,
      total,
      totalPage,
    },
  }
}

export function getWishlistProductId(item: WishlistItem) {
  if (!item.product) {
    return ''
  }

  return typeof item.product === 'string' ? item.product : item.product._id
}

export function getWishlistProduct(item: WishlistItem) {
  return item.product && typeof item.product !== 'string'
    ? item.product
    : undefined
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addWishlistProduct: builder.mutation<WishlistItem | null, string>({
      invalidatesTags: ['Wishlist', 'Dashboard'],
      query: (product) => ({
        body: { product },
        method: 'POST',
        url: '/wishlists/create-wishlist',
      }),
      transformResponse: (response: ApiResponse<WishlistItem>) =>
        response.data ?? null,
    }),
    clearMyWishlist: builder.mutation<ApiResponse<null>, void>({
      invalidatesTags: ['Wishlist', 'Dashboard'],
      query: () => ({
        method: 'DELETE',
        url: '/wishlists/clear',
      }),
    }),
    deleteWishlistItem: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['Wishlist', 'Dashboard'],
      query: (id) => ({
        method: 'DELETE',
        url: `/wishlists/${id}`,
      }),
    }),
    deleteWishlistProduct: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['Wishlist', 'Dashboard'],
      query: (productId) => ({
        method: 'DELETE',
        url: `/wishlists/product/${productId}`,
      }),
    }),
    getMyWishlist: builder.query<
      WishlistListResult,
      WishlistQueryParams | void
    >({
      providesTags: ['Wishlist'],
      query: (params) => ({
        params: createWishlistParams(params),
        url: '/wishlists/my-wishlist',
      }),
      transformResponse: (
        response: ApiResponse<WishlistItem[]>,
        _meta,
        params,
      ) => createWishlistListResult(response, params),
    }),
    getWishlistDashboard: builder.query<
      WishlistListResult,
      WishlistQueryParams | void
    >({
      providesTags: ['Wishlist'],
      query: (params) => ({
        params: createWishlistParams(params),
        url: '/wishlists/dashboard',
      }),
      transformResponse: (
        response: ApiResponse<WishlistItem[]>,
        _meta,
        params,
      ) => createWishlistListResult(response, params),
    }),
  }),
})

export const {
  useAddWishlistProductMutation,
  useClearMyWishlistMutation,
  useDeleteWishlistItemMutation,
  useDeleteWishlistProductMutation,
  useGetMyWishlistQuery,
  useGetWishlistDashboardQuery,
} = wishlistApi
