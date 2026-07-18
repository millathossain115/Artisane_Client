import {
  ArrowRight,
  BadgeCheck,
  Heart,
  ImageOff,
  Mail,
  PackageSearch,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'

import artistImage from '../assets/artist-optimized.jpg'
import brushLineImage from '../assets/brush-line-optimized.jpg'
import paintTableImage from '../assets/paint-table-optimized.jpg'
import paletteImage from '../assets/palette-optimized.jpg'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import {
  type Category,
  useGetCategoriesQuery,
} from '../features/categories/categoryApi'
import {
  type Product,
  useGetProductsQuery,
} from '../features/products/productApi'

const categoryFallbackImages = [
  paletteImage,
  brushLineImage,
  artistImage,
  paintTableImage,
]

const craftNotes = [
  'Ready-stock craft materials for focused studio time.',
  'Small-batch supplies curated for beginner and daily making.',
  'Tools, kits, and objects chosen for hands-on creative work.',
]

function getAssetUrl(value?: string) {
  if (!value) {
    return undefined
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')

  return baseUrl ? `${baseUrl}${value}` : value
}

function getCategoryName(category: Product['category']) {
  return typeof category === 'string' ? 'Studio goods' : category.name
}

function formatPrice(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`
}

function getProductImage(product?: Product) {
  return getAssetUrl(product?.images?.[0])
}

function getCategoryImage(category: Category, index: number) {
  return (
    getAssetUrl(category.image) ??
    categoryFallbackImages[index % categoryFallbackImages.length]
  )
}

function getProductBadge(product: Product) {
  if (product.stock <= 0) {
    return 'Sold out'
  }

  if (product.stock <= 5) {
    return 'Low stock'
  }

  if (/kit/i.test(product.name) || /kit/i.test(getCategoryName(product.category))) {
    return 'Kit'
  }

  return 'New'
}

function Home() {
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({
    limit: 12,
    page: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: 8,
    page: 1,
  })

  const categories = (categoryList?.data ?? []).filter(
    (category) => category.isActive !== false,
  )
  const products = productList?.data ?? []
  const totalProducts = productList?.meta.total ?? products.length
  const totalCategories = categoryList?.meta.total ?? categories.length
  const heroProduct =
    products.find((product) => getProductImage(product)) ?? products[0]
  const heroImage = getProductImage(heroProduct) ?? artistImage
  const kitCategory =
    categories.find((category) => /kit/i.test(category.name)) ?? categories[0]
  const featureProducts = products.slice(0, 4)
  const galleryProducts = products.slice(4, 8)

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="hero-enter relative isolate overflow-hidden bg-[#181512]">
          <img
            alt={heroProduct?.name ?? 'Artisane studio collection'}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.94),rgba(24,21,18,0.62),rgba(24,21,18,0.18))]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#f6f0e5,rgba(246,240,229,0))]" />

          <div className="relative mx-auto flex min-h-[calc(100svh-132px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[620px] lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                <Sparkles className="h-4 w-4" />
                New in the atelier
              </p>
              <h1 className="text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
                Artisane
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/84">
                Shop stocked kits, tools, and craft materials from the latest
                marketplace edit.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
                  href="#products"
                >
                  Shop products
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  className="inline-flex items-center border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  href="#categories"
                >
                  Browse categories
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8"
          aria-label="Catalog summary"
        >
          {[
            {
              icon: PackageSearch,
              label: 'Products in catalog',
              value: isProductsLoading ? '...' : `${totalProducts}+`,
            },
            {
              icon: Palette,
              label: 'Active craft categories',
              value: isCategoriesLoading ? '...' : `${totalCategories}`,
            },
            {
              icon: Truck,
              label: 'Ready for order flow',
              value: 'Stocked',
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                className="flex items-center justify-between gap-4 border-y border-black/10 py-5"
                key={item.label}
              >
                <div>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6b5f53]">
                    {item.label}
                  </p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            )
          })}
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
          id="categories"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                Categories
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Choose the craft first
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-bold text-[#181512]"
              href="#products"
            >
              View newest products
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {hasCategoriesError ? (
            <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-4 text-sm font-semibold text-[#7a3f1d]">
              Could not load categories.
            </div>
          ) : null}

          <div className="mt-8 flex gap-4 overflow-x-auto pb-3">
            {isCategoriesLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="h-72 w-72 shrink-0 animate-pulse bg-white"
                    key={index}
                  />
                ))
              : categories.slice(0, 8).map((category, index) => (
                  <a
                    className="group relative h-72 w-72 shrink-0 overflow-hidden bg-[#181512]"
                    href="#products"
                    key={category._id}
                  >
                    <img
                      alt={`${category.name} category`}
                      className="absolute inset-0 h-full w-full object-cover opacity-76 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                      src={getCategoryImage(category, index)}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.04),rgba(24,21,18,0.84))]" />
                    <div className="relative flex h-full flex-col justify-end p-5 text-white">
                      <p className="text-sm font-bold text-[#f1c9a6]">
                        {category.slug}
                      </p>
                      <h3 className="mt-2 text-3xl font-bold">
                        {category.name}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/76">
                        {category.description ??
                          craftNotes[index % craftNotes.length]}
                      </p>
                    </div>
                  </a>
                ))}
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
          id="products"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                Current products
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Ready-stock favorites
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#4f463d]">
              <BadgeCheck className="h-4 w-4 text-[#7a3f1d]" />
              In stock now
            </div>
          </div>

          {hasProductsError ? (
            <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-4 text-sm font-semibold text-[#7a3f1d]">
              Could not load products.
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isProductsLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    className="h-[430px] animate-pulse bg-white"
                    key={index}
                  />
                ))
              : featureProducts.map((product) => {
                  const imageUrl = getProductImage(product)

                  return (
                    <article
                      className="group overflow-hidden border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(24,21,18,0.12)]"
                      key={product._id}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#e4d8c8]">
                        {imageUrl ? (
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            src={imageUrl}
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-[#7a3f1d]">
                            <ImageOff className="h-8 w-8" />
                          </div>
                        )}
                        <div className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-bold text-[#7a3f1d]">
                          {getProductBadge(product)}
                        </div>
                        <button
                          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
                          aria-label={`Save ${product.name}`}
                          type="button"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#7a3f1d]">
                          <span>{getCategoryName(product.category)}</span>
                          <span className="inline-flex items-center gap-1 text-[#4f463d]">
                            <Star className="h-3.5 w-3.5 fill-[#c85f2f] text-[#c85f2f]" />
                            New
                          </span>
                        </div>
                        <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-bold leading-snug">
                          {product.name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-[#6b5f53]">
                          {product.brand ?? 'Artisane Studio'}
                        </p>
                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div>
                            <span className="text-xl font-bold">
                              {formatPrice(product.price)}
                            </span>
                            <p className="mt-1 text-xs font-semibold text-[#8a7d71]">
                              {product.stock} in stock
                            </p>
                          </div>
                          <button
                            className="grid h-10 w-10 place-items-center bg-[#181512] text-white transition hover:bg-[#7a3f1d]"
                            aria-label={`Add ${product.name} to cart`}
                            type="button"
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
          </div>
        </section>

        <section className="bg-[#181512] px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
                {kitCategory?.name ?? 'Starter Kits'}
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold sm:text-5xl">
                Kits for weekend making.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
                Paint, textile, clay, and studio kits are stocked for easy
                browsing and quick creative starts.
              </p>
              <a
                className="mt-7 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
                href="#products"
              >
                Browse the drop
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {galleryProducts.map((product) => {
                const imageUrl = getProductImage(product)

                return (
                  <article className="group" key={product._id}>
                    <div className="aspect-[5/4] overflow-hidden bg-white/10">
                      {imageUrl ? (
                        <img
                          alt={product.name}
                          className="h-full w-full object-cover opacity-88 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                          src={imageUrl}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-white/50">
                          <ImageOff className="h-7 w-7" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5">
                        {product.name}
                      </h3>
                      <span className="shrink-0 text-sm font-bold text-[#f1c9a6]">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-black/10 py-10 md:grid-cols-[1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                Studio list
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
                Get new drops before they reach the shelf.
              </h2>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                className="min-h-12 flex-1 border border-black/10 bg-white px-4 text-sm outline-none placeholder:text-[#8a7d71] focus:border-[#181512]"
                placeholder="Email address"
                type="email"
              />
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                type="button"
              >
                Join list
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
