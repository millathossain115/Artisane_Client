import { BadgeCheck } from 'lucide-react'

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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Featured products
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Ready-stock favorites
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#4f463d]">
          <BadgeCheck className="h-4 w-4 text-[#7a3f1d]" />
          Cart and wishlist ready
        </div>
      </div>

      {hasError ? (
        <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-4 text-sm font-semibold text-[#7a3f1d]">
          Could not load products.
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                className="h-52 animate-pulse bg-white sm:h-[472px]"
                key={index}
              />
            ))
          : products.map((product) => (
              <ProductTile key={product._id} product={product} />
            ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
