




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
// } from "@mui/material";

// /* ================= TYPES ================= */

// interface Stage {
//   name: string;
//   status: "pending" | "in-progress" | "completed" | "skipped";
//   photos: string[];
//   _id: string;
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
//   __v: number;
// }

// interface Crop {
//   _id: string;
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   sowingDate: string;
//   farmerId: string;
//   trackingId: string;
//   createdAt: string;
//   updatedAt?: string;
//   __v?: number;
//   trackingData?: TrackingData;
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

//   // FIXED: Proper date formatting function
//   const formatDateString = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
      
//       // Check if date is valid
//       if (isNaN(date.getTime())) {
//         // Try parsing different date formats
//         const parts = dateString.split(/[- :T.]/);
//         if (parts.length >= 3) {
//           const year = parseInt(parts[0]);
//           const month = parseInt(parts[1]) - 1; // months are 0-indexed
//           const day = parseInt(parts[2]);
//           const newDate = new Date(year, month, day);
//           if (!isNaN(newDate.getTime())) {
//             return newDate.toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             });
//           }
//         }
//         return "Invalid Date";
//       }
      
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error);
//       return "Invalid Date";
//     }
//   };

//   // FIXED: Format time if needed
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
//                   {calculateProgress()}%
//                 </Typography>
//               </div>
//               <LinearProgress
//                 variant="determinate"
//                 value={calculateProgress()}
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
//                     {trackingData.stages[trackingData.currentStageIndex]?.name ||
//                       "Not Started"}
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
//                   {/* Debug info - remove in production */}
//                   <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
//                     <div>Raw Date: {trackingData.createdAt}</div>
//                     <div>Formatted: {formatDateString(trackingData.createdAt)}</div>
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
//                           {stage.photos.length} photos
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
//                 {/* <option value="inorganic">Inorganic</option> */}
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
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
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

// /* ================= MAIN COMPONENT ================= */

// export default function CropManagementPage() {
//   const [crops, setCrops] = useState<Crop[]>([]);
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

//   // Get unique farming types and seed types from crops data
//   const farmingTypes = [...new Set(crops.map(crop => crop.farmingType))];
//   const seedTypes = [...new Set(crops.map(crop => crop.seedType))];

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

//       if (response.data.success || Array.isArray(response.data)) {
//         const data = response.data.success ? response.data.data : response.data;
//         setCrops(data || []);
//         setTotalItems(data?.length || 0);
//         setTotalPages(Math.ceil((data?.length || 0) / limit) || 1);
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
//       case "local":
//         return "bg-indigo-100 text-indigo-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // FIXED: Improved date formatting
//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       // Try to parse the date string
//       const date = new Date(dateString);
      
//       // Check if date is valid
//       if (isNaN(date.getTime())) {
//         // Try to parse ISO string with different formats
//         const isoString = dateString.replace(' ', 'T');
//         const newDate = new Date(isoString);
        
//         if (!isNaN(newDate.getTime())) {
//           return newDate.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           });
//         }
        
//         return "Invalid Date";
//       }
      
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error);
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
//       local: "Local"
//     };
//     return labels[type] || type;
//   };

