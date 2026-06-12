import { useNavigate } from 'react-router-dom'

interface Props {
  onLogout: () => void
}

function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate()

  function handleLogout() {
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