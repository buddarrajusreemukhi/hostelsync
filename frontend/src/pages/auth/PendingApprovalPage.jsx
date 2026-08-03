import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PendingApprovalPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Email OTP Verified
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Registration Pending Approval</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your email has been verified! However, in accordance with HostelSync security policies, your Student/Parent account requires manual verification and approval by the Super Admin before you can log in.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
          <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">What happens next?</span>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span> Admin reviews your Roll Number & Department details.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span> Upon approval, your login status will be activated immediately.
            </li>
          </ul>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Login Page
        </Link>

      </div>

    </div>
  );
};
