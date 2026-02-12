





// 'use client';

// import { useEffect, useState, useRef, useCallback } from "react";
// import { 
//   FaPlus, 
//   FaEdit, 
//   FaTrash, 
//   FaSearch, 
//   FaRedo, 
//   FaCopy,
//   FaPrint,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaLocationArrow
// } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import { IoLocation } from "react-icons/io5";
// import Pagination from "@mui/material/Pagination";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import CircularProgress from "@mui/material/CircularProgress";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { CSVLink } from "react-csv";

// interface StateDetail {
//   _id: string;
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   createdAt: string;
//   updatedAt: string;
//   selected?: boolean;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// interface FormData {
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
// }

// export default function StatesDetailsPage() {
//   const [states, setStates] = useState<StateDetail[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Modal states
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     pinCode: "",
//     state: "",
//     district: "",
//     taluk: ""
//   });
//   const [pinCodeLoading, setPinCodeLoading] = useState(false);

//   // Bulk selection state
//   const [selectedStates, setSelectedStates] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Dialog states
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
//   const [deleteStateInfo, setDeleteStateInfo] = useState<{id: string | null, pinCode: string}>({id: null, pinCode: ""});

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error" | "warning" | "info"
//   });

//   // Pagination state
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   });

//   // Refs
//   const printRef = useRef<HTMLDivElement>(null);

//   /* ---------- API FUNCTIONS ---------- */
//   const fetchStates = useCallback(async (page = 1, searchQuery = "", limit?: number) => {
//     try {
//       setLoading(true);
//       const params = {
//         page: page,
//         limit: limit || pagination.limit,
//         ...(searchQuery && { search: searchQuery }),
//       };

//       const response = await axios.get("/api/states-details", { params });
//       const data = response.data;

//       if (data.success) {
//         setStates(data.data.map((state: any) => ({ ...state, selected: false })));
//         setPagination({
//           total: data.pagination?.total || data.total || 0,
//           page: data.pagination?.page || data.page || 1,
//           limit: data.pagination?.limit || data.limit || (limit || pagination.limit),
//           totalPages: data.pagination?.pages || Math.ceil((data.pagination?.total || data.total || 0) / (data.pagination?.limit || data.limit || (limit || pagination.limit))),
//         });
//         setSelectedStates([]);
//         setSelectAll(false);
//       }
//     } catch (error: any) {
//       console.error("Error fetching states details:", error);
//       showSnackbar(error.response?.data?.error || "Failed to fetch data", "error");
//     } finally {
//       setLoading(false);
//       setInitialLoading(false);
//     }
//   }, [pagination.limit]);

//   const createState = async () => {
//     try {
//       const response = await axios.post("/api/states-details", formData);
//       if (response.data.success) {
//         showSnackbar("State details added successfully", "success");
//         fetchStates(pagination.page, search);
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       showSnackbar(error.response?.data?.error || "Failed to add state details", "error");
//       return false;
//     }
//   };

//   const updateState = async (id: string) => {
//     try {
//       const response = await axios.put(`/api/states-details?id=${id}`, formData);
//       if (response.data.success) {
//         showSnackbar("State details updated successfully", "success");
//         fetchStates(pagination.page, search);
//         return true;
//       }
//       return false;
//     } catch (error: any) {
//       showSnackbar(error.response?.data?.error || "Failed to update state details", "error");
//       return false;
//     }
//   };

//   const deleteState = async (id: string) => {
//     try {
//       await axios.delete(`/api/states-details?id=${id}`);
//       showSnackbar("State details deleted successfully", "success");
      
//       if (states.length === 1 && pagination.page > 1) {
//         fetchStates(pagination.page - 1, search);
//       } else {
//         fetchStates(pagination.page, search);
//       }
//       return true;
//     } catch (error: any) {
//       showSnackbar(error.response?.data?.error || "Failed to delete state details", "error");
//       return false;
//     }
//   };

//   const bulkDeleteStates = async (ids: string[]) => {
//     try {
//       await Promise.all(ids.map(id => axios.delete(`/api/states-details?id=${id}`)));
//       showSnackbar(`${ids.length} state(s) deleted successfully`, "success");
      
//       if (states.length === ids.length && pagination.page > 1) {
//         fetchStates(pagination.page - 1, search);
//       } else {
//         fetchStates(pagination.page, search);
//       }
//       return true;
//     } catch (error: any) {
//       showSnackbar("Failed to delete selected states", "error");
//       return false;
//     }
//   };

//   const fetchPinCodeDetails = async (pincode: string) => {
//     if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
//       showSnackbar("Please enter a valid 6-digit PIN code", "error");
//       return;
//     }

//     try {
//       setPinCodeLoading(true);
//       const response = await axios.get("/api/states-details", {
//         params: { pincode }
//       });

