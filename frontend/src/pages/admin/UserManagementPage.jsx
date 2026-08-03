import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { Users, Plus, Shield, UserCheck, AlertCircle, KeyRound } from 'lucide-react';

export const UserManagementPage = () => {
  const { users, createWarden, hostels } = useHostelData();

  const [showWardenModal, setShowWardenModal] = useState(false);
  const [wFullName, setWFullName] = useState('');
  const [wUsername, setWUsername] = useState('');
  const [wEmail, setWEmail] = useState('');
  const [wMobile, setWMobile] = useState('');
  const [wGender, setWGender] = useState('Male');
  const [wPassword, setWPassword] = useState('Warden@123');
  const [wEmployeeId, setWEmployeeId] = useState('EMP-WRD-002');
  const [wHostel, setWHostel] = useState(hostels[0]?.name || 'Titanium Boys Block A');

  const [msg, setMsg] = useState('');

  const handleCreateWardenSubmit = (e) => {
    e.preventDefault();
    try {
      createWarden({
        fullName: wFullName,
        username: wUsername,
        email: wEmail,
        mobileNumber: wMobile,
        gender: wGender,
        password: wPassword,
        employeeId: wEmployeeId,
        hostelAssigned: wHostel
      });
      setMsg(`✅ Warden account created successfully for ${wFullName}!`);
      setShowWardenModal(false);
      setWFullName('');
      setWUsername('');
      setWEmail('');
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> User & Warden Management
          </h1>
          <p className="text-xs text-slate-400">Admin management of Wardens, Students, and Parents.</p>
        </div>

        <button
          onClick={() => setShowWardenModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Warden Account
        </button>
      </div>

      {msg && <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 text-xs text-slate-200">{msg}</div>}

      {/* Users Master Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
          Registered Accounts Directory ({users.length} Total Users)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="p-3">User Details</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email & Mobile</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-100">
                    {u.fullName} <span className="text-slate-400 font-mono text-[11px]">(@{u.username})</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      u.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      u.role === 'WARDEN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      u.role === 'STUDENT' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{u.email} | {u.mobileNumber || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      u.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {u.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warden Creation Modal */}
      {showWardenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> Admin Warden Creation Form
              </h3>
              <button onClick={() => setShowWardenModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateWardenSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input type="text" required value={wFullName} onChange={(e) => setWFullName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username</label>
                  <input type="text" required value={wUsername} onChange={(e) => setWUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input type="email" required value={wEmail} onChange={(e) => setWEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                  <input type="text" required value={wMobile} onChange={(e) => setWMobile(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employee ID</label>
                  <input type="text" required value={wEmployeeId} onChange={(e) => setWEmployeeId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assign Hostel</label>
                  <select value={wHostel} onChange={(e) => setWHostel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100">
                    {hostels.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input type="text" required value={wPassword} onChange={(e) => setWPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowWardenModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold">Create Warden</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
