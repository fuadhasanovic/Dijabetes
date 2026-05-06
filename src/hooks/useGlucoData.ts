import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, toDate } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  UserProfile, 
  GlucoseMeasurement, 
  FoodItem, 
  ActivityLog, 
  SavedMeal,
  MenuPlan
} from '../types';

export function useGlucoData() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [measurements, setMeasurements] = useState<GlucoseMeasurement[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [menuPlans, setMenuPlans] = useState<MenuPlan[]>([]);

  // Local Storage Load
  useEffect(() => {
    const data = {
      profile: localStorage.getItem('gluco_profile'),
      measurements: localStorage.getItem('gluco_measurements'),
      foods: localStorage.getItem('gluco_foods'),
      activities: localStorage.getItem('gluco_activities'),
      savedMeals: localStorage.getItem('gluco_savedMeals'),
      menuPlans: localStorage.getItem('gluco_menuPlans'),
    };

    if (data.profile) setProfile(JSON.parse(data.profile));
    if (data.measurements) setMeasurements(JSON.parse(data.measurements));
    if (data.foods) setFoods(JSON.parse(data.foods));
    if (data.activities) setActivities(JSON.parse(data.activities));
    if (data.savedMeals) setSavedMeals(JSON.parse(data.savedMeals));
    if (data.menuPlans) setMenuPlans(JSON.parse(data.menuPlans));
    
    setAuthLoading(false);
  }, []);

  // Sync to Local Storage
  useEffect(() => {
    const sync = () => {
      if (profile) localStorage.setItem('gluco_profile', JSON.stringify(profile));
      localStorage.setItem('gluco_measurements', JSON.stringify(measurements));
      localStorage.setItem('gluco_foods', JSON.stringify(foods));
      localStorage.setItem('gluco_activities', JSON.stringify(activities));
      localStorage.setItem('gluco_savedMeals', JSON.stringify(savedMeals));
      localStorage.setItem('gluco_menuPlans', JSON.stringify(menuPlans));
    };
    const timeout = setTimeout(sync, 1000);
    return () => clearTimeout(timeout);
  }, [profile, measurements, foods, activities, savedMeals, menuPlans]);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Firebase Cloud Sync
  useEffect(() => {
    if (!user) return;
    
    const profUnsub = onSnapshot(doc(db, 'userProfiles', user.uid), (doc) => {
      if (doc.exists()) setProfile({ id: doc.id, ...doc.data() } as UserProfile);
    });

    const measUnsub = onSnapshot(query(collection(db, 'glucoseMeasurements'), where('userId', '==', user.uid)), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as GlucoseMeasurement));
        setMeasurements(data.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()));
      }
    });

    const foodUnsub = onSnapshot(query(collection(db, 'foodDatabase'), where('userId', 'in', [null, user.uid])), (snap) => {
      if (!snap.empty) setFoods(snap.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
    });

    const actUnsub = onSnapshot(query(collection(db, 'activities'), where('userId', '==', user.uid)), (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
        setActivities(data.sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()));
      }
    });

    const mealUnsub = onSnapshot(query(collection(db, 'savedMeals'), where('userId', '==', user.uid)), (snap) => {
      if (!snap.empty) setSavedMeals(snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedMeal)));
    });

    const planUnsub = onSnapshot(query(collection(db, 'menuPlans'), where('userId', '==', user.uid)), (snap) => {
      if (!snap.empty) setMenuPlans(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuPlan)));
    });

    return () => {
      profUnsub(); measUnsub(); foodUnsub(); actUnsub(); mealUnsub(); planUnsub();
    };
  }, [user]);

  // Actions
  const handleSaveProfile = async (data: Partial<UserProfile>) => {
    const updated = profile ? { ...profile, ...data } : { ...data, userId: user?.uid || 'local' } as UserProfile;
    setProfile(updated);
    if (user) await setDoc(doc(db, 'userProfiles', user.uid), { ...data, userId: user.uid, updatedAt: serverTimestamp() }, { merge: true });
  };

  const handleAddMeasurement = async (data: Omit<GlucoseMeasurement, 'id'>) => {
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setMeasurements(prev => [...prev, newDoc as GlucoseMeasurement]);
    if (user) await addDoc(collection(db, 'glucoseMeasurements'), { ...data, userId: user.uid, timestamp: serverTimestamp() });
  };

  const handleAddFood = async (data: Omit<FoodItem, 'id'>) => {
    const newDoc = { ...data, id: Date.now().toString() };
    setFoods(prev => [...prev, newDoc as FoodItem]);
    if (user) await addDoc(collection(db, 'foodDatabase'), { ...data, userId: user.uid });
  };

  const handleAddActivity = async (data: Omit<ActivityLog, 'id'>) => {
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setActivities(prev => [...prev, newDoc as ActivityLog]);
    if (user) await addDoc(collection(db, 'activities'), { ...data, userId: user.uid, timestamp: serverTimestamp() });
  };

  const handleAddSavedMeal = async (data: Omit<SavedMeal, 'id'>) => {
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setSavedMeals(prev => [...prev, newDoc as SavedMeal]);
    if (user) await addDoc(collection(db, 'savedMeals'), { ...data, userId: user.uid, timestamp: serverTimestamp() });
  };

  const handleAddMenuPlan = async (data: Omit<MenuPlan, 'id'>) => {
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setMenuPlans(prev => [...prev, newDoc as MenuPlan]);
    if (user) await addDoc(collection(db, 'menuPlans'), { ...data, userId: user.uid, timestamp: serverTimestamp() });
  };

  const handleDeleteDoc = async (collectionName: string, id: string) => {
    if (collectionName === 'glucoseMeasurements') setMeasurements(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'foodDatabase') setFoods(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'activities') setActivities(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'savedMeals') setSavedMeals(prev => prev.filter(i => i.id !== id));
    if (collectionName === 'menuPlans') setMenuPlans(prev => prev.filter(i => i.id !== id));
    if (user) await deleteDoc(doc(db, collectionName, id));
  };

  const handleImportData = (data: any) => {
    if (data.profile) setProfile(data.profile);
    if (data.measurements) setMeasurements(data.measurements);
    if (data.foods) setFoods(data.foods);
    if (data.activities) setActivities(data.activities);
    if (data.savedMeals) setSavedMeals(data.savedMeals);
    if (data.menuPlans) setMenuPlans(data.menuPlans);
  };

  return {
    user, authLoading, profile, measurements, foods, activities, savedMeals, menuPlans,
    actions: {
      handleSaveProfile, handleAddMeasurement, handleAddFood, handleAddActivity,
      handleAddSavedMeal, handleAddMenuPlan, handleDeleteDoc, handleImportData
    }
  };
}
