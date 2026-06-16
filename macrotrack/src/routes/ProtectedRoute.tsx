import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const isAuth    = localStorage.getItem('macrotrack_auth') === 'true'
  const hasProfile = localStorage.getItem('macrotrack_profile') !== null

  if (!isAuth) return <Navigate to="/login" replace />
  if (!hasProfile) return <Navigate to="/setup" replace />

  return <>{children}</>
}