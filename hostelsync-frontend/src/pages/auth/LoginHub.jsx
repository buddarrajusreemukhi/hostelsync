import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, GraduationCap, Users, ArrowRight, Building2, Lock } from 'lucide-react';

export const LoginHub = () => {
  const portals = [
    {
      role: 'ADMIN',
      title: 'SAAS Administration ERP',
      subtitle: 'System metrics, user registration approvals, room allocations & audit logs',
      path: '/login/admin',
      icon: ShieldCheck,
      badge: 'System Admin',
      gradient: 'from-indigo-600 to-indigo-900',
      border: 'border-indigo-500/40',
      accent: 'text-indigo-400'
    },
    {
      role: 'WARDEN',
      title: 'Warden Operations Desk',
      subtitle: 'Date-wise GPS attendance, emergency parent contacts, gate pass approvals & parcels',
      path: '/login/warden',
      icon: UserCheck,
      badge: 'Chief Warden',
      gradient: 'from-teal-600 to-teal-900',
      border: 'border-teal-500/40',
      accent: 'text-teal-400'
    },
    {
      role: 'STUDENT',
      title: 'Student Self-Service Portal',
      subtitle: 'GPS geofenced attendance, gate passes, expected parcels & laundry requests',
      path: '/login/student',
      icon: GraduationCap,
      badge: 'Resident Student',
      gradient: 'from-emerald-600 to-emerald-900',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-400'
    },
    {
      role: 'PARENT',
      title: 'Parent Ward Monitoring Desk',
      subtitle: 'Session-wise attendance alerts, gate pass tracking & ward security stream',
      path: '/login/parent',
      icon: Users,
      badge: 'Parent & Guardian',
      gradient: 'from-amber-600 to-amber-900',
      border: 'border-amber-500/40',
      accent: 'text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Formal Institutional Banner */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-indigo-500/20">
            HS
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-slate-100 font-mono">
              HOSTEL<span className="text-emerald-400">SYNC</span>
            </span>
            <span className="hidden sm:inline-block ml-3 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold font-mono border border-indigo-500/20">
              ENTERPRISE ERP v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Live & Secured
          </span>
        </div>
      </header>

      {/* Main Selection Body */}
      <main className="max-w-6xl w-full mx-auto my-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-semibold">
            <Lock size={12} className="text-emerald-400" /> Formal Multi-Tenant Role Authentication
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            Select Portal Access
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Enterprise Hostel Management ERP with real-time WebSockets, GPS Geofencing, and Role-Based Access Control.
          </p>
        </div>

        {/* 4 Formal Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.role}
                to={p.path}
                className="group glass-card p-6 md:p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${p.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shadow-xl`}>
                      <Icon size={28} />
                    </div>
                    <span className={`px-3 py-1 rounded-full bg-slate-900 border ${p.border} ${p.accent} text-xs font-mono font-bold uppercase`}>
                      {p.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">{p.title}</h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">{p.subtitle}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
                  <span>Proceed to Portal Login</span>
                  <ArrowRight size={16} className={`${p.accent} group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Registration Footer Links */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 size={16} className="text-indigo-400" />
            <span>Need a new Resident Account?</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register/student"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
            >
              Register New Student
            </Link>
            <Link
              to="/register/parent"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md"
            >
              Register New Parent
            </Link>
          </div>
        </div>
      </main>

      {/* Formal Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div>© 2026 HOSTELSYNC ERP. All Rights Reserved. Enterprise Edition.</div>
        <div className="flex items-center gap-4">
          <span>Spring Security JWT</span>
          <span>•</span>
          <span>Flyway PostgreSQL</span>
          <span>•</span>
          <span>GPS Geofence Verified</span>
        </div>
      </footer>
    </div>
  );
};
