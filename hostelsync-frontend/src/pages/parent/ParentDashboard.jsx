import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, KeyRound, Shirt, Package, AlertCircle, CheckCircle, ShieldCheck, Clock, MapPin, Bell, ShieldAlert, AlertTriangle } from 'lucide-react';
import { mockStorage } from '../../services/mockStorage';
import api from '../../services/api';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const [wardInfo, setWardInfo] = useState({
    name: user?.linkedStudentName || 'Alex Mercer',
    roll: user?.linkedStudentRoll || '21CSE089',
    room: '101',
    block: 'Block A - Alpha',
    department: 'Computer Science Engineering',
    year: '3rd Year',
    attendanceRate: 94.5,
  });

  const [gatePasses, setGatePasses] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [laundryList, setLaundryList] = useState([]);

  // Session Attendance Alert State
  const [currentSession, setCurrentSession] = useState('EVENING');
  const [todayAttendanceStatus, setTodayAttendanceStatus] = useState('ABSENT');

  useEffect(() => {
    const allUsers = mockStorage.getUsers();
    let student = null;

    if (user?.linkedStudentId) {
      student = allUsers.find(u => u.id === user.linkedStudentId);
    }
    if (!student && user?.linkedStudentName) {
      student = allUsers.find(u => u.fullName?.toLowerCase() === user.linkedStudentName.toLowerCase());
    }
    if (!student && user?.linkedStudentRoll) {
      student = allUsers.find(u => u.rollNumber?.toLowerCase() === user.linkedStudentRoll.toLowerCase());
    }
    if (!student) {
      student = allUsers.find(u => u.role === 'STUDENT') || {
        fullName: 'Alex Mercer',
        rollNumber: '21CSE089',
        roomNumber: '101',
        blockName: 'Block A - Alpha',
        department: 'Computer Science Engineering',
        yearOfStudy: '3rd Year'
      };
    }

    setWardInfo({
      name: student.fullName,
      roll: student.rollNumber || '21CSE089',
      room: student.roomNumber || '101',
      block: student.blockName || 'Block A - Alpha',
      department: student.department || 'Computer Science Engineering',
      year: student.yearOfStudy || '3rd Year',
      attendanceRate: 94.5
    });

    const allGatePasses = mockStorage.getGatePasses();
    setGatePasses(allGatePasses.filter(g => g.studentName?.toLowerCase() === student.fullName.toLowerCase() || g.rollNumber === student.rollNumber));

    const allParcels = mockStorage.getParcels();
    setParcels(allParcels.filter(p => p.studentName?.toLowerCase() === student.fullName.toLowerCase()));

    const allAttendance = mockStorage.getAttendance();
    const wardAtt = allAttendance.filter(a => a.studentName?.toLowerCase() === student.fullName.toLowerCase() || a.rollNumber === student.rollNumber);
    setAttendanceLogs(wardAtt);

    const eveningRecord = wardAtt.find(a => a.session === 'EVENING');
    if (eveningRecord && eveningRecord.status === 'PRESENT') {
      setTodayAttendanceStatus('PRESENT');
    } else {
      setTodayAttendanceStatus('ABSENT');
    }

    const allComplaints = mockStorage.getComplaints();
    setComplaints(allComplaints.filter(c => c.studentName?.toLowerCase() === student.fullName.toLowerCase()));

    const allLaundry = mockStorage.getLaundry();
    setLaundryList(allLaundry.filter(l => l.studentName?.toLowerCase() === student.fullName.toLowerCase()));
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-2xl shadow-xl">
            <GraduationCap size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Parent Ward Portal</span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                {wardInfo.roll}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 mt-1">{wardInfo.name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{wardInfo.department} • {wardInfo.year}</p>
            <p className="text-xs text-slate-400 mt-1">Room {wardInfo.room} ({wardInfo.block})</p>
          </div>
        </div>

        <div className="text-center md:text-right bg-slate-900/80 p-4 rounded-2xl border border-slate-800 min-w-[180px]">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semester Attendance</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{wardInfo.attendanceRate}%</div>
          <div className={`text-[11px] font-bold mt-1 ${todayAttendanceStatus === 'PRESENT' ? 'text-emerald-400' : 'text-rose-400'}`}>
            Today Session: {todayAttendanceStatus}
          </div>
        </div>
      </div>

      {/* TODAY'S ATTENDANCE ALERT BANNER */}
      {todayAttendanceStatus === 'ABSENT' ? (
        <div className="p-5 rounded-3xl bg-rose-500/15 border-2 border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-rose-600/30">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-rose-400 text-base uppercase tracking-wider">ATTENDANCE ALERT</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase font-mono">
                  {currentSession} SESSION
                </span>
              </div>
              <p className="text-slate-200 text-xs md:text-sm mt-0.5 font-medium leading-relaxed">
                Your ward <span className="text-white font-bold">{wardInfo.name}</span> has <span className="text-rose-400 font-extrabold underline">NOT marked attendance</span> for today's {currentSession} Session (08:00 PM). Status is currently <span className="text-rose-400 font-black">ABSENT</span>.
              </p>
            </div>
          </div>
          <div className="text-xs text-rose-300 font-semibold bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800 self-stretch md:self-auto text-center">
            Automatic Alert Triggered
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-400" size={24} />
            <div>
              <div className="font-bold text-slate-100 text-sm">Attendance Confirmed</div>
              <div className="text-xs text-slate-400">
                Your ward <span className="text-emerald-400 font-semibold">{wardInfo.name}</span> is present for today's {currentSession} session via GPS Geofence verification.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ward Status Grid - 360 Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gate Passes */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Gate Passes</span>
            <KeyRound className="text-emerald-400" size={18} />
          </div>
          {gatePasses.length > 0 ? (
            <div>
              <div className="text-sm font-bold text-slate-100">{gatePasses[0].destination}</div>
              <div className="text-xs text-slate-400 mt-1">Reason: {gatePasses[0].reason}</div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-2 border ${
                gatePasses[0].status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {gatePasses[0].status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active gate passes.</p>
          )}
        </div>

        {/* Parcels */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parcels Desk</span>
            <Package className="text-amber-400" size={18} />
          </div>
          {parcels.length > 0 ? (
            <div>
              <div className="text-sm font-bold text-slate-100">{parcels[0].courierCompany}</div>
              <div className="text-xs text-slate-400 mt-1">ID: <span className="font-mono text-amber-400 font-bold bg-slate-900 px-1 rounded">{parcels[0].trackingNumber}</span></div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-2 border ${
                parcels[0].status === 'READY_FOR_COLLECTION' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {parcels[0].status === 'READY_FOR_COLLECTION' ? 'READY AT DESK' : 'AWAITING ARRIVAL'}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No parcels logged.</p>
          )}
        </div>

        {/* Laundry */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laundry Tracker</span>
            <Shirt className="text-indigo-400" size={18} />
          </div>
          {laundryList.length > 0 ? (
            <div>
              <div className="text-sm font-bold text-slate-100">{laundryList[0].clothesCount} Clothes ({laundryList[0].washType})</div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold mt-2">
                STATUS: {laundryList[0].status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active laundry wash.</p>
          )}
        </div>

        {/* Complaints */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room Complaints</span>
            <AlertCircle className="text-rose-400" size={18} />
          </div>
          {complaints.length > 0 ? (
            <div>
              <div className="text-sm font-bold text-slate-100">{complaints[0].category}</div>
              <div className="text-xs text-slate-400 mt-1 truncate">{complaints[0].description}</div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-2 border ${
                complaints[0].status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {complaints[0].status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active complaints.</p>
          )}
        </div>
      </div>

      {/* Attendance Log Stream */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-teal-400" /> Ward GPS Attendance Verification Log
        </h3>

        {attendanceLogs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">No attendance entries recorded.</div>
        ) : (
          <div className="space-y-3">
            {attendanceLogs.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-100">{a.session} Session</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Lat {a.latitude?.toFixed(4)}° N, Lng {a.longitude?.toFixed(4)}° E | Verified: {a.timestamp}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                  {a.status} (GPS VERIFIED)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Security Activity Stream */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-400" /> Daily Security & Campus Activity Stream ({wardInfo.name})
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100">Campus Security Gate Status</div>
                <div className="text-xs text-slate-400">Inside Hostel Premises</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              SECURE INSIDE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
