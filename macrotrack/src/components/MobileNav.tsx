import { useNavigate, useLocation } from 'react-router-dom'
import { ui } from '../styles'

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15.5 15"/>
    </svg>
  )
}

function IconSliders() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
      <circle cx="9" cy="6" r="2.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12" r="2.5" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="18" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export default function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: <IconGrid /> },
    { label: 'Geçmiş',    path: '/history',   icon: <IconClock /> },
    { label: 'Ayarlar',   path: '/settings',  icon: <IconSliders /> },
  ]

  return (
    <nav className={ui.mobileNav}>
      {links.map(l => (
        <button
          key={l.path}
          onClick={() => navigate(l.path)}
          className={location.pathname === l.path ? ui.mobileNavBtnActive : ui.mobileNavBtn}
        >
          {l.icon}
          <span>{l.label}</span>
        </button>
      ))}
    </nav>
  )
}
