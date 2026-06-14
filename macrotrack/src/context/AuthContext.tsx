import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile, AppSettings } from '../types'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  profile: UserProfile | null
  settings: AppSettings
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string, username: string) => Promise<string | null>
  logout: () => Promise<void>
  saveProfile: (profile: UserProfile) => Promise<void>
  saveSettings: (settings: AppSettings) => void
  isAuthenticated: boolean
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

const DEFAULT_SETTINGS: AppSettings = {
  dailyGoalOverride: null,
  macroTargets: { carbs: 50, protein: 30, fat: 20 },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
   const [loading, setLoading] = useState(true)

  useEffect(() => {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session?.user) {
      setIsAuthenticated(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setProfile({
          username: data.username,
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          activity: data.activity,
        })
      }
    }
    setLoading(false)
  })
}, [])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session?.user) {
      setIsAuthenticated(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setProfile({
          username: data.username,
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          activity: data.activity,
        })
      }
    }
    setLoading(false)
  })
}, [])

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile({
        username: data.username,
        height: data.height,
        weight: data.weight,
        age: data.age,
        gender: data.gender,
        activity: data.activity,
      })
    }
  }

  async function login(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    return null
  }

  async function register(email: string, password: string, username: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return error.message
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
      })
    }
    return null
  }

  async function logout() {
    await supabase.auth.signOut()
    setProfile(null)
    setIsAuthenticated(false)
    setSettings(DEFAULT_SETTINGS)
  }

  async function saveProfile(p: UserProfile) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').upsert({
      id: user.id,
      username: p.username,
      height: p.height,
      weight: p.weight,
      age: p.age,
      gender: p.gender,
      activity: p.activity,
    })

    setProfile(p)
  }

  function saveSettings(s: AppSettings) {
    localStorage.setItem('macrotrack_settings', JSON.stringify(s))
    setSettings(s)
  }

  if (!initialized) {
  return <div className="flex h-screen items-center justify-center text-sm text-gray-400">Yükleniyor...</div>
}

  return (
    <AuthContext.Provider value={{
      profile, settings, login, register, logout,
      saveProfile, saveSettings, isAuthenticated, loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}