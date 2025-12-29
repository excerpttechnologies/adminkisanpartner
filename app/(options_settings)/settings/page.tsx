
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FaSave,
//   FaUpload,
//   FaFacebook,
//   FaTwitter,
//   FaYoutube,
//   FaLinkedin,
//   FaInstagram,
//   FaImage,
//   FaQrcode,
//   FaMusic,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaCopyright,
//   FaGlobe,
//   FaLink,
//   FaPiggyBank,
//   FaUser,
//   FaCreditCard,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { FiRefreshCw } from "react-icons/fi";

// /* ================= TYPES ================= */

// interface Settings {
//   // General Settings
//   logo: string;
//   favicon: string;
//   paymentQrCode: string;
//   termsAudio: string;
  
//   // SEO Settings
//   seoTitle: string;
//   seoDescription: string;
//   seoKeywords: string;
  
//   // Social Media
//   facebook: string;
//   twitter: string;
//   youtube: string;
//   linkedin: string;
//   instagram: string;
  
//   // Contact Info
//   footerDescription: string;
//   address: string;
//   contactPhone: string;
//   contactEmail: string;
//   copyrightText: string;
  
//   // Email Settings
//   labourEmail: string;
//   adminPaymentEmail: string;
//   adminOrderEmail: string;
//   adminSalesEmail: string;
//   adminPostingEmail: string;
  
//   // Bank Details
//   bankName: string;
//   bankAccountNumber: string;
//   bankIfsc: string;
// }

// /* ================= COMPONENT ================= */

// export default function SettingsPage() {
//   // State for settings
//   const [settings, setSettings] = useState<Settings>({
//     // General Settings
//     logo: "",
//     favicon: "",
//     paymentQrCode: "",
//     termsAudio: "",
    
//     // SEO Settings
//     seoTitle: "Kisan Partners",
//     seoDescription: "Kisan Partners",
//     seoKeywords: "Kisan Partners",
    
//     // Social Media
//     facebook: "https://www.facebook.com/",
//     twitter: "https://twitter.com/",
//     youtube: "https://www.youtube.com/",
//     linkedin: "https://www.linkedin.com/",
//     instagram: "https://www.instagram.com/",
    
//     // Contact Info
//     footerDescription: "Hello and Welcome to Kisanpartner.app",
//     address: "Bangkok",
//     contactPhone: "9110423686",
//     contactEmail: "info@kisanpartner.com",
//     copyrightText: "Copyright 2024 Kisanpartner app - All Rights Reserved.",
    
//     // Email Settings
//     labourEmail: "kisanpartners@gmail.com",
//     adminPaymentEmail: "kisanpartners@gmail.com",
//     adminOrderEmail: "kisanpartners@gmail.com",
//     adminSalesEmail: "kisanpartners@gmail.com",
//     adminPostingEmail: "kisanpartners@gmail.com",
    
