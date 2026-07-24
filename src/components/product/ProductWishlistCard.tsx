import { ImageOff, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '../../features/products/productApi'
import type { WishlistItem } from '../../features/wishlists/wishlistApi'
import { getWishlistProduct } from '../../features/wishlists/wishlistApi'
import {
  formatPrice,
  getProductCategoryName,
  getProductImage,
  getProductUrl,
} from '../../utils/productDisplay'
import ProductBadge from './ProductBadge'

type ProductWishlistCardProps = {
  isClearing?: boolean
  isSelected?: boolean
  onAddToCart: (product?: Product) => void
  onRemove: (id: string, productName?: string) => void
  onToggleSelect?: (id: string) => void
  removingId?: string
  wishlistItem: WishlistItem
}

function ProductWishlistCard({
  isClearing = false,
  isSelected = false,
  onAddToCart,
  onRemove,
  onToggleSelect,
  removingId = '',
  wishlistItem,
}: ProductWishlistCardProps) {
  const product = getWishlistProduct(wishlistItem)
  const imageUrl = getProductImage(product)
  const isRemoving = removingId === wishlistItem._id

  return (
    <article className="group relative flex flex-col border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(24,21,18,0.12)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f3ea]">
        {imageUrl ? (
          <img
            alt={product?.name ?? 'Wishlist item'}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#7a3f1d]">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {onToggleSelect && (
          <label className="absolute left-2 top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-[2px] bg-white/90 shadow transition hover:bg-white sm:left-3 sm:top-3">
            <input
              checked={isSelected}
              className="h-4 w-4 accent-[#8f3f1d]"
              onChange={() => onToggleSelect(wishlistItem._id)}
              type="checkbox"
            />
          </label>
        )}

        <button
          aria-label="Remove item from wishlist"
          className="btn-danger absolute right-2 top-2 grid h-8 w-8 !p-0 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          disabled={isRemoving || isClearing}
          onClick={() => onRemove(wishlistItem._id, product?.name)}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#7a3f1d] sm:text-xs">
          {getProductCategoryName(product)}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-snug sm:text-base">
          {product ? (
            <Link
              className="transition hover:text-[#8f3f1d]"
              to={getProductUrl(product)}
            >
              {product.name}
            </Link>
          ) : (
            'Unavailable item'
          )}
        </h3>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="text-base font-bold sm:text-lg">
            {formatPrice(product?.price)}
          </span>
          {product && product.stock > 0 ? (
            <ProductBadge variant="success">In stock</ProductBadge>
          ) : (
            <ProductBadge variant="danger">Out of stock</ProductBadge>
          )}
        </div>

        <div className="mt-4 pt-2">
          <button
            className="btn-primary w-full"
            disabled={!product || product.stock <= 0}
            onClick={() => onAddToCart(product)}
            type="button"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductWishlistCard
