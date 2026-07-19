import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ProductTile from '../components/product/ProductTile'
import { useGetProductsQuery } from '../features/products/productApi'

function Products() {
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search')?.trim() ?? ''
  const {
    data: productList,
    isError,
    isLoading,
  } = useGetProductsQuery({
    limit: 24,
    page: 1,
    searchTerm: searchTerm || undefined,
  })
  const products = productList?.data ?? []

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="border-b border-black/10 pb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Products
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {searchTerm ? `Search: ${searchTerm}` : 'All products'}
          </h1>
          <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
            {productList?.meta.total ?? products.length} products found.
          </p>
        </section>

        {isError ? (
          <div className="mt-6 border border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-4 text-sm font-bold text-[#8f3f1d]">
            Could not load products.
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div className="h-[472px] animate-pulse bg-white" key={index} />
              ))
            : products.map((product) => (
                <ProductTile key={product._id} product={product} />
              ))}
        </div>

        {!isLoading && !products.length ? (
          <div className="mt-10 grid min-h-72 place-items-center border border-black/10 bg-white text-center">
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Search className="h-6 w-6" />
              </span>
              <p className="mt-4 text-lg font-bold">No products found.</p>
              <p className="mt-2 text-sm text-[#6b5f53]">
                Try another product name, category, or brand.
              </p>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default Products
