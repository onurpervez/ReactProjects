import { useMeal } from '../context/useMeal'
import { ui } from '../styles'

export default function MacroSummary() {
  const { totalCarbs, totalProtein, totalFat } = useMeal()

  const macros = [
    { label: 'Karbonhidrat', value: totalCarbs },
    { label: 'Protein',      value: totalProtein },
    { label: 'Yağ',          value: totalFat },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {macros.map(m => (
        <div key={m.label} className={ui.pill}>
          <p className={`${ui.muted} mb-1`}>{m.label}</p>
          <p className="text-lg font-medium text-gray-800">
            {m.value} <span className={`${ui.muted} font-normal`}>g</span>
          </p>
        </div>
      ))}
    </div>
  )
}
