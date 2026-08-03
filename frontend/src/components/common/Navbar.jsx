import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Building2, Bell, Sun, Moon, Globe, LogOut, User, 
  Bot, Search, ShieldCheck, CheckCircle2, ChevronDown, KeyRound
} from 'lucide-react';

export const Navbar = ({ onOpenAiBot }) => {
  const { currentUser, logout, getLinkedStudent } = useAuth();
  const { notifications, markNotificationRead } = useHostelData();
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const linkedStudent = getLinkedStudent();

  // Filter relevant notifications
  const userNotifications = notifications.filter(n => {
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'WARDEN') return true;
    if (currentUser?.role === 'STUDENT') return n.recipientIdentifier === linkedStudent?.rollNumber || n.recipientRole === 'STUDENT';
    if (currentUser?.role === 'PARENT') return n.recipientIdentifier === currentUser?.email || n.recipientRole === 'PARENT';
    return false;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const roleColors = {
    ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    WARDEN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    STUDENT: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    PARENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                HOSTEL<span className="text-indigo-400">SYNC</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ERP v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Enterprise Hostel Operations</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Global Search (Students, Rooms, Complaints, Gate Pass)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiBot}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-all border border-slate-700/50">
              <Globe className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1 hidden group-hover:block z-50">
              <button onClick={() => changeLanguage('en')} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>English</button>
              <button onClick={() => changeLanguage('te')} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${lang === 'te' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>తెలుగు (Telugu)</button>
              <button onClick={() => changeLanguage('hi')} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${lang === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>हिंदी (Hindi)</button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-all border border-slate-700/50"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-all border border-slate-700/50 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                  </h4>
                  <span className="text-xs text-indigo-400 font-medium">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {userNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                  ) : (
                    userNotifications.map(ntf => (
                      <div
                        key={ntf.id}
                        onClick={() => markNotificationRead(ntf.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${ntf.read ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-slate-800/60 border-indigo-500/30'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-200">{ntf.title}</span>
                          <span className="text-[10px] text-slate-500">{new Date(ntf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{ntf.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Card Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase">
                {currentUser?.fullName?.[0] || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[120px] truncate">{currentUser?.fullName}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleColors[currentUser?.role]}`}>
                  {currentUser?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-200">{currentUser?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>
                <div className="py-1 space-y-1">
                  <div className="px-3 py-1 text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2FA OTP Verified
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
