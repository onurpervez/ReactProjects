import { ui } from '../styles'

export default function Navbar() {
  return (
    <nav className={ui.navbar}>
      <span className={ui.navbarDate}>
        {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </span>
      <div className={ui.navbarUser}>
        <div className={ui.avatar}>ON</div>
        <span className={ui.muted}>Onur</span>
      </div>
    </nav>
  )
}