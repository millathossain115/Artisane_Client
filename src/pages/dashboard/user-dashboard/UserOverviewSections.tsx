import {
  ArrowUpRight,
  CircleHelp,
  CircleUserRound,
  Heart,
  ImageOff,
  MapPin,
  ReceiptText,
  Star,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import type { Order } from '../../../features/orders/orderApi'
import {
  getWishlistProduct,
  useGetWishlistDashboardQuery,
} from '../../../features/wishlists/wishlistApi'
import {
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderItemImage,
  getOrderItemName,
  getOrderUrl,
} from '../../../utils/orderDisplay'
import {
  formatPrice,
  getAssetUrl,
  getProductImage,
} from '../../../utils/productDisplay'
import { formatCount } from '../dashboardFormat'
import {
  CurrentOrderSkeleton,
  WishlistPreviewSkeleton,
} from './UserDashboardSkeletons'

type UserOverviewSectionsProps = {
  isOrdersLoading?: boolean
  orders: Order[]
  stats: UserDashboardStats | null
}

const accountLinks = [
  {
    href: '/dashboard/orders',
    icon: ReceiptText,
    label: 'Orders',
  },
  {
    href: '/dashboard/wishlist',
    icon: Heart,
    label: 'Wishlist',
  },
  {
    href: '/dashboard/addresses',
    icon: MapPin,
    label: 'Addresses',
  },
  {
    href: '/dashboard/profile',
    icon: CircleUserRound,
    label: 'Profile',
  },
  {
    href: '/dashboard/reviews',
    icon: Star,
    label: 'Reviews',
  },
  {
    href: '/dashboard/support',
    icon: CircleHelp,
    label: 'Support',
  },
]

function getCurrentOrder(orders: Order[]) {
  return (
    orders.find((order) =>
      ['pending', 'confirmed', 'processing', 'shipped'].includes(
        order.orderStatus ?? '',
      ),
    ) ?? orders[0]
  )
}

function UserOverviewSections({
  isOrdersLoading = false,
  orders,
  stats,
}: UserOverviewSectionsProps) {
  const currentOrder = getCurrentOrder(orders)
  const {
    data: wishlistList,
    isError: hasWishlistError,
    isLoading: isWishlistLoading,
  } = useGetWishlistDashboardQuery({ limit: 2 })
  const wishlistItems = wishlistList?.data ?? stats?.recentWishlistItems ?? []
  const totalWishlistItems =
    wishlistList?.meta.total ??
    stats?.totalWishlistItems ??
    wishlistItems.length

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <section className="border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Current order</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Latest order status at a glance.
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
              <Truck className="h-5 w-5" />
            </span>
          </div>

          {isOrdersLoading ? (
            <CurrentOrderSkeleton />
          ) : currentOrder ? (
            <div className="mt-5 grid gap-5 border-t border-black/10 pt-5 md:grid-cols-[76px_1fr_auto] md:items-center">
              <Link
                className="grid h-20 w-20 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d] transition hover:opacity-80"
                to={getOrderUrl(currentOrder)}
              >
                {getAssetUrl(getOrderItemImage(currentOrder.items?.[0])) ? (
                  <img
                    alt={getOrderItemName(currentOrder.items?.[0])}
                    className="h-full w-full object-cover"
                    src={getAssetUrl(
                      getOrderItemImage(currentOrder.items?.[0]),
                    )}
                  />
                ) : (
                  <ReceiptText className="h-6 w-6" />
                )}
              </Link>
              <div>
                <Link
                  className="text-lg font-bold text-[#7a3f1d] hover:underline"
                  to={getOrderUrl(currentOrder)}
                >
                  {formatOrderId(currentOrder._id)}
                </Link>
                <p className="mt-1 font-bold">
                  {getOrderItemName(currentOrder.items?.[0])}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                    {formatOrderStatus(currentOrder.orderStatus)}
                  </span>
                  <span className="text-xs font-semibold text-[#6b5f53]">
                    Placed {formatOrderDate(currentOrder.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Link
                  className="inline-flex min-h-10 items-center justify-center bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d]"
                  to={getOrderUrl(currentOrder)}
                >
                  Track order
                </Link>
                <Link
                  className="inline-flex min-h-10 items-center justify-center border border-black/10 px-4 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                  to="/dashboard/orders"
                >
                  All orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-4 border-t border-black/10 pt-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <ReceiptText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">No orders yet</p>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  Your latest order will appear here after checkout.
                </p>
                <Link
                  className="mt-4 inline-flex min-h-10 items-center justify-center bg-[#181512] px-4 text-xs font-bold text-white transition hover:bg-[#7a3f1d]"
                  to="/products"
                >
                  Start shopping
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Saved products</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                {formatCount(totalWishlistItems)} item(s) in wishlist.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              to="/dashboard/wishlist"
            >
              Wishlist
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {isWishlistLoading ? (
              <WishlistPreviewSkeleton />
            ) : wishlistItems.length ? (
              wishlistItems.slice(0, 2).map((item) => {
                const product = getWishlistProduct(item)
                const imageUrl = getProductImage(product)

                return (
                  <Link
                    className="grid grid-cols-[64px_1fr] gap-3 border border-black/10 p-3 transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                    key={item._id}
                    to={
                      product
                        ? `/products/${product._id}`
                        : '/dashboard/wishlist'
                    }
                  >
                    <span className="grid h-16 w-16 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]">
                      {imageUrl ? (
                        <img
                          alt={product?.name ?? 'Wishlist product'}
                          className="h-full w-full object-cover"
                          src={imageUrl}
                        />
                      ) : (
                        <ImageOff className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-bold">
                        {product?.name ?? 'Product unavailable'}
                      </span>
                      <span className="mt-2 block text-sm font-bold text-[#7a3f1d]">
                        {formatPrice(product?.price ?? 0)}
                      </span>
                    </span>
                  </Link>
                )
              })
            ) : (
              <div className="flex gap-4 border border-black/10 p-4 sm:col-span-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Heart className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">No saved products</p>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    Save products from the shop to revisit them here.
                  </p>
                </div>
              </div>
            )}
          </div>

          {hasWishlistError ? (
            <p className="mt-4 border-t border-[#c85f2f]/30 pt-3 text-sm font-bold text-[#8f3f1d]">
              Wishlist preview unavailable.
            </p>
          ) : null}
        </section>
      </div>

      <aside className="border border-black/10 bg-[#181512] p-5 text-white">
        <h2 className="text-2xl font-bold">Account shortcuts</h2>
        <p className="mt-1 text-sm text-white/65">
          Standard account pages in one place.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {accountLinks.map((link) => {
            const Icon = link.icon

            return (
              <Link
                className="flex min-h-12 items-center justify-between gap-2 border border-white/10 px-3 text-sm font-bold transition hover:border-[#f1c9a6] hover:bg-white/10"
                key={link.href}
                to={link.href}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#f1c9a6]" />
                  {link.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#f1c9a6]" />
              </Link>
            )
          })}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm leading-6 text-white/72">
            Use this page for quick checks. Orders, wishlist, addresses, and
            profile pages hold the full details.
          </p>
        </div>
      </aside>
    </section>
  )
}

export default UserOverviewSections
