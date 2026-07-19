import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { API_BASE_URL } from '../../config/api'
import {
  clearCart,
  clearCartFeedback,
  decreaseCartItem,
  increaseCartItem,
  removeFromCart,
} from '../../features/cart/cartSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

function formatPrice(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`
}

function getCartImageUrl(image?: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `${API_BASE_URL.replace('/api/v1', '')}${image}`
}

function CartButton() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cartItems = useAppSelector((state) => state.cart.items)
  const cartFeedback = useAppSelector((state) => state.cart.feedback)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  useEffect(() => {
    if (!cartFeedback) {
      return
    }

    const timer = window.setTimeout(() => {
      dispatch(clearCartFeedback())
    }, 2600)

    return () => {
      window.clearTimeout(timer)
    }
  }, [cartFeedback, dispatch])

  return (
    <>
      <button
        className="relative grid h-10 w-10 place-items-center bg-[#181512] text-white transition hover:bg-[#7a3f1d]"
        aria-label="Open cart"
        onClick={() => setIsCartOpen(true)}
        type="button"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center bg-[#c85f2f] px-1 text-xs font-bold">
          {cartQuantity}
        </span>
      </button>

      {isCartOpen ? (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <button
            aria-label="Close cart"
            className="absolute inset-0 h-full w-full bg-[#181512]/65"
            onClick={() => setIsCartOpen(false)}
            type="button"
          />

          <aside
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-white shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
                  Cart
                </p>
                <h2 className="text-2xl font-bold">Your craft box</h2>
              </div>
              <button
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={() => setIsCartOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length ? (
                <div className="grid gap-4">
                  {cartItems.map((item) => {
                    const imageUrl = getCartImageUrl(item.image)

                    return (
                      <article
                        className="grid grid-cols-[76px_1fr] gap-3 border-b border-black/10 pb-4"
                        key={item.id}
                      >
                        <Link
                          className="block overflow-hidden bg-[#f8f3ea]"
                          onClick={() => setIsCartOpen(false)}
                          to={`/products/${item.id}`}
                        >
                          {imageUrl ? (
                            <img
                              alt={item.name}
                              className="h-24 w-full object-cover"
                              src={imageUrl}
                            />
                          ) : (
                            <span className="grid h-24 place-items-center text-[#7a3f1d]">
                              <ShoppingBag className="h-5 w-5" />
                            </span>
                          )}
                        </Link>

                        <div className="min-w-0">
                          <Link
                            className="line-clamp-2 font-bold leading-snug transition hover:text-[#7a3f1d]"
                            onClick={() => setIsCartOpen(false)}
                            to={`/products/${item.id}`}
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
                            {item.categoryName}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-grid grid-cols-[32px_40px_32px] overflow-hidden border border-black/10">
                              <button
                                aria-label={`Decrease ${item.name}`}
                                className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  dispatch(decreaseCartItem(item.id))
                                }
                                type="button"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="grid h-8 place-items-center border-x border-black/10 text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                aria-label={`Increase ${item.name}`}
                                className="grid h-8 place-items-center transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={item.quantity >= item.stock}
                                onClick={() =>
                                  dispatch(increaseCartItem(item.id))
                                }
                                type="button"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              aria-label={`Remove ${item.name}`}
                              className="grid h-8 w-8 place-items-center border border-black/10 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                              onClick={() => dispatch(removeFromCart(item.id))}
                              type="button"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-3 text-sm font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                      <ShoppingBag className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-lg font-bold">Cart is empty.</p>
                    <p className="mt-2 text-sm text-[#6b5f53]">
                      Add products from home or product detail page.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-black/10 p-5">
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Subtotal</span>
                <span className="text-xl">{formatPrice(cartSubtotal)}</span>
              </div>
              <button
                className="mt-4 min-h-12 w-full bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!cartItems.length}
                onClick={() => {
                  setIsCartOpen(false)
                  navigate('/checkout')
                }}
                type="button"
              >
                Checkout
              </button>
              <button
                className="mt-3 min-h-11 w-full border border-black/10 px-5 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!cartItems.length}
                onClick={() => dispatch(clearCart())}
                type="button"
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {cartFeedback ? (
        <div className="fixed right-4 top-24 z-[110] w-[calc(100vw-2rem)] max-w-sm border border-black/10 bg-white shadow-[0_22px_44px_rgba(24,21,18,0.18)]">
          <div
            className={`border-l-4 px-4 py-3 ${
              cartFeedback.type === 'warning'
                ? 'border-[#c85f2f]'
                : 'border-[#1f6b43]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-[#181512]">
                {cartFeedback.message}
              </p>
              <button
                aria-label="Close cart message"
                className="grid h-7 w-7 shrink-0 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={() => dispatch(clearCartFeedback())}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default CartButton
