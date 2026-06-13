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

export interface User {
  username: string;
  password: string;
}

export interface UserProfile {
  username: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}