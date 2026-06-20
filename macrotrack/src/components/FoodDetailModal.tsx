import type { Food } from '../types'
import { ui } from '../styles'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  food: Food
  onClose: () => void
  onSelect: (food: Food) => void
}

const COLORS = ['#60a5fa', '#fbbf24', '#f87171']

export default function FoodDetailModal({ food, onClose, onSelect }: Props) {
  const carbKcal    = food.carbs   * 4
  const proteinKcal = food.protein * 4
  const fatKcal     = food.fat     * 9

  const pieData = [
    { name: 'Karb',    value: Math.round(carbKcal) },
    { name: 'Protein', value: Math.round(proteinKcal) },
    { name: 'Yağ',     value: Math.round(fatKcal) },
  ].filter(d => d.value > 0)

  const details = [
    { label: 'Kalori',       value: `${food.calories} kcal` },
    { label: 'Karbonhidrat', value: `${food.carbs}g` },
    { label: 'Protein',      value: `${food.protein}g` },
    { label: 'Yağ',          value: `${food.fat}g` },
    { label: 'Kategori',     value: food.category },
  ]

  return (
    <div className={ui.modalOverlay} onClick={onClose}>
      <div className={ui.modalCard} onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-center">
          <div>
            <h2 className={ui.cardTitle}>{food.name}</h2>
            <p className={ui.muted}>100g başına değerler</p>
          </div>
          <button onClick={onClose} className={ui.logoutBtn}>✕</button>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #d1d5db', background: '#f3f4f6' }}
                formatter={(val: number | string) => [`${val} kcal`]}
                />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 -mt-2">
          {pieData.map((d, i) => (
            <span key={d.name} className={ui.muted}>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS[i] }} />
              {d.name} {Math.round(d.value / food.calories * 100)}%
            </span>
          ))}
        </div>

        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden">
          {details.map(d => (
            <div key={d.label} className={detailRowClass}>
              <span className={ui.detailLabel}>{d.label}</span>
              <span className={ui.detailValue}>{d.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => { onSelect(food); onClose() }}
          className={ui.btnFull}
        >
          Bu besini seç
        </button>

      </div>
    </div>
  )
}

const detailRowClass = 'flex justify-between items-center px-3 py-2 border-b border-gray-100 last:border-0'