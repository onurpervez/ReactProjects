import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { calculateTDEE } from '../utils/calculateTDEE'
import { calculateBMR } from '../utils/calculateBMR'
import { ui } from '../styles'
import ProfileEditModal from './ProfileEditModal'

export default function Navbar() {
  const { profile, logout } = useAuth()
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
          <div className="flex flex-col items-end gap-0.5 mr-2">
            <span className={ui.muted}>BMR: {bmr} kcal</span>
            <span className={ui.muted}>TDEE: {tdee} kcal</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={ui.avatar}
            title="Profili düzenle"
          >
            {profile?.username?.slice(0, 2).toUpperCase() ?? 'U'}
          </button>
          <span className={ui.muted}>{profile?.username}</span>
          <button onClick={handleLogout} className={ui.logoutBtn}>çıkış</button>
        </div>
      </nav>

      {showModal && <ProfileEditModal onClose={() => setShowModal(false)} />}
    </>
  )
}