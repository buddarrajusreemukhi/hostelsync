import React, { useEffect, useState } from 'react';
import { Users, BedDouble, TrendingUp, CheckCircle, Clock, XCircle, ShieldCheck, UserCheck, Search, GraduationCap, User } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { mockStorage } from '../../services/mockStorage';
import api from '../../services/api';
import toast from 'react-hot-toast';

const chartData = [
  { name: 'Mon', attendance: 92, complaints: 4 },
  { name: 'Tue', attendance: 95, complaints: 2 },
  { name: 'Wed', attendance: 88, complaints: 6 },
  { name: 'Thu', attendance: 96, complaints: 1 },
  { name: 'Fri', attendance: 91, complaints: 3 },
  { name: 'Sat', attendance: 84, complaints: 5 },
  { name: 'Sun', attendance: 89, complaints: 2 },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 342,
    totalCapacity: 500,
    occupiedBeds: 342,
    todayPresentCount: 310,
    todayAbsentCount: 32,
  });

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [search, setSearch] = useState('');

  const loadPending = () => {
    const list = mockStorage.getPendingApprovals();
    setPendingApprovals(list);
  };

  useEffect(() => {
    loadPending();
    api.get('/admin/dashboard')
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleApprove = (id, name) => {
    mockStorage.approveUser(id);
    toast.success(`Approved account for ${name}`);
    loadPending();
  };

  const handleReject = (id, name) => {
    mockStorage.rejectUser(id);
    toast.error(`Rejected account for ${name}`);
    loadPending();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const filtered = pendingApprovals.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const occupancyRate = Math.round((stats.occupiedBeds / (stats.totalCapacity || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">SAAS Admin Overview</h1>
          <p className="text-slate-400 text-sm mt-1">HostelSync ERP System Metrics & Pending Approvals Desk</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 mt-2">{stats.totalStudents}</div>
          <div className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> +12% this semester
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 mt-2">{pendingApprovals.length}</div>
          <div className="text-xs text-amber-400 font-medium mt-2">Requires Admin review</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bed Occupancy</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <BedDouble size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 mt-2">{occupancyRate}%</div>
          <div className="text-xs text-slate-400 font-medium mt-2">{stats.occupiedBeds} / {stats.totalCapacity} Beds occupied</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today Present</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100 mt-2">{stats.todayPresentCount}</div>
          <div className="text-xs text-emerald-400 font-medium mt-2">{stats.todayAbsentCount} marked absent today</div>
        </div>
      </div>

      {/* Interactive Pending Approvals Desk */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="text-amber-400" size={20} /> User Registration Approval Queue
          </h3>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pending registrations..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            No pending user registration requests. All registered users are approved!
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => {
              const hasCustom = user.profilePhotoType === 'CUSTOM' && user.profilePhotoUrl;
              return (
                <div key={user.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {hasCustom ? (
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{user.fullName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          user.role === 'STUDENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Email: {user.email} | Phone: {user.phoneNumber || 'N/A'} | Gender: {user.gender}
                      </div>
                      {user.rollNumber && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Roll: <span className="text-slate-300 font-mono">{user.rollNumber}</span> | Dept: {user.department}
                        </div>
                      )}
                      {user.linkedStudentName && (
                        <div className="text-[11px] text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                          <GraduationCap size={12} /> Verified Linked Ward: {user.linkedStudentName} (Roll: {user.linkedStudentRoll})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(user.id, user.fullName)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <CheckCircle size={16} /> Approve User
                    </button>
                    <button
                      onClick={() => handleReject(user.id, user.fullName)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs transition-all"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Weekly Attendance Trend (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Weekly Complaints Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="complaints" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
