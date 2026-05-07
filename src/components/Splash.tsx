import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-blue-600 flex flex-col items-center justify-center text-white p-8"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
            <Shield size={64} className="text-blue-600 relative z-10" />
            
            {/* The Drop Shape (Simplified representative of user's icon) */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 flex items-center justify-center mt-2"
            >
              <div className="w-14 h-18 bg-red-600 rounded-full rounded-t-[50%] relative">
                <div className="absolute top-2 left-2 w-4 h-6 bg-white/20 rounded-full blur-[1px] -rotate-12" />
              </div>
            </motion.div>

            {/* Graph Lines representative Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-30 pointer-events-none">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                <path d="M10 30L20 10L30 25L50 5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-3 -right-3 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-30"
          >
            <Shield size={18} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl xs:text-5xl sm:text-6xl font-black tracking-tighter mb-1 text-center px-4"
      >
        GlucoGuard
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-blue-100 font-black tracking-[0.4em] uppercase text-[10px] mb-8 bg-blue-700/50 px-4 py-1.5 rounded-full border border-white/10"
      >
        Verzija 3.2 • Stable Build
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="space-y-1 w-full">
          <p className="text-[10px] text-blue-100 font-bold uppercase tracking-[0.2em] opacity-60">Autor Aplikacije</p>
          <p className="text-base sm:text-lg font-serif italic text-white break-words">Fuad Hasanović, dipl.ing.informatike</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
          <p className="text-[10px] text-blue-50 leading-relaxed uppercase font-bold tracking-tight opacity-90">
            DISCLAIMER: Ova aplikacija je namijenjena isključivo u edukativne svrhe i nije zamjena za medicinski savjet ili liječenje. Korištenjem aplikacije prihvatate punu odgovornost za svoje zdravstvene odluke. Autor ne snosi odgovornost za bilo kakve posljedice korištenja.
          </p>
        </div>

        <button 
          onClick={onComplete}
          className="w-full mt-8 py-5 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-50 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group"
        >
          Ulaz / Enter
          <motion.span 
            animate={{ x: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </button>
      </motion.div>
    </motion.div>
  );
}
