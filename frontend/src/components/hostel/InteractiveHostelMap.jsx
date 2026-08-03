import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { Building2, Bed, CheckCircle2, AlertTriangle, XCircle, UserPlus, Info } from 'lucide-react';

export const InteractiveHostelMap = () => {
  const { hostels, allocateRoom, students } = useHostelData();
  const [selectedHostel, setSelectedHostel] = useState(hostels[0]?.id || 'hst-1');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const [studentRollToAllocate, setStudentRollToAllocate] = useState('');
  const [allocationMsg, setAllocationMsg] = useState('');

  const currentHostel = hostels.find(h => h.id === selectedHostel) || hostels[0];

  // Helper room color
  const getRoomColor = (occupied, total) => {
    if (occupied === total) return 'bg-rose-500/20 border-rose-500/50 text-rose-400';
    if (occupied >= total - 1) return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
    return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!studentRollToAllocate || !selectedRoom) return;
    try {
      allocateRoom(studentRollToAllocate, currentHostel.name, selectedRoom.roomNo);
      setAllocationMsg(`✅ Successfully allocated Room ${selectedRoom.roomNo} to ${studentRollToAllocate}!`);
      setTimeout(() => {
        setShowAllocateModal(false);
        setAllocationMsg('');
        setStudentRollToAllocate('');
      }, 1500);
    } catch (err) {
      setAllocationMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Top Header & Hostel Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" /> Interactive Hostel Layout Map
          </h2>
          <p className="text-xs text-slate-400">Visual floor plan with real-time bed capacity and occupancy status.</p>
        </div>

        {/* Building Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {hostels.map(h => (
            <button
              key={h.id}
              onClick={() => setSelectedHostel(h.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                selectedHostel === h.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Occupancy Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
        <span className="text-slate-400 font-bold">Occupancy Key:</span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Available Beds (&gt;2 Available)
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> Nearly Full (1 Bed Remaining)
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" /> Fully Occupied (0 Beds)
        </div>
      </div>

      {/* Floor by Floor Grid */}
      <div className="space-y-6">
        {currentHostel.floors.map(floor => (
          <div key={floor.floorNumber} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-xs text-indigo-300 uppercase tracking-wider">
                Floor #{floor.floorNumber}
              </h4>
              <span className="text-[11px] text-slate-400">
                Occupancy: <strong className="text-slate-200">{floor.occupiedBeds} / {floor.capacityBeds} Beds</strong>
              </span>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: floor.totalRooms }).map((_, idx) => {
                const roomNo = `${floor.floorNumber}0${idx + 1}`;
                const totalBeds = 3;
                const occupiedBeds = idx === 1 || idx === 3 ? 3 : (idx % 2 === 0 ? 2 : 1);
                const colorClass = getRoomColor(occupiedBeds, totalBeds);

                return (
                  <div
                    key={roomNo}
                    onClick={() => {
                      setSelectedRoom({ roomNo, occupiedBeds, totalBeds, floor: floor.floorNumber });
                      setShowAllocateModal(true);
                    }}
                    className={`p-3 rounded-2xl border ${colorClass} transition-all hover:scale-105 cursor-pointer flex flex-col justify-between h-24 relative group shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-100">Room {roomNo}</span>
                      <Bed className="w-4 h-4 opacity-80" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span>Beds Occupied</span>
                        <span className="font-bold">{occupiedBeds}/{totalBeds}</span>
                      </div>
                      {/* Mini Bed Meter */}
                      <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-current h-full rounded-full transition-all"
                          style={{ width: `${(occupiedBeds / totalBeds) * 100}%` }}
                        />
                      </div>
                    </div>

                    <span className="absolute bottom-1 right-2 text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to Allocate
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Modal */}
      {showAllocateModal && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" /> Allocate Student to Room {selectedRoom.roomNo}
              </h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Hostel: <strong className="text-slate-200">{currentHostel.name}</strong> | Occupancy: <strong className="text-indigo-400">{selectedRoom.occupiedBeds} / {selectedRoom.totalBeds} Beds</strong>
            </p>

            {allocationMsg && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                {allocationMsg}
              </div>
            )}

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student (Roll Number)</label>
                <select
                  value={studentRollToAllocate}
                  onChange={(e) => setStudentRollToAllocate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.rollNumber}>{s.fullName} ({s.rollNumber}) - Current Room: {s.roomNumber}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAllocateModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
