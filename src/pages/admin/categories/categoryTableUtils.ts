import { API_BASE_URL } from '../../../config/api'
import type { Category } from '../../../features/categories/categoryApi'

export type CategoryEditForm = {
  description: string
  name: string
  slug: string
}

export type SortFilter = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

export const PAGE_SIZE_OPTIONS = [5, 10, 20]
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function truncateWords(text: string, maxWords = 10) {
  if (!text) {
    return ''
  }
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) {
    return text
  }
  return `${words.slice(0, maxWords).join(' ')}..`
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

export function getCategoryImageUrl(category: Category) {
  if (!category.image) {
    return ''
  }

  if (category.image.startsWith('http')) {
    return category.image
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${category.image}`
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

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function truncateFileName(name: string, maxLength = 20) {
  if (name.length <= maxLength) {
    return name
  }

  const dotIndex = name.lastIndexOf('.')
  if (dotIndex > 0 && name.length - dotIndex <= 6) {
    const ext = name.slice(dotIndex)
    const baseName = name.slice(0, dotIndex)
    const keepChars = Math.max(3, maxLength - ext.length - 3)
    if (baseName.length > keepChars) {
      return `${baseName.slice(0, keepChars)}...${ext}`
    }
  }

  return `${name.slice(0, maxLength - 3)}...`
}

export function isCategoryActive(category: Category) {
  return category.isActive ?? !category.isDeleted
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
