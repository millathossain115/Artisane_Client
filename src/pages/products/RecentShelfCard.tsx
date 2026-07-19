import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatPrice, getAssetUrl } from '../../utils/productDisplay'
import type { RecentProduct } from './recentProducts'

type RecentShelfCardProps = {
  product: RecentProduct
}

function RecentShelfCard({ product }: RecentShelfCardProps) {
  const imageUrl = getAssetUrl(product.image)

  return (
    <Link
      className="group block overflow-hidden border border-white/10 bg-white text-[#181512] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]"
      to={`/products/${product.id}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#e4d8c8]">
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
      </div>
      <div className="p-2 sm:p-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#7a3f1d] sm:text-xs sm:tracking-[0.12em]">
          {product.categoryName}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-8 text-xs font-bold leading-snug sm:min-h-10 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-bold sm:mt-3 sm:text-lg">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}

export default RecentShelfCard
