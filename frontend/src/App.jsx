import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  );
}

export default App;
