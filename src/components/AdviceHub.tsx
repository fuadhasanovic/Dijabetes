import React from 'react';
import { 
  Lightbulb, 
  ChevronRight, 
  Apple, 
  Activity, 
  Brain, 
  Stethoscope, 
  Mail,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdviceHub() {
  const emergencyProtocols = [
    {
      title: 'HIPOGLIKEMIJA (Nizak šećer < 3.9 mmol/L)',
      importance: 'CRITICAL',
      icon: <Zap className="text-orange-500" size={24} />,
      bg: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-900',
      description: 'Simptomi: Drhtavica, znojenje, glad, vrtoglavica, zbunjenost.',
      protocol: 'Pravilo 15-15:',
      steps: [
        '1. Uzmite 15g brzih šećera (npr. pola čaše soka, 3-4 kocke šećera ili tablete glukoze).',
        '2. Sačekajte 15 minuta.',
        '3. Ponovo izmjerite šećer.',
        '4. Ako je i dalje ispod 3.9, ponovite postupak.',
        '5. Kada se stabilizuje, pojedite obrok sa sporim ugljikohidratima.'
      ],
      link: 'https://www.diabetes.org/diabetes/hypoglycemia'
    },
    {
      title: 'HIPERGLIKEMIJA (Visok šećer > 13.0 mmol/L)',
      importance: 'URGENT',
      icon: <AlertCircle className="text-red-500" size={24} />,
      bg: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
      description: 'Simptomi: Velika žeđ, često mokrenje, zamagljen vid, umor.',
      protocol: 'Šta uraditi:',
      steps: [
        '1. Pijte puno vode (bez šećera) da izbjegnete dehidraciju.',
        '2. Provjerite ketone u urinu ako je šećer > 15.0 mmol/L.',
        '3. Lagana fizička aktivnost (samo ako nema ketona!).',
        '4. Provjerite da li ste uzeli propisanu dozu insulina/lijekova.',
        '5. Kontaktirajte ljekara ako nivo ne opada ili osjetite mučninu.'
      ],
      link: 'https://www.diabetes.org/diabetes/hyperglycemia'
    }
  ];

  const genericTips = [
    {
      title: 'Ishrana (Medicinska preporuka)',
      icon: <Apple className="text-blue-600" size={20} />,
      items: [
        'Konzumirajte hranu sa niskim glikemijskim indeksom (< 55).',
        'Vlakna (povrće, mahunarke) usporavaju apsorpciju šećera.',
        'Podijelite obroke u 5 manjih porcija tokom dana.'
      ]
    },
    {
      title: 'Fizička Aktivnost',
      icon: <Activity className="text-blue-600" size={20} />,
      items: [
        'Šetnja od 15-30 minuta nakon glavnih obroka dramatično smanjuje skokove.',
        'Konsultujte se sa ljekarom prije uvođenja intenzivnog treninga.'
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={32} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Medicinski Savjetnik</h2>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-blue-600 pl-4 py-1">
          Personalizovani protokoli i preporuke za upravljanje dijabetesom. 
          <br/>
          <span className="text-[10px] font-black uppercase text-blue-600">Verzija 3.01 Stable</span>
        </p>
      </header>

      {/* Emergency Section First */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Hitni Protokoli</h3>
        {emergencyProtocols.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2.5rem] border ${p.bg} shadow-sm space-y-4`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-2xl shadow-sm italic">
                  {p.icon}
                </div>
                <h4 className={`font-black text-sm ${p.textColor} leading-tight`}>{p.title}</h4>
              </div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
            
            <p className="text-xs font-medium text-slate-700 italic">{p.description}</p>
            
            <div className="space-y-2 bg-white/50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{p.protocol}</p>
              {p.steps.map((step, sIdx) => (
                <p key={sIdx} className="text-xs text-slate-800 font-medium leading-relaxed">• {step}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Informational Tips */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Edukacija i Prevencija</h3>
        {genericTips.map((tip, i) => (
          <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                {tip.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
            </div>
            <ul className="space-y-2">
              {tip.items.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 leading-relaxed flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Developer and Support */}
      <div className="p-8 bg-blue-600 text-white rounded-[3rem] shadow-xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
            <Brain size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold">Inovacije u Zdravstvu</h4>
            <p className="text-blue-100 text-xs italic">Fuad Hasanović, magistar informatike</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
          <p className="text-xs leading-relaxed opacity-90">
            Aplikacija je kreirana sa ciljem da pruži brzu i preciznu pomoć pacijentima. 
            Svi savjeti su bazirani na međunarodnim dijabetološkim standardima (ADA Protokoli).
          </p>
          <div className="h-px bg-white/20 w-full" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={14} className="opacity-70" />
              <span className="text-[10px] font-black uppercase">fhasanovic@gmail.com</span>
            </div>
            <a href="https://www.diabetes.org" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black underline uppercase tracking-widest">Više informacija</a>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center p-6 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
        <Info size={16} />
        <p className="text-[10px] font-bold uppercase tracking-tight text-center">
          Ova aplikacija nije zamjena za medicinski savjet. 
          Uvijek se konsultujte sa svojim endokrinologom.
        </p>
      </div>
    </div>
  );
}
