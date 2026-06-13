import { useMeal } from '../context/useMeal'
import { ui } from '../styles'

export default function MealLog() {
  const { entries, removeEntry } = useMeal()

  return (
    <div className={`${ui.card} flex flex-col gap-3`}>
      <h2 className={ui.cardTitle}>Bugün yenenler</h2>

      {entries.length === 0 ? (
        <p className={`${ui.muted} text-center py-8`}>Henüz öğün eklenmedi</p>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
          {entries.map(entry => (
            <div key={entry.id} className={ui.listItem}>
              <div className="flex flex-col gap-0.5">
                <span className={ui.listItemName}>{entry.food.name}</span>
                <span className={ui.muted}>
                  {entry.grams}g · {entry.totalCarbs}g karb · {entry.totalProtein}g protein
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={ui.accent}>{entry.totalCalories} kcal</span>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}