import { useState } from 'react'
import type { Food } from '../types'
import { useMeal } from '../context/useMeal'
import { ui } from '../styles'
import mockFoods from '../data/mockFoods.json'

const foods = mockFoods as Food[]

export default function FoodSearch() {
  const { addEntry } = useMeal()
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState<Food | null>(null)
  const [grams, setGrams]       = useState('')

  const filtered = query.length > 0
    ? foods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : foods

  function handleAdd() {
    const g = parseFloat(grams)
    if (!selected || isNaN(g) || g <= 0) return
    addEntry(selected, g)
    setSelected(null)
    setGrams('')
    setQuery('')
  }

  return (
    <div className={`${ui.card} flex flex-col gap-3`}>
      <h2 className={ui.cardTitle}>Besin ekle</h2>

      <input
        type="text"
        placeholder="Pirinç, tavuk, yumurta..."
        value={query}
        onChange={e => { setQuery(e.target.value); setSelected(null) }}
        className={ui.input}
      />

      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {filtered.map(food => (
          <button
            key={food.id}
            onClick={() => { setSelected(food); setQuery(food.name) }}
            className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm text-left transition-colors
              ${selected?.id === food.id ? 'bg-blue-50 text-black' : 'hover:bg-gray-50 text-black'}`}
          >
            <span>{food.name}</span>
            <span className={ui.muted}>{food.calories} kcal/100g</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex gap-2 pt-1 border-t border-gray-100">
          <input
            type="number"
            placeholder="Gram (örn: 150)"
            value={grams}
            onChange={e => setGrams(e.target.value)}
            className={ui.input}
          />
          <button onClick={handleAdd} className={ui.btnPrimary}>
            Ekle
          </button>
        </div>
      )}
    </div>
  )
}