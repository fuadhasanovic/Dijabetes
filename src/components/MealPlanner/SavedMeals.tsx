import React, { useState } from 'react';
import { Plus, Trash2, Salad, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem, SavedMeal } from '../../types';

interface SavedMealsProps {
  foods: FoodItem[];
  savedMeals: SavedMeal[];
  onAddSavedMeal: (meal: Omit<SavedMeal, 'id'>) => void;
  onDeleteSavedMeal: (id: string) => void;
  translations: any;
}

export default function SavedMeals({ foods, savedMeals, onAddSavedMeal, onDeleteSavedMeal, translations: t }: SavedMealsProps) {
  const [showCreateMeal, setShowCreateMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveMeal = () => {
    if (newMealName && selectedFoods.length > 0) {
      onAddSavedMeal({ name: newMealName, foods: selectedFoods });
      setNewMealName('');
      setSelectedFoods([]);
      setShowCreateMeal(false);
    }
  };

  const toggleFoodForMeal = (food: FoodItem) => {
    if (selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  return (
    <div className="space-y-4">
      {!showCreateMeal ? (
        <button 
          onClick={() => setShowCreateMeal(true)}
          className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
        >
          <Plus size={20} />
          {t.addMeal}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white border border-slate-200 rounded-[32px] space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.mealName}</label>
            <input 
              type="text" 
              placeholder={t.mealName}
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.selectFoods}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder={t.search} 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none text-xs" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(food => (
                <button 
                  key={food.id}
                  onClick={() => toggleFoodForMeal(food)}
                  className={`p-3 rounded-xl border text-left transition-all ${selectedFoods.find(sf => sf.id === food.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}
                >
                  <p className="text-[10px] font-bold truncate">{food.name}</p>
                  <p className="text-[8px] opacity-70">GI: {food.gi}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowCreateMeal(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase">{t.cancel}</button>
            <button 
              onClick={handleSaveMeal}
              disabled={!newMealName || selectedFoods.length === 0}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase disabled:opacity-50"
            >
              {t.save}
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-3">
        {savedMeals.map((meal) => (
          <div key={meal.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Salad size={18} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{meal.name}</h4>
              </div>
              <button onClick={() => meal.id && onDeleteSavedMeal(meal.id)} className="p-2 text-slate-200 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {meal.foods.map((food, fIdx) => (
                <span key={fIdx} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500">
                  {food.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
