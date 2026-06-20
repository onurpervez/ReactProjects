import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { ui } from '../styles'

const DAILY_GOAL = 8

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function waterKey(username: string) {
  return `macrotrack_water_${username}_${getToday()}`
}

function loadWater(username: string): number {
  try {
    const stored = localStorage.getItem(waterKey(username))
    return stored ? parseInt(stored, 10) : 0
  } catch { return 0 }
}

function GlassIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14l-2 16.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3z"/>
      {filled && <path d="M7.5 12c0 2 9 2 9 0" fill="none" stroke="white" strokeWidth="1.5"/>}
    </svg>
  )
}

export default function WaterTracker() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const username = profile?.username ?? ''

  const [glasses, setGlasses] = useState(() => loadWater(username))

  function save(val: number) {
    const clamped = Math.max(0, Math.min(DAILY_GOAL, val))
    setGlasses(clamped)
    localStorage.setItem(waterKey(username), String(clamped))
  }

  function handleGlassClick(index: number) {
    if (index < glasses) {
      save(index)
    } else {
      const next = index + 1
      if (next === DAILY_GOAL) showToast('Günlük su hedefine ulaştın! 💧', 'success')
      save(next)
    }
  }

  function handleAdd() {
    if (glasses < DAILY_GOAL) {
      const next = glasses + 1
      if (next === DAILY_GOAL) showToast('Günlük su hedefine ulaştın! 💧', 'success')
      save(next)
    }
  }

  const pct = Math.round((glasses / DAILY_GOAL) * 100)

  return (
    <div className={`${ui.card} flex flex-col gap-3`}>
      <div className="flex justify-between items-center">
        <h2 className={ui.cardTitle}>Su takibi</h2>
        <span className={`text-xs font-semibold ${glasses >= DAILY_GOAL ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'}`}>
          {glasses} / {DAILY_GOAL} bardak
        </span>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: DAILY_GOAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleGlassClick(i)}
            title={i < glasses ? 'Çıkar' : 'Ekle'}
            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
              i < glasses
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-300 dark:text-zinc-600 hover:bg-stone-200 dark:hover:bg-zinc-700'
            }`}
          >
            <GlassIcon filled={i < glasses} />
          </button>
        ))}
      </div>

      <div className="h-1.5 bg-stone-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className={ui.muted}>~{glasses * 250} ml</span>
        <div className="flex gap-2">
          <button
            onClick={() => save(glasses - 1)}
            disabled={glasses === 0}
            className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 flex items-center justify-center text-base leading-none hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 font-medium"
          >
            −
          </button>
          <button
            onClick={handleAdd}
            disabled={glasses >= DAILY_GOAL}
            className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center text-base leading-none hover:bg-blue-600 transition-colors disabled:opacity-30 shadow-sm font-medium"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
