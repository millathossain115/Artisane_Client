import {
  BadgeCheck,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'

import type { Product } from '../../features/products/productApi'
import {
  formatPrice,
  getProductCategoryName,
} from '../../utils/productDisplay'

type ProductPurchasePanelProps = {
  isOutOfStock: boolean
  onAddToCart: () => void
  onUpdateQuantity: (quantity: number) => void
  product: Product
  quantity: number
  statusMessage: string
}

function ProductPurchasePanel({
  isOutOfStock,
  onAddToCart,
  onUpdateQuantity,
  product,
  quantity,
  statusMessage,
}: ProductPurchasePanelProps) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-black/10 bg-white p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
          {getProductCategoryName(product)}
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

        {statusMessage ? (
          <p className="mt-4 bg-[#effaf3] px-4 py-3 text-sm font-bold text-[#1f6b43]">
            {statusMessage}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
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
  )
}

export default ProductPurchasePanel
