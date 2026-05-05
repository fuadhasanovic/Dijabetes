import React, { useState } from 'react';
import { Activity, Plus, TrendingUp, History, AlertTriangle, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { format, subDays, isAfter } from 'date-fns';
import { GlucoseMeasurement, GlucoseContext } from '../types';

interface GlucoseDashProps {
  measurements: GlucoseMeasurement[];
  onAdd: (data: Omit<GlucoseMeasurement, 'id'>) => void;
  onNavigateToAdvice: () => void;
}

export default function GlucoseDash({ measurements, onAdd, onNavigateToAdvice }: GlucoseDashProps) {
  const [showInput, setShowInput] = useState(false);
  const [newReading, setNewReading] = useState({
    level: '',
    context: GlucoseContext.FASTING,
    notes: '',
  });

  // Calculate Stats
  const now = new Date();
  const last7Days = measurements.filter(m => isAfter(new Date(m.timestamp), subDays(now, 7)));
  const average7Days = last7Days.length > 0 
    ? (last7Days.reduce((acc, curr) => acc + curr.level, 0) / last7Days.length).toFixed(1)
    : '0.0';

  // Simple HbA1c estimate (not medical accuracy, just representative for app)
  // Formula: (Average Plasma Glucose + 46.7) / 28.7
  // Simplified for app logic: approx (avg + 2)/2 for common ranges, but let's use the standard one
  const hba1cEstimate = last7Days.length > 0
    ? ((parseFloat(average7Days) * 18.0182 + 46.7) / 28.7).toFixed(1) // converting mmol/L to mg/dL for standard formula then result
    : '0.0';

  const isHigh = parseFloat(average7Days) > 7.0; // Simple threshold for warning

  const chartData = measurements.slice(-10).map(m => ({
    date: format(new Date(m.timestamp), 'dd.MM'),
    level: m.level,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReading.level) {
      onAdd({
        userId: '', // set by parent
        level: parseFloat(newReading.level),
        context: newReading.context,
        timestamp: '', // will be replaced by serverTimestamp in App.tsx
        notes: newReading.notes,
      });
      setNewReading({ level: '', context: GlucoseContext.FASTING, notes: '' });
      setShowInput(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Moja Glukoza</h2>
          <p className="text-slate-500 text-sm">Pratite vaše šećere redovno</p>
        </div>
        <button 
          onClick={() => setShowInput(!showInput)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 hover:scale-110 active:scale-95 transition-all group"
        >
          <Plus size={32} className={`transition-transform duration-300 ${showInput ? 'rotate-45' : 'group-hover:rotate-90'}`} />
        </button>
      </div>

      {showInput && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-white border border-slate-200 rounded-3xl shadow-md mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Iznos (mmol/L)</label>
              <input
                type="number"
                step="0.1"
                required
                autoFocus
                placeholder="0.0"
                value={newReading.level}
                onChange={(e) => setNewReading({...newReading, level: e.target.value})}
                className="w-full text-4xl font-black bg-slate-50 p-4 rounded-2xl border-none focus:ring-0 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vrijeme mjerenja</label>
              <select 
                value={newReading.context}
                onChange={(e) => setNewReading({...newReading, context: e.target.value as GlucoseContext})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none appearance-none font-medium"
              >
                {Object.values(GlucoseContext).map(ctx => (
                  <option key={ctx} value={ctx}>{ctx.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">
              Zabilježi Mjerenje
            </button>
          </form>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl">
          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">7-Dnevni Prosjek</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-blue-900">{average7Days}</span>
            <span className="text-xs font-bold text-blue-600 uppercase">mmol/L</span>
          </div>
        </div>
        <div className="p-5 bg-purple-50 border border-purple-100 rounded-3xl">
          <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-2">HbA1c Procjena</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-purple-900">{hba1cEstimate}</span>
            <span className="text-xs font-bold text-purple-600 uppercase">%</span>
          </div>
        </div>
      </div>

      {isHigh && (
        <motion.div 
          onClick={onNavigateToAdvice}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-red-100 border border-red-200 rounded-2xl flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-red-900 text-sm">Povišene vrijednosti!</h4>
            <p className="text-[11px] text-red-700 leading-tight">Vaš prosjek je iznad preporučenog. Provjerite savjete odmah.</p>
          </div>
          <ChevronRight size={20} className="text-red-400" />
        </motion.div>
      )}

      {/* Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4 px-2">
          <TrendingUp size={18} className="text-slate-400" />
          <h3 className="font-bold text-sm text-slate-800">Trend zadnjih mjerenja</h3>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={7} stroke="#EF4444" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="#2563EB" 
                strokeWidth={3} 
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-2">
          <History size={18} className="text-slate-400" />
          <h3 className="font-bold text-sm text-slate-800">Historija</h3>
        </div>
        {measurements.slice().reverse().map((m, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm capitalize">{m.context.replace('_', ' ')}</p>
                <p className="text-[10px] text-slate-400">{format(new Date(m.timestamp), 'dd.MM.yyyy HH:mm')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black text-lg ${m.level > 7 ? 'text-red-500' : 'text-green-500'}`}>
                {m.level}
                <span className="text-[10px] ml-1 opacity-50">mmol/L</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
