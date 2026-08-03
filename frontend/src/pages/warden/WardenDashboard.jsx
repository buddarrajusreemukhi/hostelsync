import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { 
  UserCheck, QrCode, PackageCheck, Shirt, AlertCircle, 
  Users, Building, Calendar, Clock, ChevronRight, Sparkles, Shield
} from 'lucide-react';

export const WardenDashboard = () => {
  const { currentUser } = useAuth();
  const { students, attendances, gatePasses, complaints, parcels, laundry, hostels } = useHostelData();

  const hostelName = currentUser?.hostelAssigned || 'Titanium Boys Block A';
  const hostelStudents = students.filter(s => s.hostelName === hostelName || true);

  const pendingPasses = gatePasses.filter(g => g.status === 'PENDING');
  const openComplaints = complaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS');
  const readyParcels = parcels.filter(p => p.status === 'READY_FOR_PICKUP');
  const pendingLaundry = laundry.filter(l => l.status === 'ACCEPTED');

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Chief Warden Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentUser?.employeeId || 'EMP-WRD-001'}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">
              Welcome, {currentUser?.fullName || 'Warden'}!
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <Building className="w-3.5 h-3.5 text-amber-400" /> Assigned Hostel: <strong className="text-slate-200">{hostelName}</strong>
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-right space-y-1 min-w-[200px]">
            <p className="text-xs text-slate-400 flex items-center justify-end gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {today}
            </p>
            <p className="text-lg font-bold text-slate-100 flex items-center justify-end gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> {time}
            </p>
          </div>
        </div>
      </div>

      {/* Warden Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{hostelStudents.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Morning Attendance Logged</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Gate Passes</span>
            <QrCode className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{pendingPasses.length}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Requires Warden Approval</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Open Complaints</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{openComplaints.length}</p>
          <span className="text-[10px] text-rose-400 font-semibold">Maintenance Action Required</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold text-slate-400 uppercase">Parcels at Office</span>
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{readyParcels.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Ready for Pickup</span>
        </div>

      </div>

      {/* Operations Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          to="/warden/attendance"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors">
              Take Attendance Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-1">Morning, Afternoon & Evening sessions. Automated parent alerts on ABSENT.</p>
          </div>
        </Link>

        <Link
          to="/warden/gatepass"
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
              Gate Pass & QR Scanner
            </h3>
            <p className="text-xs text-slate-400 mt-1">Review pending departure requests & scan QR codes at security gate.</p>
          </div>
        </Link>

        <Link
          to="/warden/parcels"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all group space-y-3 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
              Parcel & Courier Hub
            </h3>
            <p className="text-xs text-slate-400 mt-1">Log incoming Amazon/Flipkart packages & trigger instant parent/student alerts.</p>
          </div>
        </Link>

      </div>

    </div>
  );
};
