import { useNavigate, useLocation } from 'react-router-dom'
import { ui } from '../styles'

export default function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Geçmiş',    path: '/history',   icon: '📈' },
    { label: 'Ayarlar',   path: '/settings',  icon: '⚙️' },
  ]

  return (
    <nav className={ui.mobileNav}>
      {links.map(l => (
        <button
          key={l.path}
          onClick={() => navigate(l.path)}
          className={location.pathname === l.path ? ui.mobileNavBtnActive : ui.mobileNavBtn}
        >
          <span className="text-lg">{l.icon}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </nav>
  )
}