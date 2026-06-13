import { useMeal } from '../context/useMeal'
import { ui } from '../styles'

export default function StatsCard() {
  const { entries, totalCalories } = useMeal()

  if (entries.length === 0) return null

  const topCalorie = entries.reduce((a, b) =>
    a.totalCalories > b.totalCalories ? a : b
  )

  const topProtein = entries.reduce((a, b) =>
    a.totalProtein > b.totalProtein ? a : b
  )

  const mealCounts = entries.reduce((acc, e) => {
    acc[e.mealType] = (acc[e.mealType] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stats = [
    {
      label: 'Toplam öğün',
      value: entries.length,
      unit: 'kalem',
    },
    {
      label: 'En çok kalori',
      value: topCalorie.food.name,
      unit: `${topCalorie.totalCalories} kcal`,
    },
    {
      label: 'En çok protein',
      value: topProtein.food.name,
      unit: `${topProtein.totalProtein}g protein`,
    },
    {
      label: 'Toplam kalori',
      value: totalCalories,
      unit: 'kcal',
    },
  ]

  const mealTypeLabels = Object.entries(mealCounts)
    .map(([type, count]) => `${type} (${count})`)
    .join(' · ')

  return (
    <div className={`${ui.card} flex flex-col gap-3 h-full`}>
      <h2 className={ui.cardTitle}>Bugünün özeti</h2>

      <div className={ui.grid2}>
        {stats.map(s => (
          <div key={s.label} className={ui.pill}>
            <p className={ui.muted}>{s.label}</p>
            <p className="text-sm font-medium text-black mt-1 truncate">{s.value}</p>
            <p className={ui.muted}>{s.unit}</p>
          </div>
        ))}
      </div>

      {mealTypeLabels && (
        <p className={`${ui.muted} pt-2 border-t border-gray-100`}>
          Öğünler: {mealTypeLabels}
        </p>
      )}
    </div>
  )
}