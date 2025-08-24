import React from "react";

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-gray-700">Here you can manage your account and app settings.</p>

      <div className="mt-6 space-y-4">
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          <p className="text-sm text-gray-600">Update your personal details and preferences.</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-gray-600">Change your password or enable 2FA.</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-gray-600">Manage email and app notifications.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
