import { ArrowLeft } from 'lucide-react'
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
  getProductCategoryUrl,
} from '../utils/productDisplay'
import WhyChooseUs from './home/WhyChooseUs'
import ProductGallery from './products/ProductGallery'
import ProductPurchasePanel from './products/ProductPurchasePanel'
import ProductDetailsShelves from './products/ProductDetailsShelves'
import ProductDetailsSkeleton from './products/ProductDetailsSkeleton'
import ProductReviewsSection from './products/ProductReviewsSection'
import {
  loadRecentProducts,
  type RecentProduct,
  saveRecentProduct,
} from './products/recentProducts'

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
  const categoryProductsLink = getProductCategoryUrl(product)

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

            <ProductReviewsSection
              isReviewLoading={isReviewLoading}
              product={product}
              productReviews={productReviews}
              ratingCounts={ratingCounts}
            />
          </section>
        )}

        <ProductDetailsShelves
          categoryProductsLink={categoryProductsLink}
          latestProducts={latestProducts}
          mayLikeProducts={mayLikeProducts}
          product={product}
          recentProducts={recentProducts}
          similarProducts={similarProducts}
          topRatedProducts={topRatedProducts}
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
