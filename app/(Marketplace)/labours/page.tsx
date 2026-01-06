
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaTrash,
//   FaEdit,
//   FaEye,
//   FaSearch,
//   FaUser,
//   FaUserFriends,
//   FaSeedling,
//   FaTools,
//   FaPlus,
//   FaFileExcel,
//   FaFilePdf,
//   FaPrint,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";
// import {
//   Modal,
//   Box,
//   Pagination,
//   Button,
//   Typography,
//   TextField,
//   Chip,
// } from "@mui/material";
// import { utils, writeFile } from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// interface Labour {
//   _id: string;
//   name: string;
//   villageName?: string;
//   contactNumber: string;
//   email?: string;
//   workTypes?: string[];
//   experience?: string;
//   availability?: string;
//   address?: string;
//   maleRequirement: number;
//   femaleRequirement: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// /* ================= MODAL STYLE ================= */

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "90%", sm: "80%", md: 500 },
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: { xs: 3, sm: 4 },
//   maxHeight: "90vh",
//   overflowY: "auto" as const,
// };

// /* ================= LABOUR FORM MODAL ================= */

// interface LabourFormModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   defaultData?: Labour | null;
// }

// function LabourFormModal({ open, onClose, onSubmit, defaultData }: LabourFormModalProps) {
//   const [form, setForm] = useState({
//     name: "",
//     villageName: "",
//     contactNumber: "",
//     email: "",
//     workTypes: "",
//     experience: "",
//     availability: "",
//     address: "",
//     maleRequirement: 0,
//     femaleRequirement: 0,
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // FIX: Update form when defaultData changes
//   useEffect(() => {
//     if (defaultData) {
//       setForm({
//         name: defaultData.name || "",
//         villageName: defaultData.villageName || "",
//         contactNumber: defaultData.contactNumber || "",
//         email: defaultData.email || "",
//         workTypes: defaultData.workTypes?.join(", ") || "",
//         experience: defaultData.experience || "",
//         availability: defaultData.availability || "",
//         address: defaultData.address || "",
//         maleRequirement: defaultData.maleRequirement || 0,
//         femaleRequirement: defaultData.femaleRequirement || 0,
//         isActive: defaultData.isActive ?? true,
//       });
//     } else {
//       // Reset form when adding new labour
//       setForm({
//         name: "",
//         villageName: "",
//         contactNumber: "",
//         email: "",
//         workTypes: "",
//         experience: "",
//         availability: "",
//         address: "",
//         maleRequirement: 0,
//         femaleRequirement: 0,
//         isActive: true,
//       });
//     }
//     // Clear errors when modal opens/closes
//     setErrors({});
//   }, [defaultData, open]); // Added open to dependency array

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//     }
    
//     if (!form.contactNumber.trim()) {
//       newErrors.contactNumber = "Contact number is required";
//     } else if (!/^\d{10}$/.test(form.contactNumber.replace(/\D/g, ''))) {
//       newErrors.contactNumber = "Enter a valid 10-digit phone number";
//     }
    
//     if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
//       newErrors.email = "Invalid email format";
//     }
    
//     if (form.maleRequirement < 0) {
//       newErrors.maleRequirement = "Cannot be negative";
//     }
    
//     if (form.femaleRequirement < 0) {
//       newErrors.femaleRequirement = "Cannot be negative";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     const formData = {
//       ...form,
//       workTypes: form.workTypes ? form.workTypes.split(",").map(item => item.trim()).filter(item => item) : [],
//       maleRequirement: Number(form.maleRequirement) || 0,
//       femaleRequirement: Number(form.femaleRequirement) || 0,
//     };

//     onSubmit(formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
    
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" className="mb-6">
//           {defaultData ? "Edit Labour" : "Add New Labour"}
//         </Typography>
        
//         <div className="space-y-4">
//           {/* Name */}
//           <TextField
//             label="Full Name *"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             error={!!errors.name}
//             helperText={errors.name}
//           />

//           <div className="grid grid-cols-2 my-2 gap-4">
//             {/* Contact Number */}
//             <TextField
//               label="Contact Number *"
//               name="contactNumber"
//               value={form.contactNumber}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               error={!!errors.contactNumber}
//               helperText={errors.contactNumber}
//             />

//             {/* Email */}
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               error={!!errors.email}
//               helperText={errors.email}
//             />
//           </div>

//           {/* Village Name */}
//          <div>
//            <TextField
//             label="Village Name"
//             name="villageName"
//             value={form.villageName}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//           />
//          </div>

//          <div>
//            {/* Address */}
//           <TextField
//             label="Address"
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             multiline
//             rows={2}
//           />
//          </div>

//           <div>
//             {/* Work Types */}
//           <TextField
//             label="Work Types (comma separated)"
//             name="workTypes"
//             value={form.workTypes}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., Planting, Harvesting, Weeding"
//           />
//           </div>

//           {/* Requirements */}
//           <div className="grid grid-cols-2 gap-4">
//             <TextField
//               label="Male Requirement"
//               name="maleRequirement"
//               type="number"
//               value={form.maleRequirement}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               error={!!errors.maleRequirement}
//               helperText={errors.maleRequirement}
//             />

//             <TextField
//               label="Female Requirement"
//               name="femaleRequirement"
//               type="number"
//               value={form.femaleRequirement}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               error={!!errors.femaleRequirement}
//               helperText={errors.femaleRequirement}
//             />
//           </div>

//           {/* Experience */}
//          <div>
//            <TextField
//             label="Experience"
//             name="experience"
//             value={form.experience}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., 5 years in farming"
//           />
//          </div>

//           {/* Availability */}
//           <TextField
//             label="Availability"
//             name="availability"
//             value={form.availability}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., Full-time, Part-time, Seasonal"
//           />

//           {/* Active Status */}
//           <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
//             <input
//               type="checkbox"
//               id="isActive"
//               name="isActive"
//               checked={form.isActive}
//               onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <label htmlFor="isActive" className="text-sm text-gray-700">
//               Active Labour
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} variant="contained" color="primary">
//             {defaultData ? "Update" : "Create"}
//           </Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// }

// /* ================= MAIN COMPONENT ================= */

// export default function LabourManagementPage() {
//   const [labours, setLabours] = useState<Labour[]>([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLabours, setTotalLabours] = useState(0);
  
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [currentLabour, setCurrentLabour] = useState<Labour | null>(null);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [loadingOverlay, setLoadingOverlay] = useState(false);

//   /* ================= GET LABOURS ================= */

//   const getLabours = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/labours", {
//         params: {
//           search,
//           page,
//           limit,
//         },
//       });
      
//       if (res.data.success) {
//         setLabours(res.data.data || []);
//         setTotalPages(res.data.totalPages || 1);
//         setTotalLabours(res.data.total || 0);
//       } else {
//         toast.error(res.data.message || "Failed to fetch labours");
//       }
//     } catch (error: any) {
//       console.error("Error fetching labours:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch labours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLabours();
//   }, [search, page, limit]);

//   /* ================= UPDATE ================= */

//   const handleUpdate = async (data: any) => {
//     if (!currentLabour) return;
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.put(`/api/labours/${currentLabour._id}`, data);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour updated successfully!");
//         setEditOpen(false);
//         setCurrentLabour(null);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error updating labour:", error);
//       toast.error(error.response?.data?.message || "Failed to update labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= DELETE ================= */

//   const handleDelete = async () => {
//     if (!currentLabour) return;
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.delete(`/api/labours/${currentLabour._id}`);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour deleted successfully!");
//         setDeleteOpen(false);
//         setCurrentLabour(null);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error deleting labour:", error);
//       toast.error(error.response?.data?.message || "Failed to delete labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= CREATE ================= */

//   const handleCreate = async (data: any) => {
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.post("/api/labours", data);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour created successfully!");
//         setAddOpen(false);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error creating labour:", error);
//       toast.error(error.response?.data?.message || "Failed to create labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= TOGGLE ACTIVE STATUS ================= */

//   const toggleActiveStatus = async (labour: Labour) => {
//     try {
//       await axios.put(`/api/labours/${labour._id}`, {
//         isActive: !labour.isActive
//       });
//       getLabours();
//       toast.success(`Labour ${!labour.isActive ? 'activated' : 'deactivated'} successfully!`);
//     } catch (error: any) {
//       console.error("Error toggling status:", error);
//       toast.error(error.response?.data?.message || "Failed to update status");
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const handleExportExcel = () => {
//     const data = labours.map((labour, index) => ({
//       "Sr.": index + 1 + (page - 1) * limit,
//       "Name": labour.name,
//       "Village": labour.villageName || "N/A",
//       "Contact": labour.contactNumber,
//       "Email": labour.email || "N/A",
//       "Work Types": (labour.workTypes || []).join(", "),
//       "Experience": labour.experience || "N/A",
//       "Availability": labour.availability || "N/A",
//       "Male Required": labour.maleRequirement,
//       "Female Required": labour.femaleRequirement,
//       "Total Required": labour.maleRequirement + labour.femaleRequirement,
//       "Status": labour.isActive ? "Active" : "Inactive",
//       "Created Date": new Date(labour.createdAt).toLocaleDateString(),
//     }));

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Labour List");
//     writeFile(wb, `labour-list-${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Labour Management Report", 14, 16);
    
//     const tableColumn = ["Sr.", "Name", "Contact", "Work Types", "Male", "Female", "Status"];
//     const tableRows = labours.map((labour, index) => [
//       index + 1 + (page - 1) * limit,
//       labour.name,
//       labour.contactNumber,
//       (labour.workTypes || []).slice(0, 2).join(", "),
//       labour.maleRequirement,
//       labour.femaleRequirement,
//       labour.isActive ? "Active" : "Inactive"
//     ]);
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });
    
