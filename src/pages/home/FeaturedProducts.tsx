import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErrorState } from '../../components/loaders'
import ProductTile from '../../components/product/ProductTile'
import type { Product } from '../../features/products/productApi'
import { HomeProductGridSkeleton } from './HomeSkeletons'

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
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-2 text-sm font-bold text-[#4f463d]">
            <BadgeCheck className="h-4 w-4 text-[#7a3f1d]" />
            Cart and wishlist ready
          </div>
          <Link
            className="inline-flex items-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            to="/products"
          >
            Explore more
            <ArrowRight className="h-4 w-4" />
          </Link>
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
          <HomeProductGridSkeleton count={10} />
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
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
