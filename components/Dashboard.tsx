
import React from 'react';
import { Incident, IncidentStatus } from '../types';
import { 
  Users, 
  Activity, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  Map as MapIcon,
  Phone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface DashboardProps {
  incidents: Incident[];
}

const chartData = [
  { name: '08:00', incidents: 2 },
  { name: '10:00', incidents: 5 },
  { name: '12:00', incidents: 3 },
  { name: '14:00', incidents: 8 },
  { name: '16:00', incidents: 4 },
  { name: '18:00', incidents: 7 },
  { name: '20:00', incidents: 2 },
];

const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const activeEmergencies = incidents.filter(i => i.status !== IncidentStatus.RESOLVED).length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;

  const stats = [
    { label: 'Active Emergencies', value: activeEmergencies.toString(), icon: <AlertCircle />, color: 'bg-red-500', trend: `+${criticalCount} critical` },
    { label: 'Available Ambulances', value: '18', icon: <Activity />, color: 'bg-blue-500', trend: '85% occupancy' },
    { label: 'Avg Response Time', value: '4.8m', icon: <Clock />, color: 'bg-green-500', trend: '-20% vs manual' },
    { label: 'Registered Users', value: '1.2k', icon: <Users />, color: 'bg-indigo-500', trend: '+124 this week' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-2.5 rounded-xl text-white`}>
                {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-6 h-6' })}
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                {stat.trend.split(' ')[0]}
              </div>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Incident Distribution</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Real-time frequency by hour</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-slate-300 transition-colors">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Reports Mini List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Recent Alerts</h4>
            <button className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {incidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="group cursor-pointer">
                <div className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    incident.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{incident.location.address}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      incident.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-center text-slate-400 py-10 text-sm font-medium">No recent alerts recorded.</p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-slate-400 font-medium mb-1">Emergency Hotline</p>
                <h5 className="text-lg font-bold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  112 / 102
                </h5>
              </div>
              <MapIcon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-800 dark:text-slate-700/50 transition-transform group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
