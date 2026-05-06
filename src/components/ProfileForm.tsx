import React, { useState, useEffect } from 'react';
import { User, Ruler, Weight, Info, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  initialData?: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => void;
  translations: any;
}

export default function ProfileForm({ initialData, onSave, translations: t }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || 0,
    weight: initialData?.weight || 0,
    height: initialData?.height || 0,
  });

  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; advice: string } | null>(null);

  useEffect(() => {
    if (formData.weight > 0 && formData.height > 0) {
      const heightInMeters = formData.height / 100;
      const bmi = parseFloat((formData.weight / (heightInMeters * heightInMeters)).toFixed(1));
      
      let category = '';
      let advice = '';

      if (bmi < 18.5) {
        category = t.bmiCategories.underweight;
        advice = t.bmiAdvice.underweight;
      } else if (bmi < 25) {
        category = t.bmiCategories.normal;
        advice = t.bmiAdvice.normal;
      } else if (bmi < 30) {
        category = t.bmiCategories.overweight;
        advice = t.bmiAdvice.overweight;
      } else {
        category = t.bmiCategories.obese;
        advice = t.bmiAdvice.obese;
      }

      setBmiResult({ bmi, category, advice });
    } else {
      setBmiResult(null);
    }
  }, [formData.weight, formData.height, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bmiResult) {
      onSave({
        ...formData,
        bmi: bmiResult.bmi,
        bmiCategory: bmiResult.category,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{t.name}</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.age}</label>
            <input
              type="number"
              required
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none font-medium text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.weight}</label>
            <input
              type="number"
              required
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none font-medium text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.height}</label>
            <input
              type="number"
              required
              value={formData.height || ''}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none font-medium text-sm"
            />
          </div>
        </div>

        {bmiResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{t.bmi}</p>
                  <h3 className="text-4xl font-black">{bmiResult.bmi}</h3>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold backdrop-blur-md uppercase tracking-widest">
                  {bmiResult.category}
                </div>
              </div>
              <div className="flex gap-2">
                <Info size={16} className="shrink-0 text-blue-400" />
                <p className="text-sm text-slate-300 leading-relaxed italic">{bmiResult.advice}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg mt-6"
        >
          <Save size={20} />
          {t.saveProfile}
        </button>
      </form>
    </div>
  );
}
