// "use client";

// import { useState } from "react";

// export default function ProfileSettings() {
//   const [fullName, setFullName] = useState("Kisan Partners");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   /* ---------- UPDATE PROFILE ---------- */
//   const handleUpdate = async () => {
//     if (!fullName.trim()) {
//       setMessage("Full Name is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch("/api/profile/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName,
//           password,
//           email: "kisan@partners.com" // Add this - use actual user email
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "Profile update failed");
//         return;
//       }

//       setMessage("Profile updated successfully");

//       // clear password after update
//       setPassword("");
//     } catch (error) {
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(null), 2500);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      
//       {/* MAIN CONTAINER */}
//       <div className="max-w-2xl mx-auto">
        
//         {/* HEADER SECTION */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h1>
//           <p className="text-gray-600">Manage your account information and preferences</p>
//         </div>

//         {/* NOTIFICATION TOAST */}
//         {message && (
//           <div className={`mb-6 rounded-lg px-4 py-3 shadow-md animate-fade-in ${
//             message.includes("success") 
//               ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
//               : "bg-red-50 text-red-800 border border-red-200"
//           }`}>
//             <div className="flex items-center">
//               <span className={`mr-2 text-lg ${
//                 message.includes("success") ? "text-emerald-500" : "text-red-500"
//               }`}>
//                 {message.includes("success") ? "✓" : "!"}
//               </span>
//               <span className="font-medium">{message}</span>
//             </div>
//           </div>
//         )}

//         {/* PROFILE CARD */}
//         <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
          
//           {/* CARD HEADER */}
//           <div className="bg-gradient-to-r from-green-600 to-green-600 px-6 py-5">
//             <div className="flex items-center">
//               <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-white">Account Information</h2>
//                 <p className="text-blue-100 text-sm">Update your profile details</p>
//               </div>
//             </div>
//           </div>

//           {/* CARD BODY */}
//           <div className="p-6 space-y-5">
            
//             {/* FULL NAME FIELD */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <span className="text-xs text-gray-500">Required</span>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>

//             {/* PASSWORD FIELD */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <span className="text-xs text-gray-500">Optional</span>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
//                   placeholder="Enter new password (leave blank to keep current)"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Enter only if you want to change your password. Minimum 8 characters recommended.
//               </p>
//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="pt-4 border-t border-gray-200">
//               <button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className={`w-full py-3.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Updating Profile...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Update Profile
//                   </>
//                 )}
//               </button>
              
//               {/* HELP TEXT */}
//               <p className="text-center text-sm text-gray-500 mt-4">
//                 Changes will be reflected across all your devices
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SECURITY NOTE */}
//         <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
//           <div className="flex items-start">
//             <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//             <div>
//               <p className="text-sm text-blue-800 font-medium">Security Reminder</p>
//               <p className="text-xs text-blue-600 mt-1">
//                 For security reasons, your session will remain active after updating your profile. 
//                 If you changed your password, you'll need to use the new password on your next login.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADD THESE STYLES TO YOUR GLOBAL CSS OR STYLESHEET */}
//       <style jsx global>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         input:focus {
//           outline: none;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }
//       `}</style>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";

// export default function ProfileSettings() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [userRole, setUserRole] = useState("");
//   const [unauthorized, setUnauthorized] = useState(false);

//   /* ---------- FETCH USER PROFILE ---------- */
//   const fetchProfile = async () => {
//     try {
//       setFetchLoading(true);
//       setUnauthorized(false);
      
//       console.log("🔄 Fetching profile data...");
      
//       const res = await fetch("/api/profile/update", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       console.log("📥 Profile API response:", data);

//       if (res.status === 401) {
//         setUnauthorized(true);
//         setMessage("Unauthorized - Please login again");
//         return;
//       }

//       if (!res.ok || !data.success) {
//         setMessage(data.message || "Failed to load profile");
//         return;
//       }

//       if (data.data) {
//         setFullName(data.data.name || "");
//         setEmail(data.data.email || "");
//         setUserRole(data.data.role || "");
//         setMessage(null);
//       }
//     } catch (error) {
//       console.error("❌ Fetch profile error:", error);
//       setMessage("Error loading profile");
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   /* ---------- VALIDATE PASSWORD ---------- */
//   const validatePassword = () => {
//     if (password && password.length < 6) {
//       return "Password must be at least 6 characters";
//     }
//     if (password && confirmPassword && password !== confirmPassword) {
//       return "Passwords do not match";
//     }
//     return null;
//   };

//   /* ---------- UPDATE PROFILE ---------- */
//   const handleUpdate = async () => {
//     // Clear previous messages
//     setMessage(null);
//     setUnauthorized(false);

