
import React, { useState, useEffect, useRef } from 'react';
import { NAV_ITEMS } from '../constants';
import { Shield, Bell, Settings, User, LogOut, Sun, Moon, X, CheckCircle2, AlertCircle, Zap, Clock } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout, isDarkMode, toggleDarkMode }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    { id: 1, type: 'critical', title: 'Critical Incident', message: 'Major collision reported at GE Road.', time: '2m ago' },
    { id: 2, type: 'dispatch', title: 'Ambulance Deployed', message: 'Unit AMB-77 is now on-site.', time: '15m ago' },
    { id: 3, type: 'system', title: 'Node Sync Complete', message: 'RCET Bhilai server is 100% operational.', time: '1h ago' },
  ];

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (hasUnread) setHasUnread(false);
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-red-600 p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">JanSeva</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
              activeTab === 'profile' ? 'bg-slate-800 shadow-inner' : 'bg-slate-800/50 hover:bg-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-slate-600 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-wider">{user.role}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onLogout(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-300 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800 uppercase tracking-wider">
              System Live
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Center Trigger */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={handleToggleNotifications}
                className={`p-2 rounded-xl transition-all relative ${
                  notificationsOpen 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute top-12 right-0 w-[340px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest">Grid Alerts</h4>
                    <button className="text-[10px] font-black text-red-600 dark:text-red-400 hover:underline uppercase tracking-tighter">Mark all read</button>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            n.type === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                            n.type === 'dispatch' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                            'bg-green-100 dark:bg-green-900/30 text-green-600'
                          }`}>
                            {n.type === 'critical' ? <AlertCircle className="w-5 h-5" /> : 
                             n.type === 'dispatch' ? <Zap className="w-5 h-5" /> : 
                             <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                              <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {n.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center">
                    <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] hover:text-red-600 transition-colors">View Alert History</button>
                  </div>
                </div>
              )}
            </div>

            <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-100 transition-colors" />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className={`text-sm font-medium transition-colors hidden sm:inline ${activeTab === 'profile' ? 'text-red-600' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className={`w-5 h-5 transition-colors ${activeTab === 'profile' ? 'text-red-600' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'}`} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative z-10">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-between items-center z-50 transition-colors duration-300">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'text-red-600' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
