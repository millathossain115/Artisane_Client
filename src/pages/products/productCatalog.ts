import type { ProductQueryParams } from '../../features/products/productApi'

export const SORT_VALUES = [
  'newest',
  'oldest',
  'price-asc',
  'price-desc',
  'rating-desc',
  'name-asc',
  'name-desc',
] as const
export const DEFAULT_LIMIT = 12
export const DEFAULT_PAGE = 1
export const DEFAULT_SORT = 'newest'

export type SortOption = (typeof SORT_VALUES)[number]
type SortParams = Pick<ProductQueryParams, 'sortBy' | 'sortOrder'>

export type StockFilter = 'all' | 'in-stock' | 'out-of-stock'

export type ProductFilterState = {
  brand: string
  maxPrice: string
  minPrice: string
  minRating: string
  stock: StockFilter
}

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  'price-asc': 'Price low-high',
  'price-desc': 'Price high-low',
  'rating-desc': 'Top rated',
  'name-asc': 'A-Z',
  'name-desc': 'Z-A',
}

export function getPageNumber(value: string | null) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return DEFAULT_PAGE
  }

  return page
}

export function getSortOption(value: string | null): SortOption {
  if (SORT_VALUES.includes(value as SortOption)) {
    return value as SortOption
  }

  return DEFAULT_SORT
}

export function getSortParams(sortOption: SortOption): SortParams {
  if (sortOption === 'oldest') {
    return { sortBy: 'createdAt', sortOrder: 'asc' }
  }

  if (sortOption === 'price-asc') {
    return { sortBy: 'price', sortOrder: 'asc' }
  }

  if (sortOption === 'price-desc') {
    return { sortBy: 'price', sortOrder: 'desc' }
  }

  if (sortOption === 'rating-desc') {
    return { sortBy: 'rating', sortOrder: 'desc' }
  }

  if (sortOption === 'name-asc') {
    return { sortBy: 'name', sortOrder: 'asc' }
  }

  if (sortOption === 'name-desc') {
    return { sortBy: 'name', sortOrder: 'desc' }
  }

  return { sortBy: 'createdAt', sortOrder: 'desc' }
}

export function getPageItems(currentPage: number, totalPages: number) {
  const pageSet = new Set([1, totalPages])

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pageSet.add(page)
    }
  }

  const pages = Array.from(pageSet).sort((firstPage, secondPage) => {
    return firstPage - secondPage
  })
  const pageItems: Array<number | string> = []

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1]

    if (previousPage && page - previousPage > 1) {
      pageItems.push(`ellipsis-${previousPage}`)
    }

    pageItems.push(page)
  })

  return pageItems
}
