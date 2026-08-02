import { useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  useGetActivePromoQuery,
  useUpdatePromoMutation,
} from '../../../features/promo/promoApi'
import { adminNavItems } from '../adminNavItems'
import FlashSaleBannerSection from './components/FlashSaleBannerSection'
import PromoBannerHeader from './components/PromoBannerHeader'
import PromoBannerMessage from './components/PromoBannerMessage'
import PromoConfirmModal from './components/PromoConfirmModal'
import VoucherBannerSection from './components/VoucherBannerSection'
import {
  getInitialPromoFormState,
  getLoadedPromoFormState,
  getPromoErrorMessage,
  type PromoBannerMessage as PromoBannerMessageType,
} from './promoBannerUtils'

function ManagePromoBanner() {
  const { data: promo, isLoading, refetch } = useGetActivePromoQuery()
  const [updatePromo, { isLoading: isSaving }] = useUpdatePromoMutation()

  const [formState, setFormState] = useState(() =>
    getInitialPromoFormState(promo),
  )
  const [customFlashLink, setCustomFlashLink] = useState('')
  const [customVoucherLink, setCustomVoucherLink] = useState('')
  const [message, setMessage] = useState<PromoBannerMessageType | null>(null)
  const [loadedPromoId, setLoadedPromoId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  if (promo && promo._id !== loadedPromoId) {
    setLoadedPromoId(promo._id)
    setFormState(getLoadedPromoFormState(promo))
  }

  const handleOpenConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        text: getPromoErrorMessage(err),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      sidebarItems={adminNavItems}
      subtitle="Configure independent flash sale banner & coupon voucher card settings"
      title="Flash Sale & Voucher Banners"
    >
      <div className="w-full space-y-6">
        <div className="border border-black/10 bg-white p-6 sm:p-7">
          <PromoBannerHeader
            formState={formState}
            setFormState={setFormState}
          />

          {message ? <PromoBannerMessage message={message} /> : null}

          {isLoading ? (
            <p className="py-10 text-center text-sm font-bold text-[#6b5f53]">
              Loading promo banner settings...
            </p>
          ) : (
            <form className="mt-6 space-y-8" onSubmit={handleOpenConfirm}>
              <FlashSaleBannerSection
                formState={formState}
                setCustomFlashLink={setCustomFlashLink}
                setFormState={setFormState}
              />

              <VoucherBannerSection
                formState={formState}
                setCustomVoucherLink={setCustomVoucherLink}
                setFormState={setFormState}
              />

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

      {showConfirmModal ? (
        <PromoConfirmModal
          isSaving={isSaving}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ManagePromoBanner
