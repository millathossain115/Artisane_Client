import { useState } from 'react'
import { Flame, Save, Sparkles, Ticket } from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { adminNavItems } from '../adminNavItems'
import {
  useGetActivePromoQuery,
  useUpdatePromoMutation,
} from '../../../features/promo/promoApi'

const PRESET_REDIRECT_OPTIONS = [
  { label: 'Shop Catalog (/products)', value: '/products' },
  { label: 'Categories Page (/categories)', value: '/categories' },
  { label: 'Main Store Front (/shop)', value: '/shop' },
  { label: 'Checkout Page (/checkout)', value: '/checkout' },
  { label: 'Custom URL Path...', value: 'custom' },
]

function getDefaultEndDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16)
}

function ManagePromoBanner() {
  const { data: promo, isLoading, refetch } = useGetActivePromoQuery()
  const [updatePromo, { isLoading: isSaving }] = useUpdatePromoMutation()

  const [formState, setFormState] = useState(() => ({
    // Global
    isActive: promo?.isActive ?? true,

    // 1. Flash Sale Banner
    enableAutoDiscount: promo?.enableAutoDiscount ?? true,
    title: promo?.title || 'Special Store-Wide Flash Deal',
    description:
      promo?.description ||
      'Limited time automatic store discount applied on all crafts',
    autoDiscountPercent:
      promo?.autoDiscountPercent ?? promo?.discountPercent ?? 10,
    endsAt: promo?.endsAt
      ? new Date(promo.endsAt).toISOString().slice(0, 16)
      : getDefaultEndDate(),
    buttonText: promo?.buttonText || 'Shop Starter Kits',
    buttonLink: promo?.buttonLink || '/products',

    // 2. Voucher Card
    enableVoucher: promo?.enableVoucher ?? true,
    voucherTitle: promo?.voucherTitle || 'Exclusive Customer Coupon',
    voucherDescription:
      promo?.voucherDescription ||
      'Apply voucher code at checkout to claim extra savings',
    voucherCode: promo?.voucherCode || promo?.code || 'ARTISANE10',
    voucherDiscountPercent: promo?.voucherDiscountPercent ?? 15,
    voucherEndsAt: promo?.voucherEndsAt
      ? new Date(promo.voucherEndsAt).toISOString().slice(0, 16)
      : promo?.endsAt
        ? new Date(promo.endsAt).toISOString().slice(0, 16)
        : getDefaultEndDate(),
    voucherButtonText: promo?.voucherButtonText || 'Claim Voucher',
    voucherButtonLink: promo?.voucherButtonLink || '/products',
  }))

  const [customFlashLink, setCustomFlashLink] = useState('')
  const [customVoucherLink, setCustomVoucherLink] = useState('')

  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [loadedPromoId, setLoadedPromoId] = useState<string | null>(null)

  if (promo && promo._id !== loadedPromoId) {
    setLoadedPromoId(promo._id)
    setFormState({
      isActive: promo.isActive ?? true,

      enableAutoDiscount: promo.enableAutoDiscount ?? true,
      title: promo.title || 'Special Store-Wide Flash Deal',
      description: promo.description || '',
      autoDiscountPercent:
        promo.autoDiscountPercent ?? promo.discountPercent ?? 10,
      endsAt: promo.endsAt
        ? new Date(promo.endsAt).toISOString().slice(0, 16)
        : promo.flashSaleEndsAt
          ? new Date(promo.flashSaleEndsAt).toISOString().slice(0, 16)
          : getDefaultEndDate(),
      buttonText: promo.buttonText || 'Shop Starter Kits',
      buttonLink: promo.buttonLink || '/products',

      enableVoucher: promo.enableVoucher ?? true,
      voucherTitle: promo.voucherTitle || 'Exclusive Customer Coupon',
      voucherDescription: promo.voucherDescription || '',
      voucherCode: promo.voucherCode || promo.code || 'ARTISANE10',
      voucherDiscountPercent: promo.voucherDiscountPercent ?? 15,
      voucherEndsAt: promo.voucherEndsAt
        ? new Date(promo.voucherEndsAt).toISOString().slice(0, 16)
        : getDefaultEndDate(),
      voucherButtonText: promo.voucherButtonText || 'Claim Voucher',
      voucherButtonLink: promo.voucherButtonLink || '/products',
    })
  }

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirmModal(false)
    setMessage(null)

    const finalFlashLink =
      formState.buttonLink === 'custom'
        ? customFlashLink
        : formState.buttonLink
    const finalVoucherLink =
      formState.voucherButtonLink === 'custom'
        ? customVoucherLink
        : formState.voucherButtonLink

    try {
      await updatePromo({
        ...formState,
        code: formState.voucherCode,
        discountPercent: formState.autoDiscountPercent,
        endsAt: formState.endsAt
          ? new Date(formState.endsAt).toISOString()
          : new Date().toISOString(),
        flashSaleEndsAt: formState.endsAt
          ? new Date(formState.endsAt).toISOString()
          : new Date().toISOString(),
        voucherEndsAt: formState.voucherEndsAt
          ? new Date(formState.voucherEndsAt).toISOString()
          : new Date().toISOString(),
        buttonLink: finalFlashLink,
        voucherButtonLink: finalVoucherLink,
      }).unwrap()

      setMessage({
        text: 'Promo banners updated successfully!',
        type: 'success',
      })
      refetch()
    } catch (err: unknown) {
      setMessage({
        text:
          err && typeof err === 'object' && 'data' in err
            ? (err as { data?: { message?: string } }).data?.message ||
              'Failed to update promo banner'
            : 'Failed to update promo banner',
        type: 'error',
      })
    }
  }

  const fieldClass =
    'w-full border border-black/10 bg-[#fbf8f3] px-3.5 py-2.5 text-sm font-medium transition focus:border-[#8f3f1d] focus:bg-white focus:outline-none'

  return (
    <DashboardLayout
      sidebarItems={adminNavItems}
      subtitle="Configure independent flash sale banner & coupon voucher card settings"
      title="Flash Sale & Voucher Banners"
    >
      <div className="w-full space-y-6">
        <div className="border border-black/10 bg-white p-6 sm:p-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-[#f8f3ea] text-[#8f3f1d]">
                <Flame className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[#181512]">
                  Promotional Banners Manager
                </h2>
                <p className="text-xs text-[#6b5f53]">
                  Customize separate configurations for Flash Sale Banner and
                  Voucher Card.
                </p>
              </div>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center gap-3 border border-black/10 bg-[#f8f3ea] px-4 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#181512]">
                Global Master Status:
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  checked={formState.isActive}
                  className="peer sr-only"
                  onChange={(e) =>
                    setFormState({ ...formState, isActive: e.target.checked })
                  }
                  type="checkbox"
                />
                <div className="h-5 w-9 rounded-full bg-gray-300 transition-all after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#8f3f1d] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
              </label>
              <span
                className={`text-xs font-bold uppercase ${
                  formState.isActive ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                {formState.isActive ? 'LIVE ON STORE' : 'OFF'}
              </span>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 border p-3.5 text-sm font-medium ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {isLoading ? (
            <p className="py-10 text-center text-sm font-bold text-[#6b5f53]">
              Loading promo banner settings...
            </p>
          ) : (
            <form className="mt-6 space-y-8" onSubmit={handleOpenConfirm}>
              {/* SECTION 1: FLASH SALE BANNER */}
              <div className="border border-black/10 bg-[#f8f3ea]/40 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Flame className="h-5 w-5 text-[#8f3f1d]" />
                    <h3 className="text-base font-bold text-[#8f3f1d]">
                      1. Flash Sale Banner Customization
                    </h3>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#181512]">
                    <input
                      checked={formState.enableAutoDiscount}
                      className="h-4 w-4 accent-[#8f3f1d]"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          enableAutoDiscount: e.target.checked,
                        })
                      }
                      type="checkbox"
                    />
                    Enable Flash Sale Banner
                  </label>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    Flash Banner Headline / Title *
                    <input
                      className={fieldClass}
                      onChange={(e) =>
                        setFormState({ ...formState, title: e.target.value })
                      }
                      placeholder="Special Store-Wide Flash Deal"
                      required
                      type="text"
                      value={formState.title}
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    Flash Banner Sub-Headline / Description
                    <input
                      className={fieldClass}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          description: e.target.value,
                        })
                      }
                      placeholder="Automatic discount on selected craft items"
                      type="text"
                      value={formState.description}
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    Auto Discount (% OFF)
                    <input
                      className={fieldClass}
                      max="100"
                      min="0"
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          autoDiscountPercent: Number(e.target.value),
                        })
                      }
                      placeholder="10"
                      type="number"
                      value={formState.autoDiscountPercent}
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    Flash Sale Countdown Ends At *
                    <input
                      className={fieldClass}
                      onChange={(e) =>
                        setFormState({ ...formState, endsAt: e.target.value })
                      }
                      required
                      type="datetime-local"
                      value={formState.endsAt}
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    Button Label Text
                    <input
                      className={fieldClass}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          buttonText: e.target.value,
                        })
                      }
                      placeholder="Shop Starter Kits"
                      type="text"
                      value={formState.buttonText}
                    />
                  </label>

                  <div className="grid gap-1.5 text-xs font-bold text-[#181512]">
                    <label>Button Target Destination</label>
                    <select
                      className={fieldClass}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          buttonLink: e.target.value,
                        })
                      }
                      value={
                        PRESET_REDIRECT_OPTIONS.some(
                          (opt) => opt.value === formState.buttonLink,
                        )
                          ? formState.buttonLink
                          : 'custom'
                      }
                    >
                      {PRESET_REDIRECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {(formState.buttonLink === 'custom' ||
                      !PRESET_REDIRECT_OPTIONS.some(
                        (opt) => opt.value === formState.buttonLink,
                      )) && (
                      <input
                        className={`${fieldClass} mt-1.5`}
                        onChange={(e) => {
                          setCustomFlashLink(e.target.value)
                          setFormState({
                            ...formState,
                            buttonLink: e.target.value,
                          })
                        }}
                        placeholder="Enter custom path (e.g. /products?category=123)"
                        type="text"
                        value={formState.buttonLink}
                      />
                    )}
                  </div>
                </div>

                {/* Section 1 Live Preview */}
                <div className="mt-6 border border-dashed border-black/20 bg-white p-4">
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8f3f1d]">
                    <Sparkles className="h-4 w-4" /> Live Preview: Flash Sale
                    Banner
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-y border-black/10 bg-[#181512] p-5 text-xs text-white shadow-md sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-[#8f3f1d] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        Flash Sale ({formState.autoDiscountPercent}% OFF)
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {formState.title || 'Flash Sale Title'}
                        </h4>
                        {formState.description && (
                          <p className="mt-0.5 text-xs text-[#f1c9a6]">
                            {formState.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#f1c9a6]">
                        Timer ends: {formState.endsAt || 'Not set'}
                      </div>
                      {formState.buttonText && (
                        <span className="bg-[#8f3f1d] px-4 py-1.5 text-xs font-bold text-white">
                          {formState.buttonText} →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: VOUCHER CARD BANNER */}
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

                {/* Section 2 Live Preview */}
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

              {/* Submit Button */}
              <div className="flex justify-end border-t border-black/10 pt-5">
                <button
                  className="inline-flex items-center gap-2 bg-[#8f3f1d] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#181512] disabled:opacity-50"
                  disabled={isSaving}
                  type="submit"
                >
                  <Save className="h-4.5 w-4.5" />
                  {isSaving ? 'Saving Changes...' : 'Save All Promo Banners'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Warning Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-black/10 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-xl font-bold">
                ⚠️
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#181512]">
                  Confirm Banner Updates
                </h3>
                <p className="text-xs text-[#6b5f53]">
                  Action will instantly update public home page deals.
                </p>
              </div>
            </div>

            <div className="border border-amber-200 bg-amber-50/80 p-3 text-xs leading-relaxed text-amber-900">
              <strong>Warning:</strong> Saving will update separate countdown
              expiration dates, coupon codes, and banner links across the live
              website.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="border border-black/20 bg-white px-4 py-2 text-xs font-bold text-[#181512] hover:bg-gray-100"
                onClick={() => setShowConfirmModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-[#8f3f1d] px-4 py-2 text-xs font-bold text-white hover:bg-[#181512] disabled:opacity-50"
                disabled={isSaving}
                onClick={handleConfirmSave}
                type="button"
              >
                {isSaving ? 'Updating...' : 'Yes, Apply Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManagePromoBanner
