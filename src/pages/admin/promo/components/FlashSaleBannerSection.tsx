import { Flame, Sparkles } from 'lucide-react'

import {
  fieldClass,
  PRESET_REDIRECT_OPTIONS,
  type PromoBannerFormState,
} from '../promoBannerUtils'

type FlashSaleBannerSectionProps = {
  formState: PromoBannerFormState
  setCustomFlashLink: (value: string) => void
  setFormState: (formState: PromoBannerFormState) => void
}

function FlashSaleBannerSection({
  formState,
  setCustomFlashLink,
  setFormState,
}: FlashSaleBannerSectionProps) {
  return (
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
  )
}

export default FlashSaleBannerSection
