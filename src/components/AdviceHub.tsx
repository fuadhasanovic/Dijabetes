import { Phone, HeartPulse, ShieldAlert, BookOpen, ExternalLink, Siren } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdviceHub() {
  const emergencyNumbers = [
    { name: 'Hitna Pomoć', number: '124', icon: <Siren />, color: 'bg-red-600' },
    { name: 'Policija', number: '122', icon: <Phone />, color: 'bg-blue-600' },
    { name: 'Vatrogasci', number: '123', icon: <Phone />, color: 'bg-orange-600' },
  ];

  const medicalAdvices = [
    {
      title: 'Hipoglikemija (Nizak šećer)',
      condition: 'Vrijednost < 3.9 mmol/L',
      symptoms: 'Znojenje, drhtavica, glad, vrtoglavica.',
      action: 'Uzeti 15g brzodjelujućih ugljikohidrata (npr. čaša soka ili 3 tablete glukoze). Sačekati 15 minuta i ponovo izmjeriti.',
    },
    {
      title: 'Hiperglikemija (Visok šećer)',
      condition: 'Vrijednost > 7.0 mmol/L (na tašte)',
      symptoms: 'Pojačana žeđ, učestalo mokrenje, umor.',
      action: 'Pijte puno vode, izbjegavajte ugljikohidrate i provjerite ketone ako je nivo jako visok. Obratite se ljekaru ako se stanje nastavi.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Savjeti & Pomoć</h2>
        <p className="text-slate-500 text-sm">Resursi za upravljanje dijabetesom</p>
      </div>

      {/* Emergency Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <ShieldAlert size={18} className="text-red-500" />
          <h3 className="font-bold text-slate-800">Hitni Brojevi</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {emergencyNumbers.map((item, idx) => (
            <a 
              key={idx} 
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-lg font-black text-slate-400">{item.number}</p>
                </div>
              </div>
              <Phone className="text-slate-200 group-hover:text-slate-900 transition-colors" size={24} />
            </a>
          ))}
        </div>
      </section>

      {/* Medical Advice Cards */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <HeartPulse size={18} className="text-blue-500" />
          <h3 className="font-bold text-slate-800">Medicinski Vodič</h3>
        </div>
        <div className="space-y-4">
          {medicalAdvices.map((advice, idx) => (
            <motion.div 
              key={idx}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-black text-slate-900 text-lg leading-tight">{advice.title}</h4>
                <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">
                  {advice.condition}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simptomi</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{advice.symptoms}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Šta uraditi?</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{advice.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* External Resources */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <BookOpen size={18} className="text-purple-500" />
          <h3 className="font-bold text-slate-800">Korisni Linkovi</h3>
        </div>
        <div className="space-y-2">
          <ResourceLink title="Dijabetes.ba Portal" url="https://dijabetes.ba" />
          <ResourceLink title="Internacionalna Federacija Dijabetesa" url="https://idf.org" />
        </div>
      </section>

      <div className="p-6 bg-blue-50 rounded-3xl text-center">
        <p className="text-[10px] text-blue-400 leading-relaxed uppercase font-bold opacity-70">
          Uvijek se konsultujte sa svojim lekarom pre donošenja bilo kakve medicinske odluke.
        </p>
      </div>
    </div>
  );
}

function ResourceLink({ title, url }: { title: string, url: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
    >
      <span className="font-bold text-slate-700 text-sm">{title}</span>
      <ExternalLink size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
    </a>
  );
}
