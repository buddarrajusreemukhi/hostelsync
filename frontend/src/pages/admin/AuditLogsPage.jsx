import React from 'react';
import { useHostelData } from '../../contexts/HostelDataContext';
import { History, Shield, Download } from 'lucide-react';

export const AuditLogsPage = () => {
  const { auditLogs } = useHostelData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" /> Immutable System Audit Logs
          </h1>
          <p className="text-xs text-slate-400">Complete audit trail for logins, approvals, attendance, room allocations & gate passes.</p>
        </div>

        <button onClick={() => alert('Downloading CSV Audit Trail...')} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
          <Download className="w-4 h-4" /> Export CSV Audit Trail
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="p-3">Log ID</th>
                <th className="p-3">Action</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Details</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-500">{log.id}</td>
                  <td className="p-3 font-bold text-indigo-400 font-mono">{log.action}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.user}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-800 text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{log.ip}</td>
                  <td className="p-3 text-slate-400">{log.details}</td>
                  <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
