import { Sparkles, Ticket } from 'lucide-react'

import {
  fieldClass,
  PRESET_REDIRECT_OPTIONS,
  type PromoBannerFormState,
} from '../promoBannerUtils'

type VoucherBannerSectionProps = {
  formState: PromoBannerFormState
  setCustomVoucherLink: (value: string) => void
  setFormState: (formState: PromoBannerFormState) => void
}

function VoucherBannerSection({
  formState,
  setCustomVoucherLink,
  setFormState,
}: VoucherBannerSectionProps) {
  return (
    <div className="border border-black/10 bg-[#f8f3ea]/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Ticket className="h-5 w-5 text-[#7a3f1d]" />
          <h3 className="text-base font-bold text-[#7a3f1d]">
            2. Voucher / Coupon Card Customization
          </h3>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#181512]">
          <input
            checked={formState.enableVoucher}
            className="h-4 w-4 accent-[#7a3f1d]"
            onChange={(e) =>
              setFormState({
                ...formState,
                enableVoucher: e.target.checked,
              })
            }
            type="checkbox"
          />
          Enable Voucher Card
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Voucher Card Headline / Title *
          <input
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherTitle: e.target.value,
              })
            }
            placeholder="Exclusive Customer Coupon"
            required
            type="text"
            value={formState.voucherTitle}
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Voucher Sub-Headline / Description
          <input
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherDescription: e.target.value,
              })
            }
            placeholder="Apply code at checkout for extra savings"
            type="text"
            value={formState.voucherDescription}
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Coupon Code (e.g. ARTISANE10) *
          <input
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherCode: e.target.value.toUpperCase(),
              })
            }
            placeholder="ARTISANE10"
            required
            type="text"
            value={formState.voucherCode}
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Voucher Discount (% OFF)
          <input
            className={fieldClass}
            max="100"
            min="0"
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherDiscountPercent: Number(e.target.value),
              })
            }
            placeholder="15"
            type="number"
            value={formState.voucherDiscountPercent}
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Voucher Expiration Date *
          <input
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherEndsAt: e.target.value,
              })
            }
            required
            type="datetime-local"
            value={formState.voucherEndsAt}
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
          Voucher Button Label
          <input
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherButtonText: e.target.value,
              })
            }
            placeholder="Claim Voucher"
            type="text"
            value={formState.voucherButtonText}
          />
        </label>

        <div className="grid gap-1.5 text-xs font-bold text-[#181512] sm:col-span-2">
          <label>Voucher Button Target Destination</label>
          <select
            className={fieldClass}
            onChange={(e) =>
              setFormState({
                ...formState,
                voucherButtonLink: e.target.value,
              })
            }
            value={
              PRESET_REDIRECT_OPTIONS.some(
                (opt) => opt.value === formState.voucherButtonLink,
              )
                ? formState.voucherButtonLink
                : 'custom'
            }
          >
            {PRESET_REDIRECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {(formState.voucherButtonLink === 'custom' ||
            !PRESET_REDIRECT_OPTIONS.some(
              (opt) => opt.value === formState.voucherButtonLink,
            )) && (
            <input
              className={`${fieldClass} mt-1.5`}
              onChange={(e) => {
                setCustomVoucherLink(e.target.value)
                setFormState({
                  ...formState,
                  voucherButtonLink: e.target.value,
                })
              }}
              placeholder="Enter custom path (e.g. /products?promo=10)"
              type="text"
              value={formState.voucherButtonLink}
            />
          )}
        </div>
      </div>

      <div className="mt-6 border border-dashed border-black/20 bg-white p-4">
        <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
          <Sparkles className="h-4 w-4" /> Live Preview: Voucher Card
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#7a3f1d]/20 bg-[#f8f3ea] p-5 text-xs text-[#181512] shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="border border-[#7a3f1d] bg-[#7a3f1d] px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-white">
              CODE: {formState.voucherCode || 'ARTISANE10'}
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#181512]">
                {formState.voucherTitle || 'Voucher Title'} (
                {formState.voucherDiscountPercent}% OFF)
              </h4>
              {formState.voucherDescription && (
                <p className="mt-0.5 text-xs text-[#6b5f53]">
                  {formState.voucherDescription}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-black/10 bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#7a3f1d]">
              Expires: {formState.voucherEndsAt || 'Not set'}
            </div>
            {formState.voucherButtonText && (
              <span className="bg-[#181512] px-4 py-1.5 text-xs font-bold text-white">
                {formState.voucherButtonText} →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoucherBannerSection
