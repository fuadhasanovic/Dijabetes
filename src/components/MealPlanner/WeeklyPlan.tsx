import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuPlan, SavedMeal, DayAssignment } from '../../types';

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

  const mealTypes = [
    { key: 'breakfast', bs: 'Doručak', en: 'Breakfast' },
    { key: 'lunch', bs: 'Ručak', en: 'Lunch' },
    { key: 'dinner', bs: 'Večera', en: 'Dinner' },
    { key: 'snack', bs: 'Užina', en: 'Snack' },
  ];

  const getTranslation = (item: any) => item[language] || item.bs || item.key;

  const handleSavePlan = () => {
    if (newPlanName) {
      onAddMenuPlan({ name: newPlanName, assignments });
      setNewPlanName('');
      setAssignments({});
      setShowCreatePlan(false);
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
    setAssignments({ ...assignments, [day]: newDayAssignments });
  };

  return (
    <div className="space-y-4">
      {!showCreatePlan ? (
        <button 
          onClick={() => setShowCreatePlan(true)}
          className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
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
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {days.map(day => (
                <button 
                  key={day.key}
                  onClick={() => setActiveDayForPlan(day.key)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 ${activeDayForPlan === day.key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
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
                          className={`px-3 py-2 rounded-lg border text-[9px] font-bold whitespace-nowrap ${assigned?.mealId === meal.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
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
            <button onClick={() => setShowCreatePlan(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase">{t.cancel}</button>
            <button 
              onClick={handleSavePlan}
              disabled={!newPlanName || Object.keys(assignments).length === 0}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase disabled:opacity-50"
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
              <button onClick={() => plan.id && onDeleteMenuPlan(plan.id)} className="p-2 text-slate-100 hover:text-red-500">
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
          </div>
        ))}
      </div>
    </div>
  );
}
