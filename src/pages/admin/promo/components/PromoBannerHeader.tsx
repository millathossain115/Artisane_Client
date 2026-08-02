import { Flame } from 'lucide-react'

import type { PromoBannerFormState } from '../promoBannerUtils'

type PromoBannerHeaderProps = {
  formState: PromoBannerFormState
  setFormState: (formState: PromoBannerFormState) => void
}

function PromoBannerHeader({
  formState,
  setFormState,
}: PromoBannerHeaderProps) {
  return (
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
  )
}

export default PromoBannerHeader