//       if (response.data.success && response.data.data) {
//         const { state, district, taluk } = response.data.data;
//         setFormData(prev => ({
//           ...prev,
//           state,
//           district,
//           taluk
//         }));
//         showSnackbar("Address details auto-filled successfully!", "success");
//       } else {
//         showSnackbar(response.data.error || "Invalid PIN code", "error");
//       }
//     } catch (error: any) {
//       showSnackbar(error.response?.data?.error || "Failed to fetch address details", "error");
//     } finally {
//       setPinCodeLoading(false);
//     }
//   };


//     useEffect(()=>{
      
//       let sateld=false

//       const getUniqueData=async()=>{
//         const res= await axios.get('/api/store-unique')
//         if(Number(res.data.summary.failed) > 0){
//           const interval=setInterval(async()=>{
//              const res= await axios.get('/api/store-unique')
//              if(Number(res.data.summary.failed) > 0){
//                sateld =false
//              }else{
//               sateld=true
//              }
//           },500)

//           if(sateld){
//             clearInterval(interval)
//           }
//         }else{
//           sateld=true
//         }
//       }
//       getUniqueData()
   
      
//     },[deleteDialogOpen,bulkDeleteDialogOpen,deleteState,initialLoading])

//   /* ---------- INITIAL FETCH ---------- */
//   useEffect(() => {
//     fetchStates();
//   }, [fetchStates]);

//   /* ---------- SELECT HANDLERS ---------- */
//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allStateIds = states.map(state => state._id);
//       setSelectedStates(allStateIds);
//       setSelectAll(true);
//     } else {
//       setSelectedStates([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedStates([...selectedStates, id]);
//     } else {
//       setSelectedStates(selectedStates.filter(stateId => stateId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ---------- CRUD HANDLERS ---------- */
//   const openAdd = () => {
//     setEditId(null);
//     setFormData({
//       pinCode: "",
//       state: "",
//       district: "",
//       taluk: ""
//     });
//     setShowModal(true);
//   };

//   const openEdit = (state: StateDetail) => {
//     setEditId(state._id);
//     setFormData({
//       pinCode: state.pinCode,
//       state: state.state,
//       district: state.district,
//       taluk: state.taluk
//     });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!formData.pinCode.trim() || !formData.state.trim() || !formData.district.trim() || !formData.taluk.trim()) {
//       showSnackbar("Please fill all fields", "error");
//       return;
//     }

//     if (formData.pinCode.length !== 6 || !/^\d+$/.test(formData.pinCode)) {
//       showSnackbar("Please enter a valid 6-digit PIN code", "error");
//       return;
//     }

//     setLoading(true);
//     let success;
//     if (editId) {
//       success = await updateState(editId);
//     } else {
//       success = await createState();
//     }

//     if (success) {
//       setShowModal(false);
//     }
//     setLoading(false);
//   };

//   const handleDeleteClick = (state: StateDetail) => {
//     setDeleteStateInfo({ id: state._id, pinCode: state.pinCode });
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!deleteStateInfo.id) return;
    
//     setLoading(true);
//     await deleteState(deleteStateInfo.id);
//     setDeleteDialogOpen(false);
//     setDeleteStateInfo({ id: null, pinCode: "" });
//     setLoading(false);
//   };

//   const handleBulkDeleteClick = () => {
//     if (selectedStates.length === 0) {
//       showSnackbar("No states selected", "error");
//       return;
//     }
//     setBulkDeleteDialogOpen(true);
//   };

//   const handleBulkDeleteConfirm = async () => {
//     setLoading(true);
//     await bulkDeleteStates(selectedStates);
//     setBulkDeleteDialogOpen(false);
//     setLoading(false);
//   };

//   /* ---------- EXPORT FUNCTIONS ---------- */
//   const handleCopy = async () => {
//     // Calculate column widths based on content
//     const maxNumberLength = states.length.toString().length + 1;
//     const maxPinLength = Math.max(...states.map(state => state.pinCode.length), 8);
//     const maxStateLength = Math.max(...states.map(state => state.state.length), 12);
//     const maxDistrictLength = Math.max(...states.map(state => state.district.length), 15);
//     const maxTalukLength = Math.max(...states.map(state => state.taluk.length), 10);
    
//     // Create table header
//     const headerNumber = "No.".padEnd(maxNumberLength);
//     const headerPin = "PIN Code".padEnd(maxPinLength);
//     const headerState = "State".padEnd(maxStateLength);
//     const headerDistrict = "District".padEnd(maxDistrictLength);
//     const headerTaluk = "Taluk".padEnd(maxTalukLength);
//     const tableHeader = `${headerNumber}\t${headerPin}\t${headerState}\t${headerDistrict}\t${headerTaluk}`;
    
