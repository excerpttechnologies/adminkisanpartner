









// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaPrint,
//   FaSearch,
//   FaFilter,
//   FaCalendarAlt,
//   FaTimes,
//   FaSpinner,
//   FaChartLine,
//   FaLeaf,
//   FaInfoCircle,
//   FaUser,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaCheckCircle,
//   FaClock,
//   FaExclamationTriangle,
//   FaArrowRight,
//   FaCamera,
//   FaList,
//   FaChevronDown,
//   FaChevronUp,
//   FaEnvelope,
//   FaIdCard,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   Pagination,
//   Modal,
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   LinearProgress,
//   Tooltip,
//   Collapse,
// } from "@mui/material";

// /* ================= TYPES ================= */

// interface Stage {
//   name: string;
//   status: "pending" | "in-progress" | "completed" | "skipped";
//   photos: string[];
//   _id: string;
//   completedAt?: string;
// }

// interface TrackingData {
//   _id: string;
//   name: string;
//   cropName: string;
//   farmerId: string;
//   cropId: string;
//   stages: Stage[];
//   currentStageIndex: number;
//   createdAt: string;
//   updatedAt?: string;
//   __v?: number;
//   progress?: number;
//   isCompleted?: boolean;
//   currentStageName?: string;
// }

// interface FarmerPersonalInfo {
//   name: string;
//   mobileNo: string;
//   email?: string;
//   address?: string;
//   villageGramaPanchayat?: string;
//   pincode?: string;
//   state?: string;
//   district?: string;
//   taluk?: string;
//   post?: string;
// }

// interface Farmer {
//   _id: string;
//   farmerId?: string;
//   traderId?: string;
//   personalInfo: FarmerPersonalInfo;
//   role: string;
//   registrationStatus: string;
//   isActive: boolean;
//   commodities?: string[];
//   subcategories?: string[];
//   createdAt: string;
//   updatedAt?: string;
//   __v?: number;
// }

// interface Crop {
//   _id: string;
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   sowingDate: string;
//   farmerId: string;
//   trackingId?: string;
//   createdAt: string;
//   updatedAt?: string;
//   __v?: number;
//   tracking?: TrackingData | null;
//   farmer?: Farmer | null;
// }

// /* ================= TRACKING MODAL ================= */

// interface TrackingModalProps {
//   open: boolean;
//   onClose: () => void;
//   trackingData: TrackingData | null;
//   loading?: boolean;
// }

// const TrackingModal: React.FC<TrackingModalProps> = ({
//   open,
//   onClose,
//   trackingData,
//   loading = false,
// }) => {
//   const getStageStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-500";
//       case "in-progress":
//         return "bg-blue-500";
//       case "skipped":
//         return "bg-yellow-500";
//       case "pending":
//       default:
//         return "bg-gray-300";
//     }
//   };

//   const getStageStatusText = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "Completed";
//       case "in-progress":
//         return "In Progress";
//       case "skipped":
//         return "Skipped";
//       case "pending":
//       default:
//         return "Pending";
//     }
//   };

//   const calculateProgress = () => {
//     if (!trackingData?.stages?.length) return 0;
//     const completedStages = trackingData.stages.filter(
//       (stage) => stage.status === "completed"
//     ).length;
//     return Math.round((completedStages / trackingData.stages.length) * 100);
//   };

//   const formatDateString = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: { xs: "95%", sm: "85%", md: 700 },
//           maxHeight: "90vh",
//           overflow: "auto",
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           boxShadow: 24,
//           p: { xs: 3, sm: 4 },
//         }}
//       >
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <CircularProgress />
//           </div>
//         ) : trackingData ? (
//           <>
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <FaChartLine className="w-6 h-6 text-green-600" />
//                 </div>
//                 <div>
//                   <Typography variant="h6" className="text-gray-900 font-bold">
//                     {trackingData.name}
//                   </Typography>
//                   <Typography variant="body2" className="text-gray-600">
//                     Tracking ID: {trackingData._id}
//                   </Typography>
//                 </div>
//               </div>
//               <IconButton onClick={onClose} size="small">
//                 <FaTimes />
//               </IconButton>
//             </div>

//             {/* Progress Overview */}
//             <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
//               <div className="flex justify-between items-center mb-3">
//                 <Typography variant="subtitle1" className="font-semibold">
//                   Overall Progress
//                 </Typography>
//                 <Typography variant="h6" className="font-bold text-green-600">
//                   {trackingData.progress || calculateProgress()}%
//                 </Typography>
//               </div>
//               <LinearProgress
//                 variant="determinate"
//                 value={trackingData.progress || calculateProgress()}
//                 className="h-2 rounded-full mb-2"
//                 sx={{
//                   "& .MuiLinearProgress-bar": {
//                     backgroundColor: "#10B981",
//                   },
//                 }}
//               />
//               <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 mt-2 gap-2">
//                 <span>
//                   Current Stage:{" "}
//                   <span className="font-semibold">
//                     {trackingData.currentStageName || 
//                      trackingData.stages[trackingData.currentStageIndex]?.name ||
//                      "Not Started"}
//                   </span>
//                 </span>
//                 <span>
//                   {trackingData.stages.filter((s) => s.status === "completed")
//                     .length}{" "}
//                   of {trackingData.stages.length} stages completed
//                 </span>
//               </div>
//             </div>

//             {/* Crop Information */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
//                 <Typography
//                   variant="subtitle2"
//                   className="text-gray-500 mb-3 font-semibold"
//                 >
//                   CROP INFORMATION
//                 </Typography>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Crop Name:</span>
//                     <span className="text-sm font-semibold">
//                       {trackingData.cropName}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Farmer ID:</span>
//                     <span className="text-sm font-semibold">
//                       {trackingData.farmerId}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Crop ID:</span>
//                     <span className="text-sm font-semibold">
//                       {trackingData.cropId}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Tracking Created:</span>
//                     <span className="text-sm" title={formatDateTime(trackingData.createdAt)}>
//                       {formatDateString(trackingData.createdAt)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
//                 <Typography
//                   variant="subtitle2"
//                   className="text-gray-500 mb-3 font-semibold"
//                 >
//                   STAGE STATUS
//                 </Typography>
//                 <div className="flex flex-wrap gap-3 mb-4">
//                   {["pending", "in-progress", "completed", "skipped"].map(
//                     (status) => {
//                       const count = trackingData.stages.filter(
//                         (s) => s.status === status
//                       ).length;
//                       return (
//                         <div key={status} className="flex items-center gap-2">
//                           <div
//                             className={`w-3 h-3 rounded-full ${getStageStatusColor(
//                               status
//                             )}`}
//                           />
//                           <span className="text-xs text-gray-600">
//                             {getStageStatusText(status)}: {count}
//                           </span>
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>
//                 <div>
//                   <Typography
//                     variant="caption"
//                     className="text-gray-500 block mb-2 font-medium"
//                   >
//                     Current Stage:
//                   </Typography>
//                   <Chip
//                     label={
//                       trackingData.currentStageName ||
//                       trackingData.stages[trackingData.currentStageIndex]
//                         ?.name || "Not Started"
//                     }
//                     color="primary"
//                     size="small"
//                     icon={<FaLeaf className="w-3 h-3" />}
//                     className="bg-green-100 text-green-800"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Stages Timeline */}
//             <Typography
//               variant="subtitle1"
//               className="font-semibold mb-4 text-gray-900"
//             >
//               Growth Stages
//             </Typography>
//             <div className="space-y-3">
//               {trackingData.stages.map((stage, index) => (
//                 <div
//                   key={stage._id}
//                   className={`border rounded-lg shadow-sm p-4 ${
//                     index === trackingData.currentStageIndex
//                       ? "border-green-300 bg-green-50"
//                       : "border-gray-200"
//                   }`}
//                 >
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                             index <= trackingData.currentStageIndex
//                               ? "bg-green-100 text-green-600"
//                               : "bg-gray-100 text-gray-400"
//                           }`}
//                         >
//                           {index + 1}
//                         </div>
//                         {index === trackingData.currentStageIndex && (
//                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
//                         )}
//                       </div>
//                       <div>
//                         <Typography
//                           variant="subtitle2"
//                           className={`font-medium ${
//                             index === trackingData.currentStageIndex
//                               ? "text-green-700"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {stage.name}
//                         </Typography>
//                         <Typography variant="caption" className="text-gray-500">
//                           {stage.photos?.length || 0} photos
//                         </Typography>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Chip
//                         label={getStageStatusText(stage.status)}
//                         size="small"
//                         className={`${
//                           stage.status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : stage.status === "in-progress"
//                             ? "bg-blue-100 text-blue-800"
//                             : stage.status === "skipped"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       />
//                       {index === trackingData.currentStageIndex && (
//                         <Chip
//                           label="Current"
//                           color="primary"
//                           size="small"
//                           variant="outlined"
//                           className="border-green-500 text-green-600"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={onClose}
//                 variant="contained"
//                 className="bg-gradient-to-r from-green-600 to-emerald-600"
//                 startIcon={<FaTimes />}
//               >
//                 Close
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-12">
//             <FaInfoCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <Typography variant="h6" className="text-gray-900 mb-2">
//               No Tracking Data Available
//             </Typography>
//             <Typography variant="body2" className="text-gray-600 mb-6">
//               Tracking information could not be loaded.
//             </Typography>
//             <Button onClick={onClose} variant="outlined">
//               Close
//             </Button>
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// /* ================= CROP FORM MODAL ================= */

// interface CropFormModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CropFormData) => void;
//   loading?: boolean;
//   initialData?: Crop | null;
//   isEdit?: boolean;
// }

// interface CropFormData {
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   sowingDate: string;
//   farmerId: string;
// }

// const CropFormModal: React.FC<CropFormModalProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   loading = false,
//   initialData = null,
//   isEdit = false,
// }) => {
//   const [formData, setFormData] = useState<CropFormData>({
//     farmingType: "organic",
//     seedType: "gmo",
//     acres: 0,
//     sowingDate: new Date().toISOString().split('T')[0],
//     farmerId: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         farmingType: initialData.farmingType || "organic",
//         seedType: initialData.seedType || "gmo",
//         acres: initialData.acres || 0,
//         sowingDate: initialData.sowingDate ? new Date(initialData.sowingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         farmerId: initialData.farmerId || "",
//       });
//     } else {
//       setFormData({
//         farmingType: "organic",
//         seedType: "gmo",
//         acres: 0,
//         sowingDate: new Date().toISOString().split('T')[0],
//         farmerId: "",
//       });
//     }
//     setErrors({});
//   }, [initialData, open]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.farmingType) {
//       newErrors.farmingType = "Farming type is required";
//     }

//     if (!formData.seedType) {
//       newErrors.seedType = "Seed type is required";
//     }

//     if (formData.acres <= 0) {
//       newErrors.acres = "Acres must be greater than 0";
//     }

//     if (!formData.sowingDate) {
//       newErrors.sowingDate = "Sowing date is required";
//     }

//     if (!formData.farmerId.trim()) {
//       newErrors.farmerId = "Farmer ID is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   const handleInputChange = (field: keyof CropFormData, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: field === 'acres' ? Number(value) || 0 : value,
//     }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <FaChartLine className="w-5 h-5" />
//             <span className="text-lg font-semibold">
//               {isEdit ? "Edit Crop Record" : "Add New Crop Posting"}
//             </span>
//           </div>
//           <IconButton onClick={onClose} size="small" className="text-white">
//             <FaTimes />
//           </IconButton>
//         </div>
//       </DialogTitle>
//       <DialogContent className="pt-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Farming Type *
//               </label>
//               <select
//                 value={formData.farmingType}
//                 onChange={(e) => handleInputChange("farmingType", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white ${
//                   errors.farmingType ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               >
//                 <option value="organic">Organic</option>
//                 <option value="natural">Natural</option>
//                 <option value="hydroponic">Hydroponic</option>
//                 <option value="regular">Regular</option>
//               </select>
//               {errors.farmingType && (
//                 <p className="mt-1 text-xs text-red-600">{errors.farmingType}</p>
//               )}
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Seed Type *
//               </label>
//               <select
//                 value={formData.seedType}
//                 onChange={(e) => handleInputChange("seedType", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white ${
//                   errors.seedType ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               >
//                 <option value="gmo">GMO</option>
//                 <option value="hybrid">Hybrid</option>
//                 <option value="heirloom">Heirloom</option>
//                 <option value="naati">Naati</option>
//               </select>
//               {errors.seedType && (
//                 <p className="mt-1 text-xs text-red-600">{errors.seedType}</p>
//               )}
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Acres *
//               </label>
//               <input
//                 type="number"
//                 value={formData.acres}
//                 onChange={(e) => handleInputChange("acres", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.acres ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter acres"
//                 min="0"
//                 step="0.01"
//                 required
//               />
//               {errors.acres && (
//                 <p className="mt-1 text-xs text-red-600">{errors.acres}</p>
//               )}
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Sowing Date *
//               </label>
//               <input
//                 type="date"
//                 value={formData.sowingDate}
//                 onChange={(e) => handleInputChange("sowingDate", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.sowingDate ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               />
//               {errors.sowingDate && (
//                 <p className="mt-1 text-xs text-red-600">{errors.sowingDate}</p>
//               )}
//             </div>

//             <div className="col-span-2">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Farmer ID *
//               </label>
//               <input
//                 type="text"
//                 value={formData.farmerId}
//                 disabled
//                 onChange={(e) => handleInputChange("farmerId", e.target.value)}
//                 className={`w-full px-3 bg-gray-50 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.farmerId ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter farmer ID"
//                 required
//               />
//               {errors.farmerId && (
//                 <p className="mt-1 text-xs text-red-600">{errors.farmerId}</p>
//               )}
//             </div>
//           </div>
//         </form>
//       </DialogContent>
//       <DialogActions className="px-6 py-4 border-t">
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={loading}
//           className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//         >
//           {loading ? (
//             <>
//               <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
//               {isEdit ? "Updating..." : "Creating..."}
//             </>
//           ) : isEdit ? (
//             "Update Crop"
//           ) : (
//             "Create Crop"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// /* ================= MODAL STYLE ================= */

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "95%", sm: "85%", md: 500 },
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: { xs: 3, sm: 4 },
// };

// /* ================= STAGES DISPLAY COMPONENT ================= */

// const StagesDisplay: React.FC<{ stages: Stage[]; currentStageIndex: number }> = ({ stages, currentStageIndex }) => {
//   const [expanded, setExpanded] = useState(false);

//   const getStageStatusColor = (status: string) => {
//     switch (status) {
//       case "completed": return "bg-green-500";
//       case "in-progress": return "bg-blue-500";
//       case "skipped": return "bg-yellow-500";
//       case "pending": default: return "bg-gray-300";
//     }
//   };

//   const getStageStatusText = (status: string) => {
//     switch (status) {
//       case "completed": return "Completed";
//       case "in-progress": return "In Progress";
//       case "skipped": return "Skipped";
//       case "pending": default: return "Pending";
//     }
//   };

//   const getStageStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed": return <FaCheckCircle className="w-3 h-3 text-green-500" />;
//       case "in-progress": return <FaClock className="w-3 h-3 text-blue-500" />;
//       case "skipped": return <FaExclamationTriangle className="w-3 h-3 text-yellow-500" />;
//       case "pending": default: return <FaClock className="w-3 h-3 text-gray-400" />;
//     }
//   };

//   // Desktop view - compact
//   const DesktopStagesView = () => (
//     <div className="space-y-1">
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center gap-2">
//           <FaList className="w-3 h-3 text-gray-500" />
//           <span className="text-xs font-semibold text-gray-700">Stages ({stages.length})</span>
//         </div>
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
//         >
//           {expanded ? (
//             <>
//               <FaChevronUp className="w-3 h-3" />
//               Hide Details
//             </>
//           ) : (
//             <>
//               <FaChevronDown className="w-3 h-3" />
//               Show Details
//             </>
//           )}
//         </button>
//       </div>
      
//       {/* Compact stages view */}
//       <div className="flex items-center gap-1 overflow-x-auto pb-2">
//         {stages.map((stage, index) => (
//           <Tooltip key={stage._id} title={`${stage.name}: ${getStageStatusText(stage.status)}`} arrow>
//             <div className={`relative flex flex-col items-center min-w-[50px] px-1 py-1 rounded ${
//               index === currentStageIndex ? "bg-blue-50 border border-blue-200" : ""
//             }`}>
//               <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
//                 index < currentStageIndex ? "bg-green-100" :
//                 index === currentStageIndex ? "bg-blue-100" :
//                 "bg-gray-100"
//               }`}>
//                 <span className={`text-xs font-bold ${
//                   index < currentStageIndex ? "text-green-600" :
//                   index === currentStageIndex ? "text-blue-600" :
//                   "text-gray-400"
//                 }`}>
//                   {index + 1}
//                 </span>
//                 {/* {stage.status === "completed" && (
//                   <FaCheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
//                 )} */}
//               </div>
//               <div className="mt-1">
//                 {getStageStatusIcon(stage.status)}
//               </div>
//               <div className="text-xs mt-1 text-center font-medium truncate max-w-[50px]">
//                 {stage.name.split(' ')[0]}
//               </div>
//             </div>
//           </Tooltip>
//         ))}
//       </div>

//       {/* Expanded stages details */}
//       <Collapse in={expanded}>
//         <div className="mt-2 pt-2 border-t border-gray-200">
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {stages.map((stage, index) => (
//               <div 
//                 key={stage._id} 
//                 className={`p-2 rounded text-xs ${
//                   index === currentStageIndex ? "bg-blue-50 border-l-4 border-blue-500" :
//                   "bg-gray-50"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className={`w-2 h-2 rounded-full ${getStageStatusColor(stage.status)}`} />
//                     <span className="font-semibold">{index + 1}. {stage.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Chip
//                       label={getStageStatusText(stage.status)}
//                       size="small"
//                       className={`text-xs ${
//                         stage.status === "completed" ? "bg-green-100 text-green-800" :
//                         stage.status === "in-progress" ? "bg-blue-100 text-blue-800" :
//                         stage.status === "skipped" ? "bg-yellow-100 text-yellow-800" :
//                         "bg-gray-100 text-gray-800"
//                       }`}
//                     />
//                     {index === currentStageIndex && (
//                       <Chip
//                         label="Current"
//                         size="small"
//                         className="bg-blue-100 text-blue-800 text-xs"
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <div className="mt-1 flex items-center gap-2 text-gray-600">
//                   <FaCamera className="w-3 h-3" />
//                   <span>{stage.photos?.length || 0} photos</span>
//                 </div>
//                 {stage.completedAt && (
//                   <div className="mt-1 text-gray-500 text-xs">
//                     Completed: {new Date(stage.completedAt).toLocaleDateString()}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </Collapse>
//     </div>
//   );

//   // Mobile view - detailed
//   const MobileStagesView = () => (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <FaList className="w-4 h-4 text-gray-500" />
//           <span className="font-medium text-gray-700">All Stages ({stages.length})</span>
//         </div>
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {expanded ? <FaChevronUp /> : <FaChevronDown />}
//         </button>
//       </div>
      
//       {/* Stages progress bar */}
//       <div className="flex items-center gap-2">
//         <div className="flex-1 bg-gray-200 rounded-full h-2">
//           <div 
//             className="bg-green-500 h-2 rounded-full" 
//             style={{ width: `${(stages.filter(s => s.status === "completed").length / stages.length) * 100}%` }}
//           ></div>
//         </div>
//         <span className="text-xs font-bold">
//           {stages.filter(s => s.status === "completed").length}/{stages.length}
//         </span>
//       </div>

//       {/* Stages visualization */}
//       <div className="flex items-center gap-1 overflow-x-auto py-2">
//         {stages.map((stage, index) => (
//           <div 
//             key={stage._id} 
//             className={`flex flex-col items-center min-w-[60px] p-2 rounded ${
//               index === currentStageIndex ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
//             }`}
//           >
//             <div className="relative">
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 index < currentStageIndex ? "bg-green-100" :
//                 index === currentStageIndex ? "bg-blue-100" :
//                 "bg-gray-100"
//               }`}>
//                 <span className={`text-sm font-bold ${
//                   index < currentStageIndex ? "text-green-600" :
//                   index === currentStageIndex ? "text-blue-600" :
//                   "text-gray-400"
//                 }`}>
//                   {index + 1}
//                 </span>
//                 {stage.status === "completed" && (
//                   <FaCheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
//                 )}
//               </div>
//             </div>
//             <div className="mt-1">
//               {getStageStatusIcon(stage.status)}
//             </div>
//             <div className="text-xs mt-1 text-center font-medium truncate max-w-[60px]">
//               {stage.name}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Expanded details */}
//       {expanded && (
//         <div className="space-y-2 mt-2 pt-2 border-t border-gray-200">
//           {stages.map((stage, index) => (
//             <div 
//               key={stage._id} 
//               className={`p-3 rounded ${
//                 index === currentStageIndex ? "bg-blue-50 border-l-4 border-blue-500" :
//                 "bg-gray-50"
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-3 h-3 rounded-full ${getStageStatusColor(stage.status)}`} />
//                   <div>
//                     <div className="font-semibold text-sm">{index + 1}. {stage.name}</div>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className={`px-2 py-0.5 rounded text-xs font-medium ${
//                         stage.status === "completed" ? "bg-green-100 text-green-800" :
//                         stage.status === "in-progress" ? "bg-blue-100 text-blue-800" :
//                         stage.status === "skipped" ? "bg-yellow-100 text-yellow-800" :
//                         "bg-gray-100 text-gray-800"
//                       }`}>
//                         {getStageStatusText(stage.status)}
//                       </div>
//                       {index === currentStageIndex && (
//                         <div className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                           Current
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
//                 <div className="flex items-center gap-1">
//                   <FaCamera className="w-3 h-3 text-gray-500" />
//                   <span className="text-gray-600">Photos:</span>
//                   <span className="font-semibold">{stage.photos?.length || 0}</span>
//                 </div>
//                 {stage.completedAt && (
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-600">Completed:</span>
//                     <span className="font-semibold">
//                       {new Date(stage.completedAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <div className="hidden lg:block">
//         <DesktopStagesView />
//       </div>
//       <div className="lg:hidden">
//         <MobileStagesView />
//       </div>
//     </>
//   );
// };

// /* ================= FARMER INFO COMPONENT ================= */

// const FarmerInfoDisplay: React.FC<{ farmer: Farmer }> = ({ farmer }) => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div  onClick={() => setExpanded(!expanded)} className="space-y-1 cursor-pointer">
//       <div  onClick={() => setExpanded(!expanded)} className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <FaUser className="w-4 h-4 text-gray-500" />
//           <span className="text-xs font-semibold text-gray-700">Farmer Info</span>
//         </div>
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
//         >
//           {expanded ? (
//             <>
//               <FaChevronUp className="w-3 h-3" />
             
//             </>
//           ) : (
//             <>
//               <FaChevronDown className="w-3 h-3" />
             
//             </>
//           )}
//         </button>
//       </div>
      
//       <div className="space-y-1 text-xs">
//         <div className="flex items-center gap-2">
//           <FaUser className="w-3 h-3 text-gray-400" />
//           <span className="font-medium text-gray-900">{farmer.personalInfo.name}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <FaPhone className="w-3 h-3 text-gray-400" />
//           <span className="text-gray-600">{farmer.personalInfo.mobileNo}</span>
//         </div>
//         {farmer.personalInfo.email && (
//           <div className="flex items-center gap-2">
//             <FaEnvelope className="w-3 h-3 text-gray-400" />
//             <span className="text-gray-600 truncate max-w-[150px]">{farmer.personalInfo.email}</span>
//           </div>
//         )}
//         {(farmer.farmerId || farmer.traderId) && (
//           <div className="flex items-center gap-2">
//             <FaIdCard className="w-3 h-3 text-gray-400" />
//             <span className="text-gray-600">{farmer.farmerId || farmer.traderId}</span>
//           </div>
//         )}
//       </div>

//       <Collapse in={expanded}>
//         <div className="mt-2 pt-2 border-t border-gray-200">
//           <div className="space-y-1 text-xs">
//             {farmer.personalInfo.address && (
//               <div>
//                 <span className="text-gray-600">Address: </span>
//                 <span className="font-medium">{farmer.personalInfo.address}</span>
//               </div>
//             )}
//             {farmer.personalInfo.villageGramaPanchayat && (
//               <div>
//                 <span className="text-gray-600">Village: </span>
//                 <span className="font-medium">{farmer.personalInfo.villageGramaPanchayat}</span>
//               </div>
//             )}
//             {(farmer.personalInfo.taluk || farmer.personalInfo.district) && (
//               <div className="flex items-center gap-1">
//                 <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
//                 <span className="text-gray-600">
//                   {farmer.personalInfo.taluk && `${farmer.personalInfo.taluk}, `}
//                   {farmer.personalInfo.district && `${farmer.personalInfo.district}, `}
//                   {farmer.personalInfo.state}
//                 </span>
//               </div>
//             )}
//             {farmer.personalInfo.pincode && (
//               <div>
//                 <span className="text-gray-600">Pincode: </span>
//                 <span className="font-medium">{farmer.personalInfo.pincode}</span>
//               </div>
//             )}
//             <div className="mt-1">
//               <span className="text-gray-600">Status: </span>
//               <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
//                 farmer.registrationStatus === "approved" ? "bg-green-100 text-green-800" :
//                 farmer.registrationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
//                 "bg-gray-100 text-gray-800"
//               }`}>
//                 {farmer.registrationStatus}
//               </span>
//             </div>
//           </div>
//         </div>
//       </Collapse>
//     </div>
//   );
// };

// /* ================= MAIN COMPONENT ================= */

// export default function CropManagementPage() {
//   const [crops, setCrops] = useState<Crop[]>([]);
//   const [allCrops, setAllCrops] = useState<Crop[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterFarmingType, setFilterFarmingType] = useState<string>("all");
//   const [filterSeedType, setFilterSeedType] = useState<string>("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [limit, setLimit] = useState(10);

//   const [modal, setModal] = useState<{
//     type: "view" | "edit" | "delete" | "bulkDelete" | "tracking" | null;
//     row?: Crop;
//     selectedIds?: string[];
//   }>({ type: null });

//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "info" | "warning";
//   }>({ open: false, message: "", severity: "success" });

//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [formModalLoading, setFormModalLoading] = useState(false);
//   const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
//   const [trackingLoading, setTrackingLoading] = useState(false);
//   const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  
//   const tableRef = useRef<HTMLDivElement>(null);

//   // Get unique farming types and seed types from all crops data
//   const farmingTypes = [...new Set(allCrops.map(crop => crop.farmingType))];
//   const seedTypes = [...new Set(allCrops.map(crop => crop.seedType))];

//   /* ================= API FUNCTIONS ================= */

//   const fetchCrops = async () => {
//     try {
//       setLoading(true);
      
//       const params: any = {
//         search: searchTerm,
//         page,
//         limit: limit,
//       };
      
//       if (filterFarmingType !== "all") {
//         params.farmingType = filterFarmingType;
//       }
      
//       if (filterSeedType !== "all") {
//         params.seedType = filterSeedType;
//       }

//       const response = await axios.get("/api/postings", {
//         params,
//       });

//       if (response.data.success) {
//         const data = response.data.data || [];
//         const total = response.data.total || 0;
        
//         setCrops(data);
//         setAllCrops(response.data.allData || []);
//         setTotalItems(total);
//         setTotalPages(Math.ceil(total / limit) || 1);
//       } else {
//         showSnackbar("Failed to fetch crops", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching crops:", error);
//       showSnackbar("Error fetching crops", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTrackingData = async (trackingId: string) => {
//     try {
//       setTrackingLoading(true);
//       const response = await axios.get(`/api/tracking?id=${trackingId}`);
      
//       if (response.data.success) {
//         setTrackingData(response.data.data);
//         setModal({ type: "tracking" });
//       } else {
//         showSnackbar("Failed to fetch tracking data", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching tracking data:", error);
//       showSnackbar("Error fetching tracking data", "error");
//     } finally {
//       setTrackingLoading(false);
//     }
//   };

//   const handleDeleteCrop = async (id: string) => {
//     try {
//       const response = await axios.delete(`/api/postings/${id}`);

//       if (response.data.success) {
//         showSnackbar("Crop deleted successfully", "success");
//         fetchCrops();
//         setModal({ type: null });
//       } else {
//         showSnackbar("Failed to delete crop", "error");
//       }
//     } catch (error) {
//       console.error("Error deleting crop:", error);
//       showSnackbar("Error deleting crop", "error");
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       showSnackbar("No crops selected", "warning");
//       return;
//     }

//     try {
//       const deletePromises = selectedIds.map(id => 
//         axios.delete(`/api/postings/${id}`)
//       );
//       const results = await Promise.allSettled(deletePromises);
      
//       const successfulDeletes = results.filter(r => r.status === 'fulfilled').length;
      
//       if (successfulDeletes > 0) {
//         showSnackbar(`${successfulDeletes} crops deleted successfully`, "success");
//         setSelectedIds([]);
//         fetchCrops();
//       } else {
//         showSnackbar("Failed to delete crops", "error");
//       }
//       setModal({ type: null });
//     } catch (error) {
//       console.error("Error in bulk delete:", error);
//       showSnackbar("Error deleting crops", "error");
//     }
//   };

//   const handleCreateCrop = async (data: any) => {
//     try {
//       setFormModalLoading(true);
//       const response = await axios.post("/api/postings", data);

//       if (response.data.success) {
//         showSnackbar("Crop created successfully", "success");
//         setFormModalOpen(false);
//         fetchCrops();
//       } else {
//         showSnackbar("Failed to create crop", "error");
//       }
//     } catch (error: any) {
//       console.error("Error creating crop:", error);
//       showSnackbar(
//         error.response?.data?.message || "Error creating crop",
//         "error"
//       );
//     } finally {
//       setFormModalLoading(false);
//     }
//   };

//   const handleUpdateCrop = async (data: any) => {
//     if (!editingCrop) return;

//     try {
//       setFormModalLoading(true);
//       const response = await axios.put(`/api/postings/${editingCrop._id}`, data);

//       if (response.data.success) {
//         showSnackbar("Crop updated successfully", "success");
//         setFormModalOpen(false);
//         setEditingCrop(null);
//         fetchCrops();
//       } else {
//         showSnackbar("Failed to update crop", "error");
//       }
//     } catch (error: any) {
//       console.error("Error updating crop:", error);
//       showSnackbar(
//         error.response?.data?.message || "Error updating crop",
//         "error"
//       );
//     } finally {
//       setFormModalLoading(false);
//     }
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchCrops();
//   }, [page, limit]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (page !== 1) setPage(1);
//       fetchCrops();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, filterFarmingType, filterSeedType]);

//   /* ================= UTILITY FUNCTIONS ================= */

//   const showSnackbar = (
//     message: string,
//     severity: "success" | "error" | "info" | "warning"
//   ) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const getFarmingTypeColor = (type: string) => {
//     switch (type) {
//       case "organic":
//         return "bg-green-100 text-green-800";
//       case "natural":
//         return "bg-blue-100 text-blue-800";
//       case "hydroponic":
//         return "bg-purple-100 text-purple-800";
//       case "inorganic":
//         return "bg-yellow-100 text-yellow-800";
//       case "regular":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getSeedTypeColor = (type: string) => {
//     switch (type) {
//       case "gmo":
//         return "bg-red-100 text-red-800";
//       case "hybrid":
//         return "bg-orange-100 text-orange-800";
//       case "heirloom":
//         return "bg-teal-100 text-teal-800";
//       case "naati":
//         return "bg-indigo-100 text-indigo-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   const getFarmingTypeLabel = (type: string) => {
//     const labels: Record<string, string> = {
//       organic: "Organic",
//       natural: "Natural",
//       hydroponic: "Hydroponic",
//       inorganic: "Inorganic",
//       regular: "Regular"
//     };
//     return labels[type] || type;
//   };

//   const getSeedTypeLabel = (type: string) => {
//     const labels: Record<string, string> = {
//       gmo: "GMO",
//       hybrid: "Hybrid",
//       heirloom: "Heirloom",
//       naati: "Naati"
//     };
//     return labels[type] || type;
//   };

//   const formatTrackingId = (trackingId: string) => {
//     if (!trackingId) return "N/A";
//     if (trackingId.length <= 8) return trackingId;
//     return `...${trackingId.slice(-8)}`;
//   };

//   const getFarmerDisplayId = (crop: Crop) => {
//     if (crop.farmer?.farmerId) return crop.farmer.farmerId;
//     if (crop.farmer?.traderId) return crop.farmer.traderId;
//     return crop.farmerId;
//   };

//   const getFarmerName = (crop: Crop) => {
//     return crop.farmer?.personalInfo?.name || "Unknown";
//   };

//   const getFarmerContact = (crop: Crop) => {
//     return crop.farmer?.personalInfo?.mobileNo || "N/A";
//   };

//   const getFarmerLocation = (crop: Crop) => {
//     const farmer = crop.farmer;
//     if (!farmer?.personalInfo) return "N/A";
    
//     const loc = farmer.personalInfo;
//     const parts = [];
//     if (loc.villageGramaPanchayat) parts.push(loc.villageGramaPanchayat);
//     if (loc.taluk) parts.push(loc.taluk);
//     if (loc.district) parts.push(loc.district);
//     if (loc.state) parts.push(loc.state);
    
//     return parts.length > 0 ? parts.join(", ") : "N/A";
//   };

//   const getFarmerEmail = (crop: Crop) => {
//     return crop.farmer?.personalInfo?.email || "N/A";
//   };

//   const getFarmerAddress = (crop: Crop) => {
//     return crop.farmer?.personalInfo?.address || "N/A";
//   };

//   const getFarmerRegistrationStatus = (crop: Crop) => {
//     return crop.farmer?.registrationStatus || "N/A";
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   // const copyData = () => {
//   //   if (crops.length === 0) {
//   //     showSnackbar("No data to copy", "warning");
//   //     return;
//   //   }

//   //   try {
//   //     const headers = [
//   //       "Farming Type", "Seed Type", "Acres", "Sowing Date", 
//   //       "Farmer Name", "Farmer Phone", "Farmer Email", "Farmer Address",
//   //       "Farmer ID", "Farmer Location", "Registration Status",
//   //       "Tracking ID", "Progress", "Current Stage", "Total Stages",
//   //       "Stages Completed", "Created Date"
//   //     ];
      
//   //     const rows = crops.map((crop) => [
//   //       getFarmingTypeLabel(crop.farmingType) || "",
//   //       getSeedTypeLabel(crop.seedType) || "",
//   //       crop.acres?.toString() || "0",
//   //       formatDate(crop.sowingDate) || "",
//   //       getFarmerName(crop) || "",
//   //       getFarmerContact(crop) || "",
//   //       getFarmerEmail(crop) || "",
//   //       getFarmerAddress(crop) || "",
//   //       getFarmerDisplayId(crop) || "",
//   //       getFarmerLocation(crop) || "",
//   //       getFarmerRegistrationStatus(crop) || "",
//   //       crop.trackingId || "",
//   //       crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
//   //       crop.tracking?.currentStageName || "Not Started",
//   //       crop.tracking?.stages?.length || 0,
//   //       crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
//   //       formatDate(crop.createdAt) || ""
//   //     ]);
      
//   //     const columnWidths = headers.map((header, colIndex) => {
//   //       const maxHeaderLength = header.length;
//   //       const maxDataLength = rows.reduce((max, row) => {
//   //         const cell = row[colIndex] || "";
//   //         const cellLength = cell.toString().length;
//   //         return Math.max(max, cellLength);
//   //       }, 0);
//   //       return Math.max(maxHeaderLength, maxDataLength, 10);
//   //     });
      
//   //     let tableString = "";
      
//   //     tableString += headers.map((header, i) => 
//   //       header.padEnd(columnWidths[i])
//   //     ).join(" | ") + "\n";
      
//   //     tableString += headers.map((_, i) => 
//   //       "-".repeat(columnWidths[i])
//   //     ).join("-+-") + "\n";
      
//   //     rows.forEach(row => {
//   //       tableString += row.map((cell, i) => {
//   //         const cellStr = cell?.toString() || "";
//   //         return cellStr.padEnd(columnWidths[i]);
//   //       }).join(" | ") + "\n";
//   //     });
      
//   //     tableString += `\nTotal Crops: ${totalItems}\n`;
//   //     tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
//   //     navigator.clipboard.writeText(tableString);
//   //     showSnackbar("Data copied in table format", "success");
//   //   } catch (error) {
//   //     console.error("Error copying data:", error);
//   //     showSnackbar("Failed to copy data", "error");
//   //   }
//   // };

// const copyData = () => {
//   if (crops.length === 0) {
//     showSnackbar("No data to copy", "warning");
//     return;
//   }

//   try {
//     // Only essential columns
//     const headers = [
//       "Farming", "Seed", "Acres", "Sowing", 
//       "Farmer", "Phone", "ID", "Location",
//       "Progress", "Stage", "Tracking ID"
//     ];
    
//     const rows = crops.map((crop) => [
//       getFarmingTypeLabel(crop.farmingType)?.substring(0, 8) || "",
//       getSeedTypeLabel(crop.seedType)?.substring(0, 8) || "",
//       crop.acres?.toString() || "0",
//       formatDate(crop.sowingDate)?.split(',')[0] || "", // Just date part
//       getFarmerName(crop)?.substring(0, 12) || "",
//       getFarmerContact(crop) || "",
//       getFarmerDisplayId(crop) || "",
//       getFarmerLocation(crop)?.split(',')[0]?.substring(0, 15) || "", // Just first part
//       crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
//       crop.tracking?.currentStageName?.substring(0, 12) || "Not Started",
//       crop.trackingId?.substring(0, 8) + "..." || ""
//     ]);
    
//     const columnWidths = [10, 10, 8, 12, 14, 12, 10, 16, 10, 14, 15];
    
//     let tableString = "";
    
//     // Create compact table
//     tableString += "┌" + columnWidths.map(w => "─".repeat(w)).join("┬") + "┐\n";
//     tableString += "│" + headers.map((h, i) => ` ${h.padEnd(columnWidths[i] - 2)} `).join("│") + "│\n";
//     tableString += "├" + columnWidths.map(w => "─".repeat(w)).join("┼") + "┤\n";
    
//     rows.forEach((row, i) => {
//       tableString += "│" + row.map((cell, j) => {
//         const cellStr = cell?.toString() || "";
//         return ` ${cellStr.padEnd(columnWidths[j] - 2)} `;
//       }).join("│") + "│\n";
      
//       if ((i + 1) % 5 === 0 && i < rows.length - 1) {
//         tableString += "├" + columnWidths.map(w => "─".repeat(w)).join("┼") + "┤\n";
//       }
//     });
    
//     tableString += "└" + columnWidths.map(w => "─".repeat(w)).join("┴") + "┘\n\n";
    
//     // Full details for first few records
//     if (crops.length > 0) {
//       tableString += "DETAILED VIEW (First 3 records):\n";
//       tableString += "════════════════════════════════════════════════════════════\n";
      
//       crops.slice(0, 3).forEach((crop, index) => {
//         tableString += `\nRECORD ${index + 1}:\n`;
//         tableString += `  Farming Type: ${getFarmingTypeLabel(crop.farmingType)}\n`;
//         tableString += `  Seed Type: ${getSeedTypeLabel(crop.seedType)}\n`;
//         tableString += `  Acres: ${crop.acres}\n`;
//         tableString += `  Sowing Date: ${formatDate(crop.sowingDate)}\n`;
//         tableString += `  Farmer: ${getFarmerName(crop)} (${getFarmerDisplayId(crop)})\n`;
//         tableString += `  Phone: ${getFarmerContact(crop)}\n`;
//         tableString += `  Email: ${getFarmerEmail(crop)}\n`;
//         tableString += `  Location: ${getFarmerLocation(crop)}\n`;
//         tableString += `  Tracking ID: ${crop.trackingId}\n`;
//         tableString += `  Progress: ${crop.tracking?.progress || 0}%\n`;
//         tableString += `  Current Stage: ${crop.tracking?.currentStageName || "Not Started"}\n`;
//         tableString += `  Stages: ${crop.tracking?.stages?.filter(s => s.status === "completed").length || 0}/${crop.tracking?.stages?.length || 0}\n`;
//       });
//     }
    
//     tableString += `\nTotal Records: ${totalItems}\n`;
//     tableString += `Generated: ${new Date().toLocaleString()}\n`;
    
//     navigator.clipboard.writeText(tableString);
//     showSnackbar("Data copied in compact table format", "success");
//   } catch (error) {
//     console.error("Error copying data:", error);
//     showSnackbar("Failed to copy data", "error");
//   }
// };
 
//   const exportCSV = () => {
//     if (crops.length === 0) {
//       showSnackbar("No data to export", "warning");
//       return;
//     }

//     try {
//       const headers = [
//         "Farming Type", "Seed Type", "Acres", "Sowing Date", 
//         "Farmer Name", "Farmer Phone", "Farmer Email", "Farmer Address",
//         "Farmer Village", "Farmer Taluk", "Farmer District", "Farmer State",
//         "Farmer Pincode", "Farmer ID", "Registration Status",
//         "Tracking ID", "Progress", "Current Stage", "Total Stages",
//         "Stages Completed", "Tracking Created", "Created Date"
//       ];
      
//       const rows = crops.map((crop) => [
//         getFarmingTypeLabel(crop.farmingType),
//         getSeedTypeLabel(crop.seedType),
//         crop.acres,
//         formatDate(crop.sowingDate),
//         crop.farmer?.personalInfo?.name || "",
//         crop.farmer?.personalInfo?.mobileNo || "",
//         crop.farmer?.personalInfo?.email || "",
//         crop.farmer?.personalInfo?.address || "",
//         crop.farmer?.personalInfo?.villageGramaPanchayat || "",
//         crop.farmer?.personalInfo?.taluk || "",
//         crop.farmer?.personalInfo?.district || "",
//         crop.farmer?.personalInfo?.state || "",
//         crop.farmer?.personalInfo?.pincode || "",
//         getFarmerDisplayId(crop),
//         crop.farmer?.registrationStatus || "",
//         crop.trackingId,
//         crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
//         crop.tracking?.currentStageName || "Not Started",
//         crop.tracking?.stages?.length || 0,
//         crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
//         crop.tracking ? formatDate(crop.tracking.createdAt) : "N/A",
//         formatDate(crop.createdAt)
//       ]);
      
//       const csvContent = [
//         headers.join(","),
//         ...rows.map(row => 
//           row.map(cell => {
//             const cellStr = String(cell);
//             if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
//               return `"${cellStr.replace(/"/g, '""')}"`;
//             }
//             return cellStr;
//           }).join(",")
//         )
//       ].join("\n");
      
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute("href", url);
//       link.setAttribute("download", `crops_${new Date().toISOString().split("T")[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       showSnackbar("CSV exported successfully", "success");
//     } catch (error) {
//       console.error("Error exporting CSV:", error);
//       showSnackbar("Failed to export CSV", "error");
//     }
//   };

//   const exportExcel = () => {
//     if (crops.length === 0) {
//       showSnackbar("No data to export", "warning");
//       return;
//     }

//     try {
//       const data = crops.map((crop) => ({
//         "Farming Type": getFarmingTypeLabel(crop.farmingType),
//         "Seed Type": getSeedTypeLabel(crop.seedType),
//         "Acres": crop.acres,
//         "Sowing Date": formatDate(crop.sowingDate),
//         "Farmer Name": crop.farmer?.personalInfo?.name || "",
//         "Farmer Phone": crop.farmer?.personalInfo?.mobileNo || "",
//         "Farmer Email": crop.farmer?.personalInfo?.email || "",
//         "Farmer Address": crop.farmer?.personalInfo?.address || "",
//         "Farmer Village": crop.farmer?.personalInfo?.villageGramaPanchayat || "",
//         "Farmer Taluk": crop.farmer?.personalInfo?.taluk || "",
//         "Farmer District": crop.farmer?.personalInfo?.district || "",
//         "Farmer State": crop.farmer?.personalInfo?.state || "",
//         "Farmer Pincode": crop.farmer?.personalInfo?.pincode || "",
//         "Farmer ID": getFarmerDisplayId(crop),
//         "Registration Status": crop.farmer?.registrationStatus || "",
//         "Tracking ID": crop.trackingId,
//         "Progress": crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
//         "Current Stage": crop.tracking?.currentStageName || "N/A",
//         "Total Stages": crop.tracking?.stages?.length || 0,
//         "Stages Completed": crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
//         "Stages In Progress": crop.tracking?.stages?.filter(s => s.status === "in-progress").length || 0,
//         "Stages Pending": crop.tracking?.stages?.filter(s => s.status === "pending").length || 0,
//         "Tracking Created": crop.tracking ? formatDate(crop.tracking.createdAt) : "N/A",
//         "Created Date": formatDate(crop.createdAt),
//       }));

//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Crops");
//       XLSX.writeFile(
//         wb,
//         `crops_${new Date().toISOString().split("T")[0]}.xlsx`
//       );
//       showSnackbar("Excel exported successfully", "success");
//     } catch (error) {
//       console.error("Error exporting Excel:", error);
//       showSnackbar("Failed to export Excel", "error");
//     }
//   };

//   const exportPDF = () => {
//   if (crops.length === 0) {
//     showSnackbar("No data to export", "warning");
//     return;
//   }

//   try {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("Crops Management Report", 14, 22);
//     doc.setFontSize(11);
//     doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
//     doc.text(`Total Crops: ${totalItems}`, 14, 37);

//     const tableColumn = [
//       "Farming Type",
//       "Seed Type",
//       "Acres",
//       "Sowing Date",
//       "Farmer Name",
//       "Farmer Phone",
//       "Tracking ID",
//       "Progress",
//       "Current Stage",
//     ];
//     const tableRows = crops.map((crop) => [
//       getFarmingTypeLabel(crop.farmingType),
//       getSeedTypeLabel(crop.seedType),
//       crop.acres.toString(),
//       formatDate(crop.sowingDate),
//       getFarmerName(crop).substring(0, 15) + (getFarmerName(crop).length > 15 ? "..." : ""),
//       getFarmerContact(crop).substring(0, 15),
//       formatTrackingId(crop.trackingId || ""),
//       crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
//       // Fix: Add proper null checking with default empty string
//       (crop.tracking?.currentStageName || "").substring(0, 15) + 
//       ((crop.tracking?.currentStageName || "").length > 15 ? "..." : "") || "N/A",
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 45,
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });

//     doc.save(`crops_${new Date().toISOString().split("T")[0]}.pdf`);
//     showSnackbar("PDF exported successfully", "success");
//   } catch (error) {
//     console.error("Error exporting PDF:", error);
//     showSnackbar("Failed to export PDF", "error");
//   }
// };

//   const printTable = () => {
//     const printContent = tableRef.current?.innerHTML;
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Crops Management Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f8fafc; font-weight: 600; }
//             .type-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; display: inline-block; }
//             .tracking-info { font-size: 11px; margin-top: 4px; }
//             .stage-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
//             .completed { background-color: #10B981; }
//             .in-progress { background-color: #3B82F6; }
//             .pending { background-color: #9CA3AF; }
//             .skipped { background-color: #F59E0B; }
//             .stage-item { margin: 2px 0; padding: 4px; border-radius: 4px; }
//             .stage-current { background-color: #DBEAFE; }
//             @media print {
//               body { margin: 0; }
//               .no-print { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <h1>Crops Management Report</h1>
//           <p>Generated: ${new Date().toLocaleDateString()}</p>
//           ${printContent}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//     showSnackbar("Print dialog opened", "info");
//   };

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedIds(crops.map((c) => c._id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedIds([...selectedIds, id]);
//     } else {
//       setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
//     }
//   };

//   /* ================= HANDLE FORM SUBMIT ================= */

//   const handleFormSubmit = (data: any) => {
//     if (editingCrop) {
//       handleUpdateCrop(data);
//     } else {
//       handleCreateCrop(data);
//     }
//   };

//   const handleEditClick = (crop: Crop) => {
//     setEditingCrop(crop);
//     setFormModalOpen(true);
//     setModal({ type: null });
//   };

//   const handleFormClose = () => {
//     setFormModalOpen(false);
//     setEditingCrop(null);
//   };

//   const handleClearFilters = () => {
//     setFilterFarmingType("all");
//     setFilterSeedType("all");
//     setSearchTerm("");
//   };

//   const handleViewTracking = (crop: Crop) => {
//     if (crop.tracking) {
//       setTrackingData(crop.tracking);
//       setModal({ type: "tracking" });
//     } else if (crop.trackingId) {
//       fetchTrackingData(crop.trackingId);
//     } else {
//       showSnackbar("No tracking data available for this crop", "warning");
//     }
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
//       {loading && crops.length === 0 && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
//           <div className="flex items-center gap-3">
//             <div>
//               <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900">
//                 Crop Management
//               </h1>
//               <p className="text-xs sm:text-xs md:text-base text-gray-600 mt-1">
//                 Track and manage all crop records
//               </p>
//             </div>
//           </div>
//           {/* <button
//             onClick={() => setFormModalOpen(true)}
//             className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
//           >
//             <FaChartLine className="w-5 h-5" />
//             <span className="hidden sm:inline">Add New Crop</span>
//             <span className="sm:hidden">Add Crop</span>
//           </button> */}
//         </div>

//         {/* Stats Indicators */}
//         <div className="flex flex-wrap gap-2 sm:gap-3">
//           {farmingTypes.map((type) => (
//             <div
//               key={type}
//               className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-zinc-300 shadow-xs"
//             >
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   type === "organic" ? "bg-green-500" :
//                   type === "natural" ? "bg-blue-500" :
//                   type === "hydroponic" ? "bg-purple-500" :
//                   type === "inorganic" ? "bg-yellow-500" : "bg-gray-500"
//                 }`}
//               />
//               <span className="text-xs font-medium text-gray-700">
//                 {getFarmingTypeLabel(type)}
//               </span>
//               <span className="text-xs font-bold text-gray-900">
//                 ({crops.filter((d) => d.farmingType === type).length})
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Crop Form Modal */}
//       <CropFormModal
//         open={formModalOpen}
//         onClose={handleFormClose}
//         onSubmit={handleFormSubmit}
//         loading={formModalLoading}
//         initialData={editingCrop}
//         isEdit={!!editingCrop}
//       />

//       {/* Tracking Modal */}
//       <TrackingModal
//         open={modal.type === "tracking"}
//         onClose={() => setModal({ type: null })}
//         trackingData={trackingData}
//         loading={trackingLoading}
//       />

//       {/* Main Card */}
//       <div className="rounded-lg shadow-sm overflow-hidden bg-white">
//         {/* Toolbar */}
//         <div className="p-2 sm:p-3">
//           <div className="flex flex-col gap-3">
//             {/* Search */}
//             <div className="relative flex lg:flex-row flex-col gap-x-3 gap-y-3">
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search by farming type, seed type, farmer name, phone, email, location, tracking ID..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full lg:w-[40vw] pl-10 pr-4 py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//                 />
//               </div>
//               <div className="flex items-center justify-between">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="lg:flex hidden items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <FaFilter className="w-4 h-4 text-gray-600" />
//                   <span className="text-xs font-medium hidden sm:inline">
//                     Filters
//                   </span>
//                 </button>
//               </div>

//               {/* Toolbar Buttons Row */}
//               <div className="flex lg:ml-auto items-center gap-1 sm:gap-2">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="flex lg:hidden items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <FaFilter className="w-4 h-4 text-gray-600" />
//                     <span className="text-xs font-medium hidden sm:inline">
//                       Filters
//                     </span>
//                   </button>

//                   {selectedIds.length > 0 && (
//                     <button
//                       onClick={() =>
//                         setModal({ type: "bulkDelete", selectedIds })
//                       }
//                       className="flex items-center gap-2 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
//                     >
//                       <FaTrash className="w-4 h-4" />
//                       Delete Selected ({selectedIds.length})
//                     </button>
//                   )}
//                 </div>
//                 <button
//                   onClick={copyData}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                   title="Copy Data"
//                 >
//                   <FaCopy className="w-4 h-4 text-gray-600" />
//                 </button>
//                 <button
//                   onClick={exportCSV}
//                   className="p-2 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors"
//                   title="Export CSV"
//                 >
//                   <FaFileCsv className="w-4 h-4 text-teal-600" />
//                 </button>
//                 <button
//                   onClick={exportExcel}
//                   className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
//                   title="Export Excel"
//                 >
//                   <FaFileExcel className="w-4 h-4 text-green-600" />
//                 </button>
//                 <button
//                   onClick={exportPDF}
//                   className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//                   title="Export PDF"
//                 >
//                   <FaFilePdf className="w-4 h-4 text-red-600" />
//                 </button>
//                 <button
//                   onClick={printTable}
//                   className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
//                   title="Print"
//                 >
//                   <FaPrint className="w-4 h-4 text-blue-600" />
//                 </button>
//               </div>
//             </div>

//             {/* Filters Panel */}
//             {showFilters && (
//               <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-xs sm:text-xs font-medium text-gray-700 mb-2">
//                       Farming Type
//                     </label>
//                     <select
//                       value={filterFarmingType}
//                       onChange={(e) => setFilterFarmingType(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                     >
//                       <option value="all">All Farming Types</option>
//                       {farmingTypes.map((type) => (
//                         <option key={type} value={type}>
//                           {getFarmingTypeLabel(type)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs sm:text-xs font-medium text-gray-700 mb-2">
//                       Seed Type
//                     </label>
//                     <select
//                       value={filterSeedType}
//                       onChange={(e) => setFilterSeedType(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                     >
//                       <option value="all">All Seed Types</option>
//                       {seedTypes.map((type) => (
//                         <option key={type} value={type}>
//                           {getSeedTypeLabel(type)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="sm:col-span-2 lg:col-span-1 flex items-end">
//                     <button
//                       onClick={handleClearFilters}
//                       className="w-full px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
//                     >
//                       Clear Filters
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Table Section */}
//         <div ref={tableRef} className="w-full overflow-x-scroll">
//           {/* Desktop Table */}
//           <table className="min-w-full hidden bg-white lg:table">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase w-10">
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedIds.length === crops.length &&
//                       crops.length > 0
//                     }
//                     onChange={(e) => handleSelectAll(e.target.checked)}
//                     className="rounded border-gray-300"
//                   />
//                 </th>
//                 {[
//                   "Farming Type",
//                   "Seed Type",
//                   "Acres",
//                   "Sowing Date",
//                   "Farmer Info",
//                   "Tracking Info",
//                   "Progress",
//                   "All Stages",
//                   "Created",
//                   "Actions",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="px-2 py-3 min-w-28 text-left text-[10px] font-semibold text-gray-700 uppercase border-b border-gray-200"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {crops.map((row) => (
//                 <tr key={row._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(row._id)}
//                       onChange={(e) => handleSelectOne(row._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     />
//                   </td>
//                   <td className="px-3 py-2">
//                     <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
//                       {getFarmingTypeLabel(row.farmingType)}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2">
//                     <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
//                       {getSeedTypeLabel(row.seedType)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-xs font-bold text-gray-900">
//                     {row.acres}
//                   </td>
//                   <td className="px-2 w-32 py-2">
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="w-4 h-4 text-gray-400" />
//                       <span className="text-xs text-gray-700">
//                         {formatDate(row.sowingDate)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2 min-w-[200px]">
//                     {row.farmer ? (
//                       <FarmerInfoDisplay farmer={row.farmer} />
//                     ) : (
//                       <div className="text-xs text-gray-500 italic">
//                         No farmer data
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">
//                     {row.tracking ? (
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <FaChartLine className="w-3 h-3 text-purple-500" />
//                           <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
//                             {row.tracking.name}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           ID: {formatTrackingId(row.tracking._id)}
//                         </div>
//                         <div className="flex items-center gap-1 text-xs">
//                           <span className="text-gray-600">Created:</span>
//                           <span className="text-gray-900">
//                             {formatDate(row.tracking.createdAt)}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs">
//                           <span className="text-gray-600">Status:</span>
//                           <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
//                             row.tracking.isCompleted ? "bg-green-100 text-green-800" :
//                             "bg-blue-100 text-blue-800"
//                           }`}>
//                             {row.tracking.isCompleted ? "Completed" : "Active"}
//                           </span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-xs text-gray-500 italic">
//                         No tracking data
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 bg-gray-200 rounded-full h-2">
//                           <div 
//                             className="bg-green-500 h-2 rounded-full" 
//                             style={{ width: `${row.tracking?.progress || 0}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-xs font-bold text-gray-900">
//                           {row.tracking?.progress || 0}%
//                         </span>
//                       </div>
//                       {row.tracking?.currentStageName && (
//                         <div className="text-xs text-gray-500">
//                           Current: {row.tracking.currentStageName}
//                         </div>
//                       )}
//                       <div className="flex items-center gap-2 text-xs">
//                         <span className="text-gray-600">Stages:</span>
//                         <span className="font-semibold">
//                           {row.tracking?.currentStageIndex !== undefined ? row.tracking.currentStageIndex + 1 : 0}/{row.tracking?.stages?.length || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2 min-w-[250px]">
//                     {row.tracking?.stages ? (
//                       <StagesDisplay 
//                         stages={row.tracking.stages} 
//                         currentStageIndex={row.tracking.currentStageIndex} 
//                       />
//                     ) : (
//                       <div className="text-xs text-gray-500 italic">No stages data</div>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="text-xs text-gray-500">
//                       {formatDate(row.createdAt)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center gap-2">
//                       {/* <button
//                         onClick={() => handleViewTracking(row)}
//                         className="p-2 rounded-lg text-purple-700 hover:bg-purple-200 transition-colors"
//                         title="View Tracking Details"
//                       >
//                         <FaChartLine className="w-4 h-4" />
//                       </button> */}
//                       <button
//                         onClick={() => handleEditClick(row)}
//                         className="p-2 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors"
//                         title="Edit Crop"
//                       >
//                         <FaEdit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setModal({ type: "delete", row })}
//                         className="p-2 rounded-lg text-red-700 hover:bg-red-200 transition-colors"
//                         title="Delete Crop"
//                       >
//                         <FaTrash className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-3 mt-2 p-4">
//             {crops.map((row) => (
//               <div
//                 key={row._id}
//                 className="bg-white border border-gray-200 rounded shadow p-4"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(row._id)}
//                       onChange={(e) => handleSelectOne(row._id, e.target.checked)}
//                       className="rounded border-gray-300 -mt-12 -ml-2"
//                     />
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
//                           {getFarmingTypeLabel(row.farmingType)}
//                         </span>
//                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
//                           {getSeedTypeLabel(row.seedType)}
//                         </span>
//                       </div>
//                       <div className="text-xs text-gray-500 mb-1">
//                         <span className="text-xs ml-2 mr-2">Sowing Date</span>
//                         <FaCalendarAlt className="inline w-3 h-3 mr-1" />
//                         {formatDate(row.sowingDate)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-1">
//                     {/* <button
//                       onClick={() => handleViewTracking(row)}
//                       className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200"
//                       title="View Tracking Details"
//                     >
//                       <FaChartLine className="w-3.5 h-3.5" />
//                     </button> */}
//                     <button
//                       onClick={() => handleEditClick(row)}
//                       className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-200"
//                       title="Edit Crop"
//                     >
//                       <FaEdit className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                       onClick={() => setModal({ type: "delete", row })}
//                       className="p-1.5 rounded-lg text-red-700 hover:bg-red-200"
//                       title="Delete Crop"
//                     >
//                       <FaTrash className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Basic Info */}
//                 <div className="grid ml-4 grid-cols-2 gap-3 text-xs">
//                   <div>
//                     <span className="font-medium">Acres:</span>
//                     <span className="ml-2 font-bold text-gray-900">
//                       {row.acres}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Progress:</span>
//                     <span className="ml-2 font-bold text-gray-900">
//                       {row.tracking?.progress || 0}%
//                     </span>
//                   </div>
                  
//                   {/* Farmer Info */}
//                   {row.farmer && (
//                     <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
//                       <div className="font-medium text-gray-700 mb-2">Farmer Information:</div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Name:</span>
//                           <span className="font-medium">{row.farmer.personalInfo.name}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Phone:</span>
//                           <span className="font-medium">{row.farmer.personalInfo.mobileNo}</span>
//                         </div>
//                         {row.farmer.personalInfo.email && (
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Email:</span>
//                             <span className="font-medium truncate max-w-[150px]">{row.farmer.personalInfo.email}</span>
//                           </div>
//                         )}
//                         {row.farmer.personalInfo.address && (
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Address:</span>
//                             <span className="font-medium truncate max-w-[150px]">{row.farmer.personalInfo.address}</span>
//                           </div>
//                         )}
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Location:</span>
//                           <span className="font-medium">
//                             {row.farmer.personalInfo.villageGramaPanchayat}, {row.farmer.personalInfo.district}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Status:</span>
//                           <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
//                             row.farmer.registrationStatus === "approved" ? "bg-green-100 text-green-800" :
//                             row.farmer.registrationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
//                             "bg-gray-100 text-gray-800"
//                           }`}>
//                             {row.farmer.registrationStatus}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Tracking Info */}
//                   {row.tracking && (
//                     <>
//                       <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
//                         <div className="font-medium text-gray-700 mb-2">Tracking Information:</div>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Name:</span>
//                             <span className="font-medium truncate max-w-[150px]">{row.tracking.name}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">ID:</span>
//                             <span className="font-medium">{formatTrackingId(row.tracking._id)}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Status:</span>
//                             <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
//                               row.tracking.isCompleted ? "bg-green-100 text-green-800" :
//                               "bg-blue-100 text-blue-800"
//                             }`}>
//                               {row.tracking.isCompleted ? "Completed" : "Active"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Current Stage:</span>
//                             <span className="font-medium text-green-600">
//                               {row.tracking.currentStageName || 
//                                row.tracking.stages[row.tracking.currentStageIndex]?.name || 
//                                "Not Started"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Created:</span>
//                             <span className="font-medium">{formatDate(row.tracking.createdAt)}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Stages Display */}
//                       <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
//                         <StagesDisplay 
//                           stages={row.tracking.stages} 
//                           currentStageIndex={row.tracking.currentStageIndex} 
//                         />
//                       </div>
//                     </>
//                   )}
                  
//                   <div className="col-span-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
//                     Created: {formatDate(row.createdAt)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {!loading && crops.length === 0 && (
//             <div className="text-center py-12 px-4">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//                 <FaSearch className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 No crop records found
//               </h3>
//               <p className="text-gray-600 max-w-md mx-auto text-xs">
//                 Try adjusting your search or filters to find what you're looking for.
//               </p>
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && crops.length > 0 && (
//             <div className="flex justify-center py-4">
//               <CircularProgress size={24} />
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="px-4 py-2 border-t border-gray-200 bg-white">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-xs sm:text-xs text-gray-600">
//               Showing{" "}
//               <span className="font-semibold text-gray-900">
//                 {Math.min((page - 1) * limit + 1, totalItems)}
//               </span>{" "}
//               to{" "}
//               <span className="font-semibold text-gray-900">
//                 {Math.min(page * limit, totalItems)}
//               </span>{" "}
//               of{" "}
//               <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
//               results
//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="p-1 ml-3 border border-zinc-300 rounded"
//               >
//                 {[2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map(
//                   (data, i) => (
//                     <option key={i} value={data}>
//                       {data}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             <Pagination
//               count={totalPages}
//               page={page}
//               onChange={(_, value) => setPage(value)}
//               color="primary"
//               showFirstButton
//               showLastButton
//               size="small"
//               shape="rounded"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {modal.type === "delete" && modal.row && (
//         <DeleteModal
//           row={modal.row}
//           onClose={() => setModal({ type: null })}
//           onDelete={() => handleDeleteCrop(modal.row!._id)}
//         />
//       )}

//       {/* Bulk Delete Modal */}
//       {modal.type === "bulkDelete" && modal.selectedIds && (
//         <BulkDeleteModal
//           count={modal.selectedIds.length}
//           onClose={() => setModal({ type: null })}
//           onDelete={handleBulkDelete}
//         />
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// /* ================= MODAL COMPONENTS ================= */

// const DeleteModal = ({ row, onClose, onDelete }: any) => (
//   <Modal open onClose={onClose}>
//     <Box sx={modalStyle}>
//       <div className="text-center">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
//           <FaTrash className="w-8 h-8 text-red-600" />
//         </div>
//         <Typography variant="h6" className="mb-2 text-gray-900">
//           Delete Crop Record
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           Are you sure you want to delete the crop record for{" "}
//           <span className="font-bold text-gray-900">
//             {row.farmer?.personalInfo?.name || row.farmerId}
//           </span>?
//           <br />
//           This action cannot be undone.
//         </Typography>
//         <div className="flex justify-center gap-3">
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={onDelete} variant="contained" color="error">
//             Delete
//           </Button>
//         </div>
//       </div>
//     </Box>
//   </Modal>
// );

// const BulkDeleteModal = ({ count, onClose, onDelete }: any) => (
//   <Modal open onClose={onClose}>
//     <Box sx={modalStyle}>
//       <div className="text-center">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
//           <FaTrash className="w-8 h-8 text-red-600" />
//         </div>
//         <Typography variant="h6" className="mb-2 text-gray-900">
//           Delete {count} Crop Records
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           Are you sure you want to delete {count} selected crop records?
//           <br />
//           This action cannot be undone.
//         </Typography>
//         <div className="flex justify-center gap-3">
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={onDelete} variant="contained" color="error">
//             Delete {count} Records
//           </Button>
//         </div>
//       </div>
//     </Box>
//   </Modal>
// );



















"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaTimes,
  FaSpinner,
  FaChartLine,
  FaLeaf,
  FaInfoCircle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowRight,
  FaCamera,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Pagination,
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Tooltip,
  Collapse,
} from "@mui/material";
import { getAdminSessionAction } from "@/app/actions/auth-actions";
import { AiOutlineClose } from "react-icons/ai";

/* ================= TYPES ================= */

interface Stage {
  name: string;
  status: "pending" | "in-progress" | "completed" | "skipped";
  photos: string[];
  _id: string;
  completedAt?: string;
}

interface TrackingData {
  _id: string;
  name: string;
  cropName: string;
  farmerId: string;
  cropId: string;
  stages: Stage[];
  currentStageIndex: number;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  progress?: number;
  isCompleted?: boolean;
  currentStageName?: string;
}

interface FarmerPersonalInfo {
  name: string;
  mobileNo: string;
  email?: string;
  address?: string;
  villageGramaPanchayat?: string;
  pincode?: string;
  state?: string;
  district?: string;
  taluk?: string;
  post?: string;
}

interface Farmer {
  _id: string;
  farmerId?: string;
  traderId?: string;
  personalInfo: FarmerPersonalInfo;
  role: string;
  registrationStatus: string;
  isActive: boolean;
  commodities?: string[];
  subcategories?: string[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
  trackingId?: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  tracking?: TrackingData | null;
  farmer?: Farmer | null;
}

/* ================= TRACKING MODAL ================= */

interface TrackingModalProps {
  open: boolean;
  onClose: () => void;
  trackingData: TrackingData | null;
  loading?: boolean;
}

const TrackingModal: React.FC<TrackingModalProps> = ({
  open,
  onClose,
  trackingData,
  loading = false,
}) => {
  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "skipped":
        return "bg-yellow-500";
      case "pending":
      default:
        return "bg-gray-300";
    }
  };

  const getStageStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "skipped":
        return "Skipped";
      case "pending":
      default:
        return "Pending";
    }
  };

  const calculateProgress = () => {
    if (!trackingData?.stages?.length) return 0;
    const completedStages = trackingData.stages.filter(
      (stage) => stage.status === "completed"
    ).length;
    return Math.round((completedStages / trackingData.stages.length) * 100);
  };

  const formatDateString = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "85%", md: 700 },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress />
          </div>
        ) : trackingData ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaChartLine className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <Typography variant="h6" className="text-gray-900 font-bold">
                    {trackingData.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Tracking ID: {trackingData._id}
                  </Typography>
                </div>
              </div>
              <IconButton onClick={onClose} size="small">
                <FaTimes />
              </IconButton>
            </div>

            {/* Progress Overview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="subtitle1" className="font-semibold">
                  Overall Progress
                </Typography>
                <Typography variant="h6" className="font-bold text-green-600">
                  {trackingData.progress || calculateProgress()}%
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={trackingData.progress || calculateProgress()}
                className="h-2 rounded-full mb-2"
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#10B981",
                  },
                }}
              />
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 mt-2 gap-2">
                <span>
                  Current Stage:{" "}
                  <span className="font-semibold">
                    {trackingData.currentStageName || 
                     trackingData.stages[trackingData.currentStageIndex]?.name ||
                     "Not Started"}
                  </span>
                </span>
                <span>
                  {trackingData.stages.filter((s) => s.status === "completed")
                    .length}{" "}
                  of {trackingData.stages.length} stages completed
                </span>
              </div>
            </div>

            {/* Crop Information */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <Typography
                  variant="subtitle2"
                  className="text-gray-500 mb-3 font-semibold"
                >
                  CROP INFORMATION
                </Typography>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crop Name:</span>
                    <span className="text-sm font-semibold">
                      {trackingData.cropName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Farmer ID:</span>
                    <span className="text-sm font-semibold">
                      {trackingData.farmerId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crop ID:</span>
                    <span className="text-sm font-semibold">
                      {trackingData.cropId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tracking Created:</span>
                    <span className="text-sm" title={formatDateTime(trackingData.createdAt)}>
                      {formatDateString(trackingData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <Typography
                  variant="subtitle2"
                  className="text-gray-500 mb-3 font-semibold"
                >
                  STAGE STATUS
                </Typography>
                <div className="flex flex-wrap gap-3 mb-4">
                  {["pending", "in-progress", "completed", "skipped"].map(
                    (status) => {
                      const count = trackingData.stages.filter(
                        (s) => s.status === status
                      ).length;
                      return (
                        <div key={status} className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStageStatusColor(
                              status
                            )}`}
                          />
                          <span className="text-xs text-gray-600">
                            {getStageStatusText(status)}: {count}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
                <div>
                  <Typography
                    variant="caption"
                    className="text-gray-500 block mb-2 font-medium"
                  >
                    Current Stage:
                  </Typography>
                  <Chip
                    label={
                      trackingData.currentStageName ||
                      trackingData.stages[trackingData.currentStageIndex]
                        ?.name || "Not Started"
                    }
                    color="primary"
                    size="small"
                    icon={<FaLeaf className="w-3 h-3" />}
                    className="bg-green-100 text-green-800"
                  />
                </div>
              </div>
            </div>

            {/* Stages Timeline */}
            <Typography
              variant="subtitle1"
              className="font-semibold mb-4 text-gray-900"
            >
              Growth Stages
            </Typography>
            <div className="space-y-3">
              {trackingData.stages.map((stage, index) => (
                <div
                  key={stage._id}
                  className={`border rounded-lg shadow-sm p-4 ${
                    index === trackingData.currentStageIndex
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index <= trackingData.currentStageIndex
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index === trackingData.currentStageIndex && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div>
                        <Typography
                          variant="subtitle2"
                          className={`font-medium ${
                            index === trackingData.currentStageIndex
                              ? "text-green-700"
                              : "text-gray-900"
                          }`}
                        >
                          {stage.name}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {stage.photos?.length || 0} photos
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip
                        label={getStageStatusText(stage.status)}
                        size="small"
                        className={`${
                          stage.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : stage.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : stage.status === "skipped"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      />
                      {index === trackingData.currentStageIndex && (
                        <Chip
                          label="Current"
                          color="primary"
                          size="small"
                          variant="outlined"
                          className="border-green-500 text-green-600"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={onClose}
                variant="contained"
                className="bg-gradient-to-r from-green-600 to-emerald-600"
                startIcon={<FaTimes />}
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FaInfoCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-900 mb-2">
              No Tracking Data Available
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-6">
              Tracking information could not be loaded.
            </Typography>
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
};

/* ================= CROP FORM MODAL ================= */

interface CropFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CropFormData) => void;
  loading?: boolean;
  initialData?: Crop | null;
  isEdit?: boolean;
}

interface CropFormData {
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
}

const CropFormModal: React.FC<CropFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<CropFormData>({
    farmingType: "organic",
    seedType: "gmo",
    acres: 0,
    sowingDate: new Date().toISOString().split('T')[0],
    farmerId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        farmingType: initialData.farmingType || "organic",
        seedType: initialData.seedType || "gmo",
        acres: initialData.acres || 0,
        sowingDate: initialData.sowingDate ? new Date(initialData.sowingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        farmerId: initialData.farmerId || "",
      });
    } else {
      setFormData({
        farmingType: "organic",
        seedType: "gmo",
        acres: 0,
        sowingDate: new Date().toISOString().split('T')[0],
        farmerId: "",
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmingType) {
      newErrors.farmingType = "Farming type is required";
    }

    if (!formData.seedType) {
      newErrors.seedType = "Seed type is required";
    }

    if (formData.acres <= 0) {
      newErrors.acres = "Acres must be greater than 0";
    }

    if (!formData.sowingDate) {
      newErrors.sowingDate = "Sowing date is required";
    }

    if (!formData.farmerId.trim()) {
      newErrors.farmerId = "Farmer ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CropFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'acres' ? Number(value) || 0 : value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartLine className="w-5 h-5" />
            <span className="text-lg font-semibold">
              {isEdit ? "Edit Crop Record" : "Add New Crop Posting"}
            </span>
          </div>
          <IconButton onClick={onClose} size="small" className="text-white">
            <FaTimes />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Farming Type *
              </label>
              <select
                value={formData.farmingType}
                onChange={(e) => handleInputChange("farmingType", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white ${
                  errors.farmingType ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="organic">Organic</option>
                <option value="natural">Natural</option>
                <option value="hydroponic">Hydroponic</option>
                <option value="regular">Regular</option>
              </select>
              {errors.farmingType && (
                <p className="mt-1 text-xs text-red-600">{errors.farmingType}</p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seed Type *
              </label>
              <select
                value={formData.seedType}
                onChange={(e) => handleInputChange("seedType", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white ${
                  errors.seedType ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="gmo">GMO</option>
                <option value="hybrid">Hybrid</option>
                <option value="heirloom">Heirloom</option>
                <option value="naati">Naati</option>
              </select>
              {errors.seedType && (
                <p className="mt-1 text-xs text-red-600">{errors.seedType}</p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Acres *
              </label>
              <input
                type="number"
                value={formData.acres}
                onChange={(e) => handleInputChange("acres", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.acres ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter acres"
                min="0"
                step="0.01"
                required
              />
              {errors.acres && (
                <p className="mt-1 text-xs text-red-600">{errors.acres}</p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sowing Date *
              </label>
              <input
                type="date"
                value={formData.sowingDate}
                onChange={(e) => handleInputChange("sowingDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.sowingDate ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.sowingDate && (
                <p className="mt-1 text-xs text-red-600">{errors.sowingDate}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Farmer ID *
              </label>
              <input
                type="text"
                value={formData.farmerId}
                disabled
                onChange={(e) => handleInputChange("farmerId", e.target.value)}
                className={`w-full px-3 bg-gray-50 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.farmerId ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter farmer ID"
                required
              />
              {errors.farmerId && (
                <p className="mt-1 text-xs text-red-600">{errors.farmerId}</p>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t">
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {loading ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Crop"
          ) : (
            "Create Crop"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "85%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
};

/* ================= STAGES DISPLAY COMPONENT ================= */

const StagesDisplay: React.FC<{ stages: Stage[]; currentStageIndex: number }> = ({ stages, currentStageIndex }) => {
  const [expanded, setExpanded] = useState(false);

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "skipped": return "bg-yellow-500";
      case "pending": default: return "bg-gray-300";
    }
  };

  const getStageStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in-progress": return "In Progress";
      case "skipped": return "Skipped";
      case "pending": default: return "Pending";
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <FaCheckCircle className="w-3 h-3 text-green-500" />;
      case "in-progress": return <FaClock className="w-3 h-3 text-blue-500" />;
      case "skipped": return <FaExclamationTriangle className="w-3 h-3 text-yellow-500" />;
      case "pending": default: return <FaClock className="w-3 h-3 text-gray-400" />;
    }
  };

  // Desktop view - compact
  const DesktopStagesView = () => (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <FaList className="w-3 h-3 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">Stages ({stages.length})</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {expanded ? (
            <>
              <FaChevronUp className="w-3 h-3" />
              Hide Details
            </>
          ) : (
            <>
              <FaChevronDown className="w-3 h-3" />
              Show Details
            </>
          )}
        </button>
      </div>
      
      {/* Compact stages view */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stages.map((stage, index) => (
          <Tooltip key={stage._id} title={`${stage.name}: ${getStageStatusText(stage.status)}`} arrow>
            <div className={`relative flex flex-col items-center min-w-[50px] px-1 py-1 rounded ${
              index === currentStageIndex ? "bg-blue-50 border border-blue-200" : ""
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStageIndex ? "bg-green-100" :
                index === currentStageIndex ? "bg-blue-100" :
                "bg-gray-100"
              }`}>
                <span className={`text-xs font-bold ${
                  index < currentStageIndex ? "text-green-600" :
                  index === currentStageIndex ? "text-blue-600" :
                  "text-gray-400"
                }`}>
                  {index + 1}
                </span>
                {/* {stage.status === "completed" && (
                  <FaCheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
                )} */}
              </div>
              <div className="mt-1">
                {getStageStatusIcon(stage.status)}
              </div>
              <div className="text-xs mt-1 text-center font-medium truncate max-w-[50px]">
                {stage.name.split(' ')[0]}
              </div>
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Expanded stages details */}
      <Collapse in={expanded}>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {stages.map((stage, index) => (
              <div 
                key={stage._id} 
                className={`p-2 rounded text-xs ${
                  index === currentStageIndex ? "bg-blue-50 border-l-4 border-blue-500" :
                  "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStageStatusColor(stage.status)}`} />
                    <span className="font-semibold">{index + 1}. {stage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      label={getStageStatusText(stage.status)}
                      size="small"
                      className={`text-xs ${
                        stage.status === "completed" ? "bg-green-100 text-green-800" :
                        stage.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                        stage.status === "skipped" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}
                    />
                    {index === currentStageIndex && (
                      <Chip
                        label="Current"
                        size="small"
                        className="bg-blue-100 text-blue-800 text-xs"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-gray-600">
                  <FaCamera className="w-3 h-3" />
                  <span>{stage.photos?.length || 0} photos</span>
                </div>
                {stage.completedAt && (
                  <div className="mt-1 text-gray-500 text-xs">
                    Completed: {new Date(stage.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );

  // Mobile view - detailed
  const MobileStagesView = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaList className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">All Stages ({stages.length})</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      {/* Stages progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${(stages.filter(s => s.status === "completed").length / stages.length) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs font-bold">
          {stages.filter(s => s.status === "completed").length}/{stages.length}
        </span>
      </div>

      {/* Stages visualization */}
      <div className="flex items-center gap-1 overflow-x-auto py-2">
        {stages.map((stage, index) => (
          <div 
            key={stage._id} 
            className={`flex flex-col items-center min-w-[60px] p-2 rounded ${
              index === currentStageIndex ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
            }`}
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStageIndex ? "bg-green-100" :
                index === currentStageIndex ? "bg-blue-100" :
                "bg-gray-100"
              }`}>
                <span className={`text-sm font-bold ${
                  index < currentStageIndex ? "text-green-600" :
                  index === currentStageIndex ? "text-blue-600" :
                  "text-gray-400"
                }`}>
                  {index + 1}
                </span>
                {stage.status === "completed" && (
                  <FaCheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="mt-1">
              {getStageStatusIcon(stage.status)}
            </div>
            <div className="text-xs mt-1 text-center font-medium truncate max-w-[60px]">
              {stage.name}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="space-y-2 mt-2 pt-2 border-t border-gray-200">
          {stages.map((stage, index) => (
            <div 
              key={stage._id} 
              className={`p-3 rounded ${
                index === currentStageIndex ? "bg-blue-50 border-l-4 border-blue-500" :
                "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStageStatusColor(stage.status)}`} />
                  <div>
                    <div className="font-semibold text-sm">{index + 1}. {stage.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                        stage.status === "completed" ? "bg-green-100 text-green-800" :
                        stage.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                        stage.status === "skipped" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {getStageStatusText(stage.status)}
                      </div>
                      {index === currentStageIndex && (
                        <div className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Current
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <FaCamera className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Photos:</span>
                  <span className="font-semibold">{stage.photos?.length || 0}</span>
                </div>
                {stage.completedAt && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold">
                      {new Date(stage.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <DesktopStagesView />
      </div>
      <div className="lg:hidden">
        <MobileStagesView />
      </div>
    </>
  );
};

/* ================= FARMER INFO COMPONENT ================= */

const FarmerInfoDisplay: React.FC<{ farmer: Farmer }> = ({ farmer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div  onClick={() => setExpanded(!expanded)} className="space-y-1 cursor-pointer">
      <div  onClick={() => setExpanded(!expanded)} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUser className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">Farmer Info</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {expanded ? (
            <>
              <FaChevronUp className="w-3 h-3" />
             
            </>
          ) : (
            <>
              <FaChevronDown className="w-3 h-3" />
             
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <FaUser className="w-3 h-3 text-gray-400" />
          <span className="font-medium text-gray-900">{farmer.personalInfo.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">{farmer.personalInfo.mobileNo}</span>
        </div>
        {farmer.personalInfo.email && (
          <div className="flex items-center gap-2">
            <FaEnvelope className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 truncate max-w-[150px]">{farmer.personalInfo.email}</span>
          </div>
        )}
        {(farmer.farmerId || farmer.traderId) && (
          <div className="flex items-center gap-2">
            <FaIdCard className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{farmer.farmerId || farmer.traderId}</span>
          </div>
        )}
      </div>

      <Collapse in={expanded}>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="space-y-1 text-xs">
            {farmer.personalInfo.address && (
              <div>
                <span className="text-gray-600">Address: </span>
                <span className="font-medium">{farmer.personalInfo.address}</span>
              </div>
            )}
            {farmer.personalInfo.villageGramaPanchayat && (
              <div>
                <span className="text-gray-600">Village: </span>
                <span className="font-medium">{farmer.personalInfo.villageGramaPanchayat}</span>
              </div>
            )}
            {(farmer.personalInfo.taluk || farmer.personalInfo.district) && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">
                  {farmer.personalInfo.taluk && `${farmer.personalInfo.taluk}, `}
                  {farmer.personalInfo.district && `${farmer.personalInfo.district}, `}
                  {farmer.personalInfo.state}
                </span>
              </div>
            )}
            {farmer.personalInfo.pincode && (
              <div>
                <span className="text-gray-600">Pincode: </span>
                <span className="font-medium">{farmer.personalInfo.pincode}</span>
              </div>
            )}
            <div className="mt-1">
              <span className="text-gray-600">Status: </span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                farmer.registrationStatus === "approved" ? "bg-green-100 text-green-800" :
                farmer.registrationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {farmer.registrationStatus}
              </span>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function CropManagementPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [allCrops, setAllCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFarmingType, setFilterFarmingType] = useState<string>("all");
  const [filterSeedType, setFilterSeedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  const [modal, setModal] = useState<{
    type: "view" | "edit" | "delete" | "bulkDelete" | "tracking" | null;
    row?: Crop;
    selectedIds?: string[];
  }>({ type: null });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  const[user,setUser]=useState<{
      taluka:string,
      role:string
    }>()
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Get unique farming types and seed types from all crops data
  const farmingTypes = [...new Set(allCrops.map(crop => crop.farmingType))];
  const seedTypes = [...new Set(allCrops.map(crop => crop.seedType))];

  /* ================= API FUNCTIONS ================= */

  const fetchCrops = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        search: searchTerm,
        page,
        limit: limit,
      };
      
      if (filterFarmingType !== "all") {
        params.farmingType = filterFarmingType;
      }
      
      if (filterSeedType !== "all") {
        params.seedType = filterSeedType;
      }
      // params.taluk="Tarikere"

       const session = await getAdminSessionAction();
            setUser(session?.admin)
            if(session?.admin?.role == "subadmin"){
             params.taluk= session?.admin.taluka;
            }

      const response = await axios.get(`/api/postings`, {
        params,
      });

      if (response.data.success) {
        const data = response.data.data || [];
        const total = response.data.total || 0;
        
        setCrops(data);
        setAllCrops(response.data.allData || []);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / limit) || 1);
      } else {
        showSnackbar("Failed to fetch crops", "error");
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
      showSnackbar("Error fetching crops", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingData = async (trackingId: string) => {
    try {
      setTrackingLoading(true);
      const response = await axios.get(`/api/tracking?id=${trackingId}`);
      
      if (response.data.success) {
        setTrackingData(response.data.data);
        setModal({ type: "tracking" });
      } else {
        showSnackbar("Failed to fetch tracking data", "error");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      showSnackbar("Error fetching tracking data", "error");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    try {
      const response = await axios.delete(`/api/postings/${id}`);

      if (response.data.success) {
        showSnackbar("Crop deleted successfully", "success");
        fetchCrops();
        setModal({ type: null });
      } else {
        showSnackbar("Failed to delete crop", "error");
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
      showSnackbar("Error deleting crop", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showSnackbar("No crops selected", "warning");
      return;
    }

    try {
      const deletePromises = selectedIds.map(id => 
        axios.delete(`/api/postings/${id}`)
      );
      const results = await Promise.allSettled(deletePromises);
      
      const successfulDeletes = results.filter(r => r.status === 'fulfilled').length;
      
      if (successfulDeletes > 0) {
        showSnackbar(`${successfulDeletes} crops deleted successfully`, "success");
        setSelectedIds([]);
        fetchCrops();
      } else {
        showSnackbar("Failed to delete crops", "error");
      }
      setModal({ type: null });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      showSnackbar("Error deleting crops", "error");
    }
  };

  const handleCreateCrop = async (data: any) => {
    try {
      setFormModalLoading(true);
      const response = await axios.post("/api/postings", data);

      if (response.data.success) {
        showSnackbar("Crop created successfully", "success");
        setFormModalOpen(false);
        fetchCrops();
      } else {
        showSnackbar("Failed to create crop", "error");
      }
    } catch (error: any) {
      console.error("Error creating crop:", error);
      showSnackbar(
        error.response?.data?.message || "Error creating crop",
        "error"
      );
    } finally {
      setFormModalLoading(false);
    }
  };

  const handleUpdateCrop = async (data: any) => {
    if (!editingCrop) return;

    try {
      setFormModalLoading(true);
      const response = await axios.put(`/api/postings/${editingCrop._id}`, data);

      if (response.data.success) {
        showSnackbar("Crop updated successfully", "success");
        setFormModalOpen(false);
        setEditingCrop(null);
        fetchCrops();
      } else {
        showSnackbar("Failed to update crop", "error");
      }
    } catch (error: any) {
      console.error("Error updating crop:", error);
      showSnackbar(
        error.response?.data?.message || "Error updating crop",
        "error"
      );
    } finally {
      setFormModalLoading(false);
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchCrops();
  }, [page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      fetchCrops();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterFarmingType, filterSeedType]);

  /* ================= UTILITY FUNCTIONS ================= */

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getFarmingTypeColor = (type: string) => {
    switch (type) {
      case "organic":
        return "bg-green-100 text-green-800";
      case "natural":
        return "bg-blue-100 text-blue-800";
      case "hydroponic":
        return "bg-purple-100 text-purple-800";
      case "inorganic":
        return "bg-yellow-100 text-yellow-800";
      case "regular":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeedTypeColor = (type: string) => {
    switch (type) {
      case "gmo":
        return "bg-red-100 text-red-800";
      case "hybrid":
        return "bg-orange-100 text-orange-800";
      case "heirloom":
        return "bg-teal-100 text-teal-800";
      case "naati":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getFarmingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      organic: "Organic",
      natural: "Natural",
      hydroponic: "Hydroponic",
      inorganic: "Inorganic",
      regular: "Regular"
    };
    return labels[type] || type;
  };

  const getSeedTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      gmo: "GMO",
      hybrid: "Hybrid",
      heirloom: "Heirloom",
      naati: "Naati"
    };
    return labels[type] || type;
  };

  const formatTrackingId = (trackingId: string) => {
    if (!trackingId) return "N/A";
    if (trackingId.length <= 8) return trackingId;
    return `...${trackingId.slice(-8)}`;
  };

  const getFarmerDisplayId = (crop: Crop) => {
    if (crop.farmer?.farmerId) return crop.farmer.farmerId;
    if (crop.farmer?.traderId) return crop.farmer.traderId;
    return crop.farmerId;
  };

  const getFarmerName = (crop: Crop) => {
    return crop.farmer?.personalInfo?.name || "Unknown";
  };

  const getFarmerContact = (crop: Crop) => {
    return crop.farmer?.personalInfo?.mobileNo || "N/A";
  };

  const getFarmerLocation = (crop: Crop) => {
    const farmer = crop.farmer;
    if (!farmer?.personalInfo) return "N/A";
    
    const loc = farmer.personalInfo;
    const parts = [];
    if (loc.villageGramaPanchayat) parts.push(loc.villageGramaPanchayat);
    if (loc.taluk) parts.push(loc.taluk);
    if (loc.district) parts.push(loc.district);
    if (loc.state) parts.push(loc.state);
    
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getFarmerEmail = (crop: Crop) => {
    return crop.farmer?.personalInfo?.email || "N/A";
  };

  const getFarmerAddress = (crop: Crop) => {
    return crop.farmer?.personalInfo?.address || "N/A";
  };

  const getFarmerRegistrationStatus = (crop: Crop) => {
    return crop.farmer?.registrationStatus || "N/A";
  };

  /* ================= EXPORT FUNCTIONS ================= */

  // const copyData = () => {
  //   if (crops.length === 0) {
  //     showSnackbar("No data to copy", "warning");
  //     return;
  //   }

  //   try {
  //     const headers = [
  //       "Farming Type", "Seed Type", "Acres", "Sowing Date", 
  //       "Farmer Name", "Farmer Phone", "Farmer Email", "Farmer Address",
  //       "Farmer ID", "Farmer Location", "Registration Status",
  //       "Tracking ID", "Progress", "Current Stage", "Total Stages",
  //       "Stages Completed", "Created Date"
  //     ];
      
  //     const rows = crops.map((crop) => [
  //       getFarmingTypeLabel(crop.farmingType) || "",
  //       getSeedTypeLabel(crop.seedType) || "",
  //       crop.acres?.toString() || "0",
  //       formatDate(crop.sowingDate) || "",
  //       getFarmerName(crop) || "",
  //       getFarmerContact(crop) || "",
  //       getFarmerEmail(crop) || "",
  //       getFarmerAddress(crop) || "",
  //       getFarmerDisplayId(crop) || "",
  //       getFarmerLocation(crop) || "",
  //       getFarmerRegistrationStatus(crop) || "",
  //       crop.trackingId || "",
  //       crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
  //       crop.tracking?.currentStageName || "Not Started",
  //       crop.tracking?.stages?.length || 0,
  //       crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
  //       formatDate(crop.createdAt) || ""
  //     ]);
      
  //     const columnWidths = headers.map((header, colIndex) => {
  //       const maxHeaderLength = header.length;
  //       const maxDataLength = rows.reduce((max, row) => {
  //         const cell = row[colIndex] || "";
  //         const cellLength = cell.toString().length;
  //         return Math.max(max, cellLength);
  //       }, 0);
  //       return Math.max(maxHeaderLength, maxDataLength, 10);
  //     });
      
  //     let tableString = "";
      
  //     tableString += headers.map((header, i) => 
  //       header.padEnd(columnWidths[i])
  //     ).join(" | ") + "\n";
      
  //     tableString += headers.map((_, i) => 
  //       "-".repeat(columnWidths[i])
  //     ).join("-+-") + "\n";
      
  //     rows.forEach(row => {
  //       tableString += row.map((cell, i) => {
  //         const cellStr = cell?.toString() || "";
  //         return cellStr.padEnd(columnWidths[i]);
  //       }).join(" | ") + "\n";
  //     });
      
  //     tableString += `\nTotal Crops: ${totalItems}\n`;
  //     tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
  //     navigator.clipboard.writeText(tableString);
  //     showSnackbar("Data copied in table format", "success");
  //   } catch (error) {
  //     console.error("Error copying data:", error);
  //     showSnackbar("Failed to copy data", "error");
  //   }
  // };

const copyData = () => {
  if (crops.length === 0) {
    showSnackbar("No data to copy", "warning");
    return;
  }

  try {
    // Only essential columns
    const headers = [
      "Farming", "Seed", "Acres", "Sowing", 
      "Farmer", "Phone", "ID", "Location",
      "Progress", "Stage", "Tracking ID"
    ];
    
    const rows = crops.map((crop) => [
      getFarmingTypeLabel(crop.farmingType)?.substring(0, 8) || "",
      getSeedTypeLabel(crop.seedType)?.substring(0, 8) || "",
      crop.acres?.toString() || "0",
      formatDate(crop.sowingDate)?.split(',')[0] || "", // Just date part
      getFarmerName(crop)?.substring(0, 12) || "",
      getFarmerContact(crop) || "",
      getFarmerDisplayId(crop) || "",
      getFarmerLocation(crop)?.split(',')[0]?.substring(0, 15) || "", // Just first part
      crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
      crop.tracking?.currentStageName?.substring(0, 12) || "Not Started",
      crop.trackingId?.substring(0, 8) + "..." || ""
    ]);
    
    const columnWidths = [10, 10, 8, 12, 14, 12, 10, 16, 10, 14, 15];
    
    let tableString = "";
    
    // Create compact table
    tableString += "┌" + columnWidths.map(w => "─".repeat(w)).join("┬") + "┐\n";
    tableString += "│" + headers.map((h, i) => ` ${h.padEnd(columnWidths[i] - 2)} `).join("│") + "│\n";
    tableString += "├" + columnWidths.map(w => "─".repeat(w)).join("┼") + "┤\n";
    
    rows.forEach((row, i) => {
      tableString += "│" + row.map((cell, j) => {
        const cellStr = cell?.toString() || "";
        return ` ${cellStr.padEnd(columnWidths[j] - 2)} `;
      }).join("│") + "│\n";
      
      if ((i + 1) % 5 === 0 && i < rows.length - 1) {
        tableString += "├" + columnWidths.map(w => "─".repeat(w)).join("┼") + "┤\n";
      }
    });
    
    tableString += "└" + columnWidths.map(w => "─".repeat(w)).join("┴") + "┘\n\n";
    
    // Full details for first few records
    if (crops.length > 0) {
      tableString += "DETAILED VIEW (First 3 records):\n";
      tableString += "════════════════════════════════════════════════════════════\n";
      
      crops.slice(0, 3).forEach((crop, index) => {
        tableString += `\nRECORD ${index + 1}:\n`;
        tableString += `  Farming Type: ${getFarmingTypeLabel(crop.farmingType)}\n`;
        tableString += `  Seed Type: ${getSeedTypeLabel(crop.seedType)}\n`;
        tableString += `  Acres: ${crop.acres}\n`;
        tableString += `  Sowing Date: ${formatDate(crop.sowingDate)}\n`;
        tableString += `  Farmer: ${getFarmerName(crop)} (${getFarmerDisplayId(crop)})\n`;
        tableString += `  Phone: ${getFarmerContact(crop)}\n`;
        tableString += `  Email: ${getFarmerEmail(crop)}\n`;
        tableString += `  Location: ${getFarmerLocation(crop)}\n`;
        tableString += `  Tracking ID: ${crop.trackingId}\n`;
        tableString += `  Progress: ${crop.tracking?.progress || 0}%\n`;
        tableString += `  Current Stage: ${crop.tracking?.currentStageName || "Not Started"}\n`;
        tableString += `  Stages: ${crop.tracking?.stages?.filter(s => s.status === "completed").length || 0}/${crop.tracking?.stages?.length || 0}\n`;
      });
    }
    
    tableString += `\nTotal Records: ${totalItems}\n`;
    tableString += `Generated: ${new Date().toLocaleString()}\n`;
    
    navigator.clipboard.writeText(tableString);
    showSnackbar("Data copied in compact table format", "success");
  } catch (error) {
    console.error("Error copying data:", error);
    showSnackbar("Failed to copy data", "error");
  }
};
 
  const exportCSV = () => {
    if (crops.length === 0) {
      showSnackbar("No data to export", "warning");
      return;
    }

    try {
      const headers = [
        "Farming Type", "Seed Type", "Acres", "Sowing Date", 
        "Farmer Name", "Farmer Phone", "Farmer Email", "Farmer Address",
        "Farmer Village", "Farmer Taluk", "Farmer District", "Farmer State",
        "Farmer Pincode", "Farmer ID", "Registration Status",
        "Tracking ID", "Progress", "Current Stage", "Total Stages",
        "Stages Completed", "Tracking Created", "Created Date"
      ];
      
      const rows = crops.map((crop) => [
        getFarmingTypeLabel(crop.farmingType),
        getSeedTypeLabel(crop.seedType),
        crop.acres,
        formatDate(crop.sowingDate),
        crop.farmer?.personalInfo?.name || "",
        crop.farmer?.personalInfo?.mobileNo || "",
        crop.farmer?.personalInfo?.email || "",
        crop.farmer?.personalInfo?.address || "",
        crop.farmer?.personalInfo?.villageGramaPanchayat || "",
        crop.farmer?.personalInfo?.taluk || "",
        crop.farmer?.personalInfo?.district || "",
        crop.farmer?.personalInfo?.state || "",
        crop.farmer?.personalInfo?.pincode || "",
        getFarmerDisplayId(crop),
        crop.farmer?.registrationStatus || "",
        crop.trackingId,
        crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
        crop.tracking?.currentStageName || "Not Started",
        crop.tracking?.stages?.length || 0,
        crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
        crop.tracking ? formatDate(crop.tracking.createdAt) : "N/A",
        formatDate(crop.createdAt)
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => 
          row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `crops_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSnackbar("CSV exported successfully", "success");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      showSnackbar("Failed to export CSV", "error");
    }
  };

  const exportExcel = () => {
    if (crops.length === 0) {
      showSnackbar("No data to export", "warning");
      return;
    }

    try {
      const data = crops.map((crop) => ({
        "Farming Type": getFarmingTypeLabel(crop.farmingType),
        "Seed Type": getSeedTypeLabel(crop.seedType),
        "Acres": crop.acres,
        "Sowing Date": formatDate(crop.sowingDate),
        "Farmer Name": crop.farmer?.personalInfo?.name || "",
        "Farmer Phone": crop.farmer?.personalInfo?.mobileNo || "",
        "Farmer Email": crop.farmer?.personalInfo?.email || "",
        "Farmer Address": crop.farmer?.personalInfo?.address || "",
        "Farmer Village": crop.farmer?.personalInfo?.villageGramaPanchayat || "",
        "Farmer Taluk": crop.farmer?.personalInfo?.taluk || "",
        "Farmer District": crop.farmer?.personalInfo?.district || "",
        "Farmer State": crop.farmer?.personalInfo?.state || "",
        "Farmer Pincode": crop.farmer?.personalInfo?.pincode || "",
        "Farmer ID": getFarmerDisplayId(crop),
        "Registration Status": crop.farmer?.registrationStatus || "",
        "Tracking ID": crop.trackingId,
        "Progress": crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
        "Current Stage": crop.tracking?.currentStageName || "N/A",
        "Total Stages": crop.tracking?.stages?.length || 0,
        "Stages Completed": crop.tracking?.stages?.filter(s => s.status === "completed").length || 0,
        "Stages In Progress": crop.tracking?.stages?.filter(s => s.status === "in-progress").length || 0,
        "Stages Pending": crop.tracking?.stages?.filter(s => s.status === "pending").length || 0,
        "Tracking Created": crop.tracking ? formatDate(crop.tracking.createdAt) : "N/A",
        "Created Date": formatDate(crop.createdAt),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Crops");
      XLSX.writeFile(
        wb,
        `crops_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      showSnackbar("Excel exported successfully", "success");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      showSnackbar("Failed to export Excel", "error");
    }
  };

  const exportPDF = () => {
  if (crops.length === 0) {
    showSnackbar("No data to export", "warning");
    return;
  }

  try {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Crops Management Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Crops: ${totalItems}`, 14, 37);

    const tableColumn = [
      "Farming Type",
      "Seed Type",
      "Acres",
      "Sowing Date",
      "Farmer Name",
      "Farmer Phone",
      "Tracking ID",
      "Progress",
      "Current Stage",
    ];
    const tableRows = crops.map((crop) => [
      getFarmingTypeLabel(crop.farmingType),
      getSeedTypeLabel(crop.seedType),
      crop.acres.toString(),
      formatDate(crop.sowingDate),
      getFarmerName(crop).substring(0, 15) + (getFarmerName(crop).length > 15 ? "..." : ""),
      getFarmerContact(crop).substring(0, 15),
      formatTrackingId(crop.trackingId || ""),
      crop.tracking?.progress ? `${crop.tracking.progress}%` : "0%",
      // Fix: Add proper null checking with default empty string
      (crop.tracking?.currentStageName || "").substring(0, 15) + 
      ((crop.tracking?.currentStageName || "").length > 15 ? "..." : "") || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`crops_${new Date().toISOString().split("T")[0]}.pdf`);
    showSnackbar("PDF exported successfully", "success");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    showSnackbar("Failed to export PDF", "error");
  }
};

  const printTable = () => {
    const printContent = tableRef.current?.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Crops Management Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            .type-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; display: inline-block; }
            .tracking-info { font-size: 11px; margin-top: 4px; }
            .stage-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
            .completed { background-color: #10B981; }
            .in-progress { background-color: #3B82F6; }
            .pending { background-color: #9CA3AF; }
            .skipped { background-color: #F59E0B; }
            .stage-item { margin: 2px 0; padding: 4px; border-radius: 4px; }
            .stage-current { background-color: #DBEAFE; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Crops Management Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    showSnackbar("Print dialog opened", "info");
  };

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(crops.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    }
  };

  /* ================= HANDLE FORM SUBMIT ================= */

  const handleFormSubmit = (data: any) => {
    if (editingCrop) {
      handleUpdateCrop(data);
    } else {
      handleCreateCrop(data);
    }
  };

  const handleEditClick = (crop: Crop) => {
    setEditingCrop(crop);
    setFormModalOpen(true);
    setModal({ type: null });
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setEditingCrop(null);
  };

  const handleClearFilters = () => {
    setFilterFarmingType("all");
    setFilterSeedType("all");
    setSearchTerm("");
  };

  const handleViewTracking = (crop: Crop) => {
    if (crop.tracking) {
      setTrackingData(crop.tracking);
      setModal({ type: "tracking" });
    } else if (crop.trackingId) {
      fetchTrackingData(crop.trackingId);
    } else {
      showSnackbar("No tracking data available for this crop", "warning");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
      {loading && crops.length === 0 && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900">
                Crop Management
              </h1>
              <p className="text-xs sm:text-xs md:text-base text-gray-600 mt-1">
                Track and manage all crop records
              </p>
            </div>
          </div>
          {/* <button
            onClick={() => setFormModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
          >
            <FaChartLine className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Crop</span>
            <span className="sm:hidden">Add Crop</span>
          </button> */}
        </div>

        {/* Stats Indicators */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {farmingTypes.map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-zinc-300 shadow-xs"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  type === "organic" ? "bg-green-500" :
                  type === "natural" ? "bg-blue-500" :
                  type === "hydroponic" ? "bg-purple-500" :
                  type === "inorganic" ? "bg-yellow-500" : "bg-gray-500"
                }`}
              />
              <span className="text-xs font-medium text-gray-700">
                {getFarmingTypeLabel(type)}
              </span>
              <span className="text-xs font-bold text-gray-900">
                ({crops.filter((d) => d.farmingType === type).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crop Form Modal */}
      <CropFormModal
        open={formModalOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={formModalLoading}
        initialData={editingCrop}
        isEdit={!!editingCrop}
      />

      {/* Tracking Modal */}
      <TrackingModal
        open={modal.type === "tracking"}
        onClose={() => setModal({ type: null })}
        trackingData={trackingData}
        loading={trackingLoading}
      />

      {/* Main Card */}
      <div className="rounded shadow-sm overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-2 sm:p-3">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative flex lg:flex-row flex-col gap-x-3 gap-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by farming type, seed type, farmer name, phone, email, location, tracking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-[40vw] px-10 py-2 text-xs sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
               { searchTerm.length >0 &&<AiOutlineClose onClick={()=>setSearchTerm("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:flex hidden items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium hidden sm:inline">
                    Filters
                  </span>
                </button>
              </div>

              {/* Toolbar Buttons Row */}
              <div className="flex lg:ml-auto items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex lg:hidden items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaFilter className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium hidden sm:inline">
                      Filters
                    </span>
                  </button>

                  {selectedIds.length > 0 && (
                    <button
                      onClick={() =>
                        setModal({ type: "bulkDelete", selectedIds })
                      }
                      className="flex items-center gap-2 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete Selected ({selectedIds.length})
                    </button>
                  )}
                </div>
                <button
                  onClick={copyData}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy Data"
                >
                  <FaCopy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={exportCSV}
                  className="p-2 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors"
                  title="Export CSV"
                >
                  <FaFileCsv className="w-4 h-4 text-teal-600" />
                </button>
                <button
                  onClick={exportExcel}
                  className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  title="Export Excel"
                >
                  <FaFileExcel className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={exportPDF}
                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  title="Export PDF"
                >
                  <FaFilePdf className="w-4 h-4 text-red-600" />
                </button>
                <button
                  onClick={printTable}
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Print"
                >
                  <FaPrint className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs sm:text-xs font-medium text-gray-700 mb-2">
                      Farming Type
                    </label>
                    <select
                      value={filterFarmingType}
                      onChange={(e) => setFilterFarmingType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                    >
                      <option value="all">All Farming Types</option>
                      {farmingTypes.map((type) => (
                        <option key={type} value={type}>
                          {getFarmingTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-xs font-medium text-gray-700 mb-2">
                      Seed Type
                    </label>
                    <select
                      value={filterSeedType}
                      onChange={(e) => setFilterSeedType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                    >
                      <option value="all">All Seed Types</option>
                      {seedTypes.map((type) => (
                        <option key={type} value={type}>
                          {getSeedTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                    <button
                      onClick={handleClearFilters}
                      className="w-full px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div ref={tableRef} className="w-full overflow-x-scroll">
          {/* Desktop Table */}
          <table className="min-w-full hidden bg-white lg:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === crops.length &&
                      crops.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                {[
                  "Farming Type",
                  "Seed Type",
                  "Acres",
                  "Sowing Date",
                  "Farmer Info",
                  "Tracking Info",
                  "Progress",
                  "All Stages",
                  "Created",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-2 py-3 min-w-28 text-left text-[10px] font-semibold text-gray-700 uppercase border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {crops.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row._id)}
                      onChange={(e) => handleSelectOne(row._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
                      {getFarmingTypeLabel(row.farmingType)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
                      {getSeedTypeLabel(row.seedType)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-bold text-gray-900">
                    {row.acres}
                  </td>
                  <td className="px-2 w-32 py-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-700">
                        {formatDate(row.sowingDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 min-w-[200px]">
                    {row.farmer ? (
                      <FarmerInfoDisplay farmer={row.farmer} />
                    ) : (
                      <div className="text-xs text-gray-500 italic">
                        No farmer data
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {row.tracking ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaChartLine className="w-3 h-3 text-purple-500" />
                          <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                            {row.tracking.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          ID: {formatTrackingId(row.tracking._id)}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-600">Created:</span>
                          <span className="text-gray-900">
                            {formatDate(row.tracking.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            row.tracking.isCompleted ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {row.tracking.isCompleted ? "Completed" : "Active"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 italic">
                        No tracking data
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${row.tracking?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {row.tracking?.progress || 0}%
                        </span>
                      </div>
                      {row.tracking?.currentStageName && (
                        <div className="text-xs text-gray-500">
                          Current: {row.tracking.currentStageName}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Stages:</span>
                        <span className="font-semibold">
                          {row.tracking?.currentStageIndex !== undefined ? row.tracking.currentStageIndex + 1 : 0}/{row.tracking?.stages?.length || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 min-w-[250px]">
                    {row.tracking?.stages ? (
                      <StagesDisplay 
                        stages={row.tracking.stages} 
                        currentStageIndex={row.tracking.currentStageIndex} 
                      />
                    ) : (
                      <div className="text-xs text-gray-500 italic">No stages data</div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs text-gray-500">
                      {formatDate(row.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {/* <button
                        onClick={() => handleViewTracking(row)}
                        className="p-2 rounded-lg text-purple-700 hover:bg-purple-200 transition-colors"
                        title="View Tracking Details"
                      >
                        <FaChartLine className="w-4 h-4" />
                      </button> */}
                      <button
                        onClick={() => handleEditClick(row)}
                        className="p-2 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors"
                        title="Edit Crop"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", row })}
                        className="p-2 rounded-lg text-red-700 hover:bg-red-200 transition-colors"
                        title="Delete Crop"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3 mt-2 p-4">
            {crops.map((row) => (
              <div
                key={row._id}
                className="bg-white border border-gray-200 rounded shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row._id)}
                      onChange={(e) => handleSelectOne(row._id, e.target.checked)}
                      className="rounded border-gray-300 -mt-12 -ml-2"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
                          {getFarmingTypeLabel(row.farmingType)}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
                          {getSeedTypeLabel(row.seedType)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        <span className="text-xs ml-2 mr-2">Sowing Date</span>
                        <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                        {formatDate(row.sowingDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {/* <button
                      onClick={() => handleViewTracking(row)}
                      className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200"
                      title="View Tracking Details"
                    >
                      <FaChartLine className="w-3.5 h-3.5" />
                    </button> */}
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-200"
                      title="Edit Crop"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", row })}
                      className="p-1.5 rounded-lg text-red-700 hover:bg-red-200"
                      title="Delete Crop"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="grid ml-4 grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium">Acres:</span>
                    <span className="ml-2 font-bold text-gray-900">
                      {row.acres}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Progress:</span>
                    <span className="ml-2 font-bold text-gray-900">
                      {row.tracking?.progress || 0}%
                    </span>
                  </div>
                  
                  {/* Farmer Info */}
                  {row.farmer && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                      <div className="font-medium text-gray-700 mb-2">Farmer Information:</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{row.farmer.personalInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{row.farmer.personalInfo.mobileNo}</span>
                        </div>
                        {row.farmer.personalInfo.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium truncate max-w-[150px]">{row.farmer.personalInfo.email}</span>
                          </div>
                        )}
                        {row.farmer.personalInfo.address && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Address:</span>
                            <span className="font-medium truncate max-w-[150px]">{row.farmer.personalInfo.address}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">
                            {row.farmer.personalInfo.villageGramaPanchayat}, {row.farmer.personalInfo.district}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            row.farmer.registrationStatus === "approved" ? "bg-green-100 text-green-800" :
                            row.farmer.registrationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {row.farmer.registrationStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {row.tracking && (
                    <>
                      <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                        <div className="font-medium text-gray-700 mb-2">Tracking Information:</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium truncate max-w-[150px]">{row.tracking.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ID:</span>
                            <span className="font-medium">{formatTrackingId(row.tracking._id)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              row.tracking.isCompleted ? "bg-green-100 text-green-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {row.tracking.isCompleted ? "Completed" : "Active"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Stage:</span>
                            <span className="font-medium text-green-600">
                              {row.tracking.currentStageName || 
                               row.tracking.stages[row.tracking.currentStageIndex]?.name || 
                               "Not Started"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">{formatDate(row.tracking.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stages Display */}
                      <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                        <StagesDisplay 
                          stages={row.tracking.stages} 
                          currentStageIndex={row.tracking.currentStageIndex} 
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="col-span-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    Created: {formatDate(row.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && crops.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No crop records found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-xs">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && crops.length > 0 && (
            <div className="flex justify-center py-4">
              <CircularProgress size={24} />
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-xs text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {Math.min((page - 1) * limit + 1, totalItems)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(page * limit, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
              results
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="p-1 ml-3 border border-zinc-300 rounded"
              >
                {[2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map(
                  (data, i) => (
                    <option key={i} value={data}>
                      {data}
                    </option>
                  )
                )}
              </select>
            </div>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
              size="small"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {modal.type === "delete" && modal.row && (
        <DeleteModal
          row={modal.row}
          onClose={() => setModal({ type: null })}
          onDelete={() => handleDeleteCrop(modal.row!._id)}
        />
      )}

      {/* Bulk Delete Modal */}
      {modal.type === "bulkDelete" && modal.selectedIds && (
        <BulkDeleteModal
          count={modal.selectedIds.length}
          onClose={() => setModal({ type: null })}
          onDelete={handleBulkDelete}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

/* ================= MODAL COMPONENTS ================= */

const DeleteModal = ({ row, onClose, onDelete }: any) => (
  <Modal open onClose={onClose}>
    <Box sx={modalStyle}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <FaTrash className="w-8 h-8 text-red-600" />
        </div>
        <Typography variant="h6" className="mb-2 text-gray-900">
          Delete Crop Record
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Are you sure you want to delete the crop record for{" "}
          <span className="font-bold text-gray-900">
            {row.farmer?.personalInfo?.name || row.farmerId}
          </span>?
          <br />
          This action cannot be undone.
        </Typography>
        <div className="flex justify-center gap-3">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onDelete} variant="contained" color="error">
            Delete
          </Button>
        </div>
      </div>
    </Box>
  </Modal>
);

const BulkDeleteModal = ({ count, onClose, onDelete }: any) => (
  <Modal open onClose={onClose}>
    <Box sx={modalStyle}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <FaTrash className="w-8 h-8 text-red-600" />
        </div>
        <Typography variant="h6" className="mb-2 text-gray-900">
          Delete {count} Crop Records
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Are you sure you want to delete {count} selected crop records?
          <br />
          This action cannot be undone.
        </Typography>
        <div className="flex justify-center gap-3">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onDelete} variant="contained" color="error">
            Delete {count} Records
          </Button>
        </div>
      </div>
    </Box>
  </Modal>
);