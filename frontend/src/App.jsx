import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HostelDataProvider } from './contexts/HostelDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PendingApprovalPage } from './pages/auth/PendingApprovalPage';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AttendanceCalendarPage } from './pages/student/AttendanceCalendarPage';
import { GatePassApplyPage } from './pages/student/GatePassApplyPage';
import { ComplaintsStudentPage } from './pages/student/ComplaintsStudentPage';
import { DocumentsPage } from './pages/student/DocumentsPage';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';

// Warden Pages
import { WardenDashboard } from './pages/warden/WardenDashboard';
import { AttendanceSessionPage } from './pages/warden/AttendanceSessionPage';
import { GatePassApprovalPage } from './pages/warden/GatePassApprovalPage';
import { ParcelHubPage } from './pages/warden/ParcelHubPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserApprovalsPage } from './pages/admin/UserApprovalsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { HostelManagementPage } from './pages/admin/HostelManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// Route Guard Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.approved) return <Navigate to="/pending-approval" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RootRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.approved) return <Navigate to="/pending-approval" replace />;
  if (currentUser.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (currentUser.role === 'WARDEN') return <Navigate to="/warden/dashboard" replace />;
  if (currentUser.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (currentUser.role === 'PARENT') return <Navigate to="/parent/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export function App() {
  return (
    <HostelDataProvider>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pending-approval" element={<PendingApprovalPage />} />

                {/* Protected ERP Dashboard Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RootRedirect />} />

                  {/* Student Routes */}
                  <Route path="student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="student/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><AttendanceCalendarPage /></ProtectedRoute>} />
                  <Route path="student/gatepass" element={<ProtectedRoute allowedRoles={['STUDENT']}><GatePassApplyPage /></ProtectedRoute>} />
                  <Route path="student/complaints" element={<ProtectedRoute allowedRoles={['STUDENT']}><ComplaintsStudentPage /></ProtectedRoute>} />
                  <Route path="student/laundry" element={<ProtectedRoute allowedRoles={['STUDENT']}><ComplaintsStudentPage /></ProtectedRoute>} />
                  <Route path="student/parcels" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="student/documents" element={<ProtectedRoute allowedRoles={['STUDENT']}><DocumentsPage /></ProtectedRoute>} />

                  {/* Parent Routes */}
                  <Route path="parent/dashboard" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
                  <Route path="parent/attendance" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
                  <Route path="parent/gatepass" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
                  <Route path="parent/complaints" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
                  <Route path="parent/parcels" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />

                  {/* Warden Routes */}
                  <Route path="warden/dashboard" element={<ProtectedRoute allowedRoles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />
                  <Route path="warden/attendance" element={<ProtectedRoute allowedRoles={['WARDEN']}><AttendanceSessionPage /></ProtectedRoute>} />
                  <Route path="warden/gatepass" element={<ProtectedRoute allowedRoles={['WARDEN']}><GatePassApprovalPage /></ProtectedRoute>} />
                  <Route path="warden/parcels" element={<ProtectedRoute allowedRoles={['WARDEN']}><ParcelHubPage /></ProtectedRoute>} />
                  <Route path="warden/laundry" element={<ProtectedRoute allowedRoles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />
                  <Route path="warden/complaints" element={<ProtectedRoute allowedRoles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />
                  <Route path="warden/visitors" element={<ProtectedRoute allowedRoles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />
                  <Route path="warden/inventory" element={<ProtectedRoute allowedRoles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserApprovalsPage /></ProtectedRoute>} />
                  <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
                  <Route path="admin/hostels" element={<ProtectedRoute allowedRoles={['ADMIN']}><HostelManagementPage /></ProtectedRoute>} />
                  <Route path="admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/audit" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogsPage /></ProtectedRoute>} />
                  <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

                  <Route path="*" element={<RootRedirect />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </HostelDataProvider>
  );
}

export default App;
