import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile, AppSettings } from '../types'

interface AuthContextType {
  profile: UserProfile | null
  settings: AppSettings
  login: (username: string, password: string) => boolean
  register: (username: string, password: string) => boolean
  logout: () => void
  saveProfile: (profile: UserProfile) => void
  saveSettings: (settings: AppSettings) => void
  isAuthenticated: boolean
  loading: boolean
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null)

const DEFAULT_SETTINGS: AppSettings = {
  dailyGoalOverride: null,
  macroTargets: { carbs: 50, protein: 30, fat: 20 },
}

function getUsers() {
  try {
    const stored = localStorage.getItem('macrotrack_users')
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveUsers(users: { username: string; password: string }[]) {
  localStorage.setItem('macrotrack_users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('macrotrack_profile')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('macrotrack_settings')
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
    } catch { return DEFAULT_SETTINGS }
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('macrotrack_auth') === 'true'
  })

  function login(username: string, password: string): boolean {
    const users = getUsers()
    const found = users.find(
      (u: { username: string; password: string }) =>
        u.username === username && u.password === password
    )
    if (!found) return false
    localStorage.setItem('macrotrack_auth', 'true')
    localStorage.setItem('macrotrack_user', username)
    setIsAuthenticated(true)
    return true
  }

  function register(username: string, password: string): boolean {
    const users = getUsers()
    const exists = users.find(
      (u: { username: string; password: string }) => u.username === username
    )
    if (exists) return false
    saveUsers([...users, { username, password }])
    localStorage.setItem('macrotrack_auth', 'true')
    localStorage.setItem('macrotrack_user', username)
    setIsAuthenticated(true)
    return true
  }

  function logout() {
    localStorage.removeItem('macrotrack_auth')
    localStorage.removeItem('macrotrack_user')
    localStorage.removeItem('macrotrack_profile')
    localStorage.removeItem('macrotrack_settings')
    setIsAuthenticated(false)
    setProfile(null)
    setSettings(DEFAULT_SETTINGS)
  }

  function saveProfile(p: UserProfile) {
    localStorage.setItem('macrotrack_profile', JSON.stringify(p))
    setProfile(p)
  }

  function saveSettings(s: AppSettings) {
    localStorage.setItem('macrotrack_settings', JSON.stringify(s))
    setSettings(s)
  }

  return (
    <AuthContext.Provider value={{
      profile, settings, login, register, logout,
      saveProfile, saveSettings, isAuthenticated, loading: false
    }}>
      {children}
    </AuthContext.Provider>
  )
}