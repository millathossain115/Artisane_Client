import { type Dispatch, type SetStateAction } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '../../../../features/products/productApi'
import type { WishlistItem } from '../../../../features/wishlists/wishlistApi'
import {
  formatPrice,
  getProductImage,
  getProductUrl,
} from '../../../../utils/productDisplay'
import { getWishlistProduct } from '../../../../features/wishlists/wishlistApi'
import { WishlistTableSkeleton } from '../UserDashboardSkeletons'
import { getVisibleWishlistIds } from '../wishlistUtils'

type WishlistSectionProps = {
  areAllWishlistItemsSelected: boolean
  isClearing: boolean
  isError: boolean
  isLoading: boolean
  meta?: {
    page: number
    total: number
    totalPage: number
  }
  onAddProductToCart: (product?: Product, quantity?: number) => void
  onAddSelectedToCart: () => void
  onClearWishlist: () => void
  onRemoveWishlistItem: (id: string, productName?: string) => void
  onToggleAllWishlistItems: () => void
  onToggleWishlistSelection: (id: string) => void
  onUpdateWishlistQuantity: (
    id: string,
    product: Product | undefined,
    quantity: number,
  ) => void
  page: number
  removingId: string
  selectableWishlistIds: string[]
  selectedWishlistCount: number
  selectedWishlistIds: string[]
  setPage: Dispatch<SetStateAction<number>>
  wishlistQuantities: Record<string, number>
  wishlistItems: WishlistItem[]
}

function WishlistCardSkeleton() {
  return (
    <div className="grid gap-3 p-4 md:hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <article
          className="animate-pulse border border-black/10 bg-white p-4"
          key={index}
        >
          <div className="flex gap-3">
            <div className="h-4 w-4 bg-[#e9dfd2]" />
            <div className="h-20 w-20 shrink-0 bg-[#f8f3ea]" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-full bg-[#e9dfd2]" />
              <div className="mt-2 h-3 w-2/3 bg-[#e9dfd2]" />
              <div className="mt-3 h-6 w-24 bg-[#effaf3]" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/10 pt-4">
            <div className="h-8 bg-[#e9dfd2]" />
            <div className="h-8 bg-[#e9dfd2]" />
          </div>
        </article>
      ))}
    </div>
  )
}

