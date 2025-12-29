


// "use client";

// import { useState, useEffect } from "react";
// import {
//   FaEye,
//   FaTrash,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaSearch,
//   FaRedo,
//   FaEdit,
//   FaPlus,
//   FaTrashRestore,
//   FaHistory,
//   FaFilter,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination } from "@mui/material";
// import { getAllMenuModules } from "@/app/config/menu.config";

// /* ================= TYPES ================= */

// interface SubAdmin {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   pageAccess: string[];
//   isDeleted?: boolean;
//   deletedAt?: string;
//   deletedBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: SubAdmin | SubAdmin[];
//   message?: string;
//   page?: number;
//   limit?: number;
//   total?: number;
// }

// /* ================= PAGE ================= */

// export default function SubAdminAccountsPage() {
//   const [allModules, setAllModules] = useState<string[]>([]);
//   const [modules, setModules] = useState<string[]>(["All"]);
//   const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAdmins, setTotalAdmins] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [open, setOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [restoreOpen, setRestoreOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
//   const [adminToRestore, setAdminToRestore] = useState<SubAdmin | null>(null);
//   const [editing, setEditing] = useState<SubAdmin | null>(null);
//   const [showDeleted, setShowDeleted] = useState(false);

//   const [form, setForm] = useState<Omit<SubAdmin, "_id">>({
//     name: "",
//     email: "",
//     password: "",
//     pageAccess: [],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ================= API FUNCTIONS ================= */

//   const fetchSubAdmins = async (page: number = 1, searchQuery: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: rowsPerPage.toString(),
//         search: searchQuery,
//         showDeleted: showDeleted.toString(),
//       });

//       const response = await axios.get<ApiResponse>(`/api/admin?${params}`);
      
//       if (response.data.success) {
//         const data = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : [response.data.data];
//         setSubAdmins(data);
        
//         if (response.data.total !== undefined) {
//           setTotalAdmins(response.data.total);
//           setTotalPages(Math.ceil(response.data.total / rowsPerPage));
//         }
//         setCurrentPage(page);
//       }
//     } catch (err: any) {
//       console.error("Error fetching sub-admins:", err);
//       setError(err.response?.data?.message || 'Failed to load sub-admins. Please try again.');
//       setSubAdmins([]);
//       toast.error(err.response?.data?.message || "Failed to load sub-admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createSubAdmin = async (adminData: Omit<SubAdmin, "_id">) => {
//     try {
//       const response = await axios.post<ApiResponse>("/api/admin", adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error creating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to create sub-admin");
//     }
//   };

//   const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
//     try {
//       const response = await axios.put<ApiResponse>(`/api/admin/${id}`, adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error updating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to update sub-admin");
//     }
//   };

//   const deleteSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.delete<ApiResponse>(`/api/admin/${id}`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error deleting sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
//     }
//   };

//   const restoreSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.patch<ApiResponse>(`/api/admin/${id}/restore`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error restoring sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to restore sub-admin");
//     }
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchSubAdmins(currentPage, search);
//   }, [currentPage, rowsPerPage, showDeleted]);

//   // Load modules dynamically from menu config
//   useEffect(() => {
//     const dynamicModules = getAllMenuModules();
//     setAllModules(dynamicModules);
//     setModules(["All", ...dynamicModules]);
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchSubAdmins(1, search);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ================= VALIDATION ================= */

//   const validate = (): boolean => {
//     const e: Record<string, string> = {};
    
//     if (!form.name || !form.name.trim()) {
//       e.name = "Name is required";
//     }
    
//     if (!form.email || !form.email.trim()) {
//       e.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
//       e.email = "Invalid email format";
//     }
    
//     if (!editing) {
//       if (!form.password || !form.password.trim()) {
//         e.password = "Password is required";
//       } else if (form.password.length < 6) {
//         e.password = "Password must be at least 6 characters";
//       }
//     } else {
//       if (form.password && form.password.trim() && form.password.length < 6) {
//         e.password = "Password must be at least 6 characters";
//       }
//     }
    
//     if (form.pageAccess.length === 0) {
//       e.pageAccess = "Select at least one module";
//     }
    
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   const handleSave = async () => {
//     if (!validate()) return;

//     try {
//       let pageAccessToSave: string[];
      
//       if (form.pageAccess.includes("All")) {
//         pageAccessToSave = allModules;
//       } else {
//         pageAccessToSave = form.pageAccess;
//       }

//       const adminData: any = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         pageAccess: pageAccessToSave,
//       };
      
//       if (form.password && form.password.trim()) {
//         adminData.password = form.password;
//       }

//       if (editing) {
//         await updateSubAdmin(editing._id, adminData);
//         toast.success("Sub-admin updated successfully!");
//       } else {
//         await createSubAdmin(adminData);
//         toast.success("Sub-admin created successfully!");
//       }
      
//       await fetchSubAdmins(currentPage, search);
//       reset();
//     } catch (err: any) {
//       toast.error(err.message || "Operation failed");
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedAdmin) return;
   
