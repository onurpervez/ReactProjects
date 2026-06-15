import { createContext, useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Food, MealEntry, MealType } from '../types'

interface MealContextType {
  entries: MealEntry[]
  activeMealType: MealType
  setActiveMealType: (t: MealType) => void
  addEntry: (food: Food, grams: number) => void
  removeEntry: (id: string) => void
  totalCalories: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
  loading: boolean
}


export const MealContext = createContext<MealContextType | null>(null)

function getTodayKey(username: string) {
  const today = new Date().toISOString().slice(0, 10)
  return `macrotrack_meals_${username}_${today}`
}

export function MealProvider({ children, username }: { children: ReactNode; username: string }) {
  const [entries, setEntries] = useState<MealEntry[]>(() => {
    try {
      const stored = localStorage.getItem(getTodayKey(username))
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const [activeMealType, setActiveMealType] = useState<MealType>('kahvaltı')

  useEffect(() => {
    if (!username) return
    localStorage.setItem(getTodayKey(username), JSON.stringify(entries))
  }, [entries, username])

  function addEntry(food: Food, grams: number) {
    const ratio = grams / 100
    const newEntry: MealEntry = {
      id: crypto.randomUUID(),
      food,
      grams,
      mealType: activeMealType,
      totalCalories: Math.round(food.calories * ratio),
      totalCarbs:    Math.round(food.carbs    * ratio * 10) / 10,
      totalProtein:  Math.round(food.protein  * ratio * 10) / 10,
      totalFat:      Math.round(food.fat      * ratio * 10) / 10,
    }
    setEntries(prev => [...prev, newEntry])
  }

  function removeEntry(id: string) {
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
      addEntry, removeEntry, loading: false, ...totals
    }}>
      {children}
    </MealContext.Provider>
  )
}