import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  User,
  Shield,
  Bell,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../../../types';
import { ModalShell } from '../../../components/common/ModalShell';

interface SettingsPageProps {
  role: UserRole;
  onToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  role,
  onToast,
}) => {
  const navigate = useNavigate();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    onToast('Settings saved successfully!');
  };

  return (
    <div id="settings-page" className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* 2-Column Grid of Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Account Settings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
            <User className="w-4 h-4 text-[#059669]" />
            <h2 className="font-bold text-sm text-[#1F2937]">Account Settings</h2>
          </div>

          <div className="divide-y divide-[#F3F4F6] text-xs">
            <button
              onClick={() => navigate(role === 'admin' ? '/admin/profile' : '/student/profile')}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Edit Profile</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Update your personal details, contact info & bio
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Change Password</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Update your university authentication password
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              onClick={() => onToast('Email management synced with Sharjah identity.')}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Manage Email</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Official @sharjah.ac.ae routing and aliases
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        {/* Card 2: Privacy & Security */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
            <Shield className="w-4 h-4 text-[#059669]" />
            <h2 className="font-bold text-sm text-[#1F2937]">Privacy & Security</h2>
          </div>

          <div className="divide-y divide-[#F3F4F6] text-xs">
            <button
              onClick={() => onToast('2FA is active via Sharjah Authenticator App.')}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Two-Factor Authentication</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Protect account with 2FA OTP verification
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              onClick={() => onToast('Location access is restricted to campus Wi-Fi.')}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Location Access</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Manage geographical permissions for exams & labs
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>

            <button
              onClick={() => onToast('Data permissions strictly comply with UAE FERPA.')}
              className="w-full py-3 flex items-center justify-between hover:text-[#059669] transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-[#1F2937]">Data Permissions</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Academic transcript sharing with advisors
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        {/* Card 3: Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
            <Bell className="w-4 h-4 text-[#059669]" />
            <h2 className="font-bold text-sm text-[#1F2937]">Notifications</h2>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-[#1F2937]">Email Notifications</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Receive status alerts directly to your inbox
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailNotifs ? 'bg-[#059669]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    emailNotifs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-[#1F2937]">SMS Alerts</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Urgent SMS updates for critical petition outcomes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  smsAlerts ? 'bg-[#059669]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    smsAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: System Settings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
            <Sliders className="w-4 h-4 text-[#059669]" />
            <h2 className="font-bold text-sm text-[#1F2937]">System Settings</h2>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-[#1F2937]">Dark Mode</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Switch portal visual contrast theme
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDarkMode(!darkMode);
                  onToast('Dark mode preference updated.');
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? 'bg-[#059669]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-[#1F2937]">Auto Updates</span>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Keep banner notifications in live sync
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoUpdates(!autoUpdates)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoUpdates ? 'bg-[#059669]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autoUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2.5 rounded-xl border border-[#FEE2E2] bg-[#FEE2E2] hover:bg-[#FECACA] text-[#EF4444] text-xs font-bold transition-all"
        >
          Delete Account
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
          >
            Change Password
          </button>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ModalShell>
          <h3 className="text-base font-bold text-[#1F2937]">Change Password</h3>
          <p className="text-xs text-[#6B7280] mt-1">
            Enter your current password and a new secure password.
          </p>
          <div className="my-4 flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-[#1F2937]">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1F2937]">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full mt-1 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1F2937]">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full mt-1 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F3F4F6] text-[#4B5563]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowPasswordModal(false);
                onToast('Password changed successfully!');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#059669] text-white"
            >
              Update Password
            </button>
          </div>
        </ModalShell>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <ModalShell borderColorClass="border-[#EF4444]/30">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Delete Account Notice</h3>
          </div>
          <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
            University accounts are linked with active Sharjah Banner transcripts. Deletion requests require registrar verification and cannot be undone directly.
          </p>
          <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-[#F3F4F6]">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F3F4F6] text-[#4B5563]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                onToast('Deletion request submitted to University Registrar.');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#EF4444] text-white"
            >
              Confirm Request
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};
