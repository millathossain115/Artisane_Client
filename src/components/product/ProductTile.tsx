import type { KeyboardEvent, MouseEvent } from 'react'
import { Heart, ImageOff, ShoppingBag, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { addToCart, createCartItem } from '../../features/cart/cartSlice'
import type { Product } from '../../features/products/productApi'
import { useAppDispatch } from '../../redux/hooks'
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
  const isDark = tone === 'dark'
  const productUrl = `/products/${product._id}`

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
    dispatch(addToCart(createCartItem(product)))
  }

  function handleWishlistClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
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

        <div className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-bold text-[#7a3f1d]">
          {getProductBadge(product)}
        </div>
        <button
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
          onClick={handleWishlistClick}
          type="button"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className={variant === 'compact' ? 'p-3' : 'p-4'}>
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#7a3f1d]">
          <span className="truncate">{getCategoryName(product.category)}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[#4f463d]">
            <Star className="h-3.5 w-3.5 fill-[#c85f2f] text-[#c85f2f]" />
            New
          </span>
        </div>

        <h3
          className={`mt-3 line-clamp-2 font-bold leading-snug ${
            variant === 'compact' ? 'min-h-10 text-base' : 'min-h-12 text-lg'
          }`}
        >
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
        </div>

        <div className="mt-4">
          <button
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#181512] px-3 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
            type="button"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductTile
