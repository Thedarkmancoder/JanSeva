
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, Loader2, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { getSmartTriage } from '../services/geminiService';
import { SmartTriageResult, Incident, IncidentStatus } from '../types';

interface IncidentReportProps {
  onAddIncident: (incident: Incident) => void;
}

const IncidentReport: React.FC<IncidentReportProps> = ({ onAddIncident }) => {
  const [description, setDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [triageResult, setTriageResult] = useState<SmartTriageResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({
          data: base64String,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    setIsReporting(true);
    
    try {
      const result = await getSmartTriage(description, selectedImage || undefined);
      setTriageResult(result);
      
      const newIncident: Incident = {
        id: `INC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        timestamp: new Date().toISOString(),
        reporter: 'Anonymous User',
        status: IncidentStatus.AMBULANCE_DISPATCHED,
        location: { 
          lat: 21.19 + (Math.random() * 0.1 - 0.05),
          lng: 81.35 + (Math.random() * 0.1 - 0.05),
          address: 'Detected Sector Location, Bhilai' 
        },
        description,
        severity: result.severity as any || 'Medium',
        imageUrl: selectedImage ? `data:${selectedImage.mimeType};base64,${selectedImage.data}` : undefined
      };

      setTimeout(() => {
        onAddIncident(newIncident);
        setIsReporting(false);
        setReportSuccess(true);
      }, 1500);
    } catch (err) {
      console.error("Reporting failed", err);
      setIsReporting(false);
    }
  };

  if (reportSuccess) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Help is dispatched!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">
          The nearest ambulance has been deployed. Local police and RCET Command Center are monitoring your location live.
        </p>
        
        {triageResult && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 text-left mb-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">AI Smart Triage Analysis</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                triageResult.severity === 'Critical' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              }`}>
                {triageResult.severity} Severity Detected
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-bold italic mb-6 leading-relaxed">"{triageResult.summary}"</p>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">IMMEDIATE FIELD ACTIONS:</p>
              {triageResult.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 mt-0.5 shrink-0 shadow-sm">
                    {i+1}
                  </div>
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <AlertTriangle className="absolute -right-8 -bottom-8 w-32 h-32 text-slate-100 dark:text-slate-900/50 -rotate-12" />
          </div>
        )}

        <button 
          onClick={() => {
            setReportSuccess(false);
            setDescription('');
            setTriageResult(null);
            setSelectedImage(null);
          }}
          className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl active:scale-95"
        >
          Close and Return
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl transition-colors duration-300">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-10 text-white relative">
          <h3 className="text-3xl font-black mb-2 tracking-tight">Report Incident</h3>
          <p className="text-red-100 font-medium opacity-90 text-sm">Automated Triage System active. Precise location will be shared.</p>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
            <Shield className="w-24 h-24 text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Event Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Two car collision, GE Road. One victim unconscious, bleeding from head..."
              className="w-full min-h-[140px] p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Visual Proof</label>
              <div className="relative group">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className={`w-full aspect-video bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 group-hover:border-red-400 transition-all shadow-sm overflow-hidden ${selectedImage ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}>
                  {selectedImage ? (
                    <img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-red-600 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-widest">Attach Image</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Sector Origin</label>
              <div className="w-full aspect-video bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-widest px-4 text-center">Bhilai Sector-7 (AUTO)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isReporting}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-black text-xl transition-all shadow-2xl relative overflow-hidden group ${
              isReporting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {isReporting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="uppercase tracking-widest text-base">Initializing Response...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span className="uppercase tracking-[0.1em]">Trigger Help Signal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentReport;
