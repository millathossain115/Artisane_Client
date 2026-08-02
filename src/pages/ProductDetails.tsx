import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ErrorState } from '../components/loaders'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import {
  getAccessToken,
  getStoredUser,
  isAdminRole,
} from '../features/auth/authApi'
import { addToCart, createCartItem } from '../features/cart/cartSlice'
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from '../features/products/productApi'
import { useGetProductReviewsQuery } from '../features/reviews/reviewApi'
import {
  getWishlistProductId,
  useAddWishlistProductMutation,
  useDeleteWishlistProductMutation,
  useGetMyWishlistQuery,
} from '../features/wishlists/wishlistApi'
import { useGetActivePromoQuery } from '../features/promo/promoApi'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProductPriceInfo } from '../utils/priceUtils'
import {
  getAssetUrl,
  getProductCategoryId,
  getProductCategoryName,
} from '../utils/productDisplay'
import WhyChooseUs from './home/WhyChooseUs'
import ProductGallery from './products/ProductGallery'
import ProductPurchasePanel from './products/ProductPurchasePanel'
import ProductShelfSection from './products/ProductShelfSection'
import RecentlyViewedSection from './products/RecentlyViewedSection'
import {
  loadRecentProducts,
  type RecentProduct,
  saveRecentProduct,
} from './products/recentProducts'

function renderStars(
  value: number,
  sizeClass = 'text-lg',
  colorClass = 'text-[#ff9400]',
) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      className={`${sizeClass} ${
        index < value ? colorClass : 'text-[#e5dcd0]'
      }`}
      key={index}
    >
      ★
    </span>
  ))
}

function ProductDetailsSkeletonBlock({
  className = '',
}: {
  className?: string
}) {
  return <div className={`animate-pulse bg-[#e9dfd2] ${className}`} />
}

function ProductDetailsSkeleton() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div>
        <div className="relative overflow-hidden border border-black/10 bg-white">
          <ProductDetailsSkeletonBlock className="aspect-[4/3] w-full bg-[#efe5d8]" />
        </div>

        <div className="mt-4 border border-black/10 bg-white p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <ProductDetailsSkeletonBlock className="h-3 w-28" />
            <ProductDetailsSkeletonBlock className="h-3 w-8" />
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-hidden pb-1 sm:gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductDetailsSkeletonBlock
                className="h-16 w-16 shrink-0 border-2 border-black/10 bg-[#efe5d8] sm:h-20 sm:w-20"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <ProductDetailsSkeletonBlock className="h-3 w-36" />
            <ProductDetailsSkeletonBlock className="h-10 w-10 shrink-0 bg-[#f8f3ea]" />
          </div>

          <ProductDetailsSkeletonBlock className="mt-4 h-10 w-11/12 sm:h-12" />
          <ProductDetailsSkeletonBlock className="mt-3 h-4 w-40" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ProductDetailsSkeletonBlock className="h-9 w-28" />
            <ProductDetailsSkeletonBlock className="h-7 w-24 bg-[#f8f3ea]" />
            <ProductDetailsSkeletonBlock className="h-7 w-16 bg-[#f8f3ea]" />
          </div>

          <div className="mt-6 space-y-3">
            <ProductDetailsSkeletonBlock className="h-4 w-full" />
            <ProductDetailsSkeletonBlock className="h-4 w-11/12" />
            <ProductDetailsSkeletonBlock className="h-4 w-2/3" />
          </div>

          <div className="mt-6 grid gap-3 border-y border-black/10 py-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <ProductDetailsSkeletonBlock className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <ProductDetailsSkeletonBlock className="h-4 w-28" />
                  <ProductDetailsSkeletonBlock className="mt-2 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>

          <ProductDetailsSkeletonBlock className="mt-6 h-4 w-20" />
          <ProductDetailsSkeletonBlock className="mt-2 h-11 w-40" />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProductDetailsSkeletonBlock className="h-12 w-full bg-[#181512]/20" />
            <ProductDetailsSkeletonBlock className="h-12 w-full bg-[#f8f3ea]" />
          </div>
        </div>
      </aside>

      <section className="mt-6 border border-black/10 bg-white lg:col-span-2">
        <div className="border-b border-black/10 p-4 sm:p-5">
          <ProductDetailsSkeletonBlock className="h-3 w-32" />
          <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-center lg:gap-8">
            <div className="border-b border-black/10 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 lg:pr-8">
              <ProductDetailsSkeletonBlock className="h-10 w-24" />
              <ProductDetailsSkeletonBlock className="mt-2 h-4 w-28" />
              <ProductDetailsSkeletonBlock className="mt-2 h-3 w-36" />
            </div>
            <div className="grid w-full max-w-md gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="grid grid-cols-[74px_1fr_20px] items-center gap-2.5"
                  key={index}
                >
                  <ProductDetailsSkeletonBlock className="h-3 w-full" />
                  <ProductDetailsSkeletonBlock className="h-2 w-full rounded-full" />
                  <ProductDetailsSkeletonBlock className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

