import DashboardLayout from '../../../components/layout/DashboardLayout'
import { adminNavItems } from '../adminNavItems'
import CategoryTable from './CategoryTable'

function ManageCategories() {
  return (
    <DashboardLayout
      actions={[
        {
          label: 'Create category',
          to: '/dashboard/categories/create',
          variant: 'primary',
        },
      ]}
      eyebrow="Category management"
      helperText="Review category status, images, and naming before assigning products."
      sidebarItems={adminNavItems}
      subtitle="Review, update, hide, and delete marketplace categories."
      title="Manage categories"
      workspaceLabel="Marketplace studio"
    >
      <CategoryTable />
    </DashboardLayout>
  )
}

export default ManageCategories
