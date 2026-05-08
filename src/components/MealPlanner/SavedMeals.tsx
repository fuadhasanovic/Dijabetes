import React, { useState } from 'react';
import { Plus, Trash2, Salad, Search, Calculator, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, SavedMeal, MealType } from '../../types';
import { fuzzyMatch } from '../../lib/searchUtils';

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
  const [mealType, setMealType] = useState<MealType>(MealType.BREAKFAST);
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const totalMealGI = selectedFoods.reduce((acc, curr) => acc + curr.gi, 0);

  const handleSaveMeal = () => {
    if (newMealName && selectedFoods.length > 0) {
      onAddSavedMeal({ 
        name: newMealName, 
        foods: selectedFoods, 
        type: mealType,
        totalGI: totalMealGI,
        timestamp: mealDate
      });
      setNewMealName('');
      setSelectedFoods([]);
      setMealType(MealType.BREAKFAST);
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

  const mealTypeLabels: Record<MealType, string> = {
    [MealType.BREAKFAST]: t.breakfast,
    [MealType.SNACK]: t.snack,
    [MealType.LUNCH]: t.lunch,
    [MealType.APPETIZER]: t.appetizer,
    [MealType.DINNER]: t.dinner,
  };

  return (
    <div className="space-y-4">
      {!showCreateMeal ? (
        <button 
          onClick={() => setShowCreateMeal(true)}
          className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="p-2 bg-white/10 rounded-xl">
            <Plus size={20} />
          </div>
          {t.addMeal}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-white border border-slate-200 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
              <Salad size={24} className="text-blue-600" />
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Novi nutritivni obrok</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.mealName}</label>
                <input 
                  type="text" 
                  placeholder={t.mealName}
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Datum obroka</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.mealType}</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(MealType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mealType === type ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {mealTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.selectFoods}</label>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Calculator size={12} className="text-blue-600" />
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">{t.totalGI}: {totalMealGI}</span>
                </div>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder={t.search} 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-none text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
                    <Plus size={16} className="rotate-45" />
                  </button>
                )}

                {/* Quick Results Overlay */}
                {searchTerm && foods.filter(f => fuzzyMatch(f.name, searchTerm)).length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto p-2 scroll-smooth">
                    {foods
                      .filter(f => fuzzyMatch(f.name, searchTerm))
                      .slice(0, 10)
                      .map(food => {
                        const isSelected = selectedFoods.find(sf => sf.id === food.id);
                        return (
                          <button
                            key={food.id}
                            onClick={() => {
                              toggleFoodForMeal(food);
                              setSearchTerm('');
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group mb-1 transition-all ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                food.category === 'NI' ? 'bg-green-100 text-green-700' :
                                food.category === 'SI' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {food.gi}
                              </div>
                              <span className="font-bold text-slate-700">{food.name}</span>
                            </div>
                            {isSelected ? (
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                <Plus size={12} className="rotate-45" />
                              </div>
                            ) : (
                              <Plus size={14} className="text-slate-300 group-hover:text-blue-500" />
                            )}
                          </button>
                        );
                      })
                    }
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar p-1" id="food-selection-grid">
                {foods.filter(f => fuzzyMatch(f.name, searchTerm)).map(food => {
                  const isSelected = selectedFoods.find(sf => sf.id === food.id);
                  return (
                    <button 
                      key={food.id}
                      onClick={() => toggleFoodForMeal(food)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1 relative overflow-hidden ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[0.98]' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-tight truncate">{food.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] opacity-70 font-bold">GI: {food.gi}</span>
                        <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-blue-300' : 'bg-blue-500 opacity-40'}`} />
                        <span className={`text-[8px] font-black uppercase px-1.5 rounded-md ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                          {food.category}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Plus size={12} className="rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowCreateMeal(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">{t.cancel}</button>
              <button 
                onClick={handleSaveMeal}
                disabled={!newMealName || selectedFoods.length === 0}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mb-32 blur-3xl opacity-50" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {savedMeals.map((meal) => (
            <motion.div 
              layout
              key={meal.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600 border border-blue-100">
                    <Clock size={16} className="mb-0.5" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">{mealTypeLabels[meal.type] || meal.type}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">{meal.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">{meal.timestamp}</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.totalGI}: {meal.totalGI}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => meal.id && onDeleteSavedMeal(meal.id)} 
                  className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {meal.foods.map((food, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{food.name}</span>
                    <span className={`text-[8px] font-black px-1.5 rounded-md ${
                      food.category === 'NI' ? 'bg-green-100 text-green-700' :
                      food.category === 'SI' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {food.gi}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-100/30 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
