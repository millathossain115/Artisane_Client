import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getStoredUser } from '../auth/authApi'
import type { Product } from '../products/productApi'

export type CartItem = {
  brand?: string
  categoryId?: string
  categoryName: string
  id: string
  image?: string
  name: string
  price: number
  quantity: number
  slug: string
  stock: number
}

export type CartState = {
  feedback: {
    id: number
    message: string
    type: 'success' | 'warning'
  } | null
  items: CartItem[]
}

const CART_STORAGE_KEY = 'artisane_cart'

function getCartStorageKey() {
  const user = getStoredUser()
  const userKey = user?._id || user?.email

  return userKey ? `${CART_STORAGE_KEY}:${userKey}` : `${CART_STORAGE_KEY}:guest`
}

function getProductCategory(product: Product) {
  if (typeof product.category === 'string') {
    return {
      categoryId: product.category,
      categoryName: 'Studio goods',
    }
  }

  return {
    categoryId: product.category._id,
    categoryName: product.category.name,
  }
}

function clampQuantity(quantity: number, stock: number) {
  const maxQuantity = Math.max(0, stock)

  if (maxQuantity === 0) {
    return 0
  }

  return Math.min(Math.max(1, quantity), maxQuantity)
}

import type { OrderItem } from '../orders/orderApi'

export function createCartItem(product: Product, quantity = 1): CartItem {
  const category = getProductCategory(product)

  return {
    brand: product.brand,
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    id: product._id,
    image: product.images?.[0],
    name: product.name,
    price: product.price,
    quantity: clampQuantity(quantity, product.stock),
    slug: product.slug,
    stock: product.stock,
  }
}

export function createCartItemFromOrderItem(item: OrderItem): CartItem {
  const productId =
    typeof item.product === 'object' && item.product
      ? item.product._id
      : typeof item.product === 'string'
        ? item.product
        : item._id || ''

  const stock =
    typeof item.product === 'object' && item.product
      ? item.product.stock
      : 99

  return {
    categoryId: typeof item.category === 'string' ? item.category : undefined,
    categoryName: 'Studio goods',
    id: productId,
    image: item.image,
    name: item.productName || 'Handmade item',
    price: item.price ?? 0,
    quantity: Math.max(1, item.quantity ?? 1),
    slug: item.productSlug || '',
    stock: stock > 0 ? stock : 99,
  }
}

function readCartState(storageKey: string): CartState {
  if (typeof window === 'undefined') {
    return { feedback: null, items: [] }
  }

  try {
    const storedCart = window.localStorage.getItem(storageKey)

    if (!storedCart) {
      return { feedback: null, items: [] }
    }

    const parsedCart = JSON.parse(storedCart) as CartState

    if (!Array.isArray(parsedCart.items)) {
      return { feedback: null, items: [] }
    }

    const itemsById = new Map<string, CartItem>()

    parsedCart.items
      .filter((item) => item.id && item.name && item.stock > 0)
      .forEach((item) => {
        if (itemsById.has(item.id)) {
          return
        }

        itemsById.set(item.id, {
          ...item,
          quantity: clampQuantity(item.quantity, item.stock),
        })
      })

    return {
      feedback: null,
      items: Array.from(itemsById.values()),
    }
  } catch {
    return { feedback: null, items: [] }
  }
}

export function loadCartState(): CartState {
  const storageKey = getCartStorageKey()
  const cartState = readCartState(storageKey)

  if (cartState.items.length || storageKey !== `${CART_STORAGE_KEY}:guest`) {
    return cartState
  }

  const legacyCartState = readCartState(CART_STORAGE_KEY)

  if (legacyCartState.items.length && typeof window !== 'undefined') {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ items: legacyCartState.items }),
    )
    window.localStorage.removeItem(CART_STORAGE_KEY)
  }

  return legacyCartState
}

export function saveCartState(cart: CartState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    getCartStorageKey(),
    JSON.stringify({ items: cart.items }),
  )
}

const initialState: CartState = loadCartState()

const cartSlice = createSlice({
  initialState,
  name: 'cart',
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const incomingItem = action.payload

      if (incomingItem.stock <= 0) {
        state.feedback = {
          id: Date.now(),
          message: `${incomingItem.name} is out of stock.`,
          type: 'warning',
        }
        return
      }

      const existingItem = state.items.find(
        (item) => item.id === incomingItem.id,
      )

      if (existingItem) {
        const addedQty = incomingItem.quantity || 1
        const newQuantity = clampQuantity(
          existingItem.quantity + addedQty,
          existingItem.stock,
        )

        if (newQuantity === existingItem.quantity) {
          state.feedback = {
            id: Date.now(),
            message: `${existingItem.name} is at maximum available stock (${existingItem.stock}).`,
            type: 'warning',
          }
          return
        }

        existingItem.quantity = newQuantity
        state.feedback = {
          id: Date.now(),
          message: `Increased ${existingItem.name} quantity to ${newQuantity}.`,
          type: 'success',
        }
        return
      }

      state.items.push({
        ...incomingItem,
        quantity: clampQuantity(incomingItem.quantity, incomingItem.stock),
      })
      state.feedback = {
        id: Date.now(),
        message: `${incomingItem.name} added to cart.`,
        type: 'success',
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    clearCartFeedback: (state) => {
      state.feedback = null
    },
    decreaseCartItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)

      if (!item) {
        return
      }

      item.quantity = clampQuantity(item.quantity - 1, item.stock)
    },
    increaseCartItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)

      if (!item) {
        return
      }

      item.quantity = clampQuantity(item.quantity + 1, item.stock)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (cartItem) => cartItem.id === action.payload.id,
      )

      if (!item) {
        return
      }

      item.quantity = clampQuantity(action.payload.quantity, item.stock)
    },
    syncCartForCurrentUser: (state) => {
      const nextCart = loadCartState()

      state.feedback = null
      state.items = nextCart.items
    },
  },
})

export const {
  addToCart,
  clearCart,
  clearCartFeedback,
  decreaseCartItem,
  increaseCartItem,
  removeFromCart,
  setCartItemQuantity,
  syncCartForCurrentUser,
} = cartSlice.actions

export default cartSlice.reducer
