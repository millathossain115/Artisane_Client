import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Order } from '../../../../features/orders/orderApi'
import { formatPrice, getAssetUrl } from '../../../../utils/productDisplay'
import {
  getOrderItemImage,
  getOrderItemName,
  getOrderItemUrl,
} from '../../../../utils/orderDisplay'

type OrderItemsSectionProps = {
  order: Order
}

function OrderItemsSection({ order }: OrderItemsSectionProps) {
  return (
    <section className="mt-5 border border-black/10 bg-[#fdfaf5]">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center bg-[#181512] text-white">
            <ShoppingBag className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            Order items
          </p>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b5f53]">
          Manifest
        </span>
      </div>

      <div className="grid gap-2 p-3">
        {(order.items ?? []).map((item, index) => {
          const imageUrl = getAssetUrl(getOrderItemImage(item))
          const productUrl = getOrderItemUrl(item)

          return (
            <article
              className="grid grid-cols-[56px_1fr_auto] gap-3 border border-black/10 bg-white p-2.5 text-sm"
              key={item._id ?? index}
            >
              {productUrl ? (
                <Link
                  className="h-14 overflow-hidden bg-[#f8f3ea] transition hover:opacity-80"
                  to={productUrl}
                >
                  {imageUrl ? (
                    <img
                      alt={getOrderItemName(item)}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </Link>
              ) : (
                <div className="h-14 overflow-hidden bg-[#f8f3ea]">
                  {imageUrl ? (
                    <img
                      alt={getOrderItemName(item)}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
              )}
              <div>
                {productUrl ? (
                  <Link className="font-bold hover:underline" to={productUrl}>
                    {getOrderItemName(item)}
                  </Link>
                ) : (
                  <p className="font-bold">{getOrderItemName(item)}</p>
                )}
                <p className="mt-1 text-[#6b5f53]">
                  Qty {item.quantity ?? 1}
                </p>
              </div>
              <p className="font-bold">{formatPrice(item.subtotal ?? 0)}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OrderItemsSection
