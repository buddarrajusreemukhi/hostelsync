import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  KeyRound,
  Shirt,
  Package,
  AlertCircle,
  Users,
  Building2,
  FileSpreadsheet,
  Utensils,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'User Approvals', path: '/admin/approvals', icon: Users },
          { label: 'Hostel & Rooms', path: '/admin/hostel', icon: Building2 },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet },
        ];
      case 'WARDEN':
        return [
          { label: 'Operations Desk', path: '/warden/dashboard', icon: LayoutDashboard },
          { label: 'GPS Attendance', path: '/warden/attendance', icon: UserCheck },
          { label: 'Gate Passes', path: '/warden/gate-passes', icon: KeyRound },
          { label: 'Laundry Lifecycle', path: '/warden/laundry', icon: Shirt },
          { label: 'Parcels Desk', path: '/warden/parcels', icon: Package },
          { label: 'Complaints', path: '/warden/complaints', icon: AlertCircle },
        ];
      case 'STUDENT':
        return [
          { label: 'Student Services', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Gate Pass', path: '/student/gate-pass', icon: KeyRound },
          { label: 'Laundry', path: '/student/laundry', icon: Shirt },
          { label: 'Expected Parcels', path: '/student/parcels', icon: Package },
          { label: 'Complaints', path: '/student/complaints', icon: AlertCircle },
        ];
      case 'PARENT':
        return [
          { label: 'Ward Monitoring', path: '/parent/dashboard', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const sharedNavItems = [
    { label: 'Mess Menu', path: '/shared/mess-menu', icon: Utensils },
    { label: 'Emergency SOS', path: '/shared/emergency', icon: ShieldAlert },
  ];

  const getPortalTheme = () => {
    switch (user?.role) {
      case 'ADMIN': return 'from-indigo-600 to-indigo-900 border-indigo-500/30';
      case 'WARDEN': return 'from-teal-600 to-teal-900 border-teal-500/30';
      case 'STUDENT': return 'from-emerald-600 to-emerald-900 border-emerald-500/30';
      case 'PARENT': return 'from-amber-600 to-amber-900 border-amber-500/30';
      default: return 'from-slate-800 to-slate-900 border-slate-700';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 glass-sidebar flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/90 ${
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-indigo-500/20">
                HS
              </div>
              <span className={`font-extrabold text-lg tracking-wider text-slate-100 font-mono ${collapsed ? 'hidden md:hidden' : 'block'}`}>
                HOSTEL<span className="text-emerald-400">SYNC</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors hidden md:block"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 md:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* User Role Badge */}
          <div className="px-4 py-3 border-b border-slate-800/60">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${getPortalTheme()} border text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-md ${collapsed ? 'justify-center' : ''}`}>
              <ShieldCheck size={16} />
              <span className={collapsed ? 'hidden md:hidden' : 'block'}>{user?.role} PORTAL</span>
            </div>
          </div>

          {/* Role Specific Nav Items */}
          <nav className="p-3 space-y-1">
            <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className={collapsed ? 'hidden md:hidden' : 'block'}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Shared Tools Nav Items */}
          <nav className="p-3 space-y-1 border-t border-slate-800/60">
            <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
              Campus Tools
            </div>
            {sharedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className={collapsed ? 'hidden md:hidden' : 'block'}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className={`p-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center ${collapsed ? 'hidden md:hidden' : 'block'}`}>
          HOSTELSYNC ERP v1.0 • Enterprise Dark
        </div>
      </aside>
    </>
  );
};
