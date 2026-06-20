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
    const auth = localStorage.getItem('macrotrack_auth')
    if (auth !== 'true') return null
    const stored = localStorage.getItem('macrotrack_profile')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
})

  const [settings, setSettings] = useState<AppSettings>(() => {
  try {
    const username = localStorage.getItem('macrotrack_user') ?? ''
    const stored = localStorage.getItem(`macrotrack_settings_${username}`)
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
  console.log('login sonrası auth:', localStorage.getItem('macrotrack_auth'))
  
  setIsAuthenticated(true)

  // kullanıcıya özel profili yükle
  const stored = localStorage.getItem(`macrotrack_profile_${username}`)
  if (stored) {
    setProfile(JSON.parse(stored))
    localStorage.setItem('macrotrack_profile', stored)
  } else {
    setProfile(null)
    localStorage.removeItem('macrotrack_profile')
  }

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
  localStorage.removeItem('macrotrack_profile')
  setIsAuthenticated(true)
  setProfile(null)
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
  // hem genel hem kullanıcıya özel kaydet
  localStorage.setItem('macrotrack_profile', JSON.stringify(p))
  localStorage.setItem(`macrotrack_profile_${p.username}`, JSON.stringify(p))
  setProfile(p)
}

  function saveSettings(s: AppSettings) {
  const username = localStorage.getItem('macrotrack_user') ?? ''
  localStorage.setItem(`macrotrack_settings_${username}`, JSON.stringify(s))
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