import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { getAccessToken, getStoredUser } from '../../features/auth/authApi'
import { useGetMyProfileQuery } from '../../features/auth/profileApi'
import { clearCart } from '../../features/cart/cartSlice'
import {
  type PaymentMethod,
  useCreateOrderMutation,
} from '../../features/orders/orderApi'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import CheckoutConfirmModal from './CheckoutConfirmModal'
import CheckoutForm from './CheckoutForm'
import CheckoutSummary from './CheckoutSummary'
import {
  CHECKOUT_MESSAGE_SCROLL_OFFSET,
  PAYMENT_REDIRECT_TIMEOUT_MS,
  type CheckoutMessage,
  type PendingCheckoutOrder,
  getCheckoutErrorMessage,
  getPaymentRedirectUrl,
  withTimeout,
} from './checkoutUtils'

function Checkout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const messageRef = useRef<HTMLDivElement | null>(null)
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
  const [message, setMessage] = useState<CheckoutMessage | null>(null)
  const [pendingOrder, setPendingOrder] =
    useState<PendingCheckoutOrder | null>(null)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [hasPrefilledProfile, setHasPrefilledProfile] = useState(false)

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  useEffect(() => {
    if (message?.type !== 'error') {
      return
    }

    const target = messageRef.current

    if (!target) {
      return
    }

    const top = window.scrollY + target.getBoundingClientRect().top

    window.scrollTo({
      behavior: 'smooth',
      top: Math.max(0, top - CHECKOUT_MESSAGE_SCROLL_OFFSET),
    })
  }, [message])

  useEffect(() => {
    if (!profile || hasPrefilledProfile) {
      return
    }

    setShippingAddress((currentAddress) =>
      currentAddress || profile.address || '',
    )
    setContactPhone((currentPhone) => currentPhone || profile.phone || '')
    setHasPrefilledProfile(true)
  }, [hasPrefilledProfile, profile])

  if (!accessToken) {
    return <Navigate replace to="/login" />
  }

  if (storedUser?.role === 'admin') {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPendingOrder(null)
    setMessage(null)

    if (!cartItems.length) {
      setMessage({ text: 'Cart is empty.', type: 'error' })
      return
    }

    const resolvedShippingAddress = shippingAddress.trim()
    const resolvedContactPhone = contactPhone.trim()

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
          <CheckoutForm
            contactPhone={contactPhone}
            hasCartItems={cartItems.length > 0}
            isConfirmingOrder={isConfirmingOrder}
            message={message}
            messageRef={messageRef}
            notes={notes}
            onContactPhoneChange={setContactPhone}
            onDismissMessage={() => setMessage(null)}
            onNotesChange={setNotes}
            onPaymentMethodChange={setPaymentMethod}
            onShippingAddressChange={setShippingAddress}
            onSubmit={handleSubmit}
            paymentMethod={paymentMethod}
            shippingAddress={shippingAddress}
          />
          <CheckoutSummary cartItems={cartItems} subtotal={subtotal} />
        </div>
      </main>

      {pendingOrder ? (
        <CheckoutConfirmModal
          cartItemCount={cartItems.length}
          isConfirmingOrder={isConfirmingOrder}
          onClose={() => setPendingOrder(null)}
          onConfirm={confirmPlaceOrder}
          pendingOrder={pendingOrder}
          subtotal={subtotal}
        />
      ) : null}

      <Footer />
    </div>
  )
}

export default Checkout