//     // Create separator
//     const separator = "-".repeat(maxNumberLength) + "\t" + 
//                      "-".repeat(maxPinLength) + "\t" + 
//                      "-".repeat(maxStateLength) + "\t" + 
//                      "-".repeat(maxDistrictLength) + "\t" + 
//                      "-".repeat(maxTalukLength);
    
//     // Create table rows
//     const tableRows = states.map((state, index) => {
//       const number = (index + 1).toString().padEnd(maxNumberLength);
//       const pin = state.pinCode.padEnd(maxPinLength);
//       const stateName = state.state.padEnd(maxStateLength);
//       const district = state.district.padEnd(maxDistrictLength);
//       const taluk = state.taluk.padEnd(maxTalukLength);
//       return `${number}\t${pin}\t${stateName}\t${district}\t${taluk}`;
//     }).join("\n");
    
//     const text = `${tableHeader}\n${separator}\n${tableRows}`;
    
//     try {
//       await navigator.clipboard.writeText(text);
//       showSnackbar("States table copied to clipboard!", "success");
//     } catch (err) {
//       showSnackbar("Failed to copy to clipboard", "error");
//     }
//   };

//   const handleExportExcel = () => {
//     if (states.length === 0) {
//       showSnackbar("No data to export", "error");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(states.map((state, index) => ({
//         "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
//         "PIN Code": state.pinCode,
//         "State": state.state,
//         "District": state.district,
//         "Taluk": state.taluk,
//         "Created At": state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A',
//         "Updated At": state.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'
//       })));
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "States Details");
//       XLSX.writeFile(wb, `states-details-${new Date().toISOString().split('T')[0]}.xlsx`);
//       showSnackbar("Excel file exported successfully!", "success");
//     } catch (err) {
//       showSnackbar("Failed to export Excel file", "error");
//     }
//   };

//   const handleExportCSV = () => {
//     if (states.length === 0) {
//       showSnackbar("No data to export", "error");
//       return;
//     }
//     showSnackbar("CSV export started", "success");
//   };

//   const csvData = states.map((state, index) => ({
//     "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
//     "PIN Code": state.pinCode,
//     "State": state.state,
//     "District": state.district,
//     "Taluk": state.taluk,
//     "Created At": state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'
//   }));

//   const handleExportPDF = () => {
//     if (states.length === 0) {
//       showSnackbar("No data to export", "error");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("States Details Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "PIN Code", "State", "District", "Taluk", "Created At"];
//       const tableRows: any = states.map((state, index) => [
//         index + 1 + (pagination.page - 1) * pagination.limit,
//         state.pinCode,
//         state.state,
//         state.district,
//         state.taluk,
//         state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`states-details-${new Date().toISOString().split('T')[0]}.pdf`);
//       showSnackbar("PDF file exported successfully!", "success");
//     } catch (err) {
//       showSnackbar("Failed to export PDF file", "error");
//     }
//   };

//   const handlePrint = () => {
//     if (states.length === 0) {
//       showSnackbar("No data to print", "error");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       showSnackbar("Please allow popups to print", "error");
//       return;
//     }

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>States Details Report</title>
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
//           <h1>📋 States Details Management Report</h1>
//           <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
//           <div class="header-info">Total Records: ${pagination.total} | Showing: ${states.length} records</div>
//           <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>PIN Code</th>
//               <th>State</th>
//               <th>District</th>
//               <th>Taluk</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${states.map((state, index) => `
//               <tr>
//                 <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
//                 <td><strong>${state.pinCode}</strong></td>
//                 <td>${state.state}</td>
//                 <td>${state.district}</td>
//                 <td>${state.taluk}</td>
//                 <td>${state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</td>
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
//     fetchStates(page, search);
//   };

//   const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLimit = Number(e.target.value);
//     setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
//     fetchStates(1, search, newLimit);
//   };

//   /* ---------- SEARCH ---------- */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchStates(1, search);
//       setPagination(prev => ({ ...prev, page: 1 }));
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, fetchStates]);

//   const handleResetFilters = () => {
//     setSearch("");
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchStates(1, "");
//   };

//   /* ---------- PIN CODE AUTO-FILL ---------- */
//   const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, pinCode: value }));
    
//     if (value.length === 6 && /^\d+$/.test(value)) {
//       fetchPinCodeDetails(value);
//     }
//   };

//   const handleManualFetch = () => {
//     if (formData.pinCode.length === 6 && /^\d+$/.test(formData.pinCode)) {
//       fetchPinCodeDetails(formData.pinCode);
//     } else {
//       showSnackbar("Please enter a valid 6-digit PIN code", "error");
//     }
//   };

//   /* ---------- SNACKBAR ---------- */
//   const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   /* ---------- STATS ---------- */
//   const uniqueStates = new Set(states.map(d => d.state)).size;
//   const uniqueDistricts = new Set(states.map(d => d.district)).size;
//   const uniqueTalukas = new Set(states.map(d => d.taluk)).size;

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {/* Initial Loading Overlay */}
//       {initialLoading && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">States Details Management</h1>
//           <p className="text-gray-600 mt-2">
//             Manage PIN codes with state, district, and taluk information. {pagination.total} records found.
//           </p>
//         </div>
//       </div>

