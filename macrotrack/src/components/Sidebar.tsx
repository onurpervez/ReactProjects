import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ui } from '../styles'

export default function Sidebar() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Geçmiş',    path: '/history' },
    { label: 'Ayarlar',   path: '/settings' },
  ]

  return (
    <aside className={ui.sidebar}>
      <div className={ui.sidebarLogo}>
        Macro<span className="text-blue-500">Track</span>
      </div>

      {links.map(l => (
        <button
          key={l.path}
          onClick={() => navigate(l.path)}
          className={location.pathname === l.path ? ui.navActive : ui.navPassive}
        >
          {l.label}
        </button>
      ))}

      {profile && (
        <div className={ui.profileBox}>
          <span className={ui.profileName}>{profile.username}</span>
          <span className={ui.profileStat}>{profile.weight}kg · {profile.height}cm</span>
          <span className={ui.profileStat}>{profile.age} yaş</span>
        </div>
      )}
    </aside>
  )
}