//     // Validate full name
//     if (!fullName.trim()) {
//       setMessage("Full Name is required");
//       return;
//     }

//     // Validate password
//     const passwordError = validatePassword();
//     if (passwordError) {
//       setMessage(passwordError);
//       return;
//     }

//     try {
//       setLoading(true);
      
//       console.log("🔄 Sending update request...");

//       const res = await fetch("/api/profile/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName,
//           password: password || undefined,
//         }),
//       });

//       const data = await res.json();
//       console.log("📥 Update API response:", data);

//       if (res.status === 401) {
//         setUnauthorized(true);
//         setMessage("Session expired. Please login again.");
//         return;
//       }

//       if (!res.ok || !data.success) {
//         setMessage(data.message || "Profile update failed");
//         return;
//       }

//       // SUCCESS: Show browser alert
//       alert("✅ Profile Updated Successfully!");
      
//       setMessage("Profile updated successfully");
      
//       // Clear password fields
//       setPassword("");
//       setConfirmPassword("");
      
//       // Update name in state if returned
//       if (data.data) {
//         setFullName(data.data.name || fullName);
//       }
      
//       // Auto-hide success message after 3 seconds
//       setTimeout(() => {
//         setMessage(null);
//       }, 3000);
      
//     } catch (error) {
//       console.error("❌ Update error:", error);
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- RENDER LOADING ---------- */
//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- RENDER UNAUTHORIZED ---------- */
//   if (unauthorized) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
//           <p className="text-gray-600 mb-6">Your session has expired or you're not logged in</p>
//           <div className="space-y-3">
//             <button
//               onClick={() => window.location.href = '/login'}
//               className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Go to Login
//             </button>
//             <button
//               onClick={fetchProfile}
//               className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- MAIN RENDER ---------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      
//       {/* HEADER */}
//       <div className="max-w-2xl mx-auto mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
//         <p className="text-gray-600">Manage your account information and preferences</p>
//         {userRole && (
//           <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
//             {userRole === 'admin' ? 'Administrator' : 'Sub-Admin'}
//           </div>
//         )}
//       </div>

//       {/* ERROR/SUCCESS MESSAGE */}
//       {message && (
//         <div className={`max-w-2xl mx-auto mb-6 rounded-lg px-4 py-3 shadow-md animate-fade-in ${
//           message.includes("success") 
//             ? "bg-green-50 text-green-800 border border-green-200" 
//             : "bg-red-50 text-red-800 border border-red-200"
//         }`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span className={`mr-2 text-lg ${
//                 message.includes("success") ? "text-green-500" : "text-red-500"
//               }`}>
//                 {message.includes("success") ? "✓" : "!"}
//               </span>
//               <span>{message}</span>
//             </div>
//             <button 
//               onClick={() => setMessage(null)}
//               className="text-gray-400 hover:text-gray-600 text-lg"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* PROFILE FORM CARD */}
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
//         {/* CARD HEADER */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
//           <div className="flex items-center">
//             <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-white">Account Information</h2>
//               <p className="text-green-100 text-sm">Update your profile details</p>
//             </div>
//           </div>
//         </div>

//         {/* CARD BODY */}
//         <div className="p-6">
          
//           {/* EMAIL FIELD */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <input
//                 type="email"
//                 value={email}
//                 readOnly
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-500">
//               Email address cannot be changed
//             </p>
//           </div>

//           {/* FULL NAME FIELD */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <span className="text-xs text-gray-500">Required</span>
//             </div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
//                 placeholder="Enter your full name"
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* PASSWORD CHANGE SECTION */}
//           <div className="mb-8 pt-6 border-t border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
//             <div className="space-y-4">
//               {/* NEW PASSWORD */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
//                     placeholder="Enter new password (minimum 6 characters)"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* CONFIRM PASSWORD */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
//                     placeholder="Confirm your new password"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             <p className="mt-3 text-sm text-gray-500">
//               Leave password fields empty if you don't want to change your password
//             </p>
//           </div>

//           {/* SUBMIT BUTTON */}
//           <div className="pt-4 border-t border-gray-200">
//             <button
//               onClick={handleUpdate}
//               disabled={loading || !fullName.trim()}
//               className={`w-full py-3.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
//                 loading || !fullName.trim()
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Updating Profile...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Update Profile
//                 </>
//               )}
//             </button>
            
