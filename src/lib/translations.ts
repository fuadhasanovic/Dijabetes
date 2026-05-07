
export const translations: Record<string, any> = {
  bs: {
    about: {
      title: 'O Aplikaciji',
      version: 'Verzija 3.2',
      description: 'GlucoGuard je Vaš pametni saputnik u upravljanju dijabetesom. Pratite glukozu, planirajte obroke i dobijte pametne savjete na osnovu vaših podataka.',
      contact: 'Kontakt Autora',
      accept: 'Prihvatam i nastavljam',
      developer: 'Razvio: Fuad Hasanović, dipl.ing.informatike',
      loginSubtitle: 'Prijavite se za sinhronizaciju podataka u oblaku i pristup sa bilo kojeg uređaja.',
    },
    nav: {
      profile: 'Profil',
      glucose: 'Šećer',
      meals: 'Hrana',
      activity: 'Sport',
      advice: 'Pomoć'
    },
    common: {
      save: 'Spremi',
      cancel: 'Odustani',
      delete: 'Obriši',
      edit: 'Uredi',
      add: 'Dodaj',
      loading: 'Učitavanje...',
      search: 'Pretraži...'
    },
    glucose: {
      title: 'Dnevnik Šećera',
      average: 'Prosjek (7 dana)',
      lastReading: 'Zadnje mjerenje',
      addTitle: 'Novo Mjerenje',
      placeholder: 'Unesite nivo šećera (mmol/L)',
      context: 'Kontekst mjerenja',
      history: 'Historija mjerenja'
    },
    meals: {
      title: 'Ishrana & GI',
      subtitle: 'Planiranje obroka i jelovnika',
      database: 'Namirnice',
      meals: 'Obroci',
      plan: 'Jelovnik',
      addFood: 'Dodaj Namirnicu',
      uploadFoods: 'Prenesi Spisak (Upload)',
      newFood: 'Nova Namirnica',
      foodName: 'Naziv namirnice',
      gi: 'Visina GI',
      search: 'Pretraži...',
      cancel: 'Odustani',
      save: 'Snimi',
      addMeal: 'Kreiraj Obrok',
      mealName: 'Naziv obroka',
      selectFoods: 'Odaberi namirnice',
      addPlan: 'Kreiraj Jelovnik',
      planName: 'Naziv jelovnika',
      mealType: 'Tip Obroka',
      totalGI: 'Ukupni GI',
      breakfast: 'Doručak',
      snack: 'Užina',
      lunch: 'Ručak',
      appetizer: 'Predjelo',
      dinner: 'Večera',
    },
    profile: {
      title: 'Profil korisnika',
      subtitle: 'Vaši osnovni podaci za personalizaciju',
      name: 'Ime i Prezime',
      age: 'Godine',
      weight: 'Težina (kg)',
      height: 'Visina (cm)',
      bmi: 'Vaš BMI',
      saveProfile: 'Spremi Profil',
      bmiCategories: {
        underweight: 'Pothranjenost',
        normal: 'Normalna težina',
        overweight: 'Povećana težina',
        obese: 'Pretilost'
      },
      bmiAdvice: {
        underweight: 'Preporuka: Povećajte unos nutritivno bogate hrane.',
        normal: 'Odlično! Vaš BMI je u granicama normale.',
        overweight: 'Preporuka: Razmislite o umjerenoj fizičkoj aktivnosti.',
        obese: 'Važno: Konsultujte se sa ljekarom o planu za smanjenje težine.'
      },
      backup: 'Sigurnosna kopija',
      export: 'Izvezi podatke (Backup)',
      import: 'Uvezi podatke (Restore)',
      importSuccess: 'Podaci uspješno uvezeni!',
      exportDetail: 'Sačuvajte vaše podatke lokalno u JSON fajl.'
    },
    activity: {
      title: 'Aktivnosti',
      subtitle: 'Pratite potrošnju energije',
      today: 'Danas potrošeno',
      addTitle: 'Zabilježi Aktivnost',
      type: 'Vrsta Aktivnosti',
      duration: 'Trajanje (min)',
      intensity: 'Intenzitet',
      types: {
        walking: 'Hodanje',
        running: 'Trčanje',
        cycling: 'Biciklizam',
        exercise: 'Vježbanje',
        other: 'Ostalo'
      }
    }
  },
  en: {
    about: {
      title: 'About App',
      version: 'Version 3.2',
      description: 'GlucoGuard is your smart companion in diabetes management. Track glucose, plan meals and get smart advice based on your data.',
      contact: 'Author Contact',
      accept: 'I accept and continue',
      developer: 'Developed by: Fuad Hasanović, dipl.ing.informatike',
      loginSubtitle: 'Sign in to sync data across devices and keep it safe in the cloud.',
    },
    nav: {
      profile: 'Profile',
      glucose: 'Glucose',
      meals: 'Meals',
      activity: 'Activity',
      advice: 'Advice'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      loading: 'Loading...',
      search: 'Search...'
    },
    glucose: {
      title: 'Glucose Log',
      average: 'Average (7 days)',
      lastReading: 'Last reading',
      addTitle: 'New Measurement',
      placeholder: 'Enter sugar level (mmol/L)',
      context: 'Measurement context',
      history: 'Measurement history'
    },
    meals: {
      title: 'Meals & GI',
      subtitle: 'Nutrition planning by index',
      database: 'Food Database',
      meals: 'Meals',
      plan: 'Meal Plan',
      addFood: 'Add Food',
      uploadFoods: 'Upload Food List',
      newFood: 'New Food Item',
      foodName: 'Food Name',
      gi: 'GI Value',
      search: 'Search...',
      cancel: 'Cancel',
      save: 'Save',
      addMeal: 'Create Meal',
      mealName: 'Meal Name',
      selectFoods: 'Select Foods',
      addPlan: 'Create Weekly Plan',
      planName: 'Plan Name',
      mealType: 'Meal Type',
      totalGI: 'Total GI',
      breakfast: 'Breakfast',
      snack: 'Snack',
      lunch: 'Lunch',
      appetizer: 'Appetizer',
      dinner: 'Dinner',
    },
    profile: {
      title: 'User Profile',
      subtitle: 'Your basic data for personalization',
      name: 'Full Name',
      age: 'Age',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      bmi: 'Your BMI',
      saveProfile: 'Save Profile',
      bmiCategories: {
        underweight: 'Underweight',
        normal: 'Normal weight',
        overweight: 'Overweight',
        obese: 'Obese'
      },
      bmiAdvice: {
        underweight: 'Advice: Increase intake of nutrient-rich foods.',
        normal: 'Excellent! Your BMI is within the normal range.',
        overweight: 'Advice: Consider moderate physical activity.',
        obese: 'Important: Consult a doctor about a weight reduction plan.'
      }
    },
    activity: {
      title: 'Activities',
      subtitle: 'Track your energy burn',
      today: 'Burned Today',
      addTitle: 'Log Activity',
      type: 'Activity Type',
      duration: 'Duration (min)',
      intensity: 'Intensity',
      types: {
        walking: 'Walking',
        running: 'Running',
        cycling: 'Cycling',
        exercise: 'Exercise',
        other: 'Other'
      }
    }
  },
  de: {
    about: {
      title: 'Über die App',
      version: 'Version 3.2',
      description: 'GlucoGuard ist Ihr intelligenter Begleiter im Diabetes-Management. Verfolgen Sie Glukose, planen Sie Mahlzeiten und erhalten Sie intelligente Ratschläge basierend auf Ihren Daten.',
      contact: 'Kontakt zum Autor',
      accept: 'Akzeptieren und fortfahren',
      developer: 'Entwickelt von: Fuad Hasanović, dipl.ing.informatike',
      loginSubtitle: 'Melden Sie sich an, um Daten geräteübergreifend zu synchronisieren.',
    },
    nav: {
      profile: 'Profil',
      glucose: 'Zucker',
      meals: 'Essen',
      activity: 'Sport',
      advice: 'Hilfe'
    },
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      loading: 'Laden...',
      search: 'Suchen...'
    },
    glucose: {
      title: 'Zuckertagebuch',
      average: 'Durchschnitt (7 Tage)',
      lastReading: 'Letzte Messung',
      addTitle: 'Neue Messung',
      placeholder: 'Zuckerspiegel eingeben (mmol/L)',
      context: 'Messkontext',
      history: 'Verlauf'
    },
    meals: {
      title: 'Mahlzeiten & GI',
      subtitle: 'Ernährungsplanung nach Index',
      database: 'Lebensmittel',
      meals: 'Mahlzeiten',
      plan: 'Speiseplan',
      addFood: 'Lebensmittel hinzufügen',
      uploadFoods: 'Liste hochladen',
      newFood: 'Neues Lebensmittel',
      foodName: 'Name',
      gi: 'GI-Wert',
      search: 'Suchen...',
      cancel: 'Abbrechen',
      save: 'Speichern',
      addMeal: 'Mahlzeit erstellen',
      mealName: 'Name der Mahlzeit',
      selectFoods: 'Lebensmittel wählen',
      addPlan: 'Wochenplan erstellen',
      planName: 'Name des Plans',
      mealType: 'Art der Mahlzeit',
      totalGI: 'Gesamt-GI',
      breakfast: 'Frühstück',
      snack: 'Snack',
      lunch: 'Mittagessen',
      appetizer: 'Vorspeise',
      dinner: 'Abendessen',
    },
    profile: {
      title: 'Benutzerprofil',
      subtitle: 'Ihre Basisdaten zur Personalisierung',
      name: 'Name',
      age: 'Alter',
      weight: 'Gewicht (kg)',
      height: 'Größe (cm)',
      bmi: 'Ihr BMI',
      saveProfile: 'Profil speichern',
      bmiCategories: {
        underweight: 'Untergewicht',
        normal: 'Normalgewicht',
        overweight: 'Übergewicht',
        obese: 'Adipositas'
      },
      bmiAdvice: {
        underweight: 'Hinweis: Erhöhen Sie die Aufnahme von nährstoffreichen Lebensmitteln.',
        normal: 'Ausgezeichnet! Ihr BMI liegt im Normalbereich.',
        overweight: 'Hinweis: Erwägen Sie moderate körperliche Aktivität.',
        obese: 'Wichtig: Konsultieren Sie einen Arzt bezüglich eines Gewichtsreduktionsplans.'
      }
    },
    activity: {
      title: 'Aktivitäten',
      subtitle: 'Energieverbrauch verfolgen',
      today: 'Heute verbrannt',
      addTitle: 'Aktivität protokollieren',
      type: 'Aktivitätstyp',
      duration: 'Dauer (Min)',
      intensity: 'Intensität',
      types: {
        walking: 'Gehen',
        running: 'Laufen',
        cycling: 'Radfahren',
        exercise: 'Training',
        other: 'Sonstiges'
      }
    }
  },
  tr: {
    about: {
      title: 'Uygulama Hakkında',
      version: 'Sürüm 3.2',
      description: 'GlucoGuard, diyabet yönetiminde akıllı arkadaşınızdır. Glikozu takip edin, öğünleri planlayın ve verilerinize dayalı akıllı tavsiyeler alın.',
      contact: 'Yazar İletişim',
      accept: 'Kabul et ve devam et',
      developer: 'Geliştiren: Fuad Hasanović, dipl.ing.informatike',
      loginSubtitle: 'Cihazlar arasında veri senkronizasyonu için oturum açın.',
    },
    nav: {
      profile: 'Profil',
      glucose: 'Şeker',
      meals: 'Yemekler',
      activity: 'Spor',
      advice: 'Yardım'
    },
    common: {
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      add: 'Ekle',
      loading: 'Yükleniyor...',
      search: 'Ara...'
    },
    glucose: {
      title: 'Şeker Günlüğü',
      average: 'Ortalama (7 gün)',
      lastReading: 'Son ölçüm',
      addTitle: 'Yeni Ölçüm',
      placeholder: 'Şeker seviyesini girin (mmol/L)',
      context: 'Ölçüm bağlamı',
      history: 'Ölçüm geçmişi'
    },
    meals: {
      title: 'Yemekler & GI',
      subtitle: 'İndekse göre beslenme planlaması',
      database: 'Gıda Listesi',
      meals: 'Öğünler',
      plan: 'Yemek Planı',
      addFood: 'Gıda Ekle',
      uploadFoods: 'Listeyi Yükle',
      newFood: 'Yeni Gıda Maddesi',
      foodName: 'Gıda Adı',
      gi: 'GI Değeri',
      search: 'Ara...',
      cancel: 'İptal',
      save: 'Kaydet',
      addMeal: 'Öğün Oluştur',
      mealName: 'Öğün Adı',
      selectFoods: 'Gıda Seçin',
      addPlan: 'Haftalık Plan Oluştur',
      planName: 'Plan Adı',
      mealType: 'Öğün Tipi',
      totalGI: 'Toplam GI',
      breakfast: 'Kahvaltı',
      snack: 'Atıştırmalık',
      lunch: 'Öğle Yemeği',
      appetizer: 'Meze',
      dinner: 'Akşam Yemeği',
    },
    profile: {
      title: 'Kullanıcı Profili',
      subtitle: 'Kişiselleştirme için temel verileriniz',
      name: 'Ad Soyad',
      age: 'Yaş',
      weight: 'Ağırlık (kg)',
      height: 'Boy (cm)',
      bmi: 'VKI\'niz',
      saveProfile: 'Profili Kaydet',
      bmiCategories: {
        underweight: 'Düşük kilolu',
        normal: 'Normal ağırlık',
        overweight: 'Fazla kilolu',
        obese: 'Obez'
      },
      bmiAdvice: {
        underweight: 'Tavsiye: Besin açısından zengin gıdaların alımını artırın.',
        normal: 'Mükemmel! VKİ\'niz normal sınırlar içindedir.',
        overweight: 'Tavsiye: Orta düzeyde fiziksel aktiviteyi düşünün.',
        obese: 'Önemli: Zayıflama planı hakkında bir doktora danışın.'
      }
    },
    activity: {
      title: 'Aktiviteler',
      subtitle: 'Enerji yakımınızı takip edin',
      today: 'Bugün Yakılan',
      addTitle: 'Aktivite Kaydet',
      type: 'Aktivite Türü',
      duration: 'Süre (dk)',
      intensity: 'Yoğunluk',
      types: {
        walking: 'Yürüyüş',
        running: 'Koşu',
        cycling: 'Bisiklet',
        exercise: 'Egzersiz',
        other: 'Diğer'
      }
    }
  }
};

export const FLAGS: Record<string, string> = {
  bs: '🇧🇦',
  hr: '🇭🇷',
  sr: '🇷🇸',
  en: '🇺🇸',
  tr: '🇹🇷',
  de: '🇩🇪'
};
