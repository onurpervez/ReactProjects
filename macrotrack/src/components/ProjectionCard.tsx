import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { CALORIES_PER_KG, GRAMS_PER_KG } from '../constants/nutrition'
import { ui } from '../styles'

export default function ProjectionCard() {
  const { totalCalories } = useMeal()
  const { profile } = useAuth()

  if (!profile) return null

  const tdee       = calculateTDEE(profile)
  const dailyDiff  = totalCalories - tdee
  const weeklyDiff = dailyDiff * 7
  const weeklyGram = Math.round(Math.abs(weeklyDiff) / CALORIES_PER_KG * GRAMS_PER_KG)

  const isGain     = dailyDiff > 0
  const isNeutral  = Math.abs(dailyDiff) < 50

  const message = isNeutral
    ? 'Kalori dengen neredeyse mükemmel, kilonu koruyorsun.'
    : isGain
    ? `Bu tempoyla devam edersen haftada ~${weeklyGram}g kütlen artar.`
    : `Bu tempoyla devam edersen haftada ~${weeklyGram}g kütlen azalır.`

  const accentColor = isNeutral
    ? 'text-blue-500'
    : isGain
    ? 'text-amber-500'
    : 'text-green-600'

  return (
    <div className={`${ui.card} flex flex-col gap-2`}>
      <h2 className={ui.cardTitle}>Haftalık projeksiyon</h2>
      <div className="flex justify-between items-center">
        <div className={ui.formGroup}>
          <span className={ui.muted}>Günlük fark</span>
          <span className={`text-lg font-medium ${accentColor}`}>
            {dailyDiff > 0 ? '+' : ''}{dailyDiff} kcal
          </span>
        </div>
        <div className={ui.formGroup}>
          <span className={ui.muted}>Haftalık fark</span>
          <span className={`text-lg font-medium ${accentColor}`}>
            {weeklyDiff > 0 ? '+' : ''}{weeklyDiff} kcal
          </span>
        </div>
        <div className={ui.formGroup}>
          <span className={ui.muted}>Tahmini değişim</span>
          <span className={`text-lg font-medium ${accentColor}`}>
            {isNeutral ? '±0g' : isGain ? `+${weeklyGram}g` : `-${weeklyGram}g`}
          </span>
        </div>
      </div>
      <p className={`${ui.muted} pt-1 border-t border-gray-100`}>{message}</p>
    </div>
  )
}