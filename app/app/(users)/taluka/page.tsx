
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { 
//   FaPlus, 
//   FaEdit, 
//   FaTrash, 
//   FaSearch, 
//   FaRedo, 
//   FaCheck,
//   FaCopy,
//   FaPrint,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaFilter,
//   FaExclamationTriangle
// } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import Pagination from "@mui/material/Pagination";
// import toast from "react-hot-toast";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// interface District {
//   _id: string;
//   name: string;
// }

// interface Taluka {
//   _id: string;
//   name: string;
//   district?: {
//     _id: string;
//     name: string;
//   };
//   districtName?: string;
//   selected?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export default function TalukaPage() {
//   const [talukas, setTalukas] = useState<Taluka[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [districtsLoading, setDistrictsLoading] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Modal states
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
//   // Form states
//   const [editId, setEditId] = useState<string | null>(null);
//   const [talukaName, setTalukaName] = useState("");
//   const [selectedDistrictId, setSelectedDistrictId] = useState("");

//   // Delete states
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteName, setDeleteName] = useState("");

//   // Bulk selection state
//   const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Pagination and filter state
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   });
  
//   // District filter for talukas
//   const [filterDistrictId, setFilterDistrictId] = useState<string>("");

//   /* ---------- API FUNCTIONS ---------- */
//   const fetchDistricts = useCallback(async () => {
//     setDistrictsLoading(true);
//     try {
//       const response = await axios.get("/api/districts", {
//         params: { 
//           limit: 100,
//           page: 1
//         }
//       });
//       if (response.data.success) {
//         setDistricts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching districts:", error);
//       toast.error("Failed to load districts");
//     } finally {
//       setDistrictsLoading(false);
//     }
//   }, []);

//   const fetchTalukas = useCallback(async (page = 1, searchQuery = "", districtId = "", limit = pagination.limit) => {
//     setLoading(true);
//     try {
//       const params: any = {
//         page: page,
//         limit: limit,
//         search: searchQuery,
//       };

//       if (districtId) {
//         params.districtId = districtId;
//       }

//       const response = await axios.get("/api/talukas", { params });
//       const data = response.data;

//       if (data.success) {
//         // Format the talukas
//         const formattedTalukas = data.data.map((taluka: any) => ({
//           _id: taluka._id,
//           name: taluka.name,
//           district: taluka.district,
//           districtName: taluka.districtName || taluka.district?.name || "Unknown District",
//           createdAt: taluka.createdAt,
//           updatedAt: taluka.updatedAt,
//           selected: false
//         }));
        
//         setTalukas(formattedTalukas);
        
//         // Calculate total pages based on total count and current limit
//         const totalCount = data.pagination?.total || data.total || 0;
//         const currentLimit = limit;
//         const totalPages = Math.ceil(totalCount / currentLimit) || 1;
        
//         setPagination({
//           total: totalCount,
//           page: data.pagination?.page || data.page || 1,
//           limit: currentLimit,
//           totalPages: totalPages,
//         });
        
//         setSelectedTalukas([]);
//         setSelectAll(false);
//       }
//     } catch (error: any) {
//       console.error("Error fetching talukas:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch talukas");
//     } finally {
//       setLoading(false);
//       if (initialLoad) setInitialLoad(false);
//     }
//   }, [initialLoad]);

//   const createTaluka = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/api/talukas", {
//         name: talukaName,
//         district: selectedDistrictId
//       });
      
//       if (response.data.success) {
//         toast.success("Taluka added successfully");
//         fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to add taluka");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTaluka = async (id: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.put(`/api/talukas/${id}`, {
//         name: talukaName,
//         district: selectedDistrictId
//       });
      
//       if (response.data.success) {
//         toast.success("Taluka updated successfully");
//         fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update taluka");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTaluka = async (id: string) => {
//     setLoading(true);
//     try {
//       await axios.delete(`/api/talukas/${id}`);
//       toast.success("Taluka deleted successfully");
      
