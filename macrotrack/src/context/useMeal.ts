import { useContext } from 'react';
import { MealContext } from './MealContext';

export function useMeal() {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error('useMeal, MealProvider içinde kullanılmalı');
  return ctx;
}