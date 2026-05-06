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
  Meal,
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
  const [meals, setMeals] = useState<Meal[]>([]);

  const t = translations[language] || translations.bs;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    const pathProfile = `userProfiles/${user.uid}`;
    const profUnsub = onSnapshot(doc(db, 'userProfiles', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() } as UserProfile);
      } else {
        setCurrentTab('profile');
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, pathProfile));

    const pathMeas = 'glucoseMeasurements';
    const measQuery = query(
      collection(db, pathMeas), 
      where('userId', '==', user.uid)
      // Removed orderBy to avoid multi-field index requirement during dev
    );
    const measUnsub = onSnapshot(measQuery, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as GlucoseMeasurement));
      // Sort in memory using safe toDate
      setMeasurements(data.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.LIST, pathMeas));

    const pathFood = 'foodDatabase';
    // Strict query to match security rules for foodDatabase
    const foodQuery = query(
      collection(db, pathFood),
      where('userId', 'in', [null, user.uid])
    );
    const foodUnsub = onSnapshot(foodQuery, (snap) => {
      setFoods(snap.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, pathFood));

    const pathAct = 'activities';
    const actQuery = query(
      collection(db, pathAct),
      where('userId', '==', user.uid)
    );
    const actUnsub = onSnapshot(actQuery, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
      setActivities(data.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.LIST, pathAct));

    const pathMeals = 'meals';
    const mealsQuery = query(
      collection(db, pathMeals),
      where('userId', '==', user.uid)
    );
    const mealsUnsub = onSnapshot(mealsQuery, (snap) => {
      setMeals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Meal)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, pathMeals));

    return () => {
      profUnsub();
      measUnsub();
      foodUnsub();
      actUnsub();
      mealsUnsub();
    };
  }, [user]);

  const handleSaveProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const path = `userProfiles/${user.uid}`;
    try {
      await setDoc(doc(db, 'userProfiles', user.uid), {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setCurrentTab('glucose');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleAddMeasurement = async (data: Omit<GlucoseMeasurement, 'id'>) => {
    if (!user) return;
    const path = 'glucoseMeasurements';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleAddFood = async (data: Omit<FoodItem, 'id'>) => {
    if (!user) return;
    const path = 'foodDatabase';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: user.uid,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleAddActivity = async (data: Omit<ActivityLog, 'id'>) => {
    if (!user) return;
    const path = 'activities';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleAddMeal = async (data: Omit<Meal, 'id'>) => {
    if (!user) return;
    const path = 'meals';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteDoc = async (collectionName: string, id: string) => {
    const path = `${collectionName}/${id}`;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
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

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <Shield size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">GlucoGuard</h1>
            <p className="text-slate-500 mt-2">Vaš pametni asistent za dijabetes</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              Prijavi se putem Google-a
            </button>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-widest">
              Vaši podaci su sigurni i dostupni na svim uređajima
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{profile?.name || 'Korisnik'}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
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
                {currentTab === 'profile' && <ProfileForm initialData={profile} onSave={handleSaveProfile} translations={t.profile} />}
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
                    meals={meals}
                    onAddFood={handleAddFood}
                    onAddMeal={handleAddMeal}
                    onDeleteFood={(id) => handleDeleteDoc('foodDatabase', id)}
                    onDeleteMeal={(id) => handleDeleteDoc('meals', id)}
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



