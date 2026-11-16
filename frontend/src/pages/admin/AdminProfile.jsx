import React, { useState, useEffect } from 'react';
import { UserCheck, Lock, Save, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ImageUploadCropper from '../../components/admin/ImageUploadCropper';

const AdminProfile = () => {
  const { admin, updateAdminData } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    avatar: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setProfileForm({
        fullName: admin.fullName || '',
        email: admin.email || '',
        avatar: admin.avatar || '',
      });
    }
  }, [admin]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    try {
      setSavingProfile(true);
      const res = await api.put('/auth/profile', profileForm);
      if (res.data.success) {
        toast.success('Admin profile updated successfully!');
        setProfileMessage('Profile updated successfully.');
        updateAdminData(res.data.admin);
        setTimeout(() => setProfileMessage(''), 3000);
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Error updating profile.';
      toast.error(errText);
      setProfileError(errText);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const err = 'New password and confirm password do not match.';
      toast.error(err);
      setPasswordError(err);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      const err = 'New password must be at least 6 characters long.';
      toast.error(err);
      setPasswordError(err);
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPasswordMessage('Password changed successfully. Your credentials are now updated.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage(''), 4000);
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Failed to change password. Verify current password.';
      toast.error(errText);
      setPasswordError(errText);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
          Admin Profile & Security
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Manage administrator account details, contact info, and change authentication passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-xs pb-3 border-b border-purple-500/10">
            <UserCheck className="w-4 h-4" />
            <span>Administrator Profile</span>
          </div>

          {profileMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileMessage}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Username (Read-Only)</label>
              <input
                type="text"
                disabled
                value={admin?.username || 'admin'}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 text-zinc-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>

            <div>
              <ImageUploadCropper
                label="Avatar Profile Picture"
                value={profileForm.avatar}
                onChange={(url) => setProfileForm((prev) => ({ ...prev, avatar: url }))}
                aspect={1}
                tag="avatar"
                helperText="Square 1:1 ratio optimal for profile avatar"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Updating...' : 'Update Profile'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-xs pb-3 border-b border-purple-500/10">
            <Lock className="w-4 h-4" />
            <span>Change Security Password</span>
          </div>

          {passwordMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{passwordMessage}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-0.5"
                  tabIndex={-1}
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">New Password (Min 6 Characters) *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-0.5"
                  tabIndex={-1}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-0.5"
                  tabIndex={-1}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{savingPassword ? 'Changing...' : 'Change Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