//     try {
//       await deleteSubAdminAPI(selectedAdmin._id);
//       toast.success("Sub-admin moved to trash successfully!");
//       setDeleteOpen(false);
//       fetchSubAdmins(currentPage, search);
//     } catch (error: any) {
//       console.error("Error deleting sub-admin:", error);
//       toast.error(error.response?.data?.message || "Failed to delete sub-admin. Please try again.");
//     }
//   };

//   const handleRestore = async () => {
//     if (!adminToRestore) return;
   
//     try {
//       await restoreSubAdminAPI(adminToRestore._id);
//       toast.success("Sub-admin restored successfully!");
//       setRestoreOpen(false);
//       fetchSubAdmins(currentPage, search);
//     } catch (error: any) {
//       console.error("Error restoring sub-admin:", error);
//       toast.error(error.response?.data?.message || "Failed to restore sub-admin. Please try again.");
//     }
//   };

//   /* ================= HELPER FUNCTIONS ================= */

//   const loadAdminForEdit = (admin: SubAdmin) => {
//     setEditing(admin);
    
//     const displayModules: string[] = [];
    
//     admin.pageAccess.forEach(lowercaseModule => {
//       const displayModule = allModules.find(module => 
//         module.toLowerCase() === lowercaseModule.toLowerCase()
//       );
      
//       if (displayModule) {
//         displayModules.push(displayModule);
//       }
//     });
    
//     const hasAllModules = allModules.every(module => 
//       displayModules.includes(module)
//     );
    
//     if (hasAllModules) {
//       setForm({
//         ...admin,
//         password: "",
//         pageAccess: ["All"],
//       });
//     } else {
//       setForm({
//         ...admin,
//         password: "",
//         pageAccess: displayModules,
//       });
//     }
    
//     setOpen(true);
//   };

//   const handleAllCheckboxChange = () => {
//     if (form.pageAccess.includes("All")) {
//       setForm(p => ({
//         ...p,
//         pageAccess: [],
//       }));
//     } else {
//       setForm(p => ({
//         ...p,
//         pageAccess: ["All"],
//       }));
//     }
//   };

//   const handleModuleCheckboxChange = (module: string) => {
//     if (form.pageAccess.includes("All")) {
//       setForm(p => ({
//         ...p,
//         pageAccess: [module],
//       }));
//     } else if (form.pageAccess.includes(module)) {
//       setForm(p => ({
//         ...p,
//         pageAccess: p.pageAccess.filter(x => x !== module),
//       }));
//     } else {
//       setForm(p => ({
//         ...p,
//         pageAccess: [...p.pageAccess, module],
//       }));
//     }
//   };

//   const areAllModulesSelected = () => {
//     return form.pageAccess.includes("All") || 
//            (allModules.length > 0 && allModules.every(module => 
//              form.pageAccess.includes(module)
//            ));
//   };

//   const toggleDeletedView = () => {
//     setShowDeleted(!showDeleted);
//     setCurrentPage(1);
//   };

//   const reset = () => {
//     setOpen(false);
//     setEditing(null);
//     setSelectedAdmin(null);
//     setAdminToRestore(null);
//     setViewOpen(false);
//     setForm({ name: "", email: "", password: "", pageAccess: [] });
//     setErrors({});
//   };

//   const handleResetFilters = () => {
//     setSearch("");
//     setCurrentPage(1);
//     fetchSubAdmins(1, "");
//     setRowsPerPage(10);
//     setShowDeleted(false);
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
//     ...rest,
//     password: "********",
//   }));

//   const handlePrint = () => {
//     if (subAdmins.length === 0) {
//       toast.error("No sub-admins to print");
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
//         <title>Sub-Admins Report</title>
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
//               margin: 0.5in;
//             }
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>👨‍💼 Sub-Admins Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Sub-Admins: ${totalAdmins} | Showing: ${subAdmins.length} sub-admins</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Password</th>
//               <th>Access Modules</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${subAdmins.map((admin, index) => `
//               <tr>
//                 <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                 <td><strong>${admin.name}</strong></td>
//                 <td>${admin.email}</td>
//                 <td>********</td>
//                 <td>${admin.pageAccess.join(', ')}</td>
//                 <td>${admin.isDeleted ? 'Deleted' : 'Active'}</td>
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

//   const handleCopy = async () => {
//     if (subAdmins.length === 0) {
//       toast.error("No sub-admins to copy");
//       return;
//     }

