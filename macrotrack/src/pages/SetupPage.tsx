import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { UserProfile } from '../types'
import { ui } from '../styles'

const activityOptions: { value: UserProfile['activity']; label: string }[] = [
  { value: 'sedentary',   label: 'Hareketsiz (masa başı)' },
  { value: 'light',       label: 'Az hareketli (haftada 1-2 gün)' },
  { value: 'moderate',    label: 'Orta hareketli (haftada 3-5 gün)' },
  { value: 'active',      label: 'Aktif (haftada 6-7 gün)' },
  { value: 'very_active', label: 'Çok aktif (günde 2 antrenman)' },
]

export default function SetupPage() {
  const { saveProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const storedUser = localStorage.getItem('macrotrack_user') ?? ''

  const [height,   setHeight]   = useState('')
  const [weight,   setWeight]   = useState('')
  const [age,      setAge]      = useState('')
  const [gender,   setGender]   = useState<UserProfile['gender']>('male')
  const [activity, setActivity] = useState<UserProfile['activity']>('moderate')
  const [error,    setError]    = useState('')

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  function handleSave() {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const a = parseInt(age)

    if (!h || !w || !a || h < 100 || h > 250 || w < 30 || w > 300 || a < 10 || a > 100) {
      setError('Lütfen geçerli değerler gir')
      return
    }

    saveProfile({ username: storedUser, height: h, weight: w, age: a, gender, activity })
    navigate('/dashboard')
  }

  return (
    <div className={ui.pageCentered}>
      <div className={ui.cardMd}>

        <div className="text-center mb-2">
          <h1 className={ui.logoText}>Profilini oluştur</h1>
          <p className={ui.mutedCenter}>Kalori hedefini hesaplayalım</p>
        </div>

        <div className={ui.grid2}>
          <div className={ui.formGroup}>
            <label className={ui.label}>Boy (cm)</label>
            <input
              type="number"
              placeholder="175"
              value={height}
              onChange={e => { setHeight(e.target.value); setError('') }}
              className={ui.input}
            />
          </div>
          <div className={ui.formGroup}>
            <label className={ui.label}>Kilo (kg)</label>
            <input
              type="number"
              placeholder="75"
              value={weight}
              onChange={e => { setWeight(e.target.value); setError('') }}
              className={ui.input}
            />
          </div>
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Yaş</label>
          <input
            type="number"
            placeholder="25"
            value={age}
            onChange={e => { setAge(e.target.value); setError('') }}
            className={ui.input}
          />
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Cinsiyet</label>
          <div className={ui.grid2}>
            {(['male', 'female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={gender === g ? ui.btnOutlineActive : ui.btnOutline}
              >
                {g === 'male' ? 'Erkek' : 'Kadın'}
              </button>
            ))}
          </div>
        </div>

        <div className={ui.formGroup}>
          <label className={ui.label}>Aktivite seviyesi</label>
          <select
            value={activity}
            onChange={e => setActivity(e.target.value as UserProfile['activity'])}
            className={ui.input}
          >
            {activityOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {error && <p className={ui.error}>{error}</p>}

        <button onClick={handleSave} className={ui.btnFull}>
          Kaydet ve başla
        </button>

      </div>
    </div>
  )
}