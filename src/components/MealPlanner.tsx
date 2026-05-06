import React, { useState } from 'react';
import FoodDatabase from './MealPlanner/FoodDatabase';
import SavedMeals from './MealPlanner/SavedMeals';
import WeeklyPlan from './MealPlanner/WeeklyPlan';
import { FoodItem, SavedMeal, MenuPlan } from '../types';

interface MealPlannerProps {
  foods: FoodItem[];
  savedMeals: SavedMeal[];
  menuPlans: MenuPlan[];
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
  onAddSavedMeal: (meal: Omit<SavedMeal, 'id'>) => void;
  onAddMenuPlan: (plan: Omit<MenuPlan, 'id'>) => void;
  onDeleteFood: (id: string) => void;
  onDeleteSavedMeal: (id: string) => void;
  onDeleteMenuPlan: (id: string) => void;
  translations: any;
  language: string;
}

type MealTab = 'database' | 'meals' | 'plan';

export default function MealPlanner({ 
  foods, savedMeals, menuPlans, onAddFood, onAddSavedMeal, onAddMenuPlan, 
  onDeleteFood, onDeleteSavedMeal, onDeleteMenuPlan, translations: t, language 
}: MealPlannerProps) {
  const [activeTab, setActiveTab] = useState<MealTab>('database');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="text-slate-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl">
        {(['database', 'meals', 'plan'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            {tab === 'database' ? t.database : tab === 'meals' ? t.meals : t.plan}
          </button>
        ))}
      </div>

      {activeTab === 'database' && (
        <FoodDatabase foods={foods} onAddFood={onAddFood} onDeleteFood={onDeleteFood} translations={t} />
      )}

      {activeTab === 'meals' && (
        <SavedMeals foods={foods} savedMeals={savedMeals} onAddSavedMeal={onAddSavedMeal} onDeleteSavedMeal={onDeleteSavedMeal} translations={t} />
      )}

      {activeTab === 'plan' && (
        <WeeklyPlan savedMeals={savedMeals} menuPlans={menuPlans} onAddMenuPlan={onAddMenuPlan} onDeleteMenuPlan={onDeleteMenuPlan} translations={t} language={language} />
      )}
    </div>
  );
}
