
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { TrendingDown, Zap, ShieldCheck, BarChart3, Activity } from 'lucide-react';
import { Incident } from '../types';

interface AnalyticsProps {
  incidents: Incident[];
}

const responseData = [
  { name: 'Accident 1', Manual: 8.2, JanSeva: 5.1 },
  { name: 'Accident 2', Manual: 8.8, JanSeva: 5.4 },
  { name: 'Accident 3', Manual: 7.9, JanSeva: 4.8 },
  { name: 'Accident 4', Manual: 9.1, JanSeva: 5.2 },
];

const Analytics: React.FC<AnalyticsProps> = ({ incidents }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const high = incidents.filter(i => i.severity === 'High').length;
  const medium = incidents.filter(i => i.severity === 'Medium').length;
  const low = incidents.filter(i => i.severity === 'Low').length;
  const total = incidents.length || 1;

  const severityData = [
    { name: 'Critical', value: Math.round((critical / total) * 100), color: '#ef4444' },
    { name: 'High', value: Math.round((high / total) * 100), color: '#f97316' },
    { name: 'Medium', value: Math.round((medium / total) * 100), color: '#eab308' },
    { name: 'Low', value: Math.round((low / total) * 100), color: '#22c55e' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-red-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-red-200 dark:shadow-red-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-black mb-3 tracking-tight">38% Faster Response</h3>
            <p className="text-red-100 font-medium opacity-90 max-w-sm leading-relaxed">JanSeva AI protocols minimize the critical gap between accident detection and emergency deployment.</p>
          </div>
          <div className="mt-10 flex items-center gap-4 relative z-10">
            <div className="bg-white/20 px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
              <span className="text-[10px] font-black block opacity-70 uppercase tracking-widest mb-1">Legacy Avg</span>
              <span className="text-2xl font-black">8.5m</span>
            </div>
            <div className="bg-white/30 px-6 py-3 rounded-2xl border border-white/40 backdrop-blur-sm">
              <span className="text-[10px] font-black block opacity-70 uppercase tracking-widest mb-1">JanSeva Avg</span>
              <span className="text-2xl font-black">5.1m</span>
            </div>
          </div>
          <Activity className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 rotate-12 transition-transform duration-700" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-80">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-sm transition-colors">
            <TrendingDown className="w-8 h-8 text-green-500 mb-4" />
            <h5 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">14%</h5>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fatality Reduction</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-sm transition-colors">
            <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
            <h5 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">100%</h5>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Unit Verification</p>
          </div>
          <div className="bg-slate-900 dark:bg-slate-800 col-span-2 p-8 rounded-[2rem] text-white shadow-xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sector Lives Assisted</p>
            <h5 className="text-4xl font-black">{482 + incidents.length}</h5>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800">
                 <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100">Response Analysis</h4>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: isDark ? '#1e293b' : '#ffffff'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '30px', fontWeight: 'bold', fontSize: '11px'}} />
                <Bar dataKey="Manual" fill={isDark ? '#334155' : '#e2e8f0'} radius={[10, 10, 0, 0]} barSize={32} />
                <Bar dataKey="JanSeva" fill="#ef4444" radius={[10, 10, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                 <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100">Severity Distribution</h4>
            </div>
          </div>
          <div className="h-[350px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full max-w-sm mt-6">
              {severityData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.name}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
