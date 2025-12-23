
import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../types';
import { UserPlus, Stethoscope, Bed, Activity, Clock, ChevronRight, Hospital, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface HospitalDashboardProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ incidents, onUpdateStatus }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const incomingIncidents = incidents.filter(i => 
    i.status !== IncidentStatus.HOSPITAL_ADMITTED && 
    i.status !== IncidentStatus.RESOLVED &&
    (i.status === IncidentStatus.AMBULANCE_DISPATCHED || i.status === IncidentStatus.EN_ROUTE_TO_HOSPITAL)
  );

  const handleAdmission = async (id: string) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onUpdateStatus(id, IncidentStatus.HOSPITAL_ADMITTED);
    setProcessingId(null);
  };

  const admittedCount = incidents.filter(i => i.status === IncidentStatus.HOSPITAL_ADMITTED).length;
  const freeBeds = Math.max(0, 20 - admittedCount);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">On-Duty Doctors</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">14</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl text-green-600 dark:text-green-400 shadow-inner">
            <Bed className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">ER Bed Capacity</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{freeBeds}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 shadow-inner">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Trauma Teams</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">3 Ready</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h4 className="font-black text-xl text-slate-800 dark:text-slate-100 tracking-tight">Incoming Trauma Alerts</h4>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Real-time status of en-route patients</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${incomingIncidents.length > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>
            {incomingIncidents.length} INCOMING
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID / ETA</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Case Profile</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Triage Status</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {incomingIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 dark:text-slate-100 font-mono tracking-tighter">{inc.id}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-red-500" /> 12m away
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{inc.location.address}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 italic max-w-xs truncate mt-0.5">{inc.description}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      inc.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleAdmission(inc.id)}
                      disabled={processingId === inc.id}
                      className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 dark:hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                    >
                      {processingId === inc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Admit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
