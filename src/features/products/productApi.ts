import { baseApi } from '../../redux/api/baseApi'
import type { Category } from '../categories/categoryApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: ProductListMeta
  errorSources?: { path: string; message: string }[]
}

export type Product = {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  category: Category | string
  brand?: string
  images?: string[]
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProductPayload = {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: string
  brand?: string
  images?: string[]
}

export type ProductListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type ProductListResult = {
  data: Product[]
  meta: ProductListMeta
}

export type ProductQueryParams = {
  limit?: number
  page?: number
  searchTerm?: string
  sortBy?: 'createdAt' | 'name' | 'price' | 'stock' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

function createProductParams(params?: ProductQueryParams) {
  if (!params) {
    return undefined
  }

  const searchParams: Record<string, number | string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams[key] = value
    }
  })

  return searchParams
}

function createProductListResult(
  response: ApiResponse<Product[]>,
  params?: ProductQueryParams,
): ProductListResult {
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

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product | null, ProductPayload>({
      invalidatesTags: ['Product', 'Dashboard'],
      query: (payload) => ({
        body: payload,
        method: 'POST',
        url: '/products/create-product',
      }),
      transformResponse: (response: ApiResponse<Product>) =>
        response.data ?? null,
    }),
    getProducts: builder.query<ProductListResult, ProductQueryParams | void>({
      providesTags: ['Product'],
      query: (params) => ({
        params: createProductParams(params ?? undefined),
        url: '/products',
      }),
      transformResponse: (
        response: ApiResponse<Product[]>,
        _meta,
        params,
      ) => createProductListResult(response, params ?? undefined),
    }),
  }),
})

export const { useCreateProductMutation, useGetProductsQuery } = productApi
