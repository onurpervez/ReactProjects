import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import { useNavigate } from 'react-router-dom'
import { calculateTDEE } from '../utils/calculateTDEE'
import { calculateBMR } from '../utils/calculateBMR'
import { ui } from '../styles'
import ProfileEditModal from './ProfileEditModal'

export default function Navbar() {
  const { profile, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const bmr  = profile ? calculateBMR(profile)  : 0
  const tdee = profile ? calculateTDEE(profile) : 0

  return (
    <>
      <nav className={ui.navbar}>
        <span className={ui.navbarDate}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
        <div className={ui.navbarUser}>
          <div className="hidden sm:flex flex-col items-end gap-0.5 mr-2">
            <span className={ui.muted}>BMR: {bmr} kcal</span>
            <span className={ui.muted}>TDEE: {tdee} kcal</span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-sm flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
            title={isDark ? 'Açık mod' : 'Karanlık mod'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className={ui.avatar}
            title="Profili düzenle"
          >
            {profile?.username?.slice(0, 2).toUpperCase() ?? 'U'}
          </button>
          <span className="hidden sm:block text-xs text-gray-500 dark:text-zinc-400">
            {profile?.username}
          </span>
          <button onClick={handleLogout} className={ui.logoutBtn}>çıkış</button>
        </div>
      </nav>
      {showModal && <ProfileEditModal onClose={() => setShowModal(false)} />}
    </>
  )
}