import { ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { OrderItem } from '../../../features/orders/orderApi'
import {
  getOrderItemImage,
  getOrderItemName,
  getOrderItemUrl,
} from '../../../utils/orderDisplay'
import { formatPrice, getAssetUrl } from '../../../utils/productDisplay'

function MyOrderItemRow({ item }: { item: OrderItem }) {
  const imageUrl = getAssetUrl(getOrderItemImage(item))
  const productUrl = getOrderItemUrl(item)
  const name = getOrderItemName(item)
  const image = (
    <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
      {imageUrl ? (
        <img alt={name} className="h-full w-full object-cover" src={imageUrl} />
      ) : (
        <ImageOff className="h-5 w-5" />
      )}
    </span>
  )

  return (
    <div className="grid gap-3 border-t border-black/10 py-3 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div className="flex min-w-0 gap-3">
        {productUrl ? (
          <Link
            aria-label={`View ${name}`}
            className="shrink-0 transition hover:opacity-80"
            to={productUrl}
          >
            {image}
          </Link>
        ) : (
          image
        )}
        <div className="min-w-0">
          {productUrl ? (
            <Link
              className="line-clamp-2 font-bold text-[#181512] hover:underline"
              to={productUrl}
            >
              {name}
            </Link>
          ) : (
            <p className="line-clamp-2 font-bold text-[#181512]">{name}</p>
          )}
          <p className="mt-1 text-xs font-semibold text-[#6b5f53]">
            Quantity: {item.quantity ?? 1}
          </p>
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b5f53] sm:text-right">
        Item total
      </p>
      <p className="text-base font-bold text-[#7a3f1d] sm:min-w-24 sm:text-right">
        {formatPrice(item.subtotal ?? item.price ?? 0)}
      </p>
    </div>
  )
}

export default MyOrderItemRow
