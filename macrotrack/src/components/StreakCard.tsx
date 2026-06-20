import { useAuth } from '../context/useAuth'
import { ui } from '../styles'

function calculateStreak(username: string): number {
  if (!username) return 0

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  let hasToday = false
  try {
    const stored = localStorage.getItem(`macrotrack_meals_${username}_${todayStr}`)
    if (stored) hasToday = JSON.parse(stored).length > 0
  } catch { /* ignore */ }

  let streak = 0
  const startOffset = hasToday ? 0 : 1

  for (let i = startOffset; i < 366; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `macrotrack_meals_${username}_${d.toISOString().slice(0, 10)}`
    try {
      const stored = localStorage.getItem(key)
      if (stored && JSON.parse(stored).length > 0) {
        streak++
      } else {
        break
      }
    } catch { break }
  }

  return streak
}

function getStreakInfo(streak: number) {
  if (streak === 0) return { text: 'Bugün ilk öğününü ekle', emoji: '🌱', color: 'text-gray-400 dark:text-zinc-500', bg: 'bg-stone-100 dark:bg-zinc-800' }
  if (streak === 1) return { text: 'Harika başlangıç!',      emoji: '👍', color: 'text-blue-500',                   bg: 'bg-blue-50 dark:bg-blue-900/20' }
  if (streak < 4)  return { text: 'Alışkanlık oluşuyor',     emoji: '💪', color: 'text-blue-500',                   bg: 'bg-blue-50 dark:bg-blue-900/20' }
  if (streak < 7)  return { text: 'Süper gidiyorsun!',       emoji: '🔥', color: 'text-orange-500',                 bg: 'bg-orange-50 dark:bg-orange-900/20' }
  if (streak < 14) return { text: 'Bir haftalık seri!',      emoji: '🔥', color: 'text-orange-500',                 bg: 'bg-orange-50 dark:bg-orange-900/20' }
  if (streak < 30) return { text: 'İnanılmaz tutarlılık!',   emoji: '🚀', color: 'text-purple-500',                 bg: 'bg-purple-50 dark:bg-purple-900/20' }
  return             { text: 'Aylık seri efsanesi!',         emoji: '🏆', color: 'text-amber-500',                  bg: 'bg-amber-50 dark:bg-amber-900/20' }
}

export default function StreakCard() {
  const { profile } = useAuth()
  const streak = calculateStreak(profile?.username ?? '')
  const { text, emoji, color, bg } = getStreakInfo(streak)

  return (
    <div className={`${ui.card} flex flex-col gap-3`}>
      <h2 className={ui.cardTitle}>Günlük seri</h2>

      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${bg}`}>
          {emoji}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold leading-none ${color}`}>{streak}</span>
            <span className={ui.muted}>gün</span>
          </div>
          <p className={`text-xs font-medium ${color}`}>{text}</p>
        </div>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < Math.min(streak, 7) ? 'bg-orange-400' : 'bg-stone-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>
      <p className={ui.muted}>Bu hafta {Math.min(streak, 7)}/7 gün</p>
    </div>
  )
}
