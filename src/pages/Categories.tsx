import { useMemo } from 'react'
import { ArrowRight, ImageOff } from 'lucide-react'
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
import { getAssetUrl, getCategoryProductsUrl } from '../utils/productDisplay'
import { categoryFallbackImages } from './home/homeContent'

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

function sortByNewest(products: Product[]) {
  return [...products].sort((firstProduct, secondProduct) => {
    return (
      new Date(secondProduct.createdAt ?? 0).getTime() -
      new Date(firstProduct.createdAt ?? 0).getTime()
    )
  })
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
    return shuffleProducts(products).slice(0, 10)
  }, [products])
  const popularCategories = useMemo(() => {
    return [...categories]
      .sort((firstCategory, secondCategory) => {
        return (
          (secondCategory.productCount ?? 0) - (firstCategory.productCount ?? 0)
        )
      })
      .slice(0, 4)
  }, [categories])
  const latestProducts = useMemo(() => {
    return sortByNewest(products).slice(0, 5)
  }, [products])
  const shoppingPaths = [
    {
      description: 'Kits, tools, and compact supplies for first projects.',
      label: 'Starter kits',
      to: '/products?search=kit',
    },
    {
      description: 'Gift-ready handmade pieces and craft sets.',
      label: 'Gift picks',
      to: '/products?search=gift',
    },
    {
      description: 'Wall art, decor, and display pieces for rooms.',
      label: 'Home decor',
      to: '/products?search=decor',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="border-b border-black/10 pb-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              Categories
            </p>
            <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-4xl font-bold sm:text-5xl">
                  Shop by craft
                </h1>
                <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
                  Choose a category to view every product in that collection.
                </p>
              </div>
              <Link
                className="inline-flex items-center justify-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                to="/products"
              >
                Explore products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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
                      to={getCategoryProductsUrl(category)}
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
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
                          {category.productCount ?? 0}{' '}
                          {(category.productCount ?? 0) === 1
                            ? 'product'
                            : 'products'}
                        </p>
                      </div>
                    </Link>
                  )
                })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                Popular collections
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Most stocked crafts
              </h2>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products"
            >
              See more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isCategoriesLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div className="h-72 animate-pulse bg-white" key={index} />
                ))
              : popularCategories.map((category, index) => {
                  const imageUrl = getCategoryImage(category, index)

                  return (
                    <Link
                      className="group relative min-h-72 overflow-hidden bg-[#181512] text-white"
                      key={category._id}
                      to={getCategoryProductsUrl(category)}
                    >
                      {imageUrl ? (
                        <img
                          alt={`${category.name} category`}
                          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-86"
                          src={imageUrl}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.08),rgba(24,21,18,0.9))]" />
                      <div className="relative flex min-h-72 flex-col justify-end p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f1c9a6]">
                          {category.productCount ?? 0}{' '}
                          {(category.productCount ?? 0) === 1
                            ? 'product'
                            : 'products'}
                        </p>
                        <h3 className="mt-3 text-3xl font-bold">
                          {category.name}
                        </h3>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                          See collection
                          <ArrowRight className="h-4 w-4" />
                        </span>
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
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <p className="max-w-sm text-sm leading-6 text-white/64 sm:text-right">
                  This selection reshuffles each time you visit.
                </p>
                <Link
                  className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1c9a6]"
                  to="/products"
                >
                  View more products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {hasProductsError ? (
              <div className="mt-8 border border-white/10 bg-white/10 px-5 py-4 text-sm font-semibold text-white">
                Could not load products.
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {isProductsLoading
                ? Array.from({ length: 10 }).map((_, index) => (
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

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                New stock
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Latest arrivals
              </h2>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products?sort=newest"
            >
              Explore more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {isProductsLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    className="h-52 animate-pulse bg-white sm:h-[438px]"
                    key={index}
                  />
                ))
              : latestProducts.map((product) => (
                  <ProductTile
                    key={product._id}
                    product={product}
                    variant="compact"
                  />
                ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#f8f3ea] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Shop by need
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Start with a purpose
                </h2>
              </div>
              <Link
                className="inline-flex items-center justify-center gap-2 bg-[#181512] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                to="/products"
              >
                Load more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {shoppingPaths.map((path) => (
                <Link
                  className="group border-y border-black/10 py-5 transition hover:border-[#181512]"
                  key={path.label}
                  to={path.to}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{path.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                        {path.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#7a3f1d] transition group-hover:translate-x-1" />
                  </div>
                </Link>
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
