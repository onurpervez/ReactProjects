import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { CALORIES_PER_KG, GRAMS_PER_KG } from '../constants/nutrition'
import { ui } from '../styles'

export default function ProjectionCard() {
  const { totalCalories } = useMeal()
  const { profile, settings } = useAuth()

  if (!profile) return null

  const tdee       = settings.dailyGoalOverride ?? calculateTDEE(profile)
  const dailyDiff  = totalCalories - tdee
  const weeklyDiff = dailyDiff * 7
  const weeklyGram = Math.round(Math.abs(weeklyDiff) / CALORIES_PER_KG * GRAMS_PER_KG)

  const isGain    = dailyDiff > 0
  const isNeutral = Math.abs(dailyDiff) < 50

  const message = isNeutral
    ? 'Kalori dengen neredeyse mükemmel.'
    : isGain
    ? `Bu tempoyla haftada ~${weeklyGram}g kütlen artar.`
    : `Bu tempoyla haftada ~${weeklyGram}g kütlen azalır.`

  const accentColor = isNeutral ? 'text-blue-500' : isGain ? 'text-amber-500' : 'text-green-500'

  const leftBorder  = isNeutral
    ? 'border-l-[3px] border-l-blue-400'
    : isGain
    ? 'border-l-[3px] border-l-amber-400'
    : 'border-l-[3px] border-l-green-400'

  const stats = [
    { label: 'Günlük fark',    value: `${dailyDiff > 0 ? '+' : ''}${dailyDiff} kcal` },
    { label: 'Haftalık fark',  value: `${weeklyDiff > 0 ? '+' : ''}${weeklyDiff} kcal` },
    { label: 'Tahmini değişim', value: isNeutral ? '±0g' : isGain ? `+${weeklyGram}g` : `-${weeklyGram}g` },
  ]

  return (
    <div className={`${ui.card} flex flex-col gap-3 ${leftBorder}`}>
      <h2 className={ui.cardTitle}>Haftalık projeksiyon</h2>
      <div className="flex justify-around items-center flex-wrap gap-2">
        {stats.map(s => (
          <div key={s.label} className={ui.formGroup}>
            <span className={ui.muted}>{s.label}</span>
            <span className={`text-lg font-bold ${accentColor}`}>{s.value}</span>
          </div>
        ))}
      </div>
      <p className={`${ui.muted} pt-2 border-t border-stone-200 dark:border-zinc-800`}>{message}</p>
    </div>
  )
}