//       {/* Bulk Actions Bar */}
//       {/* {selectedStates.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
//                 {selectedStates.length}
//               </div>
//               <span className="font-medium text-red-700">
//                 {selectedStates.length} record{selectedStates.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <button
//               onClick={handleBulkDeleteClick}
//               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//             >
//               <FaTrash className="w-4 h-4" />
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )} */}

//       {/* Mobile Export Buttons */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2">
//         {[
//           { icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", title: "Copy" },
//           { icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", title: "Excel" },
//           { icon: FaFileCsv, onClick: () => {}, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", title: "CSV" },
//           { icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800", title: "PDF" },
//           { icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", title: "Print" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             title={btn.title}
//             className={`flex items-center justify-center gap-[.6rem] text-sm p-3 rounded transition-all duration-200 ${btn.color} font-medium`}
//           >
//             <btn.icon size={16} />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-4">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <input
//                 type="text"
//                 placeholder="Search PIN code, state, district, or taluk..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
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
//             <CSVLink 
//               data={csvData} 
//               filename={`states-details-${new Date().toISOString().split('T')[0]}.csv`}
//               onClick={() => showSnackbar("CSV export started", "success")}
//             >
//               <button
//                 title="Export to CSV"
//                 className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium shadow-sm hover:shadow-md"
//               >
//                 <FaFileCsv size={16} />
//               </button>
//             </CSVLink>
            
//             {[
//               { icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", title: "Copy" },
//               { icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", title: "Excel" },
//               { icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800", title: "PDF" },
//               { icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", title: "Print" },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 title={btn.title}
//                 className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//               >
//                 <btn.icon size={16} />
//               </button>
//             ))}
//           </div>

//           {/* Add New Button */}
//           <div className="md:col-span-2">
//             <button
//               onClick={openAdd}
//               className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <FaPlus size={14} /> Add Record
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
//         <div className="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
//           <div className="text-2xl font-bold text-blue-600">{pagination.total}</div>
//           <div className="text-gray-600 text-sm">Total Records</div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border-l-4 border-green-500">
//           <div className="text-2xl font-bold text-green-600">{uniqueStates}</div>
//           <div className="text-gray-600 text-sm">Unique States</div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
//           <div className="text-2xl font-bold text-purple-600">{uniqueDistricts}</div>
//           <div className="text-gray-600 text-sm">Unique Districts</div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
//           <div className="text-2xl font-bold text-orange-600">{uniqueTalukas}</div>
//           <div className="text-gray-600 text-sm">Unique Talukas</div>
//         </div>
//       </div>

//       {/* Desktop Table */}
//       {!initialLoading && states.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow" ref={printRef}>
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   {/* <th className="p-[.6rem] text-sm text-left font-semibold w-10">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="rounded border-gray-300"
//                     />
//                   </th> */}
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">PIN Code</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Taluk</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {states.map((state, index) => (
//                   <tr key={state._id} className="hover:bg-gray-50 transition-colors">
//                     {/* <td className="p-[.6rem] text-sm">
//                       <input
//                         type="checkbox"
//                         checked={selectedStates.includes(state._id)}
//                         onChange={(e) => handleSelectOne(state._id, e.target.checked)}
//                         className="rounded border-gray-300"
//                       />
//                     </td> */}
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (pagination.page - 1) * pagination.limit}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
//                         {state.pinCode}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{state.state}</div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">{state.district}</td>
//                     <td className="p-[.6rem] text-sm">{state.taluk}</td>
//                     <td className="p-[.6rem] text-sm text-gray-600">
//                       {state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => openEdit(state)}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="Edit Record"
//                         >
//                           <FaEdit size={14} />
//                         </button>
//                         {/* <button
//                           onClick={() => handleDeleteClick(state)}
//                           className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                           title="Delete Record"
//                         >
//                           <FaTrash size={14} />
//                         </button> */}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {states.map((state, index) => (
//               <div key={state._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2">
//                     {/* <input
//                       type="checkbox"
//                       checked={selectedStates.includes(state._id)}
//                       onChange={(e) => handleSelectOne(state._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     /> */}
//                     <div>
//                       <div className="font-bold text-gray-800">{state.state}</div>
//                       <div className="text-xs text-gray-500">PIN: {state.pinCode}</div>
//                     </div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => openEdit(state)} className="p-1.5 text-blue-600">
//                       <FaEdit size={14} />
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteClick(state)}
//                       className="p-1.5 text-red-600"
//                     >
//                       <FaTrash size={14} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-xs">
//                   <div className="grid grid-cols-2 gap-[.6rem] text-sm">
//                     <div>
//                       <div className="text-xs text-gray-500">District</div>
//                       <div className="font-medium">{state.district}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Taluk</div>
//                       <div className="font-medium">{state.taluk}</div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Created At</div>
//                     <div className="text-xs">{state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!initialLoading && states.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <IoLocation className="text-gray-400 text-6xl mx-auto mb-4" />
//           <h3 className="text-xl font-semibold mb-2">No records found</h3>
//           <p className="text-gray-500 mb-4">Try adjusting your search or add a new record</p>
//           <button
//             onClick={openAdd}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//           >
//             <FaPlus className="inline mr-2" /> Add First Record
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {!initialLoading && states.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
//             <span className="font-semibold">{pagination.total}</span> records
//             <select
//               value={pagination.limit}
//               onChange={handleLimitChange}
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
//               size="small"
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
//                 {editId ? "Edit Record" : "Add New Record"}
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 <MdClose size={24} />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {/* PIN Code Field */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label className="block text-sm font-medium text-gray-700">
//                     PIN Code *
//                   </label>
//                   <button
//                     type="button"
//                     onClick={handleManualFetch}
//                     disabled={pinCodeLoading || formData.pinCode.length !== 6}
//                     className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//                   >
//                     <FaLocationArrow size={12} />
//                     {pinCodeLoading ? "Fetching..." : "Fetch Address"}
//                   </button>
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={formData.pinCode}
//                     onChange={handlePinCodeChange}
//                     maxLength={6}
//                     disabled={!!editId}
//                     className="w-full border border-gray-300 rounded px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
//                     placeholder="Enter 6-digit PIN code"
//                     autoFocus
//                   />
//                   <IoLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>
//               </div>

//               {/* State Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   State *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.state}
//                   onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="State"
//                 />
//               </div>

//               {/* District Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   District *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.district}
//                   onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="District"
//                 />
//               </div>

//               {/* Taluk Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Taluk *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.taluk}
//                   onChange={(e) => setFormData(prev => ({ ...prev, taluk: e.target.value }))}
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Taluk"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : editId ? "Update" : "Add Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SINGLE DELETE DIALOG */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title" className="font-semibold">
//           Delete Record?
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the record with PIN code "{deleteStateInfo.pinCode}"? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* BULK DELETE DIALOG */}
//       <Dialog
//         open={bulkDeleteDialogOpen}
//         onClose={() => setBulkDeleteDialogOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title" className="font-semibold">
//           Delete Selected Records?
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete {selectedStates.length} selected record(s)? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBulkDeleteDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleBulkDeleteConfirm} color="error" variant="contained" autoFocus>
//             Delete ({selectedStates.length})
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* SNACKBAR */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }















//updated by sagar




'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaRedo, 
  FaCopy,
  FaPrint,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaLocationArrow
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";

interface StateDetail {
  _id: string;
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  createdAt: string;
  updatedAt: string;
  selected?: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FormData {
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
}

export default function StatesDetailsPage() {
  const [states, setStates] = useState<StateDetail[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    pinCode: "",
    state: "",
    district: "",
    taluk: ""
  });
  const [pinCodeLoading, setPinCodeLoading] = useState(false);

