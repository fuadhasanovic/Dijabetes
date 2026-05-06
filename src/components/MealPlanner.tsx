import React, { useState } from 'react';
import { Utensils, Search, Plus, Trash2, Edit2, Download, Filter, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem, GICategory, Meal } from '../types';

interface MealPlannerProps {
  foods: FoodItem[];
  meals: Meal[];
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
  onDeleteFood: (id: string) => void;
  onDeleteMeal: (id: string) => void;
  translations: any;
  language: string;
}

export default function MealPlanner({ foods, meals, onAddFood, onAddMeal, onDeleteFood, onDeleteMeal, translations: t, language }: MealPlannerProps) {
  const [activeTab, setActiveTab] = useState<'database' | 'menu'>('database');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', gi: 0, category: GICategory.LOW });
  
  // States for creating a meal
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedType, setSelectedType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  const days = [
    { key: 'Monday', bs: 'Ponedjeljak', en: 'Monday', de: 'Montag', tr: 'Pazartesi' },
    { key: 'Tuesday', bs: 'Utorak', en: 'Tuesday', de: 'Dienstag', tr: 'Salı' },
    { key: 'Wednesday', bs: 'Srijeda', en: 'Wednesday', de: 'Mittwoch', tr: 'Çarşamba' },
    { key: 'Thursday', bs: 'Četvrtak', en: 'Thursday', de: 'Donnerstag', tr: 'Perşembe' },
    { key: 'Friday', bs: 'Petak', en: 'Friday', de: 'Freitag', tr: 'Cuma' },
    { key: 'Saturday', bs: 'Subota', en: 'Saturday', de: 'Samstag', tr: 'Cumartesi' },
    { key: 'Sunday', bs: 'Nedjelja', en: 'Sunday', de: 'Sonntag', tr: 'Pazar' },
  ];

  const mealTypes = [
    { key: 'breakfast', bs: 'Doručak', en: 'Breakfast', de: 'Frühstück', tr: 'Kahvaltı' },
    { key: 'lunch', bs: 'Ručak', en: 'Lunch', de: 'Mittagessen', tr: 'Öğle Yemeği' },
    { key: 'dinner', bs: 'Večera', en: 'Dinner', de: 'Abendessen', tr: 'Akşam Yemeği' },
    { key: 'snack', bs: 'Užina', en: 'Snack', de: 'Snack', tr: 'Atıştırmalık' },
  ];

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFood.name && newFood.gi >= 0) {
      onAddFood(newFood);
      setNewFood({ name: '', gi: 0, category: GICategory.LOW });
      setShowAddFood(false);
    }
  };

  const handleSaveMeal = () => {
    if (selectedFoods.length > 0) {
      onAddMeal({
        name: `${selectedType} - ${selectedDay}`,
        foods: selectedFoods,
        dayOfWeek: selectedDay,
        mealType: selectedType
      });
      setSelectedFoods([]);
      setShowAddMeal(false);
    }
  };

  const toggleFoodSelection = (food: FoodItem) => {
    if (selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const getGICategory = (gi: number): GICategory => {
    if (gi <= 55) return GICategory.LOW;
    if (gi <= 69) return GICategory.MEDIUM;
    return GICategory.HIGH;
  };

  const getTranslation = (item: any) => item[language] || item.bs;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'database' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
        >
          {t.database}
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
        >
          {t.plan}
        </button>
      </div>

      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.foodName + "..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => setShowAddFood(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold"
          >
            <Plus size={20} />
            {t.addFood}
          </button>

          {showAddFood && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-4"
            >
              <h3 className="font-bold text-slate-800">{t.newFood}</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={t.foodName}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-medium text-sm"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder={t.giValue}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none font-medium pr-12 text-sm"
                      value={newFood.gi || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFood({...newFood, gi: val, category: getGICategory(val)});
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">GI</span>
                  </div>
                  <div className={`p-4 rounded-2xl flex items-center justify-center font-black text-xs ${
                    newFood.category === GICategory.LOW ? 'bg-green-100 text-green-600' : 
                    newFood.category === GICategory.MEDIUM ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {newFood.category === GICategory.LOW ? t.low : newFood.category === GICategory.MEDIUM ? t.medium : t.high}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddFood(false)} className="flex-1 py-4 font-bold text-slate-500 text-sm">Odustani</button>
                  <button onClick={handleAddFood} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 text-sm">Spremi</button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            {filteredFoods.map((food, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <GIBadge category={food.category} t={t} />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{food.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">GI: {food.gi}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => food.id && onDeleteFood(food.id)} className="p-2 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          <button 
            onClick={() => setShowAddMeal(true)}
            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Plus size={24} />
            <span>Kreiraj Plan Obroka</span>
          </button>

          {showAddMeal && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-slate-50 rounded-3xl space-y-6 border border-slate-200"
            >
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Odaberite Dan</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {days.map(day => (
                    <button 
                      key={day.key}
                      onClick={() => setSelectedDay(day.key)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${selectedDay === day.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400'}`}
                    >
                      {getTranslation(day)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Tip Obroka</label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map(type => (
                    <button 
                      key={type.key}
                      onClick={() => setSelectedType(type.key as any)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedType === type.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}
                    >
                      {getTranslation(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Odaberite Namirnice</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {foods.map(food => (
                    <button 
                      key={food.id}
                      onClick={() => toggleFoodSelection(food)}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${selectedFoods.find(sf => sf.id === food.id) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500' : 'bg-white border-transparent border'}`}
                    >
                      <span className="text-xs font-bold text-slate-700">{food.name}</span>
                      <GIBadge category={food.category} t={t} mini />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddMeal(false)} className="flex-1 py-4 font-bold text-slate-500 text-sm">Odustani</button>
                <button 
                  onClick={handleSaveMeal}
                  disabled={selectedFoods.length === 0}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 text-sm disabled:opacity-50"
                >
                  Dodaj u Jelovnik
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-8">
            {days.map(day => {
              const dayMeals = meals.filter(m => m.dayOfWeek === day.key);
              if (dayMeals.length === 0) return null;

              return (
                <div key={day.key} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-600 rounded-full" />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">{getTranslation(day)}</h3>
                  </div>
                  <div className="grid gap-3">
                    {dayMeals.map(meal => (
                      <div key={meal.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                            {getTranslation(mealTypes.find(mt => mt.key === meal.mealType) || mealTypes[0])}
                          </label>
                          <button onClick={() => meal.id && onDeleteMeal(meal.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {meal.foods.map((food, fIdx) => (
                            <span key={fIdx} className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
                              {food.name}
                            </span>
                          ))}
                        </div>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {meals.length === 0 && !showAddMeal && (
              <div className="text-center py-12 px-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Utensils size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 font-bold text-sm">
                  Nemate kreiranih obroka. Kliknite na dugme iznad da započnete planiranje jelovnika.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GIBadge({ category, t, mini }: { category: GICategory, t: any, mini?: boolean }) {
  const colors = {
    [GICategory.LOW]: 'bg-green-100 text-green-600',
    [GICategory.MEDIUM]: 'bg-orange-100 text-orange-600',
    [GICategory.HIGH]: 'bg-red-100 text-red-600',
  };

  const labels = {
    [GICategory.LOW]: t.low,
    [GICategory.MEDIUM]: t.medium,
    [GICategory.HIGH]: t.high,
  };

  return (
    <div className={`${mini ? 'px-2 py-1' : 'w-10 h-10'} rounded-xl flex items-center justify-center font-black text-[9px] uppercase tracking-tighter ${colors[category]}`}>
      {mini ? labels[category] : category}
    </div>
  );
}
