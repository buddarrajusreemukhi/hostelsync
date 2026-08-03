import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-6xl font-black text-slate-100 mb-2">403</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-4">Access Denied</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        You do not have permission to access this module. Please log in with the correct role account.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
      >
        Return to Login Hub
      </Link>
    </div>
  );
};
