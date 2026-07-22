import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useGetActivePromoQuery } from '../../features/promo/promoApi'
import { getProductPriceInfo } from '../../utils/priceUtils'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'
import type { RecentProduct } from './recentProducts'

type RecentShelfCardProps = {
  product: RecentProduct
}

function RecentShelfCard({ product }: RecentShelfCardProps) {
  const imageUrl = getAssetUrl(product.image)
  const { data: activePromo } = useGetActivePromoQuery()
  const priceInfo = getProductPriceInfo(product.price, activePromo)

  return (
    <Link
      className="group block overflow-hidden border border-white/10 bg-white text-[#181512] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]"
      to={`/products/${product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e4d8c8]">
        {imageUrl ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#7a3f1d]">
            <ImageOff className="h-7 w-7" />
          </div>
        )}
        {priceInfo.hasDiscount && (
          <div className="absolute left-1.5 top-1.5 bg-[#8f3f1d] px-1.5 py-0.5 text-[10px] font-bold text-white shadow sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-xs">
            -{priceInfo.discountPercent}% OFF
          </div>
        )}
      </div>
      <div className="p-2 sm:p-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#7a3f1d] sm:text-xs sm:tracking-[0.12em]">
          {product.categoryName}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-8 text-xs font-bold leading-snug sm:min-h-10 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-1.5 sm:mt-3">
          <span className="text-sm font-bold sm:text-lg">
            {formatPrice(priceInfo.finalPrice)}
          </span>
          {priceInfo.hasDiscount && (
            <span className="text-xs font-semibold text-[#8a7d71] line-through">
              {formatPrice(priceInfo.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default RecentShelfCard
