import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ErrorState, PageSpinner } from '../components/loaders'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { getAccessToken, getStoredUser } from '../features/auth/authApi'
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

function ProductDetails() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const accessToken = getAccessToken()
  const isAdmin = getStoredUser()?.role === 'admin'
  const cartItems = useAppSelector((state) => state.cart.items)
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError } = useGetProductByIdQuery(
    id ?? '',
  )

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
      limit: 8,
    },
    {
      skip: !productCategoryId,
    },
  )
  const { data: fallbackProductsResult } = useGetProductsQuery(
    {
      limit: 8,
      sortBy: 'rating',
      sortOrder: 'desc',
    },
    {
      skip: Boolean(productCategoryId),
    },
  )
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
    () => categoryProductsResult?.data ?? fallbackProductsResult?.data ?? [],
    [categoryProductsResult?.data, fallbackProductsResult?.data],
  )

  const similarProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return catalogProducts
      .filter((item) => item._id !== product._id)
      .slice(0, 4)
  }, [catalogProducts, product])

  const mayLikeProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return catalogProducts
      .filter((item) => item._id !== product._id)
      .slice(4, 8)
  }, [catalogProducts, product])

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
    toast.success(`${product.name} added to cart.`)
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
            to="/shop"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <p className="text-xs font-semibold uppercase tracking-wider text-[#6b5f53]">
            {product ? getProductCategoryName(product) : 'Handmade ceramics'}
          </p>
        </div>

        {isLoading ? (
          <PageSpinner message="Loading product details..." className="min-h-[400px]" />
        ) : isError || !product ? (
          <ErrorState
            title="Product unavailable"
            message="The product you are looking for does not exist or has been removed from the catalog."
            onRetry={() => navigate('/shop')}
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
                  <div className="grid w-full max-w-md gap-1.5">
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
                  <p className="text-sm font-bold text-[#181512]">No public reviews yet</p>
                  <p className="mt-0.5 text-xs text-[#6b5f53]">
                    First customer review will show here.
                  </p>
                </div>
              )}
            </section>
          </section>
        )}

        <ProductShelfSection
          eyebrow="Similar products"
          heading={`More in ${getProductCategoryName(product)}`}
          products={similarProducts}
        />
        <RecentlyViewedSection products={recentProducts} />
        <ProductShelfSection
          eyebrow="You may like"
          heading="Fresh shelf picks"
          products={mayLikeProducts}
        />
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails
