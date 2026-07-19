import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '../../features/products/productApi'
import {
  formatPrice,
  getAssetUrl,
  getProductCategoryName,
} from '../../utils/productDisplay'

type ProductShelfCardProps = {
  product: Product
}

function ProductShelfCard({ product }: ProductShelfCardProps) {
  const imageUrl = getAssetUrl(product.images?.[0])

  return (
    <Link
      className="group block overflow-hidden border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(24,21,18,0.12)]"
      to={`/products/${product._id}`}
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
          {getProductCategoryName(product)}
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

export default ProductShelfCard
