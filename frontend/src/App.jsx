import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/public/HomePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageGames from './pages/admin/ManageGames';
import GameCategories from './pages/admin/GameCategories';
import RentalPricing from './pages/admin/RentalPricing';
import ManageRentalPlans from './pages/admin/ManageRentalPlans';
import WebsiteContent from './pages/admin/WebsiteContent';
import MediaLibrary from './pages/admin/MediaLibrary';
import ContactSettings from './pages/admin/ContactSettings';
import SocialSettings from './pages/admin/SocialSettings';
import AdminProfile from './pages/admin/AdminProfile';
import ActivityLogs from './pages/admin/ActivityLogs';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#120d24',
            color: '#fff',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(168, 85, 247, 0.25)',
            fontSize: '12px',
            borderRadius: '14px',
            padding: '12px 16px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Backoffice */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="games" element={<ManageGames />} />
          <Route path="categories" element={<GameCategories />} />
          <Route path="pricing" element={<RentalPricing />} />
          <Route path="rental-plans" element={<ManageRentalPlans />} />
          <Route path="content" element={<WebsiteContent />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="contact" element={<ContactSettings />} />
          <Route path="social" element={<SocialSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="logs" element={<ActivityLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
