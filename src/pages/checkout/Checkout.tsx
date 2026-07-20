import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { getAccessToken, getStoredUser } from '../../features/auth/authApi'
import { useGetMyProfileQuery } from '../../features/auth/profileApi'
import { clearCart } from '../../features/cart/cartSlice'
import {
  useGetDistrictsQuery,
  useGetZonesQuery,
} from '../../features/locations/locationApi'
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
  const [deliveryForm, setDeliveryForm] = useState({
    districtId: '',
    fullAddress: '',
    recipientName: storedUser?.name ?? '',
    recipientPhone: storedUser?.phone ?? '',
    zoneId: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<CheckoutMessage | null>(null)
  const [pendingOrder, setPendingOrder] =
    useState<PendingCheckoutOrder | null>(null)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [hasPrefilledProfile, setHasPrefilledProfile] = useState(false)
  const { data: districts = [], isLoading: isDistrictsLoading } =
    useGetDistrictsQuery(undefined, {
      skip: !accessToken,
    })
  const { data: zones = [], isFetching: isZonesLoading } = useGetZonesQuery(
    deliveryForm.districtId,
    {
      skip: !accessToken || !deliveryForm.districtId,
    },
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )
  const selectedDistrict = useMemo(
    () =>
      districts.find((district) => district.id === deliveryForm.districtId),
    [deliveryForm.districtId, districts],
  )
  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === deliveryForm.zoneId),
    [deliveryForm.zoneId, zones],
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

    setDeliveryForm((current) => ({
      ...current,
      fullAddress: current.fullAddress || profile.address || '',
      recipientName:
        current.recipientName || profile.name || storedUser?.name || '',
      recipientPhone:
        current.recipientPhone || profile.phone || storedUser?.phone || '',
    }))
    setHasPrefilledProfile(true)
  }, [hasPrefilledProfile, profile, storedUser?.name, storedUser?.phone])

  function updateDeliveryField(field: keyof typeof deliveryForm, value: string) {
    setDeliveryForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateDistrict(districtId: string) {
    setDeliveryForm((current) => ({
      ...current,
      districtId,
      zoneId: '',
    }))
  }

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

    const resolvedRecipientName = deliveryForm.recipientName.trim()
    const resolvedRecipientPhone = deliveryForm.recipientPhone.trim()
    const resolvedFullAddress = deliveryForm.fullAddress.trim()

    if (
      !resolvedRecipientName ||
      !resolvedRecipientPhone ||
      !resolvedFullAddress ||
      !deliveryForm.districtId ||
      !deliveryForm.zoneId
    ) {
      setMessage({
        text: 'Recipient name, phone, address, district, and zone are required.',
        type: 'error',
      })
      return
    }

    const districtName = selectedDistrict?.name ?? deliveryForm.districtId
    const zoneName = selectedZone?.name ?? deliveryForm.zoneId
    const shippingAddress = [resolvedFullAddress, zoneName, districtName]
      .filter(Boolean)
      .join(', ')

    setPendingOrder({
      contactPhone: resolvedRecipientPhone,
      districtId: deliveryForm.districtId,
      districtName,
      fullAddress: resolvedFullAddress,
      notes: notes.trim() || undefined,
      paymentMethod,
      recipientName: resolvedRecipientName,
      recipientPhone: resolvedRecipientPhone,
      shippingAddress,
      zoneId: deliveryForm.zoneId,
      zoneName,
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
          district_id: pendingOrder.districtId,
          full_address: pendingOrder.fullAddress,
          items: cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
          notes: pendingOrder.notes,
          paymentMethod: pendingOrder.paymentMethod,
          recipient_name: pendingOrder.recipientName,
          recipient_phone: pendingOrder.recipientPhone,
          shippingAddress: pendingOrder.shippingAddress,
          zone_id: pendingOrder.zoneId,
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
            districts={districts}
            fullAddress={deliveryForm.fullAddress}
            hasCartItems={cartItems.length > 0}
            isDistrictsLoading={isDistrictsLoading}
            isZonesLoading={isZonesLoading}
            isConfirmingOrder={isConfirmingOrder}
            message={message}
            messageRef={messageRef}
            notes={notes}
            onDistrictChange={updateDistrict}
            onDismissMessage={() => setMessage(null)}
            onFullAddressChange={(value) =>
              updateDeliveryField('fullAddress', value)
            }
            onNotesChange={setNotes}
            onPaymentMethodChange={setPaymentMethod}
            onRecipientNameChange={(value) =>
              updateDeliveryField('recipientName', value)
            }
            onRecipientPhoneChange={(value) =>
              updateDeliveryField('recipientPhone', value)
            }
            onSubmit={handleSubmit}
            onZoneChange={(value) => updateDeliveryField('zoneId', value)}
            paymentMethod={paymentMethod}
            recipientName={deliveryForm.recipientName}
            recipientPhone={deliveryForm.recipientPhone}
            selectedDistrictId={deliveryForm.districtId}
            selectedZoneId={deliveryForm.zoneId}
            zones={zones}
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