function ProductDetails() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const accessToken = getAccessToken()
  const isAdmin = isAdminRole(getStoredUser()?.role)
  const cartItems = useAppSelector((state) => state.cart.items)
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id ?? '')

  useEffect(() => {
    if (product?.name) {
      document.title = `Artisane | ${product.name}`
    }
  }, [product?.name])

  const { data: activePromo } = useGetActivePromoQuery()
  const productCategoryId = getProductCategoryId(product)
  const { data: categoryProductsResult } = useGetProductsQuery(
    {
      category: productCategoryId,
      limit: 12,
    },
    {
      skip: !productCategoryId,
    },
  )
  const { data: topRatedProductsResult } = useGetProductsQuery({
    limit: 10,
    sortBy: 'rating',
    sortOrder: 'desc',
  })
  const { data: latestProductsResult } = useGetProductsQuery({
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const { data: wishlistItems } = useGetMyWishlistQuery(undefined, {
    skip: !accessToken || isAdmin,
  })
  const { data: productReviewsData, isLoading: isReviewLoading } =
    useGetProductReviewsQuery(
      { productId: product?._id ?? '' },
      {
        skip: !product?._id,
      },
    )

  const productReviews = useMemo(
    () => productReviewsData?.data ?? [],
    [productReviewsData?.data],
  )

  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    productReviews.forEach((review) => {
      const r = Math.round(review.rating)
      if (r >= 1 && r <= 5) {
        counts[r as keyof typeof counts]++
      }
    })
    return counts
  }, [productReviews])

  const [addWishlistProduct, { isLoading: isAddingWishlist }] =
    useAddWishlistProductMutation()
  const [deleteWishlistProduct, { isLoading: isDeletingWishlist }] =
    useDeleteWishlistProductMutation()

  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [recentProducts] = useState<RecentProduct[]>(() =>
    loadRecentProducts(product?._id),
  )

  useEffect(() => {
    if (!product) return
    saveRecentProduct(product)
  }, [product])

  const wishlistEntryId = useMemo(() => {
    if (!product?._id || !wishlistItems?.data) {
      return null
    }

    const item = wishlistItems.data.find(
      (entry) => getWishlistProductId(entry) === product._id,
    )

    return item?._id ?? null
  }, [product, wishlistItems])

  const isWishlisted = Boolean(wishlistEntryId)

  const catalogProducts = useMemo(
    () => categoryProductsResult?.data ?? topRatedProductsResult?.data ?? [],
    [categoryProductsResult?.data, topRatedProductsResult?.data],
  )
  const categoryProductsLink = productCategoryId
    ? `/products?category=${encodeURIComponent(productCategoryId)}`
    : '/products'

  const similarProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return catalogProducts
      .filter((item) => item._id !== product._id)
      .slice(0, 5)
  }, [catalogProducts, product])

  const mayLikeProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return catalogProducts
      .filter((item) => item._id !== product._id)
      .slice(5, 10)
  }, [catalogProducts, product])

  const topRatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return (topRatedProductsResult?.data ?? [])
      .filter((item) => item._id !== product._id)
      .slice(0, 5)
  }, [product, topRatedProductsResult?.data])

  const latestProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return (latestProductsResult?.data ?? [])
      .filter((item) => item._id !== product._id)
      .slice(0, 5)
  }, [latestProductsResult?.data, product])

  const cartQuantity = useMemo(() => {
    if (!product?._id) {
      return 0
    }

    return cartItems.find((item) => item.id === product._id)?.quantity ?? 0
  }, [cartItems, product])

  const safeQuantity = useMemo(() => {
    if (!product) {
      return 1
    }

    const availableStock = Math.max(0, product.stock - cartQuantity)

    if (availableStock === 0) {
      return 0
    }

    return Math.min(Math.max(1, quantity), availableStock)
  }, [cartQuantity, product, quantity])

  function updateQuantity(delta: number) {
    if (!product) {
      return
    }

    const availableStock = Math.max(0, product.stock - cartQuantity)

    if (availableStock === 0) {
      setQuantity(0)
      return
    }

    setQuantity((current) =>
      Math.min(Math.max(1, current + delta), availableStock),
    )
  }

  function handleAddToCart() {
    if (!product) {
      return
    }

    const availableStock = Math.max(0, product.stock - cartQuantity)

    if (availableStock <= 0) {
      toast.error('No more items available in stock.')
      return
    }

    const qtyToAdd = safeQuantity > 0 ? safeQuantity : 1
    const priceInfo = getProductPriceInfo(product.price, activePromo)
    dispatch(
      addToCart(
        createCartItem(
          {
            ...product,
            price: priceInfo.finalPrice,
          },
          qtyToAdd,
        ),
      ),
    )
  }

  function handleBuyNow() {
    if (!product) {
      return
    }

    handleAddToCart()
    navigate('/checkout')
  }

  async function handleToggleWishlist() {
    if (!product?._id) {
      return
    }

    if (!accessToken) {
      navigate('/login', {
        state: {
          from: `/products/${product.slug || product._id}`,
          message: 'Sign in to save items to your wishlist.',
        },
      })
      return
    }

    if (isAdmin) {
      toast.info('Wishlist is available for customer accounts.')
      return
    }

    try {
      if (isWishlisted && wishlistEntryId) {
        await deleteWishlistProduct(wishlistEntryId).unwrap()
        toast.success(`${product.name} removed from wishlist.`)
      } else {
        await addWishlistProduct(product._id).unwrap()
        toast.success(`${product.name} saved to wishlist.`)
      }
    } catch {
      toast.error('Unable to update wishlist right now.')
    }
  }

  const galleryImages = useMemo(() => {
    const mainImage = getAssetUrl(product?.images?.[0])

    if (!product?.images?.length) {
      return mainImage ? [mainImage] : []
    }

    return product.images
      .map((img) => getAssetUrl(img))
      .filter((img): img is string => Boolean(img))
  }, [product])

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-[#181512]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
            to="/products"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <p className="text-xs font-semibold uppercase tracking-wider text-[#6b5f53]">
            {product ? getProductCategoryName(product) : 'Handmade ceramics'}
          </p>
        </div>

        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : isError || !product ? (
          <ErrorState
            title="Product unavailable"
            message="The product you are looking for does not exist or has been removed from the catalog."
            onRetry={() => navigate('/products')}
          />
        ) : (
          <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <ProductGallery
              images={galleryImages}
              mainImage={galleryImages[activeImageIndex]}
              onSelectImage={(img: string) => {
                const idx = galleryImages.indexOf(img)
                if (idx !== -1) {
                  setActiveImageIndex(idx)
                }
              }}
              productId={product._id}
              productName={product.name}
            />

            <div>
              <ProductPurchasePanel
                isOutOfStock={product.stock <= 0}
                isWishlisted={isWishlisted}
                isWishlistLoading={isAddingWishlist || isDeletingWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleToggleWishlist}
                onUpdateQuantity={updateQuantity}
                product={product}
                quantity={safeQuantity}
              />
            </div>

            <section className="mt-6 border border-black/10 bg-white lg:col-span-2">
              <div className="border-b border-black/10 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Ratings & Reviews
                </p>

                <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-center lg:gap-8">
                  {/* Left Score Summary */}
                  <div className="flex flex-col items-start border-b border-black/10 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 lg:pr-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight text-[#181512]">
                        {product.averageRating?.toFixed(1) ?? '0.0'}
                      </span>
                      <span className="text-xl font-bold text-[#6b5f53]">
                        / 5
                      </span>
                    </div>
                    <div className="mt-1 flex gap-0.5 text-lg">
                      {renderStars(
                        Math.round(product.averageRating ?? 0),
                        'text-lg',
                        'text-[#d97706]',
                      )}
                    </div>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
                      Ratings & Reviews (
                      {product.reviewCount ?? productReviews.length ?? 0})
                    </p>
                  </div>

                  {/* Right Rating Breakdown Bars */}
                  <div className="grid w-full max-w-md gap-1.5 md:justify-self-end">
                    {[5, 4, 3, 2, 1].map((starLevel) => {
                      const count =
                        ratingCounts[starLevel as keyof typeof ratingCounts] ||
                        0
                      const total = productReviews.length || 1
                      const percent = Math.min(
                        100,
                        Math.round((count / total) * 100),
                      )

                      return (
                        <div
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-xs"
                          key={starLevel}
                        >
                          <div className="flex gap-0.5">
                            {renderStars(
                              starLevel,
                              'text-xs',
                              'text-[#d97706]',
                            )}
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3ece2]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#7a3f1d] to-[#d97706] transition-all duration-500"
                              style={{
                                width: `${count > 0 ? Math.max(5, percent) : 0}%`,
                              }}
                            />
                          </div>
                          <span className="w-5 text-right font-mono text-xs font-bold text-[#6b5f53]">
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Review list */}
              {isReviewLoading ? (
                <div className="grid gap-3 p-4 sm:p-5">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      className="h-24 animate-pulse border border-black/10 bg-[#f8f3ea]"
                      key={index}
                    />
                  ))}
                </div>
              ) : productReviews.length ? (
                <div className="grid gap-3 p-4 sm:p-5">
                  {productReviews.map((review) => {
                    const reviewer =
                      review.user && typeof review.user !== 'string'
                        ? review.user.name || review.user.email || 'Customer'
                        : 'Customer'

                    return (
                      <article
                        className="border border-black/10 bg-[#faf7f2]/50 p-3.5 transition hover:border-[#181512] sm:p-4"
                        key={review._id}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-[#181512]">
                                {reviewer}
                              </p>
                              <span className="inline-flex items-center gap-1 border border-[#1f7a4d]/20 bg-[#effaf3] px-1.5 py-0.5 text-[10px] font-bold text-[#1f6b43]">
                                <BadgeCheck className="h-3 w-3 text-[#1f6b43]" />
                                Verified Buyer
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#6b5f53]">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    },
                                  )
                                : 'Recently'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold text-[#181512]">
                              {Number(review.rating).toFixed(1)} / 5
                            </span>
                            <div className="flex gap-0.5">
                              {renderStars(
                                review.rating,
                                'text-sm',
                                'text-[#d97706]',
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#4f463d] sm:text-sm sm:leading-6">
                          {review.comment || 'No comment.'}
                        </p>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="p-4 sm:p-5">
                  <p className="text-sm font-bold text-[#181512]">
                    No public reviews yet
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b5f53]">
                    First customer review will show here.
                  </p>
                </div>
              )}
            </section>
          </section>
        )}

        <ProductShelfSection
          actionLabel="See more"
          actionTo={categoryProductsLink}
          eyebrow="Similar products"
          heading={`More in ${getProductCategoryName(product)}`}
          products={similarProducts}
        />
        <RecentlyViewedSection
          actionLabel="Explore more"
          actionTo="/products"
          products={recentProducts}
        />
        <ProductShelfSection
          actionLabel="View more"
          actionTo="/products"
          eyebrow="You may like"
          heading="Fresh shelf picks"
          products={mayLikeProducts}
        />
        <ProductShelfSection
          actionLabel="View top rated"
          actionTo="/products?sort=rating-desc"
          eyebrow="Top rated"
          heading="Best-rated craft picks"
          products={topRatedProducts}
        />
        <ProductShelfSection
          actionLabel="View latest"
          actionTo="/products?sort=newest"
          eyebrow="Latest arrivals"
          heading="New on the shelf"
          products={latestProducts}
        />
      </main>

      <div className="bg-[#faf7f2] py-8">
        <WhyChooseUs />
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetails
