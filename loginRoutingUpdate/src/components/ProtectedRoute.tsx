import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

function ProtectedRoute({ children }: Props) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />
}

export default ProtectedRoute
