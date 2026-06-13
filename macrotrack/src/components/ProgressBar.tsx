import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'

export default function ProgressBar() {
  const { totalCalories } = useMeal()
  const { profile, settings } = useAuth()

  const goal = profile
    ? (settings.dailyGoalOverride ?? calculateTDEE(profile))
    : 2000

  const percentage = Math.min(Math.round((totalCalories / goal) * 100), 100)
  const barColor =
    percentage >= 100 ? 'bg-red-500' :
    percentage >= 80  ? 'bg-amber-400' :
    'bg-blue-500'

  return (
    <div className={ui.card}>
      <div className="flex justify-between items-baseline mb-3">
        <span className={ui.muted}>
          {settings.dailyGoalOverride ? 'Günlük hedef (manuel)' : 'Günlük hedef (TDEE)'}
        </span>
        <div>
          <span className="text-xl font-medium text-black">{totalCalories}</span>
          <span className={ui.muted}> / {goal} kcal</span>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className={ui.muted}>%{percentage} tamamlandı</span>
        <span className={ui.muted}>{Math.max(goal - totalCalories, 0)} kcal kaldı</span>
      </div>
    </div>
  )
}