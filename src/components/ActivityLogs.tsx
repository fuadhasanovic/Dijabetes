import React, { useState } from 'react';
import { Footprints, Clock, Flame, Plus, ChevronRight, BarChart2, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ActivityLog, ActivityType } from '../types';

interface ActivityLogsProps {
  logs: ActivityLog[];
  onAdd: (log: Omit<ActivityLog, 'id'>) => void;
}

export default function ActivityLogs({ logs, onAdd }: ActivityLogsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newLog, setNewLog] = useState({
    type: ActivityType.WALKING,
    duration: 30,
    intensity: 'medium' as 'low'|'medium'|'high',
  });

  const calculateCalories = (type: ActivityType, duration: number, intensity: string) => {
    // MET values: Walking (3.5), Running (8.0), Cycling (6.0), Exercise (5.0)
    const baseMET = {
      [ActivityType.WALKING]: 3.5,
      [ActivityType.RUNNING]: 8.0,
      [ActivityType.CYCLING]: 6.0,
      [ActivityType.EXERCISE]: 5.0,
      [ActivityType.OTHER]: 4.0,
    }[type];

    const intensityMultiplier = { low: 0.8, medium: 1.0, high: 1.3 }[intensity as 'low'|'medium'|'high'];
    // Calorie formula: (MET * 3.5 * weight_kg / 200) * duration_min
    // Using average weight 80kg if not specified
    const weight = 80; 
    return Math.round((baseMET * intensityMultiplier * 3.5 * weight / 200) * duration);
  };

  const currentDayCalories = logs
    .filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = calculateCalories(newLog.type, newLog.duration, newLog.intensity);
    onAdd({
      userId: '', // set by parent
      type: newLog.type,
      duration: newLog.duration,
      intensity: newLog.intensity,
      caloriesBurned: calories,
      timestamp: '', // will be set by serverTimestamp in App.tsx
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Aktivnosti</h2>
          <p className="text-slate-500 text-sm">Pratite vašu potrošnju energije</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <BarChart2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 bg-orange-600 rounded-3xl text-white shadow-xl shadow-orange-200 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest mb-1">Danas potrošeno</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black">{currentDayCalories}</span>
              <span className="text-sm font-bold opacity-70 uppercase tracking-tighter">kcal</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Zap size={32} className="text-white fill-white" />
          </div>
        </div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      {!showAdd ? (
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full py-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-900 font-bold shadow-sm hover:bg-slate-50 transition-all"
        >
          <Plus size={20} />
          Zabilježi Aktivnost
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Vrsta Aktivnosti</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(ActivityType).map(type => (
                  <button 
                    key={type}
                    onClick={() => setNewLog({...newLog, type})}
                    className={`p-3 rounded-xl text-xs font-bold capitalize transition-all ${newLog.type === type ? 'bg-orange-600 text-white shadow-inner' : 'bg-slate-50 text-slate-500'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Trajanje (min)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-black text-xl text-center"
                  value={newLog.duration}
                  onChange={(e) => setNewLog({...newLog, duration: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Intenzitet</label>
                <div className="flex gap-1">
                  {['low', 'medium', 'high'].map(i => (
                    <button 
                      key={i}
                      onClick={() => setNewLog({...newLog, intensity: i as any})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase ${newLog.intensity === i ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {i[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-4 font-bold text-slate-400">Poništi</button>
              <button 
                onClick={handleSubmit}
                className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20"
              >
                Spremi
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Logs */}
      <div className="space-y-3">
        {logs.slice().reverse().map((log, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-orange-600">
                <ActivityIcon type={log.type} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm capitalize">{log.type}</p>
                <div className="flex gap-2 items-center">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase"><Clock size={10} /> {log.duration} MIN</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className={`text-[10px] font-bold uppercase ${log.intensity === 'high' ? 'text-red-500' : 'text-slate-400'}`}>{log.intensity}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900 flex items-center justify-end gap-1">
                {log.caloriesBurned}
                <Flame size={14} className="text-orange-500" />
              </p>
              <p className="text-[10px] text-slate-400">KCALS</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: ActivityType }) {
  switch (type) {
    case ActivityType.WALKING: return <Footprints size={24} />;
    case ActivityType.RUNNING: return <Footprints size={24} className="rotate-12" />;
    case ActivityType.CYCLING: return <Zap size={24} />;
    case ActivityType.EXERCISE: return <Zap size={24} />;
    default: return <ActivityTypeIcon type={type} />;
  }
}

function ActivityTypeIcon({ type }: { type: any }) {
  return <Zap size={24} />;
}
