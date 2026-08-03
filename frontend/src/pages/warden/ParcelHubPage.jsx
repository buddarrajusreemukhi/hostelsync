import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { PackageCheck, Plus, CheckCircle2, AlertCircle, Search } from 'lucide-react';

export const ParcelHubPage = () => {
  const { parcels, createParcel, markParcelCollected, students } = useHostelData();

  const [courierCompany, setCourierCompany] = useState('Amazon Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [parcelType, setParcelType] = useState('Electronics / Accessories');
  const [remarks, setRemarks] = useState('Handle with care');

  const [msg, setMsg] = useState('');

  const handleRegisterParcel = (e) => {
    e.preventDefault();
    try {
      createParcel({
        courierCompany,
        trackingNumber,
        studentRollNumber,
        parcelType,
        remarks
      });
      setMsg(`✅ Registered parcel ${trackingNumber}. Instant notifications sent to Student & Parent!`);
      setTrackingNumber('');
      setStudentRollNumber('');
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-emerald-400" /> Parcel & Courier Management Hub
        </h1>
        <p className="text-xs text-slate-400">Log incoming deliveries and automatically alert students and parents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* New Parcel Entry Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-400" /> Register Incoming Parcel
          </h3>

          {msg && <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-200">{msg}</div>}

          <form onSubmit={handleRegisterParcel} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Courier Company</label>
              <select
                value={courierCompany}
                onChange={(e) => setCourierCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="Amazon Logistics">Amazon Logistics</option>
                <option value="Flipkart Express">Flipkart Express</option>
                <option value="Blue Dart">Blue Dart</option>
                <option value="DTDC Courier">DTDC Courier</option>
                <option value="India Post">India Post</option>
                <option value="FedEx">FedEx</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tracking Number</label>
              <input
                type="text"
                required
                placeholder="e.g. AMZ-99887766"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Student Roll Number</label>
              <select
                required
                value={studentRollNumber}
                onChange={(e) => setStudentRollNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.rollNumber}>{s.fullName} ({s.rollNumber}) - Room {s.roomNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Parcel Type</label>
              <input
                type="text"
                value={parcelType}
                onChange={(e) => setParcelType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition-all cursor-pointer"
            >
              Log Parcel & Trigger Notifications
            </button>
          </form>
        </div>

        {/* Parcels Log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Parcels Registry Log</span>
            <span className="text-xs text-emerald-400">{parcels.length} Packages</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <th className="p-3">Courier</th>
                  <th className="p-3">Tracking No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {parcels.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-100">{p.courierCompany}</td>
                    <td className="p-3 font-mono text-slate-400">{p.trackingNumber}</td>
                    <td className="p-3 font-semibold text-slate-200">{p.studentName} ({p.studentRollNumber})</td>
                    <td className="p-3 font-semibold text-amber-400">{p.roomNumber}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        p.status === 'READY_FOR_PICKUP' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.status === 'READY_FOR_PICKUP' ? (
                        <button
                          onClick={() => markParcelCollected(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Mark Collected
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">Collected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
