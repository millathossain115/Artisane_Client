import { type Dispatch, type SetStateAction } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '../../../../features/products/productApi'
import type { WishlistItem } from '../../../../features/wishlists/wishlistApi'
import {
  formatPrice,
  getProductCategoryName,
  getProductImage,
  getProductUrl,
} from '../../../../utils/productDisplay'
import { getWishlistProduct } from '../../../../features/wishlists/wishlistApi'
import { formatWishlistDate, getVisibleWishlistIds } from '../wishlistUtils'

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
  onAddProductToCart: (product?: Product) => void
  onAddSelectedToCart: () => void
  onClearWishlist: () => void
  onRemoveWishlistItem: (id: string, productName?: string) => void
  onToggleAllWishlistItems: () => void
  onToggleWishlistSelection: (id: string) => void
  page: number
  removingId: string
  selectableWishlistIds: string[]
  selectedWishlistCount: number
  selectedWishlistIds: string[]
  setPage: Dispatch<SetStateAction<number>>
  wishlistItems: WishlistItem[]
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
  page,
  removingId,
  selectableWishlistIds,
  selectedWishlistCount,
  selectedWishlistIds,
  setPage,
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="w-12 px-5 py-3">
                <input
                  aria-label="Select all cart-ready wishlist products"
                  checked={areAllWishlistItemsSelected}
                  className="h-4 w-4 accent-[#181512]"
                  disabled={!selectableWishlistIds.length}
                  onChange={onToggleAllWishlistItems}
                  type="checkbox"
                />
              </th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Saved</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr className="border-t border-black/10" key={index}>
                  <td className="px-5 py-5" colSpan={7}>
                    <div className="h-5 animate-pulse bg-[#f8f3ea]" />
                  </td>
                </tr>
              ))
            ) : wishlistItems.length ? (
              wishlistItems.map((item) => {
                const product = getWishlistProduct(item)
                const imageUrl = getProductImage(product)
                const canAddToCart = Boolean(product && product.stock > 0)
                const rowSelected = selectedWishlistIds.includes(item._id)
                const isVisible = visibleWishlistIds.has(item._id)

                return (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={item._id}
                  >
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4">
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
                        <div className="min-w-0">
                          {product ? (
                            <Link
                              className="line-clamp-1 font-bold transition hover:text-[#7a3f1d]"
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
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {getProductCategoryName(product)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
                        {product?.stock ?? 0} in stock
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {formatPrice(product?.price ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-[#6b5f53]">
                      {formatWishlistDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          aria-label={`Add ${product?.name ?? 'product'} to cart`}
                          className="inline-flex min-h-9 items-center justify-center gap-2 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={!canAddToCart}
                          onClick={() => onAddProductToCart(product)}
                          type="button"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Cart
                        </button>
                        {product ? (
                          <Link
                            className="inline-flex min-h-9 items-center justify-center border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-white"
                            to={`/products/${product._id}`}
                          >
                            View
                          </Link>
                        ) : null}
                        <button
                          aria-label={`Remove ${product?.name ?? 'product'} from wishlist`}
                          className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={removingId === item._id}
                          onClick={() =>
                            onRemoveWishlistItem(item._id, product?.name)
                          }
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
