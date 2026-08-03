import React, { useState } from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { QrCode, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose }) => {
  const { scanGatePassQr, gatePasses } = useHostelData();
  const [manualQrInput, setManualQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleScan = (qrCodeToTest) => {
    setErrorMsg('');
    setScanResult(null);
    try {
      const result = scanGatePassQr(qrCodeToTest || manualQrInput);
      setScanResult(result);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <QrCode className="w-5 h-5" /> Security Gate Pass QR Scanner
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Scanner Simulation Graphic */}
        <div className="relative w-full h-48 bg-slate-950 border-2 border-dashed border-indigo-500/40 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-indigo-500/10 animate-pulse" />
          <QrCode className="w-16 h-16 text-indigo-400 mb-2 opacity-80" />
          <p className="text-xs text-indigo-300 font-semibold">Optical Camera Scanner Ready</p>
          <span className="text-[10px] text-slate-500">Align student gate pass QR code inside frame</span>
        </div>

        {/* Quick Demo Scan Shortcuts */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase text-slate-400">Approved Passes Ready for Scan:</p>
          <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
            {gatePasses.filter(g => g.status === 'APPROVED' || g.status === 'OUT').map(gp => (
              <div
                key={gp.id}
                onClick={() => handleScan(gp.qrCodeData)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <span className="font-bold text-slate-200">{gp.passId}</span> ({gp.studentName})
                  <p className="text-[10px] text-slate-400">Current Status: <strong className="text-indigo-400">{gp.status}</strong></p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-lg">
                  Scan {gp.status === 'APPROVED' ? 'OUT' : 'RETURN'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Input Fallback */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or enter Pass ID / QR Data manually..."
            value={manualQrInput}
            onChange={(e) => setManualQrInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          />
          <button
            onClick={() => handleScan()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Verify
          </button>
        </div>

        {/* Result Message */}
        {scanResult && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Scan Verified! Action: Marked {scanResult.action}
            </div>
            <p>Student: <strong>{scanResult.pass.studentName}</strong> | Roll: <strong>{scanResult.pass.studentRollNumber}</strong></p>
            <p className="text-[11px] opacity-80">Timestamp logged to security gate log database.</p>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> {errorMsg}
          </div>
        )}

      </div>
    </div>
  );
};
