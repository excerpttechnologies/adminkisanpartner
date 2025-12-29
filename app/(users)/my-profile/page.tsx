"use client";

import { useState } from "react";

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("Kisan Partners");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- UPDATE PROFILE ---------- */
  const handleUpdate = async () => {
    if (!fullName.trim()) {
      setMessage("Full Name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          password,
          email: "kisan@partners.com" // Add this - use actual user email
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Profile update failed");
        return;
      }

      setMessage("Profile updated successfully");

      // clear password after update
      setPassword("");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* NOTIFICATION TOAST */}
        {message && (
          <div className={`mb-6 rounded-lg px-4 py-3 shadow-md animate-fade-in ${
            message.includes("success") 
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${
                message.includes("success") ? "text-emerald-500" : "text-red-500"
              }`}>
                {message.includes("success") ? "✓" : "!"}
              </span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
          
          {/* CARD HEADER */}
          <div className="bg-gradient-to-r from-green-600 to-green-600 px-6 py-5">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Account Information</h2>
                <p className="text-blue-100 text-sm">Update your profile details</p>
              </div>
            </div>
          </div>

          {/* CARD BODY */}
          <div className="p-6 space-y-5">
            
            {/* FULL NAME FIELD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter new password (leave blank to keep current)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter only if you want to change your password. Minimum 8 characters recommended.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`w-full py-3.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Profile
                  </>
                )}
              </button>
              
              {/* HELP TEXT */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Changes will be reflected across all your devices
              </p>
            </div>
          </div>
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">Security Reminder</p>
              <p className="text-xs text-blue-600 mt-1">
                For security reasons, your session will remain active after updating your profile. 
                If you changed your password, you'll need to use the new password on your next login.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADD THESE STYLES TO YOUR GLOBAL CSS OR STYLESHEET */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}