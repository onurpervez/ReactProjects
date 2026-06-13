import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Food, MealEntry } from '../types';
import { DAILY_GOAL } from '../constants/nutrition';
import { useMeal } from '../context/useMeal';
interface MealContextType {
  entries: MealEntry[];
  addEntry: (food: Food, grams: number) => void;
  removeEntry: (id: string) => void;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export const MealContext = createContext<MealContextType | null>(null);



export function MealProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<MealEntry[]>([]);

  function addEntry(food: Food, grams: number) {
    const ratio = grams / 100;
    const newEntry: MealEntry = {
      id: crypto.randomUUID(),
      food,
      grams,
      totalCalories: Math.round(food.calories * ratio),
      totalCarbs:    Math.round(food.carbs   * ratio * 10) / 10,
      totalProtein:  Math.round(food.protein * ratio * 10) / 10,
      totalFat:      Math.round(food.fat     * ratio * 10) / 10,
    };
    setEntries(prev => [...prev, newEntry]);
  }

  function removeEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  const totals = useMemo(() => ({
    totalCalories: entries.reduce((sum, e) => sum + e.totalCalories, 0),
    totalCarbs:    Math.round(entries.reduce((sum, e) => sum + e.totalCarbs,   0) * 10) / 10,
    totalProtein:  Math.round(entries.reduce((sum, e) => sum + e.totalProtein, 0) * 10) / 10,
    totalFat:      Math.round(entries.reduce((sum, e) => sum + e.totalFat,     0) * 10) / 10,
  }), [entries]);

  return (
    <MealContext.Provider value={{ entries, addEntry, removeEntry, ...totals }}>
      {children}
    </MealContext.Provider>
  );
}



