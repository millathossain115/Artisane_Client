import { useMemo, useState } from 'react'

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
import { userNavItems } from './userNavItems'
import WishlistMessageBanner from './components/WishlistMessageBanner'
import WishlistSection from './components/WishlistSection'
import {
  getApiErrorMessage,
  type WishlistMessage,
} from './wishlistUtils'

function WishlistPage() {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [removingId, setRemovingId] = useState('')
  const [selectedWishlistIds, setSelectedWishlistIds] = useState<string[]>([])
  const [message, setMessage] = useState<WishlistMessage | null>(null)
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
      setSelectedWishlistIds([])
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
        <WishlistMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <WishlistSection
        areAllWishlistItemsSelected={areAllWishlistItemsSelected}
        isClearing={isClearing}
        isError={isError}
        isLoading={isLoading}
        meta={meta}
        onAddProductToCart={handleAddProductToCart}
        onAddSelectedToCart={handleAddSelectedToCart}
        onClearWishlist={handleClearWishlist}
        onRemoveWishlistItem={handleRemoveWishlistItem}
        onToggleAllWishlistItems={handleToggleAllWishlistItems}
        onToggleWishlistSelection={handleToggleWishlistSelection}
        page={page}
        removingId={removingId}
        selectableWishlistIds={selectableWishlistIds}
        selectedWishlistCount={selectedWishlistCount}
        selectedWishlistIds={selectedWishlistIds}
        setPage={setPage}
        wishlistItems={wishlistItems}
      />
    </DashboardLayout>
  )
}

export default WishlistPage
