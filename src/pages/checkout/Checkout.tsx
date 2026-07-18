import { useMemo, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Smartphone,
  X,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { getAccessToken, getStoredUser } from '../../features/auth/authApi'
import { useGetMyProfileQuery } from '../../features/auth/profileApi'
import { clearCart } from '../../features/cart/cartSlice'
import {
  type CreateOrderResult,
  type PaymentMethod,
  useCreateOrderMutation,
} from '../../features/orders/orderApi'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'

const paymentOptions: {
  accentClass: string
  detail: string
  icon: typeof Banknote
  label: string
  logo: string
  value: PaymentMethod
}[] = [
  {
    accentClass: 'bg-[#181512] text-white',
    detail: 'Pay when product arrives',
    icon: Banknote,
    label: 'Cash on delivery',
    logo: 'COD',
    value: 'cod',
  },
  {
    accentClass: 'bg-[#e2136e] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'bKash',
    logo: 'bKash',
    value: 'bkash',
  },
  {
    accentClass: 'bg-[#f58220] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'Nagad',
    logo: 'Nagad',
    value: 'nagad',
  },
  {
    accentClass: 'bg-[#7b1fa2] text-white',
    detail: 'Mobile wallet payment',
    icon: Smartphone,
    label: 'Rocket',
    logo: 'Rocket',
    value: 'rocket',
  },
]

const PAYMENT_REDIRECT_TIMEOUT_MS = 25_000

function getPaymentRedirectUrl(orderResult: CreateOrderResult | null) {
  const redirectUrl =
    orderResult?.payment?.paymentUrl ?? orderResult?.payment?.gatewayPageUrl

  return typeof redirectUrl === 'string' && redirectUrl.trim()
    ? redirectUrl
    : null
}

function getCheckoutErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  return 'Failed to place order.'
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    }),
  ])
}