//             <p className="text-center text-sm text-gray-500 mt-4">
//               Changes will be reflected across all your devices
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* SECURITY NOTE */}
//       <div className="max-w-2xl mx-auto mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
//         <div className="flex items-start">
//           <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//           </svg>
//           <div>
//             <p className="text-sm text-blue-800 font-medium mb-1">Security Information</p>
//             <ul className="text-xs text-blue-600 space-y-1">
//               <li className="flex items-start">
//                 <span className="mr-1">•</span>
//                 <span>Your email is used for authentication and cannot be changed</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-1">•</span>
//                 <span>Passwords must be at least 6 characters long</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-1">•</span>
//                 <span>Your session will remain active after password changes</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="mr-1">•</span>
//                 <span>Use the new password for your next login</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="max-w-2xl mx-auto mt-6 text-center">
//         <p className="text-xs text-gray-500">
//           © 2025 AgroAdmin. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }
















"use client";

import { useState, useEffect } from "react";

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  /* ---------- FETCH USER PROFILE ---------- */
  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      setUnauthorized(false);
      
      console.log("🔄 Fetching profile data...");
      
      const res = await fetch("/api/profile/update", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("📥 Profile API response:", data);

      if (res.status === 401) {
        setUnauthorized(true);
        setMessage("Unauthorized - Please login again");
        return;
      }

      if (!res.ok || !data.success) {
        setMessage(data.message || "Failed to load profile");
        return;
      }

      if (data.data) {
        setFullName(data.data.name || "");
        setEmail(data.data.email || "");
        setUserRole(data.data.role || "");
        setMessage(null);
      }
    } catch (error) {
      console.error("❌ Fetch profile error:", error);
      setMessage("Error loading profile");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------- VALIDATE PASSWORD ---------- */
  const validatePassword = () => {
    if (password && password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password && confirmPassword && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  /* ---------- UPDATE PROFILE ---------- */
  const handleUpdate = async () => {
    // Clear previous messages
    setMessage(null);
    setUnauthorized(false);
    setShowSuccessAlert(false);

    // Validate full name
    if (!fullName.trim()) {
      setMessage("Full Name is required");
      return;
    }

    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    try {
      setLoading(true);
      
      console.log("🔄 Sending update request...");

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      console.log("📥 Update API response:", data);

      if (res.status === 401) {
        setUnauthorized(true);
        setMessage("Session expired. Please login again.");
        return;
      }

      if (!res.ok || !data.success) {
        setMessage(data.message || "Profile update failed");
        return;
      }

      // Show custom success alert
      setShowSuccessAlert(true);
      
      setMessage("Profile updated successfully");
      
      // Clear password fields
      setPassword("");
      setConfirmPassword("");
      
      // Update name in state if returned
      if (data.data) {
        setFullName(data.data.name || fullName);
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
      // Auto-hide custom alert after 4 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 4000);
      
    } catch (error) {
      console.error("❌ Update error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER LOADING ---------- */
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  /* ---------- RENDER UNAUTHORIZED ---------- */
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600 mb-6">Your session has expired or you&apos;re not logged in</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={fetchProfile}
              className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- MAIN RENDER ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      
      {/* CUSTOM SUCCESS ALERT (Fixed Position) */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Profile Updated Successfully!</p>
              <p className="text-sm text-green-100">Your profile has been updated successfully.</p>
            </div>
            <button 
              onClick={() => setShowSuccessAlert(false)}
              className="text-green-100 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
        {userRole && (
          <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
            {userRole === 'admin' ? 'Administrator' : 'Sub-Admin'}
          </div>
        )}
      </div>

      {/* ERROR/SUCCESS MESSAGE (Inline) */}
      {message && !showSuccessAlert && (
        <div className={`max-w-2xl mx-auto mb-6 rounded-lg px-4 py-3 shadow-md animate-fade-in ${
          message.includes("success") 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`mr-2 text-lg ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}>
                {message.includes("success") ? "✓" : "!"}
              </span>
              <span>{message}</span>
            </div>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PROFILE FORM CARD */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* CARD HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Account Information</h2>
              <p className="text-green-100 text-sm">Update your profile details</p>
            </div>
          </div>
        </div>

        {/* CARD BODY */}
        <div className="p-6">
          
          {/* EMAIL FIELD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email address cannot be changed
            </p>
          </div>

          {/* FULL NAME FIELD */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD CHANGE SECTION */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter new password (minimum 6 characters)"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Confirm your new password"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Leave password fields empty if you don&apos;t want to change your password
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleUpdate}
              disabled={loading || !fullName.trim()}
              className={`w-full py-3.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                loading || !fullName.trim()
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
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Changes will be reflected across all your devices
            </p>
          </div>
        </div>
      </div>

      {/* SECURITY NOTE */}
      <div className="max-w-2xl mx-auto mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">Security Information</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Your email is used for authentication and cannot be changed</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Passwords must be at least 6 characters long</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Your session will remain active after password changes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Use the new password for your next login</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

     

      {/* Add these styles to your global CSS or stylesheet */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateX(100%) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
      `}</style>
    </div>
  );
}