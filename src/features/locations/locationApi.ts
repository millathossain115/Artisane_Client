import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

type LocationRecord = {
  _id?: string
  id?: string
  district_id?: string
  district_name?: string
  zone_id?: string
  zone_name?: string
  name?: string
  title?: string
}

export type LocationOption = {
  id: string
  name: string
}

function normalizeLocationOptions(data?: LocationRecord[]) {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .map((item) => ({
      id: item.id ?? item._id ?? item.district_id ?? item.zone_id ?? '',
      name:
        item.name ??
        item.title ??
        item.district_name ??
        item.zone_name ??
        '',
    }))
    .filter((item): item is LocationOption => Boolean(item.id && item.name))
}

function getLocationData(response: ApiResponse<LocationRecord[]> | LocationRecord[]) {
  return Array.isArray(response) ? response : response.data
}

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistricts: builder.query<LocationOption[], void>({
      query: () => '/locations/districts',
      transformResponse: (
        response: ApiResponse<LocationRecord[]> | LocationRecord[],
      ) => normalizeLocationOptions(getLocationData(response)),
    }),
    getZones: builder.query<LocationOption[], string>({
      query: (districtId) => `/locations/districts/${districtId}/zones`,
      transformResponse: (
        response: ApiResponse<LocationRecord[]> | LocationRecord[],
      ) => normalizeLocationOptions(getLocationData(response)),
    }),
  }),
})

export const { useGetDistrictsQuery, useGetZonesQuery } = locationApi
