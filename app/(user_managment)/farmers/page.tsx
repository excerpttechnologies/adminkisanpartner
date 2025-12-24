// "use client";

// import { useMemo, useState, useEffect, ReactNode, MouseEventHandler, useCallback } from "react";
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
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// interface Farmer {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address?: string;
//     villageGramaPanchayat?: string;
//     pincode?: string;
//     state?: string;
//     district?: string;
//     taluk?: string;
//     post?: string;
//   };
// }

// interface ApiResponse {
//   success: boolean;
//   data: Farmer[];
//   page: number;
//   limit: number;
//   total: number;
// }

// interface District {
//   _id: string;
//   name: string;
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalFarmers, setTotalFarmers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
//   const [districtsLoading, setDistrictsLoading] = useState(false);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [disName, setDisName] = useState("");

//   /* ================= FETCH FARMERS ================= */

//   const fetchFarmers = async (page: number = 1, searchQuery: string = "", districtName: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: rowsPerPage.toString(),
//         search: searchQuery,
//         district: districtName
//       });

//       const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
//       if (res.data.success) {
//         setFarmers(res.data.data);
//         setTotalFarmers(res.data.total);
//         // Calculate total pages correctly
//         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
//         setTotalPages(calculatedTotalPages);
//         setCurrentPage(res.data.page);
//       }
//     } catch (err: any) {
//       console.error('Error fetching farmers:', err);
//       setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
//       setFarmers([]);
//       toast.error(err.response?.data?.message || "Failed to load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   useEffect(() => {
//     fetchDistricts();
//   }, [fetchDistricts]);

//   useEffect(() => {
//     fetchFarmers(currentPage, search, disName);
//   }, [currentPage, rowsPerPage, disName]);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchFarmers(1, search, disName);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ================= DELETE FARMER ================= */

//   const handleDelete = async () => {
//     if (!selectedFarmer) return;
   
//     try {
//       await axios.delete(`/api/farmers/${selectedFarmer._id}`);
//       toast.success("Farmer deleted successfully!");
//       setDeleteOpen(false);
//       fetchFarmers(currentPage, search, disName);
//     } catch (error: any) {
//       console.error("Error deleting farmer:", error);
//       toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = farmers.map((farmer, index) => ({
//     "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
//     "Name": farmer.personalInfo.name,
//     "Mobile": farmer.personalInfo.mobileNo,
//     "Email": farmer.personalInfo.email || 'N/A',
//     "Village": farmer.personalInfo.villageGramaPanchayat || 'N/A',
//     "District": farmer.personalInfo.district || 'N/A',
//     "State": farmer.personalInfo.state || 'N/A',
//     "Address": farmer.personalInfo.address || 'N/A',
//     "Taluk": farmer.personalInfo.taluk || 'N/A',
//     "Post": farmer.personalInfo.post || 'N/A',
//     "Pincode": farmer.personalInfo.pincode || 'N/A',
//   }));

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Farmers Report</title>
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
//           <h1>👨‍🌾 Farmers Management Report</h1>
//           <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
//           <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Email</th>
//               <th>Village</th>
//               <th>District</th>
//               <th>State</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${farmers.map((farmer, index) => `
//               <tr>
//                 <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                 <td><strong>${farmer.personalInfo.name}</strong></td>
//                 <td>${farmer.personalInfo.mobileNo}</td>
//                 <td>${farmer.personalInfo.email || 'N/A'}</td>
//                 <td>${farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                 <td>${farmer.personalInfo.district || 'N/A'}</td>
//                 <td>${farmer.personalInfo.state || 'N/A'}</td>
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

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (printWindow) {
//       printWindow.document.write(printContent);
//       printWindow.document.close();
//     } else {
//       toast.error("Please allow popups to print");
//     }
//   };

//   const handleCopy = async () => {
//     const text = exportData.map(f => 
//       `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Village}\t${f.District}\t${f.State}`
//     ).join("\n");
    
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Farmers data copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Farmers");
//       XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.text("Farmers Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State"];
//       const tableRows: any = exportData.map(f => [
//         f["Sr."],
//         f.Name,
//         f.Mobile,
//         f.Email,
//         f.Village,
//         f.District,
//         f.State,
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= RESET FILTERS ================= */

//   const handleResetFilters = () => {
//     setSearch("");
//     setCurrentPage(1);
//     setDisName("");
//     fetchFarmers(1, "", "");
//     setRowsPerPage(10)
//   };

//   /* ================= PAGINATION HELPER ================= */

//   const generatePagination = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       let startPage = Math.max(1, currentPage - 2);
//       let endPage = Math.min(totalPages, currentPage + 2);
      
//       if (currentPage <= 3) {
//         startPage = 1;
//         endPage = maxVisiblePages;
//       } else if (currentPage >= totalPages - 2) {
//         startPage = totalPages - maxVisiblePages + 1;
//         endPage = totalPages;
//       }
      
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }
//     }
    
