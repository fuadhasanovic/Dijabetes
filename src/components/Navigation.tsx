import React from 'react';
import { User, TrendingUp, Utensils, Activity, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: any) => void;
  translations: any;
}

export default function Navigation({ currentTab, onTabChange, translations: t }: NavigationProps) {
  const tabs = [
    { id: 'profile', icon: <User size={28} />, label: t.nav.profile },
    { id: 'glucose', icon: <TrendingUp size={28} />, label: t.nav.glucose },
    { id: 'meals', icon: <Utensils size={28} />, label: t.nav.meals },
    { id: 'activity', icon: <Activity size={28} />, label: t.nav.activity },
    { id: 'advice', icon: <HeartPulse size={28} />, label: t.nav.advice },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${currentTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${currentTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : ''}`}>
            {React.cloneElement(tab.icon as React.ReactElement, { 
              className: currentTab === tab.id ? 'scale-110' : '' 
            })}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${currentTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
            {tab.label}
          </span>
          {currentTab === tab.id && (
            <motion.div layoutId="nav-pill" className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
          )}
        </button>
      ))}
    </nav>
  );
}
