import { getStoredUser, isAdminRole } from '../../features/auth/authApi'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import UserDashboard from './user-dashboard/UserDashboard'

function Dashboard() {
  const user = getStoredUser()

  if (isAdminRole(user?.role)) {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

export default Dashboard
