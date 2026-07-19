import { useState } from 'react'
import { Heart, ImageOff, ShieldCheck, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import {
  getWishlistProduct,
  useDeleteWishlistItemMutation,
  useGetWishlistDashboardQuery,
} from '../../../features/wishlists/wishlistApi'
import { formatPrice, getProductImage } from '../../../utils/productDisplay'
import { formatCount } from '../dashboardFormat'

type UserWishlistReviewsSectionProps = {
  stats: UserDashboardStats | null
}

function UserWishlistReviewsSection({
  stats,
}: UserWishlistReviewsSectionProps) {
  const [removingId, setRemovingId] = useState('')
  const {
    data: wishlistList,
    isError: hasWishlistError,
    isLoading: isWishlistLoading,
  } = useGetWishlistDashboardQuery({ limit: 4 })
  const [deleteWishlistItem] = useDeleteWishlistItemMutation()
  const wishlistItems = wishlistList?.data ?? stats?.recentWishlistItems ?? []
  const totalWishlistItems =
    wishlistList?.meta.total ??
    stats?.totalWishlistItems ??
    wishlistItems.length

  async function handleRemoveWishlistItem(id: string) {
    setRemovingId(id)

    try {
      await deleteWishlistItem(id).unwrap()
    } finally {
      setRemovingId('')
    }
  }

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="border border-black/10 bg-white p-5" id="wishlist">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Wishlist</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {formatCount(totalWishlistItems)} saved products.
            </p>
          </div>
          <Link
            className="shrink-0 border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-[#181512]"
            to="/dashboard/wishlist"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {isWishlistLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-16 animate-pulse border-t border-black/10 bg-[#f8f3ea]"
                key={index}
              />
            ))
          ) : wishlistItems.length ? (
            wishlistItems.map((item) => {
              const product = getWishlistProduct(item)
              const imageUrl = getProductImage(product)

              return (
                <div
                  className="grid grid-cols-[52px_1fr_auto] items-center gap-3 border-t border-black/10 pt-3 text-sm"
                  key={item._id}
                >
                  <Link
                    className="grid h-14 w-14 place-items-center overflow-hidden bg-[#f8f3ea] text-[#7a3f1d]"
                    to={product ? `/products/${product._id}` : '#wishlist'}
                  >
                    {imageUrl ? (
                      <img
                        alt={product?.name ?? 'Wishlist product'}
                        className="h-full w-full object-cover"
                        src={imageUrl}
                      />
                    ) : (
                      <ImageOff className="h-5 w-5" />
                    )}
                  </Link>
                  <div className="min-w-0">
                    {product ? (
                      <Link
                        className="line-clamp-1 font-bold transition hover:text-[#7a3f1d]"
                        to={`/products/${product._id}`}
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <p className="font-bold">Product unavailable</p>
                    )}
                    <p className="mt-1 truncate text-[#6b5f53]">
                      {product?.brand ?? 'Artisane Studio'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#7a3f1d]">
                      {formatPrice(product?.price ?? 0)}
                    </span>
                    <button
                      aria-label={`Remove ${product?.name ?? 'product'} from wishlist`}
                      className="grid h-9 w-9 place-items-center border border-black/10 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={removingId === item._id}
                      onClick={() => handleRemoveWishlistItem(item._id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex gap-4 border-t border-black/10 pt-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">No wishlist items yet</p>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  Save products from the shop to see them here.
                </p>
              </div>
            </div>
          )}

          {hasWishlistError ? (
            <p className="border-t border-[#c85f2f]/30 pt-3 text-sm font-bold text-[#8f3f1d]">
              Failed to load wishlist.
            </p>
          ) : null}
        </div>
      </div>

      <div className="border border-black/10 bg-white p-5" id="reviews">
        <h2 className="text-2xl font-bold">Recent reviews</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Feedback you shared after recent purchases.
        </p>
        <div className="mt-5 space-y-4">
          {stats?.recentReviews.length ? (
            stats.recentReviews.map((review) => (
              <div className="flex gap-4" key={review._id}>
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">
                    {review.product?.name ?? 'Product review'}
                  </p>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    {formatCount(review.rating)} stars
                    {review.comment ? ` - ${review.comment}` : ''}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">No reviews yet</p>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  Your product feedback will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserWishlistReviewsSection
