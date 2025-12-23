
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IncidentReport from './components/IncidentReport';
import HospitalDashboard from './components/HospitalDashboard';
import MapView from './components/MapView';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import DocumentHub from './components/DocumentHub';
import Login from './components/Login';
import { UserRole, User, Incident, IncidentStatus } from './types';
import { MOCK_INCIDENTS } from './constants';
import { AlertTriangle } from 'lucide-react';
import { auth, isFirebaseConfigured } from './services/firebase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('janseva_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('janseva_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('janseva_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((fbUser: any) => {
        if (fbUser) {
          const savedData = localStorage.getItem(`janseva_ext_${fbUser.uid}`);
          const extendedData = savedData ? JSON.parse(savedData) : {};
          setCurrentUser({
            id: fbUser.uid,
            name: fbUser.displayName || extendedData.name || fbUser.email?.split('@')[0] || 'User',
            role: extendedData.role || UserRole.CITIZEN,
            email: fbUser.email || extendedData.email || '',
            avatarUrl: fbUser.photoURL || extendedData.avatarUrl || undefined,
          });
        }
        setIsInitializing(false);
      });
      return () => unsubscribe();
    } else {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setLocationError(err.message),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(`janseva_ext_${user.id}`, JSON.stringify(user));
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) await auth.signOut();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Syncing Grid...</p>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard incidents={incidents} />;
      case 'reports': return <IncidentReport onAddIncident={(i) => setIncidents([i, ...incidents])} />;
      case 'documents': return <DocumentHub />;
      case 'hospitals': return <HospitalDashboard incidents={incidents} onUpdateStatus={(id, s) => setIncidents(incidents.map(i => i.id === id ? {...i, status: s} : i))} />;
      case 'map': return <MapView incidents={incidents} userLocation={userLocation} />;
      case 'analytics': return <Analytics incidents={incidents} />;
      case 'profile': return <Profile user={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} userLocation={userLocation} locationError={locationError} />;
      default: return <Dashboard incidents={incidents} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      user={currentUser}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
