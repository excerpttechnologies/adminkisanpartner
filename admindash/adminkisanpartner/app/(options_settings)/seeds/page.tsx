



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import {
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaPrint,
//   FaSeedling,
//   FaPlus,
// } from "react-icons/fa";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// interface Seed {
//   _id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// /* ================= API FUNCTIONS ================= */

// const API_BASE_URL = "/api/seeds";

// // API helper function
// const apiCall = async (url: string, options?: RequestInit) => {
//   try {
//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       ...options,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error: any) {
//     console.error(`API Error for ${url}:`, error);
//     throw error;
//   }
// };

// /* ================= COMPONENT ================= */

// export default function SeedsPage() {
//   // State
//   const [seeds, setSeeds] = useState<Seed[]>([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalSeeds, setTotalSeeds] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   // Modal states
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [currentSeed, setCurrentSeed] = useState<Seed | null>(null);
  
//   // Form states
//   const [newName, setNewName] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newCategory, setNewCategory] = useState("other");
  
//   // Selection state
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
//   // Loading state
//   const [loading, setLoading] = useState(false);

//   // Categories for dropdown
//   const categories = [
//     { value: "vegetable", label: "Vegetable" },
//     { value: "fruit", label: "Fruit" },
//     { value: "grain", label: "Grain" },
//     { value: "herb", label: "Herb" },
//     { value: "flower", label: "Flower" },
//     { value: "other", label: "Other" }
//   ];

//   /* ================= FETCH DATA ================= */

//   const fetchSeeds = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         search: search || "",
//         page: page.toString(),
//         limit: rowsPerPage.toString()
//       });
      
//       const data = await apiCall(`${API_BASE_URL}?${params}`);
      
//       if (data.success) {
//         setSeeds(data.data);
//         setTotalPages(data.pagination.pages);
//         setTotalSeeds(data.pagination.total);
//       } else {
//         toast.error(data.error || "Failed to load seeds");
//       }
//     } catch (error: any) {
//       console.error("Error fetching seeds:", error);
//       toast.error(error.message || "Failed to load seeds");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSeeds();
//   }, [search, page, rowsPerPage]);

//   /* ================= CRUD OPERATIONS ================= */

//   const handleAddSeed = async () => {
//     if (!newName.trim()) {
//       toast.error("Please enter a seed name");
//       return;
//     }

//     setLoading(true);
//     try {
//       const seedData = {
//         name: newName.trim(),
//         description: newDescription.trim() || undefined,
//         category: newCategory
//       };
      
//       const data = await apiCall(API_BASE_URL, {
//         method: "POST",
//         body: JSON.stringify(seedData)
//       });
      
//       if (data.success) {
//         toast.success("Seed added successfully");
//         setAddOpen(false);
//         resetForm();
//         fetchSeeds();
//       } else {
//         toast.error(data.error || "Failed to add seed");
//       }
//     } catch (error: any) {
//       console.error("Error adding seed:", error);
//       toast.error(error.message || "Failed to add seed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateSeed = async () => {
//     if (!currentSeed || !newName.trim()) return;

//     setLoading(true);
//     try {
//       const seedData = {
//         name: newName.trim(),
//         description: newDescription.trim() || undefined,
//         category: newCategory
//       };
      
//       const data = await apiCall(`${API_BASE_URL}/${currentSeed._id}`, {
//         method: "PUT",
//         body: JSON.stringify(seedData)
//       });
      
//       if (data.success) {
//         toast.success("Seed updated successfully");
//         setEditOpen(false);
//         resetForm();
//         setCurrentSeed(null);
//         fetchSeeds();
//       } else {
//         toast.error(data.error || "Failed to update seed");
//       }
//     } catch (error: any) {
//       console.error("Error updating seed:", error);
//       toast.error(error.message || "Failed to update seed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSeed = async () => {
//     if (!currentSeed) return;

//     setLoading(true);
//     try {
//       const data = await apiCall(`${API_BASE_URL}/${currentSeed._id}`, {
//         method: "DELETE"
//       });
      
//       if (data.success) {
//         toast.success("Seed deleted successfully");
//         setDeleteOpen(false);
//         setCurrentSeed(null);
//         fetchSeeds();
//       } else {
//         toast.error(data.error || "Failed to delete seed");
//       }
//     } catch (error: any) {
//       console.error("Error deleting seed:", error);
//       toast.error(error.message || "Failed to delete seed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) {
//       toast.error("Please select at least one seed to delete");
//       return;
//     }

//     setBulkDeleteOpen(true);
//   };

//   const confirmBulkDelete = async () => {
//     setLoading(true);
//     try {
//       const data = await apiCall(`${API_BASE_URL}/bulk`, {
//         method: "POST",
//         body: JSON.stringify({ ids: selectedIds })
//       });
      
//       if (data.success) {
//         toast.success(data.message || `${selectedIds.length} seed(s) deleted successfully`);
//         setSelectedIds([]);
//         setBulkDeleteOpen(false);
//         fetchSeeds();
//       } else {
//         toast.error(data.error || "Failed to delete seeds");
//         setBulkDeleteOpen(false);
//       }
//     } catch (error: any) {
//       console.error("Error deleting selected seeds:", error);
//       toast.error(error.message || "Failed to delete seeds");
//       setBulkDeleteOpen(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= FORM HELPERS ================= */

//   const resetForm = () => {
//     setNewName("");
//     setNewDescription("");
//     setNewCategory("other");
//   };

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       setSelectedIds(seeds.map(seed => seed._id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (id: string) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter(seedId => seedId !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const handleCopyToClipboard = async () => {
//     if (seeds.length === 0) {
//       toast.error("No data to copy");
//       return;
//     }

//     const text = seeds.map(seed => seed.name).join(', ');
//     navigator.clipboard.writeText(text);
//     toast.success("Seed names copied to clipboard!");
//   };

//   const handleExportExcel = () => {
//     if (seeds.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const headers = ["Sr.", "Seed Name", "Category", "Description", "Created Date"];
//     const csvContent = [
//       headers.join("\t"),
//       ...seeds.map((seed, index) => [
//         index + 1 + (page - 1) * rowsPerPage,
//         seed.name,
//         seed.category || "other",
//         seed.description || "",
//         new Date(seed.createdAt).toLocaleDateString(),
//       ].join("\t"))
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `seeds-${new Date().toISOString().split('T')[0]}.xls`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("Excel file downloaded successfully!");
//   };

//   const handleExportCSV = () => {
//     if (seeds.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const headers = ["Sr.", "Seed Name", "Category", "Description", "Created Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...seeds.map((seed, index) => [
//         index + 1 + (page - 1) * rowsPerPage,
//         `"${seed.name.replace(/"/g, '""')}"`,
//         `"${seed.category || "other"}"`,
//         `"${(seed.description || "").replace(/"/g, '""')}"`,
//         `"${new Date(seed.createdAt).toLocaleDateString()}"`,
//       ].join(","))
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `seeds-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("CSV file downloaded successfully!");
//   };

//   const handleExportPDF = () => {
//     if (seeds.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to export PDF");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Seeds Report</title>
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
//           .category-badge {
//             padding: 4px 10px;
//             border-radius: 12px;
//             font-size: 11px;
//             font-weight: 600;
//             display: inline-block;
//             background-color: #dbeafe;
//             color: #1e40af;
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
//           <h1>🌱 Seeds Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Seeds: ${totalSeeds} | Showing: ${seeds.length} seeds</div>
//           <div class="header-info">Page: ${page} of ${totalPages}</div>
//           ${search ? `<div class="header-info">Search filter: "${search}"</div>` : ''}
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Seed Name</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${seeds.map((seed, index) => {
//               return `
//                 <tr>
//                   <td>${index + 1 + (page - 1) * rowsPerPage}</td>
//                   <td><strong>${seed.name}</strong></td>
//                   <td><span class="category-badge">${seed.category || "other"}</span></td>
//                   <td>${seed.description || "-"}</td>
//                   <td>${new Date(seed.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `;
//             }).join('')}
//           </tbody>
//         </table>
        
//         <div class="footer">
//           <p>Printed from Seeds Management System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               window.close();
//             }, 500);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();

//     toast.success("PDF export opened - please use browser's print dialog and select 'Save as PDF'");
//   };

//   const handlePrint = () => {
//     if (seeds.length === 0) {
//       toast.error("No data to print");
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
//         <title>Seeds Report</title>
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
//           .category-badge {
//             padding: 4px 10px;
//             border-radius: 12px;
//             font-size: 11px;
//             font-weight: 600;
//             display: inline-block;
//             background-color: #dbeafe;
//             color: #1e40af;
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
//           <h1>🌱 Seeds Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Seeds: ${totalSeeds} | Showing: ${seeds.length} seeds</div>
//           <div class="header-info">Page: ${page} of ${totalPages}</div>
//           ${search ? `<div class="header-info">Search filter: "${search}"</div>` : ''}
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Seed Name</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${seeds.map((seed, index) => {
//               return `
//                 <tr>
//                   <td>${index + 1 + (page - 1) * rowsPerPage}</td>
//                   <td><strong>${seed.name}</strong></td>
//                   <td><span class="category-badge">${seed.category || "other"}</span></td>
//                   <td>${seed.description || "-"}</td>
//                   <td>${new Date(seed.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `;
//             }).join('')}
//           </tbody>
//         </table>
        
//         <div class="footer">
//           <p>Printed from Seeds Management System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               window.close();
//             }, 500);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();
//     toast.success("Print window opened!");
//   };

//   /* ================= MODAL HANDLERS ================= */

//   const openEditModal = (seed: Seed) => {
//     setCurrentSeed(seed);
//     setNewName(seed.name);
//     setNewDescription(seed.description || "");
//     setNewCategory(seed.category || "other");
//     setEditOpen(true);
//   };

//   const openDeleteModal = (seed: Seed) => {
//     setCurrentSeed(seed);
//     setDeleteOpen(true);
//   };

//   const openAddModal = () => {
//     resetForm();
//     setAddOpen(true);
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Seeds</h1>
//           <p className="text-gray-600 mt-1">
//             Manage seed varieties for your farm. {totalSeeds} seeds found.
//           </p>
//         </div>
//         {/* Add Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={openAddModal}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
//           >
//             <FaPlus className="text-sm" />
//             Add New Seed
//           </button>
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="bg-white rounded-lg shadow mb-4 border border-gray-200">
//         <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
//           {/* Left Side: Selection Actions */}
//           <div className="flex items-center gap-2">
//             <label className="flex items-center space-x-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 checked={selectedIds.length === seeds.length && seeds.length > 0}
//                 onChange={handleSelectAll}
//                 className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//               />
//               <span>Select All</span>
//             </label>
            
//             {selectedIds.length > 0 && (
//               <button
//                 onClick={handleDeleteSelected}
//                 className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
//               >
//                 <FaTrash className="text-sm" />
//                 Delete Selected ({selectedIds.length})
//               </button>
//             )}
//           </div>

//           {/* Right Side: Export Buttons - Mobile */}
//           <div className="lg:hidden flex flex-wrap gap-2">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: seeds.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: seeds.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: seeds.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: seeds.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: seeds.length === 0 },
//             ].map((btn, i) => (
//               <div key={i} className="relative group" title={btn.label}>
//                 <button
//                   onClick={btn.onClick}
//                   disabled={btn.disabled}
//                   className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   <btn.icon />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                   {btn.label}
//                 </div>
//               </div>
//             ))}

//             {/* Rows Per Page Selector */}
//             <div className="relative">
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value={10}>10 rows</option>
//                 <option value={25}>25 rows</option>
//                 <option value={50}>50 rows</option>
//                 <option value={100}>100 rows</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
//           <div className="relative max-w-md">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search seeds..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             />
//           </div>
//           <div className="lg:flex flex-wrap gap-2 hidden">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: seeds.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: seeds.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: seeds.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: seeds.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: seeds.length === 0 },
//             ].map((btn, i) => (
//               <div key={i} className="relative group" title={btn.label}>
//                 <button
//                   onClick={btn.onClick}
//                   disabled={btn.disabled}
//                   className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   <btn.icon />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                   {btn.label}
//                 </div>
//               </div>
//             ))}

//             {/* Rows Per Page Selector */}
//             <div className="relative">
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value={10}>10 rows</option>
//                 <option value={25}>25 rows</option>
//                 <option value={50}>50 rows</option>
//                 <option value={100}>100 rows</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="w-12 px-4 py-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.length === seeds.length && seeds.length > 0}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Sr.
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Seed Name
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created Date
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {seeds.map((seed, index) => (
//                 <tr key={seed._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(seed._id)}
//                       onChange={() => handleSelectOne(seed._id)}
//                       className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {index + 1 + (page - 1) * rowsPerPage}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <div className="font-medium flex items-center gap-2">
//                       <FaSeedling className="text-green-500 text-sm" />
//                       {seed.name}
//                     </div>
//                     {seed.description && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         {seed.description}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {seed.category || "other"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <div className="text-xs text-gray-500">
//                       {new Date(seed.createdAt).toLocaleDateString()}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="relative group">
//                         <button
//                           onClick={() => openEditModal(seed)}
//                           className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors border border-blue-200"
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                           Edit
//                         </div>
//                       </div>
//                       <div className="relative group">
//                         <button
//                           onClick={() => openDeleteModal(seed)}
//                           className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors border border-red-200"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                           Delete
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {seeds.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-5xl mb-4">🌱</div>
//             <h3 className="text-lg font-semibold mb-2">No seeds found</h3>
//             <p className="text-gray-500 mb-4">
//               {search ? `No results for "${search}". Try a different search.` : "Add your first seed to get started."}
//             </p>
//             <button
//               onClick={openAddModal}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
//             >
//               <FaPlus className="text-lg" />
//               Add New Seed
//             </button>
//           </div>
//         )}

//         {/* Pagination */}
//         {seeds.length > 0 && (
//           <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-semibold">{1 + (page - 1) * rowsPerPage}</span> to{" "}
//                 <span className="font-semibold">
//                   {Math.min(page * rowsPerPage, totalSeeds)}
//                 </span> of{" "}
//                 <span className="font-semibold">{totalSeeds}</span> entries
//               </div>
//             </div>
            
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage(1)}
//                 disabled={page === 1}
//                 className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">First</span>
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
//                 </svg>
//               </button>
//               <button
//                 onClick={() => setPage(Math.max(1, page - 1))}
//                 disabled={page === 1}
//                 className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (page <= 3) {
//                   pageNum = i + 1;
//                 } else if (page >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = page - 2 + i;
//                 }
                
//                 return (
//                   <button
//                     key={i}
//                     onClick={() => setPage(pageNum)}
//                     className={`px-3 py-1 rounded ${
//                       page === pageNum
//                         ? "bg-blue-600 text-white"
//                         : "border border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
              
//               <button
//                 onClick={() => setPage(Math.min(totalPages, page + 1))}
//                 disabled={page === totalPages}
//                 className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//               <button
//                 onClick={() => setPage(totalPages)}
//                 disabled={page === totalPages}
//                 className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="sr-only">Last</span>
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ADD MODAL */}
//       <div className={`fixed inset-0 z-50 ${addOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Add New Seed
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Seed Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={newName}
//                   onChange={(e) => setNewName(e.target.value)}
//                   placeholder="e.g., 618, NAMI TOMATO, ULLAS TOMATO"
//                   disabled={loading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Enter the seed variety name</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={newDescription}
//                   onChange={(e) => setNewDescription(e.target.value)}
//                   placeholder="Optional description for the seed"
//                   disabled={loading}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 >
//                   {categories.map((category) => (
//                     <option key={category.value} value={category.value}>
//                       {category.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => setAddOpen(false)}
//                 disabled={loading}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddSeed}
//                 disabled={!newName.trim() || loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Adding..." : "Add Seed"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* EDIT MODAL */}
//       <div className={`fixed inset-0 z-50 ${editOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Edit Seed: {currentSeed?.name}
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Seed Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={newName}
//                   onChange={(e) => setNewName(e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={newDescription}
//                   onChange={(e) => setNewDescription(e.target.value)}
//                   disabled={loading}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
//                 >
//                   {categories.map((category) => (
//                     <option key={category.value} value={category.value}>
//                       {category.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => setEditOpen(false)}
//                 disabled={loading}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateSeed}
//                 disabled={!newName.trim() || loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SINGLE DELETE MODAL */}
//       <div className={`fixed inset-0 z-50 ${deleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//           <div className="p-6 text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Delete Seed?
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "{currentSeed?.name}"? 
//               This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setDeleteOpen(false)}
//                 disabled={loading}
//                 className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteSeed}
//                 disabled={loading}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* BULK DELETE MODAL */}
//       <div className={`fixed inset-0 z-50 ${bulkDeleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//           <div className="p-6 text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Delete Selected Seeds?
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete {selectedIds.length} selected seed(s)? 
//               This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setBulkDeleteOpen(false)}
//                 disabled={loading}
//                 className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmBulkDelete}
//                 disabled={loading}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Deleting..." : `Delete ${selectedIds.length} Seeds`}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }












/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaSeedling,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface Seed {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= API FUNCTIONS ================= */

const API_BASE_URL = "/api/seeds";

// API helper function
const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

/* ================= COMPONENT ================= */

export default function SeedsPage() {
  // State
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSeeds, setTotalSeeds] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<Seed | null>(null);
  
  // Form states
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("other");
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // Categories for dropdown
  const categories = [
    { value: "vegetable", label: "Vegetable" },
    { value: "fruit", label: "Fruit" },
    { value: "grain", label: "Grain" },
    { value: "herb", label: "Herb" },
    { value: "flower", label: "Flower" },
    { value: "other", label: "Other" }
  ];

  /* ================= FETCH DATA ================= */

  const fetchSeeds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search || "",
        page: page.toString(),
        limit: rowsPerPage.toString()
      });
      
      const data = await apiCall(`${API_BASE_URL}?${params}`);
      
      if (data.success) {
        setSeeds(data.data);
        setTotalPages(data.pagination.pages);
        setTotalSeeds(data.pagination.total);
      } else {
        toast.error(data.error || "Failed to load seeds");
      }
    } catch (error: any) {
      console.error("Error fetching seeds:", error);
      toast.error(error.message || "Failed to load seeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeeds();
  }, [search, page, rowsPerPage]);

  /* ================= CRUD OPERATIONS ================= */

  const handleAddSeed = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a seed name");
      return;
    }

    setLoading(true);
    try {
      const seedData = {
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        category: newCategory
      };
      
      const data = await apiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(seedData)
      });
      
      if (data.success) {
        toast.success("Seed added successfully");
        setAddOpen(false);
        resetForm();
        fetchSeeds();
      } else {
        toast.error(data.error || "Failed to add seed");
      }
    } catch (error: any) {
      console.error("Error adding seed:", error);
      toast.error(error.message || "Failed to add seed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeed = async () => {
    if (!currentSeed || !newName.trim()) return;

    setLoading(true);
    try {
      const seedData = {
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        category: newCategory
      };
      
      const data = await apiCall(`${API_BASE_URL}/${currentSeed._id}`, {
        method: "PUT",
        body: JSON.stringify(seedData)
      });
      
      if (data.success) {
        toast.success("Seed updated successfully");
        setEditOpen(false);
        resetForm();
        setCurrentSeed(null);
        fetchSeeds();
      } else {
        toast.error(data.error || "Failed to update seed");
      }
    } catch (error: any) {
      console.error("Error updating seed:", error);
      toast.error(error.message || "Failed to update seed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeed = async () => {
    if (!currentSeed) return;

    setLoading(true);
    try {
      const data = await apiCall(`${API_BASE_URL}/${currentSeed._id}`, {
        method: "DELETE"
      });
      
      if (data.success) {
        toast.success("Seed deleted successfully");
        setDeleteOpen(false);
        setCurrentSeed(null);
        fetchSeeds();
      } else {
        toast.error(data.error || "Failed to delete seed");
      }
    } catch (error: any) {
      console.error("Error deleting seed:", error);
      toast.error(error.message || "Failed to delete seed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one seed to delete");
      return;
    }

    setBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`${API_BASE_URL}/bulk`, {
        method: "POST",
        body: JSON.stringify({ ids: selectedIds })
      });
      
      if (data.success) {
        toast.success(data.message || `${selectedIds.length} seed(s) deleted successfully`);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
        fetchSeeds();
      } else {
        toast.error(data.error || "Failed to delete seeds");
        setBulkDeleteOpen(false);
      }
    } catch (error: any) {
      console.error("Error deleting selected seeds:", error);
      toast.error(error.message || "Failed to delete seeds");
      setBulkDeleteOpen(false);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM HELPERS ================= */

  const resetForm = () => {
    setNewName("");
    setNewDescription("");
    setNewCategory("other");
  };

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(seeds.map(seed => seed._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(seedId => seedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handleCopyToClipboard = async () => {
    if (seeds.length === 0) {
      toast.error("No data to copy");
      return;
    }

    const text = seeds.map(seed => seed.name).join(', ');
    navigator.clipboard.writeText(text);
    toast.success("Seed names copied to clipboard!");
  };

  const handleExportExcel = () => {
    if (seeds.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Sr.", "Seed Name", "Category", "Description", "Created Date"];
    const csvContent = [
      headers.join("\t"),
      ...seeds.map((seed, index) => [
        index + 1 + (page - 1) * rowsPerPage,
        seed.name,
        seed.category || "other",
        seed.description || "",
        new Date(seed.createdAt).toLocaleDateString(),
      ].join("\t"))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seeds-${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Excel file downloaded successfully!");
  };

  const handleExportCSV = () => {
    if (seeds.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Sr.", "Seed Name", "Category", "Description", "Created Date"];
    
    const csvContent = [
      headers.join(","),
      ...seeds.map((seed, index) => [
        index + 1 + (page - 1) * rowsPerPage,
        `"${seed.name.replace(/"/g, '""')}"`,
        `"${seed.category || "other"}"`,
        `"${(seed.description || "").replace(/"/g, '""')}"`,
        `"${new Date(seed.createdAt).toLocaleDateString()}"`,
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seeds-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV file downloaded successfully!");
  };

  const handleExportPDF = () => {
    if (seeds.length === 0) {
      toast.error("No data to export");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to export PDF");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seeds Report</title>
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
          .category-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
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
          <h1>🌱 Seeds Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Seeds: ${totalSeeds} | Showing: ${seeds.length} seeds</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
          ${search ? `<div class="header-info">Search filter: "${search}"</div>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Seed Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${seeds.map((seed, index) => {
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * rowsPerPage}</td>
                  <td><strong>${seed.name}</strong></td>
                  <td><span class="category-badge">${seed.category || "other"}</span></td>
                  <td>${seed.description || "-"}</td>
                  <td>${new Date(seed.createdAt).toLocaleDateString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Seeds Management System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    toast.success("PDF export opened - please use browser's print dialog and select 'Save as PDF'");
  };

  const handlePrint = () => {
    if (seeds.length === 0) {
      toast.error("No data to print");
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
        <title>Seeds Report</title>
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
          .category-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
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
          <h1>🌱 Seeds Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Seeds: ${totalSeeds} | Showing: ${seeds.length} seeds</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
          ${search ? `<div class="header-info">Search filter: "${search}"</div>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Seed Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${seeds.map((seed, index) => {
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * rowsPerPage}</td>
                  <td><strong>${seed.name}</strong></td>
                  <td><span class="category-badge">${seed.category || "other"}</span></td>
                  <td>${seed.description || "-"}</td>
                  <td>${new Date(seed.createdAt).toLocaleDateString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Seeds Management System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    toast.success("Print window opened!");
  };

  /* ================= MODAL HANDLERS ================= */

  const openEditModal = (seed: Seed) => {
    setCurrentSeed(seed);
    setNewName(seed.name);
    setNewDescription(seed.description || "");
    setNewCategory(seed.category || "other");
    setEditOpen(true);
  };

  const openDeleteModal = (seed: Seed) => {
    setCurrentSeed(seed);
    setDeleteOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setAddOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Seeds</h1>
          <p className="text-gray-600 mt-1">
            Manage seed varieties for your farm. {totalSeeds} seeds found.
          </p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add New Seed
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow mb-4 border border-gray-200">
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          {/* Left Side: Selection Actions */}
          <div className="flex items-center gap-2">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectedIds.length === seeds.length && seeds.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Select All</span>
            </label>
            
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          {/* Right Side: Export Buttons - Mobile */}
          <div className="lg:hidden flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: seeds.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: seeds.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: seeds.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: seeds.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: seeds.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search seeds..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="lg:flex flex-wrap gap-2 hidden">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: seeds.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: seeds.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: seeds.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: seeds.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: seeds.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === seeds.length && seeds.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seed Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seeds.map((seed, index) => (
                <tr key={seed._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(seed._id)}
                      onChange={() => handleSelectOne(seed._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1 + (page - 1) * rowsPerPage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium flex items-center gap-2">
                      <FaSeedling className="text-green-500 text-sm" />
                      {seed.name}
                    </div>
                    {seed.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {seed.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {seed.category || "other"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="text-xs text-gray-500">
                      {new Date(seed.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEditModal(seed)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors border border-blue-200"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Edit
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => openDeleteModal(seed)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors border border-red-200"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Delete
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {seeds.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold mb-2">No seeds found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No results for "${search}". Try a different search.` : "Add your first seed to get started."}
            </p>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
            >
              <FaPlus className="text-lg" />
              Add New Seed
            </button>
          </div>
        )}

        {/* Pagination */}
        {seeds.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{1 + (page - 1) * rowsPerPage}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(page * rowsPerPage, totalSeeds)}
                </span> of{" "}
                <span className="font-semibold">{totalSeeds}</span> entries
              </div>
              {/* Rows Per Page Selector - MOVED TO BOTTOM */}
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">First</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Last</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      <div className={`fixed inset-0 z-50 ${addOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Seed
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seed Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., 618, NAMI TOMATO, ULLAS TOMATO"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the seed variety name</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional description for the seed"
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setAddOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSeed}
                disabled={!newName.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Seed"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div className={`fixed inset-0 z-50 ${editOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Seed: {currentSeed?.name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seed Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSeed}
                disabled={!newName.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SINGLE DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${deleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Seed?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentSeed?.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSeed}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BULK DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${bulkDeleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Selected Seeds?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedIds.length} selected seed(s)? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setBulkDeleteOpen(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : `Delete ${selectedIds.length} Seeds`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}