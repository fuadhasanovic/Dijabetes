import React, { useState } from 'react';
import { Utensils, Search, Plus, Trash2, Calendar, Layout, Salad, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, GICategory, SavedMeal, MenuPlan, DayAssignment } from '../types';

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
  foods, 
  savedMeals, 
  menuPlans, 
  onAddFood, 
  onAddSavedMeal, 
  onAddMenuPlan, 
  onDeleteFood, 
  onDeleteSavedMeal, 
  onDeleteMenuPlan, 
  translations: t, 
  language 
}: MealPlannerProps) {
  const [activeTab, setActiveTab] = useState<MealTab>('database');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Food States
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', gi: 0, category: GICategory.LOW });

  // Meal States (Obroci)
  const [showCreateMeal, setShowCreateMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  // Plan States (Jelovnik)
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [assignments, setAssignments] = useState<Record<string, DayAssignment[]>>({});
  const [activeDayForPlan, setActiveDayForPlan] = useState('Monday');

  const days = [
    { key: 'Monday', bs: 'Ponedjeljak', en: 'Monday' },
    { key: 'Tuesday', bs: 'Utorak', en: 'Tuesday' },
    { key: 'Wednesday', bs: 'Srijeda', en: 'Wednesday' },
    { key: 'Thursday', bs: 'Četvrtak', en: 'Thursday' },
    { key: 'Friday', bs: 'Petak', en: 'Friday' },
    { key: 'Saturday', bs: 'Subota', en: 'Saturday' },
    { key: 'Sunday', bs: 'Nedjelja', en: 'Sunday' },
  ];

  const mealTypes = [
    { key: 'breakfast', bs: 'Doručak', en: 'Breakfast' },
    { key: 'lunch', bs: 'Ručak', en: 'Lunch' },
    { key: 'dinner', bs: 'Večera', en: 'Dinner' },
    { key: 'snack', bs: 'Užina', en: 'Snack' },
  ];

  const getTranslation = (item: any) => item[language] || item.bs || item.key;

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
    if (newMealName && selectedFoods.length > 0) {
      onAddSavedMeal({
        name: newMealName,
        foods: selectedFoods
      });
      setNewMealName('');
      setSelectedFoods([]);
      setShowCreateMeal(false);
      setActiveTab('meals');
    }
  };

  const handleSavePlan = () => {
    if (newPlanName) {
      onAddMenuPlan({
        name: newPlanName,
        assignments
      });
      setNewPlanName('');
      setAssignments({});
      setShowCreatePlan(false);
      setActiveTab('plan');
    }
  };

  const toggleFoodForMeal = (food: FoodItem) => {
    if (selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const toggleMealForPlan = (day: string, meal: SavedMeal, type: 'breakfast'|'lunch'|'dinner'|'snack') => {
    const dayAssignments = assignments[day] || [];
    const existing = dayAssignments.find(a => a.mealType === type);
    
    let newDayAssignments;
    if (existing?.mealId === meal.id) {
      newDayAssignments = dayAssignments.filter(a => a.mealType !== type);
    } else {
      newDayAssignments = [
        ...dayAssignments.filter(a => a.mealType !== type),
        { mealId: meal.id!, mealName: meal.name, mealType: type }
      ];
    }

    setAssignments({
      ...assignments,
      [day]: newDayAssignments
    });
  };

  const getGICategory = (gi: number): GICategory => {
    if (gi <= 55) return GICategory.LOW;
    if (gi <= 69) return GICategory.MEDIUM;
    return GICategory.HIGH;
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="text-slate-500 text-sm">{t.subtitle}</p>
      </div>

      {/* Main Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        {(['database', 'meals', 'plan'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setShowCreateMeal(false); setShowCreatePlan(false); }}
            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            {tab === 'database' ? t.database : tab === 'meals' ? t.meals : t.plan}
          </button>
        ))}
      </div>

      {/* --- NAMIRNICE TAB --- */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
            />
          </div>

          {!showAddFood ? (
            <button 
              onClick={() => setShowAddFood(true)}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold text-sm"
            >
              <Plus size={20} />
              {t.addFood}
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-4">
              <h3 className="font-bold text-blue-900 text-sm">{t.newFood}</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={t.foodName}
                  className="w-full p-4 bg-white rounded-2xl border-none font-medium text-sm shadow-sm"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder={t.giValue}
                      className="w-full p-4 bg-white rounded-2xl border-none font-medium pr-12 text-sm shadow-sm"
                      value={newFood.gi || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setNewFood({...newFood, gi: val, category: getGICategory(val)});
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">GI</span>
                  </div>
                  <div className={`p-4 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${
                    newFood.category === GICategory.LOW ? 'bg-green-500 text-white' : 
                    newFood.category === GICategory.MEDIUM ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {newFood.category === GICategory.LOW ? t.low : newFood.category === GICategory.MEDIUM ? t.medium : t.high}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddFood(false)} className="flex-1 py-4 font-bold text-slate-500 text-xs uppercase tracking-widest">{t.cancel || 'Odustani'}</button>
                  <button onClick={handleAddFood} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 text-xs uppercase tracking-widest">{t.save}</button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {filteredFoods.map((food) => (
              <div key={food.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <GIBadge category={food.category} t={t} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight">{food.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">GI: {food.gi}</p>
                  </div>
                </div>
                <button onClick={() => food.id && onDeleteFood(food.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- OBROCI TAB --- */}
      {activeTab === 'meals' && (
        <div className="space-y-4">
          {!showCreateMeal ? (
            <button 
              onClick={() => setShowCreateMeal(true)}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
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
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500/20"
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
                      <p className={`text-[10px] font-bold truncate ${selectedFoods.find(sf => sf.id === food.id) ? 'text-white' : 'text-slate-700'}`}>{food.name}</p>
                      <p className="text-[8px] opacity-70">GI: {food.gi}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreateMeal(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.cancel}</button>
                <button 
                  onClick={handleSaveMeal}
                  disabled={!newMealName || selectedFoods.length === 0}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {t.save}
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid gap-3">
            {savedMeals.map((meal) => (
              <div key={meal.id} className="p-5 bg-white border border-slate-100 rounded-3xl group shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <Salad size={18} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{meal.name}</h4>
                  </div>
                  <button onClick={() => meal.id && onDeleteSavedMeal(meal.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
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
      )}

      {/* --- JELOVNIK TAB --- */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          {!showCreatePlan ? (
            <button 
              onClick={() => setShowCreatePlan(true)}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              <Plus size={20} />
              {t.addPlan}
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border border-slate-200 rounded-[32px] space-y-6 shadow-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.planName}</label>
                <input 
                  type="text" 
                  placeholder={t.planName}
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {days.map(day => (
                    <button 
                      key={day.key}
                      onClick={() => setActiveDayForPlan(day.key)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeDayForPlan === day.key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {getTranslation(day)}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
                  {mealTypes.map(type => {
                    const assigned = (assignments[activeDayForPlan] || []).find(a => a.mealType === type.key);
                    return (
                      <div key={type.key} className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(type)}</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {savedMeals.map(meal => (
                            <button 
                              key={meal.id}
                              onClick={() => toggleMealForPlan(activeDayForPlan, meal, type.key as any)}
                              className={`px-3 py-2 rounded-lg border text-[9px] font-bold whitespace-nowrap transition-all ${assigned?.mealId === meal.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                              {meal.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreatePlan(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.cancel}</button>
                <button 
                  onClick={handleSavePlan}
                  disabled={!newPlanName || Object.keys(assignments).length === 0}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {t.save}
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid gap-4">
            {menuPlans.map((plan) => (
              <div key={plan.id} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600" size={20} />
                    <h4 className="font-bold text-slate-900">{plan.name}</h4>
                  </div>
                  <button onClick={() => plan.id && onDeleteMenuPlan(plan.id)} className="p-2 text-slate-100 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {days.map(day => {
                    const dayAsgn = plan.assignments[day.key];
                    if (!dayAsgn || dayAsgn.length === 0) return null;
                    return (
                      <div key={day.key} className="flex gap-4">
                        <div className="w-20 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">{getTranslation(day)}</div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {dayAsgn.map((asgn, aIdx) => (
                            <span key={aIdx} className="px-2 py-1 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-lg border border-blue-100">
                              {asgn.mealName}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GIBadge({ category, t, mini }: { category: GICategory, t: any, mini?: boolean }) {
  const colors = {
    [GICategory.LOW]: 'bg-green-100 text-green-600 border-green-200',
    [GICategory.MEDIUM]: 'bg-orange-100 text-orange-600 border-orange-200',
    [GICategory.HIGH]: 'bg-red-100 text-red-600 border-red-200',
  };

  const labels = {
    [GICategory.LOW]: t.low,
    [GICategory.MEDIUM]: t.medium,
    [GICategory.HIGH]: t.high,
  };

  return (
    <div className={`rounded-xl flex items-center justify-center font-black text-[9px] uppercase tracking-tighter border ${mini ? 'px-2 py-1' : 'w-10 h-10'} ${colors[category]}`}>
      {mini ? labels[category] : category}
    </div>
  );
}
