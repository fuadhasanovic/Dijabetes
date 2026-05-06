import React, { useState } from 'react';
import { Plus, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { isAfter, subDays } from 'date-fns';
import { GlucoseMeasurement, GlucoseContext } from '../types';
import { toDate } from '../lib/firebase';
import StatsCards from './GlucoseDash/StatsCards';
import MeasurementChart from './GlucoseDash/MeasurementChart';
import HistoryList from './GlucoseDash/HistoryList';

interface GlucoseDashProps {
  measurements: GlucoseMeasurement[];
  onAdd: (data: Omit<GlucoseMeasurement, 'id'>) => void;
  onNavigateToAdvice: () => void;
  translations: any;
}

export default function GlucoseDash({ measurements, onAdd, onNavigateToAdvice, translations: t }: GlucoseDashProps) {
  const [showInput, setShowInput] = useState(false);
  const [newReading, setNewReading] = useState({ level: '', context: GlucoseContext.FASTING, notes: '' });

  const contextMap: Record<string, string> = {
    [GlucoseContext.FASTING]: 'Našte (gladovanje)',
    [GlucoseContext.BEFORE_BREAKFAST]: 'Prije doručka',
    [GlucoseContext.AFTER_BREAKFAST]: 'Poslije doručka',
    [GlucoseContext.BEFORE_LUNCH]: 'Prije ručka',
    [GlucoseContext.AFTER_LUNCH]: 'Poslije ručka',
    [GlucoseContext.BEFORE_DINNER]: 'Prije večere',
    [GlucoseContext.AFTER_DINNER]: 'Poslije večere',
    [GlucoseContext.BEFORE_BED]: 'Prije spavanja',
  };

  const now = new Date();
  const last7Days = measurements.filter(m => isAfter(toDate(m.timestamp), subDays(now, 7)));
  const average7DaysValue = last7Days.length > 0 
    ? last7Days.reduce((acc, curr) => acc + curr.level, 0) / last7Days.length
    : 0;

  const isHigh = average7DaysValue > 7.0; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReading.level) {
      onAdd({ userId: '', level: parseFloat(newReading.level), context: newReading.context, timestamp: '', notes: newReading.notes });
      setNewReading({ level: '', context: GlucoseContext.FASTING, notes: '' });
      setShowInput(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-md mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Iznos (mmol/L)</label>
              <input
                type="number" step="0.1" required autoFocus placeholder="0.0"
                value={newReading.level}
                onChange={(e) => setNewReading({...newReading, level: e.target.value})}
                className="w-full text-4xl font-black bg-slate-50 p-4 rounded-2xl border-none focus:ring-0 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.context}</label>
              <select 
                value={newReading.context}
                onChange={(e) => setNewReading({...newReading, context: e.target.value as GlucoseContext})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none appearance-none font-medium text-sm"
              >
                {Object.values(GlucoseContext).map(ctx => (
                  <option key={ctx} value={ctx}>{contextMap[ctx] || ctx}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm">{t.addTitle}</button>
          </form>
        </motion.div>
      )}

      <StatsCards measurements={measurements} translations={t} />

      {isHigh && (
        <motion.div 
          onClick={onNavigateToAdvice} whileTap={{ scale: 0.98 }}
          className="p-4 bg-red-100 border border-red-200 rounded-2xl flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shrink-0"><AlertTriangle size={24} /></div>
          <div className="flex-1">
            <h4 className="font-bold text-red-900 text-sm">Povišene vrijednosti!</h4>
            <p className="text-[11px] text-red-700 leading-tight">Vaš prosjek je iznad preporučenog. Provjerite savjete odmah.</p>
          </div>
          <ChevronRight size={20} className="text-red-400" />
        </motion.div>
      )}

      <MeasurementChart measurements={measurements} />
      <HistoryList measurements={measurements} translations={t} contextMap={contextMap} />
    </div>
  );
}
