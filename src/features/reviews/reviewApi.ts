import { baseApi } from '../../redux/api/baseApi'
import type { AdminUser } from '../users/userApi'
import type { Product } from '../products/productApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: ReviewListMeta
  errorSources?: { path: string; message: string }[]
}

export type ReviewProduct = Pick<
  Product,
  '_id' | 'averageRating' | 'images' | 'name' | 'price' | 'reviewCount' | 'slug'
> & {
  category?: Product['category']
}

export type ReviewUser = Pick<AdminUser, '_id' | 'email' | 'name' | 'role'>

export type Review = {
  _id: string
  comment?: string
  createdAt?: string
  hiddenAt?: string
  hiddenBy?: ReviewUser | string
  isDeleted?: boolean
  isHidden?: boolean
  product?: ReviewProduct | string
  rating: number
  updatedAt?: string
  user?: ReviewUser | string
}

export type ReviewListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type ReviewListResult = {
  data: Review[]
  meta: ReviewListMeta
}

export type ReviewableProduct = Product

export type ReviewQueryParams = {
  limit?: number
  page?: number
}

export type CreateReviewPayload = {
  comment?: string
  product: string
  rating: number
}

export type UpdateReviewPayload = {
  comment?: string
  id: string
  rating?: number
}

export type UpdateReviewVisibilityPayload = {
  id: string
  isHidden: boolean
}

function createReviewParams(params?: ReviewQueryParams | void) {
  if (!params) {
    return undefined
  }

  const searchParams: Record<string, number | string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams[key] = value
    }
  })

  return searchParams
}

function createReviewListResult(
  response: ApiResponse<Review[]>,
  params?: ReviewQueryParams | void,
): ReviewListResult {
  const data = response.data ?? []
  const page = (params && params.page) ?? 1
  const limit = (params && params.limit) ?? data.length
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

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<Review | null, CreateReviewPayload>({
      invalidatesTags: ['Dashboard', 'Product', 'Review'],
      query: (body) => ({
        body,
        method: 'POST',
        url: '/reviews/create-review',
      }),
      transformResponse: (response: ApiResponse<Review>) => response.data ?? null,
    }),
    deleteReview: builder.mutation<Review | null, string>({
      invalidatesTags: ['Dashboard', 'Product', 'Review'],
      query: (id) => ({
        method: 'DELETE',
        url: `/reviews/${id}`,
      }),
      transformResponse: (response: ApiResponse<Review>) => response.data ?? null,
    }),
    getAdminReviews: builder.query<ReviewListResult, ReviewQueryParams | void>({
      providesTags: ['Review'],
      query: (params) => ({
        params: createReviewParams(params ?? undefined),
        url: '/reviews/admin',
      }),
      transformResponse: (response: ApiResponse<Review[]>, _meta, params) =>
        createReviewListResult(response, params ?? undefined),
    }),
    getMyReviews: builder.query<ReviewListResult, ReviewQueryParams | void>({
      providesTags: ['Review'],
      query: (params) => ({
        params: createReviewParams(params ?? undefined),
        url: '/reviews/my-reviews',
      }),
      transformResponse: (response: ApiResponse<Review[]>, _meta, params) =>
        createReviewListResult(response, params ?? undefined),
    }),
    getPublicReviews: builder.query<ReviewListResult, ReviewQueryParams | void>({
      providesTags: ['Review'],
      query: (params) => ({
        params: createReviewParams(params ?? undefined),
        url: '/reviews',
      }),
      transformResponse: (response: ApiResponse<Review[]>, _meta, params) =>
        createReviewListResult(response, params ?? undefined),
    }),
    getProductReviews: builder.query<
      ReviewListResult,
      { limit?: number; page?: number; productId: string }
    >({
      providesTags: ['Review'],
      query: ({ productId, ...params }) => ({
        params: createReviewParams(params),
        url: `/reviews/product/${productId}`,
      }),
      transformResponse: (response: ApiResponse<Review[]>, _meta, params) =>
        createReviewListResult(response, params ?? undefined),
    }),
    getReviewableProducts: builder.query<ReviewableProduct[], void>({
      providesTags: ['Product', 'Review'],
      query: () => '/reviews/reviewable-products',
      transformResponse: (response: ApiResponse<ReviewableProduct[]>) =>
        response.data ?? [],
    }),
    getReviewById: builder.query<Review | null, string>({
      providesTags: (_result, _error, id) => [{ id, type: 'Review' }],
      query: (id) => `/reviews/${id}`,
      transformResponse: (response: ApiResponse<Review>) => response.data ?? null,
    }),
    updateReview: builder.mutation<Review | null, UpdateReviewPayload>({
      invalidatesTags: ['Dashboard', 'Product', 'Review'],
      query: ({ id, ...body }) => ({
        body,
        method: 'PATCH',
        url: `/reviews/${id}`,
      }),
      transformResponse: (response: ApiResponse<Review>) => response.data ?? null,
    }),
    updateReviewVisibility: builder.mutation<
      Review | null,
      UpdateReviewVisibilityPayload
    >({
      invalidatesTags: ['Dashboard', 'Product', 'Review'],
      query: ({ id, ...body }) => ({
        body,
        method: 'PATCH',
        url: `/reviews/${id}/visibility`,
      }),
      transformResponse: (response: ApiResponse<Review>) => response.data ?? null,
    }),
  }),
})

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetAdminReviewsQuery,
  useGetMyReviewsQuery,
  useGetProductReviewsQuery,
  useGetPublicReviewsQuery,
  useGetReviewByIdQuery,
  useGetReviewableProductsQuery,
  useUpdateReviewMutation,
  useUpdateReviewVisibilityMutation,
} = reviewApi
