import { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { addToCart, createCartItem } from '../../../features/cart/cartSlice'
import type { Product } from '../../../features/products/productApi'
import {
  getWishlistProduct,
  useClearMyWishlistMutation,
  useDeleteWishlistItemMutation,
  useGetMyWishlistQuery,
} from '../../../features/wishlists/wishlistApi'
import { useAppDispatch } from '../../../redux/hooks'
import {
  formatPrice,
  getProductCategoryName,
  getProductImage,
} from '../../../utils/productDisplay'
import { userNavItems } from './userNavItems'

function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    data?: {
      errorSources?: { message: string }[]
      message?: string
    }
    message?: string
  }

  return (
    apiError.data?.errorSources?.[0]?.message ??
    apiError.data?.message ??
    apiError.message ??
    fallback
  )
}

function formatWishlistDate(value?: string) {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function WishlistPage() {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [removingId, setRemovingId] = useState('')
  const [selectedWishlistIds, setSelectedWishlistIds] = useState<string[]>([])
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)
  const {
    data: wishlistList,
    isError,
    isLoading,
  } = useGetMyWishlistQuery({
    limit: 10,
    page,
  })
  const [deleteWishlistItem] = useDeleteWishlistItemMutation()
  const [clearMyWishlist, { isLoading: isClearing }] =
    useClearMyWishlistMutation()

  const wishlistItems = useMemo(() => wishlistList?.data ?? [], [wishlistList])
  const meta = wishlistList?.meta
  const visibleWishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item._id)),
    [wishlistItems],
  )
  const visibleSelectedWishlistIds = selectedWishlistIds.filter((id) =>
    visibleWishlistIds.has(id),
  )
  const selectableWishlistIds = wishlistItems
    .filter((item) => {
      const product = getWishlistProduct(item)

      return product && product.stock > 0
    })
    .map((item) => item._id)
  const selectedWishlistCount = visibleSelectedWishlistIds.length
  const areAllWishlistItemsSelected =
    selectableWishlistIds.length > 0 &&
    selectableWishlistIds.every((id) => visibleSelectedWishlistIds.includes(id))

  function getSelectedCartProducts() {
    return wishlistItems.reduce<Product[]>((products, item) => {
      const product = getWishlistProduct(item)

      if (
        product &&
        product.stock > 0 &&
        visibleSelectedWishlistIds.includes(item._id)
      ) {
        products.push(product)
      }

      return products
    }, [])
  }

  function handleToggleWishlistSelection(id: string) {
    setSelectedWishlistIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    )
  }

  function handleToggleAllWishlistItems() {
    setSelectedWishlistIds((currentIds) => {
      if (areAllWishlistItemsSelected) {
        return currentIds.filter((id) => !selectableWishlistIds.includes(id))
      }

      return Array.from(new Set([...currentIds, ...selectableWishlistIds]))
    })
  }

  function handleAddProductToCart(product?: Product) {
    if (!product) {
      return
    }

    dispatch(addToCart(createCartItem(product)))
  }

  function handleAddSelectedToCart() {
    const selectedProducts = getSelectedCartProducts()

    selectedProducts.forEach((product) => {
      dispatch(addToCart(createCartItem(product)))
    })

    if (selectedProducts.length) {
      setMessage({
        text: `${selectedProducts.length} selected ${
          selectedProducts.length === 1 ? 'product' : 'products'
        } sent to cart.`,
        type: 'success',
      })
      setSelectedWishlistIds([])
    }
  }

  async function handleRemoveWishlistItem(id: string, productName?: string) {
    setRemovingId(id)

    try {
      await deleteWishlistItem(id).unwrap()
      setMessage({
        text: `${productName ?? 'Product'} removed from wishlist.`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to remove wishlist item.'),
        type: 'error',
      })
    } finally {
      setRemovingId('')
    }
  }

  async function handleClearWishlist() {
    if (!wishlistItems.length) {
      return
    }

    const shouldClear = window.confirm(
      'Clear every product from your wishlist?',
    )

    if (!shouldClear) {
      return
    }

    try {
      await clearMyWishlist().unwrap()
      setPage(1)
      setMessage({
        text: 'Wishlist cleared.',
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to clear wishlist.'),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Continue shopping', to: '/', variant: 'primary' }]}
      helperText="Saved products stay here until you remove them or buy them."
      sidebarItems={userNavItems}
      subtitle="Review saved products, open product details, or remove items you no longer want to keep."
      title="Wishlist"
      workspaceLabel="Collector account"
    >
      {message ? (
        <div
          className={`mb-5 flex items-start justify-between gap-3 border px-4 py-3 text-sm font-bold ${
            message.type === 'error'
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          <span className="flex items-center gap-2">
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {message.text}
          </span>
          <button
            aria-label="Close wishlist message"
            className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
            onClick={() => setMessage(null)}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

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
              onClick={handleAddSelectedToCart}
              type="button"
            >
              <ShoppingBag className="h-4 w-4" />
              Add selected
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#c85f2f]/25 px-4 text-sm font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!wishlistItems.length || isClearing}
              onClick={handleClearWishlist}
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
                    onChange={handleToggleAllWishlistItems}
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
                          checked={selectedWishlistIds.includes(item._id)}
                          className="h-4 w-4 accent-[#181512] disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={!canAddToCart}
                          onChange={() =>
                            handleToggleWishlistSelection(item._id)
                          }
                          type="checkbox"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <Link
                            className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]"
                            to={product ? `/products/${product._id}` : '#'}
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
                                to={`/products/${product._id}`}
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
                            onClick={() => handleAddProductToCart(product)}
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
                              handleRemoveWishlistItem(item._id, product?.name)
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
    </DashboardLayout>
  )
}

export default WishlistPage
