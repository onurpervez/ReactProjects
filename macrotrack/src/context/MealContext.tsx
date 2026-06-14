import { createContext, useState, useMemo, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Food, MealEntry, MealType } from '../types'
import { supabase } from '../lib/supabase'

interface MealContextType {
  entries: MealEntry[]
  activeMealType: MealType
  setActiveMealType: (t: MealType) => void
  addEntry: (food: Food, grams: number) => Promise<void>
  removeEntry: (id: string) => Promise<void>
  totalCalories: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
  loading: boolean
}

export const MealContext = createContext<MealContextType | null>(null)

export function MealProvider({ children, username }: { children: ReactNode; username: string }) {
  const [entries, setEntries] = useState<MealEntry[]>([])
  const [activeMealType, setActiveMealType] = useState<MealType>('kahvaltı')
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().slice(0, 10)

  const loadTodayMeals = useCallback(async () => {
    if (!username) {
      setEntries([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)

    if (data) {
      const mapped: MealEntry[] = data.map(row => ({
        id: row.id,
        grams: row.grams,
        mealType: row.meal_type as MealType,
        totalCalories: row.calories,
        totalCarbs: row.carbs,
        totalProtein: row.protein,
        totalFat: row.fat,
        food: {
          id: row.food_id,
          name: row.food_name,
          calories: Math.round(row.calories / row.grams * 100),
          carbs: Math.round(row.carbs / row.grams * 100 * 10) / 10,
          protein: Math.round(row.protein / row.grams * 100 * 10) / 10,
          fat: Math.round(row.fat / row.grams * 100 * 10) / 10,
          category: 'et',
        },
      }))
      setEntries(mapped)
    }
    setLoading(false)
  }, [username, today])

  useEffect(() => {
    loadTodayMeals()
  }, [loadTodayMeals])

  async function addEntry(food: Food, grams: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ratio = grams / 100
    const newEntry = {
      user_id: user.id,
      date: today,
      meal_type: activeMealType,
      food_id: food.id,
      food_name: food.name,
      grams,
      calories: Math.round(food.calories * ratio),
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      protein: Math.round(food.protein * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    }

    const { data } = await supabase.from('meals').insert(newEntry).select().single()

    if (data) {
      const mapped: MealEntry = {
        id: data.id,
        grams: data.grams,
        mealType: data.meal_type as MealType,
        totalCalories: data.calories,
        totalCarbs: data.carbs,
        totalProtein: data.protein,
        totalFat: data.fat,
        food,
      }
      setEntries(prev => [...prev, mapped])
    }
  }

  async function removeEntry(id: string) {
    await supabase.from('meals').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const totals = useMemo(() => ({
    totalCalories: entries.reduce((sum, e) => sum + e.totalCalories, 0),
    totalCarbs:    Math.round(entries.reduce((sum, e) => sum + e.totalCarbs,   0) * 10) / 10,
    totalProtein:  Math.round(entries.reduce((sum, e) => sum + e.totalProtein, 0) * 10) / 10,
    totalFat:      Math.round(entries.reduce((sum, e) => sum + e.totalFat,     0) * 10) / 10,
  }), [entries])

  return (
    <MealContext.Provider value={{
      entries, activeMealType, setActiveMealType,
      addEntry, removeEntry, loading, ...totals
    }}>
      {children}
    </MealContext.Provider>
  )
}