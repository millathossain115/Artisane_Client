import type { FormEvent } from 'react'
import {
  CreditCard,
  MapPinned,
  MapPin,
  Phone,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

import type { UserAddress } from '../../features/address/addressApi'
import type { LocationOption } from '../../features/locations/locationApi'
import type { PaymentMethod } from '../../features/orders/orderApi'
import bkashLogo from '../../assets/Payment Partner/Bkash.png'
import nagadLogo from '../../assets/Payment Partner/Nagad.png'
import rocketLogo from '../../assets/Payment Partner/Rocket.webp'
import { paymentOptions } from './checkoutUtils'

type CheckoutFormProps = {
  districts: LocationOption[]
  fullAddress: string
  hasCartItems: boolean
  isDistrictsLoading: boolean
  isZonesLoading: boolean
  isConfirmingOrder: boolean
  notes: string
  savedAddresses?: UserAddress[]
  selectedAddressId?: string
  onSelectAddress?: (address: UserAddress) => void
  onDistrictChange: (value: string) => void
  onFullAddressChange: (value: string) => void
  onNotesChange: (value: string) => void
  onPaymentMethodChange: (value: PaymentMethod) => void
  onRecipientNameChange: (value: string) => void
  onRecipientPhoneChange: (value: string) => void
  onZoneChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  paymentMethod: PaymentMethod
  recipientName: string
  recipientPhone: string
  selectedDistrictId: string
  selectedZoneId: string
  zones: LocationOption[]
}

const paymentLogoByMethod: Partial<Record<PaymentMethod, string>> = {
  bkash: bkashLogo,
  nagad: nagadLogo,
  rocket: rocketLogo,
}

function CheckoutForm({
  districts,
  fullAddress,
  hasCartItems,
  isDistrictsLoading,
  isZonesLoading,
  isConfirmingOrder,
  notes,
  savedAddresses = [],
  selectedAddressId,
  onSelectAddress,
  onDistrictChange,
  onFullAddressChange,
  onNotesChange,
  onPaymentMethodChange,
  onRecipientNameChange,
  onRecipientPhoneChange,
  onZoneChange,
  onSubmit,
  paymentMethod,
  recipientName,
  recipientPhone,
  selectedDistrictId,
  selectedZoneId,
  zones,
}: CheckoutFormProps) {
  return (
    <form
      className="min-w-0 overflow-hidden border border-black/10 bg-white p-4 sm:p-6"
      onSubmit={onSubmit}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-bold break-words sm:text-5xl">
            Delivery details
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b5f53]">
            Confirm recipient, delivery zone, and payment method before placing order.
          </p>
        </div>
      </div>

      {savedAddresses.length > 0 ? (
        <div className="mt-6 min-w-0 border border-black/10 bg-[#f8f3ea]/30 p-3 sm:p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
            Select Saved Address
          </p>
          <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr._id
              return (
                <button
                  key={addr._id}
                  type="button"
                  onClick={() => onSelectAddress?.(addr)}
                  className={`min-w-0 overflow-hidden border p-3 text-left transition ${
                    isSelected
                      ? 'border-[#7a3f1d] bg-white ring-1 ring-[#7a3f1d]'
                      : 'border-black/10 bg-white hover:border-[#181512]'
                  }`}
                >
                  <div className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
                    <span className="min-w-0 truncate text-[#7a3f1d]">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-[#7a3f1d] text-white px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs font-bold text-[#181512]">
                    {addr.recipientName} ({addr.phone})
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b5f53] truncate">
                    {addr.streetAddress}, {addr.city}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5">
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          <label className="grid min-w-0 gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <UserRound className="h-4 w-4 text-[#7a3f1d]" />
              Recipient name
            </span>
            <input
              className="min-h-12 w-full min-w-0 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => onRecipientNameChange(event.target.value)}
              placeholder="Milla"
              value={recipientName}
            />
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Phone className="h-4 w-4 text-[#7a3f1d]" />
              Recipient phone
            </span>
            <input
              className="min-h-12 w-full min-w-0 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => onRecipientPhoneChange(event.target.value)}
              placeholder="01700000000"
              type="tel"
              value={recipientPhone}
            />
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <MapPin className="h-4 w-4 text-[#7a3f1d]" />
              District
            </span>
            <select
              className="min-h-12 w-full min-w-0 border border-black/10 bg-white px-3 text-sm font-medium outline-none transition focus:border-[#181512]"
              disabled={isDistrictsLoading}
              onChange={(event) => onDistrictChange(event.target.value)}
              value={selectedDistrictId}
            >
              <option value="">
                {isDistrictsLoading ? 'Loading districts...' : 'Select district'}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <MapPinned className="h-4 w-4 text-[#7a3f1d]" />
              Zone / area
            </span>
            <select
              className="min-h-12 w-full min-w-0 border border-black/10 bg-white px-3 text-sm font-medium outline-none transition focus:border-[#181512] disabled:bg-[#f8f3ea]"
              disabled={!selectedDistrictId || isZonesLoading}
              onChange={(event) => onZoneChange(event.target.value)}
              value={selectedZoneId}
            >
              <option value="">
                {!selectedDistrictId
                  ? 'Select district first'
                  : isZonesLoading
                    ? 'Loading zones...'
                    : 'Select zone'}
              </option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid min-w-0 gap-2">
          <span className="flex items-center gap-2 text-sm font-bold">
            <MapPin className="h-4 w-4 text-[#7a3f1d]" />
            Full address
          </span>
          <textarea
            className="min-h-32 w-full min-w-0 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            onChange={(event) => onFullAddressChange(event.target.value)}
            placeholder="House, road, landmark, floor"
            value={fullAddress}
          />
        </label>

        <div className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-bold">
            <CreditCard className="h-4 w-4 text-[#7a3f1d]" />
            Payment method
          </span>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {paymentOptions.map((option) => (
              <label
                className={`group min-w-0 cursor-pointer border p-3 transition sm:p-4 ${
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
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-10 min-w-14 place-items-center px-2 text-xs font-black sm:h-11 sm:min-w-16 sm:px-3 sm:text-sm ${
                      option.value === 'cod' ? option.accentClass : 'bg-white'
                    }`}
                  >
                    {paymentLogoByMethod[option.value] ? (
                      <img
                        alt={`${option.label} logo`}
                        className="max-h-7 max-w-14 object-contain sm:max-h-8 sm:max-w-16"
                        src={paymentLogoByMethod[option.value]}
                      />
                    ) : (
                      option.logo
                    )}
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

        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold">Order notes</span>
          <textarea
            className="min-h-24 w-full min-w-0 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
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
