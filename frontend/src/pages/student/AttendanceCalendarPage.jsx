import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { UserCheck, Download, Calendar, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

export const AttendanceCalendarPage = () => {
  const { getLinkedStudent } = useAuth();
  const { attendances } = useHostelData();

  const student = getLinkedStudent();
  const studentAtts = attendances.filter(a => a.studentRollNumber === student?.rollNumber);

  const handleDownloadPdf = () => {
    alert(`Downloading official Attendance PDF Report for ${student?.fullName} (${student?.rollNumber})...`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" /> Student Attendance Log
          </h1>
          <p className="text-xs text-slate-400">Daily session status (Morning, Afternoon, Evening) & monthly report.</p>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download Report PDF
        </button>
      </div>

      {/* Today's Session Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Morning Session</span>
            <h3 className="text-lg font-extrabold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-5 h-5" /> PRESENT
            </h3>
            <p className="text-[10px] text-slate-500">07:30 AM Logged</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            07:30
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Afternoon Session</span>
            <h3 className="text-lg font-extrabold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-5 h-5" /> PRESENT
            </h3>
            <p className="text-[10px] text-slate-500">01:15 PM Logged</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            01:15
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evening Session</span>
            <h3 className="text-lg font-extrabold text-amber-400 flex items-center gap-1.5 mt-1">
              <Clock className="w-5 h-5" /> PENDING
            </h3>
            <p className="text-[10px] text-slate-500">Scheduled 08:30 PM</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            08:30
          </div>
        </div>

      </div>

      {/* Attendance History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" /> Attendance History Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Morning</th>
                <th className="p-3">Afternoon</th>
                <th className="p-3">Evening</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {studentAtts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">No attendance logs found.</td>
                </tr>
              ) : (
                studentAtts.map(att => (
                  <tr key={att.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-200">{att.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        att.morning === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>{att.morning}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        att.afternoon === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>{att.afternoon}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-800 text-slate-400">
                        {att.evening}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{att.remarks || 'Normal'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
