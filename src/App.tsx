import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, Globe } from 'lucide-react';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import Splash from './components/Splash';
import ProfileForm from './components/ProfileForm';
import GlucoseDash from './components/GlucoseDash';
import MealPlanner from './components/MealPlanner';
import ActivityLogs from './components/ActivityLogs';
import AdviceHub from './components/AdviceHub';
import Navigation from './components/Navigation';

import { useGlucoData } from './hooks/useGlucoData';
import { SUPPORTED_LANGUAGES } from './types';
import { translations, FLAGS } from './lib/translations';

type Tab = 'profile' | 'glucose' | 'meals' | 'activity' | 'advice';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>('glucose');
  const [language, setLanguage] = useState('bs');

  const {
    user, authLoading, profile, measurements, foods, activities, savedMeals, menuPlans, actions
  } = useGlucoData();

  const t = translations[language] || translations.bs;

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } 
    catch (err) { console.error("Sign in error:", err); }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  if (showSplash) return <Splash onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative shadow-2xl overflow-hidden">
        
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none flex items-baseline gap-1">
                GlucoGuard
                <span className="text-[9px] text-blue-600 font-black bg-blue-50 px-1.5 py-0.5 rounded-full">v2.1</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-serif italic mt-0.5">{profile?.name || (user ? 'Tarik Hasanović' : 'Lokalni Korisnik')}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {user ? (
              <button onClick={handleLogout} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Logout</button>
            ) : (
              <button onClick={handleSignIn} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Login</button>
            )}
            
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                <span className="text-xl">{FLAGS[language]}</span>
                <Globe size={14} className="text-slate-400" />
              </div>
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>{FLAGS[lang.code]} {lang.name}</span>
                    {language === lang.code && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
            <button className="p-2 text-slate-400"><Menu size={24} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'profile' && (
                <ProfileForm 
                  initialData={profile} 
                  onSave={actions.handleSaveProfile} 
                  translations={t.profile} 
                  fullData={{ profile, measurements, foods, activities, savedMeals, menuPlans }}
                  onImport={actions.handleImportData}
                />
              )}
              {currentTab === 'glucose' && (
                <GlucoseDash 
                  measurements={measurements} 
                  onAdd={actions.handleAddMeasurement} 
                  onNavigateToAdvice={() => setCurrentTab('advice')}
                  translations={t.glucose}
                />
              )}
              {currentTab === 'meals' && (
                <MealPlanner 
                  foods={foods} 
                  savedMeals={savedMeals}
                  menuPlans={menuPlans}
                  onAddFood={actions.handleAddFood}
                  onAddSavedMeal={actions.handleAddSavedMeal}
                  onAddMenuPlan={actions.handleAddMenuPlan}
                  onDeleteFood={(id) => actions.handleDeleteDoc('foodDatabase', id)}
                  onDeleteSavedMeal={(id) => actions.handleDeleteDoc('savedMeals', id)}
                  onDeleteMenuPlan={(id) => actions.handleDeleteDoc('menuPlans', id)}
                  translations={t.meals}
                  language={language}
                />
              )}
              {currentTab === 'activity' && <ActivityLogs logs={activities} onAdd={actions.handleAddActivity} translations={t.activity} />}
              {currentTab === 'advice' && <AdviceHub />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} translations={t} />
      </div>
    </div>
  );
}



