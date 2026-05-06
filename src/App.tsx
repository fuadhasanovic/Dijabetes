import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Activity, 
  Utensils, 
  TrendingUp, 
  Shield, 
  Menu, 
  HeartPulse,
  Globe
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, toDate } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import Splash from './components/Splash';
import ProfileForm from './components/ProfileForm';
import GlucoseDash from './components/GlucoseDash';
import MealPlanner from './components/MealPlanner';
import ActivityLogs from './components/ActivityLogs';
import AdviceHub from './components/AdviceHub';

import { 
  UserProfile, 
  GlucoseMeasurement, 
  FoodItem, 
  ActivityLog, 
  SavedMeal,
  MenuPlan,
  SUPPORTED_LANGUAGES
} from './types';
import { translations, FLAGS } from './lib/translations';

type Tab = 'profile' | 'glucose' | 'meals' | 'activity' | 'advice';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>('glucose');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [language, setLanguage] = useState('bs');

  // Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [measurements, setMeasurements] = useState<GlucoseMeasurement[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [menuPlans, setMenuPlans] = useState<MenuPlan[]>([]);

  const t = translations[language] || translations.bs;

  // Persistence to LocalStorage
  useEffect(() => {
    const localProfile = localStorage.getItem('gluco_profile');
    const localMeas = localStorage.getItem('gluco_measurements');
    const localFoods = localStorage.getItem('gluco_foods');
    const localAct = localStorage.getItem('gluco_activities');
    const localMeals = localStorage.getItem('gluco_savedMeals');
    const localPlans = localStorage.getItem('gluco_menuPlans');

    if (localProfile) setProfile(JSON.parse(localProfile));
    if (localMeas) setMeasurements(JSON.parse(localMeas).map((m: any) => ({ ...m, timestamp: m.timestamp })));
    if (localFoods) setFoods(JSON.parse(localFoods));
    if (localAct) setActivities(JSON.parse(localAct).map((a: any) => ({ ...a, timestamp: a.timestamp })));
    if (localMeals) setSavedMeals(JSON.parse(localMeals));
    if (localPlans) setMenuPlans(JSON.parse(localPlans));
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem('gluco_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('gluco_measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('gluco_foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('gluco_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('gluco_savedMeals', JSON.stringify(savedMeals));
  }, [savedMeals]);

  useEffect(() => {
    localStorage.setItem('gluco_menuPlans', JSON.stringify(menuPlans));
  }, [menuPlans]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Sync with Firebase if user is logged in
    const profUnsub = onSnapshot(doc(db, 'userProfiles', user.uid), (doc) => {
      if (doc.exists()) {
        const cloudProfile = { id: doc.id, ...doc.data() } as UserProfile;
        setProfile(cloudProfile);
      }
    });

    const measQuery = query(collection(db, 'glucoseMeasurements'), where('userId', '==', user.uid));
    const measUnsub = onSnapshot(measQuery, (snap) => {
      if (snap.docs.length > 0) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as GlucoseMeasurement));
        setMeasurements(data.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()));
      }
    });

    const foodQuery = query(collection(db, 'foodDatabase'), where('userId', 'in', [null, user.uid]));
    const foodUnsub = onSnapshot(foodQuery, (snap) => {
      if (snap.docs.length > 0) {
        setFoods(snap.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
      }
    });

    return () => {
      profUnsub();
      measUnsub();
      foodUnsub();
    };
  }, [user]);

  const handleSaveProfile = async (data: Partial<UserProfile>) => {
    const updated = profile ? { ...profile, ...data } : { ...data, userId: user?.uid || 'local' } as UserProfile;
    setProfile(updated);
    
    if (user) {
      try {
        await setDoc(doc(db, 'userProfiles', user.uid), {
          ...data,
          userId: user.uid,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddMeasurement = async (data: Omit<GlucoseMeasurement, 'id'>) => {
    const localId = Date.now().toString();
    const newDoc = { ...data, id: localId, timestamp: new Date().toISOString() };
    setMeasurements(prev => [...prev, newDoc as GlucoseMeasurement]);

    if (user) {
      try {
        await addDoc(collection(db, 'glucoseMeasurements'), {
          ...data,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddFood = async (data: Omit<FoodItem, 'id'>) => {
    const localId = Date.now().toString();
    const newDoc = { ...data, id: localId };
    setFoods(prev => [...prev, newDoc as FoodItem]);

    if (user) {
      try {
        await addDoc(collection(db, 'foodDatabase'), {
          ...data,
          userId: user.uid,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddActivity = async (data: Omit<ActivityLog, 'id'>) => {
    const localId = Date.now().toString();
    const newDoc = { ...data, id: localId, timestamp: new Date().toISOString() };
    setActivities(prev => [...prev, newDoc as ActivityLog]);

    if (user) {
      try {
        await addDoc(collection(db, 'activities'), {
          ...data,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddSavedMeal = async (data: Omit<SavedMeal, 'id'>) => {
    const localId = Date.now().toString();
    const newDoc = { ...data, id: localId, timestamp: new Date().toISOString() };
    setSavedMeals(prev => [...prev, newDoc as SavedMeal]);

    if (user) {
      try {
        await addDoc(collection(db, 'savedMeals'), {
          ...data,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddMenuPlan = async (data: Omit<MenuPlan, 'id'>) => {
    const localId = Date.now().toString();
    const newDoc = { ...data, id: localId, timestamp: new Date().toISOString() };
    setMenuPlans(prev => [...prev, newDoc as MenuPlan]);

    if (user) {
      try {
        await addDoc(collection(db, 'menuPlans'), {
          ...data,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteDoc = async (collectionName: string, id: string) => {
    // Local Update
    if (collectionName === 'glucoseMeasurements') setMeasurements(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'foodDatabase') setFoods(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'activities') setActivities(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'savedMeals') setSavedMeals(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'menuPlans') setMenuPlans(prev => prev.filter(i => i.id !== id));

    if (user) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImportData = (data: any) => {
    if (data.profile) setProfile(data.profile);
    if (data.measurements) setMeasurements(data.measurements);
    if (data.foods) setFoods(data.foods);
    if (data.activities) setActivities(data.activities);
    if (data.savedMeals) setSavedMeals(data.savedMeals);
    if (data.menuPlans) setMenuPlans(data.menuPlans);
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  if (showSplash) return <Splash onComplete={() => setShowSplash(false)} />;

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative shadow-2xl overflow-hidden">
        
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none">GlucoGuard</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{profile?.name || (user ? 'Cloud User' : 'Local User')}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleSignIn}
                className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
              >
                Login
              </button>
            )}
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-xl">{FLAGS[language]}</span>
                <Globe size={14} className="text-slate-400" />
              </div>
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>{FLAGS[lang.code]} {lang.name}</span>
                    {language === lang.code && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 pb-32">
          {authLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
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
                    onSave={handleSaveProfile} 
                    translations={t.profile} 
                    fullData={{
                      profile,
                      measurements,
                      foods,
                      activities,
                      savedMeals,
                      menuPlans
                    }}
                    onImport={handleImportData}
                  />
                )}
                {currentTab === 'glucose' && (
                  <GlucoseDash 
                    measurements={measurements} 
                    onAdd={handleAddMeasurement} 
                    onNavigateToAdvice={() => setCurrentTab('advice')}
                    translations={t.glucose}
                  />
                )}
                {currentTab === 'meals' && (
                  <MealPlanner 
                    foods={foods} 
                    savedMeals={savedMeals}
                    menuPlans={menuPlans}
                    onAddFood={handleAddFood}
                    onAddSavedMeal={handleAddSavedMeal}
                    onAddMenuPlan={handleAddMenuPlan}
                    onDeleteFood={(id) => handleDeleteDoc('foodDatabase', id)}
                    onDeleteSavedMeal={(id) => handleDeleteDoc('savedMeals', id)}
                    onDeleteMenuPlan={(id) => handleDeleteDoc('menuPlans', id)}
                    translations={t.meals}
                    language={language}
                  />
                )}
                {currentTab === 'activity' && <ActivityLogs logs={activities} onAdd={handleAddActivity} translations={t.activity} />}
                {currentTab === 'advice' && <AdviceHub />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
          <NavButton 
            active={currentTab === 'profile'} 
            onClick={() => setCurrentTab('profile')} 
            icon={<User size={28} className={`transition-all ${currentTab === 'profile' ? 'scale-110' : ''}`} />} 
            label={t.nav.profile} 
          />
          <NavButton 
            active={currentTab === 'glucose'} 
            onClick={() => setCurrentTab('glucose')} 
            icon={<TrendingUp size={28} className={`transition-all ${currentTab === 'glucose' ? 'scale-110' : ''}`} />} 
            label={t.nav.glucose} 
          />
          <NavButton 
            active={currentTab === 'meals'} 
            onClick={() => setCurrentTab('meals')} 
            icon={<Utensils size={28} className={`transition-all ${currentTab === 'meals' ? 'scale-110' : ''}`} />} 
            label={t.nav.meals} 
          />
          <NavButton 
            active={currentTab === 'activity'} 
            onClick={() => setCurrentTab('activity')} 
            icon={<Activity size={28} className={`transition-all ${currentTab === 'activity' ? 'scale-110' : ''}`} />} 
            label={t.nav.activity} 
          />
          <NavButton 
            active={currentTab === 'advice'} 
            onClick={() => setCurrentTab('advice')} 
            icon={<HeartPulse size={28} className={`transition-all ${currentTab === 'advice' ? 'scale-110' : ''}`} />} 
            label={t.nav.advice} 
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
    >
      <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${active ? 'text-blue-600 opacity-100 scale-105' : 'text-slate-400 opacity-70'}`}>
        {label}
      </span>
      {active && (
        <motion.div layoutId="nav-pill" className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
      )}
    </button>
  );
}



