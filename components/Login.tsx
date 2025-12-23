
import React, { useState } from 'react';
import { Shield, Lock, Mail, ChevronRight, AlertCircle, User as UserIcon, Phone, Globe, Loader2, Play, UserPlus, LogIn } from 'lucide-react';
import { UserRole, User } from '../types';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.CITIZEN,
    phone: '',
  });

  const handleDemoAccess = (customName?: string, customRole?: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: `DEMO-${Math.random().toString(36).substr(2, 9)}`,
        name: customName || 'Demo Citizen',
        role: customRole || UserRole.CITIZEN,
        email: formData.email || 'demo@janseva.io',
        address: 'Bhilai Sector 7, CG',
        phone: formData.phone || '+91 98765 43210'
      });
      setLoading(false);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback for unconfigured Firebase
    if (!isFirebaseConfigured) {
      if (!isLogin && !formData.name) {
        setError("Please provide your name for the demo registration.");
        return;
      }
      handleDemoAccess(formData.name, formData.role);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // Sign In
        const userCredential = await auth.signInWithEmailAndPassword(formData.email, formData.password);
        const fbUser = userCredential.user;
        if (fbUser) {
          onLogin({
            id: fbUser.uid,
            name: fbUser.displayName || formData.email.split('@')[0],
            role: UserRole.CITIZEN, 
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || undefined
          });
        }
      } else {
        // Registration
        const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
        const fbUser = userCredential.user;
        if (fbUser) {
          await fbUser.updateProfile({ displayName: formData.name });
          onLogin({
            id: fbUser.uid,
            name: formData.name,
            role: formData.role,
            email: formData.email,
            phone: formData.phone,
            address: 'Auto-detected Location, Bhilai'
          });
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = "Authentication failed.";
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        message = "Firebase key error. Use 'Enter Demo Mode' below.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please sign in.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else {
        message = err.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      setError("Google Login requires configuration. Use Demo Mode.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const fbUser = result.user;
      if (fbUser) {
        onLogin({
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          role: UserRole.CITIZEN,
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
        });
      }
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-inter transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 blur-[150px] rounded-full -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -ml-64 -mb-64"></div>

      <div className="w-full max-w-xl relative z-10 transition-all duration-500">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="p-8 text-center border-b border-slate-800/50 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${isLogin ? 'from-red-600/10 to-transparent' : 'from-indigo-600/10 to-transparent'} opacity-50`}></div>
            <div className="relative z-10">
              <div className={`w-16 h-16 ${isLogin ? 'bg-red-600' : 'bg-indigo-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-colors duration-500`}>
                {isLogin ? <Shield className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {isLogin ? 'JanSeva Sign In' : 'Join the Grid'}
              </h1>
              <p className="text-slate-400 text-sm">
                {isLogin ? 'Secure access to emergency coordination' : 'Register to help and get help faster'}
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-2 text-red-400 text-xs animate-in slide-in-from-top-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-medium">{error}</p>
                </div>
                {!isFirebaseConfigured && (
                  <button 
                    onClick={() => handleDemoAccess()}
                    className="mt-2 w-full bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-3 h-3 fill-current" /> Bypass to Demo Mode
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Registration Only Fields */}
              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Identity</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text" 
                        required={!isLogin}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-600"
                        placeholder="e.g. Rahul Singh"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Network Role</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                        className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value={UserRole.CITIZEN}>Citizen</option>
                        <option value={UserRole.HOSPITAL}>Hospital Staff</option>
                        <option value={UserRole.POLICE}>Police Officer</option>
                        <option value={UserRole.AMBULANCE}>Ambulance Team</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Digital Address (Email)</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${isLogin ? 'group-focus-within:text-red-400' : 'group-focus-within:text-indigo-400'} transition-colors`} />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white focus:ring-2 ${isLogin ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-indigo-500/50 focus:border-indigo-500'} transition-all outline-none placeholder:text-slate-600`}
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-700">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Secure Contact (Mobile)</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="tel" 
                      required={!isLogin}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-600"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Access Key (Password)</label>
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${isLogin ? 'group-focus-within:text-red-400' : 'group-focus-within:text-indigo-400'} transition-colors`} />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-white focus:ring-2 ${isLogin ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-indigo-500/50 focus:border-indigo-500'} transition-all outline-none placeholder:text-slate-600`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl disabled:bg-slate-800 disabled:text-slate-600 relative overflow-hidden group mt-4 ${
                  isLogin 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Establish Secure Connection' : 'Register with Node'}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </form>

            {/* Alternative Flows */}
            <div className="mt-8 space-y-4">
              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-slate-800"></div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Grid Methods</span>
                <div className="flex-1 h-[1px] bg-slate-800"></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-slate-200 active:scale-95 disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                <span className="text-xs uppercase tracking-wider font-black">Fast Entry with Google</span>
              </button>

              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center py-2"
              >
                <span className="text-slate-500 text-xs font-medium">
                  {isLogin ? "New to the emergency network? " : "Already registered on the grid? "}
                </span>
                <span className={`text-xs font-black uppercase tracking-widest hover:underline ${isLogin ? 'text-red-500' : 'text-indigo-500'}`}>
                  {isLogin ? 'Initialize Onboarding' : 'Return to Login'}
                </span>
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Node: RCET Bhilai Secure</span>
              </div>
              <p className="text-[9px] text-slate-700 text-center leading-relaxed font-medium max-w-xs">
                By entering the JanSeva grid, you agree to the Response Protocol and Privacy Encryption standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
