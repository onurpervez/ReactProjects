import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ui } from '../styles'

type Tab = 'login' | 'register'

export default function LoginPage() {
  const { login, register, isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()

  const [tab,      setTab]      = useState<Tab>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (isAuthenticated && profile)  navigate('/dashboard')
    if (isAuthenticated && !profile) navigate('/setup')
  }, [isAuthenticated, profile, navigate])

  function clearForm() {
    setUsername(''); setPassword(''); setConfirm(''); setError('')
  }

  function handleTab(t: Tab) { setTab(t); clearForm() }

  function handleLogin() {
    if (!username || !password) { setError('Alanlar boş olamaz'); return }
    setLoading(true)
    const success = login(username, password)
    setLoading(false)
    if (!success) setError('Kullanıcı adı veya şifre hatalı')
  }

  function handleRegister() {
    if (!username || !password)   { setError('Alanlar boş olamaz'); return }
    if (password !== confirm)     { setError('Şifreler eşleşmiyor'); return }
    if (password.length < 4)      { setError('Şifre en az 4 karakter olmalı'); return }
    setLoading(true)
    const success = register(username, password)
    setLoading(false)
    if (!success) { setError('Bu kullanıcı adı zaten alınmış'); return }
    navigate('/setup')
  }

  return (
    <div className={ui.pageCentered}>
      <div className={ui.cardSm}>
        <div className="text-center mb-2">
          <h1 className={ui.logoText}>Macro<span className="text-blue-500">Track</span></h1>
        </div>

        <div className={ui.grid2}>
          <button onClick={() => handleTab('login')}
            className={tab === 'login' ? ui.btnOutlineActive : ui.btnOutline}>
            Giriş yap
          </button>
          <button onClick={() => handleTab('register')}
            className={tab === 'register' ? ui.btnOutlineActive : ui.btnOutline}>
            Kayıt ol
          </button>
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Kullanıcı adı</label>
          <input type="text" placeholder="onur" value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            className={ui.input} />
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Şifre</label>
          <input type="password" placeholder="••••" value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
            className={ui.input} />
        </div>

        {tab === 'register' && (
          <div className={ui.formGroup}>
            <label className={ui.label}>Şifre tekrar</label>
            <input type="password" placeholder="••••" value={confirm}
              onChange={e => { setConfirm(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
              className={ui.input} />
          </div>
        )}

        {error && <p className={ui.error}>{error}</p>}

        <button
          onClick={tab === 'login' ? handleLogin : handleRegister}
          className={ui.btnFull}
          disabled={loading}
        >
          {loading ? 'Bekle...' : tab === 'login' ? 'Giriş yap' : 'Kayıt ol'}
        </button>

        {tab === 'login' && (
          <p className={ui.mutedCenter}>
            Hesabın yoksa kayıt ol
          </p>
        )}
      </div>
    </div>
  )
}