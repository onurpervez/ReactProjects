export interface Food {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  category: 'et' | 'tahıl' | 'sebze' | 'meyve' | 'süt ürünleri' | 'baklagil' | 'kuruyemiş' | 'yağ' | 'takviye';
}

export interface MealEntry {
  id: string;
  food: Food;
  grams: number;
  mealType: MealType;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export type MealType = 'kahvaltı' | 'öğle' | 'akşam' | 'ara öğün'

export interface UserProfile {
  username: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface User {
  username: string;
  password: string;
}

export interface AppSettings {
  dailyGoalOverride: number | null
  macroTargets: {
    carbs: number
    protein: number
    fat: number
  }
}