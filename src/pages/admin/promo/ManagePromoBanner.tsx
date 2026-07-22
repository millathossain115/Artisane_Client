import { useEffect, useState } from 'react'
import { Flame, Save, Sparkles } from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { adminNavItems } from '../adminNavItems'
import {
  useGetActivePromoQuery,
  useUpdatePromoMutation,
} from '../../../features/promo/promoApi'

function ManagePromoBanner() {
  const { data: promo, isLoading, refetch } = useGetActivePromoQuery()
  const [updatePromo, { isLoading: isSaving }] = useUpdatePromoMutation()

  const [formState, setFormState] = useState({
    title: '10% off artisanal starter kits with code ARTISANE10',
    code: 'ARTISANE10',
    description: 'Special flash deal on all craft kits and supplies',
    endsAt: '',
    isActive: true,
    buttonText: 'Shop Starter Kits',
    buttonLink: '/products',
  })

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (promo) {
      const formattedDate = promo.endsAt
        ? new Date(promo.endsAt).toISOString().slice(0, 16)
        : ''

      setFormState({
        title: promo.title || '',
        code: promo.code || '',
        description: promo.description || '',
        endsAt: formattedDate,
        isActive: promo.isActive ?? true,
        buttonText: promo.buttonText || 'Shop Now',
        buttonLink: promo.buttonLink || '/products',
      })
    } else {
      // Default to 7 days from now
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16)
      setFormState((curr) => ({ ...curr, endsAt: defaultDate }))
    }
  }, [promo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      await updatePromo({
        ...formState,
        endsAt: formState.endsAt ? new Date(formState.endsAt).toISOString() : new Date().toISOString(),
      }).unwrap()

      setMessage({ text: 'Promo banner updated successfully!', type: 'success' })
      refetch()
    } catch (err: unknown) {
      setMessage({
        text: err && typeof err === 'object' && 'data' in err
          ? ((err as { data?: { message?: string } }).data?.message || 'Failed to update promo banner')
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
      subtitle="Configure home page announcement banner and countdown timer"
      title="Flash Deal & Promo Banner"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="border border-black/10 bg-white p-6">
          <div className="flex items-center gap-3 border-b border-black/10 pb-4">
            <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#8f3f1d]">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#181512]">Home Promo Banner Settings</h2>
              <p className="text-xs text-[#6b5f53]">
                Customize the flash deal banner and countdown timer displayed on the Home page.
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 border p-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {isLoading ? (
            <p className="py-8 text-center text-sm text-[#6b5f53]">Loading promo settings...</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Active Switch */}
              <div className="flex items-center justify-between border border-black/10 bg-[#f8f3ea]/50 p-4">
                <div>
                  <h3 className="font-bold text-[#181512]">Banner Visibility</h3>
                  <p className="text-xs text-[#6b5f53]">
                    Enable or disable the flash deal banner on the Home page.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8f3f1d]"></div>
                </label>
              </div>

              {/* Title & Promo Code */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                  Banner Title / Offer Headline *
                  <input
                    type="text"
                    required
                    className={fieldClass}
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. 10% off artisanal starter kits"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                  Promo Code (Uppercase) *
                  <input
                    type="text"
                    required
                    className={fieldClass}
                    value={formState.code}
                    onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ARTISANE10"
                  />
                </label>
              </div>

              {/* Description */}
              <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                Sub-Headline / Description
                <input
                  type="text"
                  className={fieldClass}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Optional brief description"
                />
              </label>

              {/* Timer End Date & CTA Button */}
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                  Countdown Ends At *
                  <input
                    type="datetime-local"
                    required
                    className={fieldClass}
                    value={formState.endsAt}
                    onChange={(e) => setFormState({ ...formState, endsAt: e.target.value })}
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                  Button Label
                  <input
                    type="text"
                    className={fieldClass}
                    value={formState.buttonText}
                    onChange={(e) => setFormState({ ...formState, buttonText: e.target.value })}
                    placeholder="Shop Now"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-bold text-[#181512]">
                  Button Redirect Path
                  <input
                    type="text"
                    className={fieldClass}
                    value={formState.buttonLink}
                    onChange={(e) => setFormState({ ...formState, buttonLink: e.target.value })}
                    placeholder="/products"
                  />
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="border border-dashed border-black/20 p-4 bg-[#f8f3ea]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8f3f1d] mb-2">
                  <Sparkles className="h-4 w-4" /> Live Preview
                </div>
                <div className="bg-[#8f3f1d] text-white p-3 rounded flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-bold mr-2">
                      Flash Deal
                    </span>
                    <span className="font-bold">{formState.title || 'Banner Title'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-black/30 px-2 py-0.5 rounded font-mono font-bold">
                      02D : 14H : 30M
                    </span>
                    <span className="border border-white/40 px-2 py-0.5 rounded font-mono">
                      {formState.code || 'CODE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end border-t border-black/10 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-[#8f3f1d] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#181512] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Promo Banner'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManagePromoBanner
