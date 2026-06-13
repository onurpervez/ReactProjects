import { useState } from 'react'
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

interface Props {
  onClose: () => void
}

export default function ProfileEditModal({ onClose }: Props) {
  const { profile, saveProfile } = useAuth()

  const [height,   setHeight]   = useState(String(profile?.height   ?? ''))
  const [weight,   setWeight]   = useState(String(profile?.weight   ?? ''))
  const [age,      setAge]      = useState(String(profile?.age      ?? ''))
  const [gender,   setGender]   = useState<UserProfile['gender']>(profile?.gender     ?? 'male')
  const [activity, setActivity] = useState<UserProfile['activity']>(profile?.activity ?? 'moderate')
  const [error,    setError]    = useState('')

  function handleSave() {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const a = parseInt(age)

    if (!h || !w || !a || h < 100 || h > 250 || w < 30 || w > 300 || a < 10 || a > 100) {
      setError('Lütfen geçerli değerler gir')
      return
    }

    saveProfile({
      username: profile!.username,
      height: h,
      weight: w,
      age: a,
      gender,
      activity,
    })

    onClose()
  }

  return (
    <div className={ui.modalOverlay} onClick={onClose}>
      <div className={ui.modalCard} onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-center">
          <h2 className={ui.cardTitle}>Profili düzenle</h2>
          <button onClick={onClose} className={ui.logoutBtn}>✕</button>
        </div>

        <div className={ui.grid2}>
          <div className={ui.formGroup}>
            <label className={ui.label}>Boy (cm)</label>
            <input
              type="number"
              value={height}
              onChange={e => { setHeight(e.target.value); setError('') }}
              className={ui.input}
            />
          </div>
          <div className={ui.formGroup}>
            <label className={ui.label}>Kilo (kg)</label>
            <input
              type="number"
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

        <div className={ui.grid2}>
          <button onClick={onClose}    className={ui.btnOutline}>İptal</button>
          <button onClick={handleSave} className={ui.btnFull}>Kaydet</button>
        </div>

      </div>
    </div>
  )
}