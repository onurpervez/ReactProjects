import { ui } from '../styles'

export default function Sidebar() {
  return (
    <aside className={ui.sidebar}>
      <div className={ui.sidebarLogo}>
        Macro<span className="text-black">Track</span>
      </div>
      <div className={ui.navActive}>Dashboard</div>
      <div className={ui.navPassive}>Geçmiş</div>
      <div className={ui.navPassive}>Ayarlar</div>
    </aside>
  )
}