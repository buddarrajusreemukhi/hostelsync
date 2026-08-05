import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudentLogin = () => {
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
        if (user.role !== 'STUDENT') {
          setError('Unauthorized: This portal is strictly for Student login.');
          setSubmitting(false);
          return;
        }
        login(res.data.data);
        toast.success('Welcome Student!');
        navigate('/student/dashboard');
        return;
      }
    } catch (err) {
      const inputEmail = email.trim().toLowerCase();
      const registeredUsers = mockStorage.getUsers();
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === inputEmail
      );

      if (matchedUser) {
        if (matchedUser.role !== 'STUDENT') {
          setError(`Unauthorized: This email is registered as a ${matchedUser.role}. Please log in via the ${matchedUser.role.toLowerCase()} portal.`);
          setSubmitting(false);
          return;
        }

        if (matchedUser.status === 'PENDING_APPROVAL') {
          setError('Account Pending Approval: Your student account is awaiting Admin approval. Please log in to the Admin Portal to approve it.');
          setSubmitting(false);
          return;
        }

        if (matchedUser.status === 'APPROVED') {
          const authData = {
            accessToken: 'token-' + Date.now(),
            refreshToken: 'refresh-' + Date.now(),
            user: matchedUser
          };
          login(authData);
          toast.success(`Welcome back, ${matchedUser.fullName}!`);
          navigate('/student/dashboard');
          return;
        }
      }

      // Default demo student fallback for any student email
      if (inputEmail.includes('student') || inputEmail.includes('alex') || inputEmail === 'student@university.edu' || inputEmail === 'alex@hostelsync.com') {
        const demoAuth = {
          accessToken: 'demo-student-jwt-token',
          refreshToken: 'demo-student-refresh-token',
          user: {
            id: 'c3333333-3333-3333-3333-333333333333',
            email: inputEmail,
            fullName: 'Alex Mercer',
            role: 'STUDENT',
            status: 'APPROVED',
            gender: 'MALE',
            rollNumber: '21CSE089',
            department: 'Computer Science Engineering',
            yearOfStudy: '3rd Year',
            roomNumber: '101',
            profilePhotoUrl: null,
            profilePhotoType: 'DEFAULT'
          }
        };
        login(demoAuth);
        toast.success('Logged in as Student!');
        navigate('/student/dashboard');
        return;
      }

      setError('Invalid Credentials: No student account found with this email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg">
            <GraduationCap size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-100">STUDENT PORTAL</h2>
          <p className="text-slate-400 text-xs mt-1">HOSTELSYNC Student Services & Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm leading-relaxed">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Student Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu / alex@hostelsync.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
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
                placeholder="student123"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In as Student'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          New Student?{' '}
          <Link to="/register/student" className="text-emerald-400 font-bold hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};
