import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ui } from '../styles'

export default function LoginPage() {
  const { login, isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  useEffect(() => {
    if (isAuthenticated && profile)  navigate('/dashboard')
    if (isAuthenticated && !profile) navigate('/setup')
  }, [isAuthenticated, profile, navigate])

  function handleLogin() {
    if (!username || !password) {
      setError('Kullanıcı adı ve şifre boş olamaz')
      return
    }
    const success = login(username, password)
    if (!success) {
      setError('Kullanıcı adı veya şifre hatalı')
      return
    }
    navigate('/setup')
  }

  return (
    <div className={ui.pageCentered}>
      <div className={ui.cardSm}>

        <div className="text-center mb-2">
          <h1 className={ui.logoText}>
            Macro<span className="text-blue-500">Track</span>
          </h1>
          <p className={ui.mutedCenter}>Devam etmek için giriş yap</p>
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Kullanıcı adı</label>
          <input
            type="text"
            placeholder="onur"
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            className={ui.input}
          />
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Şifre</label>
          <input
            type="password"
            placeholder="••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={ui.input}
          />
        </div>

        {error && <p className={ui.error}>{error}</p>}

        <button onClick={handleLogin} className={ui.btnFull}>
          Giriş yap
        </button>

        <p className={ui.mutedCenter}>
          Test hesabı: <span className="text-black">onur / 1234</span>
        </p>

      </div>
    </div>
  )
}