//     doc.save(`labour-report-${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   /* ================= PRINT FUNCTION ================= */

//   const handlePrint = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Labour Management Report</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             color: #333;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//             padding-bottom: 15px;
//             border-bottom: 2px solid #4CAF50;
//           }
//           .header h1 {
//             margin: 0 0 10px 0;
//             color: #1f2937;
//             font-size: 24px;
//           }
//           .header-info {
//             color: #6b7280;
//             font-size: 14px;
//             margin: 5px 0;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//             font-size: 12px;
//           }
//           th {
//             background-color: #f3f4f6;
//             color: #374151;
//             font-weight: 600;
//             padding: 12px 8px;
//             text-align: left;
//             border: 1px solid #d1d5db;
//           }
//           td {
//             padding: 10px 8px;
//             border: 1px solid #e5e7eb;
//             vertical-align: top;
//           }
//           tr:nth-child(even) {
//             background-color: #f9fafb;
//           }
//           .status-active {
//             color: #10b981;
//             font-weight: 600;
//           }
//           .status-inactive {
//             color: #ef4444;
//             font-weight: 600;
//           }
//           .work-types {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 4px;
//           }
//           .work-chip {
//             background: #e0f2fe;
//             color: #0369a1;
//             padding: 2px 8px;
//             border-radius: 12px;
//             font-size: 11px;
//             margin: 1px;
//           }
//           .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             font-size: 12px;
//             color: #6b7280;
//             text-align: center;
//           }
//           @media print {
//             @page {
//               size: landscape;
//               margin: 0.5in;
//             }
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//             .no-print {
//               display: none !important;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>👷 Labour Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Labours: ${totalLabours} | Showing: ${labours.length} records</div>
//           <div class="header-info">Page: ${page} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Village</th>
//               <th>Work Types</th>
//               <th>Male Required</th>
//               <th>Female Required</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Experience</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${labours.map((labour, index) => `
//               <tr>
//                 <td>${index + 1 + (page - 1) * limit}</td>
//                 <td><strong>${labour.name}</strong></td>
//                 <td>${labour.contactNumber}<br/><small>${labour.email || ''}</small></td>
//                 <td>${labour.villageName || 'N/A'}</td>
//                 <td>
//                   <div class="work-types">
//                     ${(labour.workTypes || []).map((type: string) => `<span class="work-chip">${type}</span>`).join('')}
//                   </div>
//                 </td>
//                 <td><strong>${labour.maleRequirement}</strong></td>
//                 <td><strong>${labour.femaleRequirement}</strong></td>
//                 <td><strong class="total-count">${labour.maleRequirement + labour.femaleRequirement}</strong></td>
//                 <td class="${labour.isActive ? 'status-active' : 'status-inactive'}">
//                   ${labour.isActive ? 'Active' : 'Inactive'}
//                 </td>
//                 <td>${labour.experience || 'N/A'}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
        
//         <div class="footer">
//           <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               if (confirm('Close print window?')) {
//                 window.close();
//               }
//             }, 100);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//   };

