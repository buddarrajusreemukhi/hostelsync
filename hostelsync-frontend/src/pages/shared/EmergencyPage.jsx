import React from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Building2, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

export const EmergencyPage = () => {
  const triggerSos = () => {
    toast.error('EMERGENCY SOS ALERT SENT TO CHIEF WARDEN & SECURITY DESK!', {
      duration: 5000,
      icon: '🚨'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <ShieldAlert className="text-rose-500 animate-pulse" /> Emergency Response & SOS Desk
        </h1>
        <p className="text-slate-400 text-sm mt-1">24/7 Hostel Emergency Helplines, Medical Center & Campus Security</p>
      </div>

      {/* SOS Button */}
      <div className="glass-card p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 text-center">
        <h2 className="text-2xl font-black text-slate-100 mb-2">HOSTEL EMERGENCY SOS BUTTON</h2>
        <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
          Pressing the SOS button instantly dispatches location alerts to Chief Warden, Campus Security, and Medical Response Unit.
        </p>
        <button
          onClick={triggerSos}
          className="w-40 h-40 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xl shadow-2xl shadow-rose-600/50 border-4 border-rose-400/40 transition-transform active:scale-95 mx-auto flex flex-col items-center justify-center gap-2"
        >
          <ShieldAlert size={36} /> SOS PANIC
        </button>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <HeartPulse size={28} />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base">Campus Medical Center</div>
            <div className="text-sm font-mono text-emerald-400 mt-0.5">+1-800-HOSTEL-MED</div>
            <div className="text-xs text-slate-500 mt-1">Available 24/7 in Building C</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 size={28} />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base">Chief Warden Office</div>
            <div className="text-sm font-mono text-indigo-400 mt-0.5">+1-987-654-3211</div>
            <div className="text-xs text-slate-500 mt-1">Warden Office Desk</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <PhoneCall size={28} />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base">Hostel Main Gate Security</div>
            <div className="text-sm font-mono text-amber-400 mt-0.5">+1-987-654-9900</div>
            <div className="text-xs text-slate-500 mt-1">Main Gate Control Room</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Flame size={28} />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base">Fire Safety & Rescue</div>
            <div className="text-sm font-mono text-red-400 mt-0.5">101 / 911</div>
            <div className="text-xs text-slate-500 mt-1">External Emergency Services</div>
          </div>
        </div>
      </div>
    </div>
  );
};
