import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Fingerprint, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { userService } from '../../services/api';
import { registerPasskey } from '../../utils/webauthn';

export const ProfilePage = () => {
  const { user, updateUserData } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    shiftSchedule: user?.shiftSchedule || '09:00 - 18:00',
    profileImage: user?.profileImage || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passkeyMsg, setPasskeyMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        shiftSchedule: user.shiftSchedule || '09:00 - 18:00',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await userService.updateProfile(formData);
      if (res.data.success) {
        updateUserData(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setSavingPassword(true);

    try {
      const res = await userService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully changed!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRegisterPasskey = async () => {
    setRegisteringPasskey(true);
    setPasskeyMsg(null);

    try {
      const res = await registerPasskey();
      if (res.success) {
        setPasskeyMsg({
          type: 'success',
          text: res.message || 'Passkey registered successfully! Biometric authentication is active.',
        });
        // Fetch fresh user profile to update biometricRegistered status
        const profRes = await userService.getProfile();
        if (profRes.data.success && profRes.data.user) {
          updateUserData(profRes.data.user);
        }
      } else {
        setPasskeyMsg({
          type: 'error',
          text: res.error || 'Failed to register passkey. Please try again.',
        });
      }
    } catch (err) {
      setPasskeyMsg({
        type: 'error',
        text: err.message || 'Passkey enrollment error',
      });
    } finally {
      setRegisteringPasskey(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Account Preferences
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
          Profile & Security Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your personal details, corporate credentials, and biometric hardware status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Biometric Hardware Card (1 col) */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 text-center">
            <div className="relative inline-block mx-auto mb-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <h3 className="text-base font-black text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
              {user?.designation} • {user?.employeeId}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.department}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Corporate Email:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">System Role:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shift Schedule:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user?.shiftSchedule || '09:00 - 18:00'}</span>
              </div>
            </div>
          </div>

          {/* Biometric Authentication Passkey Card */}
          <div className={`glass-card rounded-3xl p-5 border ${
            user?.biometricRegistered
              ? 'border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10'
              : 'border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
              <Fingerprint className={`w-5 h-5 ${user?.biometricRegistered ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span>Biometric Authentication</span>
            </div>

            <div className="mt-3 text-xs space-y-1">
              <span className="text-gray-500 dark:text-gray-400 block font-medium">Status:</span>
              {user?.biometricRegistered ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Registered ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" /> Not Registered
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              {user?.biometricRegistered
                ? 'FIDO2 / WebAuthn hardware passkey is active. You can punch attendance with biometric validation.'
                : 'Register this device, your phone, or a security key as your corporate biometric passkey.'}
            </p>

            {passkeyMsg && (
              <div
                className={`p-2.5 rounded-xl mt-3 text-xs font-medium ${
                  passkeyMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {passkeyMsg.text}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                size="sm"
                variant={user?.biometricRegistered ? "outline" : "primary"}
                onClick={handleRegisterPasskey}
                isLoading={registeringPasskey}
                leftIcon={<Fingerprint className="w-4 h-4" />}
                className="w-full text-xs font-bold"
              >
                {user?.biometricRegistered ? 'Register Another Device / Passkey' : 'Register Passkey'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Forms (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Edit Personal Profile
            </h3>

            {profileMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Profile Avatar URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={savingProfile}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Update Password Credentials
            </h3>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" size="sm" isLoading={savingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