//   /* ================= FORMAT FUNCTIONS ================= */

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loadingOverlay && (
//         <div className="min-h-screen fixed w-full top-0 left-0 bg-[#fdfbfb8c] z-[9999] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-3 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Labour Management</h1>
//           <p className="text-gray-600 mt-2">
//             Manage labour profiles and their requirements. {totalLabours} labours found.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={() => setAddOpen(true)} 
//             className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
//           >
//             <FaPlus /> Add Labour
//           </button>
//         </div>
//       </div>

//       {/* Add/Edit Form Modal */}
//       <LabourFormModal 
//         open={addOpen || editOpen}
//         onClose={() => {
//           setAddOpen(false);
//           setEditOpen(false);
//           setCurrentLabour(null);
//         }}
//         onSubmit={editOpen ? handleUpdate : handleCreate}
//         defaultData={editOpen ? currentLabour : null}
//       />

//       {/* Export Buttons Section */}
//       <div className="flex lg:hidden flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] mb-4">
//         <button
//           onClick={handleExportExcel}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
//         >
//           <FaFileExcel /> 
//         </button>
//         <button
//           onClick={handleExportPDF}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
//         >
//           <FaFilePdf /> 
//         </button>
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
//         >
//           <FaPrint /> 
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white lg:rounded shadow p-[.6rem] text-sm md:p-3 lg:mb-0 mb-4">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap sm:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="flex gap-x-4 w-full md:w-auto">
//             <div className="relative w-full">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, village, contact, work..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex gap-[.6rem] text-sm">
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setPage(1);
//               }}
//               className="flex-1 px-4 w-fit py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Reset
//             </button>
//             <button
//               onClick={getLabours}
//               className="flex-1 px-4 w-fit py-2 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
//             >
//               Apply
//             </button>
//           </div>

//           {/* Export Buttons Section */}
//           <div className="hidden lg:flex ml-auto flex-wrap gap-[.6rem] mb-1 text-sm bg-white">
//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
//             >
//               <FaFileExcel />
//             </button>
//             <button
//               onClick={handleExportPDF}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
//             >
//               <FaFilePdf />
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
//             >
//               <FaPrint />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && labours.length === 0 && (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && labours.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Labour Details</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Work Types</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Requirements</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {labours.map((labour, index) => (
//                   <tr key={labour._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * limit}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{labour.name}</div>
//                       <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                         <FaPhone className="text-xs" /> {labour.contactNumber}
//                       </div>
//                       {labour.email && (
//                         <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                           <FaEnvelope className="text-xs" /> {labour.email}
//                         </div>
//                       )}
//                       {labour.villageName && (
//                         <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                           <FaMapMarkerAlt className="text-xs" /> {labour.villageName}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex flex-wrap gap-1">
//                         {(labour.workTypes || []).slice(0, 3).map((type, idx) => (
//                           <span 
//                             key={idx}
//                             className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                           >
//                             {type}
//                           </span>
//                         ))}
//                         {(labour.workTypes || []).length > 3 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                             +{(labour.workTypes || []).length - 3} more
//                           </span>
//                         )}
//                       </div>
//                       {labour.experience && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           Exp: {labour.experience}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="flex items-center gap-1">
//                             <FaUser className="text-blue-500" />
//                             <span className="font-semibold">{labour.maleRequirement}</span>
//                           </div>
//                           <div className="text-xs text-gray-500">Male</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="flex items-center gap-1">
//                             <FaUserFriends className="text-pink-500" />
//                             <span className="font-semibold">{labour.femaleRequirement}</span>
//                           </div>
//                           <div className="text-xs text-gray-500">Female</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-bold text-green-700">
//                             {labour.maleRequirement + labour.femaleRequirement}
//                           </div>
//                           <div className="text-xs text-gray-500">Total</div>
//                         </div>
//                       </div>
//                       {labour.availability && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           Avail: {labour.availability}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <button
//                         onClick={() => toggleActiveStatus(labour)}
//                         className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
//                           labour.isActive 
//                             ? "bg-green-100 text-green-800 hover:bg-green-200" 
//                             : "bg-red-100 text-red-800 hover:bg-red-200"
//                         }`}
//                       >
//                         {labour.isActive ? (
//                           <>
//                             <FaCheckCircle /> Active
//                           </>
//                         ) : (
//                           <>
//                             <FaTimesCircle /> Inactive
//                           </>
//                         )}
//                       </button>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {formatDate(labour.createdAt)}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setViewOpen(true);
//                           }}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setEditOpen(true);
//                           }}
//                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setDeleteOpen(true);
//                           }}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-3">
//             {labours.map((labour, index) => (
//               <div key={labour._id} className="rounded p-4 border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * limit}</span>
//                     <h3 className="text-lg font-semibold mt-1">{labour.name}</h3>
//                     <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <FaPhone /> {labour.contactNumber}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => toggleActiveStatus(labour)}
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       labour.isActive 
//                         ? "bg-green-100 text-green-800" 
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {labour.isActive ? "Active" : "Inactive"}
//                   </button>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <div className="text-sm text-gray-500">Village</div>
//                     <div>{labour.villageName || "N/A"}</div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <div className="text-sm text-gray-500">Male Required</div>
//                       <div className="font-bold text-blue-600">{labour.maleRequirement}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">Female Required</div>
//                       <div className="font-bold text-pink-600">{labour.femaleRequirement}</div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="text-sm text-gray-500">Work Types</div>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {(labour.workTypes || []).map((type, idx) => (
//                         <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                           {type}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2 pt-3">
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setViewOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded"
//                     >
//                       <FaEye /> View
//                     </button>
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setEditOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setDeleteOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && labours.length === 0 && (
//         <div className="text-center py-12 bg-white rounded shadow">
//           <div className="text-gray-400 text-6xl mb-4">👷</div>
//           <h3 className="text-xl font-semibold mb-2">No labour records found</h3>
//           <p className="text-gray-500 mb-6">Try adjusting your search or add a new labour</p>
//           <button 
//             onClick={() => setAddOpen(true)} 
//             className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
//           >
//             <FaPlus /> Add New Labour
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {labours.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-4 shadow rounded justify-between items-center gap-3 mt-4">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (page - 1) * limit}-{Math.min(page * limit, totalLabours)}</span> of{" "}
//             <span className="font-semibold">{totalLabours}</span> records
//             <select 
//               value={limit} 
//               onChange={(e) => {
//                 setLimit(Number(e.target.value));
//                 setPage(1);
//               }} 
//               className="p-2 ml-3 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {[5, 10, 20, 30, 50].map((value) => (
//                 <option key={value} value={value}>{value} per page</option>
//               ))}
//             </select>
//           </div>
          
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={(event, value) => setPage(value)}
//             color="primary"
//             shape="rounded"
//           />
//         </div>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
//         <Box sx={modalStyle}>
//           {currentLabour && (
//             <>
//               <Typography variant="h6" className="mb-6 flex items-center gap-2">
//                 <FaEye className="text-blue-500" />
//                 Labour Details
//               </Typography>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Labour ID</div>
//                     <div className="font-medium text-sm truncate">{currentLabour._id}</div>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Status</div>
//                     <div className={`font-medium flex items-center gap-1 ${currentLabour.isActive ? 'text-green-600' : 'text-red-600'}`}>
//                       {currentLabour.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
//                       {currentLabour.isActive ? 'Active' : 'Inactive'}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-2">Personal Details</div>
//                   <div className="font-medium text-lg">{currentLabour.name}</div>
//                   <div className="flex items-center gap-2 mt-2">
//                     <FaPhone className="text-sm text-gray-500" />
//                     <span>{currentLabour.contactNumber}</span>
//                   </div>
//                   {currentLabour.email && (
//                     <div className="flex items-center gap-2 mt-1">
//                       <FaEnvelope className="text-sm text-gray-500" />
//                       <span>{currentLabour.email}</span>
//                     </div>
//                   )}
//                   {currentLabour.villageName && (
//                     <div className="flex items-center gap-2 mt-1">
//                       <FaMapMarkerAlt className="text-sm text-gray-500" />
//                       <span>{currentLabour.villageName}</span>
//                     </div>
//                   )}
//                 </div>
                
//                 {currentLabour.address && (
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Address</div>
//                     <div>{currentLabour.address}</div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-3">
//                   {currentLabour.experience && (
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="text-sm text-gray-500">Experience</div>
//                       <div className="font-medium">{currentLabour.experience}</div>
//                     </div>
//                   )}
//                   {currentLabour.availability && (
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="text-sm text-gray-500">Availability</div>
//                       <div className="font-medium">{currentLabour.availability}</div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-2">Work Requirements</div>
//                   <div className="grid grid-cols-3 gap-4 mb-3">
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Male</div>
//                       <div className="font-bold text-blue-700 text-xl">{currentLabour.maleRequirement}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Female</div>
//                       <div className="font-bold text-pink-700 text-xl">{currentLabour.femaleRequirement}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Total</div>
//                       <div className="font-bold text-green-700 text-2xl">
//                         {currentLabour.maleRequirement + currentLabour.femaleRequirement}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {(currentLabour.workTypes || []).length > 0 && (
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-2">Work Types</div>
//                     <div className="flex flex-wrap gap-2">
//                       {(currentLabour.workTypes || []).map((type, idx) => (
//                         <Chip
//                           key={idx}
//                           label={type}
//                           size="small"
//                           className="bg-blue-100 text-blue-800"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Created</div>
//                     <div>{formatDate(currentLabour.createdAt)}</div>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Updated</div>
//                     <div>{formatDate(currentLabour.updatedAt)}</div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-end mt-8 pt-4 border-t">
//                 <Button 
//                   onClick={() => setViewOpen(false)} 
//                   variant="contained"
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Close
//                 </Button>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <Typography variant="h6" className="mb-2">
//               Delete Labour Record?
//             </Typography>
//             <Typography className="text-gray-600 mb-6">
//               Are you sure you want to delete the labour record for{" "}
//               <span className="font-medium">{currentLabour?.name}</span>? 
//               This action cannot be undone.
//             </Typography>
//             <div className="flex justify-center gap-3">
//               <Button onClick={() => setDeleteOpen(false)} variant="outlined">
//                 Cancel
//               </Button>
//               <Button onClick={handleDelete} variant="contained" color="error">
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// }

















// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaTrash,
//   FaEdit,
//   FaEye,
//   FaSearch,
//   FaUser,
//   FaUserFriends,
//   FaSeedling,
//   FaTools,
//   FaPlus,
//   FaFileExcel,
//   FaFilePdf,
//   FaPrint,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaCopy,
//   FaFileCsv,
// } from "react-icons/fa";
// import {
//   Modal,
//   Box,
//   Pagination,
//   Button,
//   Typography,
//   TextField,
//   Chip,
// } from "@mui/material";
// import { utils, writeFile } from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// interface Labour {
//   _id: string;
//   name: string;
//   villageName?: string;
//   contactNumber: string;
//   email?: string;
//   workTypes?: string[];
//   experience?: string;
//   availability?: string;
//   address?: string;
//   maleRequirement: number;
//   femaleRequirement: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// /* ================= MODAL STYLE ================= */

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "90%", sm: "80%", md: 500 },
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: { xs: 3, sm: 4 },
//   maxHeight: "90vh",
//   overflowY: "auto" as const,
// };

// /* ================= LABOUR FORM MODAL ================= */

// interface LabourFormModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   defaultData?: Labour | null;
// }

// function LabourFormModal({ open, onClose, onSubmit, defaultData }: LabourFormModalProps) {
//   const [form, setForm] = useState({
//     name: "",
//     villageName: "",
//     contactNumber: "",
//     email: "",
//     workTypes: "",
//     experience: "",
//     availability: "",
//     address: "",
//     maleRequirement: 0,
//     femaleRequirement: 0,
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // FIX: Update form when defaultData changes
//   useEffect(() => {
//     if (defaultData) {
//       setForm({
//         name: defaultData.name || "",
//         villageName: defaultData.villageName || "",
//         contactNumber: defaultData.contactNumber || "",
//         email: defaultData.email || "",
//         workTypes: defaultData.workTypes?.join(", ") || "",
//         experience: defaultData.experience || "",
//         availability: defaultData.availability || "",
//         address: defaultData.address || "",
//         maleRequirement: defaultData.maleRequirement || 0,
//         femaleRequirement: defaultData.femaleRequirement || 0,
//         isActive: defaultData.isActive ?? true,
//       });
//     } else {
//       // Reset form when adding new labour
//       setForm({
//         name: "",
//         villageName: "",
//         contactNumber: "",
//         email: "",
//         workTypes: "",
//         experience: "",
//         availability: "",
//         address: "",
//         maleRequirement: 0,
//         femaleRequirement: 0,
//         isActive: true,
//       });
//     }
//     // Clear errors when modal opens/closes
//     setErrors({});
//   }, [defaultData, open]); // Added open to dependency array

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//     }
    
//     if (!form.contactNumber.trim()) {
//       newErrors.contactNumber = "Contact number is required";
//     } else if (!/^\d{10}$/.test(form.contactNumber.replace(/\D/g, ''))) {
//       newErrors.contactNumber = "Enter a valid 10-digit phone number";
//     }
    
//     if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
//       newErrors.email = "Invalid email format";
//     }
    
//     if (form.maleRequirement < 0) {
//       newErrors.maleRequirement = "Cannot be negative";
//     }
    
//     if (form.femaleRequirement < 0) {
//       newErrors.femaleRequirement = "Cannot be negative";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     const formData = {
//       ...form,
//       workTypes: form.workTypes ? form.workTypes.split(",").map(item => item.trim()).filter(item => item) : [],
//       maleRequirement: Number(form.maleRequirement) || 0,
//       femaleRequirement: Number(form.femaleRequirement) || 0,
//     };

//     onSubmit(formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
    
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" className="mb-6">
//           {defaultData ? "Edit Labour" : "Add New Labour"}
//         </Typography>
        
//         <div className="space-y-4">
//           {/* Name */}
//           <TextField
//             label="Full Name *"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             error={!!errors.name}
//             helperText={errors.name}
//           />

//           <div className="grid grid-cols-2 my-2 gap-4">
//             {/* Contact Number */}
//             <TextField
//               label="Contact Number *"
//               name="contactNumber"
//               value={form.contactNumber}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               error={!!errors.contactNumber}
//               helperText={errors.contactNumber}
//             />

//             {/* Email */}
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               error={!!errors.email}
//               helperText={errors.email}
//             />
//           </div>

//           {/* Village Name */}
//          <div>
//            <TextField
//             label="Village Name"
//             name="villageName"
//             value={form.villageName}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//           />
//          </div>

//          <div>
//            {/* Address */}
//           <TextField
//             label="Address"
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             multiline
//             rows={2}
//           />
//          </div>

//           <div>
//             {/* Work Types */}
//           <TextField
//             label="Work Types (comma separated)"
//             name="workTypes"
//             value={form.workTypes}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., Planting, Harvesting, Weeding"
//           />
//           </div>

//           {/* Requirements */}
//           <div className="grid grid-cols-2 gap-4">
//             <TextField
//               label="Male Requirement"
//               name="maleRequirement"
//               type="number"
//               value={form.maleRequirement}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               error={!!errors.maleRequirement}
//               helperText={errors.maleRequirement}
//             />

//             <TextField
//               label="Female Requirement"
//               name="femaleRequirement"
//               type="number"
//               value={form.femaleRequirement}
//               onChange={handleChange}
//               fullWidth
//               size="small"
//               inputProps={{ min: 0 }}
//               error={!!errors.femaleRequirement}
//               helperText={errors.femaleRequirement}
//             />
//           </div>

//           {/* Experience */}
//          <div>
//            <TextField
//             label="Experience"
//             name="experience"
//             value={form.experience}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., 5 years in farming"
//           />
//          </div>

//           {/* Availability */}
//           <TextField
//             label="Availability"
//             name="availability"
//             value={form.availability}
//             onChange={handleChange}
//             fullWidth
//             size="small"
//             placeholder="e.g., Full-time, Part-time, Seasonal"
//           />

//           {/* Active Status */}
//           <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
//             <input
//               type="checkbox"
//               id="isActive"
//               name="isActive"
//               checked={form.isActive}
//               onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <label htmlFor="isActive" className="text-sm text-gray-700">
//               Active Labour
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
//           <Button onClick={onClose} variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} variant="contained" color="primary">
//             {defaultData ? "Update" : "Create"}
//           </Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// }

// /* ================= MAIN COMPONENT ================= */

// export default function LabourManagementPage() {
//   const [labours, setLabours] = useState<Labour[]>([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLabours, setTotalLabours] = useState(0);
  
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [currentLabour, setCurrentLabour] = useState<Labour | null>(null);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [loadingOverlay, setLoadingOverlay] = useState(false);

//   /* ================= GET LABOURS ================= */

//   const getLabours = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/labours", {
//         params: {
//           search,
//           page,
//           limit,
//         },
//       });
      
//       if (res.data.success) {
//         setLabours(res.data.data || []);
//         setTotalPages(res.data.totalPages || 1);
//         setTotalLabours(res.data.total || 0);
//       } else {
//         toast.error(res.data.message || "Failed to fetch labours");
//       }
//     } catch (error: any) {
//       console.error("Error fetching labours:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch labours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLabours();
//   }, [search, page, limit]);

//   /* ================= UPDATE ================= */

//   const handleUpdate = async (data: any) => {
//     if (!currentLabour) return;
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.put(`/api/labours/${currentLabour._id}`, data);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour updated successfully!");
//         setEditOpen(false);
//         setCurrentLabour(null);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error updating labour:", error);
//       toast.error(error.response?.data?.message || "Failed to update labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= DELETE ================= */

//   const handleDelete = async () => {
//     if (!currentLabour) return;
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.delete(`/api/labours/${currentLabour._id}`);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour deleted successfully!");
//         setDeleteOpen(false);
//         setCurrentLabour(null);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error deleting labour:", error);
//       toast.error(error.response?.data?.message || "Failed to delete labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= CREATE ================= */

//   const handleCreate = async (data: any) => {
//     setLoadingOverlay(true);
//     try {
//       const response = await axios.post("/api/labours", data);
//       if (response.data.success) {
//         getLabours();
//         toast.success("Labour created successfully!");
//         setAddOpen(false);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error: any) {
//       console.error("Error creating labour:", error);
//       toast.error(error.response?.data?.message || "Failed to create labour");
//     } finally {
//       setLoadingOverlay(false);
//     }
//   };

//   /* ================= TOGGLE ACTIVE STATUS ================= */

//   const toggleActiveStatus = async (labour: Labour) => {
//     try {
//       await axios.put(`/api/labours/${labour._id}`, {
//         isActive: !labour.isActive
//       });
//       getLabours();
//       toast.success(`Labour ${!labour.isActive ? 'activated' : 'deactivated'} successfully!`);
//     } catch (error: any) {
//       console.error("Error toggling status:", error);
//       toast.error(error.response?.data?.message || "Failed to update status");
//     }
//   };

//   /* ================= FORMAT DATE FOR CSV ================= */

//   const formatDateForCSV = (dateString: string) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       // Format as YYYY-MM-DD HH:MM:SS (Excel-friendly format)
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');
//       return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     } catch (error) {
//       return "";
//     }
//   };

//   /* ================= COPY DATA FUNCTION ================= */

//   const handleCopyData = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to copy");
//       return;
//     }

//     try {
//       // Create table header
//       const headers = ["Sr.", "Name", "Contact", "Email", "Village", "Work Types", "Experience", "Availability", "Male Req", "Female Req", "Total", "Status", "Address", "Created Date"];
      
//       // Create table rows
//       const rows = labours.map((labour, index) => [
//         (index + 1 + (page - 1) * limit).toString(),
//         labour.name || "",
//         `'${labour.contactNumber}` || "", // Add apostrophe to keep full number
//         labour.email || "",
//         labour.villageName || "N/A",
//         (labour.workTypes || []).join(", ") || "N/A",
//         labour.experience || "N/A",
//         labour.availability || "N/A",
//         labour.maleRequirement.toString(),
//         labour.femaleRequirement.toString(),
//         (labour.maleRequirement + labour.femaleRequirement).toString(),
//         labour.isActive ? "Active" : "Inactive",
//         labour.address || "",
//         formatDateForCSV(labour.createdAt)
//       ]);
      
//       // Calculate column widths
//       const columnWidths = headers.map((header, colIndex) => {
//         const maxHeaderLength = header.length;
//         const maxDataLength = Math.max(...rows.map(row => {
//           const cell = row[colIndex] || "";
//           return cell.toString().length;
//         }));
//         return Math.max(maxHeaderLength, maxDataLength, 8);
//       });
      
//       // Create formatted table string
//       let tableString = "Labour Management Data\n";
//       tableString += "=".repeat(50) + "\n\n";
      
//       // Add header
//       tableString += headers.map((header, i) => 
//         header.padEnd(columnWidths[i])
//       ).join(" | ") + "\n";
      
//       // Add separator line
//       tableString += headers.map((_, i) => 
//         "-".repeat(columnWidths[i])
//       ).join("-+-") + "\n";
      
//       // Add data rows
//       rows.forEach(row => {
//         tableString += row.map((cell, i) => {
//           const cellStr = cell?.toString() || "";
//           return cellStr.padEnd(columnWidths[i]);
//         }).join(" | ") + "\n";
//       });
      
//       // Add summary
//       tableString += `\nTotal Labours: ${totalLabours}\n`;
//       tableString += `Page: ${page} of ${totalPages}\n`;
//       tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
//       // Copy to clipboard
//       navigator.clipboard.writeText(tableString);
//       toast.success("Labour data copied to clipboard!");
//     } catch (error) {
//       console.error("Error copying data:", error);
//       toast.error("Failed to copy data");
//     }
//   };

//   /* ================= CSV EXPORT FUNCTION ================= */

//   const handleExportCSV = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to export");
//       return;
//     }

//     try {
//       // Create CSV header - simplified column names
//       const headers = [
//         "Sr.", 
//         "Name", 
//         "Contact Number", 
//         "Email", 
//         "Village", 
//         "Work Types", 
//         "Experience", 
//         "Availability", 
//         "Male Required", 
//         "Female Required", 
//         "Total Required", 
//         "Status", 
//         "Address", 
//         "Created Date"
//       ];
      
//       // Create CSV rows
//       const rows = labours.map((labour, index) => [
//         (index + 1 + (page - 1) * limit).toString(),
//         labour.name || "",
//         `="${labour.contactNumber}"` || "", // Force text format for phone numbers
//         labour.email || "",
//         labour.villageName || "",
//         (labour.workTypes || []).join("; ") || "",
//         labour.experience || "",
//         labour.availability || "",
//         labour.maleRequirement.toString(),
//         labour.femaleRequirement.toString(),
//         (labour.maleRequirement + labour.femaleRequirement).toString(),
//         labour.isActive ? "Active" : "Inactive",
//         labour.address || "",
//         formatDateForCSV(labour.createdAt) // Use proper date format
//       ]);
      
//       // Convert to CSV format with proper escaping
//       const csvContent = [
//         headers.join(","), // Header row
//         ...rows.map(row => 
//           row.map(cell => {
//             const cellStr = String(cell || "");
            
//             // Escape cells that contain special characters
//             if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') || cellStr.includes('\r')) {
//               // Escape double quotes by doubling them
//               return `"${cellStr.replace(/"/g, '""')}"`;
//             }
//             return cellStr;
//           }).join(",")
//         )
//       ].join("\n");
      
//       // Create blob and download with BOM for UTF-8
//       const BOM = '\uFEFF';
//       const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
      
//       link.setAttribute("href", url);
//       link.setAttribute("download", `labour-list-${new Date().toISOString().split("T")[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       toast.success("CSV exported successfully!");
//     } catch (error) {
//       console.error("Error exporting CSV:", error);
//       toast.error("Failed to export CSV");
//     }
//   };

//   /* ================= EXCEL EXPORT FUNCTION ================= */

//   const handleExportExcel = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to export");
//       return;
//     }

//     try {
//       const data = labours.map((labour, index) => ({
//         "Sr.": index + 1 + (page - 1) * limit,
//         "Name": labour.name,
//         "Village": labour.villageName || "N/A",
//         "Contact": `="${labour.contactNumber}"`, // Force text format
//         "Email": labour.email || "N/A",
//         "Work Types": (labour.workTypes || []).join(", "),
//         "Experience": labour.experience || "N/A",
//         "Availability": labour.availability || "N/A",
//         "Male Required": labour.maleRequirement,
//         "Female Required": labour.femaleRequirement,
//         "Total Required": labour.maleRequirement + labour.femaleRequirement,
//         "Status": labour.isActive ? "Active" : "Inactive",
//         "Created Date": formatDateForCSV(labour.createdAt), // Use proper date format
//         "Address": labour.address || ""
//       }));

//       const ws = utils.json_to_sheet(data);
//       const wb = utils.book_new();
//       utils.book_append_sheet(wb, ws, "Labour List");
//       writeFile(wb, `labour-list-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel exported successfully!");
//     } catch (error) {
//       console.error("Error exporting Excel:", error);
//       toast.error("Failed to export Excel");
//     }
//   };

//   /* ================= PDF EXPORT FUNCTION ================= */

//   const handleExportPDF = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Labour Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Name", "Contact", "Work Types", "Male", "Female", "Status"];
//       const tableRows = labours.map((labour, index) => [
//         index + 1 + (page - 1) * limit,
//         labour.name,
//         labour.contactNumber,
//         (labour.workTypes || []).slice(0, 2).join(", "),
//         labour.maleRequirement,
//         labour.femaleRequirement,
//         labour.isActive ? "Active" : "Inactive"
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [59, 130, 246] },
//       });
      
//       doc.save(`labour-report-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF exported successfully!");
//     } catch (error) {
//       console.error("Error exporting PDF:", error);
//       toast.error("Failed to export PDF");
//     }
//   };

//   /* ================= PRINT FUNCTION ================= */

//   const handlePrint = () => {
//     if (labours.length === 0) {
//       toast.error("No labour data to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Labour Management Report</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             color: #333;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//             padding-bottom: 15px;
//             border-bottom: 2px solid #4CAF50;
//           }
//           .header h1 {
//             margin: 0 0 10px 0;
//             color: #1f2937;
//             font-size: 24px;
//           }
//           .header-info {
//             color: #6b7280;
//             font-size: 14px;
//             margin: 5px 0;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//             font-size: 12px;
//           }
//           th {
//             background-color: #f3f4f6;
//             color: #374151;
//             font-weight: 600;
//             padding: 12px 8px;
//             text-align: left;
//             border: 1px solid #d1d5db;
//           }
//           td {
//             padding: 10px 8px;
//             border: 1px solid #e5e7eb;
//             vertical-align: top;
//           }
//           tr:nth-child(even) {
//             background-color: #f9fafb;
//           }
//           .status-active {
//             color: #10b981;
//             font-weight: 600;
//           }
//           .status-inactive {
//             color: #ef4444;
//             font-weight: 600;
//           }
//           .work-types {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 4px;
//           }
//           .work-chip {
//             background: #e0f2fe;
//             color: #0369a1;
//             padding: 2px 8px;
//             border-radius: 12px;
//             font-size: 11px;
//             margin: 1px;
//           }
//           .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             font-size: 12px;
//             color: #6b7280;
//             text-align: center;
//           }
//           @media print {
//             @page {
//               size: landscape;
//               margin: 0.5in;
//             }
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//             .no-print {
//               display: none !important;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>👷 Labour Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Labours: ${totalLabours} | Showing: ${labours.length} records</div>
//           <div class="header-info">Page: ${page} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Village</th>
//               <th>Work Types</th>
//               <th>Male Required</th>
//               <th>Female Required</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Experience</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${labours.map((labour, index) => `
//               <tr>
//                 <td>${index + 1 + (page - 1) * limit}</td>
//                 <td><strong>${labour.name}</strong></td>
//                 <td>${labour.contactNumber}<br/><small>${labour.email || ''}</small></td>
//                 <td>${labour.villageName || 'N/A'}</td>
//                 <td>
//                   <div class="work-types">
//                     ${(labour.workTypes || []).map((type: string) => `<span class="work-chip">${type}</span>`).join('')}
//                   </div>
//                 </td>
//                 <td><strong>${labour.maleRequirement}</strong></td>
//                 <td><strong>${labour.femaleRequirement}</strong></td>
//                 <td><strong class="total-count">${labour.maleRequirement + labour.femaleRequirement}</strong></td>
//                 <td class="${labour.isActive ? 'status-active' : 'status-inactive'}">
//                   ${labour.isActive ? 'Active' : 'Inactive'}
//                 </td>
//                 <td>${labour.experience || 'N/A'}</td>
//                 <td>${formatDateForCSV(labour.createdAt)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
        
//         <div class="footer">
//           <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               if (confirm('Close print window?')) {
//                 window.close();
//               }
//             }, 100);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     toast.success("Print dialog opened!");
//   };

//   /* ================= FORMAT FUNCTIONS ================= */

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loadingOverlay && (
//         <div className="min-h-screen fixed w-full top-0 left-0 bg-[#fdfbfb8c] z-[9999] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-3 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Labour Management</h1>
//           <p className="text-gray-600 mt-2">
//             Manage labour profiles and their requirements. {totalLabours} labours found.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={() => setAddOpen(true)} 
//             className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
//           >
//             <FaPlus /> Add Labour
//           </button>
//         </div>
//       </div>

//       {/* Add/Edit Form Modal */}
//       <LabourFormModal 
//         open={addOpen || editOpen}
//         onClose={() => {
//           setAddOpen(false);
//           setEditOpen(false);
//           setCurrentLabour(null);
//         }}
//         onSubmit={editOpen ? handleUpdate : handleCreate}
//         defaultData={editOpen ? currentLabour : null}
//       />

//       {/* Export Buttons Section (Mobile) */}
//       <div className="flex lg:hidden flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] mb-4">
//         <button
//           onClick={handleCopyData}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
//           title="Copy Data"
//         >
//           <FaCopy /> 
//         </button>
//         <button
//           onClick={handleExportCSV}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium"
//           title="Export CSV"
//         >
//           <FaFileCsv /> 
//         </button>
//         <button
//           onClick={handleExportExcel}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
//           title="Export Excel"
//         >
//           <FaFileExcel /> 
//         </button>
//         <button
//           onClick={handleExportPDF}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
//           title="Export PDF"
//         >
//           <FaFilePdf /> 
//         </button>
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
//           title="Print"
//         >
//           <FaPrint /> 
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white lg:rounded shadow p-[.6rem] text-sm md:p-3 lg:mb-0 mb-4">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap sm:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="flex gap-x-4 w-full md:w-auto">
//             <div className="relative w-full">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, village, contact, work..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex gap-[.6rem] text-sm">
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setPage(1);
//               }}
//               className="flex-1 px-4 w-fit py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Reset
//             </button>
//             <button
//               onClick={getLabours}
//               className="flex-1 px-4 w-fit py-2 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
//             >
//               Apply
//             </button>
//           </div>

//           {/* Export Buttons Section (Desktop) */}
//           <div className="hidden lg:flex ml-auto flex-wrap gap-[.6rem] mb-1 text-sm bg-white">
//             <button
//               onClick={handleCopyData}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
//               title="Copy Data"
//             >
//               <FaCopy />
//             </button>
//             <button
//               onClick={handleExportCSV}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium"
//               title="Export CSV"
//             >
//               <FaFileCsv />
//             </button>
//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
//               title="Export Excel"
//             >
//               <FaFileExcel />
//             </button>
//             <button
//               onClick={handleExportPDF}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
//               title="Export PDF"
//             >
//               <FaFilePdf />
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
//               title="Print"
//             >
//               <FaPrint />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && labours.length === 0 && (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && labours.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Labour Details</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Work Types</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Requirements</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {labours.map((labour, index) => (
//                   <tr key={labour._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * limit}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{labour.name}</div>
//                       <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                         <FaPhone className="text-xs" /> {labour.contactNumber}
//                       </div>
//                       {labour.email && (
//                         <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                           <FaEnvelope className="text-xs" /> {labour.email}
//                         </div>
//                       )}
//                       {labour.villageName && (
//                         <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
//                           <FaMapMarkerAlt className="text-xs" /> {labour.villageName}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex flex-wrap gap-1">
//                         {(labour.workTypes || []).slice(0, 3).map((type, idx) => (
//                           <span 
//                             key={idx}
//                             className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                           >
//                             {type}
//                           </span>
//                         ))}
//                         {(labour.workTypes || []).length > 3 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                             +{(labour.workTypes || []).length - 3} more
//                           </span>
//                         )}
//                       </div>
//                       {labour.experience && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           Exp: {labour.experience}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="flex items-center gap-1">
//                             <FaUser className="text-blue-500" />
//                             <span className="font-semibold">{labour.maleRequirement}</span>
//                           </div>
//                           <div className="text-xs text-gray-500">Male</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="flex items-center gap-1">
//                             <FaUserFriends className="text-pink-500" />
//                             <span className="font-semibold">{labour.femaleRequirement}</span>
//                           </div>
//                           <div className="text-xs text-gray-500">Female</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-bold text-green-700">
//                             {labour.maleRequirement + labour.femaleRequirement}
//                           </div>
//                           <div className="text-xs text-gray-500">Total</div>
//                         </div>
//                       </div>
//                       {labour.availability && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           Avail: {labour.availability}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <button
//                         onClick={() => toggleActiveStatus(labour)}
//                         className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
//                           labour.isActive 
//                             ? "bg-green-100 text-green-800 hover:bg-green-200" 
//                             : "bg-red-100 text-red-800 hover:bg-red-200"
//                         }`}
//                       >
//                         {labour.isActive ? (
//                           <>
//                             <FaCheckCircle /> Active
//                           </>
//                         ) : (
//                           <>
//                             <FaTimesCircle /> Inactive
//                           </>
//                         )}
//                       </button>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {formatDate(labour.createdAt)}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setViewOpen(true);
//                           }}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setEditOpen(true);
//                           }}
//                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setCurrentLabour(labour);
//                             setDeleteOpen(true);
//                           }}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-3">
//             {labours.map((labour, index) => (
//               <div key={labour._id} className="rounded p-4 border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * limit}</span>
//                     <h3 className="text-lg font-semibold mt-1">{labour.name}</h3>
//                     <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <FaPhone /> {labour.contactNumber}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => toggleActiveStatus(labour)}
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       labour.isActive 
//                         ? "bg-green-100 text-green-800" 
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {labour.isActive ? "Active" : "Inactive"}
//                   </button>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <div className="text-sm text-gray-500">Village</div>
//                     <div>{labour.villageName || "N/A"}</div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <div className="text-sm text-gray-500">Male Required</div>
//                       <div className="font-bold text-blue-600">{labour.maleRequirement}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">Female Required</div>
//                       <div className="font-bold text-pink-600">{labour.femaleRequirement}</div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="text-sm text-gray-500">Work Types</div>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {(labour.workTypes || []).map((type, idx) => (
//                         <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                           {type}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2 pt-3">
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setViewOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded"
//                     >
//                       <FaEye /> View
//                     </button>
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setEditOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button 
//                       onClick={() => { setCurrentLabour(labour); setDeleteOpen(true); }} 
//                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && labours.length === 0 && (
//         <div className="text-center py-12 bg-white rounded shadow">
//           <div className="text-gray-400 text-6xl mb-4">👷</div>
//           <h3 className="text-xl font-semibold mb-2">No labour records found</h3>
//           <p className="text-gray-500 mb-6">Try adjusting your search or add a new labour</p>
//           <button 
//             onClick={() => setAddOpen(true)} 
//             className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
//           >
//             <FaPlus /> Add New Labour
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {labours.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-4 shadow rounded justify-between items-center gap-3 mt-4">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (page - 1) * limit}-{Math.min(page * limit, totalLabours)}</span> of{" "}
//             <span className="font-semibold">{totalLabours}</span> records
//             <select 
//               value={limit} 
//               onChange={(e) => {
//                 setLimit(Number(e.target.value));
//                 setPage(1);
//               }} 
//               className="p-2 ml-3 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {[5, 10, 20, 30, 50].map((value) => (
//                 <option key={value} value={value}>{value} per page</option>
//               ))}
//             </select>
//           </div>
          
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={(event, value) => setPage(value)}
//             color="primary"
//             shape="rounded"
//           />
//         </div>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
//         <Box sx={modalStyle}>
//           {currentLabour && (
//             <>
//               <Typography variant="h6" className="mb-6 flex items-center gap-2">
//                 <FaEye className="text-blue-500" />
//                 Labour Details
//               </Typography>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Labour ID</div>
//                     <div className="font-medium text-sm truncate">{currentLabour._id}</div>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Status</div>
//                     <div className={`font-medium flex items-center gap-1 ${currentLabour.isActive ? 'text-green-600' : 'text-red-600'}`}>
//                       {currentLabour.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
//                       {currentLabour.isActive ? 'Active' : 'Inactive'}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-2">Personal Details</div>
//                   <div className="font-medium text-lg">{currentLabour.name}</div>
//                   <div className="flex items-center gap-2 mt-2">
//                     <FaPhone className="text-sm text-gray-500" />
//                     <span>{currentLabour.contactNumber}</span>
//                   </div>
//                   {currentLabour.email && (
//                     <div className="flex items-center gap-2 mt-1">
//                       <FaEnvelope className="text-sm text-gray-500" />
//                       <span>{currentLabour.email}</span>
//                     </div>
//                   )}
//                   {currentLabour.villageName && (
//                     <div className="flex items-center gap-2 mt-1">
//                       <FaMapMarkerAlt className="text-sm text-gray-500" />
//                       <span>{currentLabour.villageName}</span>
//                     </div>
//                   )}
//                 </div>
                
//                 {currentLabour.address && (
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Address</div>
//                     <div>{currentLabour.address}</div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-3">
//                   {currentLabour.experience && (
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="text-sm text-gray-500">Experience</div>
//                       <div className="font-medium">{currentLabour.experience}</div>
//                     </div>
//                   )}
//                   {currentLabour.availability && (
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="text-sm text-gray-500">Availability</div>
//                       <div className="font-medium">{currentLabour.availability}</div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-sm text-gray-500 mb-2">Work Requirements</div>
//                   <div className="grid grid-cols-3 gap-4 mb-3">
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Male</div>
//                       <div className="font-bold text-blue-700 text-xl">{currentLabour.maleRequirement}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Female</div>
//                       <div className="font-bold text-pink-700 text-xl">{currentLabour.femaleRequirement}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-sm text-gray-500">Total</div>
//                       <div className="font-bold text-green-700 text-2xl">
//                         {currentLabour.maleRequirement + currentLabour.femaleRequirement}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {(currentLabour.workTypes || []).length > 0 && (
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-2">Work Types</div>
//                     <div className="flex flex-wrap gap-2">
//                       {(currentLabour.workTypes || []).map((type, idx) => (
//                         <Chip
//                           key={idx}
//                           label={type}
//                           size="small"
//                           className="bg-blue-100 text-blue-800"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Created</div>
//                     <div>{formatDate(currentLabour.createdAt)}</div>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <div className="text-sm text-gray-500">Updated</div>
//                     <div>{formatDate(currentLabour.updatedAt)}</div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-end mt-8 pt-4 border-t">
//                 <Button 
//                   onClick={() => setViewOpen(false)} 
//                   variant="contained"
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Close
//                 </Button>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <Typography variant="h6" className="mb-2">
//               Delete Labour Record?
//             </Typography>
//             <Typography className="text-gray-600 mb-6">
//               Are you sure you want to delete the labour record for{" "}
//               <span className="font-medium">{currentLabour?.name}</span>? 
//               This action cannot be undone.
//             </Typography>
//             <div className="flex justify-center gap-3">
//               <Button onClick={() => setDeleteOpen(false)} variant="outlined">
//                 Cancel
//               </Button>
//               <Button onClick={handleDelete} variant="contained" color="error">
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// }

















/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaUser,
  FaUserFriends,
  FaSeedling,
  FaTools,
  FaPlus,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaFileCsv,
} from "react-icons/fa";
import {
  Modal,
  Box,
  Pagination,
  Button,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface Labour {
  _id: string;
  name: string;
  villageName?: string;
  contactNumber: string;
  email?: string;
  workTypes?: string[];
  experience?: string;
  availability?: string;
  address?: string;
  maleRequirement: number;
  femaleRequirement: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
  maxHeight: "90vh",
  overflowY: "auto" as const,
};

/* ================= LABOUR FORM MODAL ================= */

interface LabourFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultData?: Labour | null;
}

function LabourFormModal({ open, onClose, onSubmit, defaultData }: LabourFormModalProps) {
  const [form, setForm] = useState({
    name: "",
    villageName: "",
    contactNumber: "",
    email: "",
    workTypes: "",
    experience: "",
    availability: "",
    address: "",
    maleRequirement: 0,
    femaleRequirement: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // FIX: Update form when defaultData changes
  useEffect(() => {
    if (defaultData) {
      setForm({
        name: defaultData.name || "",
        villageName: defaultData.villageName || "",
        contactNumber: defaultData.contactNumber || "",
        email: defaultData.email || "",
        workTypes: defaultData.workTypes?.join(", ") || "",
        experience: defaultData.experience || "",
        availability: defaultData.availability || "",
        address: defaultData.address || "",
        maleRequirement: defaultData.maleRequirement || 0,
        femaleRequirement: defaultData.femaleRequirement || 0,
        isActive: defaultData.isActive ?? true,
      });
    } else {
      // Reset form when adding new labour
      setForm({
        name: "",
        villageName: "",
        contactNumber: "",
        email: "",
        workTypes: "",
        experience: "",
        availability: "",
        address: "",
        maleRequirement: 0,
        femaleRequirement: 0,
        isActive: true,
      });
    }
    // Clear errors when modal opens/closes
    setErrors({});
  }, [defaultData, open]); // Added open to dependency array

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(form.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = "Enter a valid 10-digit phone number";
    }
    
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (form.maleRequirement < 0) {
      newErrors.maleRequirement = "Cannot be negative";
    }
    
    if (form.femaleRequirement < 0) {
      newErrors.femaleRequirement = "Cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = {
      ...form,
      workTypes: form.workTypes ? form.workTypes.split(",").map(item => item.trim()).filter(item => item) : [],
      maleRequirement: Number(form.maleRequirement) || 0,
      femaleRequirement: Number(form.femaleRequirement) || 0,
    };

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" className="mb-6">
          {defaultData ? "Edit Labour" : "Add New Labour"}
        </Typography>
        
        <div className="space-y-4">
          {/* Name */}
          <TextField
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.name}
            helperText={errors.name}
          />

          <div className="grid grid-cols-2 my-2 gap-4">
            {/* Contact Number */}
            <TextField
              label="Contact Number *"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
            />

            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.email}
              helperText={errors.email}
            />
          </div>

          {/* Village Name */}
         <div>
           <TextField
            label="Village Name"
            name="villageName"
            value={form.villageName}
            onChange={handleChange}
            fullWidth
            size="small"
          />
         </div>

         <div>
           {/* Address */}
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            size="small"
            multiline
            rows={2}
          />
         </div>

          <div>
            {/* Work Types */}
          <TextField
            label="Work Types (comma separated)"
            name="workTypes"
            value={form.workTypes}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="e.g., Planting, Harvesting, Weeding"
          />
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Male Requirement"
              name="maleRequirement"
              type="number"
              value={form.maleRequirement}
              onChange={handleChange}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
              error={!!errors.maleRequirement}
              helperText={errors.maleRequirement}
            />

            <TextField
              label="Female Requirement"
              name="femaleRequirement"
              type="number"
              value={form.femaleRequirement}
              onChange={handleChange}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
              error={!!errors.femaleRequirement}
              helperText={errors.femaleRequirement}
            />
          </div>

          {/* Experience */}
         <div>
           <TextField
            label="Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="e.g., 5 years in farming"
          />
         </div>

          {/* Availability */}
          <TextField
            label="Availability"
            name="availability"
            value={form.availability}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="e.g., Full-time, Part-time, Seasonal"
          />

          {/* Active Status */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active Labour
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {defaultData ? "Update" : "Create"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function LabourManagementPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLabours, setTotalLabours] = useState(0);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentLabour, setCurrentLabour] = useState<Labour | null>(null);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  /* ================= GET LABOURS ================= */

  const getLabours = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/labours", {
        params: {
          search,
          page,
          limit,
        },
      });
      
      if (res.data.success) {
        setLabours(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalLabours(res.data.total || 0);
      } else {
        toast.error(res.data.message || "Failed to fetch labours");
      }
    } catch (error: any) {
      console.error("Error fetching labours:", error);
      toast.error(error.response?.data?.message || "Failed to fetch labours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLabours();
  }, [search, page, limit]);

  /* ================= UPDATE ================= */

  const handleUpdate = async (data: any) => {
    if (!currentLabour) return;
    setLoadingOverlay(true);
    try {
      const response = await axios.put(`/api/labours/${currentLabour._id}`, data);
      if (response.data.success) {
        getLabours();
        toast.success("Labour updated successfully!");
        setEditOpen(false);
        setCurrentLabour(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error updating labour:", error);
      toast.error(error.response?.data?.message || "Failed to update labour");
    } finally {
      setLoadingOverlay(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!currentLabour) return;
    setLoadingOverlay(true);
    try {
      const response = await axios.delete(`/api/labours/${currentLabour._id}`);
      if (response.data.success) {
        getLabours();
        toast.success("Labour deleted successfully!");
        setDeleteOpen(false);
        setCurrentLabour(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error deleting labour:", error);
      toast.error(error.response?.data?.message || "Failed to delete labour");
    } finally {
      setLoadingOverlay(false);
    }
  };

  /* ================= CREATE ================= */

  const handleCreate = async (data: any) => {
    setLoadingOverlay(true);
    try {
      const response = await axios.post("/api/labours", data);
      if (response.data.success) {
        getLabours();
        toast.success("Labour created successfully!");
        setAddOpen(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error creating labour:", error);
      toast.error(error.response?.data?.message || "Failed to create labour");
    } finally {
      setLoadingOverlay(false);
    }
  };

  /* ================= TOGGLE ACTIVE STATUS ================= */

  const toggleActiveStatus = async (labour: Labour) => {
    try {
      await axios.put(`/api/labours/${labour._id}`, {
        isActive: !labour.isActive
      });
      getLabours();
      toast.success(`Labour ${!labour.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  /* ================= FORMAT DATE FOR CSV ================= */

  const formatDateForCSV = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Format as YYYY-MM-DD HH:MM:SS (Excel-friendly format)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return "";
    }
  };

  /* ================= COPY DATA FUNCTION ================= */

  const handleCopyData = () => {
    if (labours.length === 0) {
      toast.error("No labour data to copy");
      return;
    }

    try {
      // Create table header
      const headers = ["Sr.", "Name", "Contact", "Email", "Village", "Work Types", "Experience", "Availability", "Male Req", "Female Req", "Total", "Status", "Address", "Created Date"];
      
      // Create table rows
      const rows = labours.map((labour, index) => [
        (index + 1 + (page - 1) * limit).toString(),
        labour.name || "",
        `'${labour.contactNumber}` || "", // Add apostrophe to keep full number
        labour.email || "",
        labour.villageName || "N/A",
        (labour.workTypes || []).join(", ") || "N/A",
        labour.experience || "N/A",
        labour.availability || "N/A",
        labour.maleRequirement.toString(),
        labour.femaleRequirement.toString(),
        (labour.maleRequirement + labour.femaleRequirement).toString(),
        labour.isActive ? "Active" : "Inactive",
        labour.address || "",
        formatDateForCSV(labour.createdAt)
      ]);
      
      // Calculate column widths
      const columnWidths = headers.map((header, colIndex) => {
        const maxHeaderLength = header.length;
        const maxDataLength = Math.max(...rows.map(row => {
          const cell = row[colIndex] || "";
          return cell.toString().length;
        }));
        return Math.max(maxHeaderLength, maxDataLength, 8);
      });
      
      // Create formatted table string
      let tableString = "Labour Management Data\n";
      tableString += "=".repeat(50) + "\n\n";
      
      // Add header
      tableString += headers.map((header, i) => 
        header.padEnd(columnWidths[i])
      ).join(" | ") + "\n";
      
      // Add separator line
      tableString += headers.map((_, i) => 
        "-".repeat(columnWidths[i])
      ).join("-+-") + "\n";
      
      // Add data rows
      rows.forEach(row => {
        tableString += row.map((cell, i) => {
          const cellStr = cell?.toString() || "";
          return cellStr.padEnd(columnWidths[i]);
        }).join(" | ") + "\n";
      });
      
      // Add summary
      tableString += `\nTotal Labours: ${totalLabours}\n`;
      tableString += `Page: ${page} of ${totalPages}\n`;
      tableString += `Generated: ${new Date().toLocaleDateString()}\n`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(tableString);
      toast.success("Labour data copied to clipboard!");
    } catch (error) {
      console.error("Error copying data:", error);
      toast.error("Failed to copy data");
    }
  };

  /* ================= CSV EXPORT FUNCTION ================= */

  const handleExportCSV = () => {
    if (labours.length === 0) {
      toast.error("No labour data to export");
      return;
    }

    try {
      // Create CSV header - simplified column names
      const headers = [
        "Sr.", 
        "Name", 
        "Contact Number", 
        "Email", 
        "Village", 
        "Work Types", 
        "Experience", 
        "Availability", 
        "Male Required", 
        "Female Required", 
        "Total Required", 
        "Status", 
        "Address", 
        "Created Date"  // FIXED: Added Created Date column
      ];
      
      // Create CSV rows
      const rows = labours.map((labour, index) => {
        const totalRequirement = labour.maleRequirement + labour.femaleRequirement;
        const workTypes = (labour.workTypes || []).join("; ") || "";
        
        return [
          (index + 1 + (page - 1) * limit).toString(),
          labour.name || "",
          `="${labour.contactNumber}"` || "", // Force text format for phone numbers
          labour.email || "",
          labour.villageName || "",
          workTypes,
          labour.experience || "",
          labour.availability || "",
          labour.maleRequirement.toString(),
          labour.femaleRequirement.toString(),
          totalRequirement.toString(),
          labour.isActive ? "Active" : "Inactive",
          labour.address || "",
          formatDateForCSV(labour.createdAt) // FIXED: Added created date
        ];
      });
      
      // Convert to CSV format with proper escaping
      const csvContent = [
        headers.join(","), // Header row
        ...rows.map(row => 
          row.map(cell => {
            const cellStr = String(cell || "");
            
            // Escape cells that contain special characters
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') || cellStr.includes('\r')) {
              // Escape double quotes by doubling them
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");
      
      // Create blob and download with BOM for UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `labour-list-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  /* ================= EXCEL EXPORT FUNCTION ================= */

  const handleExportExcel = () => {
    if (labours.length === 0) {
      toast.error("No labour data to export");
      return;
    }

    try {
      const data = labours.map((labour, index) => ({
        "Sr.": index + 1 + (page - 1) * limit,
        "Name": labour.name,
        "Village": labour.villageName || "N/A",
        "Contact": `="${labour.contactNumber}"`, // Force text format
        "Email": labour.email || "N/A",
        "Work Types": (labour.workTypes || []).join(", "),
        "Experience": labour.experience || "N/A",
        "Availability": labour.availability || "N/A",
        "Male Required": labour.maleRequirement,
        "Female Required": labour.femaleRequirement,
        "Total Required": labour.maleRequirement + labour.femaleRequirement,
        "Status": labour.isActive ? "Active" : "Inactive",
        "Address": labour.address || "",
        "Created Date": formatDateForCSV(labour.createdAt) // Added Created Date
      }));

      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Labour List");
      writeFile(wb, `labour-list-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel exported successfully!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  /* ================= PDF EXPORT FUNCTION ================= */

  const handleExportPDF = () => {
    if (labours.length === 0) {
      toast.error("No labour data to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Labour Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Contact", "Work Types", "Male", "Female", "Status", "Created Date"];
      const tableRows = labours.map((labour, index) => [
        index + 1 + (page - 1) * limit,
        labour.name,
        labour.contactNumber,
        (labour.workTypes || []).slice(0, 2).join(", "),
        labour.maleRequirement,
        labour.femaleRequirement,
        labour.isActive ? "Active" : "Inactive",
        new Date(labour.createdAt).toLocaleDateString()
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });
      
      doc.save(`labour-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  /* ================= PRINT FUNCTION ================= */

  const handlePrint = () => {
    if (labours.length === 0) {
      toast.error("No labour data to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Labour Management Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status-active {
            color: #10b981;
            font-weight: 600;
          }
          .status-inactive {
            color: #ef4444;
            font-weight: 600;
          }
          .work-types {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .work-chip {
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            margin: 1px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              size: landscape;
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👷 Labour Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Labours: ${totalLabours} | Showing: ${labours.length} records</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Village</th>
              <th>Work Types</th>
              <th>Male Required</th>
              <th>Female Required</th>
              <th>Total</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${labours.map((labour, index) => `
              <tr>
                <td>${index + 1 + (page - 1) * limit}</td>
                <td><strong>${labour.name}</strong></td>
                <td>${labour.contactNumber}<br/><small>${labour.email || ''}</small></td>
                <td>${labour.villageName || 'N/A'}</td>
                <td>
                  <div class="work-types">
                    ${(labour.workTypes || []).map((type: string) => `<span class="work-chip">${type}</span>`).join('')}
                  </div>
                </td>
                <td><strong>${labour.maleRequirement}</strong></td>
                <td><strong>${labour.femaleRequirement}</strong></td>
                <td><strong class="total-count">${labour.maleRequirement + labour.femaleRequirement}</strong></td>
                <td class="${labour.isActive ? 'status-active' : 'status-inactive'}">
                  ${labour.isActive ? 'Active' : 'Inactive'}
                </td>
                <td>${labour.experience || 'N/A'}</td>
                <td>${formatDateForCSV(labour.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success("Print dialog opened!");
  };

  /* ================= FORMAT FUNCTIONS ================= */

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loadingOverlay && (
        <div className="min-h-screen fixed w-full top-0 left-0 bg-[#fdfbfb8c] z-[9999] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Labour Management</h1>
          <p className="text-gray-600 mt-2">
            Manage labour profiles and their requirements. {totalLabours} labours found.
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button 
            onClick={() => setAddOpen(true)} 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            <FaPlus /> Add Labour
          </button> */}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <LabourFormModal 
        open={addOpen || editOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
          setCurrentLabour(null);
        }}
        onSubmit={editOpen ? handleUpdate : handleCreate}
        defaultData={editOpen ? currentLabour : null}
      />

      {/* Export Buttons Section (Mobile) */}
      <div className="flex lg:hidden flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] mb-4">
        <button
          onClick={handleCopyData}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
          title="Copy Data"
        >
          <FaCopy /> 
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium"
          title="Export CSV"
        >
          <FaFileCsv /> 
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
          title="Export Excel"
        >
          <FaFileExcel /> 
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
          title="Export PDF"
        >
          <FaFilePdf /> 
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
          title="Print"
        >
          <FaPrint /> 
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white lg:rounded shadow p-[.6rem] text-sm md:p-3 lg:mb-0 mb-4">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap sm:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="flex gap-x-4 w-full md:w-auto">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, village, contact, work..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="flex-1 px-4 w-fit py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={getLabours}
              className="flex-1 px-4 w-fit py-2 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Apply
            </button>
          </div>

          {/* Export Buttons Section (Desktop) */}
          <div className="hidden lg:flex ml-auto flex-wrap gap-[.6rem] mb-1 text-sm bg-white">
            <button
              onClick={handleCopyData}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
              title="Copy Data"
            >
              <FaCopy />
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium"
              title="Export CSV"
            >
              <FaFileCsv />
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
              title="Export Excel"
            >
              <FaFileExcel />
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
              title="Export PDF"
            >
              <FaFilePdf />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
              title="Print"
            >
              <FaPrint />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && labours.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && labours.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Labour Details</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Work Types</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Requirements</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {labours.map((labour, index) => (
                  <tr key={labour._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * limit}</td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{labour.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <FaPhone className="text-xs" /> {labour.contactNumber}
                      </div>
                      {labour.email && (
                        <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <FaEnvelope className="text-xs" /> {labour.email}
                        </div>
                      )}
                      {labour.villageName && (
                        <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-xs" /> {labour.villageName}
                        </div>
                      )}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex flex-wrap gap-1">
                        {(labour.workTypes || []).slice(0, 3).map((type, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                        {(labour.workTypes || []).length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{(labour.workTypes || []).length - 3} more
                          </span>
                        )}
                      </div>
                      {labour.experience && (
                        <div className="text-xs text-gray-500 mt-1">
                          Exp: {labour.experience}
                        </div>
                      )}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <FaUser className="text-blue-500" />
                            <span className="font-semibold">{labour.maleRequirement}</span>
                          </div>
                          <div className="text-xs text-gray-500">Male</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <FaUserFriends className="text-pink-500" />
                            <span className="font-semibold">{labour.femaleRequirement}</span>
                          </div>
                          <div className="text-xs text-gray-500">Female</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-700">
                            {labour.maleRequirement + labour.femaleRequirement}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                      {labour.availability && (
                        <div className="text-xs text-gray-500 mt-1">
                          Avail: {labour.availability}
                        </div>
                      )}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <button
                        onClick={() => toggleActiveStatus(labour)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          labour.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {labour.isActive ? (
                          <>
                            <FaCheckCircle /> Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Inactive
                          </>
                        )}
                      </button>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(labour.createdAt)}
                      </div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentLabour(labour);
                            setViewOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentLabour(labour);
                            setEditOpen(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentLabour(labour);
                            setDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {labours.map((labour, index) => (
              <div key={labour._id} className="rounded p-4 border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * limit}</span>
                    <h3 className="text-lg font-semibold mt-1">{labour.name}</h3>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <FaPhone /> {labour.contactNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActiveStatus(labour)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      labour.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {labour.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Village</div>
                    <div>{labour.villageName || "N/A"}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-gray-500">Male Required</div>
                      <div className="font-bold text-blue-600">{labour.maleRequirement}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Female Required</div>
                      <div className="font-bold text-pink-600">{labour.femaleRequirement}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Work Types</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(labour.workTypes || []).map((type, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <button 
                      onClick={() => { setCurrentLabour(labour); setViewOpen(true); }} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded"
                    >
                      <FaEye /> View
                    </button>
                    <button 
                      onClick={() => { setCurrentLabour(labour); setEditOpen(true); }} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => { setCurrentLabour(labour); setDeleteOpen(true); }} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && labours.length === 0 && (
        <div className="text-center py-12 bg-white rounded shadow">
          <div className="text-gray-400 text-6xl mb-4">👷</div>
          <h3 className="text-xl font-semibold mb-2">No labour records found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or add a new labour</p>
          <button 
            onClick={() => setAddOpen(true)} 
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add New Labour
          </button>
        </div>
      )}

      {/* Pagination */}
      {labours.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-4 shadow rounded justify-between items-center gap-3">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * limit}-{Math.min(page * limit, totalLabours)}</span> of{" "}
            <span className="font-semibold">{totalLabours}</span> records
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }} 
              className="p-2 ml-3 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[5, 10, 20, 30, 50].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={modalStyle}>
          {currentLabour && (
            <>
              <Typography variant="h6" className="mb-6 flex items-center gap-2">
                <FaEye className="text-blue-500" />
                Labour Details
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Labour ID</div>
                    <div className="font-medium text-sm truncate">{currentLabour._id}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className={`font-medium flex items-center gap-1 ${currentLabour.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {currentLabour.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                      {currentLabour.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Personal Details</div>
                  <div className="font-medium text-lg">{currentLabour.name}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <FaPhone className="text-sm text-gray-500" />
                    <span>{currentLabour.contactNumber}</span>
                  </div>
                  {currentLabour.email && (
                    <div className="flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-sm text-gray-500" />
                      <span>{currentLabour.email}</span>
                    </div>
                  )}
                  {currentLabour.villageName && (
                    <div className="flex items-center gap-2 mt-1">
                      <FaMapMarkerAlt className="text-sm text-gray-500" />
                      <span>{currentLabour.villageName}</span>
                    </div>
                  )}
                </div>
                
                {currentLabour.address && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div>{currentLabour.address}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {currentLabour.experience && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Experience</div>
                      <div className="font-medium">{currentLabour.experience}</div>
                    </div>
                  )}
                  {currentLabour.availability && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Availability</div>
                      <div className="font-medium">{currentLabour.availability}</div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Work Requirements</div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Male</div>
                      <div className="font-bold text-blue-700 text-xl">{currentLabour.maleRequirement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Female</div>
                      <div className="font-bold text-pink-700 text-xl">{currentLabour.femaleRequirement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="font-bold text-green-700 text-2xl">
                        {currentLabour.maleRequirement + currentLabour.femaleRequirement}
                      </div>
                    </div>
                  </div>
                </div>
                
                {(currentLabour.workTypes || []).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">Work Types</div>
                    <div className="flex flex-wrap gap-2">
                      {(currentLabour.workTypes || []).map((type, idx) => (
                        <Chip
                          key={idx}
                          label={type}
                          size="small"
                          className="bg-blue-100 text-blue-800"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Created</div>
                    <div>{formatDate(currentLabour.createdAt)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Updated</div>
                    <div>{formatDate(currentLabour.updatedAt)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-4 border-t">
                <Button 
                  onClick={() => setViewOpen(false)} 
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2">
              Delete Labour Record?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete the labour record for{" "}
              <span className="font-medium">{currentLabour?.name}</span>? 
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setDeleteOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}