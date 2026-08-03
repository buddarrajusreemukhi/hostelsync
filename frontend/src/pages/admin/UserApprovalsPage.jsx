import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { UserCheck, CheckCircle2, XCircle, ShieldCheck, Mail, Phone } from 'lucide-react';

export const UserApprovalsPage = () => {
  const { users, approveUser, rejectUser, students, parents } = useHostelData();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [msg, setMsg] = useState('');

  const pendingUsers = users.filter(u => u.pending || (!u.approved && u.verified));

  const filteredPending = pendingUsers.filter(u => selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter);

  const handleApprove = (userId) => {
    approveUser(userId);
    setMsg('✅ User account approved! Login access enabled.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleReject = (userId) => {
    rejectUser(userId);
    setMsg('❌ Registration rejected.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleBulkApprove = () => {
    filteredPending.forEach(u => approveUser(u.id));
    setMsg(`✅ Approved all ${filteredPending.length} pending registrations.`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" /> Pending Registrations Approval Queue
          </h1>
          <p className="text-xs text-slate-400">Newly registered Students & Parents must be approved before login permission is granted.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Roles ({pendingUsers.length})</option>
            <option value="STUDENT">Students Only</option>
            <option value="PARENT">Parents Only</option>
          </select>

          <button
            onClick={handleBulkApprove}
            disabled={filteredPending.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Bulk Approve ({filteredPending.length})
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Pending User Cards Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPending.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-bold text-slate-300">Approval Queue Empty</p>
            <p>All registered students and parents have been reviewed and approved.</p>
          </div>
        ) : (
          filteredPending.map(user => {
            const studentDetails = students.find(s => s.userId === user.id || s.email === user.email);
            const parentDetails = parents.find(p => p.userId === user.id || p.email === user.email);

            return (
              <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-sm text-indigo-400">
                        {user.fullName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{user.fullName}</h3>
                        <span className="text-[11px] text-slate-400">@{user.username}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      user.role === 'STUDENT' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> {user.email} (Email Verified: Yes)
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {user.mobileNumber}
                    </p>

                    {user.role === 'STUDENT' && studentDetails && (
                      <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                        <p>Roll Number: <strong className="text-amber-400">{studentDetails.rollNumber}</strong></p>
                        <p>Dept & Year: <strong className="text-slate-200">{studentDetails.department} (Year {studentDetails.year})</strong></p>
                        <p>Parent Email: <strong className="text-slate-400">{studentDetails.parentEmail}</strong></p>
                      </div>
                    )}

                    {user.role === 'PARENT' && parentDetails && (
                      <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                        <p>Linked Child Roll: <strong className="text-emerald-400">{parentDetails.childRollNumber}</strong></p>
                        <p>Relationship: <strong className="text-slate-200">{parentDetails.relationship}</strong> ({parentDetails.occupation})</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval Action Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve User
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Registration
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
