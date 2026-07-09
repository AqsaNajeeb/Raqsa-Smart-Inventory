import React, { useState } from 'react';
import { Bell, Mail, Trash2, X } from 'lucide-react';

const SettingsTab = ({ settings, setSettings }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-8">
      <h2 className="text-xl font-semibold text-purple-800">
        Account Settings
      </h2>

      {/* Notifications */}
      <div className="space-y-4 bg-white/80 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-purple-700 flex items-center gap-2">
          <Bell size={18} /> Notifications
        </h3>

        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Email notifications</p>
            <p className="text-sm text-gray-500">
              Receive important updates about your account.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => toggleSetting('emailNotifications')}
            className="w-5 h-5 accent-purple-600 mt-1"
          />
        </label>

        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Order updates</p>
            <p className="text-sm text-gray-500">
              Get notified when your order status changes.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.orderUpdates}
            onChange={() => toggleSetting('orderUpdates')}
            className="w-5 h-5 accent-purple-600 mt-1"
          />
        </label>
      </div>

      {/* Emails */}
      <div className="space-y-4 bg-white/80 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-purple-700 flex items-center gap-2">
          <Mail size={18} /> Emails
        </h3>

        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Marketing emails</p>
            <p className="text-sm text-gray-500">
              Receive offers, promotions, and product updates.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.marketingEmails}
            onChange={() => toggleSetting('marketingEmails')}
            className="w-5 h-5 accent-purple-600 mt-1"
          />
        </label>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-6 space-y-3">
        <h3 className="font-semibold text-red-600 flex items-center gap-2">
          <Trash2 size={18} /> Danger Zone
        </h3>

        <p className="text-sm text-gray-600">
          Deleting your account is permanent and cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-white shadow-2xl">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-semibold text-red-600 mb-2">
              Confirm Account Deletion
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
