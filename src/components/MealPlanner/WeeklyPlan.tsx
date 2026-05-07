import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuPlan, SavedMeal, DayAssignment, MealType } from '../../types';

interface WeeklyPlanProps {
  savedMeals: SavedMeal[];
  menuPlans: MenuPlan[];
  onAddMenuPlan: (plan: Omit<MenuPlan, 'id'>) => void;
  onDeleteMenuPlan: (id: string) => void;
  translations: any;
  language: string;
}

export default function WeeklyPlan({ savedMeals, menuPlans, onAddMenuPlan, onDeleteMenuPlan, translations: t, language }: WeeklyPlanProps) {
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

  const mealTypeLabels: Record<MealType, string> = {
    [MealType.BREAKFAST]: t.breakfast,
    [MealType.SNACK]: t.snack,
    [MealType.LUNCH]: t.lunch,
    [MealType.APPETIZER]: t.appetizer,
    [MealType.DINNER]: t.dinner,
  };

  const getTranslation = (item: any) => item[language] || item.bs || item.key;

  const handleSavePlan = () => {
    if (newPlanName) {
      onAddMenuPlan({ name: newPlanName, assignments });
      setNewPlanName('');
      setAssignments({});
      setShowCreatePlan(false);
    }
  };

  const toggleMealForPlan = (day: string, meal: SavedMeal, type: MealType) => {
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
    setAssignments({ ...assignments, [day]: newDayAssignments });
  };

  return (
    <div className="space-y-4">
      {!showCreatePlan ? (
        <button 
          onClick={() => setShowCreatePlan(true)}
          className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="p-2 bg-white/10 rounded-xl">
            <BookOpen size={20} />
          </div>
          {t.addPlan}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white border border-slate-200 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
              <LayoutDashboard size={24} className="text-blue-600" />
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Planiranje jelovnika</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.planName}</label>
              <input 
                type="text" 
                placeholder={t.planName}
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {days.map(day => (
                  <button 
                    key={day.key}
                    onClick={() => setActiveDayForPlan(day.key)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${activeDayForPlan === day.key ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {getTranslation(day)}
                  </button>
                ))}
              </div>

              <div className="space-y-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                {Object.values(MealType).map(type => {
                  const assigned = (assignments[activeDayForPlan] || []).find(a => a.mealType === type);
                  return (
                    <div key={type} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-blue-600" />
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{mealTypeLabels[type]}</label>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {savedMeals.map(meal => (
                          <button 
                            key={meal.id}
                            onClick={() => toggleMealForPlan(activeDayForPlan, meal, type)}
                            className={`px-4 py-2 rounded-xl border text-[10px] font-bold whitespace-nowrap transition-all ${assigned?.mealId === meal.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'}`}
                          >
                            {meal.name}
                          </button>
                        ))}
                        {savedMeals.length === 0 && (
                          <p className="text-[10px] text-slate-400 font-medium italic">Nema snimljenih obroka...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowCreatePlan(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">{t.cancel}</button>
              <button 
                onClick={handleSavePlan}
                disabled={!newPlanName || Object.keys(assignments).length === 0}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 disabled:opacity-50 transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {menuPlans.map((plan) => (
            <motion.div 
              layout
              key={plan.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">{plan.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strukturirani Jelovnik</p>
                  </div>
                </div>
                <button 
                  onClick={() => plan.id && onDeleteMenuPlan(plan.id)} 
                  className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-4 relative z-10">
                {days.map(day => {
                  const dayAsgn = plan.assignments[day.key];
                  if (!dayAsgn || dayAsgn.length === 0) return null;
                  return (
                    <div key={day.key} className="flex gap-6 items-start p-4 bg-slate-50/50 rounded-2xl border border-slate-50 transition-colors hover:bg-slate-50">
                      <div className="w-16 pt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(day).substring(0, 3)}</span>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {dayAsgn.map((asgn, aIdx) => (
                          <div key={aIdx} className="group/item relative">
                            <span className="px-3 py-1.5 bg-white border border-slate-100 text-slate-700 text-[10px] font-bold rounded-xl shadow-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {asgn.mealName}
                            </span>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {mealTypeLabels[asgn.mealType]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-100 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