//     // Bank Details
//     bankName: "KISAN PARTNER",
//     bankAccountNumber: "2402246263875891",
//     bankIfsc: "AUBL0002462",
//   });

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [fileUploads, setFileUploads] = useState({
//     logo: null as File | null,
//     favicon: null as File | null,
//     paymentQrCode: null as File | null,
//     termsAudio: null as File | null,
//   });

//   /* ================= FETCH SETTINGS ================= */

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       console.log("Settings loaded");
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//       toast.error("Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   /* ================= FILE HANDLERS ================= */

//   const handleFileUpload = (field: keyof typeof fileUploads, file: File) => {
//     setFileUploads(prev => ({
//       ...prev,
//       [field]: file
//     }));

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setSettings(prev => ({
//         ...prev,
//         [field]: e.target?.result as string
//       }));
//     };
//     reader.readAsDataURL(file);

//     toast.success(`${field.replace(/([A-Z])/g, ' $1')} uploaded successfully`);
//   };

//   /* ================= SAVE SETTINGS ================= */

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
      
//       if (fileUploads.logo) formData.append("logo", fileUploads.logo);
//       if (fileUploads.favicon) formData.append("favicon", fileUploads.favicon);
//       if (fileUploads.paymentQrCode) formData.append("paymentQrCode", fileUploads.paymentQrCode);
//       if (fileUploads.termsAudio) formData.append("termsAudio", fileUploads.termsAudio);
      
//       formData.append("settings", JSON.stringify(settings));
      
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setFileUploads({
//         logo: null,
//         favicon: null,
//         paymentQrCode: null,
//         termsAudio: null,
//       });
      
//       toast.success("Settings updated successfully!");
//     } catch (error: any) {
//       console.error("Error saving settings:", error);
//       toast.error(error.response?.data?.message || "Failed to save settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RESET SETTINGS ================= */

//   const handleResetSettings = () => {
//     if (confirm("Are you sure you want to reset all settings to default?")) {
//       setSettings({
//         logo: "",
//         favicon: "",
//         paymentQrCode: "",
//         termsAudio: "",
//         seoTitle: "Kisan Partners",
//         seoDescription: "Kisan Partners",
//         seoKeywords: "Kisan Partners",
//         facebook: "https://www.facebook.com/",
//         twitter: "https://twitter.com/",
//         youtube: "https://www.youtube.com/",
//         linkedin: "https://www.linkedin.com/",
//         instagram: "https://www.instagram.com/",
//         footerDescription: "Hello and Welcome to Kisanpartner.app",
//         address: "Bangkok",
//         contactPhone: "9110423686",
//         contactEmail: "info@kisanpartner.com",
//         copyrightText: "Copyright 2024 Kisanpartner app - All Rights Reserved.",
//         labourEmail: "kisanpartners@gmail.com",
//         adminPaymentEmail: "kisanpartners@gmail.com",
//         adminOrderEmail: "kisanpartners@gmail.com",
//         adminSalesEmail: "kisanpartners@gmail.com",
//         adminPostingEmail: "kisanpartners@gmail.com",
//         bankName: "KISAN PARTNER",
//         bankAccountNumber: "2402246263875891",
//         bankIfsc: "AUBL0002462",
//       });
//       toast.success("Settings reset to default");
//     }
//   };

//   /* ================= UI COMPONENTS ================= */

//   const FileUploadField = ({ 
//     title, 
//     field, 
//     currentFile, 
//     accept = "image/*",
//     sizeHint = ""
//   }: { 
//     title: string; 
//     field: keyof typeof fileUploads; 
//     currentFile: string;
//     accept?: string;
//     sizeHint?: string;
//   }) => (
//     <div className="mb-6">
//       <div className="font-semibold text-sm mb-2">
//         {title} {sizeHint && <span className="text-xs text-gray-500">({sizeHint})</span>}
//       </div>
      
//       {currentFile && (
//         <div className="mb-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
//           <div className="text-gray-600 text-sm mb-2">
//             Current {title.toLowerCase()}:
//           </div>
//           {field.includes("Audio") ? (
//             <audio controls className="w-full">
//               <source src={currentFile} type="audio/mpeg" />
//               Your browser does not support the audio element.
//             </audio>
//           ) : (
//             <div className="flex items-center gap-3">
//               <img 
//                 src={currentFile} 
//                 alt={title}
//                 className={`${
//                   field === "favicon" ? "w-8 h-8" : "w-20 h-20"
//                 } object-cover rounded border border-gray-300`}
//               />
//               <button
//                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                 onClick={() => window.open(currentFile, '_blank')}
//               >
//                 View
//               </button>
//             </div>
//           )}
//         </div>
//       )}
      
//       <div className="flex items-center gap-3">
//         <label className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
//           <FaUpload className="text-gray-600" />
//           Choose File
//           <input
//             type="file"
//             className="hidden"
//             accept={accept}
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) handleFileUpload(field, file);
//             }}
//           />
//         </label>
//         <div className="text-gray-500 text-sm">
//           {fileUploads[field] ? fileUploads[field]?.name : "No file chosen"}
//         </div>
//       </div>
//     </div>
//   );

//   const SocialMediaField = ({ 
//     platform, 
//     icon: Icon, 
//     placeholder 
//   }: { 
//     platform: keyof Settings; 
//     icon: any; 
//     placeholder: string;
//   }) => (
//     <div className="mb-3">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {platform.charAt(0).toUpperCase() + platform.slice(1)}
//       </label>
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <Icon className="text-gray-400" />
//         </div>
//         <input
//           type="text"
//           className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//           value={settings[platform]}
//           onChange={(e) => setSettings({...settings, [platform]: e.target.value})}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 text-black text-sm overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
//         <p className="text-gray-600 mt-1">
//           Configure your website settings, SEO, social media, and contact information.
//         </p>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left Column - General Settings */}
//         <div className="space-y-6">
//           {/* General Settings Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
//             </div>
//             <div className="p-6">
//               {/* Logo Upload */}
//               <FileUploadField
//                 title="Logo"
//                 field="logo"
//                 currentFile={settings.logo}
//                 accept="image/*"
//               />
              
//               {/* Favicon Upload */}
//               <FileUploadField
//                 title="Favicon"
//                 field="favicon"
//                 currentFile={settings.favicon}
//                 accept="image/*"
//                 sizeHint="30x30"
//               />
              
//               {/* Payment QR Code */}
//               <FileUploadField
//                 title="Payment QR Code"
//                 field="paymentQrCode"
//                 currentFile={settings.paymentQrCode}
//                 accept="image/*"
//               />
              
//               {/* Terms Audio */}
//               <FileUploadField
//                 title="Terms Audio"
//                 field="termsAudio"
//                 currentFile={settings.termsAudio}
//                 accept="audio/*"
//               />
              
//               {/* Labour Email Address */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Labour Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaEnvelope className="text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.labourEmail}
//                     onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
//                     placeholder="labour@example.com"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* SEO Settings Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">SEO Settings</h2>
//             </div>
//             <div className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website SEO Title
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaGlobe className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.seoTitle}
//                     onChange={(e) => setSettings({...settings, seoTitle: e.target.value})}
//                     placeholder="Kisan Partners"
//                   />
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website SEO Description
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.seoDescription}
//                   onChange={(e) => setSettings({...settings, seoDescription: e.target.value})}
//                   placeholder="Kisan Partners"
//                   rows={3}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website SEO Keywords
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.seoKeywords}
//                   onChange={(e) => setSettings({...settings, seoKeywords: e.target.value})}
//                   placeholder="Kisan Partners"
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Email Settings Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">Email Settings</h2>
//             </div>
//             <div className="p-6">
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Labour Email Address
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.labourEmail}
//                   onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
//                   placeholder="labour@example.com"
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Admin Notification Email for Payment
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.adminPaymentEmail}
//                   onChange={(e) => setSettings({...settings, adminPaymentEmail: e.target.value})}
//                   placeholder="payment@example.com"
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Admin Notification Email for Order
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.adminOrderEmail}
//                   onChange={(e) => setSettings({...settings, adminOrderEmail: e.target.value})}
//                   placeholder="order@example.com"
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Admin Notification Email for Sales
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.adminSalesEmail}
//                   onChange={(e) => setSettings({...settings, adminSalesEmail: e.target.value})}
//                   placeholder="sales@example.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Admin Notification Email for Posting
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.adminPostingEmail}
//                   onChange={(e) => setSettings({...settings, adminPostingEmail: e.target.value})}
//                   placeholder="posting@example.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Social Media & Contact */}
//         <div className="space-y-6">
//           {/* Social Media Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">Social Media Links</h2>
//             </div>
//             <div className="p-6 space-y-3">
//               <SocialMediaField
//                 platform="facebook"
//                 icon={FaFacebook}
//                 placeholder="https://www.facebook.com/"
//               />
              
//               <SocialMediaField
//                 platform="twitter"
//                 icon={FaTwitter}
//                 placeholder="https://twitter.com/"
//               />
              
//               <SocialMediaField
//                 platform="youtube"
//                 icon={FaYoutube}
//                 placeholder="https://www.youtube.com/"
//               />
              
//               <SocialMediaField
//                 platform="linkedin"
//                 icon={FaLinkedin}
//                 placeholder="https://www.linkedin.com/"
//               />
              
//               <SocialMediaField
//                 platform="instagram"
//                 icon={FaInstagram}
//                 placeholder="https://www.instagram.com/"
//               />
//             </div>
//           </div>

//           {/* Contact Information Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
//             </div>
//             <div className="p-6 space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Footer Description
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   value={settings.footerDescription}
//                   onChange={(e) => setSettings({...settings, footerDescription: e.target.value})}
//                   placeholder="Hello and Welcome to Kisanpartner.app"
//                   rows={2}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaMapMarkerAlt className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.address}
//                     onChange={(e) => setSettings({...settings, address: e.target.value})}
//                     placeholder="Bangkok"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Contact Phone
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaPhone className="text-gray-400" />
//                   </div>
//                   <input
//                     type="tel"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.contactPhone}
//                     onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
//                     placeholder="9110423686"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Contact Email
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaEnvelope className="text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.contactEmail}
//                     onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
//                     placeholder="info@kisanpartner.com"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Copyright Text
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaCopyright className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.copyrightText}
//                     onChange={(e) => setSettings({...settings, copyrightText: e.target.value})}
//                     placeholder="Copyright 2024 Kisanpartner app - All Rights Reserved."
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bank Details Card */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">Bank Details</h2>
//             </div>
//             <div className="p-6 space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bank Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaPiggyBank className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.bankName}
//                     onChange={(e) => setSettings({...settings, bankName: e.target.value})}
//                     placeholder="KISAN PARTNER"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Number
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaCreditCard className="text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.bankAccountNumber}
//                     onChange={(e) => setSettings({...settings, bankAccountNumber: e.target.value})}
//                     placeholder="2402246263875891"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
//                   </button>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   IFSC Code
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaLink className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     value={settings.bankIfsc}
//                     onChange={(e) => setSettings({...settings, bankIfsc: e.target.value})}
//                     placeholder="AUBL0002462"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Preview Section */}
//           <div className="bg-white rounded-lg shadow border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-bold text-gray-800">Preview</h2>
//             </div>
//             <div className="p-6">
//               <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                 <div className="flex items-center">
//                   <div className="text-blue-800 text-sm">
//                     Changes will take effect after saving. Some settings may require cache clearing.
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <div className="font-semibold text-sm mb-2">
//                     Current Logo:
//                   </div>
//                   {settings.logo ? (
//                     <img 
//                       src={settings.logo} 
//                       alt="Logo Preview" 
//                       className="w-32 h-auto border border-gray-300 rounded p-2 bg-white"
//                     />
//                   ) : (
//                     <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
//                       <div className="text-gray-400 text-sm">
//                         No logo
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <div className="font-semibold text-sm mb-2">
//                     Current Favicon:
//                   </div>
//                   {settings.favicon ? (
//                     <img 
//                       src={settings.favicon} 
//                       alt="Favicon Preview" 
//                       className="w-8 h-8 border border-gray-300 rounded"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
//                       <FaImage className="text-gray-400 text-sm" />
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <div className="font-semibold text-sm mb-2">
//                     SEO Title Preview:
//                   </div>
//                   <div className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-300 text-sm">
//                     {settings.seoTitle || "No title set"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Save Button Sticky Footer */}
//       <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 mt-6 flex justify-end gap-3">
//         <button
//           className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={handleResetSettings}
//           disabled={loading}
//         >
//           Discard Changes
//         </button>
//         <button
//           className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={handleSaveSettings}
//           disabled={loading}
//         >
//           <FaSave />
//           {loading ? "Saving..." : "Save All Settings"}
//         </button>
//       </div>
//     </div>
//   );
// }











