import { useMemo } from 'react'
import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ProductTile from '../components/product/ProductTile'
import {
  type Category,
  useGetCategoriesQuery,
} from '../features/categories/categoryApi'
import {
  type Product,
  useGetProductsQuery,
} from '../features/products/productApi'
import { getAssetUrl } from '../utils/productDisplay'
import { categoryFallbackImages } from './home/homeContent'

function getCategoryUrl(categoryId: string) {
  return `/products?category=${encodeURIComponent(categoryId)}`
}

function getCategoryImage(category: Category, index: number) {
  return (
    getAssetUrl(category.image) ??
    categoryFallbackImages[index % categoryFallbackImages.length]
  )
}

function shuffleProducts(products: Product[]) {
  const shuffledProducts = [...products]

  for (let index = shuffledProducts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentProduct = shuffledProducts[index]
    shuffledProducts[index] = shuffledProducts[randomIndex]
    shuffledProducts[randomIndex] = currentProduct
  }

  return shuffledProducts
}

function Categories() {
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({
    limit: 100,
    page: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: 40,
    page: 1,
  })
  const categories = (categoryList?.data ?? []).filter(
    (category) => category.isActive !== false,
  )
  const products = useMemo(() => productList?.data ?? [], [productList?.data])
  const featuredProducts = useMemo(() => {
    return shuffleProducts(products).slice(0, 8)
  }, [products])

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="border-b border-black/10 pb-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              Categories
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Shop by craft
            </h1>
            <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
              Choose a category to view every product in that collection.
            </p>
          </div>

          {hasCategoriesError ? (
            <div className="mt-6 border border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-4 text-sm font-bold text-[#8f3f1d]">
              Could not load categories.
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {isCategoriesLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    className="h-44 animate-pulse bg-white sm:h-64"
                    key={index}
                  />
                ))
              : categories.map((category, index) => {
                  const imageUrl = getCategoryImage(category, index)

                  return (
                    <Link
                      className="group overflow-hidden border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#181512] hover:shadow-[0_18px_34px_rgba(24,21,18,0.12)]"
                      key={category._id}
                      to={getCategoryUrl(category._id)}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#e4d8c8]">
                        {imageUrl ? (
                          <img
                            alt={`${category.name} category`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            src={imageUrl}
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-[#7a3f1d]">
                            <ImageOff className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h2 className="line-clamp-2 text-base font-bold sm:text-xl">
                          {category.name}
                        </h2>
                      </div>
                    </Link>
                  )
                })}
          </div>
        </section>

        <section className="bg-[#181512] px-4 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
                  Products
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Fresh picks
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-white/64">
                This selection reshuffles each time you visit.
              </p>
            </div>

            {hasProductsError ? (
              <div className="mt-8 border border-white/10 bg-white/10 px-5 py-4 text-sm font-semibold text-white">
                Could not load products.
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {isProductsLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div
                      className="h-52 animate-pulse bg-white/10 sm:h-[438px]"
                      key={index}
                    />
                  ))
                : featuredProducts.map((product) => (
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
      </main>

      <Footer />
    </div>
  )
}

export default Categories
