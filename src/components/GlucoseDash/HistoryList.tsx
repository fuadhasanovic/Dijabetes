import { History, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { GlucoseMeasurement } from '../../types';
import { toDate } from '../../lib/firebase';

interface HistoryListProps {
  measurements: GlucoseMeasurement[];
  translations: any;
  contextMap: Record<string, string>;
}

export default function HistoryList({ measurements, translations: t, contextMap }: HistoryListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2">
        <History size={18} className="text-slate-400" />
        <h3 className="font-bold text-sm text-slate-800">{t.history}</h3>
      </div>
      {measurements.slice().reverse().map((m, idx) => (
        <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
              <Calendar size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm capitalize">{contextMap[m.context] || m.context.replace('_', ' ')}</p>
              <p className="text-[10px] text-slate-400">{format(toDate(m.timestamp), 'dd.MM.yyyy HH:mm')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-black text-lg ${m.level > 7 ? 'text-red-500' : 'text-green-500'}`}>
              {m.level}
              <span className="text-[10px] ml-1 opacity-50">mmol/L</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
