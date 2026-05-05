import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 3 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[100] bg-blue-600 flex flex-col items-center justify-center text-white p-8"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <Shield size={64} className="text-blue-600" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black tracking-tighter mb-2"
      >
        GlucoGuard
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-blue-100 font-medium tracking-widest uppercase text-xs"
      >
        Version 1.0.0 • By Fuad Hasanović
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 max-w-sm text-center"
      >
        <p className="text-[10px] text-blue-200 leading-relaxed uppercase opacity-70">
          Disclaimer: Ova aplikacija je namijenjena isključivo u edukativne svrhe i nije zamjena za medicinski savjet ili liječenje. Korištenjem aplikacije prihvatate punu odgovornost za svoje zdravstvene odluke. Autor ne snosi odgovornost za bilo kakve posljedice korištenja.
        </p>
      </motion.div>
    </motion.div>
  );
}
