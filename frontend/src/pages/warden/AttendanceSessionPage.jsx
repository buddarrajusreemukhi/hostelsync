import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { UserCheck, Search, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const AttendanceSessionPage = () => {
  const { students, attendances, markAttendance } = useHostelData();

  const [activeSession, setActiveSession] = useState('morning'); // morning, afternoon, evening
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [msg, setMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getStudentStatus = (roll) => {
    const record = attendances.find(a => a.studentRollNumber === roll && a.date === today);
    return record?.[activeSession] || 'NOT_MARKED';
  };

  const handleMark = (roll, status) => {
    markAttendance(roll, activeSession, status);
    if (status === 'ABSENT') {
      setMsg(`🚨 Marked ABSENT for ${roll}. Automated notifications sent to Student & Parent!`);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleBulkMark = (status) => {
    filteredStudents.forEach(s => {
      markAttendance(s.rollNumber, activeSession, status);
    });
    setMsg(`✅ Bulk marked all ${filteredStudents.length} students as ${status} for ${activeSession.toUpperCase()} session.`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" /> Daily Attendance Sessions
          </h1>
          <p className="text-xs text-slate-400">Mark student presence for Morning, Afternoon, Evening. Auto-triggers absence alert.</p>
        </div>

        {/* Session Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSession('morning')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSession === 'morning' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Morning Session
          </button>
          <button
            onClick={() => setActiveSession('afternoon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSession === 'afternoon' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Afternoon Session
          </button>
          <button
            onClick={() => setActiveSession('evening')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSession === 'evening' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evening Session
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-in fade-in">
          {msg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Roll No, Name or Room No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
          </select>

          {/* Bulk Action Buttons */}
          <button
            onClick={() => handleBulkMark('PRESENT')}
            className="px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleBulkMark('ABSENT')}
            className="px-3 py-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
            {activeSession} Session Roster ({filteredStudents.length} Students)
          </h3>
          <span className="text-xs text-amber-400 font-mono">Date: {today}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="p-3">Student Photo</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Department & Year</th>
                <th className="p-3">Room No</th>
                <th className="p-3 text-center">Current Status</th>
                <th className="p-3 text-right">Quick Mark Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.map(std => {
                const currentStatus = getStudentStatus(std.rollNumber);
                return (
                  <tr key={std.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <img src={std.photoUrl} alt={std.fullName} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-100">{std.rollNumber}</td>
                    <td className="p-3 font-bold text-slate-200">{std.fullName}</td>
                    <td className="p-3 text-slate-400">{std.department} (Yr {std.year})</td>
                    <td className="p-3 font-semibold text-amber-400">{std.roomNumber}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] ${
                        currentStatus === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        currentStatus === 'ABSENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        currentStatus === 'LATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleMark(std.rollNumber, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'PRESENT' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMark(std.rollNumber, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'ABSENT' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:bg-rose-600 hover:text-white'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleMark(std.rollNumber, 'LATE')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'LATE' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:bg-amber-600 hover:text-white'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
