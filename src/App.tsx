import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, Globe, X, LogOut, User, Settings } from 'lucide-react';
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
  const [acceptedTerms, setAcceptedTerms] = useState(() => localStorage.getItem('gluco_terms_accepted') === 'true');
  const [language, setLanguage] = useState('bs');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    user, authLoading, profile, measurements, foods, activities, savedMeals, menuPlans, actions
  } = useGlucoData();

  const t = translations[language] || translations.bs;

  const handleAcceptTerms = () => {
    localStorage.setItem('gluco_terms_accepted', 'true');
    setAcceptedTerms(true);
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try { 
      await signInWithPopup(auth, provider); 
    } catch (err: any) { 
      if (err.code === 'auth/popup-closed-by-user') {
        // Silently ignore or show a gentle notice
        console.log('Prijava zatvorena od strane korisnika');
      } else {
        console.error("Sign in error:", err); 
      }
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  if (showSplash) return <Splash onComplete={() => setShowSplash(false)} />;

  if (!acceptedTerms) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12">
            <Shield size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">GlucoGuard <span className="text-blue-500">3.2</span></h1>
            <p className="text-slate-400 font-medium leading-relaxed px-4">{t.about.description}</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-white/5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">{t.about.version}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Shield size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">Fuad Hasanović, dipl.ing.informatike</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <Globe size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">fhasanovic@gmail.com</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 py-4">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button 
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${language === lang.code ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-500/50' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {FLAGS[lang.code]}
              </button>
            ))}
          </div>

          <button 
            onClick={handleAcceptTerms}
            className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl"
          >
            {t.about.accept}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative shadow-2xl overflow-hidden">
        
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-md border border-blue-50 relative overflow-hidden group">
              <Shield size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-red-500/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white translate-x-1 translate-y-1">
                <div className="w-1 h-1 bg-white rounded-full opacity-60" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl tracking-tighter leading-none flex items-baseline gap-1">
                GlucoGuard
                <span className="text-[9px] text-blue-600 font-black bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">v3.2</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-serif italic mt-0.5 truncate max-w-[150px] sm:max-w-none">{profile?.name || (user ? 'Fuad Hasanović, dipl.ing.informatike' : 'Lokalni Korisnik')}</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 -mr-2 text-slate-500 hover:bg-slate-50 rounded-full active:scale-90 transition-transform"
            >
              <Menu size={28} />
            </button>
          </div>
        </header>

        {/* Side Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Shield size={24} />
                    </div>
                    <span className="font-black tracking-tighter text-xl">GlucoGuard</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* User Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.nav.profile}</p>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <User size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{profile?.name || (user ? 'Fuad Hasanović, dipl.ing.informatike' : t.about.developer)}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Local Mode'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Language Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Jezik / Language</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                            language === lang.code 
                            ? 'bg-blue-50 border-blue-200 text-blue-600' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-lg">{FLAGS[lang.code]}</span>
                          <span className="text-[10px] font-bold uppercase truncate">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Postavke</p>
                    <div className="space-y-2">
                      {user ? (
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Odjavi se (Logout)</span>
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <button 
                            onClick={handleSignIn}
                            className="w-full flex items-center gap-3 p-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 active:scale-95"
                          >
                            <User size={18} />
                            <span>Prijavi se (Login)</span>
                          </button>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed px-2">
                            {t.about.loginSubtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Verzija 3.2</span>
                    <div className="flex items-center gap-1">
                      <Settings size={12} />
                      <span>Stable Build</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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



