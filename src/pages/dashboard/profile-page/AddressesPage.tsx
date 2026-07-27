import { Navigate } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { getStoredUser, isAdminRole } from '../../../features/auth/authApi'
import { userNavItems } from '../user-dashboard/userNavItems'
import ProfileAddressSection from './ProfileAddressSection'

function AddressesPage() {
  const storedUser = getStoredUser()

  if (isAdminRole(storedUser?.role)) {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Back to profile', to: '/dashboard/profile' }]}
      eyebrow="Saved addresses"
      helperText="Keep delivery addresses updated before placing an order."
      layoutVariant="customer"
      sidebarItems={userNavItems}
      subtitle="Manage saved shipping addresses for faster checkout."
      title="Address book"
      workspaceLabel="Collector account"
    >
      <ProfileAddressSection
        fieldClass="min-h-12 border border-black/10 bg-white px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
        isAdminProfile={false}
      />
    </DashboardLayout>
  )
}

export default AddressesPage
