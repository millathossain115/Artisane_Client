import {
  CircleUserRound,
  Heart,
  HelpCircle,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Star,
} from 'lucide-react'

export const userNavItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My orders', to: '/dashboard/orders', icon: ReceiptText },
  { label: 'Wishlist', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Profile', to: '/dashboard/profile', icon: CircleUserRound },
  { label: 'Reviews', to: '/dashboard/reviews', icon: Star },
  { label: 'Support', to: '#support', icon: HelpCircle },
  { label: 'Settings', to: '#settings', icon: Settings },
]
