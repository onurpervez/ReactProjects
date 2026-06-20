import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'

const R = 38
const CIRCUMFERENCE = 2 * Math.PI * R

export default function ProgressBar() {
  const { totalCalories } = useMeal()
  const { profile, settings } = useAuth()

  const goal = profile
    ? (settings.dailyGoalOverride ?? calculateTDEE(profile))
    : 2000

  const percentage = Math.min(Math.round((totalCalories / goal) * 100), 100)
  const offset     = CIRCUMFERENCE * (1 - percentage / 100)
  const remaining  = Math.max(goal - totalCalories, 0)

  const ringClass =
    percentage >= 100 ? 'stroke-red-500' :
    percentage >= 80  ? 'stroke-amber-400' :
    'stroke-blue-500'

  const barClass =
    percentage >= 100 ? 'bg-red-500' :
    percentage >= 80  ? 'bg-amber-400' :
    'bg-blue-500'

  const textClass =
    percentage >= 100 ? 'text-red-500' :
    percentage >= 80  ? 'text-amber-500' :
    'text-blue-600 dark:text-blue-400'

  return (
    <div className={`${ui.card} bg-gradient-to-br from-blue-50/60 to-stone-50 dark:from-zinc-900 dark:to-zinc-900`}>
      <div className="flex items-center gap-5">

        {/* Circular ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-[88px] h-[88px] -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r={R}
              fill="none" strokeWidth="9"
              className="stroke-stone-200 dark:stroke-zinc-700"
            />
            <circle
              cx="50" cy="50" r={R}
              fill="none" strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={`${ringClass} transition-all duration-500`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-base font-bold leading-none ${textClass}`}>
              %{percentage}
            </span>
          </div>
        </div>

        {/* Info section */}
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="flex justify-between items-baseline">
            <span className={ui.muted}>
              {settings.dailyGoalOverride ? 'Hedef (manuel)' : 'Hedef (TDEE)'}
            </span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {totalCalories}
              </span>
              <span className={ui.muted}> / {goal} kcal</span>
            </div>
          </div>

          <div className="h-2.5 bg-stone-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barClass}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={ui.muted}>Tüketilen</span>
            <span className={`text-xs font-medium ${remaining === 0 ? 'text-red-400' : 'text-gray-500 dark:text-zinc-400'}`}>
              {remaining > 0 ? `${remaining} kcal kaldı` : 'Hedefe ulaşıldı'}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
