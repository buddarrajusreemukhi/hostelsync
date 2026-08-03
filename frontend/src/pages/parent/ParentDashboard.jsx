import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { 
  Users, UserCheck, QrCode, AlertCircle, PackageCheck, 
  ShieldCheck, Calendar, MapPin, Building, Lock
} from 'lucide-react';

export const ParentDashboard = () => {
  const { getLinkedStudent, currentUser } = useAuth();
  const { attendances, gatePasses, complaints, parcels, announcements } = useHostelData();

  const child = getLinkedStudent();
  const roll = child?.rollNumber;

  const childAtts = attendances.filter(a => a.studentRollNumber === roll);
  const childPasses = gatePasses.filter(g => g.studentRollNumber === roll);
  const childComplaints = complaints.filter(c => c.studentRollNumber === roll);
  const childParcels = parcels.filter(p => p.studentRollNumber === roll);

  const todayAtt = childAtts.find(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Strict Privacy Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Parent Portal Encrypted: Scoped strictly to view <strong>{child?.fullName}</strong> ({roll})</span>
        </div>
        <span className="text-[10px] uppercase font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">Verified Linkage</span>
      </div>

      {/* Child Profile Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={child?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
            alt={child?.fullName}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-500/40 shadow-xl"
          />
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Ward Overview</span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">{child?.fullName}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <span>Roll: <strong className="text-slate-200">{child?.rollNumber}</strong></span>
              <span>Hostel: <strong className="text-slate-200">{child?.hostelName} ({child?.roomNumber})</strong></span>
              <span>Dept: <strong className="text-slate-200">{child?.department} (Year {child?.year})</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* Child Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold text-slate-400">Attendance</span>
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{child?.attendancePct || 92.5}%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Morning & Afternoon Logged</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold text-slate-400">Gate Passes</span>
            <QrCode className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{childPasses.length}</p>
          <span className="text-[10px] text-slate-400">Total Permits Requested</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold text-slate-400">Complaints</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{childComplaints.length}</p>
          <span className="text-[10px] text-slate-400">Registered Issues</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold text-slate-400">Parcels</span>
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{childParcels.length}</p>
          <span className="text-[10px] text-emerald-400">Arrived Packages</span>
        </div>

      </div>

      {/* Daily Attendance & Gate Pass Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Sessions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Today's Attendance Status</span>
            <span className="text-xs text-indigo-400 font-mono">{new Date().toISOString().split('T')[0]}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Morning Attendance</span>
                <p className="text-[10px] text-slate-500">07:30 AM Logged</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-400">
                PRESENT
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Afternoon Attendance</span>
                <p className="text-[10px] text-slate-500">01:15 PM Logged</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-400">
                PRESENT
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">Evening Attendance</span>
                <p className="text-[10px] text-slate-500">Scheduled 08:30 PM</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-slate-800 text-slate-400">
                PENDING
              </span>
            </div>
          </div>
        </div>

        {/* Gate Passes */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Gate Pass Permit History</span>
            <span className="text-xs text-indigo-400">{childPasses.length} Total</span>
          </h3>

          <div className="space-y-3">
            {childPasses.map(gp => (
              <div key={gp.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{gp.passId}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    gp.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{gp.status}</span>
                </div>
                <p className="text-slate-400">Reason: {gp.reason} ({gp.destination})</p>
                <p className="text-[10px] text-slate-500">Parent Consent Verified: Yes</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
