import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import { mockStorage } from '../../services/mockStorage';
import toast from 'react-hot-toast';

export const ParentRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    gender: '', // MANDATORY!
    studentRollNumber: '', // MANDATORY LINKAGE!
    studentEmail: '',      // MANDATORY LINKAGE!
    occupation: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [linkedWardName, setLinkedWardName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.gender) {
      setError('Please select a valid Gender.');
      return;
    }

    if (!formData.studentRollNumber || !formData.studentEmail) {
      setError('Student Roll Number and Student Email are strictly required to link your ward.');
      return;
    }

    setSubmitting(true);

    // Validate Student linkage against registered students
    const users = mockStorage.getUsers();
    const matchedStudent = users.find(
      (u) =>
        u.role === 'STUDENT' &&
        u.rollNumber?.toLowerCase() === formData.studentRollNumber.trim().toLowerCase() &&
        u.email?.toLowerCase() === formData.studentEmail.trim().toLowerCase()
    );

    if (!matchedStudent) {
      setError(`Ward Validation Failed: No registered student found matching Roll Number '${formData.studentRollNumber}' and Student Email '${formData.studentEmail}'. Please verify your child's student registration.`);
      setSubmitting(false);
      return;
    }

    // Ward validation passed
    setLinkedWardName(`${matchedStudent.fullName} (${matchedStudent.rollNumber})`);

    try {
      const res = await api.post('/auth/register/parent', {
        ...formData,
        linkedStudentId: matchedStudent.id
      });
      if (res.data.success) {
        setSuccess(true);
        toast.success('Parent registration submitted for Admin approval!');
        return;
      }
    } catch (err) {
      mockStorage.registerParent({
        ...formData,
        linkedStudentId: matchedStudent.id,
        linkedStudentName: matchedStudent.fullName,
        linkedStudentRoll: matchedStudent.rollNumber
      });
      setSuccess(true);
      toast.success('Parent registration submitted for Admin approval!');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-amber-500/30 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-100 mb-2">Ward Validation Passed!</h2>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            Your Parent account has been linked to student <span className="text-amber-400 font-bold">{linkedWardName}</span>. Your registration is now <span className="text-amber-400 font-bold">awaiting Admin approval</span>.
          </p>
          <Link
            to="/login/parent"
            className="inline-block w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all"
          >
            Return to Parent Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full glass-card p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-100">PARENT REGISTRATION</h2>
          <p className="text-slate-400 text-xs mt-1">HostelSync ERP Parent Ward Verification</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm leading-relaxed">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Robert Mercer"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">Gender (Required)</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-amber-500 outline-none"
              >
                <option value="">-- Select Gender --</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="parent@email.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+19876543211"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Student Ward Linkage Section */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap size={16} /> Ward Verification (Mandatory Student Matching)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Child Student Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.studentRollNumber}
                  onChange={(e) => setFormData({ ...formData, studentRollNumber: e.target.value })}
                  placeholder="21CSE089"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Child Registered Email</label>
                <input
                  type="email"
                  required
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  placeholder="student@university.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 8 chars"
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Verifying Ward & Submitting...' : 'Verify Ward & Register Parent'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login/parent" className="text-amber-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
