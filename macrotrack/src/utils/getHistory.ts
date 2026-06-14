import { supabase } from '../lib/supabase'
import type { MealEntry, MealType } from '../types'

export interface DayHistory {
  date: string
  label: string
  entries: MealEntry[]
  totalCalories: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
}

export async function getHistory(days = 7): Promise<DayHistory[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().slice(0, 10))
  }

  const { data } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .in('date', dates)

  const result: DayHistory[] = dates.map((dateStr, i) => {
    const dayData = (data ?? []).filter(row => row.date === dateStr)

    const entries: MealEntry[] = dayData.map(row => ({
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

    const label = i === 0
      ? 'Bugün'
      : i === 1
      ? 'Dün'
      : new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' })

    return {
      date: dateStr,
      label,
      entries,
      totalCalories: entries.reduce((s, e) => s + e.totalCalories, 0),
      totalCarbs:    Math.round(entries.reduce((s, e) => s + e.totalCarbs,   0) * 10) / 10,
      totalProtein:  Math.round(entries.reduce((s, e) => s + e.totalProtein, 0) * 10) / 10,
      totalFat:      Math.round(entries.reduce((s, e) => s + e.totalFat,     0) * 10) / 10,
    }
  })

  return result
}