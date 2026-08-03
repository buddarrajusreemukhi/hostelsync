import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Printer, ShieldCheck, Building, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const DocumentsPage = () => {
  const { getLinkedStudent } = useAuth();
  const student = getLinkedStudent();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Student Documents & Official ID
          </h1>
          <p className="text-xs text-slate-400">Download & print official hostel ID cards and admission letters.</p>
        </div>

        <button onClick={handlePrint} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer">
          <Printer className="w-4 h-4" /> Print Document Pass
        </button>
      </div>

      {/* Official Digital Hostel ID Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-6 lg:p-8 max-w-lg mx-auto shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-400" />
            <div>
              <span className="font-extrabold text-base tracking-wider text-slate-100">HOSTELSYNC ERP</span>
              <p className="text-[10px] text-indigo-300 font-bold uppercase">Official Student Identity Card</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            VERIFIED RESIDENT
          </span>
        </div>

        <div className="flex items-center gap-5">
          <img
            src={student?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
            alt={student?.fullName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-xl"
          />

          <div className="space-y-1 text-xs text-slate-300">
            <h3 className="font-extrabold text-lg text-slate-100">{student?.fullName}</h3>
            <p>Roll No: <strong className="text-amber-400 font-mono">{student?.rollNumber}</strong></p>
            <p>Hostel: <strong className="text-slate-200">{student?.hostelName}</strong></p>
            <p>Room: <strong className="text-slate-200">{student?.roomNumber}</strong></p>
            <p>Dept: <strong className="text-slate-200">{student?.department} (Year {student?.year})</strong></p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-indigo-500/20 text-[10px] text-slate-400">
          <div>
            <p>Emergency: <strong className="text-slate-300">{student?.emergencyContact}</strong></p>
            <p>Issued: August 2026</p>
          </div>

          <div className="bg-white p-2 rounded-xl">
            <QRCodeSVG value={`HOSTELSYNC_ID_${student?.rollNumber}`} size={60} />
          </div>
        </div>
      </div>

    </div>
  );
};