function Checkout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const accessToken = getAccessToken()
  const storedUser = getStoredUser()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [createOrder] = useCreateOrderMutation()
  const { data: profile } = useGetMyProfileQuery(undefined, {
    skip: !accessToken,
  })
  const [shippingAddress, setShippingAddress] = useState('')
  const [contactPhone, setContactPhone] = useState(storedUser?.phone ?? '')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)
  const [pendingOrder, setPendingOrder] = useState<{
    contactPhone: string
    notes?: string
    paymentMethod: PaymentMethod
    shippingAddress: string
  } | null>(null)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  if (!accessToken) {
    return <Navigate replace to="/login" />
  }

  if (storedUser?.role === 'admin') {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!cartItems.length) {
      setMessage({ text: 'Cart is empty.', type: 'error' })
      return
    }

    const resolvedShippingAddress =
      shippingAddress.trim() || profile?.address?.trim() || ''
    const resolvedContactPhone =
      contactPhone.trim() || profile?.phone?.trim() || ''

    if (!resolvedShippingAddress || !resolvedContactPhone) {
      setMessage({
        text: 'Shipping address and contact phone are required.',
        type: 'error',
      })
      return
    }

    setPendingOrder({
      contactPhone: resolvedContactPhone,
      notes: notes.trim() || undefined,
      paymentMethod,
      shippingAddress: resolvedShippingAddress,
    })
  }

  async function confirmPlaceOrder() {
    if (!pendingOrder || isConfirmingOrder) {
      return
    }

    setIsConfirmingOrder(true)
    setMessage(null)

    try {
      const orderResult = await withTimeout(
        createOrder({
          contactPhone: pendingOrder.contactPhone,
          items: cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
          notes: pendingOrder.notes,
          paymentMethod: pendingOrder.paymentMethod,
          shippingAddress: pendingOrder.shippingAddress,
        }).unwrap(),
        PAYMENT_REDIRECT_TIMEOUT_MS,
        'Payment gateway did not respond in time. If this order appears in My Orders, do not place it again.',
      )
      const paymentUrl = getPaymentRedirectUrl(orderResult)
      setPendingOrder(null)
      dispatch(clearCart())

      if (paymentUrl) {
        window.location.href = paymentUrl
        return
      }

      setMessage({ text: 'Order placed successfully.', type: 'success' })
      navigate('/dashboard')
    } catch (error) {
      setPendingOrder(null)
      setMessage({ text: getCheckoutErrorMessage(error), type: 'error' })
    } finally {
      setIsConfirmingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4f463d] transition hover:text-[#181512]"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <form
            className="border border-black/10 bg-white p-5 sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Checkout
                </p>
                <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                  Delivery details
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b5f53]">
                  Confirm address, phone, and payment method before placing
                  order.
                </p>
              </div>
            </div>

            {message ? (
              <div
                className={`mt-5 flex items-start justify-between gap-3 border px-4 py-3 text-sm font-bold ${
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
                  aria-label="Close checkout message"
                  className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
                  onClick={() => setMessage(null)}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <MapPin className="h-4 w-4 text-[#7a3f1d]" />
                  Shipping address
                </span>
                <textarea
                  className="min-h-32 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder={profile?.address ?? 'House, road, city, country'}
                  value={shippingAddress}
                />
              </label>

              <label className="grid gap-2">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Phone className="h-4 w-4 text-[#7a3f1d]" />
                  Contact phone
                </span>
                <input
                  className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) => setContactPhone(event.target.value)}
                  placeholder={profile?.phone ?? '01700000000'}
                  type="tel"
                  value={contactPhone}
                />
              </label>

              <div className="grid gap-2">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <CreditCard className="h-4 w-4 text-[#7a3f1d]" />
                  Payment method
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentOptions.map((option) => (
                    <label
                      className={`group cursor-pointer border p-4 transition ${
                        paymentMethod === option.value
                          ? 'border-[#181512] bg-[#f8f3ea] shadow-[0_14px_28px_rgba(24,21,18,0.08)]'
                          : 'border-black/10 bg-white hover:border-[#7a3f1d]'
                      }`}
                      key={option.value}
                    >
                      <input
                        checked={paymentMethod === option.value}
                        className="sr-only"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod(option.value)}
                        type="radio"
                        value={option.value}
                      />
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-11 min-w-16 place-items-center px-3 text-sm font-black ${option.accentClass}`}
                        >
                          {option.logo}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                            {option.detail}
                          </span>
                        </span>
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center border transition ${
                            paymentMethod === option.value
                              ? 'border-[#181512] bg-[#181512] text-white'
                              : 'border-black/10 text-[#7a3f1d] group-hover:border-[#7a3f1d]'
                          }`}
                        >
                          <option.icon className="h-4 w-4" />
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold">Order notes</span>
                <textarea
                  className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional note"
                  value={notes}
                />
              </label>
            </div>

            <button
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isConfirmingOrder || !cartItems.length}
              type="submit"
            >
              <ShoppingBag className="h-4 w-4" />
              {isConfirmingOrder ? 'Placing order...' : 'Place order'}
            </button>
          </form>

          <aside className="border border-black/10 bg-[#181512] p-5 text-white lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
              Cart summary
            </p>
            <h2 className="mt-3 text-3xl font-bold">Your craft box</h2>

            <div className="mt-5 grid gap-4">
              {cartItems.length ? (
                cartItems.map((item) => {
                  const imageUrl = getAssetUrl(item.image)

                  return (
                    <article
                      className="grid grid-cols-[64px_1fr] gap-3 border-t border-white/10 pt-4"
                      key={item.id}
                    >
                      <div className="h-16 overflow-hidden bg-white/10">
                        {imageUrl ? (
                          <img
                            alt={item.name}
                            className="h-full w-full object-cover"
                            src={imageUrl}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-white/62">
                          Qty {item.quantity}
                        </p>
                        <p className="mt-2 text-sm font-bold text-[#f1c9a6]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="border-t border-white/10 pt-5 text-sm text-white/70">
                  Cart empty. Add products before checkout.
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Subtotal</span>
                <span className="text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/62">
                Final total, stock, and order status are confirmed by server.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {pendingOrder ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#181512]/65 px-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                  Confirm order
                </p>
                <h2 className="mt-2 text-3xl font-bold">Place this order?</h2>
              </div>
              <button
                aria-label="Close order confirmation"
                className="grid h-10 w-10 place-items-center border border-black/10 transition hover:border-[#181512]"
                onClick={() => setPendingOrder(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 border-y border-black/10 py-4 text-sm">
              <p>
                <span className="font-bold">Items:</span> {cartItems.length}
              </p>
              <p>
                <span className="font-bold">Subtotal:</span>{' '}
                {formatPrice(subtotal)}
              </p>
              <p>
                <span className="font-bold">Payment:</span>{' '}
                {paymentOptions.find(
                  (option) => option.value === pendingOrder.paymentMethod,
                )?.label ?? 'Payment method'}
              </p>
              <p>
                <span className="font-bold">Phone:</span>{' '}
                {pendingOrder.contactPhone}
              </p>
              <p className="leading-6">
                <span className="font-bold">Shipping:</span>{' '}
                {pendingOrder.shippingAddress}
              </p>
            </div>

            {pendingOrder.paymentMethod !== 'cod' ? (
              <p className="mt-4 border border-[#f1dfc8] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#7a3f1d]">
                Online payment is selected. Order will be created now; payment
                gateway will open after confirmation.
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                onClick={() => setPendingOrder(null)}
                type="button"
              >
                Review again
              </button>
              <button
                className="min-h-11 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isConfirmingOrder}
                onClick={confirmPlaceOrder}
                type="button"
              >
                {isConfirmingOrder ? 'Placing...' : 'Confirm order'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  )
}

export default Checkout
