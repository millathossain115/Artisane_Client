import DashboardLayout from '../../../components/layout/DashboardLayout'
import { adminNavItems } from '../../dashboard/adminNavItems'
import ProductTable from './ProductTable'

function ManageProducts() {
  return (
    <DashboardLayout
      actions={[
        {
          label: 'Create product',
          to: '/dashboard/products/create',
          variant: 'primary',
        },
      ]}
      eyebrow="Product management"
      helperText="Review catalog products, prices, stock, and category assignments."
      sidebarItems={adminNavItems}
      subtitle="Review current marketplace products and inventory details."
      title="Manage products"
      workspaceLabel="Marketplace studio"
    >
      <ProductTable />
    </DashboardLayout>
  )
}

export default ManageProducts
