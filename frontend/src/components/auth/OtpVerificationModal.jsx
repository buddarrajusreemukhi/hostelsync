import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, RefreshCw, X, ArrowRight } from 'lucide-react';

export const OtpVerificationModal = ({ isOpen, email, onVerify, onResend, demoOtp }) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendLock, setResendLock] = useState(60); // 60 seconds resend
  const [resendAttempts, setResendAttempts] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(300);
    setResendLock(60);
    setError('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
      setResendLock(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    // Auto move to next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter complete 6-digit OTP code.');
      return;
    }
    try {
      onVerify(code);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendClick = () => {
    if (resendLock > 0) return;
    if (resendAttempts >= 3) {
      setError('Maximum 3 resend attempts reached. Please try registering again.');
      return;
    }
    setResendAttempts(prev => prev + 1);
    setResendLock(60);
    setTimer(300);
    if (onResend) onResend();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-100">2-Step Email OTP Verification</h3>
          <p className="text-xs text-slate-400">
            We have sent a 6-digit verification code to <strong className="text-slate-200">{email}</strong>
          </p>
          {demoOtp && (
            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-xl inline-block font-mono">
              Demo OTP Code: <strong>{demoOtp}</strong> (or enter <strong>123456</strong>)
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-center text-xl font-bold text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Expiry in: <strong className="text-slate-200">{formatTime(timer)}</strong>
            </span>

            <button
              type="button"
              onClick={handleResendClick}
              disabled={resendLock > 0 || resendAttempts >= 3}
              className={`flex items-center gap-1 font-semibold cursor-pointer transition-all ${
                resendLock > 0 || resendAttempts >= 3
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLock > 0 ? 'animate-spin' : ''}`} />
              {resendLock > 0 ? `Resend in ${resendLock}s` : 'Resend OTP'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verify & Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
