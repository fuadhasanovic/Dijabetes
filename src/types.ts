export enum GlucoseContext {
  FASTING = 'fasting',
  BEFORE_BREAKFAST = 'before_breakfast',
  AFTER_BREAKFAST = 'after_breakfast',
  BEFORE_LUNCH = 'before_lunch',
  AFTER_LUNCH = 'after_lunch',
  BEFORE_DINNER = 'before_dinner',
  AFTER_DINNER = 'after_dinner',
  BEFORE_BED = 'before_bed',
}

export enum GICategory {
  LOW = 'NI',
  MEDIUM = 'SI',
  HIGH = 'VI',
}

export enum ActivityType {
  WALKING = 'walking',
  RUNNING = 'running',
  CYCLING = 'cycling',
  EXERCISE = 'exercise',
  OTHER = 'other',
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  bmiCategory: string;
  createdAt: string;
}

export interface GlucoseMeasurement {
  id?: string;
  userId: string;
  level: number;
  context: GlucoseContext;
  timestamp: string;
  notes?: string;
}

export interface FoodItem {
  id?: string;
  userId?: string;
  name: string;
  gi: number;
  category: GICategory;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  type: ActivityType;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  timestamp: string;
}

export interface Meal {
  id?: string;
  userId: string;
  name: string;
  foods: FoodItem[];
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp?: any;
}

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'bs', name: 'Bosanski' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'sr', name: 'Srpski' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'tr', name: 'Türkçe' },
];
