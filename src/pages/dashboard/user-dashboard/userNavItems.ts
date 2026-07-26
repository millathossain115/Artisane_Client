import {
  CircleUserRound,
  Heart,
  ReceiptText,
  Star,
} from 'lucide-react'

export const userNavItems = [
  { label: 'My orders', to: '/dashboard/orders', icon: ReceiptText },
  { label: 'Wishlist', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Profile', to: '/dashboard/profile', icon: CircleUserRound },
  { label: 'Reviews', to: '/dashboard/reviews', icon: Star },
]
