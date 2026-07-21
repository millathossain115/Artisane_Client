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
  averageRating?: number
  brand?: string
  images?: string[]
  isDeleted?: boolean
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
}

export type ProductPayload = {
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  category: string
  brand?: string
  images?: File[]
}

export type UpdateProductPayload = Partial<ProductPayload> & {
  id: string
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
  brand?: string
  category?: string
  limit?: number
  maxPrice?: number
  minPrice?: number
  minRating?: number
  page?: number
  searchTerm?: string
  stock?: 'all' | 'in-stock' | 'out-of-stock'
  sortBy?: 'createdAt' | 'name' | 'price' | 'rating' | 'stock' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

function createProductParams(params?: ProductQueryParams | void) {
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
  params?: ProductQueryParams | void,
): ProductListResult {
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

function createProductFormData(payload: Partial<ProductPayload>) {
  const formData = new FormData()

  if (payload.name !== undefined) {
    formData.append('name', payload.name)
  }

  if (payload.slug !== undefined) {
    formData.append('slug', payload.slug)
  }

  if (payload.description !== undefined) {
    formData.append('description', payload.description)
  }

  if (payload.price !== undefined) {
    formData.append('price', String(payload.price))
  }

  if (payload.stock !== undefined) {
    formData.append('stock', String(payload.stock))
  }

  if (payload.category !== undefined) {
    formData.append('category', payload.category)
  }

  if (payload.brand !== undefined) {
    formData.append('brand', payload.brand)
  }

  payload.images?.forEach((image) => {
    formData.append('images', image)
  })

  return formData
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product | null, ProductPayload>({
      invalidatesTags: ['Product', 'Dashboard'],
      query: (payload) => ({
        body: createProductFormData(payload),
        method: 'POST',
        url: '/products/create-product',
      }),
      transformResponse: (response: ApiResponse<Product>) =>
        response.data ?? null,
    }),
    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['Product', 'Dashboard'],
      query: (id) => ({
        method: 'DELETE',
        url: `/products/${id}`,
      }),
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
    getProductById: builder.query<Product | null, string>({
      providesTags: (_result, _error, id) => [{ id, type: 'Product' }],
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<Product>) =>
        response.data ?? null,
    }),
    updateProduct: builder.mutation<Product | null, UpdateProductPayload>({
      invalidatesTags: (_result, _error, { id }) => [
        'Product',
        'Dashboard',
        { id, type: 'Product' },
      ],
      query: ({ id, ...payload }) => ({
        body: createProductFormData(payload),
        method: 'PATCH',
        url: `/products/${id}`,
      }),
      transformResponse: (response: ApiResponse<Product>) =>
        response.data ?? null,
    }),
  }),
})

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useLazyGetProductByIdQuery,
  useUpdateProductMutation,
} = productApi
