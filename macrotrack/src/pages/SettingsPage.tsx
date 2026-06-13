import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'
import type { AppSettings } from '../types'

export default function SettingsPage() {
  const { profile, settings, saveSettings } = useAuth()
  const navigate = useNavigate()

  const tdee = profile ? calculateTDEE(profile) : 2000

  const [goalOverride, setGoalOverride] = useState(
  String(settings.dailyGoalOverride ?? '')
  )
  const [goalConfirmed, setGoalConfirmed] = useState(!!settings.dailyGoalOverride)
  

  const [carbs,   setCarbs]   = useState(String(settings.macroTargets.carbs))
  const [protein, setProtein] = useState(String(settings.macroTargets.protein))
  const [fat,     setFat]     = useState(String(settings.macroTargets.fat))
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const total = Number(carbs) + Number(protein) + Number(fat)

  function clampMacro(
    field: 'carbs' | 'protein' | 'fat',
    value: string
  ) {
    const num = Number(value)
    if (isNaN(num) || num < 0) return

    const others = {
      carbs:   Number(carbs),
      protein: Number(protein),
      fat:     Number(fat),
    }
    others[field] = num
    const otherSum = Object.entries(others)
      .filter(([k]) => k !== field)
      .reduce((s, [, v]) => s + v, 0)

    if (num + otherSum > 100) return

    if (field === 'carbs')   setCarbs(value)
    if (field === 'protein') setProtein(value)
    if (field === 'fat')     setFat(value)
    setError('')
  }

  function handleGoalInput(value: string) {
  setGoalOverride(value)
  setGoalConfirmed(false)
  setError('')
    }
    function handleGoalConfirm() {
    const num = Number(goalOverride)
    if (!goalOverride || isNaN(num) || num < 500 || num > 10000) {
        setError('Geçerli bir değer gir (500–10000 arası)')
        return
    }
    const newSettings: AppSettings = {
        ...settings,
        dailyGoalOverride: num,
    }
    saveSettings(newSettings)
    setGoalConfirmed(true)
    setError('')
    }

  function handleSave() {
  if (total !== 100) {
    setError(`Makro toplamı 100 olmalı, şu an: ${total}`)
    return
  }
  const newSettings: AppSettings = {
    dailyGoalOverride: goalOverride ? Number(goalOverride) : null,
    macroTargets: {
      carbs:   Number(carbs),
      protein: Number(protein),
      fat:     Number(fat),
    },
  }
  saveSettings(newSettings)
  setSaved(true)
  setTimeout(() => setSaved(false), 2000)
  setError('')
}

  return (
    <div className={ui.pageWrapper}>
      <div className="w-44 bg-gray-300 border-r border-gray-300 flex flex-col p-3 gap-1">
        <div className={ui.sidebarLogo}>
          Macro<span className="text-blue-500">Track</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className={ui.navPassive}>Dashboard</button>
        <button onClick={() => navigate('/history')}   className={ui.navPassive}>Geçmiş</button>
        <button className={ui.navActive}>Ayarlar</button>
      </div>

      <div className={ui.mainWrapper}>
        <div className={ui.content}>

          <div className={`${ui.card} flex flex-col gap-4`}>
            <h2 className={ui.cardTitle}>Kalori hedefi</h2>
            <p className={ui.muted}>
              TDEE'ne göre hesaplanan hedefin:{' '}
              <span className="text-black font-medium">{tdee} kcal</span>.
              Manuel override için aşağıya gir (500–10000 arası).
            </p>
            <div className={ui.formGroup}>
            <label className={ui.label}>Günlük kalori hedefi (kcal)</label>
            <div className="flex gap-2">
                <input
                type="number"
                placeholder={`${tdee} (otomatik)`}
                value={goalOverride}
                onChange={e => handleGoalInput(e.target.value)}
                className={ui.input}
                />
                <button
                onClick={handleGoalConfirm}
                className={goalConfirmed ? 'px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg' : ui.btnPrimary}
                >
                {goalConfirmed ? '✓' : 'Onayla'}
                </button>
            </div>
            </div>

            {goalOverride && (
            <button
                onClick={() => {
                setGoalOverride('')
                setGoalConfirmed(false)
                saveSettings({ ...settings, dailyGoalOverride: null })
                }}
                className={ui.logoutBtn}
            >
                Override'ı kaldır, TDEE'ye dön
            </button>
            )}
            </div>
          <div className={`${ui.card} flex flex-col gap-4`}>
            <h2 className={ui.cardTitle}>Makro dağılımı (%)</h2>
            <p className={ui.muted}>
              Toplam 100 olmalı. Şu an:{' '}
              <span className={total === 100 ? 'text-black font-medium' : 'text-red-500 font-medium'}>
                {total}
              </span>
              {total < 100 && (
                <span className="text-gray-400"> ({100 - total} kaldı)</span>
              )}
            </p>

            <div className={ui.grid3}>
              <div className={ui.formGroup}>
                <label className={ui.label}>Karbonhidrat</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={e => clampMacro('carbs', e.target.value)}
                  className={ui.input}
                  min={0}
                  max={100}
                />
              </div>
              <div className={ui.formGroup}>
                <label className={ui.label}>Protein</label>
                <input
                  type="number"
                  value={protein}
                  onChange={e => clampMacro('protein', e.target.value)}
                  className={ui.input}
                  min={0}
                  max={100}
                />
              </div>
              <div className={ui.formGroup}>
                <label className={ui.label}>Yağ</label>
                <input
                  type="number"
                  value={fat}
                  onChange={e => clampMacro('fat', e.target.value)}
                  className={ui.input}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-blue-400 h-full transition-all"   style={{ width: `${carbs}%` }} />
              <div className="bg-amber-400 h-full transition-all"  style={{ width: `${protein}%` }} />
              <div className="bg-rose-400 h-full transition-all"   style={{ width: `${fat}%` }} />
            </div>

            <div className="flex gap-4">
              <span className={ui.muted}><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />Karb {carbs}%</span>
              <span className={ui.muted}><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Protein {protein}%</span>
              <span className={ui.muted}><span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-1" />Yağ {fat}%</span>
            </div>

            {error && <p className={ui.error}>{error}</p>}

            <button onClick={handleSave} className={ui.btnFull}>
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}