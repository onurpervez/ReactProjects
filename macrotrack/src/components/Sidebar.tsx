import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ui } from '../styles'

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500 flex-shrink-0">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15.5 15"/>
    </svg>
  )
}

function IconSliders() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
      <circle cx="9" cy="6" r="2.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12" r="2.5" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="18" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export default function Sidebar() {
  const { profile } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: <IconGrid /> },
    { label: 'Geçmiş',    path: '/history',   icon: <IconClock /> },
    { label: 'Ayarlar',   path: '/settings',  icon: <IconSliders /> },
  ]

  return (
    <aside className={ui.sidebar}>
      <div className={ui.sidebarLogo}>
        <div className="flex items-center gap-1.5">
          <BoltIcon />
          <span>Macro</span>
          <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">Track</span>
        </div>
      </div>
      {links.map(l => (
        <button
          key={l.path}
          onClick={() => navigate(l.path)}
          className={location.pathname === l.path ? ui.navActive : ui.navPassive}
        >
          {l.icon}
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
