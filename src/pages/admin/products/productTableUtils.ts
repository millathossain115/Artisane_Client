import { API_BASE_URL } from '../../../config/api'
import type { Product } from '../../../features/products/productApi'

export type ProductEditForm = {
  brand: string
  categoryId: string
  description: string
  name: string
  price: string
  slug: string
  stock: string
}

export type SortFilter = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

export const PAGE_SIZE_OPTIONS = [5, 10, 20]
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const MAX_PRODUCT_IMAGES = 5

export function getEmptyProductEditForm(): ProductEditForm {
  return {
    brand: '',
    categoryId: '',
    description: '',
    name: '',
    price: '',
    slug: '',
    stock: '',
  }
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(value)
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function getProductImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return ''
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${imageUrl}`
}

export function getCategoryName(category: Product['category']) {
  if (typeof category === 'string') {
    return category
  }

  return category.name
}

export function getCategoryId(category: Product['category']) {
  if (typeof category === 'string') {
    return category
  }

  return category._id
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const errorRecord = error as Record<string, unknown>
  const data = errorRecord.data

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>

    if (typeof dataRecord.message === 'string') {
      return dataRecord.message
    }
  }

  if (typeof errorRecord.message === 'string') {
    return errorRecord.message
  }

  return fallback
}

export function getSortParams(sortFilter: SortFilter) {
  if (sortFilter === 'oldest') {
    return { sortBy: 'createdAt' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-asc') {
    return { sortBy: 'name' as const, sortOrder: 'asc' as const }
  }

  if (sortFilter === 'name-desc') {
    return { sortBy: 'name' as const, sortOrder: 'desc' as const }
  }

  return { sortBy: 'createdAt' as const, sortOrder: 'desc' as const }
}
