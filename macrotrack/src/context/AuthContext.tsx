import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile } from '../types'

interface AuthContextType {
  profile: UserProfile | null
  login: (username: string, password: string) => boolean
  logout: () => void
  saveProfile: (profile: UserProfile) => void
  isAuthenticated: boolean
}


export const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USERS = [
  { username: 'onur', password: '1234' },
  { username: 'misafir', password: '1234' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('macrotrack_profile')
    return stored ? JSON.parse(stored) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('macrotrack_auth') === 'true'
  })

  function login(username: string, password: string): boolean {
    const found = MOCK_USERS.find(
      u => u.username === username && u.password === password
    )
    if (!found) return false
    localStorage.setItem('macrotrack_auth', 'true')
    localStorage.setItem('macrotrack_user', username)
    setIsAuthenticated(true)
    return true
  }

  function logout() {
    localStorage.removeItem('macrotrack_auth')
    localStorage.removeItem('macrotrack_user')
    localStorage.removeItem('macrotrack_profile')
    setIsAuthenticated(false)
    setProfile(null)
  }

  function saveProfile(p: UserProfile) {
    localStorage.setItem('macrotrack_profile', JSON.stringify(p))
    setProfile(p)
  }

  return (
    <AuthContext.Provider value={{ profile, login, logout, saveProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}