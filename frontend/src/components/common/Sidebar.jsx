import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, UserCheck, QrCode, ClipboardList, PackageCheck, 
  Shirt, ShieldAlert, Users, Building, History, BarChart3, Settings, 
  User, FileText, Map, AlertCircle, Sparkles, LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role;

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/attendance', label: 'Attendance', icon: UserCheck },
    { to: '/student/gatepass', label: 'Digital Gate Pass', icon: QrCode },
    { to: '/student/complaints', label: 'Complaints', icon: AlertCircle },
    { to: '/student/laundry', label: 'Laundry Service', icon: Shirt },
    { to: '/student/parcels', label: 'Parcel Hub', icon: PackageCheck },
    { to: '/student/documents', label: 'Documents & IDs', icon: FileText }
  ];

  const parentLinks = [
    { to: '/parent/dashboard', label: 'Child Overview', icon: LayoutDashboard },
    { to: '/parent/attendance', label: 'Child Attendance', icon: UserCheck },
    { to: '/parent/gatepass', label: 'Gate Pass History', icon: QrCode },
    { to: '/parent/complaints', label: 'Complaints History', icon: AlertCircle },
    { to: '/parent/parcels', label: 'Parcels & Notices', icon: PackageCheck }
  ];

  const wardenLinks = [
    { to: '/warden/dashboard', label: 'Warden Dashboard', icon: LayoutDashboard },
    { to: '/warden/attendance', label: 'Attendance Sessions', icon: UserCheck },
    { to: '/warden/gatepass', label: 'Gate Pass & QR Scanner', icon: QrCode },
    { to: '/warden/parcels', label: 'Parcel Management', icon: PackageCheck },
    { to: '/warden/laundry', label: 'Laundry Requests', icon: Shirt },
    { to: '/warden/complaints', label: 'Complaints Resolution', icon: AlertCircle },
    { to: '/warden/visitors', label: 'Visitor Logs', icon: Users },
    { to: '/warden/inventory', label: 'Hostel Inventory', icon: ClipboardList }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Command', icon: LayoutDashboard },
    { to: '/admin/approvals', label: 'User Approvals', icon: UserCheck, badge: 'NEW' },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/hostels', label: 'Interactive Hostel Map', icon: Map },
    { to: '/admin/analytics', label: 'Smart Analytics', icon: BarChart3 },
    { to: '/admin/audit', label: 'Audit Logs', icon: History },
    { to: '/admin/settings', label: 'System Settings', icon: Settings }
  ];

  let links = [];
  if (role === 'STUDENT') links = studentLinks;
  else if (role === 'PARENT') links = parentLinks;
  else if (role === 'WARDEN') links = wardenLinks;
  else if (role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        
        {/* Navigation Category Label */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Main Navigation ({role})
          </h3>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-500 text-white rounded-md">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* SaaS Quick Info Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" /> AI Auto Alerts Active
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Real-time SMS & email absence notifications are enabled for parent & student safety.
          </p>
        </div>

      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
