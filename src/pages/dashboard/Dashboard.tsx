import { getStoredUser } from '../../features/auth/authApi'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import UserDashboard from './user-dashboard/UserDashboard'

function Dashboard() {
  const user = getStoredUser()

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

export default Dashboard
