import type { Product } from '../features/products/productApi'

export function getAssetUrl(value?: string) {
  if (!value) {
    return undefined
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')

  return baseUrl ? `${baseUrl}${value}` : value
}

export function getCategoryName(category?: Product['category'] | null) {
  return typeof category === 'string' || !category
    ? 'Studio goods'
    : category.name
}

export function getProductCategoryId(product?: Product | null) {
  if (!product) {
    return undefined
  }

  return typeof product.category === 'string'
    ? product.category
    : product.category._id
}

export function getProductCategoryName(product?: Product | null) {
  return product ? getCategoryName(product.category) : 'Studio goods'
}

export function formatPrice(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`
}

export function getProductImage(product?: Product) {
  return getAssetUrl(product?.images?.[0])
}

export function getProductBadge(product: Product) {
  if (product.stock <= 0) {
    return 'Sold out'
  }

  if (product.stock <= 5) {
    return 'Low stock'
  }

  if (
    /kit/i.test(product.name) ||
    /kit/i.test(getCategoryName(product.category))
  ) {
    return 'Kit'
  }

  return 'New'
}
