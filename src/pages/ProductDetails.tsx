import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  ImageOff,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { addToCart, createCartItem } from '../features/cart/cartSlice'
import {
  type Product,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from '../features/products/productApi'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

type RecentProduct = {
  brand?: string
  categoryName: string
  id: string
  image?: string
  name: string
  price: number
  slug: string
}

const RECENTLY_VIEWED_KEY = 'artisane_recently_viewed'

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

function getCategoryId(product?: Product | null) {
  if (!product) {
    return undefined
  }

  return typeof product.category === 'string'
    ? product.category
    : product.category._id
}

function getCategoryName(product?: Product | null) {
  if (!product) {
    return 'Studio goods'
  }

  return typeof product.category === 'string'
    ? 'Studio goods'
    : product.category.name
}

function formatPrice(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`
}

function createRecentProduct(product: Product): RecentProduct {
  return {
    brand: product.brand,
    categoryName: getCategoryName(product),
    id: product._id,
    image: product.images?.[0],
    name: product.name,
    price: product.price,
    slug: product.slug,
  }
}

function loadRecentProducts(currentProductId?: string) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedProducts = window.localStorage.getItem(RECENTLY_VIEWED_KEY)

    if (!storedProducts) {
      return []
    }

    const parsedProducts = JSON.parse(storedProducts) as RecentProduct[]

    if (!Array.isArray(parsedProducts)) {
      return []
    }

    return parsedProducts.filter((product) => product.id !== currentProductId)
  } catch {
    return []
  }
}

function saveRecentProduct(product: Product) {
  if (typeof window === 'undefined') {
    return
  }

  const nextProduct = createRecentProduct(product)
  const recentProducts = loadRecentProducts(product._id)
  const nextProducts = [nextProduct, ...recentProducts].slice(0, 8)

  window.localStorage.setItem(
    RECENTLY_VIEWED_KEY,
    JSON.stringify(nextProducts),
  )
}

function ProductShelfCard({ product }: { product: Product }) {
  const imageUrl = getAssetUrl(product.images?.[0])

  return (
    <Link
      className="group block overflow-hidden border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(24,21,18,0.12)]"
      to={`/products/${product._id}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#e4d8c8]">
        {imageUrl ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#7a3f1d]">
            <ImageOff className="h-7 w-7" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
          {getCategoryName(product)}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-10 text-base font-bold leading-snug">
          {product.name}
        </h3>
        <p className="mt-3 text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

function RecentShelfCard({ product }: { product: RecentProduct }) {
  const imageUrl = getAssetUrl(product.image)

  return (
    <Link
      className="group block overflow-hidden border border-white/10 bg-white text-[#181512] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]"
      to={`/products/${product.id}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#e4d8c8]">
        {imageUrl ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#7a3f1d]">
            <ImageOff className="h-7 w-7" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
          {product.categoryName}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-10 text-base font-bold leading-snug">
          {product.name}
        </h3>
        <p className="mt-3 text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

function ProductDetails() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const { id } = useParams<{ id: string }>()
  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(id ?? '', {
    skip: !id,
  })
  const categoryId = getCategoryId(product)
  const { data: similarProductList } = useGetProductsQuery(
    {
      category: categoryId,
      limit: 5,
      page: 1,
    },
    { skip: !categoryId },
  )
  const { data: mayLikeProductList } = useGetProductsQuery({
    limit: 24,
    page: 1,
  })
  const [selectedImage, setSelectedImage] = useState({
    productId: '',
    value: '',
  })
  const [quantitySelection, setQuantitySelection] = useState({
    productId: '',
    value: 1,
  })
  const [status, setStatus] = useState({
    message: '',
    productId: '',
  })

  const productImages = useMemo(
    () => product?.images?.map((image) => getAssetUrl(image) ?? image) ?? [],
    [product?.images],
  )
  const mainImage =
    selectedImage.productId === product?._id && selectedImage.value
      ? selectedImage.value
      : productImages[0]
  const similarProducts =
    similarProductList?.data.filter((item) => item._id !== product?._id) ?? []
  const similarProductIds = new Set(similarProducts.map((item) => item._id))
  const mayLikeProducts =
    mayLikeProductList?.data.filter(
      (item) =>
        item._id !== product?._id &&
        getCategoryId(item) !== categoryId &&
        !similarProductIds.has(item._id),
    ) ?? []
  const isOutOfStock = !product || product.stock <= 0
  const quantity =
    quantitySelection.productId === product?._id ? quantitySelection.value : 1
  const safeQuantity = product ? Math.min(quantity, product.stock) : quantity
  const recentProducts = loadRecentProducts(product?._id ?? id)
  const visibleStatus =
    status.productId === product?._id ? status.message : ''

  useEffect(() => {
    if (!product) {
      return
    }

    saveRecentProduct(product)
  }, [product])

  function updateQuantity(nextQuantity: number) {
    if (!product) {
      return
    }

    setQuantitySelection({
      productId: product._id,
      value: Math.min(Math.max(1, nextQuantity), product.stock),
    })
  }

  function handleAddToCart() {
    if (!product || isOutOfStock) {
      return
    }

    const isAlreadyInCart = cartItems.some((item) => item.id === product._id)

    dispatch(addToCart(createCartItem(product, safeQuantity)))
    setStatus({
      message: isAlreadyInCart
        ? `${product.name} is already in your cart.`
        : `${product.name} added to cart.`,
      productId: product._id,
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4f463d] transition hover:text-[#181512]"
            to="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          {isLoading ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="aspect-[4/3] animate-pulse bg-white" />
              <div className="min-h-96 animate-pulse bg-white" />
            </div>
          ) : null}

          {isError || (!isLoading && !product) ? (
            <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-8 text-center">
              <p className="text-lg font-bold">Product not found.</p>
              <p className="mt-2 text-sm text-[#6b5f53]">
                This product may be unavailable or removed.
              </p>
            </div>
          ) : null}

          {product ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <div>
                <div className="overflow-hidden bg-white">
                  <div className="relative aspect-[4/3] bg-[#e4d8c8]">
                    {mainImage ? (
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover"
                        src={mainImage}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-[#7a3f1d]">
                        <ImageOff className="h-10 w-10" />
                      </div>
                    )}

                  </div>
                </div>

                {productImages.length > 0 ? (
                  <div className="mt-4 border border-black/10 bg-white p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                        View images
                      </p>
                      <p className="text-xs font-bold text-[#6b5f53]">
                        {productImages.findIndex((image) => image === mainImage) + 1}
                        /{productImages.length}
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:gap-3">
                      {productImages.map((image, index) => (
                        <button
                          aria-label={`View ${product.name} image ${index + 1}`}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-white transition sm:h-20 sm:w-20 ${
                            mainImage === image
                              ? 'border-[#181512]'
                              : 'border-black/10 hover:border-[#7a3f1d]'
                          }`}
                          key={image}
                          onClick={() =>
                            setSelectedImage({
                              productId: product._id,
                              value: image,
                            })
                          }
                          type="button"
                        >
                          <img
                            alt=""
                            className="h-full w-full object-cover"
                            src={image}
                          />
                          {mainImage === image ? (
                            <span className="absolute inset-x-0 bottom-0 bg-[#181512] py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                              Viewing
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="lg:sticky lg:top-28">
                <div className="border border-black/10 bg-white p-5 sm:p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                    {getCategoryName(product)}
                  </p>
                  <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
                    {product.brand ?? 'Artisane Studio'}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#effaf3] px-3 py-1 text-xs font-bold text-[#1f6b43]">
                      <PackageCheck className="h-3.5 w-3.5" />
                      {product.stock} in stock
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#f8f3ea] px-3 py-1 text-xs font-bold text-[#4f463d]">
                      <Star className="h-3.5 w-3.5 fill-[#c85f2f] text-[#c85f2f]" />
                      New
                    </span>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-[#6b5f53]">
                    {product.description ||
                      'Curated craft product for studio work, gifting, and creative weekends.'}
                  </p>

                  <div className="mt-6 grid gap-3 border-y border-black/10 py-5 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-5 w-5 text-[#7a3f1d]" />
                      <div>
                        <p className="font-bold">Ready dispatch</p>
                        <p className="mt-1 text-xs leading-5 text-[#6b5f53]">
                          Packed from current stock.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 h-5 w-5 text-[#7a3f1d]" />
                      <div>
                        <p className="font-bold">Curated quality</p>
                        <p className="mt-1 text-xs leading-5 text-[#6b5f53]">
                          Selected for craft use.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-bold">Quantity</p>
                    <div className="mt-2 inline-grid grid-cols-[44px_64px_44px] overflow-hidden border border-black/10 bg-white">
                      <button
                        aria-label="Decrease quantity"
                        className="grid h-11 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={safeQuantity <= 1 || isOutOfStock}
                        onClick={() => updateQuantity(safeQuantity - 1)}
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="grid h-11 place-items-center border-x border-black/10 text-sm font-bold">
                        {isOutOfStock ? 0 : safeQuantity}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        className="grid h-11 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={safeQuantity >= product.stock || isOutOfStock}
                        onClick={() => updateQuantity(safeQuantity + 1)}
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {visibleStatus ? (
                    <p className="mt-4 bg-[#effaf3] px-4 py-3 text-sm font-bold text-[#1f6b43]">
                      {visibleStatus}
                    </p>
                  ) : null}

                  <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <button
                      className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isOutOfStock}
                      onClick={handleAddToCart}
                      type="button"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to cart
                    </button>
                    <button
                      aria-label="Add to wishlist"
                      className="grid h-12 w-full place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-[#f8f3ea] sm:w-12"
                      type="button"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="mt-3 min-h-12 w-full border border-black/10 bg-[#f8f3ea] px-5 text-sm font-bold text-[#6b5f53] disabled:cursor-not-allowed"
                    disabled
                    type="button"
                  >
                    Buy now coming with checkout
                  </button>
                </div>
              </aside>
            </div>
          ) : null}
        </section>

        {similarProducts.length ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Similar products
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  More in {getCategoryName(product)}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.slice(0, 4).map((item) => (
                <ProductShelfCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}

        {recentProducts.length ? (
          <section className="bg-[#181512] px-4 py-12 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
                Recently viewed
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Pick up where you left off
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recentProducts.slice(0, 4).map((item) => (
                  <RecentShelfCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {mayLikeProducts.length ? (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
              You may like
            </p>
            <h2 className="mt-3 text-3xl font-bold">Fresh shelf picks</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mayLikeProducts.slice(0, 4).map((item) => (
                <ProductShelfCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails
