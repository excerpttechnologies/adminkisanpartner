// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Card,
//   CardContent,
//   CardHeader,
//   Divider,
//   Grid,
//   IconButton,
//   Tooltip,
//   Alert,
//   Snackbar,
//   Avatar,
//   InputAdornment,
// } from "@mui/material";
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
// import axios from "axios";
// import toast from "react-hot-toast";

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
//       // In real app, you would use:
//       // const res = await axios.get("/api/settings");
//       // if (res.data) setSettings(res.data);
      
//       // For demo, we'll use a timeout to simulate API call
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

//     // Preview the uploaded file
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
//       // Create FormData for file uploads
//       const formData = new FormData();
      
//       // Add files to FormData if they exist
//       if (fileUploads.logo) formData.append("logo", fileUploads.logo);
//       if (fileUploads.favicon) formData.append("favicon", fileUploads.favicon);
//       if (fileUploads.paymentQrCode) formData.append("paymentQrCode", fileUploads.paymentQrCode);
//       if (fileUploads.termsAudio) formData.append("termsAudio", fileUploads.termsAudio);
      
//       // Add all settings as JSON
//       formData.append("settings", JSON.stringify(settings));
      
//       // In real app, you would use:
//       // const res = await axios.put("/api/settings", formData, {
//       //   headers: { "Content-Type": "multipart/form-data" }
//       // });
      
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Reset file uploads after successful save
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
//     <Box className="mb-6">
//       <Typography variant="subtitle1" className="font-semibold mb-2">
//         {title} {sizeHint && <span className="text-sm text-gray-500">({sizeHint})</span>}
//       </Typography>
      
//       {currentFile && (
//         <Box className="mb-3 p-3 border rounded-lg bg-gray-50">
//           <Typography variant="body2" className="text-gray-600 mb-2">
//             Current {title.toLowerCase()}:
//           </Typography>
//           {field.includes("Audio") ? (
//             <audio controls className="w-full">
//               <source src={currentFile} type="audio/mpeg" />
//               Your browser does not support the audio element.
//             </audio>
//           ) : (
//             <Box className="flex items-center gap-3">
//               <img 
//                 src={currentFile} 
//                 alt={title}
//                 className={`${
//                   field === "favicon" ? "w-8 h-8" : "w-20 h-20"
//                 } object-cover rounded border`}
//               />
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => window.open(currentFile, '_blank')}
//               >
//                 View
//               </Button>
//             </Box>
//           )}
//         </Box>
//       )}
      
//       <Box className="flex items-center gap-3">
//         <Button
//           variant="outlined"
//           component="label"
//           startIcon={<FaUpload />}
//           size="small"
//         >
//           Choose File
//           <input
//             type="file"
//             hidden
//             accept={accept}
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) handleFileUpload(field, file);
//             }}
//           />
//         </Button>
//         <Typography variant="body2" className="text-gray-500">
//           {fileUploads[field] ? fileUploads[field]?.name : "No file chosen"}
//         </Typography>
//       </Box>
//     </Box>
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
//     <TextField
//       fullWidth
//       label={platform.charAt(0).toUpperCase() + platform.slice(1)}
//       value={settings[platform]}
//       onChange={(e) => setSettings({...settings, [platform]: e.target.value})}
//       placeholder={placeholder}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <Icon className="text-gray-400" />
//           </InputAdornment>
//         ),
//       }}
//       className="mb-3"
//     />
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] text-black text-sm md:p-4 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Settings</h1>
//           <p className="text-gray-600 mt-1">
//             Configure your website settings, SEO, social media, and contact information.
//           </p>
//         </div>
//         {/* Action Buttons */}
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="outlined"
//             startIcon={<FiRefreshCw />}
//             onClick={handleResetSettings}
//             disabled={loading}
//           >
//             Reset
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<FaSave />}
//             onClick={handleSaveSettings}
//             disabled={loading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <Grid container spacing={3}>
//         {/* Left Column - General Settings */}
//         <Grid item xs={12} lg={6}>
//           {/* General Settings Card */}
//           <Card className="mb-6 shadow">
//             <CardHeader
//               title="General Settings"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent>
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
//               <TextField
//                 fullWidth
//                 label="Labour Email Address"
//                 value={settings.labourEmail}
//                 onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
//                 placeholder="labour@example.com"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaEnvelope className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="mb-4"
//               />
//             </CardContent>
//           </Card>

//           {/* SEO Settings Card */}
//           <Card className="mb-6 shadow">
//             <CardHeader
//               title="SEO Settings"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
           
//             <Divider />
//             <CardContent>
//               <TextField
//                 fullWidth
//                 label="Website SEO Title"
//                 value={settings.seoTitle}
//                 onChange={(e) => setSettings({...settings, seoTitle: e.target.value})}
//                 placeholder="Kisan Partners"
//                 className="mb-4"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaGlobe className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
              
//               <TextField
//                 fullWidth
//                 label="Website SEO Description"
//                 value={settings.seoDescription}
//                 onChange={(e) => setSettings({...settings, seoDescription: e.target.value})}
//                 placeholder="Kisan Partners"
//                 multiline
//                 rows={3}
//                 className="mb-4"
//                 sx={{my:3}}
//               />
              
//               <TextField
//                 fullWidth
//                 label="Website SEO Keywords"
//                 value={settings.seoKeywords}
//                 onChange={(e) => setSettings({...settings, seoKeywords: e.target.value})}
//                 placeholder="Kisan Partners"
//                 multiline
//                 rows={2}
//               />
//             </CardContent>
//           </Card>

//           {/* Email Settings Card */}
//           <Card className="mb-6 shadow">
//             <CardHeader
//               title="Email Settings"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent>
//               <TextField
//                 fullWidth
//                 label="Labour Email Address"
//                 value={settings.labourEmail}
//                 onChange={(e) => setSettings({...settings, labourEmail: e.target.value})}
//                 placeholder="labour@example.com"
//                 className="mb-3"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Admin Notification Email for Payment"
//                 value={settings.adminPaymentEmail}
//                 onChange={(e) => setSettings({...settings, adminPaymentEmail: e.target.value})}
//                 placeholder="payment@example.com"
//                 className="mb-3"
//                 sx={{my:3}}
//               />
              
//               <TextField
//                 fullWidth
//                 label="Admin Notification Email for Order"
//                 value={settings.adminOrderEmail}
//                 onChange={(e) => setSettings({...settings, adminOrderEmail: e.target.value})}
//                 placeholder="order@example.com"
//                 className="mb-3"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Admin Notification Email for Sales"
//                 value={settings.adminSalesEmail}
//                 onChange={(e) => setSettings({...settings, adminSalesEmail: e.target.value})}
//                 placeholder="sales@example.com"
//                 className="mb-3"
//                  sx={{my:3}}
//               />
              
//               <TextField
//                 fullWidth
//                 label="Admin Notification Email for Posting"
//                 value={settings.adminPostingEmail}
//                 onChange={(e) => setSettings({...settings, adminPostingEmail: e.target.value})}
//                 placeholder="posting@example.com"
//               />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column - Social Media & Contact */}
//         <Grid item xs={12} lg={6}>
//           {/* Social Media Card */}
//           <Card sx={{display:"flex",flexDirection:"column"}} className="mb-6  shadow">
//             <CardHeader
//               title="Social Media Links"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent sx={{display:"flex",flexDirection:"column"}} className=" gap-y-3">
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
//             </CardContent>
//           </Card>

//           {/* Contact Information Card */}
//           <Card className="mb-6 shadow">
//             <CardHeader
//               title="Contact Information"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent sx={{display:"flex",flexDirection:"column"}} className="mb-6 gap-y-3">
//               <TextField
//                 fullWidth
//                 label="Footer Description"
//                 value={settings.footerDescription}
//                 onChange={(e) => setSettings({...settings, footerDescription: e.target.value})}
//                 placeholder="Hello and Welcome to Kisanpartner.app"
//                 multiline
//                 rows={2}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Address"
//                 value={settings.address}
//                 onChange={(e) => setSettings({...settings, address: e.target.value})}
//                 placeholder="Bangkok"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaMapMarkerAlt className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Contact Phone"
//                 value={settings.contactPhone}
//                 onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
//                 placeholder="9110423686"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaPhone className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Contact Email"
//                 value={settings.contactEmail}
//                 onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
//                 placeholder="info@kisanpartner.com"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaEnvelope className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Copyright Text"
//                 value={settings.copyrightText}
//                 onChange={(e) => setSettings({...settings, copyrightText: e.target.value})}
//                 placeholder="Copyright 2024 Kisanpartner app - All Rights Reserved."
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaCopyright className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </CardContent>
//           </Card>

//           {/* Bank Details Card */}
//           <Card className="mb-6 shadow">
//             <CardHeader
//               title="Bank Details"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent sx={{display:"flex",flexDirection:"column"}} className="mb-6 gap-y-3 ">
//               <TextField
//                 fullWidth
//                 label="Bank Name"
//                 value={settings.bankName}
//                 onChange={(e) => setSettings({...settings, bankName: e.target.value})}
//                 placeholder="KISAN PARTNER"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaPiggyBank className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="Account Number"
//                 value={settings.bankAccountNumber}
//                 onChange={(e) => setSettings({...settings, bankAccountNumber: e.target.value})}
//                 placeholder="2402246263875891"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaCreditCard className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                         edge="end"
//                         size="small"
//                       >
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 type={showPassword ? "text" : "password"}
//                 className="mb-4"
//               />
              
//               <TextField
//                 fullWidth
//                 label="IFSC Code"
//                 value={settings.bankIfsc}
//                 onChange={(e) => setSettings({...settings, bankIfsc: e.target.value})}
//                 placeholder="AUBL0002462"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FaLink className="text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </CardContent>
//           </Card>

//           {/* Preview Section */}
//           <Card className="shadow">
//             <CardHeader
//               title="Preview"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
//               className="bg-gray-50"
//             />
//             <Divider />
//             <CardContent>
//               <Alert severity="info" className="mb-4">
//                 Changes will take effect after saving. Some settings may require cache clearing.
//               </Alert>
              
//               <Box className="space-y-4">
//                 <Box>
//                   <Typography variant="subtitle2" className="font-semibold mb-2">
//                     Current Logo:
//                   </Typography>
//                   {settings.logo ? (
//                     <img 
//                       src={settings.logo} 
//                       alt="Logo Preview" 
//                       className="w-32 h-auto border rounded p-2 bg-white"
//                     />
//                   ) : (
//                     <Box className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
//                       <Typography variant="body2" className="text-gray-400">
//                         No logo
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
                
//                 <Box>
//                   <Typography variant="subtitle2" className="font-semibold mb-2">
//                     Current Favicon:
//                   </Typography>
//                   {settings.favicon ? (
//                     <img 
//                       src={settings.favicon} 
//                       alt="Favicon Preview" 
//                       className="w-8 h-8 border rounded"
//                     />
//                   ) : (
//                     <Box className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
//                       <FaImage className="text-gray-400 text-sm" />
//                     </Box>
//                   )}
//                 </Box>
                
//                 <Box>
//                   <Typography variant="subtitle2" className="font-semibold mb-2">
//                     SEO Title Preview:
//                   </Typography>
//                   <Typography variant="body2" className="text-gray-700 bg-gray-50 p-2 rounded border">
//                     {settings.seoTitle || "No title set"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Save Button Sticky Footer */}
//       <Box className="sticky bottom-0 bg-white border-t py-4 mt-6 flex justify-end gap-3">
//         <Button
//           variant="outlined"
//           onClick={handleResetSettings}
//           disabled={loading}
//         >
//           Discard Changes
//         </Button>
//         <Button
//           variant="contained"
//           startIcon={<FaSave />}
//           onClick={handleSaveSettings}
//           disabled={loading}
//           className="bg-green-600 hover:bg-green-700"
//           size="large"
//         >
//           {loading ? "Saving..." : "Save All Settings"}
//         </Button>
//       </Box>
//     </div>
//   );
// }












/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

/* ================= COMPONENT ================= */

export default function SettingsPage() {
  // State for settings
  const [settings, setSettings] = useState<Settings>({
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
  });

  const [loading, setLoading] = useState(false);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Settings loaded");
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

    toast.success(`${field.replace(/([A-Z])/g, ' $1')} uploaded successfully`);
  };

  /* ================= SAVE SETTINGS ================= */

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      if (fileUploads.logo) formData.append("logo", fileUploads.logo);
      if (fileUploads.favicon) formData.append("favicon", fileUploads.favicon);
      if (fileUploads.paymentQrCode) formData.append("paymentQrCode", fileUploads.paymentQrCode);
      if (fileUploads.termsAudio) formData.append("termsAudio", fileUploads.termsAudio);
      
      formData.append("settings", JSON.stringify(settings));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFileUploads({
        logo: null,
        favicon: null,
        paymentQrCode: null,
        termsAudio: null,
      });
      
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET SETTINGS ================= */

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        logo: "",
        favicon: "",
        paymentQrCode: "",
        termsAudio: "",
        seoTitle: "Kisan Partners",
        seoDescription: "Kisan Partners",
        seoKeywords: "Kisan Partners",
        facebook: "https://www.facebook.com/",
        twitter: "https://twitter.com/",
        youtube: "https://www.youtube.com/",
        linkedin: "https://www.linkedin.com/",
        instagram: "https://www.instagram.com/",
        footerDescription: "Hello and Welcome to Kisanpartner.app",
        address: "Bangkok",
        contactPhone: "9110423686",
        contactEmail: "info@kisanpartner.com",
        copyrightText: "Copyright 2024 Kisanpartner app - All Rights Reserved.",
        labourEmail: "kisanpartners@gmail.com",
        adminPaymentEmail: "kisanpartners@gmail.com",
        adminOrderEmail: "kisanpartners@gmail.com",
        adminSalesEmail: "kisanpartners@gmail.com",
        adminPostingEmail: "kisanpartners@gmail.com",
        bankName: "KISAN PARTNER",
        bankAccountNumber: "2402246263875891",
        bankIfsc: "AUBL0002462",
      });
      toast.success("Settings reset to default");
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
      <div className="font-semibold text-sm mb-2">
        {title} {sizeHint && <span className="text-xs text-gray-500">({sizeHint})</span>}
      </div>
      
      {currentFile && (
        <div className="mb-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <div className="text-gray-600 text-sm mb-2">
            Current {title.toLowerCase()}:
          </div>
          {field.includes("Audio") ? (
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
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
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
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 mt-6 flex justify-end gap-3">
        <button
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleResetSettings}
          disabled={loading}
        >
          Discard Changes
        </button>
        <button
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          <FaSave />
          {loading ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
