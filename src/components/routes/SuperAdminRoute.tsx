import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import {
  getAccessToken,
  getStoredUser,
  isSuperAdminRole,
} from '../../features/auth/authApi'

type SuperAdminRouteProps = {
  children: ReactNode
}

function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const accessToken = getAccessToken()
  const user = getStoredUser()

  if (!accessToken) {
    return <Navigate replace to="/login" />
  }

  if (!isSuperAdminRole(user?.role)) {
    return <Navigate replace to="/dashboard" />
  }

  return children
}

export default SuperAdminRoute