/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaSave,
  FaUpload,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaImage,
  FaQrcode,
  FaMusic,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCopyright,
  FaGlobe,
  FaLink,
  FaPiggyBank,
  FaUser,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaTrash,
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

/* ================= TYPES ================= */

interface Settings {
  // General Settings
  logo: string;
  favicon: string;
  paymentQrCode: string;
  termsAudio: string;
  
  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // Social Media
  facebook: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  instagram: string;
  
  // Contact Info
  footerDescription: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  copyrightText: string;
  
  // Email Settings
  labourEmail: string;
  adminPaymentEmail: string;
  adminOrderEmail: string;
  adminSalesEmail: string;
  adminPostingEmail: string;
  
  // Bank Details
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
}

/* ================= DEFAULT SETTINGS ================= */

const defaultSettings: Settings = {
  // General Settings
  logo: "",
  favicon: "",
  paymentQrCode: "",
  termsAudio: "",
  
  // SEO Settings
  seoTitle: "Kisan Partners",
  seoDescription: "Kisan Partners",
  seoKeywords: "Kisan Partners",
  
  // Social Media
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  youtube: "https://www.youtube.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  
  // Contact Info
  footerDescription: "Hello and Welcome to Kisanpartner.app",
  address: "Bangkok",
  contactPhone: "9110423686",
  contactEmail: "info@kisanpartner.com",
  copyrightText: "Copyright 2024 Kisanpartner app - All Rights Reserved.",
  
  // Email Settings
  labourEmail: "kisanpartners@gmail.com",
  adminPaymentEmail: "kisanpartners@gmail.com",
  adminOrderEmail: "kisanpartners@gmail.com",
  adminSalesEmail: "kisanpartners@gmail.com",
  adminPostingEmail: "kisanpartners@gmail.com",
  
  // Bank Details
  bankName: "KISAN PARTNER",
  bankAccountNumber: "2402246263875891",
  bankIfsc: "AUBL0002462",
};

