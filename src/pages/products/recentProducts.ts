import type { Product } from '../../features/products/productApi'
import { getProductCategoryName } from '../../utils/productDisplay'

export type RecentProduct = {
  brand?: string
  categoryName: string
  id: string
  image?: string
  name: string
  price: number
  slug: string
}

const RECENTLY_VIEWED_KEY = 'artisane_recently_viewed'

function createRecentProduct(product: Product): RecentProduct {
  return {
    brand: product.brand,
    categoryName: getProductCategoryName(product),
    id: product._id,
    image: product.images?.[0],
    name: product.name,
    price: product.price,
    slug: product.slug,
  }
}

export function loadRecentProducts(currentProductId?: string) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedProducts = window.localStorage.getItem(RECENTLY_VIEWED_KEY)

    if (!storedProducts) {
      return []
    }

    const parsedProducts = JSON.parse(storedProducts) as RecentProduct[]

    if (!Array.isArray(parsedProducts)) {
      return []
    }

    const seenIds = new Set<string>()
    return parsedProducts.filter((product) => {
      if (!product || !product.id || seenIds.has(product.id) || product.id === currentProductId) {
        return false
      }
      seenIds.add(product.id)
      return true
    })
  } catch {
    return []
  }
}

export function saveRecentProduct(product: Product) {
  if (typeof window === 'undefined') {
    return
  }

  const nextProduct = createRecentProduct(product)
  const recentProducts = loadRecentProducts(product._id)
  const nextProducts = [nextProduct, ...recentProducts].slice(0, 8)

  window.localStorage.setItem(
    RECENTLY_VIEWED_KEY,
    JSON.stringify(nextProducts),
  )
}
