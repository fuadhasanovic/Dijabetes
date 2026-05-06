import { isAfter, subDays } from 'date-fns';
import { GlucoseMeasurement } from '../../types';
import { toDate } from '../../lib/firebase';

interface StatsCardsProps {
  measurements: GlucoseMeasurement[];
  translations: any;
}

export default function StatsCards({ measurements, translations: t }: StatsCardsProps) {
  const now = new Date();
  const last7Days = measurements.filter(m => isAfter(toDate(m.timestamp), subDays(now, 7)));
  
  const average7Days = last7Days.length > 0 
    ? (last7Days.reduce((acc, curr) => acc + curr.level, 0) / last7Days.length).toFixed(1)
    : '0.0';

  const hba1cEstimate = last7Days.length > 0
    ? ((parseFloat(average7Days) * 18.0182 + 46.7) / 28.7).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl">
        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">{t.average}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-blue-900">{average7Days}</span>
          <span className="text-xs font-bold text-blue-600 uppercase">mmol/L</span>
        </div>
      </div>
      <div className="p-5 bg-purple-50 border border-purple-100 rounded-3xl">
        <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-2">HbA1c Procjena</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-purple-900">{hba1cEstimate}</span>
          <span className="text-xs font-bold text-purple-600 uppercase">%</span>
        </div>
      </div>
    </div>
  );
}
