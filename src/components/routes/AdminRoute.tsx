import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getAccessToken, getStoredUser } from '../../features/auth/authApi'

type AdminRouteProps = {
  children: ReactNode
}

function AdminRoute({ children }: AdminRouteProps) {
  const accessToken = getAccessToken()
  const user = getStoredUser()

  if (!accessToken) {
    return <Navigate replace to="/login" />
  }

  if (user?.role !== 'admin') {
    return <Navigate replace to="/dashboard" />
  }

  return children
}

export default AdminRoute
