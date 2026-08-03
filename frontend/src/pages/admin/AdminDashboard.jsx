import React from 'react';
import { Link } from 'react-router-dom';
import { useHostelData } from '../../contexts/HostelDataContext';
import { 
  Users, UserCheck, Shield, Building, QrCode, AlertCircle, 
  PackageCheck, Map, History, Settings, BarChart3, Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const { users, students, parents, hostels, gatePasses, complaints, parcels, auditLogs } = useHostelData();

  const pendingApprovals = users.filter(u => u.pending || (!u.approved && u.verified));
  const totalWardens = users.filter(u => u.role === 'WARDEN');

  const totalCapacity = hostels.reduce((acc, h) => acc + h.capacity, 0);
  const totalOccupied = hostels.reduce((acc, h) => acc + h.occupied, 0);
  const occupancyPct = ((totalOccupied / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Command Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Super Admin Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Status: ALL SYSTEMS NOMINAL</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">
              HostelSync Enterprise Command
            </h1>
            <p className="text-xs text-slate-400">Master user approval, room allocations, security policies & audit logs.</p>
          </div>

          <Link
            to="/admin/approvals"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <UserCheck className="w-4 h-4" /> Pending Approvals Queue ({pendingApprovals.length})
          </Link>
        </div>
      </div>

      {/* Enterprise Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Registrations</span>
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{pendingApprovals.length}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Requires Admin Manual Approval</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{students.length}</p>
          <span className="text-[10px] text-slate-400">Enrolled Students</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Hostel Occupancy</span>
            <Building className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{occupancyPct}%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">{totalOccupied} / {totalCapacity} Beds</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Wardens</span>
            <Shield className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{totalWardens.length}</p>
          <span className="text-[10px] text-slate-400">Chief Wardens Staff</span>
        </div>

      </div>

      {/* Admin Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          to="/admin/approvals"
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-rose-400 transition-colors">
              User Approvals System
            </h3>
            <p className="text-xs text-slate-400 mt-1">Verify and approve new Student and Parent account registrations.</p>
          </div>
        </Link>

        <Link
          to="/admin/hostels"
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
              Interactive Hostel Map & Rooms
            </h3>
            <p className="text-xs text-slate-400 mt-1">Color-coded visual floor plan, capacity tracking & student allocation.</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors">
              Warden & User Management
            </h3>
            <p className="text-xs text-slate-400 mt-1">Create Warden accounts, assign hostels/floors & reset user credentials.</p>
          </div>
        </Link>

      </div>

      {/* Audit Logs Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> Recent System Audit Logs
          </h3>
          <Link to="/admin/audit" className="text-xs text-indigo-400 font-bold hover:underline">View All Audit Logs →</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="p-3">Action</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Details</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-indigo-400 font-mono">{log.action}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.user}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-800 text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{log.ip}</td>
                  <td className="p-3 text-slate-400">{log.details}</td>
                  <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
