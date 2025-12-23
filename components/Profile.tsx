
import React, { useState, useRef } from 'react';
import { User, Shield, Mail, MapPin, Calendar, LogOut, Settings, Bell, Camera, Check, X, Loader2, Phone, Building2, Navigation } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserType) => void;
  userLocation: { lat: number; lng: number } | null;
  locationError: string | null;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, userLocation, locationError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    phone: user.phone || '',
    address: user.address || ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpdateUser({ ...user, ...formData });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="h-40 bg-gradient-to-r from-red-600 via-red-500 to-slate-900 relative">
          <div className="absolute -bottom-14 left-8 p-1.5 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl transition-colors">
            <div className={`w-28 h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden relative ${isEditing ? 'cursor-pointer' : ''}`}>
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14" />
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-full outline-none transition-colors"
                />
              ) : (
                <>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{user.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" /> Bhilai Command Hub
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg">
                  <Check className="w-4 h-4" /> Save
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              )}
              <button onClick={onLogout} className="flex items-center gap-2 px-6 py-2.5 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-red-500" /> Information Grid
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Identity</p>
            <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{user.email}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live GPS Status</p>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Navigation className="w-4 h-4 animate-pulse" />
              {userLocation ? 'Tracking Active' : 'Initializing...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