//   const formatTrackingId = (trackingId: string) => {
//     if (!trackingId) return "N/A";
//     if (trackingId.length <= 8) return trackingId;
//     return `...${trackingId.slice(-8)}`;
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const copyData = () => {
//     if (crops.length === 0) {
//       showSnackbar("No data to copy", "warning");
//       return;
//     }

//     try {
//       const headers = ["Farming Type", "Seed Type", "Acres", "Sowing Date", "Farmer ID", "Tracking ID", "Created Date"];
      
//       const rows = crops.map((crop) => [
//         getFarmingTypeLabel(crop.farmingType) || "",
//         getSeedTypeLabel(crop.seedType) || "",
//         crop.acres?.toString() || "0",
//         formatDate(crop.sowingDate) || "",
//         crop.farmerId || "",
//         crop.trackingId || "",
//         formatDate(crop.createdAt) || ""
//       ]);
      
//       const columnWidths = headers.map((header, colIndex) => {
//         const maxHeaderLength = header.length;
//         const maxDataLength = rows.reduce((max, row) => {
//           const cell = row[colIndex] || "";
//           const cellLength = cell.toString().length;
//           return Math.max(max, cellLength);
//         }, 0);
//         return Math.max(maxHeaderLength, maxDataLength, 10);
//       });
      
//       let tableString = "";
      
//       tableString += headers.map((header, i) => 
//         header.padEnd(columnWidths[i])
//       ).join(" | ") + "\n";
      
//       tableString += headers.map((_, i) => 
//         "-".repeat(columnWidths[i])
//       ).join("-+-") + "\n";
      
//       rows.forEach(row => {
//         tableString += row.map((cell, i) => {
//           const cellStr = cell?.toString() || "";
//           return cellStr.padEnd(columnWidths[i]);
//         }).join(" | ") + "\n";
//       });
      
//       tableString += `\nTotal Crops: ${totalItems}\n`;
//       tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
//       navigator.clipboard.writeText(tableString);
//       showSnackbar("Data copied in table format", "success");
//     } catch (error) {
//       console.error("Error copying data:", error);
//       showSnackbar("Failed to copy data", "error");
//     }
//   };

//   const exportCSV = () => {
//     if (crops.length === 0) {
//       showSnackbar("No data to export", "warning");
//       return;
//     }

//     try {
//       const headers = ["Farming Type", "Seed Type", "Acres", "Sowing Date", "Farmer ID", "Tracking ID", "Created Date"];
      
//       const rows = crops.map((crop) => [
//         getFarmingTypeLabel(crop.farmingType),
//         getSeedTypeLabel(crop.seedType),
//         crop.acres,
//         formatDate(crop.sowingDate),
//         crop.farmerId,
//         crop.trackingId,
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
//         "Farmer ID": crop.farmerId,
//         "Tracking ID": crop.trackingId,
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
//     if (crops.length === 0) {
//       showSnackbar("No data to export", "warning");
//       return;
//     }

//     try {
//       const doc = new jsPDF();

//       doc.setFontSize(18);
//       doc.text("Crops Management Report", 14, 22);
//       doc.setFontSize(11);
//       doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
//       doc.text(`Total Crops: ${totalItems}`, 14, 37);

//       const tableColumn = [
//         "Farming Type",
//         "Seed Type",
//         "Acres",
//         "Sowing Date",
//         "Farmer ID",
//         "Tracking ID",
//         "Created",
//       ];
//       const tableRows = crops.map((crop) => [
//         getFarmingTypeLabel(crop.farmingType),
//         getSeedTypeLabel(crop.seedType),
//         crop.acres.toString(),
//         formatDate(crop.sowingDate),
//         crop.farmerId.substring(0, 15) + (crop.farmerId.length > 15 ? "..." : ""),
//         formatTrackingId(crop.trackingId),
//         formatDate(crop.createdAt),
//       ]);

//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 45,
//         styles: { fontSize: 9, cellPadding: 3 },
//         headStyles: { fillColor: [59, 130, 246] },
//       });

//       doc.save(`crops_${new Date().toISOString().split("T")[0]}.pdf`);
//       showSnackbar("PDF exported successfully", "success");
//     } catch (error) {
//       console.error("Error exporting PDF:", error);
//       showSnackbar("Failed to export PDF", "error");
//     }
//   };

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
//     if (crop.trackingId) {
//       fetchTrackingData(crop.trackingId);
//     } else {
//       showSnackbar("No tracking ID available for this crop", "warning");
//     }
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-b relative overflow-x-auto from-gray-50 to-white text-black p-4">
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
//                   placeholder="Search by farming type, seed type, farmer ID, tracking ID..."
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
//         <div ref={tableRef}>
//           {/* Desktop Table */}
//           <table className="min-w-full hidden bg-white lg:table">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-10">
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
//                   "Farmer ID",
//                   "Tracking ID",
//                   "Created",
//                   "Actions",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-b border-gray-200"
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
//                   <td className="px-4 py-2">
//                     <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
//                       {getFarmingTypeLabel(row.farmingType)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
//                       {getSeedTypeLabel(row.seedType)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-xs font-bold text-gray-900">
//                     {row.acres}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="w-4 h-4 text-gray-400" />
//                       <span className="text-xs text-gray-700">
//                         {formatDate(row.sowingDate)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="text-xs font-medium text-gray-900">
//                       {row.farmerId}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="text-xs font-medium text-gray-900 truncate" title={row.trackingId}>
//                       {formatTrackingId(row.trackingId)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="text-xs text-gray-500">
//                       {formatDate(row.createdAt)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleViewTracking(row)}
//                         className="p-2 rounded-lg text-purple-700 hover:bg-purple-200 transition-colors"
//                         title="View Tracking"
//                       >
//                         <FaChartLine className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleEditClick(row)}
//                         className="p-2 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors"
//                         title="Edit"
//                       >
//                         <FaEdit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setModal({ type: "delete", row })}
//                         className="p-2 rounded-lg text-red-700 hover:bg-red-200 transition-colors"
//                         title="Delete"
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
//                       className="rounded border-gray-300"
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
//                         <FaCalendarAlt className="inline w-3 h-3 mr-1" />
//                         {formatDate(row.sowingDate)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => handleViewTracking(row)}
//                       className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200"
//                       title="View Tracking"
//                     >
//                       <FaChartLine className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                       onClick={() => handleEditClick(row)}
//                       className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-200"
//                     >
//                       <FaEdit className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                       onClick={() => setModal({ type: "delete", row })}
//                       className="p-1.5 rounded-lg text-red-700 hover:bg-red-200"
//                     >
//                       <FaTrash className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div>
//                     <span className="font-medium">Acres:</span>
//                     <span className="ml-2 font-bold text-gray-900">
//                       {row.acres}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Tracking ID:</span>
//                     <span className="ml-2 font-medium text-gray-900 truncate block" title={row.trackingId}>
//                       {formatTrackingId(row.trackingId)}
//                     </span>
//                   </div>
//                   <div className="col-span-2">
//                     <span className="font-medium">Farmer ID:</span>
//                     <span className="ml-2 font-medium text-gray-900">
//                       {row.farmerId}
//                     </span>
//                   </div>
//                   <div className="col-span-2 text-xs text-gray-500">
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
//                 Try adjusting your search or filters to find what you&apos;re looking for.
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
//                 onChange={(e) => setLimit(Number(e.target.value))}
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
//           Are you sure you want to delete the crop record for farmer ID{" "}
//           <span className="font-bold text-gray-900">"{row.farmerId}"</span>?
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
} from "@mui/material";

