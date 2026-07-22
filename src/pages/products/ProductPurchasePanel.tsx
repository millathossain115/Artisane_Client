import {
  BadgeCheck,
  CreditCard,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react'

import type { Product } from '../../features/products/productApi'
import { formatPrice, getProductCategoryName } from '../../utils/productDisplay'

type ProductPurchasePanelProps = {
  canBuy?: boolean
  isWishlisted?: boolean
  isWishlistLoading?: boolean
  isOutOfStock: boolean
  onAddToCart: () => void
  onBuyNow: () => void
  onDismissStatus?: () => void
  onToggleWishlist?: () => void
  onUpdateQuantity: (quantity: number) => void
  product: Product
  quantity: number
  statusMessage: string
}

import { useGetActivePromoQuery } from '../../features/promo/promoApi'
import { getProductPriceInfo } from '../../utils/priceUtils'

function ProductPurchasePanel({
  canBuy = true,
  isWishlisted = false,
  isWishlistLoading = false,
  isOutOfStock,
  onAddToCart,
  onBuyNow,
  onDismissStatus,
  onToggleWishlist,
  onUpdateQuantity,
  product,
  quantity,
  statusMessage,
}: ProductPurchasePanelProps) {
  const { data: activePromo } = useGetActivePromoQuery()
  const priceInfo = getProductPriceInfo(product.price, activePromo)

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-black/10 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            {getProductCategoryName(product)}
          </p>
          {canBuy ? (
            <button
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={isWishlisted}
              className="grid h-10 w-10 shrink-0 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isWishlistLoading}
              onClick={onToggleWishlist}
              type="button"
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? 'fill-[#8f3f1d] text-[#8f3f1d]' : ''
                }`}
              />
            </button>
          ) : null}
        </div>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
          {product.brand ?? 'Artisane Studio'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {formatPrice(priceInfo.finalPrice)}
            </span>
            {priceInfo.hasDiscount && (
              <span className="text-lg font-semibold text-[#8a7d71] line-through">
                {formatPrice(priceInfo.originalPrice)}
              </span>
            )}
          </div>
          {priceInfo.hasDiscount && (
            <span className="bg-[#8f3f1d] px-2.5 py-1 text-xs font-bold text-white shadow">
              -{priceInfo.discountPercent}% OFF
            </span>
          )}
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

        {canBuy ? (
          <div className="mt-6">
            <p className="text-sm font-bold">Quantity</p>
            <div className="mt-2 inline-grid grid-cols-[44px_64px_44px] overflow-hidden border border-black/10 bg-white">
              <button
                aria-label="Decrease quantity"
                className="grid h-11 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => onUpdateQuantity(quantity - 1)}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="grid h-11 place-items-center border-x border-black/10 text-sm font-bold">
                {isOutOfStock ? 0 : quantity}
              </span>
              <button
                aria-label="Increase quantity"
                className="grid h-11 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={quantity >= product.stock || isOutOfStock}
                onClick={() => onUpdateQuantity(quantity + 1)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-4 flex items-start justify-between gap-3 bg-[#effaf3] px-4 py-3 text-sm font-bold text-[#1f6b43]">
            <p>{statusMessage}</p>
            <button
              aria-label="Close product message"
              className="grid h-6 w-6 shrink-0 place-items-center border border-[#1f6b43]/20 transition hover:border-[#1f6b43]"
              onClick={onDismissStatus}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}

        {canBuy ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isOutOfStock}
              onClick={onAddToCart}
              type="button"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 bg-[#f8f3ea] px-5 text-sm font-bold text-[#181512] transition hover:border-[#181512] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isOutOfStock}
              onClick={onBuyNow}
              type="button"
            >
              <CreditCard className="h-4 w-4" />
              Buy now
            </button>
          </div>
        ) : (
          <p className="mt-6 bg-[#f8f3ea] px-4 py-3 text-sm font-bold text-[#6b5f53]">
            Admin account can manage products from dashboard. Cart and checkout
            are available for customer accounts only.
          </p>
        )}
      </div>
    </aside>
  )
}

export default ProductPurchasePanel
