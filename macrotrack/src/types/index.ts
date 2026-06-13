export interface Food {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  food: Food;
  grams: number;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}