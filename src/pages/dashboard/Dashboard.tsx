import { Navigate } from 'react-router-dom'

import { getStoredUser } from '../../features/auth/authApi'
import AdminDashboard from './admin-dashboard/AdminDashboard'

function Dashboard() {
  const user = getStoredUser()

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  return <Navigate replace to="/dashboard/orders" />
}

export default Dashboard
