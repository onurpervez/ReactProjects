import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hoş geldin! Giriş başarılı.</p>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  )
}

export default Dashboard