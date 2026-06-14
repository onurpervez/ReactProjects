import { useState, useEffect } from 'react'
import type { Food, MealType } from '../types'
import { useMeal } from '../context/useMeal'
import { ui } from '../styles'
import mockFoods from '../data/mockFoods.json'
import FoodDetailModal from './FoodDetailModal'
import { supabase } from '../lib/supabase'

const GRAM_PRESETS = [50, 100, 150, 200]
const CATEGORIES = ['tümü', 'et', 'tahıl', 'sebze', 'meyve', 'süt ürünleri', 'baklagil', 'kuruyemiş', 'yağ', 'takviye', 'özel'] as const
const MEAL_TYPES: MealType[] = ['kahvaltı', 'öğle', 'akşam', 'ara öğün']
type Category = typeof CATEGORIES[number]

export default function FoodSearch() {
  const { addEntry, activeMealType, setActiveMealType } = useMeal()
  const [query,         setQuery]         = useState('')
  const [selected,      setSelected]      = useState<Food | null>(null)
  const [grams,         setGrams]         = useState('')
  const [category,      setCategory]      = useState<Category>('tümü')
  const [detail,        setDetail]        = useState<Food | null>(null)
  const [showManual,    setShowManual]    = useState(false)
  const [customFoods,   setCustomFoods]   = useState<Food[]>([])
  const [manualName,    setManualName]    = useState('')
  const [manualCal,     setManualCal]     = useState('')
  const [manualCarbs,   setManualCarbs]   = useState('')
  const [manualProtein, setManualProtein] = useState('')
  const [manualFat,     setManualFat]     = useState('')
  const [manualGrams,   setManualGrams]   = useState('')
  const [manualError,   setManualError]   = useState('')

  useEffect(() => { 
    const loadCustomFoods = async () => {
      const { data } = await supabase
        .from('custom_foods')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setCustomFoods(data.map(row => ({
          id: row.id,
          name: row.name,
          calories: row.calories,
          carbs: row.carbs,
          protein: row.protein,
          fat: row.fat,
          category: 'özel' as Food['category'],
        })))
      }
    }
    loadCustomFoods() 
  }, [])

  async function loadCustomFoods() {
    const { data } = await supabase
      .from('custom_foods')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setCustomFoods(data.map(row => ({
        id: row.id,
        name: row.name,
        calories: row.calories,
        carbs: row.carbs,
        protein: row.protein,
        fat: row.fat,
        category: 'özel' as Food['category'],
      })))
    }
  }

  const allFoods = [...(mockFoods as Food[]), ...customFoods]

  const filtered = allFoods.filter(f => {
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

  async function handleManualAdd() {
    const name    = manualName.trim()
    const cal     = parseFloat(manualCal)
    const carbs   = parseFloat(manualCarbs)
    const protein = parseFloat(manualProtein)
    const fat     = parseFloat(manualFat)
    const g       = parseFloat(manualGrams)

    if (!name)                          { setManualError('İsim boş olamaz'); return }
    if (isNaN(cal)     || cal     < 0)  { setManualError('Geçerli kalori gir'); return }
    if (isNaN(carbs)   || carbs   < 0)  { setManualError('Geçerli karb gir'); return }
    if (isNaN(protein) || protein < 0)  { setManualError('Geçerli protein gir'); return }
    if (isNaN(fat)     || fat     < 0)  { setManualError('Geçerli yağ gir'); return }
    if (isNaN(g)       || g       <= 0) { setManualError('Geçerli gram gir'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('custom_foods').insert({
      user_id: user.id,
      name, calories: cal, carbs, protein, fat, category: 'özel',
    }).select().single()

    if (error) { setManualError('Kaydedilemedi'); return }

    const manualFood: Food = {
      id: data.id,
      name: data.name,
      calories: data.calories,
      carbs: data.carbs,
      protein: data.protein,
      fat: data.fat,
      category: 'özel' as Food['category'],
    }

    setCustomFoods(prev => [manualFood, ...prev])
    addEntry(manualFood, g)
    setManualName(''); setManualCal(''); setManualCarbs('')
    setManualProtein(''); setManualFat(''); setManualGrams('')
    setManualError('')
    setShowManual(false)
  }

  return (
    <>
      <div className={`${ui.card} flex flex-col gap-3`}>
        <div className="flex justify-between items-center">
          <h2 className={ui.cardTitle}>Besin ekle</h2>
          <button
            onClick={() => setShowManual(!showManual)}
            className={showManual ? ui.categoryBtnActive : ui.categoryBtn}
          >
            + Manuel
          </button>
        </div>

        {showManual ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TYPES.map(t => (
                <button key={t} onClick={() => setActiveMealType(t)}
                  className={activeMealType === t ? ui.mealTypeBtnActive : ui.mealTypeBtn}>
                  {t}
                </button>
              ))}
            </div>

            <div className={ui.formGroup}>
              <label className={ui.label}>Ürün adı</label>
              <input type="text" placeholder="Ev yapımı köfte" value={manualName}
                onChange={e => { setManualName(e.target.value); setManualError('') }}
                className={ui.input} />
            </div>

            <div className={ui.grid2}>
              <div className={ui.formGroup}>
                <label className={ui.label}>Kalori (100g)</label>
                <input type="number" placeholder="250" value={manualCal}
                  onChange={e => { setManualCal(e.target.value); setManualError('') }}
                  className={ui.input} />
              </div>
              <div className={ui.formGroup}>
                <label className={ui.label}>Gram</label>
                <input type="number" placeholder="150" value={manualGrams}
                  onChange={e => { setManualGrams(e.target.value); setManualError('') }}
                  className={ui.input} />
              </div>
            </div>

            <div className={ui.grid3}>
              <div className={ui.formGroup}>
                <label className={ui.label}>Karb (g)</label>
                <input type="number" placeholder="30" value={manualCarbs}
                  onChange={e => { setManualCarbs(e.target.value); setManualError('') }}
                  className={ui.input} />
              </div>
              <div className={ui.formGroup}>
                <label className={ui.label}>Protein (g)</label>
                <input type="number" placeholder="20" value={manualProtein}
                  onChange={e => { setManualProtein(e.target.value); setManualError('') }}
                  className={ui.input} />
              </div>
              <div className={ui.formGroup}>
                <label className={ui.label}>Yağ (g)</label>
                <input type="number" placeholder="10" value={manualFat}
                  onChange={e => { setManualFat(e.target.value); setManualError('') }}
                  className={ui.input} />
              </div>
            </div>

            {manualError && <p className={ui.error}>{manualError}</p>}

            <div className={ui.grid2}>
              <button onClick={() => setShowManual(false)} className={ui.btnOutline}>İptal</button>
              <button onClick={handleManualAdd} className={ui.btnFull}>Kaydet ve Ekle</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TYPES.map(t => (
                <button key={t} onClick={() => setActiveMealType(t)}
                  className={activeMealType === t ? ui.mealTypeBtnActive : ui.mealTypeBtn}>
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
                <button key={c} onClick={() => setCategory(c)}
                  className={category === c ? ui.categoryBtnActive : ui.categoryBtn}>
                  {c}
                </button>
              ))}
            </div>

            {!selected && (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className={`${ui.muted} text-center py-4`}>Besin bulunamadı</p>
                ) : (
                  filtered.map(food => (
                    <div key={food.id}
                      className="flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800">
                      <button
                        onClick={() => handleSelect(food)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0"
                      >
                        <span className="text-black dark:text-white truncate">{food.name}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 rounded flex-shrink-0">
                          {food.category}
                        </span>
                      </button>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={ui.muted}>{food.calories} kcal</span>
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
              <div className="flex flex-col gap-3 pt-1 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex gap-2 flex-wrap">
                  {GRAM_PRESETS.map(g => (
                    <button key={g} onClick={() => setGrams(String(g))}
                      className={grams === String(g) ? ui.gramBtnActive : ui.gramBtn}>
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
          </>
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