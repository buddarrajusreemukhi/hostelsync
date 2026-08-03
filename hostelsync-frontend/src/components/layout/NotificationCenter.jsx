import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, Shirt, Package, KeyRound, Info } from 'lucide-react';
import api from '../../services/api';

export const NotificationCenter = ({ onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Gate Pass Approved',
      message: 'Your gate pass application GP-10928 has been approved by Warden.',
      type: 'GATE_PASS',
      isRead: false,
      createdAt: '10 mins ago'
    },
    {
      id: '2',
      title: 'Parcel Arrived',
      message: 'Your parcel from Amazon Logistics has arrived at Warden office.',
      type: 'PARCEL',
      isRead: false,
      createdAt: '1 hour ago'
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'GATE_PASS': return <KeyRound size={16} className="text-emerald-400" />;
      case 'PARCEL': return <Package size={16} className="text-amber-400" />;
      case 'LAUNDRY': return <Shirt size={16} className="text-indigo-400" />;
      case 'ATTENDANCE': return <AlertTriangle size={16} className="text-rose-400" />;
      default: return <Info size={16} className="text-indigo-400" />;
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card rounded-2xl p-4 border border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-sm">Notification Center</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            No notifications available
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-all ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{n.title}</span>
                    <span className="text-[10px] text-slate-500">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
