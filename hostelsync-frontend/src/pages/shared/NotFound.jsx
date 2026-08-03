import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-6xl font-black text-slate-100 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The page or resource you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
      >
        Return to Portal Hub
      </Link>
    </div>
  );
};