//     const text = exportData.map(admin => 
//       `${admin.name}\t${admin.email}\t********\t${admin.pageAccess.join(", ")}\t${admin.isDeleted ? 'Deleted' : 'Active'}`
//     ).join("\n");
    
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Sub-admins data copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     if (subAdmins.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
//       XLSX.writeFile(wb, `sub-admins-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     if (subAdmins.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `sub-admins-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     if (subAdmins.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Sub-Admins Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Name", "Email", "Password", "Access Modules", "Status"];
//       const tableRows: any = exportData.map((admin, index) => [
//         index + 1 + (currentPage - 1) * rowsPerPage,
//         admin.name,
//         admin.email,
//         "********",
//         admin.pageAccess.join(', '),
//         admin.isDeleted ? 'Deleted' : 'Active'
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`sub-admins-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
//             {showDeleted ? "Deleted Sub-Admins" : "Sub-Admin Accounts"}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {showDeleted 
//               ? "View and restore deleted sub-admin accounts" 
//               : `Overview and management of all sub-admin accounts. ${totalAdmins} sub-admins found.`}
//           </p>
//         </div>
//       </div>

//       {/* Export Buttons Section */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//           >
//             <btn.icon className="text-sm" />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-4">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Show Deleted/Active Toggle */}
//           <div className="md:col-span-2">
//             <button
//               onClick={toggleDeletedView}
//               className={`w-full px-4 py-2.5 rounded transition-colors font-medium flex items-center justify-center gap-2 ${
//                 showDeleted 
//                   ? "bg-yellow-500 text-white hover:bg-yellow-600" 
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//             >
//               <FaHistory /> {showDeleted ? "Show Active" : "Show Deleted"}
//             </button>
//           </div>

//           {/* Add New Button (only show when not viewing deleted) */}
//           {!showDeleted && (
//             <div className="md:col-span-2">
//               <button
//                 onClick={() => setOpen(true)}
//                 className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
//               >
//                 <FaPlus /> Add New
//               </button>
//             </div>
//           )}

//           {/* Reset Button */}
//           <div className="md:col-span-2">
//             <button
//               onClick={handleResetFilters}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <FaRedo /> Reset
//             </button>
//           </div>

//           {/* Desktop Export Buttons */}
//           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//               >
//                 <btn.icon className="text-sm" />
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
//           {error}
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && subAdmins.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Password</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Access Modules</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {subAdmins.map((admin, index) => (
//                   <tr 
//                     key={admin._id} 
//                     className={`hover:bg-gray-50 transition-colors ${admin.isDeleted ? 'bg-red-50' : ''}`}
//                   >
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{admin.name}</div>
//                       {admin.isDeleted && (
//                         <div className="text-xs text-red-500">(Deleted)</div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">{admin.email}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <span className="text-gray-400">********</span>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex flex-wrap gap-1">
//                         {admin.pageAccess.map(module => (
//                           <span 
//                             key={module} 
//                             className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                           >
//                             {module}
//                           </span>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <span className={`px-2 py-1 rounded text-xs ${
//                         admin.isDeleted 
//                           ? 'bg-red-100 text-red-800' 
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {admin.isDeleted ? 'Deleted' : 'Active'}
//                       </span>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
                        
//                         {/* Edit button - only for active admins */}
//                         {!admin.isDeleted && (
//                           <button
//                             onClick={() => loadAdminForEdit(admin)}
//                             className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <FaEdit />
//                           </button>
//                         )}
                        
//                         {/* Delete/Restore based on status */}
//                         {admin.isDeleted ? (
//                           <button
//                             onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }}
//                             className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
//                             title="Restore"
//                           >
//                             <FaTrashRestore />
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
//                             className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                             title="Delete"
//                           >
//                             <FaTrash />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {subAdmins.map((admin, index) => (
//               <div 
//                 key={admin._id} 
//                 className={`rounded p-[.6rem] text-sm border border-zinc-200 shadow ${
//                   admin.isDeleted ? 'bg-red-50' : 'bg-white'
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <div className="font-bold text-gray-800">{admin.name}</div>
//                     <div className="text-xs text-gray-500">
//                       Sr. {index + 1 + (currentPage - 1) * rowsPerPage}
//                       {admin.isDeleted && (
//                         <span className="ml-2 text-red-500">(Deleted)</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }} className="p-1.5 text-blue-600">
//                       <FaEye />
//                     </button>
//                     {!admin.isDeleted && (
//                       <button onClick={() => loadAdminForEdit(admin)} className="p-1.5 text-green-600">
//                         <FaEdit />
//                       </button>
//                     )}
//                     {admin.isDeleted ? (
//                       <button onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }} className="p-1.5 text-green-600">
//                         <FaTrashRestore />
//                       </button>
//                     ) : (
//                       <button onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }} className="p-1.5 text-red-600">
//                         <FaTrash />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <div className="text-sm text-gray-500">Email</div>
//                     <div className="text-sm">{admin.email}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Password</div>
//                     <div className="text-sm text-gray-400">********</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Access Modules</div>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {admin.pageAccess.map(module => (
//                         <span 
//                           key={module} 
//                           className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                         >
//                           {module}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Status</div>
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       admin.isDeleted 
//                         ? 'bg-red-100 text-red-800' 
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {admin.isDeleted ? 'Deleted' : 'Active'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && subAdmins.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">
//             {showDeleted ? '🗑️' : '👨‍💼'}
//           </div>
//           <h3 className="text-xl font-semibold mb-2">
//             {showDeleted ? 'No deleted sub-admins found' : 'No sub-admins found'}
//           </h3>
//           <p className="text-gray-500">
//             {showDeleted 
//               ? 'All deleted sub-admins have been restored or permanently deleted.' 
//               : 'Try adjusting your search or add a new sub-admin'}
//           </p>
//           {!showDeleted && (
//             <button
//               onClick={() => setOpen(true)}
//               className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Add New Sub-Admin
//             </button>
//           )}
//         </div>
//       )}

//       {/* Pagination with MUI Component */}
//       {!loading && subAdmins.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAdmins)}</span> of{" "}
//             <span className="font-semibold">{totalAdmins}</span> sub-admins
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="p-1 ml-3 border border-zinc-300 rounded"
//             >
//               {[5, 10, 20, 50, 100].map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={(_, value) => setCurrentPage(value)}
//               color="primary"
//               shape="rounded"
//               showFirstButton
//               showLastButton
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </div>
//       )}

//       {/* ADD/EDIT MODAL */}
//       {open && (
//         <Modal 
//           title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
//           onClose={reset}
//         >
//           <div className="max-h-[70vh] overflow-y-auto pr-2">
//             <Input 
//               label="Name" 
//               value={form.name} 
//               error={errors.name} 
//               onChange={v => setForm(p => ({ ...p, name: v }))} 
//               placeholder="Enter full name"
//               required
//             />
            
//             <Input 
//               label="Email" 
//               type="email"
//               value={form.email} 
//               error={errors.email} 
//               onChange={v => setForm(p => ({ ...p, email: v }))} 
//               placeholder="Enter email address"
//               required
//             />
            
//             <Input 
//               label="Password" 
//               type="password"
//               value={form.password} 
//               error={errors.password} 
//               onChange={v => setForm(p => ({ ...p, password: v }))} 
//               placeholder={editing ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
//               required={!editing}
//             />

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Page Access <span className="text-red-500">*</span>
//               </label>
//               <div className="border rounded p-3 max-h-60 overflow-y-auto">
//                 <div className="mb-2">
//                   <label className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={areAllModulesSelected()}
//                       onChange={handleAllCheckboxChange}
//                     />
//                     <span className="font-medium">Select All</span>
//                   </label>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-2">
//                   {allModules.map(module => (
//                     <label key={module} className="flex items-center gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={form.pageAccess.includes(module) || areAllModulesSelected()}
//                         disabled={areAllModulesSelected()}
//                         onChange={() => handleModuleCheckboxChange(module)}
//                       />
//                       {module}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
//             </div>

//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//               <button
//                 onClick={reset}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       {viewOpen && selectedAdmin && (
//         <Modal 
//           title="Sub-Admin Details" 
//           onClose={() => { setViewOpen(false); setSelectedAdmin(null); }}
//         >
//           <div className="space-y-4">
//             <DetailRow label="Name" value={selectedAdmin.name} />
//             <DetailRow label="Email" value={selectedAdmin.email} />
//             <DetailRow label="Password" value="********" />
//             <div>
//               <div className="font-medium text-gray-600 mb-2">Access Modules:</div>
//               <div className="flex flex-wrap gap-1">
//                 {selectedAdmin.pageAccess.map(module => (
//                   <span 
//                     key={module} 
//                     className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm"
//                   >
//                     {module}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="font-medium text-gray-600 mb-2">Status:</div>
//               <span className={`px-3 py-1 rounded text-sm ${
//                 selectedAdmin.isDeleted 
//                   ? 'bg-red-100 text-red-800' 
//                   : 'bg-green-100 text-green-800'
//               }`}>
//                 {selectedAdmin.isDeleted ? 'Deleted' : 'Active'}
//               </span>
//             </div>
//             {selectedAdmin.isDeleted && selectedAdmin.deletedAt && (
//               <DetailRow label="Deleted On" value={new Date(selectedAdmin.deletedAt).toLocaleDateString()} />
//             )}
//             {selectedAdmin.createdAt && (
//               <DetailRow label="Created" value={new Date(selectedAdmin.createdAt).toLocaleDateString()} />
//             )}
//             {selectedAdmin.updatedAt && (
//               <DetailRow label="Last Updated" value={new Date(selectedAdmin.updatedAt).toLocaleDateString()} />
//             )}
//           </div>

//           <div className="flex justify-end mt-6">
//             <button
//               onClick={() => { setViewOpen(false); setSelectedAdmin(null); }}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteOpen && selectedAdmin && (
//         <Modal 
//           title="Move to Trash?" 
//           onClose={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
//         >
//           <div className="text-center">
//             <div className="text-yellow-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold mb-2">Move to Trash?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to move <span className="font-semibold">{selectedAdmin.name}</span> to trash? 
//               This action can be reversed by restoring from the deleted items view.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
//               >
//                 Move to Trash
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* RESTORE CONFIRMATION MODAL */}
//       {restoreOpen && adminToRestore && (
//         <Modal 
//           title="Restore Sub-Admin?" 
//           onClose={() => { setRestoreOpen(false); setAdminToRestore(null); }}
//         >
//           <div className="text-center">
//             <div className="text-green-500 text-5xl mb-4">♻️</div>
//             <h2 className="text-xl font-semibold mb-2">Restore Sub-Admin?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to restore <span className="font-semibold">{adminToRestore.name}</span>? 
//               This will make the account active again.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => { setRestoreOpen(false); setAdminToRestore(null); }}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRestore}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 Restore Sub-Admin
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//     <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✕
//         </button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

// const Input = ({ 
//   label, 
//   value, 
//   error, 
//   onChange, 
//   type = "text",
//   placeholder = "",
//   required = false 
// }: { 
//   label: string; 
//   value: string; 
//   error?: string; 
//   onChange: (v: string) => void;
//   type?: string;
//   placeholder?: string;
//   required?: boolean;
// }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//       placeholder={placeholder}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );












"use client";

import { useState, useEffect } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaRedo,
  FaEdit,
  FaPlus,
  FaTrashRestore,
  FaHistory,
  FaTrashAlt, // New icon for permanent delete
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import { getAllMenuModules } from "@/app/config/menu.config";

/* ================= TYPES ================= */

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  pageAccess: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: SubAdmin | SubAdmin[];
  message?: string;
  page?: number;
  limit?: number;
  total?: number;
}

/* ================= PAGE ================= */

export default function SubAdminAccountsPage() {
  const [allModules, setAllModules] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>(["All"]);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false); // New state
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
  const [adminToRestore, setAdminToRestore] = useState<SubAdmin | null>(null);
  const [adminToDeletePermanently, setAdminToDeletePermanently] = useState<SubAdmin | null>(null); // New state
  const [editing, setEditing] = useState<SubAdmin | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState<Omit<SubAdmin, "_id">>({
    name: "",
    email: "",
    password: "",
    pageAccess: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= API FUNCTIONS ================= */

  const fetchSubAdmins = async (page: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
        showDeleted: showDeleted.toString(),
      });

      const response = await axios.get<ApiResponse>(`/api/admin?${params}`);
      
      if (response.data.success) {
        const data = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        setSubAdmins(data);
        
        if (response.data.total !== undefined) {
          setTotalAdmins(response.data.total);
          setTotalPages(Math.ceil(response.data.total / rowsPerPage));
        }
        setCurrentPage(page);
      }
    } catch (err: any) {
      console.error("Error fetching sub-admins:", err);
      setError(err.response?.data?.message || 'Failed to load sub-admins. Please try again.');
      setSubAdmins([]);
      toast.error(err.response?.data?.message || "Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async (adminData: Omit<SubAdmin, "_id">) => {
    try {
      const response = await axios.post<ApiResponse>("/api/admin", adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error creating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to create sub-admin");
    }
  };

  const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
    try {
      const response = await axios.put<ApiResponse>(`/api/admin/${id}`, adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error updating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to update sub-admin");
    }
  };

  // Soft delete (move to trash)
  const deleteSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/admin/${id}`);
      return response.data;
    } catch (err: any) {
      console.error("Error deleting sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
    }
  };

  // Restore from trash
  const restoreSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.patch<ApiResponse>(`/api/admin/${id}/restore`);
      return response.data;
    } catch (err: any) {
      console.error("Error restoring sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to restore sub-admin");
    }
  };

  // Permanent delete API (new function)
  const permanentDeleteSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/admin/${id}/permanent`);
      return response.data;
    } catch (err: any) {
      console.error("Error permanently deleting sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to permanently delete sub-admin");
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchSubAdmins(currentPage, search);
  }, [currentPage, rowsPerPage, showDeleted]);

  // Load modules dynamically from menu config
  useEffect(() => {
    const dynamicModules = getAllMenuModules();
    setAllModules(dynamicModules);
    setModules(["All", ...dynamicModules]);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubAdmins(1, search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= VALIDATION ================= */

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    
    if (!form.name || !form.name.trim()) {
      e.name = "Name is required";
    }
    
    if (!form.email || !form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Invalid email format";
    }
    
    if (!editing) {
      if (!form.password || !form.password.trim()) {
        e.password = "Password is required";
      } else if (form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    } else {
      if (form.password && form.password.trim() && form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    }
    
    if (form.pageAccess.length === 0) {
      e.pageAccess = "Select at least one module";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD OPERATIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

    try {
      let pageAccessToSave: string[];
      
      if (form.pageAccess.includes("All")) {
        pageAccessToSave = allModules;
      } else {
        pageAccessToSave = form.pageAccess;
      }

      const adminData: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        pageAccess: pageAccessToSave,
      };
      
      if (form.password && form.password.trim()) {
        adminData.password = form.password;
      }

      if (editing) {
        await updateSubAdmin(editing._id, adminData);
        toast.success("Sub-admin updated successfully!");
      } else {
        await createSubAdmin(adminData);
        toast.success("Sub-admin created successfully!");
      }
      
      await fetchSubAdmins(currentPage, search);
      reset();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  // Soft delete (move to trash)
  const handleDelete = async () => {
    if (!selectedAdmin) return;
   
    try {
      await deleteSubAdminAPI(selectedAdmin._id);
      toast.success("Sub-admin moved to trash successfully!");
      setDeleteOpen(false);
      fetchSubAdmins(currentPage, search);
    } catch (error: any) {
      console.error("Error deleting sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to delete sub-admin. Please try again.");
    }
  };

  // Restore from trash
  const handleRestore = async () => {
    if (!adminToRestore) return;
   
    try {
      await restoreSubAdminAPI(adminToRestore._id);
      toast.success("Sub-admin restored successfully!");
      setRestoreOpen(false);
      fetchSubAdmins(currentPage, search);
    } catch (error: any) {
      console.error("Error restoring sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to restore sub-admin. Please try again.");
    }
  };

  // Permanent delete (new function)
  const handlePermanentDelete = async () => {
    if (!adminToDeletePermanently) return;
   
    try {
      await permanentDeleteSubAdminAPI(adminToDeletePermanently._id);
      toast.success("Sub-admin permanently deleted!");
      setPermanentDeleteOpen(false);
      fetchSubAdmins(currentPage, search);
    } catch (error: any) {
      console.error("Error permanently deleting sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to permanently delete sub-admin. Please try again.");
    }
  };

  /* ================= HELPER FUNCTIONS ================= */

  const loadAdminForEdit = (admin: SubAdmin) => {
    setEditing(admin);
    
    const displayModules: string[] = [];
    
    admin.pageAccess.forEach(lowercaseModule => {
      const displayModule = allModules.find(module => 
        module.toLowerCase() === lowercaseModule.toLowerCase()
      );
      
      if (displayModule) {
        displayModules.push(displayModule);
      }
    });
    
    const hasAllModules = allModules.every(module => 
      displayModules.includes(module)
    );
    
    if (hasAllModules) {
      setForm({
        ...admin,
        password: "",
        pageAccess: ["All"],
      });
    } else {
      setForm({
        ...admin,
        password: "",
        pageAccess: displayModules,
      });
    }
    
    setOpen(true);
  };

  const handleAllCheckboxChange = () => {
    if (form.pageAccess.includes("All")) {
      setForm(p => ({
        ...p,
        pageAccess: [],
      }));
    } else {
      setForm(p => ({
        ...p,
        pageAccess: ["All"],
      }));
    }
  };

  const handleModuleCheckboxChange = (module: string) => {
    if (form.pageAccess.includes("All")) {
      setForm(p => ({
        ...p,
        pageAccess: [module],
      }));
    } else if (form.pageAccess.includes(module)) {
      setForm(p => ({
        ...p,
        pageAccess: p.pageAccess.filter(x => x !== module),
      }));
    } else {
      setForm(p => ({
        ...p,
        pageAccess: [...p.pageAccess, module],
      }));
    }
  };

  const areAllModulesSelected = () => {
    return form.pageAccess.includes("All") || 
           (allModules.length > 0 && allModules.every(module => 
             form.pageAccess.includes(module)
           ));
  };

  const toggleDeletedView = () => {
    setShowDeleted(!showDeleted);
    setCurrentPage(1);
  };

  const reset = () => {
    setOpen(false);
    setEditing(null);
    setSelectedAdmin(null);
    setAdminToRestore(null);
    setAdminToDeletePermanently(null);
    setViewOpen(false);
    setForm({ name: "", email: "", password: "", pageAccess: [] });
    setErrors({});
  };

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    fetchSubAdmins(1, "");
    setRowsPerPage(10);
    setShowDeleted(false);
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
    ...rest,
    password: "********",
  }));

  const handlePrint = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to print");
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
        <title>Sub-Admins Report</title>
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
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👨‍💼 Sub-Admins Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Sub-Admins: ${totalAdmins} | Showing: ${subAdmins.length} sub-admins</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Access Modules</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${subAdmins.map((admin, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${admin.name}</strong></td>
                <td>${admin.email}</td>
                <td>********</td>
                <td>${admin.pageAccess.join(', ')}</td>
                <td>${admin.isDeleted ? 'Deleted' : 'Active'}</td>
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
  };

  const handleCopy = async () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to copy");
      return;
    }

    const text = exportData.map(admin => 
      `${admin.name}\t${admin.email}\t********\t${admin.pageAccess.join(", ")}\t${admin.isDeleted ? 'Deleted' : 'Active'}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Sub-admins data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
      XLSX.writeFile(wb, `sub-admins-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sub-admins-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Sub-Admins Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Email", "Password", "Access Modules", "Status"];
      const tableRows: any = exportData.map((admin, index) => [
        index + 1 + (currentPage - 1) * rowsPerPage,
        admin.name,
        admin.email,
        "********",
        admin.pageAccess.join(', '),
        admin.isDeleted ? 'Deleted' : 'Active'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`sub-admins-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
            {showDeleted ? "Deleted Sub-Admins" : "Sub-Admin Accounts"}
          </h1>
          <p className="text-gray-600 mt-2">
            {showDeleted 
              ? "View, restore or permanently delete sub-admin accounts" 
              : `Overview and management of all sub-admin accounts. ${totalAdmins} sub-admins found.`}
          </p>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Show Deleted/Active Toggle */}
          <div className="md:col-span-2">
            <button
              onClick={toggleDeletedView}
              className={`w-full px-4 py-2.5 rounded transition-colors font-medium flex items-center justify-center gap-2 ${
                showDeleted 
                  ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <FaHistory /> {showDeleted ? "Show Active" : "Show Deleted"}
            </button>
          </div>

          {/* Add New Button (only show when not viewing deleted) */}
          {!showDeleted && (
            <div className="md:col-span-2">
              <button
                onClick={() => setOpen(true)}
                className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaPlus /> Add New
              </button>
            </div>
          )}

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && subAdmins.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Password</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Access Modules</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subAdmins.map((admin, index) => (
                  <tr 
                    key={admin._id} 
                    className={`hover:bg-gray-50 transition-colors ${admin.isDeleted ? 'bg-red-50' : ''}`}
                  >
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{admin.name}</div>
                      {admin.isDeleted && (
                        <div className="text-xs text-red-500">(Deleted)</div>
                      )}
                    </td>
                    <td className="p-[.6rem] text-sm">{admin.email}</td>
                    <td className="p-[.6rem] text-sm">
                      <span className="text-gray-400">********</span>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex flex-wrap gap-1">
                        {admin.pageAccess.map(module => (
                          <span 
                            key={module} 
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        admin.isDeleted 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {admin.isDeleted ? 'Deleted' : 'Active'}
                      </span>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        {/* Edit button - only for active admins */}
                        {!admin.isDeleted && (
                          <button
                            onClick={() => loadAdminForEdit(admin)}
                            className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                        
                        {/* Actions for deleted admins */}
                        {admin.isDeleted ? (
                          <>
                            <button
                              onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }}
                              className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Restore"
                            >
                              <FaTrashRestore />
                            </button>
                            <button
                              onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }}
                              className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Permanently"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        ) : (
                          /* Delete button for active admins (soft delete) */
                          <button
                            onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
                            className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Move to Trash"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {subAdmins.map((admin, index) => (
              <div 
                key={admin._id} 
                className={`rounded p-[.6rem] text-sm border border-zinc-200 shadow ${
                  admin.isDeleted ? 'bg-red-50' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">{admin.name}</div>
                    <div className="text-xs text-gray-500">
                      Sr. {index + 1 + (currentPage - 1) * rowsPerPage}
                      {admin.isDeleted && (
                        <span className="ml-2 text-red-500">(Deleted)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }} className="p-1.5 text-blue-600">
                      <FaEye />
                    </button>
                    {!admin.isDeleted && (
                      <button onClick={() => loadAdminForEdit(admin)} className="p-1.5 text-green-600">
                        <FaEdit />
                      </button>
                    )}
                    {admin.isDeleted ? (
                      <>
                        <button onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }} className="p-1.5 text-green-600">
                          <FaTrashRestore />
                        </button>
                        <button onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }} className="p-1.5 text-red-600">
                          <FaTrashAlt />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-sm">{admin.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Password</div>
                    <div className="text-sm text-gray-400">********</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Access Modules</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {admin.pageAccess.map(module => (
                        <span 
                          key={module} 
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      admin.isDeleted 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && subAdmins.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {showDeleted ? '🗑️' : '👨‍💼'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {showDeleted ? 'No deleted sub-admins found' : 'No sub-admins found'}
          </h3>
          <p className="text-gray-500">
            {showDeleted 
              ? 'All deleted sub-admins have been restored or permanently deleted.' 
              : 'Try adjusting your search or add a new sub-admin'}
          </p>
          {!showDeleted && (
            <button
              onClick={() => setOpen(true)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add New Sub-Admin
            </button>
          )}
        </div>
      )}

      {/* Pagination with MUI Component */}
      {!loading && subAdmins.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAdmins)}</span> of{" "}
            <span className="font-semibold">{totalAdmins}</span> sub-admins
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {open && (
        <Modal 
          title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
          onClose={reset}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <Input 
              label="Name" 
              value={form.name} 
              error={errors.name} 
              onChange={v => setForm(p => ({ ...p, name: v }))} 
              placeholder="Enter full name"
              required
            />
            
            <Input 
              label="Email" 
              type="email"
              value={form.email} 
              error={errors.email} 
              onChange={v => setForm(p => ({ ...p, email: v }))} 
              placeholder="Enter email address"
              required
            />
            
            <Input 
              label="Password" 
              type="password"
              value={form.password} 
              error={errors.password} 
              onChange={v => setForm(p => ({ ...p, password: v }))} 
              placeholder={editing ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
              required={!editing}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Access <span className="text-red-500">*</span>
              </label>
              <div className="border rounded p-3 max-h-60 overflow-y-auto">
                <div className="mb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={areAllModulesSelected()}
                      onChange={handleAllCheckboxChange}
                    />
                    <span className="font-medium">Select All</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {allModules.map(module => (
                    <label key={module} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.pageAccess.includes(module) || areAllModulesSelected()}
                        disabled={areAllModulesSelected()}
                        onChange={() => handleModuleCheckboxChange(module)}
                      />
                      {module}
                    </label>
                  ))}
                </div>
              </div>
              {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={reset}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedAdmin && (
        <Modal 
          title="Sub-Admin Details" 
          onClose={() => { setViewOpen(false); setSelectedAdmin(null); }}
        >
          <div className="space-y-4">
            <DetailRow label="Name" value={selectedAdmin.name} />
            <DetailRow label="Email" value={selectedAdmin.email} />
            <DetailRow label="Password" value="********" />
            <div>
              <div className="font-medium text-gray-600 mb-2">Access Modules:</div>
              <div className="flex flex-wrap gap-1">
                {selectedAdmin.pageAccess.map(module => (
                  <span 
                    key={module} 
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-2">Status:</div>
              <span className={`px-3 py-1 rounded text-sm ${
                selectedAdmin.isDeleted 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedAdmin.isDeleted ? 'Deleted' : 'Active'}
              </span>
            </div>
            {selectedAdmin.isDeleted && selectedAdmin.deletedAt && (
              <DetailRow label="Deleted On" value={new Date(selectedAdmin.deletedAt).toLocaleDateString()} />
            )}
            {selectedAdmin.createdAt && (
              <DetailRow label="Created" value={new Date(selectedAdmin.createdAt).toLocaleDateString()} />
            )}
            {selectedAdmin.updatedAt && (
              <DetailRow label="Last Updated" value={new Date(selectedAdmin.updatedAt).toLocaleDateString()} />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => { setViewOpen(false); setSelectedAdmin(null); }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* SOFT DELETE (MOVE TO TRASH) MODAL */}
      {deleteOpen && selectedAdmin && (
        <Modal 
          title="Move to Trash?" 
          onClose={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
        >
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold mb-2">Move to Trash?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move <span className="font-semibold">{selectedAdmin.name}</span> to trash? 
              This action can be reversed by restoring from the deleted items view.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RESTORE CONFIRMATION MODAL */}
      {restoreOpen && adminToRestore && (
        <Modal 
          title="Restore Sub-Admin?" 
          onClose={() => { setRestoreOpen(false); setAdminToRestore(null); }}
        >
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">♻️</div>
            <h2 className="text-xl font-semibold mb-2">Restore Sub-Admin?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore <span className="font-semibold">{adminToRestore.name}</span>? 
              This will make the account active again.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setRestoreOpen(false); setAdminToRestore(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Restore Sub-Admin
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      {permanentDeleteOpen && adminToDeletePermanently && (
        <Modal 
          title="Delete Permanently?" 
          onClose={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
        >
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Delete Permanently?</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to permanently delete <span className="font-semibold">{adminToDeletePermanently.name}</span>?
            </p>
            <p className="text-red-600 mb-6 font-semibold">
              ⚠️ This action cannot be undone! All data will be lost forever.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ 
  label, 
  value, 
  error, 
  onChange, 
  type = "text",
  placeholder = "",
  required = false 
}: { 
  label: string; 
  value: string; 
  error?: string; 
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
    <div className="w-32 font-medium text-gray-600">{label}:</div>
    <div className="flex-1 text-gray-900">{value}</div>
  </div>
);