//       // Check if we need to go to previous page
//       if (talukas.length === 1 && pagination.page > 1) {
//         await fetchTalukas(pagination.page - 1, search, filterDistrictId, pagination.limit);
//       } else {
//         await fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
//       }
//       return true;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete taluka");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bulkDeleteTalukas = async (ids: string[]) => {
//     setLoading(true);
//     try {
//       await axios.delete("/api/talukas", { data: { ids } });
//       toast.success(`${ids.length} taluka(s) deleted successfully`);
      
//       // Check if we need to go to previous page
//       if (talukas.length === ids.length && pagination.page > 1) {
//         await fetchTalukas(pagination.page - 1, search, filterDistrictId, pagination.limit);
//       } else {
//         await fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
//       }
//       return true;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete talukas");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- INITIAL FETCH ---------- */
//   useEffect(() => {
//     fetchDistricts();
//   }, [fetchDistricts]);

//   useEffect(() => {
//     if (districts.length > 0 && initialLoad) {
//       fetchTalukas(1, search, filterDistrictId, pagination.limit);
//     }
//   }, [districts]);

//   /* ---------- SELECT HANDLERS ---------- */
//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allTalukaIds = talukas.map(taluka => taluka._id);
//       setSelectedTalukas(allTalukaIds);
//       setSelectAll(true);
//     } else {
//       setSelectedTalukas([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedTalukas([...selectedTalukas, id]);
//     } else {
//       setSelectedTalukas(selectedTalukas.filter(talukaId => talukaId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ---------- CRUD HANDLERS ---------- */
//   const openAdd = () => {
//     setEditId(null);
//     setTalukaName("");
//     setSelectedDistrictId("");
//     setShowModal(true);
//   };