function WishlistSection({
  areAllWishlistItemsSelected,
  isClearing,
  isError,
  isLoading,
  meta,
  onAddProductToCart,
  onAddSelectedToCart,
  onClearWishlist,
  onRemoveWishlistItem,
  onToggleAllWishlistItems,
  onToggleWishlistSelection,
  onUpdateWishlistQuantity,
  page,
  removingId,
  selectableWishlistIds,
  selectedWishlistCount,
  selectedWishlistIds,
  setPage,
  wishlistQuantities,
  wishlistItems,
}: WishlistSectionProps) {
  const visibleWishlistIds = getVisibleWishlistIds(wishlistItems)

  return (
    <section className="border border-black/10 bg-white">
      <div className="flex flex-col gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <Heart className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Saved products</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {meta?.total ?? wishlistItems.length} products found
              {selectedWishlistCount
                ? `, ${selectedWishlistCount} selected.`
                : '.'}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedWishlistCount}
            onClick={onAddSelectedToCart}
            type="button"
          >
            <ShoppingBag className="h-4 w-4" />
            Add selected
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#c85f2f]/25 px-4 text-sm font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!wishlistItems.length || isClearing}
            onClick={onClearWishlist}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            Clear wishlist
          </button>
        </div>
      </div>

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load wishlist.
        </div>
      ) : null}

      {!isLoading && !wishlistItems.length ? (
        <div className="border-t border-black/10 px-5 py-10 text-center font-semibold text-[#6b5f53] md:hidden">
          No wishlist items yet.
        </div>
      ) : null}

      {isLoading ? (
        <WishlistCardSkeleton />
      ) : wishlistItems.length ? (
        <div className="grid gap-3 p-4 md:hidden">
          {wishlistItems.map((item) => {
            const product = getWishlistProduct(item)
            const imageUrl = getProductImage(product)
            const canAddToCart = Boolean(product && product.stock > 0)
            const quantity = canAddToCart
              ? Math.min(
                  Math.max(1, wishlistQuantities[item._id] ?? 1),
                  product?.stock ?? 1,
                )
              : 0
            const rowSelected = selectedWishlistIds.includes(item._id)
            const isVisible = visibleWishlistIds.has(item._id)

            return (
              <article
                className="border border-black/10 bg-white p-4 shadow-[0_14px_28px_rgba(24,21,18,0.05)]"
                key={item._id}
              >
                <div className="flex gap-3">
                  <input
                    aria-label={`Select ${
                      product?.name ?? 'wishlist product'
                    } for cart`}
                    checked={rowSelected && isVisible}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#181512] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canAddToCart || !isVisible}
                    onChange={() => onToggleWishlistSelection(item._id)}
                    type="checkbox"
                  />
                  <Link
                    className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]"
                    to={product ? getProductUrl(product) : '#'}
                  >
                    {imageUrl ? (
                      <img
                        alt={product?.name ?? 'Wishlist product'}
                        className="h-full w-full object-cover"
                        src={imageUrl}
                      />
                    ) : (
                      <ImageOff className="h-5 w-5" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    {product ? (
                      <Link
                        className="line-clamp-2 font-bold leading-5 transition hover:text-[#7a3f1d]"
                        title={product.name}
                        to={getProductUrl(product)}
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <p className="font-bold">Product unavailable</p>
                    )}
                    <p className="mt-1 truncate text-sm text-[#6b5f53]">
                      {product?.brand ?? 'Artisane Studio'}
                    </p>
                    <span className="mt-2 inline-flex bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                      {product?.stock ?? 0} in stock
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 items-center gap-3 border-t border-black/10 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#6b5f53]">
                      Price
                    </p>
                    <p className="mt-1 font-bold">
                      {formatPrice(product?.price ?? 0)}
                    </p>
                  </div>
                  <div className="justify-self-end">
                    <p className="mb-1 text-right text-xs font-bold uppercase text-[#6b5f53]">
                      Qty
                    </p>
                    <div className="inline-grid grid-cols-[32px_40px_32px] overflow-hidden border border-black/10 bg-white">
                      <button
                        aria-label={`Decrease ${product?.name ?? 'product'} quantity`}
                        className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={!canAddToCart || quantity <= 1}
                        onClick={() =>
                          onUpdateWishlistQuantity(
                            item._id,
                            product,
                            quantity - 1,
                          )
                        }
                        type="button"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="grid h-8 place-items-center border-x border-black/10 text-xs font-bold">
                        {quantity}
                      </span>
                      <button
                        aria-label={`Increase ${product?.name ?? 'product'} quantity`}
                        className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={
                          !canAddToCart || quantity >= (product?.stock ?? 0)
                        }
                        onClick={() =>
                          onUpdateWishlistQuantity(
                            item._id,
                            product,
                            quantity + 1,
                          )
                        }
                        type="button"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_40px] gap-2">
                  <button
                    aria-label={`Add ${product?.name ?? 'product'} to cart`}
                    className="btn-primary !min-h-10 !py-2 !px-3"
                    disabled={!canAddToCart}
                    onClick={() => onAddProductToCart(product, quantity)}
                    type="button"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Cart
                  </button>
                  <button
                    aria-label={`Remove ${product?.name ?? 'product'} from wishlist`}
                    className="btn-danger grid h-10 w-10 !p-0"
                    disabled={removingId === item._id}
                    onClick={() =>
                      onRemoveWishlistItem(item._id, product?.name)
                    }
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}

      <div className="hidden overflow-hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="w-12 px-3 py-3 lg:px-4">
                <input
                  aria-label="Select all cart-ready wishlist products"
                  checked={areAllWishlistItemsSelected}
                  className="h-4 w-4 accent-[#181512]"
                  disabled={!selectableWishlistIds.length}
                  onChange={onToggleAllWishlistItems}
                  type="checkbox"
                />
              </th>
              <th className="w-[32%] px-3 py-3 lg:w-[38%] lg:px-4">Product</th>
              <th className="w-24 px-3 py-3 lg:px-4">Stock</th>
              <th className="w-28 px-3 py-3 text-center lg:px-4">Qty</th>
              <th className="w-24 px-3 py-3 lg:px-4">Price</th>
              <th className="w-16 px-3 py-3 text-center lg:px-4 xl:w-20">
                Buy
              </th>
              <th className="w-16 px-3 py-3 text-right lg:px-4 xl:w-20">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <WishlistTableSkeleton />
            ) : wishlistItems.length ? (
              wishlistItems.map((item) => {
                const product = getWishlistProduct(item)
                const imageUrl = getProductImage(product)
                const canAddToCart = Boolean(product && product.stock > 0)
                const quantity = canAddToCart
                  ? Math.min(
                      Math.max(1, wishlistQuantities[item._id] ?? 1),
                      product?.stock ?? 1,
                    )
                  : 0
                const rowSelected = selectedWishlistIds.includes(item._id)
                const isVisible = visibleWishlistIds.has(item._id)

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={item._id}
                  >
                    <td className="px-3 py-4 lg:px-4">
                      <input
                        aria-label={`Select ${
                          product?.name ?? 'wishlist product'
                        } for cart`}
                        checked={rowSelected && isVisible}
                        className="h-4 w-4 accent-[#181512] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={!canAddToCart || !isVisible}
                        onChange={() => onToggleWishlistSelection(item._id)}
                        type="checkbox"
                      />
                    </td>
                    <td className="min-w-0 px-3 py-4 lg:px-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Link
                          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]"
                          to={product ? getProductUrl(product) : '#'}
                        >
                          {imageUrl ? (
                            <img
                              alt={product?.name ?? 'Wishlist product'}
                              className="h-full w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <ImageOff className="h-5 w-5" />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          {product ? (
                            <Link
                              className="block min-w-0 truncate font-bold transition hover:text-[#7a3f1d]"
                              title={product.name}
                              to={getProductUrl(product)}
                            >
                              {product.name}
                            </Link>
                          ) : (
                            <p className="font-bold">Product unavailable</p>
                          )}
                          <p className="mt-1 truncate text-[#6b5f53]">
                            {product?.brand ?? 'Artisane Studio'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 lg:px-4">
                      <span className="block truncate bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                        {product?.stock ?? 0} in stock
                      </span>
                    </td>
                    <td className="px-3 py-4 lg:px-4">
                      <div className="mx-auto inline-grid grid-cols-[32px_40px_32px] overflow-hidden border border-black/10 bg-white">
                        <button
                          aria-label={`Decrease ${product?.name ?? 'product'} quantity`}
                          className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={!canAddToCart || quantity <= 1}
                          onClick={() =>
                            onUpdateWishlistQuantity(
                              item._id,
                              product,
                              quantity - 1,
                            )
                          }
                          type="button"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="grid h-8 place-items-center border-x border-black/10 text-xs font-bold">
                          {quantity}
                        </span>
                        <button
                          aria-label={`Increase ${product?.name ?? 'product'} quantity`}
                          className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={
                            !canAddToCart || quantity >= (product?.stock ?? 0)
                          }
                          onClick={() =>
                            onUpdateWishlistQuantity(
                              item._id,
                              product,
                              quantity + 1,
                            )
                          }
                          type="button"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="truncate px-3 py-4 font-bold lg:px-4">
                      {formatPrice(product?.price ?? 0)}
                    </td>
                    <td className="px-3 py-4 text-center lg:px-4">
                      <button
                        aria-label={`Add ${product?.name ?? 'product'} to cart`}
                        className="btn-primary !py-1.5 !px-2 xl:!px-3"
                        disabled={!canAddToCart}
                        onClick={() => onAddProductToCart(product, quantity)}
                        type="button"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline">Cart</span>
                      </button>
                    </td>
                    <td className="px-3 py-4 lg:px-4">
                      <button
                        aria-label={`Remove ${product?.name ?? 'product'} from wishlist`}
                        className="btn-danger ml-auto grid h-8 w-8 !p-0"
                        disabled={removingId === item._id}
                        onClick={() =>
                          onRemoveWishlistItem(item._id, product?.name)
                        }
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-10 text-center font-semibold text-[#6b5f53]"
                  colSpan={7}
                >
                  No wishlist items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            aria-label="Previous wishlist page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next wishlist page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page >= (meta?.totalPage ?? 1)}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default WishlistSection
