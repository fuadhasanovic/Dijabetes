import { TrendingUp } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { format } from 'date-fns';
import { GlucoseMeasurement } from '../../types';
import { toDate } from '../../lib/firebase';

interface MeasurementChartProps {
  measurements: GlucoseMeasurement[];
}

export default function MeasurementChart({ measurements }: MeasurementChartProps) {
  const chartData = measurements.slice(-10).map(m => ({
    date: format(toDate(m.timestamp), 'dd.MM'),
    level: m.level,
  }));

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4 px-2">
        <TrendingUp size={18} className="text-slate-400" />
        <h3 className="font-bold text-sm text-slate-800">Trend zadnjih mjerenja</h3>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 'auto']} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <ReferenceLine y={7} stroke="#EF4444" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="level" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
