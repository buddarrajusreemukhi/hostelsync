import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { 
  UserCheck, QrCode, AlertCircle, PackageCheck, Shirt, 
  Sparkles, Calendar, Clock, MapPin, Building, ChevronRight, Download
} from 'lucide-react';

export const StudentDashboard = () => {
  const { getLinkedStudent } = useAuth();
  const { gatePasses, complaints, parcels, laundry, announcements } = useHostelData();

  const student = getLinkedStudent();
  const roll = student?.rollNumber;

  const myPasses = gatePasses.filter(g => g.studentRollNumber === roll);
  const myComplaints = complaints.filter(c => c.studentRollNumber === roll);
  const myParcels = parcels.filter(p => p.studentRollNumber === roll && p.status === 'READY_FOR_PICKUP');
  const myLaundry = laundry.filter(l => l.studentRollNumber === roll);

  const activePass = myPasses.find(g => g.status === 'APPROVED' || g.status === 'PENDING');

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={student?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
              alt={student?.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Student Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">Roll: {student?.rollNumber}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">
                Welcome back, {student?.fullName}!
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-indigo-400" /> {student?.hostelName} ({student?.roomNumber})</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {student?.department} (Year {student?.year})</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-right space-y-1 min-w-[200px]">
            <p className="text-xs text-slate-400 flex items-center justify-end gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {today}
            </p>
            <p className="text-lg font-bold text-slate-100 flex items-center justify-end gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> {time}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Attendance Stat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance</span>
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{student?.attendancePct || 92.5}%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Morning & Afternoon Present</span>
        </div>

        {/* Gate Pass Stat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gate Pass</span>
            <QrCode className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-100">{activePass ? activePass.status : 'No Active Pass'}</p>
          <span className="text-[10px] text-slate-400">{myPasses.length} Total Requests</span>
        </div>

        {/* Complaints Stat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Complaints</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{myComplaints.filter(c => c.status !== 'RESOLVED').length}</p>
          <span className="text-[10px] text-slate-400">Pending Resolution</span>
        </div>

        {/* Parcel Stat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Parcels</span>
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{myParcels.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Ready for Pickup</span>
        </div>

        {/* Laundry Stat */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Laundry</span>
            <Shirt className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-100">{myLaundry[0]?.status || 'No Active'}</p>
          <span className="text-[10px] text-slate-400">Last request</span>
        </div>

      </div>

      {/* Announcements & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hostel Announcements Box */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Official Hostel Notices & Announcements
            </h3>
            <span className="text-xs text-indigo-400 font-medium">{announcements.length} Notices</span>
          </div>

          <div className="space-y-3">
            {announcements.map(anc => (
              <div key={anc.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-200">{anc.title}</h4>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    anc.priority === 'IMPORTANT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {anc.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{anc.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Issued by: {anc.author}</span>
                  <span>{new Date(anc.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3">
            Quick ERP Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/student/gatepass"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>Apply for Digital Gate Pass</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/complaints"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Register Maintenance Complaint</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/laundry"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Shirt className="w-4 h-4 text-cyan-400" />
                <span>Request Laundry Service</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/documents"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Hostel ID Card</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
