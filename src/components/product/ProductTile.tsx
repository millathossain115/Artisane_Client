import type { KeyboardEvent, MouseEvent } from 'react'
import { Heart, ImageOff, ShoppingBag, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { addToCart, createCartItem } from '../../features/cart/cartSlice'
import { getAccessToken, getStoredUser } from '../../features/auth/authApi'
import type { Product } from '../../features/products/productApi'
import {
  getWishlistProductId,
  useAddWishlistProductMutation,
  useDeleteWishlistProductMutation,
  useGetMyWishlistQuery,
} from '../../features/wishlists/wishlistApi'
import { useGetActivePromoQuery } from '../../features/promo/promoApi'
import { useAppDispatch } from '../../redux/hooks'
import { getProductPriceInfo } from '../../utils/priceUtils'
import {
  formatPrice,
  getCategoryName,
  getProductBadge,
  getProductImage,
} from '../../utils/productDisplay'

type ProductTileProps = {
  product: Product
  tone?: 'dark' | 'light'
  variant?: 'compact' | 'default'
}

function ProductTile({
  product,
  tone = 'light',
  variant = 'default',
}: ProductTileProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const imageUrl = getProductImage(product)
  const accessToken = getAccessToken()
  const isAdmin = getStoredUser()?.role === 'admin'
  const isDark = tone === 'dark'
  const productUrl = `/products/${product._id}`
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
  const isWishlisted = (wishlistList?.data ?? []).some(
    (item) => getWishlistProductId(item) === product._id,
  )
  const isWishlistLoading =
    isWishlistFetching || isAddingWishlist || isDeletingWishlist
  const ratingLabel =
    product.reviewCount && product.averageRating
      ? product.averageRating.toFixed(1)
      : 'New'

  const { data: activePromo } = useGetActivePromoQuery()
  const priceInfo = getProductPriceInfo(product.price, activePromo)

  function handleOpenProduct() {
    navigate(productUrl)
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    handleOpenProduct()
  }

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (isAdmin) {
      return
    }

    dispatch(
      addToCart(
        createCartItem({
          ...product,
          price: priceInfo.finalPrice,
        }),
      ),
    )
  }

  async function handleWishlistClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()

    if (isAdmin || isWishlistLoading) {
      return
    }

    if (!accessToken) {
      navigate('/login')
      return
    }

    try {
      if (isWishlisted) {
        await deleteWishlistProduct(product._id).unwrap()
        return
      }

      await addWishlistProduct(product._id).unwrap()
    } catch {
      // The product detail page gives fuller feedback; cards stay quiet.
    }
  }

  return (
    <article
      className={`group cursor-pointer overflow-hidden border transition duration-300 hover:-translate-y-1 ${
        isDark
          ? 'border-white/10 bg-white text-[#181512] hover:shadow-[0_22px_40px_rgba(0,0,0,0.28)]'
          : 'border-black/10 bg-white hover:shadow-[0_22px_40px_rgba(24,21,18,0.12)]'
      }`}
      onClick={handleOpenProduct}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
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

        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1 sm:left-3 sm:top-3">
          {priceInfo.hasDiscount && (
            <span className="bg-[#8f3f1d] px-1.5 py-0.5 text-[10px] font-bold text-white shadow sm:px-2.5 sm:py-1 sm:text-xs">
              -{priceInfo.discountPercent}% OFF
            </span>
          )}
          <span className="bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#7a3f1d] sm:px-3 sm:py-1 sm:text-xs">
            {getProductBadge(product)}
          </span>
        </div>
        {!isAdmin ? (
          <button
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white disabled:cursor-not-allowed disabled:opacity-70 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
            disabled={isWishlistLoading}
            onClick={handleWishlistClick}
            type="button"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                isWishlisted ? 'fill-[#8f3f1d] text-[#8f3f1d]' : ''
              }`}
            />
          </button>
        ) : null}
      </div>

      <div className={variant === 'compact' ? 'p-2 sm:p-3' : 'p-2 sm:p-4'}>
        <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-[#7a3f1d] sm:gap-3 sm:text-xs">
          <span className="truncate">{getCategoryName(product.category)}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[#4f463d]">
            <Star className="h-3.5 w-3.5 fill-[#c85f2f] text-[#c85f2f]" />
            <span className="hidden sm:inline">{ratingLabel}</span>
          </span>
        </div>

        <h3
          className={`mt-2 line-clamp-2 font-bold leading-snug sm:mt-3 ${
            variant === 'compact'
              ? 'min-h-8 text-xs sm:min-h-10 sm:text-base'
              : 'min-h-8 text-xs sm:min-h-12 sm:text-lg'
          }`}
        >
          {product.name}
        </h3>
        <p className="mt-1 truncate text-[11px] text-[#6b5f53] sm:text-sm">
          {product.brand ?? 'Artisane Studio'}
        </p>

        <div className="mt-2 flex items-end justify-between gap-2 sm:mt-4 sm:gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold sm:text-xl">
                {formatPrice(priceInfo.finalPrice)}
              </span>
              {priceInfo.hasDiscount && (
                <span className="text-xs font-semibold text-[#8a7d71] line-through">
                  {formatPrice(priceInfo.originalPrice)}
                </span>
              )}
            </div>
            <p className="mt-1 hidden text-xs font-semibold text-[#8a7d71] sm:block">
              {product.stock} in stock
            </p>
          </div>
        </div>

        {!isAdmin ? (
          <div className="mt-2 sm:mt-4">
            <button
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex min-h-9 w-full items-center justify-center gap-1 bg-[#181512] px-2 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11 sm:gap-2 sm:px-3 sm:text-sm"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              type="button"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sm:hidden">
                {product.stock <= 0 ? 'Out' : 'Add'}
              </span>
              <span className="hidden sm:inline">
                {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProductTile
