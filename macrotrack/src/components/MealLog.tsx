import { useMeal } from '../context/useMeal'
import type { MealType } from '../types'
import { ui } from '../styles'

const MEAL_TYPES: MealType[] = ['kahvaltı', 'öğle', 'akşam', 'ara öğün']

export default function MealLog() {
  const { entries, removeEntry } = useMeal()

  const grouped = MEAL_TYPES.map(type => ({
    type,
    items: entries.filter(e => e.mealType === type),
    totalKcal: entries.filter(e => e.mealType === type).reduce((s, e) => s + e.totalCalories, 0),
  })).filter(g => g.items.length > 0)

  return (
    <div className={`${ui.card} flex flex-col gap-4 `}>
      <h2 className={ui.cardTitle}>Bugün yenenler</h2>
      {grouped.length === 0 ? (
        <p className={`${ui.muted} text-center py-8`}>Henüz öğün eklenmedi</p>
      ) : (
        grouped.map(group => (
          <div key={group.type} className={ui.mealGroup}>
            <div className={ui.mealGroupTitle}>
              <span className={ui.mealGroupName}>{group.type}</span>
              <span className={ui.mealGroupKcal}>{group.totalKcal} kcal</span>
            </div>
            {group.items.map(entry => (
              <div key={entry.id} className={ui.listItem}>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className={`${ui.listItemName} truncate`}>{entry.food.name}</span>
                  <span className={ui.muted}>
                    {entry.grams}g · {entry.totalCarbs}g karb · {entry.totalProtein}g protein
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={ui.accent}>{entry.totalCalories} kcal</span>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-gray-300 dark:text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}