/* ================= TYPES ================= */

interface Stage {
  name: string;
  status: "pending" | "in-progress" | "completed" | "skipped";
  photos: string[];
  _id: string;
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
  __v: number;
}

interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
  trackingId: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  trackingData?: TrackingData;
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

  // FIXED: Proper date formatting function
  const formatDateString = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing different date formats
        const parts = dateString.split(/[- :T.]/);
        if (parts.length >= 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // months are 0-indexed
          const day = parseInt(parts[2]);
          const newDate = new Date(year, month, day);
          if (!isNaN(newDate.getTime())) {
            return newDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          }
        }
        return "Invalid Date";
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  // FIXED: Format time if needed
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
                  {calculateProgress()}%
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
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
                    {trackingData.stages[trackingData.currentStageIndex]?.name ||
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
                  {/* Debug info - remove in production */}
                  <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                    <div>Raw Date: {trackingData.createdAt}</div>
                    <div>Formatted: {formatDateString(trackingData.createdAt)}</div>
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
                          {stage.photos.length} photos
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
                {/* <option value="inorganic">Inorganic</option> */}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
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

/* ================= MAIN COMPONENT ================= */

export default function CropManagementPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
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
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Get unique farming types and seed types from crops data
  const farmingTypes = [...new Set(crops.map(crop => crop.farmingType))];
  const seedTypes = [...new Set(crops.map(crop => crop.seedType))];

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

      const response = await axios.get("/api/postings", {
        params,
      });

      if (response.data.success) {
        const data = response.data.data || [];
        const total = response.data.total || 0;
        
        setCrops(data);
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
      case "local":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // FIXED: Improved date formatting
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      // Try to parse the date string
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try to parse ISO string with different formats
        const isoString = dateString.replace(' ', 'T');
        const newDate = new Date(isoString);
        
        if (!isNaN(newDate.getTime())) {
          return newDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        
        return "Invalid Date";
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
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
      local: "Local"
    };
    return labels[type] || type;
  };

  const formatTrackingId = (trackingId: string) => {
    if (!trackingId) return "N/A";
    if (trackingId.length <= 8) return trackingId;
    return `...${trackingId.slice(-8)}`;
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const copyData = () => {
    if (crops.length === 0) {
      showSnackbar("No data to copy", "warning");
      return;
    }

    try {
      const headers = ["Farming Type", "Seed Type", "Acres", "Sowing Date", "Farmer ID", "Tracking ID", "Created Date"];
      
      const rows = crops.map((crop) => [
        getFarmingTypeLabel(crop.farmingType) || "",
        getSeedTypeLabel(crop.seedType) || "",
        crop.acres?.toString() || "0",
        formatDate(crop.sowingDate) || "",
        crop.farmerId || "",
        crop.trackingId || "",
        formatDate(crop.createdAt) || ""
      ]);
      
      const columnWidths = headers.map((header, colIndex) => {
        const maxHeaderLength = header.length;
        const maxDataLength = rows.reduce((max, row) => {
          const cell = row[colIndex] || "";
          const cellLength = cell.toString().length;
          return Math.max(max, cellLength);
        }, 0);
        return Math.max(maxHeaderLength, maxDataLength, 10);
      });
      
      let tableString = "";
      
      tableString += headers.map((header, i) => 
        header.padEnd(columnWidths[i])
      ).join(" | ") + "\n";
      
      tableString += headers.map((_, i) => 
        "-".repeat(columnWidths[i])
      ).join("-+-") + "\n";
      
      rows.forEach(row => {
        tableString += row.map((cell, i) => {
          const cellStr = cell?.toString() || "";
          return cellStr.padEnd(columnWidths[i]);
        }).join(" | ") + "\n";
      });
      
      tableString += `\nTotal Crops: ${totalItems}\n`;
      tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
      navigator.clipboard.writeText(tableString);
      showSnackbar("Data copied in table format", "success");
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
      const headers = ["Farming Type", "Seed Type", "Acres", "Sowing Date", "Farmer ID", "Tracking ID", "Created Date"];
      
      const rows = crops.map((crop) => [
        getFarmingTypeLabel(crop.farmingType),
        getSeedTypeLabel(crop.seedType),
        crop.acres,
        formatDate(crop.sowingDate),
        crop.farmerId,
        crop.trackingId,
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
        "Farmer ID": crop.farmerId,
        "Tracking ID": crop.trackingId,
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
        "Farmer ID",
        "Tracking ID",
        "Created",
      ];
      const tableRows = crops.map((crop) => [
        getFarmingTypeLabel(crop.farmingType),
        getSeedTypeLabel(crop.seedType),
        crop.acres.toString(),
        formatDate(crop.sowingDate),
        crop.farmerId.substring(0, 15) + (crop.farmerId.length > 15 ? "..." : ""),
        formatTrackingId(crop.trackingId),
        formatDate(crop.createdAt),
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 9, cellPadding: 3 },
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
    if (crop.trackingId) {
      fetchTrackingData(crop.trackingId);
    } else {
      showSnackbar("No tracking ID available for this crop", "warning");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b relative overflow-x-auto from-gray-50 to-white text-black p-4">
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
      <div className="rounded-lg shadow-sm overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-2 sm:p-3">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative flex lg:flex-row flex-col gap-x-3 gap-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by farming type, seed type, farmer ID, tracking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-[40vw] pl-10 pr-4 py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:flex hidden items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
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
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
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
                      className="w-full px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
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
        <div ref={tableRef}>
          {/* Desktop Table */}
          <table className="min-w-full hidden bg-white lg:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-10">
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
                  "Farmer ID",
                  "Tracking ID",
                  "Created",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-b border-gray-200"
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
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getFarmingTypeColor(row.farmingType)}`}>
                      {getFarmingTypeLabel(row.farmingType)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getSeedTypeColor(row.seedType)}`}>
                      {getSeedTypeLabel(row.seedType)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-bold text-gray-900">
                    {row.acres}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-700">
                        {formatDate(row.sowingDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs font-medium text-gray-900">
                      {row.farmerId}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs font-medium text-gray-900 truncate" title={row.trackingId}>
                      {formatTrackingId(row.trackingId)}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs text-gray-500">
                      {formatDate(row.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewTracking(row)}
                        className="p-2 rounded-lg text-purple-700 hover:bg-purple-200 transition-colors"
                        title="View Tracking"
                      >
                        <FaChartLine className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(row)}
                        className="p-2 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", row })}
                        className="p-2 rounded-lg text-red-700 hover:bg-red-200 transition-colors"
                        title="Delete"
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
                      className="rounded border-gray-300"
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
                        <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                        {formatDate(row.sowingDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewTracking(row)}
                      className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200"
                      title="View Tracking"
                    >
                      <FaChartLine className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-200"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", row })}
                      className="p-1.5 rounded-lg text-red-700 hover:bg-red-200"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium">Acres:</span>
                    <span className="ml-2 font-bold text-gray-900">
                      {row.acres}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Tracking ID:</span>
                    <span className="ml-2 font-medium text-gray-900 truncate block" title={row.trackingId}>
                      {formatTrackingId(row.trackingId)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Farmer ID:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {row.farmerId}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500">
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
                Try adjusting your search or filters to find what you're looking for.
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
          Are you sure you want to delete the crop record for farmer ID{" "}
          <span className="font-bold text-gray-900">"{row.farmerId}"</span>?
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