import { baseApi } from '../../redux/api/baseApi'

export type PromoBannerData = {
  _id: string
  title: string
  code: string
  description?: string
  endsAt: string
  isActive: boolean
  buttonText?: string
  buttonLink?: string
  createdAt?: string
  updatedAt?: string
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T | null
}

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivePromo: builder.query<PromoBannerData | null, void>({
      query: () => '/promos/active',
      transformResponse: (response: ApiResponse<PromoBannerData | null>) =>
        response.data,
      providesTags: ['Promo'],
    }),
    updatePromo: builder.mutation<
      PromoBannerData,
      Partial<Omit<PromoBannerData, '_id'>>
    >({
      query: (body) => ({
        url: '/promos',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: ApiResponse<PromoBannerData>) =>
        response.data!,
      invalidatesTags: ['Promo'],
    }),
  }),
})

export const { useGetActivePromoQuery, useUpdatePromoMutation } = promoApi
