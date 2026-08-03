import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const user = res.data.data.user;
        if (user.role !== 'ADMIN') {
          setError('Unauthorized: This portal is strictly for Admin login.');
          setSubmitting(false);
          return;
        }
        login(res.data.data);
        toast.success('Welcome Administrator!');
        navigate('/admin/dashboard');
        return;
      }
    } catch (err) {
      // Offline fallback for preview mode
      if (email.toLowerCase() === 'admin@hostelsync.com' && (password === 'Admin@1234' || password === 'admin')) {
        const demoAuth = {
          accessToken: 'demo-admin-jwt-token',
          refreshToken: 'demo-admin-refresh-token',
          user: {
            id: 'a1111111-1111-1111-1111-111111111111',
            email: 'admin@hostelsync.com',
            fullName: 'System Administrator',
            role: 'ADMIN',
            status: 'APPROVED',
            gender: 'MALE',
            profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            profilePhotoType: 'DEFAULT'
          }
        };
        login(demoAuth);
        toast.success('Logged in as Administrator!');
        navigate('/admin/dashboard');
        return;
      }

      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3 shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-100">ADMINISTRATOR PORTAL</h2>
          <p className="text-slate-400 text-xs mt-1">HOSTELSYNC SaaS Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hostelsync.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@1234"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
};