//   const openEdit = (t: Taluka) => {
//     setEditId(t._id);
//     setTalukaName(t.name);
//     setSelectedDistrictId(t.district?._id || "");
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!talukaName.trim()) {
//       toast.error("Please enter taluka name");
//       return;
//     }
    
//     if (!selectedDistrictId) {
//       toast.error("Please select a district");
//       return;
//     }

//     let success;
//     if (editId) {
//       success = await updateTaluka(editId);
//     } else {
//       success = await createTaluka();
//     }

//     if (success) {
//       setShowModal(false);
//     }
//   };

//   const openDeleteConfirmation = (id: string, name: string) => {
//     setDeleteId(id);
//     setDeleteName(name);
//     setShowDeleteModal(true);
//   };

//   const openBulkDeleteConfirmation = () => {
//     if (selectedTalukas.length === 0) {
//       toast.error("No talukas selected");
//       return;
//     }
//     setShowBulkDeleteModal(true);
//   };

//   const handleDeleteConfirmed = async () => {
//     if (!deleteId) return;
//     try {
//       await deleteTaluka(deleteId);
//       setShowDeleteModal(false);
//     } catch (error) {
//       // Error handled in deleteTaluka function
//     }
//   };

//   const handleBulkDeleteConfirmed = async () => {
//     try {
//       await bulkDeleteTalukas(selectedTalukas);
//       setShowBulkDeleteModal(false);
//     } catch (error) {
//       // Error handled in bulkDeleteTalukas function
//     }
//   };

//   /* ---------- EXPORT FUNCTIONS ---------- */
//   const handleCopy = async () => {
//     const text = talukas.map((taluka, index) => 
//       `${index + 1}\t${taluka.name}\t${taluka.districtName}`
//     ).join("\n");
    
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Talukas data copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = () => {
//     if (talukas.length === 0) {
//       toast.error("No talukas to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(talukas.map((taluka, index) => ({
//         "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
//         "Taluka Name": taluka.name,
//         "District": taluka.districtName,
//         "Created At": taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A',
//         "Updated At": taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'
//       })));
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Talukas");
//       XLSX.writeFile(wb, `talukas-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleExportCSV = () => {
//     if (talukas.length === 0) {
//       toast.error("No talukas to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(talukas.map((taluka, index) => ({
//         "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
//         "Taluka Name": taluka.name,
//         "District": taluka.districtName
//       })));
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `talukas-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handleExportPDF = () => {
//     if (talukas.length === 0) {
//       toast.error("No talukas to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Talukas Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Taluka Name", "District"];
//       const tableRows: any = talukas.map((taluka, index) => [
//         index + 1 + (pagination.page - 1) * pagination.limit,
//         taluka.name,
//         taluka.districtName || 'N/A'
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`talukas-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   const handlePrint = () => {
//     if (talukas.length === 0) {
//       toast.error("No talukas to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Talukas Report</title>
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
//           <h1>🏘️ Talukas Management Report</h1>
//           <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
//           <div class="header-info">Total Talukas: ${pagination.total} | Showing: ${talukas.length} talukas</div>
//           <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Taluka Name</th>
//               <th>District</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${talukas.map((taluka, index) => `
//               <tr>
//                 <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
//                 <td><strong>${taluka.name}</strong></td>
//                 <td>${taluka.districtName || 'N/A'}</td>
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

//   /* ---------- PAGINATION ---------- */
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setPagination(prev => ({ ...prev, page }));
//     fetchTalukas(page, search, filterDistrictId, pagination.limit);
//   };

//   const handleLimitChange = (newLimit: number) => {
//     // When changing limit, reset to page 1 and fetch with new limit
//     const updatedPagination = {
//       ...pagination,
//       limit: newLimit,
//       page: 1 // Reset to first page when changing limit
//     };
//     setPagination(updatedPagination);
//     fetchTalukas(1, search, filterDistrictId, newLimit);
//   };

//   /* ---------- SEARCH & FILTERS ---------- */
//   useEffect(() => {
//     if (!initialLoad) {
//       const timer = setTimeout(() => {
//         fetchTalukas(1, search, filterDistrictId, pagination.limit);
//         setPagination(prev => ({ ...prev, page: 1 }));
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [search]);

//   useEffect(() => {
//     if (!initialLoad && filterDistrictId !== undefined) {
//       fetchTalukas(1, search, filterDistrictId, pagination.limit);
//       setPagination(prev => ({ ...prev, page: 1 }));
//     }
//   }, [filterDistrictId]);

//   const handleResetFilters = () => {
//     setSearch("");
//     setFilterDistrictId("");
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchTalukas(1, "", "", pagination.limit);
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay - Only show for initial load */}
//       {loading && initialLoad && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Talukas Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all talukas. {pagination.total} talukas found.
//           </p>
//         </div>
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedTalukas.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FaCheck className="text-red-600" />
//               <span className="font-medium text-red-700">
//                 {selectedTalukas.length} taluka{selectedTalukas.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <button
//               onClick={openBulkDeleteConfirmation}
//               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//             >
//               <FaTrash className="w-4 h-4" />
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Mobile Export Buttons */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center justify-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 ${btn.color} font-medium`}
//           >
//             <btn.icon size={14} />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <input
//                 type="text"
//                 placeholder="Search talukas..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-72 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* District Filter */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <select
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                 value={filterDistrictId}
//                 onChange={(e) => setFilterDistrictId(e.target.value)}
//                 disabled={districtsLoading}
//               >
//                 {districtsLoading ? (
//                   <option>Loading districts...</option>
//                 ) : districts.length === 0 ? (
//                   <option value="">No districts available</option>
//                 ) : (
//                   <>
//                     <option value="">All Districts</option>
//                     {districts.map(district => (
//                       <option key={district._id} value={district._id}>
//                         {district.name}
//                       </option>
//                     ))}
//                   </>
//                 )}
//               </select>
//             </div>
//           </div>

//           {/* Reset Button */}
//           <div className="md:col-span-2">
//             <button
//               onClick={handleResetFilters}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <FaRedo size={14} /> Reset
//             </button>
//           </div>

//           {/* Desktop Export Buttons */}
//           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//               { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//               { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//               >
//                 <btn.icon size={14} />
//               </button>
//             ))}
//           </div>

//           {/* Add New Button */}
//           <div className="md:col-span-2">
//             <button
//               onClick={openAdd}
//               className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <FaPlus size={14} /> Add Taluka
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading spinner for non-initial loads */}
//       {loading && !initialLoad && (
//         <div className="flex justify-center items-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
//           <span className="ml-2 text-gray-600">Loading...</span>
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && talukas.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold w-10">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="rounded border-gray-300"
//                     />
//                   </th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Taluka Name</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Updated At</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {talukas.map((taluka, index) => (
//                   <tr key={taluka._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-[.6rem] text-sm">
//                       <input
//                         type="checkbox"
//                         checked={selectedTalukas.includes(taluka._id)}
//                         onChange={(e) => handleSelectOne(taluka._id, e.target.checked)}
//                         className="rounded border-gray-300"
//                       />
//                     </td>
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (pagination.page - 1) * pagination.limit}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{taluka.name}</div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="text-gray-700">{taluka.districtName || 'N/A'}</div>
//                     </td>
//                     <td className="p-[.6rem] text-sm text-gray-600">
//                       {taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="p-[.6rem] text-sm text-gray-600">
//                       {taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => openEdit(taluka)}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="Edit Taluka"
//                         >
//                           <FaEdit size={14} />
//                         </button>
//                         <button
//                           onClick={() => openDeleteConfirmation(taluka._id, taluka.name)}
//                           className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Delete Taluka"
//                         >
//                           <FaTrash size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {talukas.map((taluka, index) => (
//               <div key={taluka._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedTalukas.includes(taluka._id)}
//                       onChange={(e) => handleSelectOne(taluka._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     />
//                     <div>
//                       <div className="font-bold text-gray-800">{taluka.name}</div>
//                       <div className="text-xs text-gray-500">Sr. {index + 1 + (pagination.page - 1) * pagination.limit}</div>
//                     </div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => openEdit(taluka)} className="p-1.5 text-blue-600">
//                       <FaEdit size={14} />
//                     </button>
//                     <button 
//                       onClick={() => openDeleteConfirmation(taluka._id, taluka.name)}
//                       className="p-1.5 text-red-600"
//                     >
//                       <FaTrash size={14} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-xs">
//                   <div>
//                     <div className="text-xs text-gray-500">District</div>
//                     <div className="text-xs font-medium">{taluka.districtName || 'N/A'}</div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-[.6rem] text-sm">
//                     <div>
//                       <div className="text-xs text-gray-500">Created At</div>
//                       <div className="text-xs">{taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Updated At</div>
//                       <div className="text-xs">{taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && talukas.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">🏘️</div>
//           <h3 className="text-xl font-semibold mb-2">No talukas found</h3>
//           <p className="text-gray-500">
//             {search 
//               ? `No talukas matching "${search}" found`
//               : filterDistrictId 
//                 ? `No talukas found for selected district`
//                 : "Try adjusting your search or filters"}
//           </p>
//           <button
//             onClick={handleResetFilters}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && talukas.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
//             <span className="font-semibold">{pagination.total}</span> talukas
//             <select
//               value={pagination.limit}
//               onChange={(e) => {
//                 const newLimit = Number(e.target.value);
//                 handleLimitChange(newLimit);
//               }}
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
//               Page {pagination.page} of {pagination.totalPages}
//             </div>
//             <Pagination
//               count={pagination.totalPages}
//               page={pagination.page}
//               onChange={handlePageChange}
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
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-xl text-gray-800">
//                 {editId ? "Edit Taluka" : "Add New Taluka"}
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 <MdClose size={24} />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   District *
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={selectedDistrictId}
//                   onChange={(e) => setSelectedDistrictId(e.target.value)}
//                   disabled={districtsLoading}
//                 >
//                   <option value="">Select a district</option>
//                   {districts.map(district => (
//                     <option key={district._id} value={district._id}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Taluka Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={talukaName}
//                   onChange={(e) => setTalukaName(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSave()}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Enter taluka name"
//                   autoFocus
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : editId ? "Update" : "Add Taluka"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE SINGLE CONFIRMATION MODAL */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//                 <FaExclamationTriangle className="text-red-600 text-2xl" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Taluka</h2>
//               <p className="text-gray-600">
//                 Are you sure you want to delete <span className="font-semibold">{deleteName}</span>?
//               </p>
//               <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
//             </div>

//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirmed}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <FaTrash /> Delete
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BULK DELETE CONFIRMATION MODAL */}
//       {showBulkDeleteModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//                 <FaExclamationTriangle className="text-red-600 text-2xl" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Selected Talukas</h2>
//               <p className="text-gray-600">
//                 Are you sure you want to delete <span className="font-semibold">{selectedTalukas.length}</span> selected taluka{selectedTalukas.length !== 1 ? 's' : ''}?
//               </p>
//               <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
//             </div>

//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setShowBulkDeleteModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleBulkDeleteConfirmed}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <FaTrash /> Delete {selectedTalukas.length} Taluka{selectedTalukas.length !== 1 ? 's' : ''}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






















"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaRedo, 
  FaCheck,
  FaCopy,
  FaPrint,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaFilter,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import toast from "react-hot-toast";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface State {
  _id: string;
  name: string;
}

interface District {
  _id: string;
  name: string;
  stateId: string;
}

interface Taluka {
  _id: string;
  name: string;
  district?: {
    _id: string;
    name: string;
  };
  districtName?: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TalukaPage() {
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [talukaName, setTalukaName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // Delete states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  // Bulk selection state
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination and filter state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  
  // District filter for talukas
  const [filterDistrictId, setFilterDistrictId] = useState<string>("");

  /* ---------- API FUNCTIONS ---------- */
  const fetchStates = useCallback(async () => {
    setStatesLoading(true);
    try {
      const response = await axios.get("/api/states", {
        params: { 
          limit: 100,
          page: 1
        }
      });
      if (response.data.success) {
        setStates(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
      toast.error("Failed to load states");
    } finally {
      setStatesLoading(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (stateId?: string) => {
    setDistrictsLoading(true);
    try {
      const params: any = {
        limit: 100,
        page: 1
      };
      
      if (stateId) {
        params.stateId = stateId;
      }

      const response = await axios.get("/api/districts", { params });
      if (response.data.success) {
        const districtsData = response.data.data;
        setDistricts(districtsData);
        
        // If editing and we have a selected district, filter districts for that state
        if (stateId) {
          const filtered = districtsData.filter((district: District) => district.stateId === stateId);
          setFilteredDistricts(filtered);
        } else {
          setFilteredDistricts(districtsData);
        }
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  const fetchTalukas = useCallback(async (page = 1, searchQuery = "", districtId = "", limit = pagination.limit) => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
        limit: limit,
        search: searchQuery,
      };

      if (districtId) {
        params.districtId = districtId;
      }

      const response = await axios.get("/api/talukas", { params });
      const data = response.data;

      if (data.success) {
        // Format the talukas
        const formattedTalukas = data.data.map((taluka: any) => ({
          _id: taluka._id,
          name: taluka.name,
          district: taluka.district,
          districtName: taluka.districtName || taluka.district?.name || "Unknown District",
          createdAt: taluka.createdAt,
          updatedAt: taluka.updatedAt,
          selected: false
        }));
        
        setTalukas(formattedTalukas);
        
        // Calculate total pages based on total count and current limit
        const totalCount = data.pagination?.total || data.total || 0;
        const currentLimit = limit;
        const totalPages = Math.ceil(totalCount / currentLimit) || 1;
        
        setPagination({
          total: totalCount,
          page: data.pagination?.page || data.page || 1,
          limit: currentLimit,
          totalPages: totalPages,
        });
        
        setSelectedTalukas([]);
        setSelectAll(false);
      }
    } catch (error: any) {
      console.error("Error fetching talukas:", error);
      toast.error(error.response?.data?.message || "Failed to fetch talukas");
    } finally {
      setLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  }, [initialLoad]);

  const createTaluka = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/talukas", {
        name: talukaName,
        district: selectedDistrictId
      });
      
      if (response.data.success) {
        toast.success("Taluka added successfully");
        fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add taluka");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTaluka = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/talukas/${id}`, {
        name: talukaName,
        district: selectedDistrictId
      });
      
      if (response.data.success) {
        toast.success("Taluka updated successfully");
        fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update taluka");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTaluka = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/talukas/${id}`);
      toast.success("Taluka deleted successfully");
      
      // Check if we need to go to previous page
      if (talukas.length === 1 && pagination.page > 1) {
        await fetchTalukas(pagination.page - 1, search, filterDistrictId, pagination.limit);
      } else {
        await fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete taluka");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteTalukas = async (ids: string[]) => {
    setLoading(true);
    try {
      await axios.delete("/api/talukas", { data: { ids } });
      toast.success(`${ids.length} taluka(s) deleted successfully`);
      
      // Check if we need to go to previous page
      if (talukas.length === ids.length && pagination.page > 1) {
        await fetchTalukas(pagination.page - 1, search, filterDistrictId, pagination.limit);
      } else {
        await fetchTalukas(pagination.page, search, filterDistrictId, pagination.limit);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete talukas");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
    fetchDistricts();
  }, [fetchStates, fetchDistricts]);

  useEffect(() => {
    if (districts.length > 0 && initialLoad) {
      fetchTalukas(1, search, filterDistrictId, pagination.limit);
    }
  }, [districts]);

  /* ---------- STATE FILTER HANDLER ---------- */
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedDistrictId(""); // Reset district selection
    
    if (stateId) {
      // Filter districts based on selected state
      const filtered = districts.filter(district => district.stateId === stateId);
      setFilteredDistricts(filtered);
    } else {
      // If no state selected, show all districts
      setFilteredDistricts(districts);
    }
  };

  /* ---------- SELECT HANDLERS ---------- */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allTalukaIds = talukas.map(taluka => taluka._id);
      setSelectedTalukas(allTalukaIds);
      setSelectAll(true);
    } else {
      setSelectedTalukas([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTalukas([...selectedTalukas, id]);
    } else {
      setSelectedTalukas(selectedTalukas.filter(talukaId => talukaId !== id));
      setSelectAll(false);
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setTalukaName("");
    setSelectedStateId("");
    setSelectedDistrictId("");
    setFilteredDistricts(districts); // Reset to show all districts
    setShowModal(true);
  };

  const openEdit = (t: Taluka) => {
    setEditId(t._id);
    setTalukaName(t.name);
    setSelectedDistrictId(t.district?._id || "");
    
    // Find the state for the selected district
    const district = districts.find(d => d._id === t.district?._id);
    if (district) {
      setSelectedStateId(district.stateId);
      // Filter districts based on this state
      const filtered = districts.filter(d => d.stateId === district.stateId);
      setFilteredDistricts(filtered);
    } else {
      setSelectedStateId("");
      setFilteredDistricts(districts);
    }
    
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!talukaName.trim()) {
      toast.error("Please enter taluka name");
      return;
    }
    
    if (!selectedStateId) {
      toast.error("Please select a state");
      return;
    }
    
    if (!selectedDistrictId) {
      toast.error("Please select a district");
      return;
    }

    let success;
    if (editId) {
      success = await updateTaluka(editId);
    } else {
      success = await createTaluka();
    }

    if (success) {
      setShowModal(false);
    }
  };

  const openDeleteConfirmation = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
    setShowDeleteModal(true);
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedTalukas.length === 0) {
      toast.error("No talukas selected");
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      await deleteTaluka(deleteId);
      setShowDeleteModal(false);
    } catch (error) {
      // Error handled in deleteTaluka function
    }
  };

  const handleBulkDeleteConfirmed = async () => {
    try {
      await bulkDeleteTalukas(selectedTalukas);
      setShowBulkDeleteModal(false);
    } catch (error) {
      // Error handled in bulkDeleteTalukas function
    }
  };

  /* ---------- EXPORT FUNCTIONS ---------- */
  // const handleCopy = async () => {
  //   const text = talukas.map((taluka, index) => 
  //     `${index + 1}\t${taluka.name}\t${taluka.districtName}`
  //   ).join("\n");
    
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     toast.success("Talukas data copied to clipboard!");
  //   } catch (err) {
  //     toast.error("Failed to copy to clipboard");
  //   }
  // };
 const handleCopy = async () => {
  // Calculate column widths based on content
  const maxIndexLength = Math.max(3, talukas.length.toString().length + 1);
  const maxTalukaLength = Math.max(7, ...talukas.map(t => t.name.length));
  const maxDistrictLength = Math.max(9, ...talukas.map(t => t.districtName?.length || 0));
  
  // Create table header with proper padding
  const headerNo = "No.".padEnd(maxIndexLength);
  const headerTaluka = "Taluka".padEnd(maxTalukaLength);
  const headerDistrict = "District".padEnd(maxDistrictLength);
  const tableHeader = `${headerNo}\t${headerTaluka}\t${headerDistrict}`;
  
  // Create separator line
  const separator = 
    "-".repeat(maxIndexLength) + "\t" +
    "-".repeat(maxTalukaLength) + "\t" +
    "-".repeat(maxDistrictLength);
  
  // Create table rows
  const tableRows = talukas.map((taluka, index) => {
    const number = (index + 1).toString().padEnd(maxIndexLength);
    const talukaName = (taluka.name || "").padEnd(maxTalukaLength);
    const districtName = (taluka.districtName || "").padEnd(maxDistrictLength);
    return `${number}\t${talukaName}\t${districtName}`;
  }).join("\n");
  
  const text = `${tableHeader}\n${separator}\n${tableRows}`;
  
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Talukas table copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy to clipboard");
  }
};

  const handleExportExcel = () => {
    if (talukas.length === 0) {
      toast.error("No talukas to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(talukas.map((taluka, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "Taluka Name": taluka.name,
        "District": taluka.districtName,
        "Created At": taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A',
        "Updated At": taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Talukas");
      XLSX.writeFile(wb, `talukas-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportCSV = () => {
    if (talukas.length === 0) {
      toast.error("No talukas to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(talukas.map((taluka, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "Taluka Name": taluka.name,
        "District": taluka.districtName
      })));
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `talukas-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handleExportPDF = () => {
    if (talukas.length === 0) {
      toast.error("No talukas to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Talukas Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Taluka Name", "District"];
      const tableRows: any = talukas.map((taluka, index) => [
        index + 1 + (pagination.page - 1) * pagination.limit,
        taluka.name,
        taluka.districtName || 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`talukas-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  const handlePrint = () => {
    if (talukas.length === 0) {
      toast.error("No talukas to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Talukas Report</title>
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
          <h1>🏘️ Talukas Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Talukas: ${pagination.total} | Showing: ${talukas.length} talukas</div>
          <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Taluka Name</th>
              <th>District</th>
            </tr>
          </thead>
          <tbody>
            ${talukas.map((taluka, index) => `
              <tr>
                <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
                <td><strong>${taluka.name}</strong></td>
                <td>${taluka.districtName || 'N/A'}</td>
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

  /* ---------- PAGINATION ---------- */
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchTalukas(page, search, filterDistrictId, pagination.limit);
  };

  const handleLimitChange = (newLimit: number) => {
    // When changing limit, reset to page 1 and fetch with new limit
    const updatedPagination = {
      ...pagination,
      limit: newLimit,
      page: 1 // Reset to first page when changing limit
    };
    setPagination(updatedPagination);
    fetchTalukas(1, search, filterDistrictId, newLimit);
  };

  /* ---------- SEARCH & FILTERS ---------- */
  useEffect(() => {
    if (!initialLoad) {
      const timer = setTimeout(() => {
        fetchTalukas(1, search, filterDistrictId, pagination.limit);
        setPagination(prev => ({ ...prev, page: 1 }));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [search]);

  useEffect(() => {
    if (!initialLoad && filterDistrictId !== undefined) {
      fetchTalukas(1, search, filterDistrictId, pagination.limit);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filterDistrictId]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterDistrictId("");
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTalukas(1, "", "", pagination.limit);
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay - Only show for initial load */}
      {loading && initialLoad && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Taluk Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all taluk. {pagination.total} taluk found.
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedTalukas.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedTalukas.length} taluka{selectedTalukas.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={openBulkDeleteConfirmation}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Mobile Export Buttons */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center justify-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 ${btn.color} font-medium`}
          >
            <btn.icon size={14} />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search talukas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-72 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={filterDistrictId}
                onChange={(e) => setFilterDistrictId(e.target.value)}
                disabled={districtsLoading}
              >
                {districtsLoading ? (
                  <option>Loading districts...</option>
                ) : districts.length === 0 ? (
                  <option value="">No districts available</option>
                ) : (
                  <>
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district._id} value={district._id}>
                        {district.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo size={14} /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon size={14} />
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <div className="md:col-span-2">
            <button
              onClick={openAdd}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaPlus size={14} /> Add Taluka
            </button>
          </div>
        </div>
      </div>

      {/* Loading spinner for non-initial loads */}
      {loading && !initialLoad && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && talukas.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Taluk Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Updated At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {talukas.map((taluka, index) => (
                  <tr key={taluka._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm">
                      <input
                        type="checkbox"
                        checked={selectedTalukas.includes(taluka._id)}
                        onChange={(e) => handleSelectOne(taluka._id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{taluka.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="text-gray-700">{taluka.districtName || 'N/A'}</div>
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => openEdit(taluka)}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Taluka"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(taluka._id, taluka.name)}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Taluka"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {talukas.map((taluka, index) => (
              <div key={taluka._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTalukas.includes(taluka._id)}
                      onChange={(e) => handleSelectOne(taluka._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{taluka.name}</div>
                      <div className="text-xs text-gray-500">Sr. {index + 1 + (pagination.page - 1) * pagination.limit}</div>
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => openEdit(taluka)} className="p-1.5 text-blue-600">
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => openDeleteConfirmation(taluka._id, taluka.name)}
                      className="p-1.5 text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-xs text-gray-500">District</div>
                    <div className="text-xs font-medium">{taluka.districtName || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Created At</div>
                      <div className="text-xs">{taluka.createdAt ? new Date(taluka.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Updated At</div>
                      <div className="text-xs">{taluka.updatedAt ? new Date(taluka.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && talukas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏘️</div>
          <h3 className="text-xl font-semibold mb-2">No talukas found</h3>
          <p className="text-gray-500">
            {search 
              ? `No talukas matching "${search}" found`
              : filterDistrictId 
                ? `No talukas found for selected district`
                : "Try adjusting your search or filters"}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && talukas.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
            <span className="font-semibold">{pagination.total}</span> talukas
            <select
              value={pagination.limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                handleLimitChange(newLimit);
              }}
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
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl text-gray-800">
                {editId ? "Edit Taluka" : "Add New Taluka"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={statesLoading}
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection - Filtered by State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  disabled={districtsLoading || !selectedStateId}
                >
                  <option value="">Select a district</option>
                  {filteredDistricts.length === 0 ? (
                    <option value="" disabled>
                      {selectedStateId ? "No districts found for selected state" : "Please select a state first"}
                    </option>
                  ) : (
                    filteredDistricts.map(district => (
                      <option key={district._id} value={district._id}>
                        {district.name}
                      </option>
                    ))
                  )}
                </select>
                {selectedStateId && filteredDistricts.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No districts available for the selected state
                  </p>
                )}
              </div>

              {/* Taluka Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taluka Name *
                </label>
                <input
                  type="text"
                  value={talukaName}
                  onChange={(e) => setTalukaName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter taluka name"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading || !selectedStateId || !selectedDistrictId || !talukaName.trim()}
              >
                {loading ? "Saving..." : editId ? "Update" : "Add Taluka"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SINGLE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Taluka</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteName}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Selected Talukas</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{selectedTalukas.length}</span> selected taluka{selectedTalukas.length !== 1 ? 's' : ''}?
              </p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash /> Delete {selectedTalukas.length} Taluka{selectedTalukas.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}