  // Bulk selection state
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deleteStateInfo, setDeleteStateInfo] = useState<{id: string | null, pinCode: string}>({id: null, pinCode: ""});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Refs
  const printRef = useRef<HTMLDivElement>(null);

  /* ---------- API FUNCTIONS ---------- */
  const fetchStates = useCallback(async (page = 1, searchQuery = "", limit?: number) => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit || pagination.limit,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await axios.get("/api/states-details", { params });
      const data = response.data;

      if (data.success) {
        setStates(data.data.map((state: any) => ({ ...state, selected: false })));
        setPagination({
          total: data.pagination?.total || data.total || 0,
          page: data.pagination?.page || data.page || 1,
          limit: data.pagination?.limit || data.limit || (limit || pagination.limit),
          totalPages: data.pagination?.pages || Math.ceil((data.pagination?.total || data.total || 0) / (data.pagination?.limit || data.limit || (limit || pagination.limit))),
        });
        setSelectedStates([]);
        setSelectAll(false);
      }
    } catch (error: any) {
      console.error("Error fetching states details:", error);
      showSnackbar(error.response?.data?.error || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [pagination.limit]);

  const createState = async () => {
    try {
      const response = await axios.post("/api/states-details", formData);
      if (response.data.success) {
        showSnackbar("State details added successfully", "success");
        fetchStates(pagination.page, search);
        return true;
      }
      return false;
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "Failed to add state details", "error");
      return false;
    }
  };

  const updateState = async (id: string) => {
    try {
      const response = await axios.put(`/api/states-details?id=${id}`, formData);
      if (response.data.success) {
        showSnackbar("State details updated successfully", "success");
        fetchStates(pagination.page, search);
        return true;
      }
      return false;
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "Failed to update state details", "error");
      return false;
    }
  };

  const deleteState = async (id: string) => {
    try {
      await axios.delete(`/api/states-details?id=${id}`);
      showSnackbar("State details deleted successfully", "success");
      
      if (states.length === 1 && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return true;
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "Failed to delete state details", "error");
      return false;
    }
  };

  const bulkDeleteStates = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => axios.delete(`/api/states-details?id=${id}`)));
      showSnackbar(`${ids.length} state(s) deleted successfully`, "success");
      
      if (states.length === ids.length && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return true;
    } catch (error: any) {
      showSnackbar("Failed to delete selected states", "error");
      return false;
    }
  };

  // const fetchPinCodeDetails = async (pincode: string) => {
  //   if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
  //     showSnackbar("Please enter a valid 6-digit PIN code", "error");
  //     return;
  //   }

  //   try {
  //     setPinCodeLoading(true);
  //     const response = await axios.get("/api/states-details", {
  //       params: { pincode }
  //     });

  //     if (response.data.success && response.data.data) {
  //       const { state, district, taluk } = response.data.data;
  //       setFormData(prev => ({
  //         ...prev,
  //         state,
  //         district,
  //         taluk
  //       }));
  //       showSnackbar("Address details auto-filled successfully!", "success");
  //     } else {
  //       showSnackbar(response.data.error || "Invalid PIN code", "error");
  //     }
  //   } catch (error: any) {
  //     showSnackbar(error.response?.data?.error || "Failed to fetch address details", "error");
  //   } finally {
  //     setPinCodeLoading(false);
  //   }
  // };


    useEffect(()=>{
      
      let sateld=false

      const getUniqueData=async()=>{
        const res= await axios.get('/api/store-unique')
        if(Number(res.data.summary.failed) > 0){
          const interval=setInterval(async()=>{
             const res= await axios.get('/api/store-unique')
             if(Number(res.data.summary.failed) > 0){
               sateld =false
             }else{
              sateld=true
             }
          },500)

          if(sateld){
            clearInterval(interval)
          }
        }else{
          sateld=true
        }
      }
      getUniqueData()
   
      
    },[deleteDialogOpen,bulkDeleteDialogOpen,deleteState,initialLoading])

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  /* ---------- SELECT HANDLERS ---------- */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allStateIds = states.map(state => state._id);
      setSelectedStates(allStateIds);
      setSelectAll(true);
    } else {
      setSelectedStates([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStates([...selectedStates, id]);
    } else {
      setSelectedStates(selectedStates.filter(stateId => stateId !== id));
      setSelectAll(false);
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setFormData({
      pinCode: "",
      state: "",
      district: "",
      taluk: ""
    });
    setShowModal(true);
  };

  const openEdit = (state: StateDetail) => {
    setEditId(state._id);
    setFormData({
      pinCode: state.pinCode,
      state: state.state,
      district: state.district,
      taluk: state.taluk
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.state.trim() || !formData.district.trim() || !formData.taluk.trim()) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    // if (formData.pinCode.length !== 6 || !/^\d+$/.test(formData.pinCode)) {
    //   showSnackbar("Please enter a valid 6-digit PIN code", "error");
    //   return;
    // }

    setLoading(true);
    let success;
    if (editId) {
      success = await updateState(editId);
    } else {
      success = await createState();
    }

    if (success) {
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleDeleteClick = (state: StateDetail) => {
    setDeleteStateInfo({ id: state._id, pinCode: state.pinCode });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStateInfo.id) return;
    
    setLoading(true);
    await deleteState(deleteStateInfo.id);
    setDeleteDialogOpen(false);
    setDeleteStateInfo({ id: null, pinCode: "" });
    setLoading(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedStates.length === 0) {
      showSnackbar("No states selected", "error");
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setLoading(true);
    await bulkDeleteStates(selectedStates);
    setBulkDeleteDialogOpen(false);
    setLoading(false);
  };

  /* ---------- EXPORT FUNCTIONS ---------- */
  const handleCopy = async () => {
    // Calculate column widths based on content
    const maxNumberLength = states.length.toString().length + 1;
    const maxPinLength = Math.max(...states.map(state => state.pinCode.length), 8);
    const maxStateLength = Math.max(...states.map(state => state.state.length), 12);
    const maxDistrictLength = Math.max(...states.map(state => state.district.length), 15);
    const maxTalukLength = Math.max(...states.map(state => state.taluk.length), 10);
    
    // Create table header
    const headerNumber = "No.".padEnd(maxNumberLength);
    const headerPin = "PIN Code".padEnd(maxPinLength);
    const headerState = "State".padEnd(maxStateLength);
    const headerDistrict = "District".padEnd(maxDistrictLength);
    const headerTaluk = "Taluk".padEnd(maxTalukLength);
    const tableHeader = `${headerNumber}\t${headerPin}\t${headerState}\t${headerDistrict}\t${headerTaluk}`;
    
    // Create separator
    const separator = "-".repeat(maxNumberLength) + "\t" + 
                     "-".repeat(maxPinLength) + "\t" + 
                     "-".repeat(maxStateLength) + "\t" + 
                     "-".repeat(maxDistrictLength) + "\t" + 
                     "-".repeat(maxTalukLength);
    
    // Create table rows
    const tableRows = states.map((state, index) => {
      const number = (index + 1).toString().padEnd(maxNumberLength);
      const pin = state.pinCode.padEnd(maxPinLength);
      const stateName = state.state.padEnd(maxStateLength);
      const district = state.district.padEnd(maxDistrictLength);
      const taluk = state.taluk.padEnd(maxTalukLength);
      return `${number}\t${pin}\t${stateName}\t${district}\t${taluk}`;
    }).join("\n");
    
    const text = `${tableHeader}\n${separator}\n${tableRows}`;
    
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar("States table copied to clipboard!", "success");
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  const handleExportExcel = () => {
    if (states.length === 0) {
      showSnackbar("No data to export", "error");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(states.map((state, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "PIN Code": state.pinCode,
        "State": state.state,
        "District": state.district,
        "Taluk": state.taluk,
        "Created At": state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A',
        "Updated At": state.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "States Details");
      XLSX.writeFile(wb, `states-details-${new Date().toISOString().split('T')[0]}.xlsx`);
      showSnackbar("Excel file exported successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to export Excel file", "error");
    }
  };

  const handleExportCSV = () => {
    if (states.length === 0) {
      showSnackbar("No data to export", "error");
      return;
    }
    showSnackbar("CSV export started", "success");
  };

  const csvData = states.map((state, index) => ({
    "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
    "PIN Code": state.pinCode,
    "State": state.state,
    "District": state.district,
    "Taluk": state.taluk,
    "Created At": state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'
  }));

  const handleExportPDF = () => {
    if (states.length === 0) {
      showSnackbar("No data to export", "error");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("States Details Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "PIN Code", "State", "District", "Taluk", "Created At"];
      const tableRows: any = states.map((state, index) => [
        index + 1 + (pagination.page - 1) * pagination.limit,
        state.pinCode,
        state.state,
        state.district,
        state.taluk,
        state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`states-details-${new Date().toISOString().split('T')[0]}.pdf`);
      showSnackbar("PDF file exported successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to export PDF file", "error");
    }
  };

  const handlePrint = () => {
    if (states.length === 0) {
      showSnackbar("No data to print", "error");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      showSnackbar("Please allow popups to print", "error");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>States Details Report</title>
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
          <h1>📋 States Details Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Records: ${pagination.total} | Showing: ${states.length} records</div>
          <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>PIN Code</th>
              <th>State</th>
              <th>District</th>
              <th>Taluk</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${states.map((state, index) => `
              <tr>
                <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
                <td><strong>${state.pinCode}</strong></td>
                <td>${state.state}</td>
                <td>${state.district}</td>
                <td>${state.taluk}</td>
                <td>${state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</td>
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
    fetchStates(page, search);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchStates(1, search, newLimit);
  };

  /* ---------- SEARCH ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStates(1, search);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchStates]);

  const handleResetFilters = () => {
    setSearch("");
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStates(1, "");
  };

  /* ---------- PIN CODE AUTO-FILL ---------- */
  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, pinCode: value }));
    
    // if (value.length === 6 && /^\d+$/.test(value)) {
    //   fetchPinCodeDetails(value);
    // }
  };

  const handleManualFetch = () => {
    if (formData.pinCode.length === 6 && /^\d+$/.test(formData.pinCode)) {
      // fetchPinCodeDetails(formData.pinCode);
    } else {
      showSnackbar("Please enter a valid 6-digit PIN code", "error");
    }
  };

  /* ---------- SNACKBAR ---------- */
  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /* ---------- STATS ---------- */
  const uniqueStates = new Set(states.map(d => d.state)).size;
  const uniqueDistricts = new Set(states.map(d => d.district)).size;
  const uniqueTalukas = new Set(states.map(d => d.taluk)).size;

  /* ---------- UI ---------- */
  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Initial Loading Overlay */}
      {initialLoading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">States Details Management</h1>
          <p className="text-gray-600 mt-2">
            Manage PIN codes with state, district, and taluk information. {pagination.total} records found.
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {/* {selectedStates.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                {selectedStates.length}
              </div>
              <span className="font-medium text-red-700">
                {selectedStates.length} record{selectedStates.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )} */}

      {/* Mobile Export Buttons */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2">
        {[
          { icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", title: "Copy" },
          { icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", title: "Excel" },
          { icon: FaFileCsv, onClick: () => {}, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", title: "CSV" },
          { icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800", title: "PDF" },
          { icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", title: "Print" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            title={btn.title}
            className={`flex items-center justify-center gap-[.6rem] text-sm p-3 rounded transition-all duration-200 ${btn.color} font-medium`}
          >
            <btn.icon size={16} />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search PIN code, state, district, or taluk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
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
            <CSVLink 
              data={csvData} 
              filename={`states-details-${new Date().toISOString().split('T')[0]}.csv`}
              onClick={() => showSnackbar("CSV export started", "success")}
            >
              <button
                title="Export to CSV"
                className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium shadow-sm hover:shadow-md"
              >
                <FaFileCsv size={16} />
              </button>
            </CSVLink>
            
            {[
              { icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", title: "Copy" },
              { icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", title: "Excel" },
              { icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800", title: "PDF" },
              { icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", title: "Print" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                title={btn.title}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon size={16} />
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <div className="md:col-span-2">
            <button
              onClick={openAdd}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaPlus size={14} /> Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{pagination.total}</div>
          <div className="text-gray-600 text-sm">Total Records</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{uniqueStates}</div>
          <div className="text-gray-600 text-sm">Unique States</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{uniqueDistricts}</div>
          <div className="text-gray-600 text-sm">Unique Districts</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{uniqueTalukas}</div>
          <div className="text-gray-600 text-sm">Unique Talukas</div>
        </div>
      </div>

      {/* Desktop Table */}
      {!initialLoading && states.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow" ref={printRef}>
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  {/* <th className="p-[.6rem] text-sm text-left font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th> */}
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  {/* <th className="p-[.6rem] text-sm text-left font-semibold">PIN Code</th> */}
                  <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Taluk</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {states.map((state, index) => (
                  <tr key={state._id} className="hover:bg-gray-50 transition-colors">
                    {/* <td className="p-[.6rem] text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state._id)}
                        onChange={(e) => handleSelectOne(state._id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td> */}
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    {/* <td className="p-[.6rem] text-sm">
                      <div className="font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {state.pinCode}
                      </div>
                    </td> */}
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{state.state}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">{state.district}</td>
                    <td className="p-[.6rem] text-sm">{state.taluk}</td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => openEdit(state)}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Record"
                        >
                          <FaEdit size={14} />
                        </button>
                        {/* <button
                          onClick={() => handleDeleteClick(state)}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Record"
                        >
                          <FaTrash size={14} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {states.map((state, index) => (
              <div key={state._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {/* <input
                      type="checkbox"
                      checked={selectedStates.includes(state._id)}
                      onChange={(e) => handleSelectOne(state._id, e.target.checked)}
                      className="rounded border-gray-300"
                    /> */}
                    <div>
                      <div className="font-bold text-gray-800">{state.state}</div>
                      <div className="text-xs text-gray-500">PIN: {state.pinCode}</div>
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => openEdit(state)} className="p-1.5 text-blue-600">
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(state)}
                      className="p-1.5 text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-xs text-gray-500">District</div>
                      <div className="font-medium">{state.district}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Taluk</div>
                      <div className="font-medium">{state.taluk}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-xs">{state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!initialLoading && states.length === 0 && !loading && (
        <div className="text-center py-12">
          <IoLocation className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No records found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or add a new record</p>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <FaPlus className="inline mr-2" /> Add First Record
          </button>
        </div>
      )}

      {/* Pagination */}
      {!initialLoading && states.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
            <span className="font-semibold">{pagination.total}</span> records
            <select
              value={pagination.limit}
              onChange={handleLimitChange}
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
              size="small"
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
                {editId ? "Edit Record" : "Add New Record"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* PIN Code Field */}
              {/* <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    PIN Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleManualFetch}
                    disabled={pinCodeLoading || formData.pinCode.length !== 6}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                  >
                    <FaLocationArrow size={12} />
                    {pinCodeLoading ? "Fetching..." : "Fetch Address"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={handlePinCodeChange}
                    maxLength={6}
                    disabled={!!editId}
                    className="w-full border border-gray-300 rounded px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    placeholder="Enter 6-digit PIN code"
                    autoFocus
                  />
                  <IoLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div> */}

              {/* State Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="State"
                />
              </div>

              {/* District Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="District"
                />
              </div>

              {/* Taluk Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taluk *
                </label>
                <input
                  type="text"
                  value={formData.taluk}
                  onChange={(e) => setFormData(prev => ({ ...prev, taluk: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Taluk"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : editId ? "Update" : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE DELETE DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-semibold">
          Delete Record?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the record with PIN code "{deleteStateInfo.pinCode}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* BULK DELETE DIALOG */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-semibold">
          Delete Selected Records?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {selectedStates.length} selected record(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBulkDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete ({selectedStates.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}