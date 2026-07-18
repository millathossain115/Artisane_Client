import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getAccessToken } from '../../features/auth/authApi'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const accessToken = getAccessToken()

  if (!accessToken) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export default ProtectedRoute
