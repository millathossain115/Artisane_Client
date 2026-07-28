import {
  CircleHelp,
  CircleUserRound,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Star,
} from 'lucide-react'

export const userNavItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My orders', to: '/dashboard/orders', icon: ReceiptText },
  { label: 'Wishlist', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Reviews', to: '/dashboard/reviews', icon: Star },
  { label: 'Addresses', to: '/dashboard/addresses', icon: MapPin },
  { label: 'Profile', to: '/dashboard/profile', icon: CircleUserRound },
  {
    label: 'Security',
    to: '/dashboard/settings/security',
    icon: ShieldCheck,
  },
  { label: 'Support', to: '/dashboard/support', icon: CircleHelp },
  { label: 'Logout', action: 'logout' as const, icon: LogOut },
]
