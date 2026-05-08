import React, { useState, useRef } from 'react';
import { Search, Plus, Trash2, Upload, FileJson, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, GICategory } from '../../types';
import { fuzzyMatch } from '../../lib/searchUtils';

interface FoodDatabaseProps {
  foods: FoodItem[];
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
  onDeleteFood: (id: string) => void;
  translations: any;
}

export default function FoodDatabase({ foods, onAddFood, onDeleteFood, translations: t }: FoodDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', gi: 0, category: GICategory.LOW });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFoods = foods.filter(f => fuzzyMatch(f.name, searchTerm));

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let text = event.target?.result as string;
        
        // Remove Byte Order Mark (BOM) if exists
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.substring(1);
        }

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item.name && typeof item.gi === 'number') {
                onAddFood({
                  name: item.name.trim(),
                  gi: item.gi,
                  category: getGICategory(item.gi)
                });
              }
            });
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split(/\r?\n/);
          lines.forEach((line, index) => {
            // Skip header if it looks like one
            if (index === 0 && (line.toLowerCase().includes('naziv') || line.toLowerCase().includes('name'))) return;
            
            const parts = line.split(/[,;]/); // Support both comma and semicolon separators
            if (parts.length >= 2) {
              const name = parts[0].trim().replace(/^["']|["']$/g, ''); // Remove quotes
              const giStr = parts[1].trim().replace(/^["']|["']$/g, '');
              const gi = parseInt(giStr);
              
              if (name && !isNaN(gi)) {
                onAddFood({
                  name: name,
                  gi: gi,
                  category: getGICategory(gi)
                });
              }
            }
          });
        }
        setShowUpload(false);
      } catch (err) {
        console.error('Error parsing file:', err);
        alert('Greška pri učitavanju fajla. Provjerite format i pokušajte ponovo (preporučeno UTF-8 kodiranje).');
      }
    };
    
    // Most modern CSVs are UTF-8, but many Windows/Excel exports are Windows-1250
    // Try to detect or default to UTF-8
    reader.readAsText(file, 'UTF-8');
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
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm focus:outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => { setShowAddFood(true); setShowUpload(false); }}
          className="py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <Plus size={20} />
          {t.addFood}
        </button>
        <button 
          onClick={() => { setShowUpload(true); setShowAddFood(false); }}
          className="py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <Upload size={20} />
          {t.uploadFoods}
        </button>
      </div>

      <AnimatePresence>
        {showAddFood && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4 mb-4">
              <h3 className="font-black text-blue-900 border-l-4 border-blue-600 pl-3 uppercase text-[10px] tracking-widest">{t.newFood}</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={t.foodName}
                    className="w-full p-4 bg-white rounded-2xl border-none font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                  />
                  {/* Autocomplete Suggestions */}
                  {newFood.name.length >= 2 && foods.some(f => fuzzyMatch(f.name, newFood.name) && f.id !== 'temp') && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-40 overflow-y-auto p-2">
                      <p className="px-3 py-1 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Pronađene slične namirnice:</p>
                      {foods
                        .filter(f => fuzzyMatch(f.name, newFood.name))
                        .slice(0, 5)
                        .map(sf => (
                          <button
                            key={sf.id}
                            type="button"
                            onClick={() => {
                              setNewFood({ name: sf.name, gi: sf.gi, category: sf.category });
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-xl flex justify-between items-center group transition-colors"
                          >
                            <span className="text-xs font-bold text-slate-700">{sf.name}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                              sf.category === 'NI' ? 'bg-green-100 text-green-700' :
                              sf.category === 'SI' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>GI: {sf.gi}</span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.gi}</p>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-white rounded-2xl border-none font-black text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={newFood.gi || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setNewFood({...newFood, gi: val, category: getGICategory(val)});
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kategorija</p>
                    <div className={`w-full p-4 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${
                      newFood.category === GICategory.LOW ? 'bg-green-500 text-white' : 
                      newFood.category === GICategory.MEDIUM ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {newFood.category === GICategory.LOW ? 'NISKI' : newFood.category === GICategory.MEDIUM ? 'SREDNJI' : 'VISOK'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddFood(false)} className="flex-1 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.cancel}</button>
                  <button onClick={handleAddFood} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200">{t.save}</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showUpload && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] space-y-6 mb-4 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Upload size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Prenesi bazu namirnica</h3>
                    <p className="text-[10px] text-slate-400">Podržani formati: .JSON, .CSV</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-6 group hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileType size={18} className="text-blue-400" />
                      <span className="text-xs font-bold">Odaberi fajl...</span>
                    </div>
                    <Plus size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                  <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Uputstvo za format:</p>
                  <p className="text-[9px] text-slate-400 leading-relaxed uppercase">
                    CSV: Naziv, GI (Prva linija je zaglavlje)<br/>
                    JSON: Array objekata {"{ \"name\": \"Nutela\", \"gi\": 55 }"}
                  </p>
                </div>

                <button onClick={() => setShowUpload(false)} className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  {t.cancel}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredFoods.length > 0 ? filteredFoods.map((food) => (
          <motion.div 
            layout
            key={food.id} 
            className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] border shadow-sm ${
                food.category === GICategory.LOW ? 'bg-green-500 text-white border-green-400' :
                food.category === GICategory.MEDIUM ? 'bg-orange-500 text-white border-orange-400' :
                'bg-red-500 text-white border-red-400'
              }`}>
                {food.category}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{food.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-black tracking-widest">GI: {food.gi}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    food.category === GICategory.LOW ? 'bg-green-500' :
                    food.category === GICategory.MEDIUM ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            </div>
            <button 
              onClick={() => food.id && onDeleteFood(food.id)} 
              className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        )) : searchTerm && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <Search size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Nema rezultata za "{searchTerm}"</p>
              <button 
                onClick={() => {
                  setNewFood({ name: searchTerm, gi: 0, category: GICategory.LOW });
                  setShowAddFood(true);
                  setShowUpload(false);
                }}
                className="mt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                + Dodaj "{searchTerm}" u bazu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