/* ================= COMPONENT ================= */

export default function SettingsPage() {
  // State for settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fileUploads, setFileUploads] = useState({
    logo: null as File | null,
    favicon: null as File | null,
    paymentQrCode: null as File | null,
    termsAudio: null as File | null,
  });

  /* ================= FETCH SETTINGS ================= */

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Merge fetched data with default values
      const mergedSettings = {
        ...defaultSettings,
        ...data
      };
      
      setSettings(mergedSettings);
      console.log("Settings loaded successfully");
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ================= FILE HANDLERS ================= */

  const handleFileUpload = (field: keyof typeof fileUploads, file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${field} exceeds 5MB limit`);
      return;
    }

    // Validate file types
    if (field === 'termsAudio' && !file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    if (field !== 'termsAudio' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setFileUploads(prev => ({
      ...prev,
      [field]: file
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setSettings(prev => ({
        ...prev,
        [field]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);

    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    toast.success(`${fieldName} uploaded successfully`);
  };

  const removeFile = (field: keyof typeof fileUploads) => {
    setFileUploads(prev => ({
      ...prev,
      [field]: null
    }));

    setSettings(prev => ({
      ...prev,
      [field]: ""
    }));

    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
    toast.success(`${fieldName} removed`);
  };

  /* ================= SAVE SETTINGS ================= */

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Append files if they exist
      if (fileUploads.logo) formData.append("logo", fileUploads.logo);
      if (fileUploads.favicon) formData.append("favicon", fileUploads.favicon);
      if (fileUploads.paymentQrCode) formData.append("paymentQrCode", fileUploads.paymentQrCode);
      if (fileUploads.termsAudio) formData.append("termsAudio", fileUploads.termsAudio);
      
      // Append settings data
      formData.append("settings", JSON.stringify(settings));
      
      // Send to API
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings');
      }
      
      if (result.success) {
        // Update local state with response data
        if (result.settings) {
          setSettings(prev => ({
            ...prev,
            ...result.settings
          }));
        }
        
        // Reset file uploads
        setFileUploads({
          logo: null,
          favicon: null,
          paymentQrCode: null,
          termsAudio: null,
        });
        
        toast.success("Settings updated successfully!");
      }
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /* ================= RESET SETTINGS ================= */

  const handleResetSettings = async () => {
    if (!confirm("Are you sure you want to reset all settings? This will delete all uploaded files from the server.")) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset settings');
      }
      
      if (result.success) {
        // Reset to default values
        setSettings(defaultSettings);
        
        // Reset file uploads
        setFileUploads({
          logo: null,
          favicon: null,
          paymentQrCode: null,
          termsAudio: null,
        });
        
        toast.success("Settings reset successfully!");
      }
    } catch (error: any) {
      console.error("Error resetting settings:", error);
      toast.error(error.message || "Failed to reset settings");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DISCARD CHANGES ================= */

  const handleDiscardChanges = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      fetchSettings(); // Reload original settings
      setFileUploads({
        logo: null,
        favicon: null,
        paymentQrCode: null,
        termsAudio: null,
      });
      toast.success("Changes discarded");
    }
  };

  /* ================= UI COMPONENTS ================= */

  const FileUploadField = ({ 
    title, 
    field, 
    currentFile, 
    accept = "image/*",
    sizeHint = ""
  }: { 
    title: string; 
    field: keyof typeof fileUploads; 
    currentFile: string;
    accept?: string;
    sizeHint?: string;
  }) => (
    <div className="mb-6">
      <div className="font-semibold text-sm mb-2 flex justify-between items-center">
        <span>
          {title} {sizeHint && <span className="text-xs text-gray-500">({sizeHint})</span>}
        </span>
        {currentFile && (
          <button
            type="button"
            onClick={() => removeFile(field)}
            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
          >
            <FaTrash size={12} />
            Remove
          </button>
        )}
      </div>
      
      {currentFile && (
        <div className="mb-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <div className="text-gray-600 text-sm mb-2">
            Current {title.toLowerCase()}:
          </div>
          {field === "termsAudio" ? (
            <audio controls className="w-full">
              <source src={currentFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="flex items-center gap-3">
              <img 
                src={currentFile} 
                alt={title}
                className={`${
                  field === "favicon" ? "w-8 h-8" : "w-20 h-20"
                } object-cover rounded border border-gray-300`}
              />
              <button
                type="button"
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => window.open(currentFile, '_blank')}
              >
                View
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <label className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
          <FaUpload className="text-gray-600" />
          Choose File
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(field, file);
            }}
          />
        </label>
        <div className="text-gray-500 text-sm">
          {fileUploads[field] ? fileUploads[field]?.name : "No file chosen"}
        </div>
      </div>
    </div>
  );

  const SocialMediaField = ({ 
    platform, 
    icon: Icon, 
    placeholder 
  }: { 
    platform: keyof Settings; 
    icon: any; 
    placeholder: string;
  }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={settings[platform]}
          onChange={(e) => setSettings({...settings, [platform]: e.target.value})}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="p-4 text-black text-sm overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {(loading || saving) && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
            <span>{loading ? "Loading..." : "Saving..."}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your website settings, SEO, social media, and contact information.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - General Settings */}
        <div className="space-y-6">
          {/* General Settings Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
            </div>
            <div className="p-6">
              {/* Logo Upload */}
              <FileUploadField
                title="Logo"
                field="logo"
                currentFile={settings.logo}
                accept="image/*"
              />
              
              {/* Favicon Upload */}
              <FileUploadField
                title="Favicon"
                field="favicon"
                currentFile={settings.favicon}
                accept="image/*"
                sizeHint="30x30"
              />
              
              {/* Payment QR Code */}
              <FileUploadField
                title="Payment QR Code"
                field="paymentQrCode"
                currentFile={settings.paymentQrCode}
                accept="image/*"
              />
              
              {/* Terms Audio */}
              <FileUploadField
                title="Terms Audio"
                field="termsAudio"
                currentFile={settings.termsAudio}
                accept="audio/*"
              />
              
              {/* Labour Email Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labour Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.labourEmail}
                    onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
                    placeholder="labour@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">SEO Settings</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website SEO Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.seoTitle}
                    onChange={(e) => setSettings({...settings, seoTitle: e.target.value})}
                    placeholder="Kisan Partners"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website SEO Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.seoDescription}
                  onChange={(e) => setSettings({...settings, seoDescription: e.target.value})}
                  placeholder="Kisan Partners"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website SEO Keywords
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.seoKeywords}
                  onChange={(e) => setSettings({...settings, seoKeywords: e.target.value})}
                  placeholder="Kisan Partners"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Email Settings Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Email Settings</h2>
            </div>
            <div className="p-6">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labour Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.labourEmail}
                  onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
                  placeholder="labour@example.com"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notification Email for Payment
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.adminPaymentEmail}
                  onChange={(e) => setSettings({...settings, adminPaymentEmail: e.target.value})}
                  placeholder="payment@example.com"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notification Email for Order
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.adminOrderEmail}
                  onChange={(e) => setSettings({...settings, adminOrderEmail: e.target.value})}
                  placeholder="order@example.com"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notification Email for Sales
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.adminSalesEmail}
                  onChange={(e) => setSettings({...settings, adminSalesEmail: e.target.value})}
                  placeholder="sales@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notification Email for Posting
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.adminPostingEmail}
                  onChange={(e) => setSettings({...settings, adminPostingEmail: e.target.value})}
                  placeholder="posting@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Social Media & Contact */}
        <div className="space-y-6">
          {/* Social Media Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Social Media Links</h2>
            </div>
            <div className="p-6 space-y-3">
              <SocialMediaField
                platform="facebook"
                icon={FaFacebook}
                placeholder="https://www.facebook.com/"
              />
              
              <SocialMediaField
                platform="twitter"
                icon={FaTwitter}
                placeholder="https://twitter.com/"
              />
              
              <SocialMediaField
                platform="youtube"
                icon={FaYoutube}
                placeholder="https://www.youtube.com/"
              />
              
              <SocialMediaField
                platform="linkedin"
                icon={FaLinkedin}
                placeholder="https://www.linkedin.com/"
              />
              
              <SocialMediaField
                platform="instagram"
                icon={FaInstagram}
                placeholder="https://www.instagram.com/"
              />
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Footer Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={settings.footerDescription}
                  onChange={(e) => setSettings({...settings, footerDescription: e.target.value})}
                  placeholder="Hello and Welcome to Kisanpartner.app"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    placeholder="Bangkok"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                    placeholder="9110423686"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    placeholder="info@kisanpartner.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copyright Text
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCopyright className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.copyrightText}
                    onChange={(e) => setSettings({...settings, copyrightText: e.target.value})}
                    placeholder="Copyright 2024 Kisanpartner app - All Rights Reserved."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Bank Details</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPiggyBank className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.bankName}
                    onChange={(e) => setSettings({...settings, bankName: e.target.value})}
                    placeholder="KISAN PARTNER"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.bankAccountNumber}
                    onChange={(e) => setSettings({...settings, bankAccountNumber: e.target.value})}
                    placeholder="2402246263875891"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLink className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={settings.bankIfsc}
                    onChange={(e) => setSettings({...settings, bankIfsc: e.target.value})}
                    placeholder="AUBL0002462"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Preview</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <div className="text-blue-800 text-sm">
                    Changes will take effect after saving. Some settings may require cache clearing.
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm mb-2">
                    Current Logo:
                  </div>
                  {settings.logo ? (
                    <img 
                      src={settings.logo} 
                      alt="Logo Preview" 
                      className="w-32 h-auto border border-gray-300 rounded p-2 bg-white"
                    />
                  ) : (
                    <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <div className="text-gray-400 text-sm">
                        No logo
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-2">
                    Current Favicon:
                  </div>
                  {settings.favicon ? (
                    <img 
                      src={settings.favicon} 
                      alt="Favicon Preview" 
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <FaImage className="text-gray-400 text-sm" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-2">
                    SEO Title Preview:
                  </div>
                  <div className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-300 text-sm">
                    {settings.seoTitle || "No title set"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 mt-6 flex justify-between">
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleDiscardChanges}
            disabled={loading || saving}
          >
            <FiRefreshCw />
            Discard Changes
          </button>
          <button
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleResetSettings}
            disabled={loading || saving}
          >
            <FaTrash />
            Reset All
          </button>
        </div>
        <button
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSettings}
          disabled={loading || saving}
        >
          <FaSave />
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}