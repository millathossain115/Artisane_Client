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
          <p className="max-w-sm text-sm leading-6 text-white/64">
            A denser product wall for quick scanning across every screen.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  className="h-52 animate-pulse bg-white/10 sm:h-[438px]"
                  key={index}
                />
              ))
            : products.map((product) => (
                <ProductTile
                  key={product._id}
                  product={product}
                  tone="dark"
                  variant="compact"
                />
              ))}
        </div>
      </div>
    </section>
  )
}

export default LatestProducts
