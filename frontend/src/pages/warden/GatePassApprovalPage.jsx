import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { QRScannerModal } from '../../components/common/QRScannerModal';
import { QrCode, CheckCircle2, XCircle, Camera, Shield, AlertCircle } from 'lucide-react';

export const GatePassApprovalPage = () => {
  const { gatePasses, updateGatePassStatus } = useHostelData();

  const [showScanner, setShowScanner] = useState(false);
  const [wardenRemarkInput, setWardenRemarkInput] = useState('');
  const [selectedPassForRemark, setSelectedPassForRemark] = useState(null);

  const pendingPasses = gatePasses.filter(g => g.status === 'PENDING');
  const activeOutPasses = gatePasses.filter(g => g.status === 'APPROVED' || g.status === 'OUT');

  const handleDecision = (passId, status) => {
    updateGatePassStatus(passId, status, wardenRemarkInput || 'Reviewed by Warden.');
    setWardenRemarkInput('');
    setSelectedPassForRemark(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Scanner Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" /> Gate Pass Approvals & Security Scanner
          </h1>
          <p className="text-xs text-slate-400">Review student departure requests and scan QR codes at security gates.</p>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <Camera className="w-4 h-4" /> Open Live QR Gate Scanner
        </button>
      </div>

      {/* Pending Approvals Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
          <span>Pending Student Departure Requests</span>
          <span className="text-xs text-amber-400 font-mono">{pendingPasses.length} Pending</span>
        </h3>

        <div className="space-y-4">
          {pendingPasses.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No pending gate pass requests.</p>
          ) : (
            pendingPasses.map(gp => (
              <div key={gp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-100">{gp.passId}</span>
                      <span className="text-xs text-indigo-400 font-semibold">• {gp.studentName} ({gp.studentRollNumber})</span>
                      <span className="text-xs text-slate-400">Room {gp.roomNumber}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Reason: <strong className="text-slate-100">{gp.reason}</strong> (Destination: {gp.destination})</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1">
                      <span>Out: {new Date(gp.fromDateTime).toLocaleString()}</span>
                      <span>Return: {new Date(gp.toDateTime).toLocaleString()}</span>
                      <span className="text-emerald-400 font-semibold">Parent Consent: Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(gp.passId, 'APPROVED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Approve Pass
                    </button>
                    <button
                      onClick={() => handleDecision(gp.passId, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Reject Pass
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Approved & Out Passes Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3">
          Approved & Active Gate Passes Roster
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="p-3">Pass ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Status</th>
                <th className="p-3">Out Time</th>
                <th className="p-3">Return Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {activeOutPasses.map(gp => (
                <tr key={gp.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-100">{gp.passId}</td>
                  <td className="p-3 font-semibold text-slate-200">{gp.studentName} ({gp.studentRollNumber})</td>
                  <td className="p-3 text-slate-400">{gp.destination}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      gp.status === 'OUT' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {gp.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{gp.outTime ? new Date(gp.outTime).toLocaleTimeString() : 'Not Out Yet'}</td>
                  <td className="p-3 text-slate-400">{gp.inTime ? new Date(gp.inTime).toLocaleTimeString() : 'Outside'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />

    </div>
  );
};
