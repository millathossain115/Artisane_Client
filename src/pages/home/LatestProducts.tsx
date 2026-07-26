import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SkeletonCard } from '../../components/loaders'
import ProductTile from '../../components/product/ProductTile'
import type { Product } from '../../features/products/productApi'

type LatestProductsProps = {
  isLoading: boolean
  products: Product[]
}

function LatestProducts({ isLoading, products }: LatestProductsProps) {
  return (
    <section
      className="bg-[#181512] px-4 py-14 text-white sm:px-6 lg:px-8"
      id="latest"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
              Latest arrivals
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Recently added to the shelf
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="max-w-sm text-sm leading-6 text-white/64 sm:text-right">
              A denser product wall for quick scanning across every screen.
            </p>
            <Link
              className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1c9a6]"
              to="/products?sort=newest"
            >
              View latest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <SkeletonCard count={10} gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductTile
                  key={product._id}
                  product={product}
                  tone="dark"
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default LatestProducts
