
import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../types';
import { AlertCircle, Ambulance, Hospital, MapPin, Search, Filter, Navigation, X } from 'lucide-react';

interface MapViewProps {
  incidents: Incident[];
  userLocation: { lat: number; lng: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ incidents, userLocation }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const getCoordinates = (lat: number, lng: number) => {
    const top = ((21.3 - lat) / 0.2) * 100;
    const left = ((lng - 81.2) / 0.3) * 100;
    return { 
      top: Math.max(0, Math.min(100, top)) + '%', 
      left: Math.max(0, Math.min(100, left)) + '%' 
    };
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4 transition-colors">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search location in Bhilai..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm dark:text-slate-200 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div> Incidents
            </label>
            <label className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div> Your Location
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 dark:bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner group transition-colors">
        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="absolute top-[20%] left-[25%] group/pin cursor-pointer z-10">
          <div className="relative">
            <Hospital className="w-10 h-10 text-green-600 dark:text-green-500 drop-shadow-lg" />
          </div>
        </div>

        {userLocation && (
          <div 
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={getCoordinates(userLocation.lat, userLocation.lng)}
          >
            <div className="relative">
              <div className="absolute inset-0 w-8 h-8 bg-indigo-500/30 rounded-full animate-ping"></div>
              <div className="relative w-4 h-4 bg-indigo-600 border-2 border-white dark:border-slate-900 rounded-full shadow-lg shadow-indigo-500/50 flex items-center justify-center">
                <Navigation className="w-2 h-2 text-white fill-current" />
              </div>
            </div>
          </div>
        )}

        {incidents.map((inc) => {
          const pos = getCoordinates(inc.location.lat, inc.location.lng);
          return (
            <div 
              key={inc.id}
              className="absolute group/pin cursor-pointer z-20"
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setSelectedIncident(inc)}
            >
              <div className="relative">
                <div className={`absolute -top-24 -left-24 w-48 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 transition-all ${selectedIncident?.id === inc.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">{inc.severity} Severity</span>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedIncident(null); }} className="text-slate-300 hover:text-slate-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">{inc.location.address}</p>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{inc.status}</span>
                </div>

                <div className="relative">
                  <AlertCircle className={`w-9 h-9 ${inc.severity === 'Critical' ? 'text-red-600 animate-bounce' : 'text-orange-500 animate-pulse'}`} />
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-6 bottom-6 top-6 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl hidden lg:flex flex-col z-30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h5 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> 
              Incident Radar
            </h5>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">{incidents.length} Units</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {incidents.map(inc => (
              <div 
                key={inc.id} 
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedIncident?.id === inc.id ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 shadow-md ring-1 ring-red-100 dark:ring-red-900/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono">{inc.id}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${inc.severity === 'Critical' ? 'text-red-600' : 'text-orange-500'}`}>{inc.severity}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mb-1">{inc.location.address}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{inc.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    <Ambulance className="w-3 h-3" />
                    {inc.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
