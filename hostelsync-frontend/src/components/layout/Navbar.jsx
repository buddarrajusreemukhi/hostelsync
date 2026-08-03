import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Bell,
  Search,
  Globe,
  User,
  LogOut,
  Settings,
  ShieldAlert,
  ChevronDown,
  Menu
} from 'lucide-react';

export const Navbar = ({ setMobileOpen, mobileOpen }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const hasCustomPhoto = user?.profilePhotoType === 'CUSTOM' && user?.profilePhotoUrl;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-40 sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('searchPlaceholder') || 'Search...'}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector */}
        <div className="relative flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
          <Globe size={14} className="text-slate-400 shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-slate-300 font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="en" className="bg-slate-900">EN</option>
            <option value="te" className="bg-slate-900">TE</option>
            <option value="hi" className="bg-slate-900">HI</option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-card rounded-2xl border border-slate-800 shadow-2xl p-4 z-50">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Live Notifications</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/60">
                  <div className="font-bold text-slate-200">GPS Attendance Verified</div>
                  <div className="text-slate-400 text-[11px]">Geofence bounds verified</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
          >
            {hasCustomPhoto ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.fullName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-indigo-500/40 shadow-md"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shadow-md">
                {getInitials(user?.fullName)}
              </div>
            )}
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-200">{user?.fullName || 'User'}</div>
              <div className="text-[10px] text-indigo-400 font-mono font-semibold uppercase">{user?.role}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl border border-slate-800 shadow-2xl p-2 z-50">
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/shared/profile');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-xs text-slate-300 font-semibold flex items-center gap-2"
              >
                <User size={16} className="text-indigo-400" /> User Profile & Photo
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/shared/settings');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-xs text-slate-300 font-semibold flex items-center gap-2"
              >
                <Settings size={16} className="text-indigo-400" /> System Settings
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/shared/emergency');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-950/40 text-xs text-rose-400 font-semibold flex items-center gap-2"
              >
                <ShieldAlert size={16} /> Emergency SOS
              </button>
              <div className="my-1 border-t border-slate-800" />
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-600/20 text-xs text-rose-400 font-bold flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
