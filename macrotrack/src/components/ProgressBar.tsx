import { useMeal } from '../context/useMeal'
import { DAILY_GOAL } from '../constants/nutrition'

export default function ProgressBar() {
  const { totalCalories } = useMeal()
  const percentage = Math.min(Math.round((totalCalories / DAILY_GOAL) * 100), 100)

  const barColor =
    percentage >= 100 ? 'bg-red-500' :
    percentage >= 80  ? 'bg-amber-400' :
    'bg-green-400'

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-sm text-gray-500">Günlük hedef</span>
        <div>
          <span className="text-xl font-medium text-gray-800">{totalCalories}</span>
          <span className="text-sm text-gray-400"> / {DAILY_GOAL} kcal</span>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-gray-400">%{percentage} tamamlandı</span>
        <span className="text-xs text-gray-400">{Math.max(DAILY_GOAL - totalCalories, 0)} kcal kaldı</span>
      </div>
    </div>
  )
}