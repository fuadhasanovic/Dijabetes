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
}

export default function MealPlanner({ foods, meals, onAddFood, onAddMeal, onDeleteFood, onDeleteMeal }: MealPlannerProps) {
  const [activeTab, setActiveTab] = useState<'database' | 'menu'>('database');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', gi: 0, category: GICategory.LOW });

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFood.name && newFood.gi >= 0) {
      onAddFood(newFood);
      setNewFood({ name: '', gi: 0, category: GICategory.LOW });
      setShowAddFood(false);
    }
  };

  const getGICategory = (gi: number): GICategory => {
    if (gi <= 55) return GICategory.LOW;
    if (gi <= 69) return GICategory.MEDIUM;
    return GICategory.HIGH;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Obroci & GI</h2>
          <p className="text-slate-500 text-sm">Praniranje ishrane prema indeksu</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'database' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
        >
          Baza Namirnica
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
        >
          Sedmični Jelovnik
        </button>
      </div>

      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pretraži namirnice..." 
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
            Dodaj novu namirnicu
          </button>

          {showAddFood && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-4"
            >
              <h3 className="font-bold text-slate-800">Nova Namirnica</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Naziv (npr. Hljeb Raževni)"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-medium"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="GI Iznos"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none font-medium pr-12"
                      value={newFood.gi || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFood({...newFood, gi: val, category: getGICategory(val)});
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">GI</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600">
                    {newFood.category}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddFood(false)} className="flex-1 py-4 font-bold text-slate-500">Odustani</button>
                  <button onClick={handleAddFood} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">Spremi</button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            {filteredFoods.map((food, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <GIBadge category={food.category} />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{food.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Iznos: {food.gi} • {food.category === 'NI' ? 'Niski Indeks' : food.category === 'SI' ? 'Srednji Indeks' : 'Visoki Indeks'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-300 hover:text-slate-600">
                    <Edit2 size={16} />
                  </button>
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
        <div className="flex items-center justify-center h-64 text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div>
            <Utensils size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 font-medium">Jelovnik je uskoro dostupan u punoj verziji. Ovde ćete moći kreirati dnevne i sedmične planove obroka.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GIBadge({ category }: { category: GICategory }) {
  const colors = {
    [GICategory.LOW]: 'bg-green-100 text-green-600',
    [GICategory.MEDIUM]: 'bg-orange-100 text-orange-600',
    [GICategory.HIGH]: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${colors[category]}`}>
      {category}
    </div>
  );
}
