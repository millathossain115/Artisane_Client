import DashboardLayout from '../../../components/layout/DashboardLayout'
import { getStoredUser, isAdminRole } from '../../../features/auth/authApi'
import { adminNavItems } from '../../admin/adminNavItems'
import ChangePasswordPanel from '../profile-page/ChangePasswordPanel'
import { userNavItems } from '../user-dashboard/userNavItems'

function SecuritySettingsPage() {
  const storedUser = getStoredUser()
  const isAdminProfile = isAdminRole(storedUser?.role)

  return (
    <DashboardLayout
      actions={[
        isAdminProfile
          ? { label: 'Back to dashboard', to: '/dashboard' }
          : { label: 'Back to profile', to: '/dashboard/profile' },
      ]}
      eyebrow="Account settings"
      helperText="Keep your password private and update it if you suspect account access risk."
      layoutVariant={isAdminProfile ? 'admin' : 'customer'}
      sidebarItems={isAdminProfile ? adminNavItems : userNavItems}
      subtitle="Manage password and account security for your Artisane profile."
      title="Security"
      workspaceLabel={
        isAdminProfile ? 'Marketplace studio' : 'Collector account'
      }
    >
      <div className="w-full">
        <ChangePasswordPanel />
      </div>
    </DashboardLayout>
  )
}

export default SecuritySettingsPage
