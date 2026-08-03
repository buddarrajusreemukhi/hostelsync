import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleGuard } from './routes/RoleGuard';

// Auth Pages
import { LoginHub } from './pages/auth/LoginHub';
import { AdminLogin } from './pages/auth/AdminLogin';
import { WardenLogin } from './pages/auth/WardenLogin';
import { StudentLogin } from './pages/auth/StudentLogin';
import { ParentLogin } from './pages/auth/ParentLogin';
import { StudentRegister } from './pages/auth/StudentRegister';
import { ParentRegister } from './pages/auth/ParentRegister';

// Dashboards
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WardenDashboard } from './pages/warden/WardenDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ParentDashboard } from './pages/parent/ParentDashboard';

// Shared Pages
import { ProfilePage } from './pages/shared/ProfilePage';
import { SettingsPage } from './pages/shared/SettingsPage';
import { AiAssistantPage } from './pages/shared/AiAssistantPage';
import { MessMenuPage } from './pages/shared/MessMenuPage';
import { EmergencyPage } from './pages/shared/EmergencyPage';
import { NotFound } from './pages/shared/NotFound';
import { Unauthorized } from './pages/shared/Unauthorized';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginHub />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/warden" element={<WardenLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/parent" element={<ParentLogin />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/register/parent" element={<ParentRegister />} />

            {/* Protected Routes inside SaaS Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* Admin Only */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/approvals" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminDashboard />} />
                  <Route path="/admin/hostel" element={<AdminDashboard />} />
                  <Route path="/admin/audit-logs" element={<AdminDashboard />} />
                </Route>

                {/* Warden Only */}
                <Route element={<RoleGuard allowedRoles={['WARDEN']} />}>
                  <Route path="/warden/dashboard" element={<WardenDashboard />} />
                  <Route path="/warden/attendance" element={<WardenDashboard />} />
                  <Route path="/warden/gate-passes" element={<WardenDashboard />} />
                  <Route path="/warden/laundry" element={<WardenDashboard />} />
                  <Route path="/warden/parcels" element={<WardenDashboard />} />
                  <Route path="/warden/complaints" element={<WardenDashboard />} />
                </Route>

                {/* Student Only */}
                <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/gate-pass" element={<StudentDashboard />} />
                  <Route path="/student/laundry" element={<StudentDashboard />} />
                  <Route path="/student/parcels" element={<StudentDashboard />} />
                  <Route path="/student/complaints" element={<StudentDashboard />} />
                </Route>

                {/* Parent Only */}
                <Route element={<RoleGuard allowedRoles={['PARENT']} />}>
                  <Route path="/parent/dashboard" element={<ParentDashboard />} />
                </Route>

                {/* Shared Accessible Routes */}
                <Route path="/shared/profile" element={<ProfilePage />} />
                <Route path="/shared/settings" element={<SettingsPage />} />
                <Route path="/shared/ai-assistant" element={<AiAssistantPage />} />
                <Route path="/shared/mess-menu" element={<MessMenuPage />} />
                <Route path="/shared/emergency" element={<EmergencyPage />} />
              </Route>
            </Route>

            {/* Error Pages */}
            <Route path="/shared/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
