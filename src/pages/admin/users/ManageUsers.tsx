import DashboardLayout from '../../../components/layout/DashboardLayout'
import { adminNavItems } from '../adminNavItems'
import UserTable from './UserTable'

function ManageUsers() {
  return (
    <DashboardLayout
      eyebrow="User management"
      helperText="Review customer and admin accounts with filters for role, status, city, and contact completeness."
      sidebarItems={adminNavItems}
      subtitle="Track account health, search user records, and review admin/customer access."
      title="Manage users"
      workspaceLabel="Marketplace studio"
    >
      <UserTable />
    </DashboardLayout>
  )
}

export default ManageUsers
