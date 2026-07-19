import type { CartItem } from '../../features/cart/cartSlice'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'

type CheckoutSummaryProps = {
  cartItems: CartItem[]
  subtotal: number
}

function CheckoutSummary({ cartItems, subtotal }: CheckoutSummaryProps) {
  return (
    <aside className="border border-black/10 bg-[#181512] p-5 text-white lg:sticky lg:top-28">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
        Cart summary
      </p>
      <h2 className="mt-3 text-3xl font-bold">Your craft box</h2>

      <div className="mt-5 grid gap-4">
        {cartItems.length ? (
          cartItems.map((item) => {
            const imageUrl = getAssetUrl(item.image)

            return (
              <article
                className="grid grid-cols-[64px_1fr] gap-3 border-t border-white/10 pt-4"
                key={item.id}
              >
                <div className="h-16 overflow-hidden bg-white/10">
                  {imageUrl ? (
                    <img
                      alt={item.name}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-white/62">
                    Qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#f1c9a6]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </article>
            )
          })
        ) : (
          <div className="border-t border-white/10 pt-5 text-sm text-white/70">
            Cart empty. Add products before checkout.
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-3 text-sm font-bold">
          <span>Subtotal</span>
          <span className="text-2xl">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-white/62">
          Final total, stock, and order status are confirmed by server.
        </p>
      </div>
    </aside>
  )
}

export default CheckoutSummary
