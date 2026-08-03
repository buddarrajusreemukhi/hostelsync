import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Settings, Globe, Bell, Shield } from 'lucide-react';

export const SettingsPage = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100">System Preferences</h1>
        <p className="text-slate-400 text-sm mt-1">Configure language, notification alerts, and accessibility settings</p>
      </div>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Application Language</h3>
              <p className="text-xs text-slate-400">Choose your preferred display language across the portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            {['EN', 'TE', 'HI'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  language === lang
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'TE' ? 'తెలుగు' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Real-time Push Notifications</h3>
              <p className="text-xs text-slate-400">Receive instant alerts for Gate Pass, Absent marks, and Parcels</p>
            </div>
          </div>

          <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
