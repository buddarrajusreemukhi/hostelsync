import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { QrCode, Plus, CheckCircle2, Clock, XCircle, Shield, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const GatePassApplyPage = () => {
  const { getLinkedStudent } = useAuth();
  const { gatePasses, applyGatePass } = useHostelData();

  const student = getLinkedStudent();
  const myPasses = gatePasses.filter(g => g.studentRollNumber === student?.rollNumber);

  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(student?.emergencyContact || '');
  const [parentConsent, setParentConsent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // QR Modal View
  const [selectedQrPass, setSelectedQrPass] = useState(null);

  const handleApply = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!parentConsent) {
      setError('You must confirm Parent Consent before submitting request.');
      return;
    }

    try {
      applyGatePass({
        studentRollNumber: student?.rollNumber,
        fromDateTime,
        toDateTime,
        reason,
        destination,
        emergencyContact,
        parentConsent
      });
      setSuccessMsg('✅ Digital Gate Pass request submitted successfully! Sent for Warden approval.');
      setReason('');
      setDestination('');
      setFromDateTime('');
      setToDateTime('');
      setParentConsent(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-indigo-400" /> Digital Gate Pass Management
        </h1>
        <p className="text-xs text-slate-400">Apply for hostel departure permits & access approved QR gate codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-indigo-400" /> Apply New Gate Pass
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" /> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Departure Date & Time</label>
              <input
                type="datetime-local"
                required
                value={fromDateTime}
                onChange={(e) => setFromDateTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Expected Return Date & Time</label>
              <input
                type="datetime-local"
                required
                value={toDateTime}
                onChange={(e) => setToDateTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination</label>
              <input
                type="text"
                required
                placeholder="e.g. Home, Hospital, City Centre"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reason for Gate Pass</label>
              <textarea
                required
                rows={2}
                placeholder="State valid reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Emergency Contact Number</label>
              <input
                type="text"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="consent"
                checked={parentConsent}
                onChange={(e) => setParentConsent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-indigo-600 bg-slate-950 cursor-pointer"
              />
              <label htmlFor="consent" className="text-slate-400 cursor-pointer">
                I confirm that my parents are informed & consent to this pass.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md transition-all cursor-pointer"
            >
              Submit Gate Pass Request
            </button>
          </form>
        </div>

        {/* History List & QR Code Cards */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Gate Pass History & QR Pass Code</span>
            <span className="text-xs text-indigo-400">{myPasses.length} Permits</span>
          </h3>

          <div className="space-y-3">
            {myPasses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">No gate pass applications submitted yet.</p>
            ) : (
              myPasses.map(gp => (
                <div key={gp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-sm text-slate-100">{gp.passId}</span>
                      <span className="text-xs text-slate-400 ml-2">({gp.destination})</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      gp.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      gp.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      gp.status === 'OUT' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {gp.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">Reason: {gp.reason}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>From: {new Date(gp.fromDateTime).toLocaleString()}</span>
                    <span>To: {new Date(gp.toDateTime).toLocaleString()}</span>
                  </div>

                  {gp.status === 'APPROVED' && (
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedQrPass(gp)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" /> View Security QR Code
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* QR Code Display Modal */}
      {selectedQrPass && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="font-bold text-sm text-slate-100">Gate Security Pass QR</h3>
            <p className="text-xs text-slate-400">{selectedQrPass.passId} | {student?.fullName}</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
              <QRCodeSVG value={selectedQrPass.qrCodeData} size={180} />
            </div>

            <p className="text-[11px] text-emerald-400 font-semibold">Status: APPROVED by Warden</p>
            <p className="text-[10px] text-slate-500">Show this QR code at the main hostel security gate for scanning.</p>

            <button
              onClick={() => setSelectedQrPass(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Close QR Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
