import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'

const KCAL_PER = { carbs: 4, protein: 4, fat: 9 }

export default function MacroSummary() {
  const { totalCarbs, totalProtein, totalFat } = useMeal()
  const { profile, settings } = useAuth()

  const tdee = profile
    ? (settings.dailyGoalOverride ?? calculateTDEE(profile))
    : 2000

  const targets = {
    carbs:   Math.round((tdee * settings.macroTargets.carbs   / 100) / KCAL_PER.carbs),
    protein: Math.round((tdee * settings.macroTargets.protein / 100) / KCAL_PER.protein),
    fat:     Math.round((tdee * settings.macroTargets.fat     / 100) / KCAL_PER.fat),
  }

  const macros = [
    { label: 'Karb',    current: totalCarbs,   target: targets.carbs },
    { label: 'Protein', current: totalProtein, target: targets.protein },
    { label: 'Yağ',     current: totalFat,     target: targets.fat },
  ]

  return (
    <div className={ui.grid3}>
      {macros.map(m => {
        const pct = Math.min(Math.round((m.current / m.target) * 100), 100)
        const barColor =
          pct >= 100 ? 'bg-red-400' :
          pct >= 80  ? 'bg-amber-400' :
          'bg-blue-400'
        return (
          <div key={m.label} className={ui.pill}>
            <div className="flex justify-between items-baseline mb-2">
              <p className={ui.muted}>{m.label}</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{m.target}g</p>
            </div>
            <p className="text-lg font-medium text-black dark:text-white mb-2">
              {m.current}<span className="text-xs text-gray-400 dark:text-zinc-500 font-normal">g</span>
            </p>
            <div className="h-1.5 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <p className={`${ui.muted} mt-1`}>%{pct}</p>
          </div>
        )
      })}
    </div>
  )
}