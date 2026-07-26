import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SkeletonCard } from '../../components/loaders'
import ProductTile from '../../components/product/ProductTile'
import type { Product } from '../../features/products/productApi'

type TopRatedProductsProps = {
  isLoading: boolean
  products: Product[]
}

function TopRatedProducts({ isLoading, products }: TopRatedProductsProps) {
  if (!isLoading && !products.length) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Top rated
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Loved by shoppers
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-2 text-sm font-bold text-[#4f463d]">
            <Star className="h-4 w-4 fill-[#c85f2f] text-[#c85f2f]" />
            Based on product ratings
          </div>
          <Link
            className="inline-flex items-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            to="/products?sort=rating-desc"
          >
            View top rated
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <SkeletonCard count={5} gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductTile
                key={product._id}
                product={product}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TopRatedProducts
