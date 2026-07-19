import type { FormEvent, RefObject } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  X,
} from 'lucide-react'

import type { PaymentMethod } from '../../features/orders/orderApi'
import { paymentOptions, type CheckoutMessage } from './checkoutUtils'

type CheckoutFormProps = {
  contactPhone: string
  hasCartItems: boolean
  isConfirmingOrder: boolean
  message: CheckoutMessage | null
  messageRef: RefObject<HTMLDivElement | null>
  notes: string
  onContactPhoneChange: (value: string) => void
  onDismissMessage: () => void
  onNotesChange: (value: string) => void
  onPaymentMethodChange: (value: PaymentMethod) => void
  onShippingAddressChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  paymentMethod: PaymentMethod
  shippingAddress: string
}

function CheckoutForm({
  contactPhone,
  hasCartItems,
  isConfirmingOrder,
  message,
  messageRef,
  notes,
  onContactPhoneChange,
  onDismissMessage,
  onNotesChange,
  onPaymentMethodChange,
  onShippingAddressChange,
  onSubmit,
  paymentMethod,
  shippingAddress,
}: CheckoutFormProps) {
  return (
    <form
      className="border border-black/10 bg-white p-5 sm:p-6"
      onSubmit={onSubmit}
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
            Confirm address, phone, and payment method before placing order.
          </p>
        </div>
      </div>

      {message ? (
        <div
          ref={messageRef}
          aria-live="polite"
          tabIndex={-1}
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
            onClick={onDismissMessage}
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
            onChange={(event) => onShippingAddressChange(event.target.value)}
            placeholder="House, road, city, country"
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
            onChange={(event) => onContactPhoneChange(event.target.value)}
            placeholder="01700000000"
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
                  onChange={() => onPaymentMethodChange(option.value)}
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
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Optional note"
            value={notes}
          />
        </label>
      </div>

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isConfirmingOrder || !hasCartItems}
        type="submit"
      >
        <ShoppingBag className="h-4 w-4" />
        {isConfirmingOrder ? 'Placing order...' : 'Place order'}
      </button>
    </form>
  )
}

export default CheckoutForm
