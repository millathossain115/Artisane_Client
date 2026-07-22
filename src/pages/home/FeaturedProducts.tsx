import { BadgeCheck } from 'lucide-react'

import { ErrorState, SkeletonCard } from '../../components/loaders'
import ProductTile from '../../components/product/ProductTile'
import type { Product } from '../../features/products/productApi'

type FeaturedProductsProps = {
  hasError: boolean
  isLoading: boolean
  products: Product[]
}

function FeaturedProducts({
  hasError,
  isLoading,
  products,
}: FeaturedProductsProps) {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      id="products"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Craft catalog
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Featured products
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#4f463d]">
          <BadgeCheck className="h-4 w-4 text-[#7a3f1d]" />
          Cart and wishlist ready
        </div>
      </div>

      {hasError ? (
        <ErrorState
          title="Unable to load products"
          message="Failed to fetch featured product collection."
          onRetry={() => window.location.reload()}
        />
      ) : null}

      <div className="mt-8">
        {isLoading ? (
          <SkeletonCard count={8} gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductTile key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
