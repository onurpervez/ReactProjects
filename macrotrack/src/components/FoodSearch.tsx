import { useState } from 'react'
import type { Food, MealType } from '../types'
import { useMeal } from '../context/useMeal'
import { ui } from '../styles'
import mockFoods from '../data/mockFoods.json'
import FoodDetailModal from './FoodDetailModal'

const foods = mockFoods as Food[]
const GRAM_PRESETS = [50, 100, 150, 200]
const CATEGORIES = ['tümü', 'et', 'tahıl', 'sebze', 'meyve', 'süt ürünleri', 'baklagil', 'kuruyemiş', 'yağ', 'takviye'] as const
const MEAL_TYPES: MealType[] = ['kahvaltı', 'öğle', 'akşam', 'ara öğün']
type Category = typeof CATEGORIES[number]

export default function FoodSearch() {
  const { addEntry, activeMealType, setActiveMealType } = useMeal()
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState<Food | null>(null)
  const [grams,    setGrams]    = useState('')
  const [category, setCategory] = useState<Category>('tümü')
  const [detail,   setDetail]   = useState<Food | null>(null)

  const filtered = foods.filter(f => {
    const matchQuery    = query.length === 0 || f.name.toLowerCase().includes(query.toLowerCase())
    const matchCategory = category === 'tümü' || f.category === category
    return matchQuery && matchCategory
  })

  function handleSelect(food: Food) {
    setSelected(food)
    setQuery(food.name)
  }

  function handleClear() {
    setQuery('')
    setSelected(null)
    setGrams('')
  }

  function handleAdd() {
    const g = parseFloat(grams)
    if (!selected || isNaN(g) || g <= 0) return
    addEntry(selected, g)
    handleClear()
  }

  return (
    <>
      <div className={`${ui.card} flex flex-col gap-3 flex-1 min-h-0`}>
        <h2 className={ui.cardTitle}>Besin ekle</h2>

        <div className="flex gap-1.5">
          {MEAL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setActiveMealType(t)}
              className={activeMealType === t ? ui.mealTypeBtnActive : ui.mealTypeBtn}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={ui.searchWrap}>
          <input
            type="text"
            placeholder="Pirinç, tavuk, yumurta..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null) }}
            className={ui.input}
          />
          {query.length > 0 && (
            <button onClick={handleClear} className={ui.clearBtn}>×</button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? ui.categoryBtnActive : ui.categoryBtn}
            >
              {c}
            </button>
          ))}
        </div>

        {!selected && (
          <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
            {filtered.length === 0 ? (
              <p className={`${ui.muted} text-center py-4`}>Besin bulunamadı</p>
            ) : (
              filtered.map(food => (
                <div
                  key={food.id}
                  className="flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50"
                >
                  <button
                    onClick={() => handleSelect(food)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    <span className="text-black">{food.name}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{food.category}</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className={ui.muted}>{food.calories} kcal/100g</span>
                    <button
                      onClick={() => setDetail(food)}
                      className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      detay
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selected && (
          <div className="flex flex-col gap-3 pt-1 border-t border-gray-100">
            <div className="flex gap-2 flex-wrap">
              {GRAM_PRESETS.map(g => (
                <button
                  key={g}
                  onClick={() => setGrams(String(g))}
                  className={grams === String(g) ? ui.gramBtnActive : ui.gramBtn}
                >
                  {g}g
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Gram (örn: 150)"
                value={grams}
                onChange={e => setGrams(e.target.value)}
                className={ui.input}
              />
              <button onClick={handleAdd} className={ui.btnPrimary}>Ekle</button>
            </div>
          </div>
        )}
      </div>

      {detail && (
        <FoodDetailModal
          food={detail}
          onClose={() => setDetail(null)}
          onSelect={handleSelect}
        />
      )}
    </>
  )
}