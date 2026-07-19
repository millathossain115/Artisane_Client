import { ArrowRight } from 'lucide-react'

import ProductTile from '../../components/product/ProductTile'
import type { Category } from '../../features/categories/categoryApi'
import type { Product } from '../../features/products/productApi'

type KitProductsProps = {
  fallbackProducts: Product[]
  kitCategory?: Category
  products: Product[]
}

function KitProducts({
  fallbackProducts,
  kitCategory,
  products,
}: KitProductsProps) {
  const visibleProducts = products.length
    ? products
    : fallbackProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            {kitCategory?.name ?? 'Starter Kits'}
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold sm:text-5xl">
            Kits for weekend making.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#6b5f53]">
            Paint, textile, clay, jewelry, and storage products are stocked so
            shoppers can build a complete cart from one home page.
          </p>
          <a
            className="mt-7 inline-flex items-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            href="#products"
          >
            Browse the drop
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5">
          {visibleProducts.map((product) => (
            <ProductTile
              key={product._id}
              product={product}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default KitProducts
