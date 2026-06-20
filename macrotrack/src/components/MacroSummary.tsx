import { useMeal } from '../context/useMeal'
import { useAuth } from '../context/useAuth'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'

const KCAL_PER = { carbs: 4, protein: 4, fat: 9 }

const MACROS = [
  {
    label: 'Karb',
    key: 'carbs'   as const,
    bar:        'bg-amber-400',
    barOver:    'bg-red-400',
    valueClass: 'text-amber-600 dark:text-amber-400',
    pillBg:     'bg-amber-50/70 dark:bg-zinc-800/80 border border-amber-100/80 dark:border-zinc-700/50',
    dot:        'bg-amber-400',
  },
  {
    label: 'Protein',
    key: 'protein' as const,
    bar:        'bg-blue-500',
    barOver:    'bg-red-400',
    valueClass: 'text-blue-600 dark:text-blue-400',
    pillBg:     'bg-blue-50/70 dark:bg-zinc-800/80 border border-blue-100/80 dark:border-zinc-700/50',
    dot:        'bg-blue-500',
  },
  {
    label: 'Yağ',
    key: 'fat'     as const,
    bar:        'bg-rose-400',
    barOver:    'bg-red-500',
    valueClass: 'text-rose-500 dark:text-rose-400',
    pillBg:     'bg-rose-50/70 dark:bg-zinc-800/80 border border-rose-100/80 dark:border-zinc-700/50',
    dot:        'bg-rose-400',
  },
]

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

  const values = { carbs: totalCarbs, protein: totalProtein, fat: totalFat }

  return (
    <div className={ui.grid3}>
      {MACROS.map(m => {
        const current = values[m.key]
        const target  = targets[m.key]
        const pct     = Math.min(Math.round((current / target) * 100), 100)
        const isOver  = current > target

        return (
          <div key={m.label} className={`rounded-xl p-3 ${m.pillBg}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.dot}`} />
                <p className={ui.muted}>{m.label}</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{target}g</p>
            </div>
            <p className={`text-lg font-bold mb-2 ${isOver ? 'text-red-500' : m.valueClass}`}>
              {current}
              <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">g</span>
            </p>
            <div className="h-1.5 bg-stone-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isOver ? m.barOver : m.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className={`mt-1 text-xs ${isOver ? 'text-red-400' : 'text-gray-400 dark:text-zinc-500'}`}>
              %{pct}
            </p>
          </div>
        )
      })}
    </div>
  )
}