//     return pages;
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
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
//                 placeholder="Search by name, mobile, email, or village..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* District Filter */}
//           <div className="md:col-span-3">
//             <select
//               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//               value={disName}
//               onChange={(e) => setDisName(e.target.value)}
//               disabled={districtsLoading}
//             >
//               {districtsLoading ? (
//                 <option>Loading districts...</option>
//               ) : districts.length === 0 ? (
//                 <option value="">No districts available</option>
//               ) : (
//                 <>
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district._id} value={district.name}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>

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
//       {!loading && farmers.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Village</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {farmers.map((farmer, index) => (
//                   <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{farmer.personalInfo.name}</div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.mobileNo}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <span className={`${farmer.personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                         {farmer.personalInfo.email || 'No email'}
//                       </span>
//                     </td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.district || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.state || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
//                           className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Delete Farmer"
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
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {farmers.map((farmer, index) => (
//               <div key={farmer._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <div className="font-bold text-gray-800">{farmer.personalInfo.name}</div>
//                     <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} className="p-1.5 text-blue-600">
//                       <FaEye />
//                     </button>
//                     <button onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} className="p-1.5 text-red-600">
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <div className="text-sm text-gray-500">Mobile</div>
//                     <div className="text-sm">{farmer.personalInfo.mobileNo}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Email</div>
//                     <div className={`text-sm ${farmer.personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
//                       {farmer.personalInfo.email || 'No email'}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-[.6rem] text-sm">
//                     <div>
//                       <div className="text-sm text-gray-500">Village</div>
//                       <div className="text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">District</div>
//                       <div className="text-sm">{farmer.personalInfo.district || 'N/A'}</div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">State</div>
//                     <div className="text-sm">{farmer.personalInfo.state || 'N/A'}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && farmers.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
//           <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
//           <p className="text-gray-500">Try adjusting your search or filters</p>
//           <button
//             onClick={handleResetFilters}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && farmers.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
//             <span className="font-semibold">{totalFarmers}</span> farmers
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="p-1 ml-3 border border-zinc-300 rounded"
//             >
//               {[5, 10, 20, 50, 100].map((option) => (
//                 <option key={option} value={option}>
//                   {option} per page
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               className={`border px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
//             >
//               Previous
//             </button>
            
//             <div className="flex items-center gap-1">
//               {generatePagination().map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-1 rounded ${currentPage === page ? 'bg-green-500 text-white' : 'border hover:bg-gray-100'}`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>
            
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               className={`border px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       {viewOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-xl text-gray-800">Farmer Details</h2>
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
//               <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
//               <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
//               <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
//               <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
//               <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
//               <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
//               <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
//               <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
//               <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name}</span>? 
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setDeleteOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                 >
//                   Delete Farmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );

// "use client";

// import { useState, useEffect, useCallback } from "react";
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
//   FaCheck,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination } from "@mui/material";

// /* ================= TYPES ================= */

// interface Farmer {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address?: string;
//     villageGramaPanchayat?: string;
//     pincode?: string;
//     state?: string;
//     district?: string;
//     taluk?: string;
//     post?: string;
//   };
// }

// interface ApiResponse {
//   success: boolean;
//   data: Farmer[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// interface District {
//   _id: string;
//   name: string;
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalFarmers, setTotalFarmers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
//   const [districtsLoading, setDistrictsLoading] = useState(false);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [disName, setDisName] = useState("");

//   // Bulk selection state
//   const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);

//   /* ================= FETCH FARMERS ================= */

//   const fetchFarmers = async (page: number = 1, searchQuery: string = "", districtName: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: rowsPerPage.toString(),
//         search: searchQuery,
//         district: districtName
//       });

//       const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
//       if (res.data.success) {
//         setFarmers(res.data.data);
//         setTotalFarmers(res.data.total);
//         setTotalPages(res.data.totalPages || Math.ceil(res.data.total / rowsPerPage));
//         setCurrentPage(res.data.page);
//         // Reset selection when data changes
//         setSelectedFarmers([]);
//         setSelectAll(false);
//       }
//     } catch (err: any) {
//       console.error('Error fetching farmers:', err);
//       setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
//       setFarmers([]);
//       toast.error(err.response?.data?.message || "Failed to load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   useEffect(() => {
//     fetchDistricts();
//   }, [fetchDistricts]);

//   useEffect(() => {
//     fetchFarmers(currentPage, search, disName);
//   }, [currentPage, rowsPerPage, disName]);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchFarmers(1, search, disName);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allFarmerIds = farmers.map(farmer => farmer._id);
//       setSelectedFarmers(allFarmerIds);
//       setSelectAll(true);
//     } else {
//       setSelectedFarmers([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedFarmers([...selectedFarmers, id]);
//     } else {
//       setSelectedFarmers(selectedFarmers.filter(farmerId => farmerId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ================= BULK DELETE ================= */

//   const handleBulkDelete = async () => {
//     if (selectedFarmers.length === 0) {
//       toast.error("No farmers selected");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post("/api/farmers/bulk-delete", {
//         ids: selectedFarmers
//       });
      
//       if (response.data.success) {
//         toast.success(response.data.message);
//         setSelectedFarmers([]);
//         setSelectAll(false);
//         setBulkDeleteOpen(false);
//         fetchFarmers(currentPage, search, disName);
//       } else {
//         toast.error("Failed to delete farmers");
//       }
//     } catch (error: any) {
//       console.error("Bulk delete error:", error);
//       toast.error("Error deleting farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SINGLE DELETE ================= */

//   const handleDelete = async () => {
//     if (!selectedFarmer) return;
   
//     try {
//       setLoading(true);
//       await axios.delete(`/api/farmers/${selectedFarmer._id}`);
//       toast.success("Farmer deleted successfully!");
//       setDeleteOpen(false);
//       fetchFarmers(currentPage, search, disName);
//     } catch (error: any) {
//       console.error("Error deleting farmer:", error);
//       toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = farmers.map((farmer, index) => ({
//     "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
//     "Name": farmer.personalInfo.name,
//     "Mobile": farmer.personalInfo.mobileNo,
//     "Email": farmer.personalInfo.email || 'N/A',
//     "Village": farmer.personalInfo.villageGramaPanchayat || 'N/A',
//     "District": farmer.personalInfo.district || 'N/A',
//     "State": farmer.personalInfo.state || 'N/A',
//     "Address": farmer.personalInfo.address || 'N/A',
//     "Taluk": farmer.personalInfo.taluk || 'N/A',
//     "Post": farmer.personalInfo.post || 'N/A',
//     "Pincode": farmer.personalInfo.pincode || 'N/A',
//   }));

//   const handlePrint = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to print");
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
//         <title>Farmers Report</title>
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
//           <h1>👨‍🌾 Farmers Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Email</th>
//               <th>Village</th>
//               <th>District</th>
//               <th>State</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${farmers.map((farmer, index) => `
//               <tr>
//                 <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                 <td><strong>${farmer.personalInfo.name}</strong></td>
//                 <td>${farmer.personalInfo.mobileNo}</td>
//                 <td>${farmer.personalInfo.email || 'N/A'}</td>
//                 <td>${farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                 <td>${farmer.personalInfo.district || 'N/A'}</td>
//                 <td>${farmer.personalInfo.state || 'N/A'}</td>
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
//     if (farmers.length === 0) {
//       toast.error("No farmers to copy");
//       return;
//     }

//     const text = exportData.map(f => 
//       `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Village}\t${f.District}\t${f.State}`
//     ).join("\n");
    
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Farmers data copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Farmers");
//       XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Farmers Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State"];
//       const tableRows: any = exportData.map(f => [
//         f["Sr."],
//         f.Name,
//         f.Mobile,
//         f.Email,
//         f.Village,
//         f.District,
//         f.State,
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= RESET FILTERS ================= */

//   const handleResetFilters = () => {
//     setSearch("");
//     setCurrentPage(1);
//     setDisName("");
//     fetchFarmers(1, "", "");
//     setRowsPerPage(10);
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
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
//           </p>
//         </div>
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedFarmers.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FaCheck className="text-red-600" />
//               <span className="font-medium text-red-700">
//                 {selectedFarmers.length} farmer{selectedFarmers.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <button
//               onClick={() => setBulkDeleteOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//             >
//               <FaTrash className="w-4 h-4" />
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

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
//                 placeholder="Search by name, mobile, email, or village..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* District Filter */}
//           <div className="md:col-span-3">
//             <select
//               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//               value={disName}
//               onChange={(e) => setDisName(e.target.value)}
//               disabled={districtsLoading}
//             >
//               {districtsLoading ? (
//                 <option>Loading districts...</option>
//               ) : districts.length === 0 ? (
//                 <option value="">No districts available</option>
//               ) : (
//                 <>
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district._id} value={district.name}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>

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
//       {!loading && farmers.length > 0 && (
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
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Village</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {farmers.map((farmer, index) => (
//                   <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-[.6rem] text-sm">
//                       <input
//                         type="checkbox"
//                         checked={selectedFarmers.includes(farmer._id)}
//                         onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
//                         className="rounded border-gray-300"
//                       />
//                     </td>
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{farmer.personalInfo.name}</div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.mobileNo}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <span className={`${farmer.personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                         {farmer.personalInfo.email || 'No email'}
//                       </span>
//                     </td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.district || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">{farmer.personalInfo.state || 'N/A'}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
//                           className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Delete Farmer"
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
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {farmers.map((farmer, index) => (
//               <div key={farmer._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedFarmers.includes(farmer._id)}
//                       onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     />
//                     <div>
//                       <div className="font-bold text-gray-800">{farmer.personalInfo.name}</div>
//                       <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
//                     </div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} className="p-1.5 text-blue-600">
//                       <FaEye />
//                     </button>
//                     <button onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} className="p-1.5 text-red-600">
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <div className="text-sm text-gray-500">Mobile</div>
//                     <div className="text-sm">{farmer.personalInfo.mobileNo}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Email</div>
//                     <div className={`text-sm ${farmer.personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
//                       {farmer.personalInfo.email || 'No email'}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-[.6rem] text-sm">
//                     <div>
//                       <div className="text-sm text-gray-500">Village</div>
//                       <div className="text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">District</div>
//                       <div className="text-sm">{farmer.personalInfo.district || 'N/A'}</div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">State</div>
//                     <div className="text-sm">{farmer.personalInfo.state || 'N/A'}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && farmers.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
//           <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
//           <p className="text-gray-500">Try adjusting your search or filters</p>
//           <button
//             onClick={handleResetFilters}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}

//       {/* Pagination with MUI Component */}
//       {!loading && farmers.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
//             <span className="font-semibold">{totalFarmers}</span> farmers
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

//       {/* VIEW DETAILS MODAL */}
//       {viewOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-xl text-gray-800">Farmer Details</h2>
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
//               <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
//               <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
//               <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
//               <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
//               <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
//               <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
//               <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
//               <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
//               <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name}</span>? 
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setDeleteOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                 >
//                   Delete Farmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BULK DELETE CONFIRMATION MODAL */}
//       {bulkDeleteOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete {selectedFarmers.length} Farmers?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete {selectedFarmers.length} selected farmer{selectedFarmers.length !== 1 ? 's' : ''}? 
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setBulkDeleteOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleBulkDelete}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                 >
//                   Delete {selectedFarmers.length} Farmers
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  FaCheck,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";

/* ================= TYPES ================= */

interface Farmer {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
    taluk?: string;
    post?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Farmer[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface District {
  _id: string;
  name: string;
}

/* ================= PAGE ================= */

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [disName, setDisName] = useState("");

  // Bulk selection state
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Track initial load
  const initialLoadRef = useRef(true);

  /* ================= FETCH FARMERS ================= */

  const fetchFarmers = async (page: number = 1, searchQuery: string = "", districtName: string = "") => {
    try {
      // Only show loading overlay if it's not the initial combined load
      if (!initialLoadRef.current) {
        setLoading(true);
      }
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
        district: districtName
      });

      const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
      if (res.data.success) {
        setFarmers(res.data.data);
        setTotalFarmers(res.data.total);
        setTotalPages(res.data.totalPages || Math.ceil(res.data.total / rowsPerPage));
        setCurrentPage(res.data.page);
        // Reset selection when data changes
        setSelectedFarmers([]);
        setSelectAll(false);
      }
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
      setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
      setFarmers([]);
      toast.error(err.response?.data?.message || "Failed to load farmers");
    } finally {
      if (!initialLoadRef.current) {
        setLoading(false);
      }
    }
  };

  const fetchDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    try {
      const response = await axios.get("/api/districts", {
        params: { 
          limit: 100,
          page: 1
        }
      });
      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  // Combined initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch districts and farmers in parallel
        const [districtsRes, farmersRes] = await Promise.allSettled([
          axios.get("/api/districts", {
            params: { limit: 100, page: 1 }
          }),
          axios.get<ApiResponse>(`/api/farmers?${new URLSearchParams({
            page: "1",
            limit: rowsPerPage.toString(),
            search: "",
            district: ""
          })}`)
        ]);

        // Handle districts response
        if (districtsRes.status === 'fulfilled' && districtsRes.value.data.success) {
          setDistricts(districtsRes.value.data.data);
        } else {
          console.error("Error fetching districts:", districtsRes.status === 'rejected' ? districtsRes.reason : districtsRes.value?.data);
        }

        // Handle farmers response
        if (farmersRes.status === 'fulfilled' && farmersRes.value.data.success) {
          setFarmers(farmersRes.value.data.data);
          setTotalFarmers(farmersRes.value.data.total);
          setTotalPages(farmersRes.value.data.totalPages || Math.ceil(farmersRes.value.data.total / rowsPerPage));
          setCurrentPage(farmersRes.value.data.page);
        } else {
          const error = farmersRes.status === 'rejected' ? farmersRes.reason : farmersRes.value?.data;
          console.error('Error fetching farmers:', error);
          setError(error?.response?.data?.message || 'Failed to load farmers. Please try again.');
          setFarmers([]);
          toast.error(error?.response?.data?.message || "Failed to load farmers");
        }

      } catch (err: any) {
        console.error('Error in initial data fetch:', err);
        setError('Failed to load data. Please try again.');
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        initialLoadRef.current = false;
      }
    };

    fetchInitialData();
  }, [rowsPerPage]);

  // Handle subsequent farmer fetches (search, pagination, filter changes)
  useEffect(() => {
    if (!initialLoadRef.current) {
      fetchFarmers(currentPage, search, disName);
    }
  }, [currentPage, rowsPerPage, disName]);

  // Debounced search
  useEffect(() => {
    if (!initialLoadRef.current) {
      const timer = setTimeout(() => {
        fetchFarmers(1, search, disName);
        setCurrentPage(1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [search]);

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allFarmerIds = farmers.map(farmer => farmer._id);
      setSelectedFarmers(allFarmerIds);
      setSelectAll(true);
    } else {
      setSelectedFarmers([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFarmers([...selectedFarmers, id]);
    } else {
      setSelectedFarmers(selectedFarmers.filter(farmerId => farmerId !== id));
      setSelectAll(false);
    }
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = async () => {
    if (selectedFarmers.length === 0) {
      toast.error("No farmers selected");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/farmers/bulk-delete", {
        ids: selectedFarmers
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedFarmers([]);
        setSelectAll(false);
        setBulkDeleteOpen(false);
        fetchFarmers(currentPage, search, disName);
      } else {
        toast.error("Failed to delete farmers");
      }
    } catch (error: any) {
      console.error("Bulk delete error:", error);
      toast.error("Error deleting farmers");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async () => {
    if (!selectedFarmer) return;
   
    try {
      setLoading(true);
      await axios.delete(`/api/farmers/${selectedFarmer._id}`);
      toast.success("Farmer deleted successfully!");
      setDeleteOpen(false);
      fetchFarmers(currentPage, search, disName);
    } catch (error: any) {
      console.error("Error deleting farmer:", error);
      toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = farmers.map((farmer, index) => ({
    "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
    "Name": farmer.personalInfo.name,
    "Mobile": farmer.personalInfo.mobileNo,
    "Email": farmer.personalInfo.email || 'N/A',
    "Village": farmer.personalInfo.villageGramaPanchayat || 'N/A',
    "District": farmer.personalInfo.district || 'N/A',
    "State": farmer.personalInfo.state || 'N/A',
    "Address": farmer.personalInfo.address || 'N/A',
    "Taluk": farmer.personalInfo.taluk || 'N/A',
    "Post": farmer.personalInfo.post || 'N/A',
    "Pincode": farmer.personalInfo.pincode || 'N/A',
  }));

  const handlePrint = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to print");
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
        <title>Farmers Report</title>
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
          <h1>👨‍🌾 Farmers Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            ${farmers.map((farmer, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${farmer.personalInfo.name}</strong></td>
                <td>${farmer.personalInfo.mobileNo}</td>
                <td>${farmer.personalInfo.email || 'N/A'}</td>
                <td>${farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
                <td>${farmer.personalInfo.district || 'N/A'}</td>
                <td>${farmer.personalInfo.state || 'N/A'}</td>
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
    if (farmers.length === 0) {
      toast.error("No farmers to copy");
      return;
    }

    const text = exportData.map(f => 
      `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Village}\t${f.District}\t${f.State}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Farmers data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Farmers");
      XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Farmers Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State"];
      const tableRows: any = exportData.map(f => [
        f["Sr."],
        f.Name,
        f.Mobile,
        f.Email,
        f.Village,
        f.District,
        f.State,
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setDisName("");
    // Reset selection when filters are reset
    setSelectedFarmers([]);
    setSelectAll(false);
    fetchFarmers(1, "", "");
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay - Only show when loading is true */}
      {loading && (
        <div className="absolute inset-0 bg-[#e9e7e773] z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedFarmers.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedFarmers.length} farmer{selectedFarmers.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

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
                placeholder="Search by name, mobile, email, or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="md:col-span-3">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={disName}
              onChange={(e) => setDisName(e.target.value)}
              disabled={districtsLoading || loading}
            >
              {districtsLoading ? (
                <option>Loading districts...</option>
              ) : districts.length === 0 ? (
                <option value="">No districts available</option>
              ) : (
                <>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district._id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: farmers.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: farmers.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: farmers.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: farmers.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: farmers.length === 0 },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled || loading}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
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
      {!loading && farmers.length > 0 && (
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
                      disabled={loading}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Village</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farmers.map((farmer, index) => (
                  <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFarmers.includes(farmer._id)}
                        onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{farmer.personalInfo.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.mobileNo}</td>
                    <td className="p-[.6rem] text-sm">
                      <span className={`${farmer.personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {farmer.personalInfo.email || 'No email'}
                      </span>
                    </td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.district || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">{farmer.personalInfo.state || 'N/A'}</td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
                          disabled={loading}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
                          disabled={loading}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Farmer"
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
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {farmers.map((farmer, index) => (
              <div key={farmer._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFarmers.includes(farmer._id)}
                      onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
                      disabled={loading}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{farmer.personalInfo.name}</div>
                      <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button 
                      onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} 
                      disabled={loading}
                      className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} 
                      disabled={loading}
                      className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Mobile</div>
                    <div className="text-sm">{farmer.personalInfo.mobileNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className={`text-sm ${farmer.personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                      {farmer.personalInfo.email || 'No email'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-sm text-gray-500">Village</div>
                      <div className="text-sm">{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">District</div>
                      <div className="text-sm">{farmer.personalInfo.district || 'N/A'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="text-sm">{farmer.personalInfo.state || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && farmers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={handleResetFilters}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination with MUI Component */}
      {!loading && farmers.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
            <span className="font-semibold">{totalFarmers}</span> farmers
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              disabled={loading}
              className="p-1 ml-3 border border-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading}
            />
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl text-gray-800">Farmer Details</h2>
              <button
                onClick={() => setViewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
              <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
              <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
              <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
              <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
              <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
              <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
              <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
              <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
              <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewOpen(false)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {bulkDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete {selectedFarmers.length} Farmers?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedFarmers.length} selected farmer{selectedFarmers.length !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete {selectedFarmers.length} Farmers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
    <div className="w-32 font-medium text-gray-600">{label}:</div>
    <div className="flex-1 text-gray-900">{value}</div>
  </div>
);