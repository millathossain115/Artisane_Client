import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { addToCart, createCartItem } from '../features/cart/cartSlice'
import { getAccessToken, getStoredUser } from '../features/auth/authApi'
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from '../features/products/productApi'
import {
  getWishlistProductId,
  useAddWishlistProductMutation,
  useDeleteWishlistProductMutation,
  useGetMyWishlistQuery,
} from '../features/wishlists/wishlistApi'
import { useGetProductReviewsQuery } from '../features/reviews/reviewApi'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
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
  saveRecentProduct,
} from './products/recentProducts'

function renderStars(value: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      className={`text-lg ${
        index < value ? 'text-[#7a3f1d]' : 'text-[#d2c5b5]'
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
  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(id ?? '', {
    skip: !id,
  })
  const categoryId = getProductCategoryId(product)
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
  const { data: productReviewList, isLoading: isReviewLoading } =
    useGetProductReviewsQuery(
      {
        limit: 6,
        page: 1,
        productId: product?._id ?? '',
      },
      { skip: !product?._id },
    )
  const { data: wishlistList, isFetching: isWishlistFetching } =
    useGetMyWishlistQuery(
      {
        limit: 100,
        page: 1,
      },
      { skip: !accessToken || isAdmin },
    )
  const [addWishlistProduct, { isLoading: isAddingWishlist }] =
    useAddWishlistProductMutation()
  const [deleteWishlistProduct, { isLoading: isDeletingWishlist }] =
    useDeleteWishlistProductMutation()
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
        getProductCategoryId(item) !== categoryId &&
        !similarProductIds.has(item._id),
    ) ?? []
  const isOutOfStock = !product || product.stock <= 0
  const quantity =
    quantitySelection.productId === product?._id ? quantitySelection.value : 1
  const safeQuantity = product ? Math.min(quantity, product.stock) : quantity
  const recentProducts = loadRecentProducts(product?._id ?? id)
  const visibleStatus = status.productId === product?._id ? status.message : ''
  const isWishlisted = product
    ? (wishlistList?.data ?? []).some(
        (item) => getWishlistProductId(item) === product._id,
      )
    : false
  const isWishlistLoading =
    isWishlistFetching || isAddingWishlist || isDeletingWishlist
  const productReviews = productReviewList?.data ?? []

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

  function selectImage(image: string) {
    if (!product) {
      return
    }

    setSelectedImage({
      productId: product._id,
      value: image,
    })
  }

  function handleAddToCart() {
    if (!product || isOutOfStock || isAdmin) {
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

  async function handleToggleWishlist() {
    if (!product || isAdmin) {
      return
    }

    if (!accessToken) {
      navigate('/login')
      return
    }

    try {
      if (isWishlisted) {
        await deleteWishlistProduct(product._id).unwrap()
        setStatus({
          message: `${product.name} removed from wishlist.`,
          productId: product._id,
        })
        return
      }

      await addWishlistProduct(product._id).unwrap()
      setStatus({
        message: `${product.name} added to wishlist.`,
        productId: product._id,
      })
    } catch {
      setStatus({
        message: 'Wishlist update failed. Please try again.',
        productId: product._id,
      })
    }
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
            <>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                <ProductGallery
                  images={productImages}
                  mainImage={mainImage}
                  onSelectImage={selectImage}
                  productId={product._id}
                  productName={product.name}
                />

                <ProductPurchasePanel
                  canBuy={!isAdmin}
                  isWishlisted={isWishlisted}
                  isWishlistLoading={isWishlistLoading}
                  isOutOfStock={isOutOfStock}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onUpdateQuantity={updateQuantity}
                  product={product}
                  quantity={safeQuantity}
                  statusMessage={visibleStatus}
                />
              </div>

              <section className="mt-8 border border-black/10 bg-white">
              <div className="flex flex-col gap-4 border-b border-black/10 p-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                    Reviews
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {product.reviewCount ?? productReviews.length ?? 0} reviews
                  </h2>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    Public feedback for this product.
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex justify-end gap-1">
                    {renderStars(Math.round(product.averageRating ?? 0))}
                  </div>
                  <p className="mt-2 text-sm font-bold">
                    {product.averageRating?.toFixed(1) ?? '0.0'} / 5
                  </p>
                </div>
              </div>

              {isReviewLoading ? (
                <div className="grid gap-4 p-5 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      className="h-28 animate-pulse border border-black/10 bg-[#f8f3ea]"
                      key={index}
                    />
                  ))}
                </div>
              ) : productReviews.length ? (
                <div className="grid gap-4 p-5 md:grid-cols-2">
                  {productReviews.map((review) => {
                    const reviewer =
                      review.user && typeof review.user !== 'string'
                        ? review.user.name || review.user.email || 'Customer'
                        : 'Customer'

                    return (
                      <article
                        className="border border-black/10 p-4"
                        key={review._id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold">{reviewer}</p>
                            <p className="mt-1 text-xs text-[#6b5f53]">
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
                          <div className="flex gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#4f463d]">
                          {review.comment || 'No comment.'}
                        </p>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="p-5">
                  <p className="font-bold">No public reviews yet</p>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    First customer review will show here.
                  </p>
                </div>
              )}
              </section>
            </>
          ) : null}
        </section>

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
