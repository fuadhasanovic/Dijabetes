import React, { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem, GICategory } from '../../types';

interface FoodDatabaseProps {
  foods: FoodItem[];
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
  onDeleteFood: (id: string) => void;
  translations: any;
}

export default function FoodDatabase({ foods, onAddFood, onDeleteFood, translations: t }: FoodDatabaseProps) {
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder={t.search} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm"
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
              <input 
                type="number" 
                className="w-full p-4 bg-white rounded-2xl border-none font-medium text-sm shadow-sm"
                value={newFood.gi || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setNewFood({...newFood, gi: val, category: getGICategory(val)});
                }}
              />
              <div className={`p-4 rounded-2xl flex items-center justify-center font-black text-xs ${
                newFood.category === GICategory.LOW ? 'bg-green-500 text-white' : 
                newFood.category === GICategory.MEDIUM ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {newFood.category}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddFood(false)} className="flex-1 py-4 font-bold text-slate-500 text-xs uppercase">{t.cancel}</button>
              <button onClick={handleAddFood} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase">{t.save}</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredFoods.map((food) => (
          <div key={food.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[9px] border ${
                food.category === GICategory.LOW ? 'bg-green-100 text-green-600 border-green-200' :
                food.category === GICategory.MEDIUM ? 'bg-orange-100 text-orange-600 border-orange-200' :
                'bg-red-100 text-red-600 border-red-200'
              }`}>
                {food.category}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-tight">{food.name}</p>
                <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase">GI: {food.gi}</p>
              </div>
            </div>
            <button onClick={() => food.id && onDeleteFood(food.id)} className="p-2 text-slate-200 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
