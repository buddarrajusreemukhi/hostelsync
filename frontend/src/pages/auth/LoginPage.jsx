import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { OtpVerificationModal } from '../../components/auth/OtpVerificationModal';
import { 
  Building2, Shield, UserCheck, GraduationCap, Users, 
  Lock, Mail, KeyRound, ArrowRight, AlertCircle, Info, Sparkles 
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginStepOne, loginStepTwoVerifyOtp } = useAuth();

  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2FA OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('');

  const roles = [
    {
      id: 'STUDENT',
      label: 'Student Login',
      icon: GraduationCap,
      color: 'from-indigo-600 to-blue-600',
      badge: 'Student Portal',
      desc: 'Access attendance, gate passes, complaints & laundry.'
    },
    {
      id: 'PARENT',
      label: 'Parent Login',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Parent Portal',
      desc: 'Monitor your child’s attendance, gate pass & safety.'
    },
    {
      id: 'WARDEN',
      label: 'Warden Login',
      icon: UserCheck,
      color: 'from-amber-600 to-orange-600',
      badge: 'ERP Operations',
      desc: 'Take attendance, approve passes & parcel hub.'
    },
    {
      id: 'ADMIN',
      label: 'Admin Login',
      icon: Shield,
      color: 'from-rose-600 to-pink-600',
      badge: 'Super Admin',
      desc: 'Manage hostels, approve users & system audit.'
    }
  ];

  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = loginStepOne(identifier, password, selectedRole);
      setPendingEmail(res.email);
      setDemoOtpCode(res.demoOtp);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = (code) => {
    try {
      const user = loginStepTwoVerifyOtp(code);
      setShowOtpModal(false);

      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'WARDEN') navigate('/warden/dashboard');
      else if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'PARENT') navigate('/parent/dashboard');
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> HostelSync Enterprise SaaS ERP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Sign In to <span className="text-indigo-400">HostelSync</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Select your account role below to access your enterprise dashboard.
          </p>
        </div>

        {/* 4 Role Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(r => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => { setSelectedRole(r.id); setError(''); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{r.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{r.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Credential Notes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Info className="w-4 h-4" /> System Access & Default Credentials
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div>• <strong>Admin Account:</strong> <code>admin</code> / <code>Admin@123</code></div>
            <div>• <strong>Warden Account:</strong> <code>warden</code> / <code>Warden@123</code></div>
            <div className="col-span-full text-amber-400/90 font-medium">
              ⚠️ Students and Parents MUST register. No demo student/parent logins exist. All registrations require Admin approval.
            </div>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> Step 1: Password Authentication ({selectedRole})
            </h3>
            <span className="text-[11px] text-slate-400">Followed by 2FA Email OTP</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleStepOneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username or Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'ADMIN' ? 'admin' : selectedRole === 'WARDEN' ? 'warden' : 'Enter registered email...'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Validate & Send Login OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Redirect */}
          {(selectedRole === 'STUDENT' || selectedRole === 'PARENT') && (
            <div className="text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              Don't have an approved account?{' '}
              <Link to="/register" className="text-indigo-400 font-bold hover:underline">
                Register as Student or Parent
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* 2FA OTP Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        email={pendingEmail}
        demoOtp={demoOtpCode}
        onVerify={handleVerifyOtp}
        onResend={() => console.log('Resent OTP')}
      />

    </div>
  );
};
