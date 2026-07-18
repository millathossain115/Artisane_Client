import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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

export function loadCartState(): CartState {
  if (typeof window === 'undefined') {
    return { feedback: null, items: [] }
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)

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

export function saveCartState(cart: CartState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    CART_STORAGE_KEY,
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
        state.feedback = {
          id: Date.now(),
          message: `${existingItem.name} is already in your cart.`,
          type: 'warning',
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
} = cartSlice.actions

export default cartSlice.reducer
