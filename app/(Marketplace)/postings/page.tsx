

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
//   FaPlus,
//   FaCalendarAlt,
//   FaUser,
//   FaSeedling,
//   FaTimes,
//   FaCheck,
//   FaSpinner,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   Pagination,
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   IconButton,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";

// /* ================= TYPES ================= */

// interface Posting {
//   _id: string;
//   date: string;
//   title: string;
//   category: string;
//   item: string;
//   seedType: "Seed" | "undefined";
//   acres: string;
//   postedBy: {
//     name: string;
//     mobile: string;
//   };
//   status: "Pending" | "Approved" | "Rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// type Cat = {
//   _id: string;
//   categoryName: string;
//   categoryId: string;
// };

// /* ================= POSTING FORM MODAL ================= */

// interface PostingFormModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: PostingFormData) => void;
//   categories: Cat[];
//   loading?: boolean;
//   initialData?: Posting | null;
//   isEdit?: boolean;
// }

// interface PostingFormData {
//   date: string;
//   title: string;
//   category: string;
//   item: string;
//   seedType: "Seed" | "undefined";
//   acres: string;
//   postedBy: {
//     name: string;
//     mobile: string;
//   };
//   status: "Pending" | "Approved" | "Rejected";
// }

// const PostingFormModal: React.FC<PostingFormModalProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   categories,
//   loading = false,
//   initialData = null,
//   isEdit = false,
// }) => {
//   const [formData, setFormData] = useState<PostingFormData>({
//     date: "",
//     title: "",
//     category: "",
//     item: "",
//     seedType: "undefined",
//     acres: "",
//     postedBy: {
//       name: "",
//       mobile: "",
//     },
//     status: "Pending",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Initialize form data when modal opens or initialData changes
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         title: initialData.title || "",
//         category: initialData.category || "",
//         item: initialData.item || "",
//         seedType: initialData.seedType || "undefined",
//         acres: initialData.acres || "",
//         postedBy: {
//           name: initialData.postedBy?.name || "",
//           mobile: initialData.postedBy?.mobile || "",
//         },
//         status: initialData.status || "Pending",
//       });
//     } else {
//       setFormData({
//         date: new Date().toISOString().split('T')[0],
//         title: "",
//         category: "",
//         item: "",
//         seedType: "undefined",
//         acres: "",
//         postedBy: {
//           name: "",
//           mobile: "",
//         },
//         status: "Pending",
//       });
//     }
//     setErrors({}); // Clear errors when form opens
//   }, [initialData, open]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.date.trim()) {
//       newErrors.date = "Date is required";
//     }

//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//     }

//     if (!formData.category.trim()) {
//       newErrors.category = "Category is required";
//     }

//     if (!formData.item.trim()) {
//       newErrors.item = "Item is required";
//     }

//     if (!formData.acres.trim()) {
//       newErrors.acres = "Acres is required";
//     }

//     if (!formData.postedBy.name.trim()) {
//       newErrors.postedByName = "Posted By Name is required";
//     }

//     if (!formData.postedBy.mobile.trim()) {
//       newErrors.postedByMobile = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.postedBy.mobile)) {
//       newErrors.postedByMobile = "Please enter a valid 10-digit mobile number";
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

//   const handleInputChange = (field: keyof PostingFormData, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     // Clear error for this field
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handlePostedByChange = (field: keyof PostingFormData['postedBy'], value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       postedBy: {
//         ...prev.postedBy,
//         [field]: value,
//       },
//     }));
//     // Clear error for this field
//     const errorKey = `postedBy${field.charAt(0).toUpperCase() + field.slice(1)}`;
//     if (errors[errorKey]) {
//       setErrors((prev) => ({ ...prev, [errorKey]: "" }));
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <FaPlus className="w-5 h-5" />
//             <span className="text-lg font-semibold">
//               {isEdit ? "Edit Posting" : "Add New Posting"}
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
//             {/* Date Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Date *
//               </label>
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => handleInputChange("date", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.date ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               />
//               {errors.date && (
//                 <p className="mt-1 text-xs text-red-600">{errors.date}</p>
//               )}
//             </div>

//             {/* Title Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.title ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter posting title"
//                 required
//               />
//               {errors.title && (
//                 <p className="mt-1 text-xs text-red-600">{errors.title}</p>
//               )}
//             </div>

//             {/* Category Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Category *
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white ${
//                   errors.category ? "border-red-500" : "border-gray-300"
//                 }`}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat.categoryName}>
//                     {cat.categoryName}
//                   </option>
//                 ))}
//               </select>
//               {errors.category && (
//                 <p className="mt-1 text-xs text-red-600">{errors.category}</p>
//               )}
//             </div>

//             {/* Item Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Item *
//               </label>
//               <input
//                 type="text"
//                 value={formData.item}
//                 onChange={(e) => handleInputChange("item", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.item ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter item name"
//                 required
//               />
//               {errors.item && (
//                 <p className="mt-1 text-xs text-red-600">{errors.item}</p>
//               )}
//             </div>

//             {/* Seed Type Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Seed Type *
//               </label>
//               <select
//                 value={formData.seedType}
//                 onChange={(e) => handleInputChange("seedType", e.target.value as "Seed" | "undefined")}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                 required
//               >
//                 <option value="undefined">Undefined</option>
//                 <option value="Seed">Seed</option>
//               </select>
//             </div>

//             {/* Acres Field */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Acres *
//               </label>
//               <input
//                 type="text"
//                 value={formData.acres}
//                 onChange={(e) => handleInputChange("acres", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.acres ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter acres"
//                 required
//               />
//               {errors.acres && (
//                 <p className="mt-1 text-xs text-red-600">{errors.acres}</p>
//               )}
//             </div>

//             {/* Posted By Name */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Posted By Name *
//               </label>
//               <input
//                 type="text"
//                 value={formData.postedBy.name}
//                 onChange={(e) => handlePostedByChange("name", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.postedByName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter name"
//                 required
//               />
//               {errors.postedByName && (
//                 <p className="mt-1 text-xs text-red-600">{errors.postedByName}</p>
//               )}
//             </div>

//             {/* Posted By Mobile */}
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Mobile Number *
//               </label>
//               <input
//                 type="tel"
//                 value={formData.postedBy.mobile}
//                 onChange={(e) => handlePostedByChange("mobile", e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
//                   errors.postedByMobile ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter 10-digit mobile number"
//                 required
//                 maxLength={10}
//               />
//               {errors.postedByMobile && (
//                 <p className="mt-1 text-xs text-red-600">{errors.postedByMobile}</p>
//               )}
//             </div>

//             {/* Status Field */}
//             <div className="col-span-2">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Status *
//               </label>
//               <select
//                 value={formData.status}
//                 onChange={(e) => handleInputChange("status", e.target.value as "Pending" | "Approved" | "Rejected")}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                 required
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
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
//             "Update Posting"
//           ) : (
//             "Create Posting"
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
//   width: { xs: "90%", sm: "80%", md: 500 },
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: { xs: 3, sm: 4 },
// };

// /* ================= MAIN COMPONENT ================= */

// export default function PostingTable() {
//   const [postings, setPostings] = useState<Posting[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [filterCategory, setFilterCategory] = useState<string>("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [category, setCategory] = useState<Cat[]>([]);

//   const [modal, setModal] = useState<{
//     type: "view" | "edit" | "delete" | "bulkDelete" | null;
//     row?: Posting;
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
//   const [editingPosting, setEditingPosting] = useState<Posting | null>(null);
  
//   const tableRef = useRef<HTMLDivElement>(null);

//   /* ================= API FUNCTIONS ================= */

//   const fetchPostings = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/postings", {
//         params: {
//           search: searchTerm,
//           status: filterStatus !== "all" ? filterStatus : undefined,
//           category: filterCategory !== "all" ? filterCategory : undefined,
//           page,
//           limit: limit,
//         },
//       });

//       if (response.data.success) {
//         setPostings(response.data.data || []);
//         setTotalItems(response.data.total || 0);
//         setTotalPages(Math.ceil(response.data.total / limit) || 1);
//       } else {
//         showSnackbar("Failed to fetch postings", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching postings:", error);
//       showSnackbar("Error fetching postings", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   ///////single delete///////////////////////
//   const handleDeletePosting = async (id: string) => {
//     try {
//       const response = await axios.delete(`/api/postings/${id}`);

//       if (response.data.success) {
//         showSnackbar("Posting deleted successfully", "success");
//         fetchPostings();
//         setModal({ type: null });
//       } else {
//         showSnackbar("Failed to delete posting", "error");
//       }
//     } catch (error) {
//       console.error("Error deleting posting:", error);
//       showSnackbar("Error deleting posting", "error");
//     }
//   };

//   ///////////////multiple delete /////////////
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       showSnackbar("No postings selected", "warning");
//       return;
//     }

//     try {
//       const response = await axios.post("/api/postings/bulk-delete", {
//         ids: selectedIds,
//       });

//       if (response.data.success) {
//         showSnackbar(response.data.message, "success");
//         setSelectedIds([]);
//         fetchPostings();
//         setModal({ type: null });
//       } else {
//         showSnackbar("Failed to delete postings", "error");
//       }
//     } catch (error) {
//       console.error("Error in bulk delete:", error);
//       showSnackbar("Error deleting postings", "error");
//     }
//   };

//   ////////create posting/////////////////
//   const handleCreatePosting = async (data: any) => {
//     try {
//       setFormModalLoading(true);
//       const response = await axios.post("/api/postings", data);

//       if (response.data.success) {
//         showSnackbar("Posting created successfully", "success");
//         setFormModalOpen(false);
//         fetchPostings();
//       } else {
//         showSnackbar("Failed to create posting", "error");
//       }
//     } catch (error: any) {
//       console.error("Error creating posting:", error);
//       showSnackbar(
//         error.response?.data?.message || "Error creating posting",
//         "error"
//       );
//     } finally {
//       setFormModalLoading(false);
//     }
//   };

//   ////////update posting/////////////////
//   const handleUpdatePosting = async (data: any) => {
//     if (!editingPosting) return;

//     try {
//       setFormModalLoading(true);
//       const response = await axios.put(`/api/postings/${editingPosting._id}`, data);

//       if (response.data.success) {
//         showSnackbar("Posting updated successfully", "success");
//         setFormModalOpen(false);
//         setEditingPosting(null);
//         fetchPostings();
//       } else {
//         showSnackbar("Failed to update posting", "error");
//       }
//     } catch (error: any) {
//       console.error("Error updating posting:", error);
//       showSnackbar(
//         error.response?.data?.message || "Error updating posting",
//         "error"
//       );
//     } finally {
//       setFormModalLoading(false);
//     }
//   };

//   ///get all category///////////////
//   const getCategory = async () => {
//     try {
//       const response = await axios.get("/api/category");
//       if (response.data.success) {
//         setCategory(response.data.category || []);
//       } else {
//         showSnackbar("Failed to fetch categories", "error");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       showSnackbar("Failed to fetch categories", "error");
//     }
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchPostings();
//     getCategory();
//   }, [page, limit]);

//   // Debounce search term
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (page !== 1) setPage(1); // Reset to first page on search/filter change
//       fetchPostings();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, filterStatus, filterCategory]);

//   /* ================= UTILITY FUNCTIONS ================= */

//   const showSnackbar = (
//     message: string,
//     severity: "success" | "error" | "info" | "warning"
//   ) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Approved":
//         return "bg-emerald-100 text-emerald-800";
//       case "Pending":
//         return "bg-amber-100 text-amber-800";
//       case "Rejected":
//         return "bg-rose-100 text-rose-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const copyData = () => {
//     const dataStr = JSON.stringify(postings, null, 2);
//     navigator.clipboard.writeText(dataStr);
//     showSnackbar("Data copied to clipboard", "success");
//   };

//   const exportExcel = () => {
//     const data = postings.map((posting) => ({
//       Date: formatDate(posting.date),
//       Title: posting.title,
//       Category: posting.category,
//       Item: posting.item,
//       "Seed Type": posting.seedType,
//       Acres: posting.acres,
//       "Posted By": posting.postedBy.name,
//       "Contact Mobile": posting.postedBy.mobile,
//       Status: posting.status,
//       "Created Date": formatDate(posting.createdAt),
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Postings");
//     XLSX.writeFile(
//       wb,
//       `postings_${new Date().toISOString().split("T")[0]}.xlsx`
//     );
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(18);
//     doc.text("Postings Report", 14, 22);
//     doc.setFontSize(11);
//     doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
//     doc.text(`Total Postings: ${totalItems}`, 14, 37);

//     // Table
//     const tableColumn = [
//       "Date",
//       "Title",
//       "Category",
//       "Item",
//       "Seed Type",
//       "Posted By",
//       "Status",
//     ];
//     const tableRows = postings.map((posting) => [
//       formatDate(posting.date),
//       posting.title.substring(0, 20) +
//         (posting.title.length > 20 ? "..." : ""),
//       posting.category,
//       posting.item,
//       posting.seedType,
//       posting.postedBy.name.substring(0, 15),
//       posting.status,
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 45,
//       styles: { fontSize: 9, cellPadding: 3 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });

//     doc.save(`postings_${new Date().toISOString().split("T")[0]}.pdf`);
//   };

//   const printTable = () => {
//     const printContent = tableRef.current?.innerHTML;
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Postings Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f8fafc; font-weight: 600; }
//             .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//             @media print {
//               body { margin: 0; }
//               .no-print { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <h1>Postings Report</h1>
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
//   };

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedIds(postings.map((p) => p._id));
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
//     if (editingPosting) {
//       handleUpdatePosting(data);
//     } else {
//       handleCreatePosting(data);
//     }
//   };

//   const handleEditClick = (posting: Posting) => {
//     setEditingPosting(posting);
//     setFormModalOpen(true);
//     setModal({ type: null });
//   };

//   const handleAddNewClick = () => {
//     setEditingPosting(null);
//     setFormModalOpen(true);
//   };

//   const handleFormClose = () => {
//     setFormModalOpen(false);
//     setEditingPosting(null);
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-b relative overflow-x-auto from-gray-50 to-white text-black ">
//       {loading && postings.length === 0 && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-3">
//         <div className="flex items-center md:justify-between gap-x-4 mb-4">
//           <div className="flex items-center gap-3">
//             <div>
//               <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900">
//                 Postings Management
//               </h1>
//               <p className="text-xs sm:text-xs md:text-base text-gray-600 mt-1">
//                 Track and manage all agricultural postings
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleAddNewClick}
//             className="flex items-center text-xs gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
//           >
//             <FaPlus className="w-3 h-3" />
//             Add New Posting
//           </button>
//         </div>

//         {/* Status Indicators */}
//         <div className="flex flex-wrap gap-2 sm:gap-3">
//           {["Approved", "Pending", "Rejected"].map((status) => (
//             <div
//               key={status}
//               className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-zinc-300 shadow-xs"
//             >
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   status === "Approved"
//                     ? "bg-emerald-500"
//                     : status === "Pending"
//                     ? "bg-amber-500"
//                     : "bg-rose-500"
//                 }`}
//               />
//               <span className="text-xs font-medium text-gray-700">
//                 {status}
//               </span>
//               <span className="text-xs font-bold text-gray-900">
//                 ({postings.filter((d) => d.status === status).length})
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Posting Form Modal */}
//       <PostingFormModal
//         open={formModalOpen}
//         onClose={handleFormClose}
//         onSubmit={handleFormSubmit}
//         categories={category}
//         loading={formModalLoading}
//         initialData={editingPosting}
//         isEdit={!!editingPosting}
//       />

//       {/* Main Card */}
//       <div className="rounded-lg shadow-sm overflow-hidden  ">
//         {/* Toolbar */}
//         <div className="p-2 sm:p-3  bg-white">
//           <div className="flex flex-col gap-3">
//             {/* Search */}
//             <div className="relative flex lg:flex-row flex-col gap-x-3 gap-y-3">
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search postings..."
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
//               {/* Export & Print Buttons */}
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

//                   {/* Bulk Actions */}
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
//                       Status
//                     </label>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="Pending">Pending</option>
//                       <option value="Approved">Approved</option>
//                       <option value="Rejected">Rejected</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs sm:text-xs font-medium text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={filterCategory}
//                       onChange={(e) => setFilterCategory(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
//                     >
//                       <option value="all">All Categories</option>
//                       {category.map((cat, i) => (
//                         <option key={i} value={cat.categoryName}>
//                           {cat.categoryName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="sm:col-span-2 lg:col-span-1 flex items-end">
//                     <button
//                       onClick={() => {
//                         setFilterStatus("all");
//                         setFilterCategory("all");
//                         setSearchTerm("");
//                       }}
//                       className="w-fit px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
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
//                 <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase  w-10">
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedIds.length === postings.length &&
//                       postings.length > 0
//                     }
//                     onChange={(e) => handleSelectAll(e.target.checked)}
//                     className="rounded border-gray-300"
//                   />
//                 </th>
//                 {[
//                   "Date",
//                   "Title",
//                   "Category",
//                   "Item",
//                   "Seed Type",
//                   "Acres",
//                   "Posted By",
//                   "Mobile",
//                   "Status",
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
//               {postings.map((row) => (
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
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="w-4 h-4 text-gray-400" />
//                       <span className="text-xs font-medium text-gray-900">
//                         {formatDate(row.date)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="text-xs font-semibold text-gray-900">
//                       {row.title}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
//                       {row.category}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-xs font-medium text-gray-900">
//                     {row.item}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center gap-2">
//                       <FaSeedling className={`w-4 h-4 ${row.seedType === "Seed" ? "text-emerald-500" : "text-gray-400"}`} />
//                       <span className="text-xs text-gray-700">{row.seedType}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700">
//                       {row.acres}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-semibold mr-3">
//                         {row.postedBy?.name?.charAt(0) || "?"}
//                       </div>
//                       <div className="text-xs font-medium text-gray-900">
//                         {row.postedBy?.name || "N/A"}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span className="text-xs text-gray-700">
//                       {row.postedBy?.mobile || "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <span
//                       className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
//                         row.status
//                       )}`}
//                     >
//                       {row.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => setModal({ type: "view", row })}
//                         className="p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
//                         title="View"
//                       >
//                         <FaEye className="w-4 h-4" />
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
//           <div className="lg:hidden space-y-3 mt-2">
//             {postings.map((row) => (
//               <div
//                 key={row._id}
//                 className="bg-white border  border-gray-50 rounded shadow p-4"
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
//                         <span
//                           className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
//                             row.status
//                           )}`}
//                         >
//                           {row.status}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           <FaCalendarAlt className="inline w-3 h-3 mr-1" />
//                           {formatDate(row.date)}
//                         </span>
//                       </div>
//                       <h3 className="font-bold text-gray-900 text-base">
//                         {row.title}
//                       </h3>
//                       <p className="text-xs text-gray-600">
//                         {row.item} • {row.category}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => setModal({ type: "view", row })}
//                       className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-200"
//                     >
//                       <FaEye className="w-3.5 h-3.5" />
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
//                   <div className="flex items-center gap-2">
//                     <FaSeedling className={`w-4 h-4 ${row.seedType === "Seed" ? "text-emerald-500" : "text-gray-400"}`} />
//                     <span className="font-medium">Seed:</span>
//                     <span className="text-gray-700">{row.seedType}</span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Acres:</span>
//                     <span className="ml-2 font-bold text-gray-900">
//                       {row.acres}
//                     </span>
//                   </div>
//                   <div className="col-span-2">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-semibold mr-3">
//                         {row.postedBy?.name?.charAt(0) || "?"}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {row.postedBy?.name || "N/A"}
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           {row.postedBy?.mobile || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {!loading && postings.length === 0 && (
//             <div className="text-center py-12 px-4">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//                 <FaSearch className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 No postings found
//               </h3>
//               <p className="text-gray-600 max-w-md mx-auto text-xs">
//                 Try adjusting your search or filters to find what you're looking
//                 for.
//               </p>
//             </div>
//           )}

//           {/* Loading State */}
//           {loading && postings.length > 0 && (
//             <div className="flex justify-center py-4">
//               <CircularProgress size={24} />
//             </div>
//           )}
//         </div>

//         {/* Material-UI Pagination */}
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
//               {/* Items per page selector */}
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
//               size="medium"
//               shape="rounded"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Mobile Add Button (FAB) */}
//       <button
//         onClick={handleAddNewClick}
//         className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-30"
//       >
//         <FaPlus className="w-6 h-6" />
//       </button>

//       {/* View Modal */}
//       {modal.type === "view" && modal.row && (
//         <ViewModal row={modal.row} onClose={() => setModal({ type: null })} />
//       )}

//       {/* Delete Modal */}
//       {modal.type === "delete" && modal.row && (
//         <DeleteModal
//           row={modal.row}
//           onClose={() => setModal({ type: null })}
//           onDelete={() => handleDeletePosting(modal.row!._id)}
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

// const ViewModal = ({
//   row,
//   onClose,
// }: {
//   row: Posting;
//   onClose: () => void;
// }) => {
//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   return (
//     <Modal open onClose={onClose}>
//       <Box sx={modalStyle}>
//         <div className="flex items-center justify-between mb-4">
//           <Typography variant="h6" className="text-gray-900">
//             Posting Details
//           </Typography>
//           <IconButton onClick={onClose} size="small">
//             <FaTimes />
//           </IconButton>
//         </div>
//         <div className="space-y-4">
//           {Object.entries({
//             Date: formatDate(row.date),
//             Title: row.title,
//             Category: row.category,
//             Item: row.item,
//             "Seed Type": row.seedType,
//             Acres: row.acres,
//             "Posted By": row.postedBy?.name || "N/A",
//             "Mobile Number": row.postedBy?.mobile || "N/A",
//             Status: row.status,
//             "Created Date": formatDate(row.createdAt),
//             "Last Updated": formatDate(row.updatedAt),
//           }).map(([key, value]) => (
//             <div
//               key={key}
//               className="flex justify-between items-center py-2 border-b last:border-0"
//             >
//               <span className="text-xs font-medium text-gray-700">{key}:</span>
//               <span className="text-xs text-gray-900">{value}</span>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6 flex justify-end">
//           <Button
//             onClick={onClose}
//             variant="contained"
//             className="bg-gradient-to-r from-green-600 to-emerald-600"
//           >
//             Close
//           </Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// const DeleteModal = ({ row, onClose, onDelete }: any) => (
//   <Modal open onClose={onClose}>
//     <Box sx={modalStyle}>
//       <div className="text-center">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
//           <FaTrash className="w-8 h-8 text-red-600" />
//         </div>
//         <Typography variant="h6" className="mb-2 text-gray-900">
//           Delete Posting
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           Are you sure you want to delete the posting{" "}
//           <span className="font-bold text-gray-900">"{row.title}"</span>?
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
//           Delete {count} Postings
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           Are you sure you want to delete {count} selected postings?
//           <br />
//           This action cannot be undone.
//         </Typography>
//         <div className="flex justify-center gap-3">
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={onDelete} variant="contained" color="error">
//             Delete {count} Postings
//           </Button>
//         </div>
//       </div>
//     </Box>
//   </Modal>
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  FaSeedling,
  FaTimes,
  FaSpinner,
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
} from "@mui/material";

/* ================= TYPES ================= */

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
}

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
            <span className="text-lg font-semibold">
              {isEdit ? "Edit Crop Record" : "Add New Crop Record"}
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
                <option value="inorganic">Inorganic</option>
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
                <option value="local">Local</option>
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
  width: { xs: "90%", sm: "80%", md: 500 },
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
    type: "view" | "edit" | "delete" | "bulkDelete" | null;
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
        setCrops(response.data.data || []);
        setTotalItems(response.data.total || 0);
        setTotalPages(Math.ceil(response.data.total / limit) || 1);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
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
      local: "Local"
    };
    return labels[type] || type;
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const copyData = () => {
    const dataStr = JSON.stringify(crops, null, 2);
    navigator.clipboard.writeText(dataStr);
    showSnackbar("Data copied to clipboard", "success");
  };

  const exportExcel = () => {
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
  };

  const exportPDF = () => {
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
      crop.trackingId.substring(0, 15) + (crop.trackingId.length > 15 ? "..." : ""),
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
        <div className="flex items-center md:justify-between gap-x-4 mb-4">
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

        {/* Stats Indicators - Dynamically show counts for each farming type */}
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
                      onClick={() => {
                        setFilterFarmingType("all");
                        setFilterSeedType("all");
                        setSearchTerm("");
                      }}
                      className="w-fit px-4 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
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
                    <div className="text-xs font-medium text-gray-900">
                      {row.trackingId}
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
                        onClick={() => setModal({ type: "view", row })}
                        className="p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                        title="View"
                      >
                        <FaEye className="w-4 h-4" />
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
                      onClick={() => setModal({ type: "view", row })}
                      className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                      <FaEye className="w-3.5 h-3.5" />
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
                    <span className="ml-2 font-medium text-gray-900 truncate block">
                      {row.trackingId}
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
                Try adjusting your search or filters to find what you're looking
                for.
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
                onChange={(e) => setLimit(Number(e.target.value))}
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
              size="medium"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      {/* View Modal */}
      {modal.type === "view" && modal.row && (
        <ViewModal row={modal.row} onClose={() => setModal({ type: null })} />
      )}

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

interface ViewModalProps {
  row: Crop;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ row, onClose }) => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={modalStyle}>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="text-gray-900">
            Crop Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <FaTimes />
          </IconButton>
        </div>
        <div className="space-y-4">
          {Object.entries({
            "Farming Type": getFarmingTypeLabel(row.farmingType),
            "Seed Type": getSeedTypeLabel(row.seedType),
            "Acres": row.acres,
            "Sowing Date": formatDate(row.sowingDate),
            "Farmer ID": row.farmerId,
            "Tracking ID": row.trackingId,
            "Created Date": formatDate(row.createdAt),
            "Last Updated": row.updatedAt ? formatDate(row.updatedAt) : "N/A",
          }).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <span className="text-xs font-medium text-gray-700">{key}:</span>
              <span className="text-xs text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            variant="contained"
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

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