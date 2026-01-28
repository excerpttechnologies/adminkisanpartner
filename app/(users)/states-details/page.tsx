// 'use client';

// import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
// import {
//   Button,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   LinearProgress,
//   Chip,
//   Pagination,
//   Box,
//   Tooltip,
//   Paper,
//   TablePagination
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   Clear as ClearIcon,
//   Print as PrintIcon,
//   FileCopy as CopyIcon,
//   PictureAsPdf as PdfIcon,
//   GridOn as ExcelIcon,
//   TableChart as CsvIcon,
//   LocationOn as LocationIcon,
//   CheckCircle as CheckCircleIcon,
//   Download as DownloadIcon,
//   ContentCopy as ContentCopyIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useReactToPrint } from 'react-to-print';
// import { CSVLink } from 'react-csv';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// interface StateDetail {
//   _id: string;
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface FormData {
//   _id?: string;
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
// }

// interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// const API_BASE_URL = '/api/states-details';

// export default function StatesDetailsPage() {
//   const [data, setData] = useState<StateDetail[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     pinCode: '',
//     state: '',
//     district: '',
//     taluk: ''
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success' as 'success' | 'error' | 'warning' | 'info'
//   });
//   const [pinCodeLookupLoading, setPinCodeLookupLoading] = useState(false);
//   const [pinCodeLookupError, setPinCodeLookupError] = useState('');
//   const [pinCodeValid, setPinCodeValid] = useState(false);
//   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

//   const printRef = useRef<HTMLDivElement>(null);

//   // Fetch data from API
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get<ApiResponse<StateDetail[]>>(API_BASE_URL, {
//         params: {
//           page: page + 1,
//           limit: rowsPerPage,
//           search: searchTerm
//         }
//       });

//       if (response.data.success) {
//         setData(response.data.data || []);
//         setTotal(response.data.pagination?.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       showSnackbar('Failed to fetch data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchTerm]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Snackbar helper
//   const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Fetch PIN code details from API
//   const fetchPinCodeDetails = async (pincode: string) => {
//     if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
//       setPinCodeValid(false);
//       setPinCodeLookupError('');
//       return;
//     }

//     try {
//       setPinCodeLookupLoading(true);
//       setPinCodeLookupError('');
//       setPinCodeValid(false);

//       const response = await axios.get<ApiResponse>(API_BASE_URL, {
//         params: {
//           pincode: pincode
//         }
//       });

//       if (response.data.success && response.data.data) {
//         const { state, district, taluk } = response.data.data;
//         setFormData(prev => ({
//           ...prev,
//           state: state,
//           district: district,
//           taluk: taluk
//         }));
//         setPinCodeValid(true);
//         showSnackbar('Address details auto-filled successfully!', 'success');
//       } else {
//         setPinCodeLookupError(response.data.error || 'Invalid PIN code');
//         setPinCodeValid(false);
//       }
//     } catch (error: any) {
//       console.error('Error fetching PIN code details:', error);
//       setPinCodeLookupError(error.response?.data?.error || 'Failed to fetch address details');
//       setPinCodeValid(false);
//     } finally {
//       setPinCodeLookupLoading(false);
//     }
//   };

//   // Debounced PIN code lookup
//   const handlePinCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, pinCode: value }));
//     setPinCodeLookupError('');
//     setPinCodeValid(false);

//     // Clear existing timer
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     // Set new timer for debounce
//     if (value.length === 6 && /^\d+$/.test(value)) {
//       setPinCodeLookupLoading(true);
//       const timer = setTimeout(() => {
//         fetchPinCodeDetails(value);
//       }, 1000);
//       setDebounceTimer(timer);
//     } else {
//       setPinCodeLookupLoading(false);
//     }
//   };

//   // Clear form
//   const clearForm = () => {
//     setFormData({
//       pinCode: '',
//       state: '',
//       district: '',
//       taluk: ''
//     });
//     setPinCodeLookupError('');
//     setPinCodeValid(false);
//     setIsEditing(false);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     try {
//       // Validate PIN code
//       if (formData.pinCode.length !== 6 || !/^\d+$/.test(formData.pinCode)) {
//         showSnackbar('Please enter a valid 6-digit PIN code', 'error');
//         return;
//       }

//       if (!formData.state || !formData.district || !formData.taluk) {
//         showSnackbar('Please fill all address fields', 'error');
//         return;
//       }

//       if (isEditing && formData._id) {
//         // Update existing record
//         const response = await axios.put<ApiResponse>(
//           `${API_BASE_URL}?id=${formData._id}`,
//           formData
//         );

//         if (response.data.success) {
//           showSnackbar(response.data.message || 'Record updated successfully');
//           setOpenDialog(false);
//           clearForm();
//           fetchData();
//         }
//       } else {
//         // Create new record
//         const response = await axios.post<ApiResponse>(API_BASE_URL, formData);

//         if (response.data.success) {
//           showSnackbar(response.data.message || 'Record added successfully');
//           setOpenDialog(false);
//           clearForm();
//           fetchData();
//         }
//       }
//     } catch (error: any) {
//       console.error('Error saving data:', error);
//       showSnackbar(
//         error.response?.data?.error || 'Failed to save data',
//         'error'
//       );
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this record?')) {
//       return;
//     }

//     try {
//       const response = await axios.delete<ApiResponse>(`${API_BASE_URL}?id=${id}`);

//       if (response.data.success) {
//         showSnackbar(response.data.message || 'Deleted successfully');
//         fetchData();
//       }
//     } catch (error: any) {
//       console.error('Error deleting data:', error);
//       showSnackbar(
//         error.response?.data?.error || 'Failed to delete data',
//         'error'
//       );
//     }
//   };

//   // Handle edit
//   const handleEdit = (record: StateDetail) => {
//     setFormData({
//       _id: record._id,
//       pinCode: record.pinCode,
//       state: record.state,
//       district: record.district,
//       taluk: record.taluk
//     });
//     setIsEditing(true);
//     setOpenDialog(true);
//     setPinCodeValid(true);
//   };

//   // Export functions
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: 'States Details Report'
//   });

//   const handleCopy = () => {
//     const tableText = data.map(row =>
//       `${row.pinCode}\t${row.state}\t${row.district}\t${row.taluk}`
//     ).join('\n');

//     navigator.clipboard.writeText('PIN Code\tState\tDistrict\tTaluk\n' + tableText);
//     showSnackbar('Table copied to clipboard');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text('States Details Report', 20, 10);

//     (doc as any).autoTable({
//       head: [['PIN Code', 'State', 'District', 'Taluk', 'Created Date']],
//       body: data.map(row => [
//         row.pinCode,
//         row.state,
//         row.district,
//         row.taluk,
//         new Date(row.createdAt).toLocaleDateString()
//       ]),
//       startY: 20,
//       theme: 'grid',
//       headStyles: { fillColor: [41, 128, 185] },
//       styles: { fontSize: 10 }
//     });

//     doc.save('states-details.pdf');
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       data.map(({ _id, createdAt, updatedAt, ...rest }) => ({
//         ...rest,
//         'Created Date': new Date(createdAt).toLocaleDateString()
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'States Details');
//     XLSX.writeFile(workbook, 'states-details.xlsx');
//   };

//   // CSV data for export
//   const csvData = [
//     ['PIN Code', 'State', 'District', 'Taluk', 'Created Date'],
//     ...data.map(row => [
//       row.pinCode,
//       row.state,
//       row.district,
//       row.taluk,
//       new Date(row.createdAt).toLocaleDateString()
//     ])
//   ];

//   // Table pagination handlers
//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Close dialog
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     clearForm();
//   };

//   // Manual address fetch
//   const handleManualFetch = () => {
//     if (formData.pinCode.length === 6 && /^\d+$/.test(formData.pinCode)) {
//       fetchPinCodeDetails(formData.pinCode);
//     }
//   };

//   // Get unique counts for stats
//   const uniqueStates = new Set(data.map(d => d.state)).size;
//   const uniqueDistricts = new Set(data.map(d => d.district)).size;
//   const uniqueTalukas = new Set(data.map(d => d.taluk)).size;

//   return (
//     <div className="container mx-auto p-3">
//       {/* Header */}
//       <div className=" rounded mb-2 p-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <div className="flex items-center space-x-3 mb-4 md:mb-0">
//             <LocationIcon className="text-black text-3xl" />
//             {/* <h1 className="text-2xl font-bold text-white">PIN Code Management System</h1> */}
//           </div>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => {
//               setOpenDialog(true);
//               setIsEditing(false);
//             }}
//             className="bg-white text-purple-700 hover:bg-gray-100 shadow-md font-medium"
//           >
//             Add New Record
//           </Button>
//         </div>
//       </div>

//       {/* Search and Export Toolbar */}
//       <div className="bg-white rounded shadow-md border border-gray-200 p-4 mb-3">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           {/* Search Input */}
//           <div className="flex-1">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by PIN Code, State, District, or Taluk..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//               />
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <ClearIcon />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Export Buttons */}
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={handleCopy}
//               className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
//               title="Copy to Clipboard"
//             >
//               <ContentCopyIcon className="mr-2" />
//               Copy
//             </button>
            
//             <CSVLink data={csvData} filename="states-details.csv">
//               <button
//                 className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
//                 title="Export to CSV"
//               >
//                 <DownloadIcon className="mr-2" />
//                 CSV
//               </button>
//             </CSVLink>
            
//             <button
//               onClick={exportToExcel}
//               className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
//               title="Export to Excel"
//             >
//               <ExcelIcon className="mr-2" />
//               Excel
//             </button>
            
//             <button
//               onClick={exportToPDF}
//               className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
//               title="Export to PDF"
//             >
//               <PdfIcon className="mr-2" />
//               PDF
//             </button>
            
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
//               title="Print"
//             >
//               <PrintIcon className="mr-2" />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
//           <div className="text-2xl font-bold text-blue-600">{total}</div>
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

//       {/* Data Table */}
//       <div ref={printRef} className="bg-white rounded shadow-lg overflow-hidden border border-gray-200 mb-6">
//         {/* Table Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//           <div className="grid grid-cols-12 gap-4 text-white font-bold">
//             <div className="col-span-2">PIN Code</div>
//             <div className="col-span-3">State</div>
//             <div className="col-span-3">District</div>
//             <div className="col-span-2">Taluk</div>
//             <div className="col-span-2 text-center">Actions</div>
//           </div>
//         </div>

//         {/* Table Body */}
//         <div className="divide-y divide-gray-200">
//           {loading ? (
//             <div className="py-12 text-center">
//               <CircularProgress />
//               <div className="mt-4 text-gray-600 animate-pulse">Loading data...</div>
//             </div>
//           ) : data.length === 0 ? (
//             <div className="py-12 text-center">
//               <LocationIcon className="text-gray-400 text-5xl mx-auto mb-4" />
//               <div className="text-gray-500 text-lg mb-2">No data found</div>
//               <div className="text-gray-400">
//                 {searchTerm ? 'Try a different search term' : 'Click "Add New" to add your first record'}
//               </div>
//             </div>
//           ) : (
//             data.map((row) => (
//               <div
//                 key={row._id}
//                 className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors duration-200 items-center"
//               >
//                 <div className="col-span-2">
//                   <div className="font-mono font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-lg inline-block">
//                     {row.pinCode}
//                   </div>
//                 </div>
//                 <div className="col-span-3">
//                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                     {row.state}
//                   </span>
//                 </div>
//                 <div className="col-span-3 text-gray-700">{row.district}</div>
//                 <div className="col-span-2 text-gray-700">{row.taluk}</div>
//                 <div className="col-span-2">
//                   <div className="flex justify-center space-x-2">
//                     <button
//                       onClick={() => handleEdit(row)}
//                       className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
//                       title="Edit"
//                     >
//                       <EditIcon />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(row._id)}
//                       className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
//                       title="Delete"
//                     >
//                       <DeleteIcon />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination using MUI */}
//         <div className="border-t border-gray-200 px-6 py-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div className="mb-4 sm:mb-0">
//               <span className="text-gray-700">Total: {total} records</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-gray-700">Rows per page:</span>
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(parseInt(e.target.value, 10));
//                     setPage(0);
//                   }}
//                   className="border border-gray-300 rounded px-2 py-1"
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                 </select>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setPage(page - 1)}
//                   disabled={page === 0}
//                   className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
                
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, Math.ceil(total / rowsPerPage)) }, (_, i) => {
//                     const pageNum = i + 1;
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setPage(pageNum - 1)}
//                         className={`px-3 py-1 rounded ${page === pageNum - 1 ? 'bg-blue-600 text-white' : 'border'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => setPage(page + 1)}
//                   disabled={page >= Math.ceil(total / rowsPerPage) - 1}
//                   className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Dialog (MUI Dialog) */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           className: "rounded-2xl"
//         }}
//       >
//         <DialogTitle className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <LocationIcon />
//               <span className="text-lg font-semibold">
//                 {isEditing ? 'Edit Record' : 'Add New Record'}
//               </span>
//             </div>
//             {pinCodeValid && (
//               <span className="bg-white text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                 <CheckCircleIcon className="mr-1" fontSize="small" />
//                 PIN Verified
//               </span>
//             )}
//           </div>
//         </DialogTitle>

//         <DialogContent className="py-6 space-y-4">
//           {/* PIN Code Field */}
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label className="text-gray-700 font-medium">PIN Code *</label>
//               <button
//                 onClick={handleManualFetch}
//                 disabled={formData.pinCode.length !== 6 || pinCodeLookupLoading}
//                 className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//               >
//                 <LocationIcon className="mr-1" fontSize="small" />
//                 Fetch Address
//               </button>
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={formData.pinCode}
//                 onChange={handlePinCodeChange}
//                 placeholder="Enter 6-digit PIN code"
//                 maxLength={6}
//                 disabled={isEditing}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pl-12 ${
//                   pinCodeLookupError ? 'border-red-300' : 'border-gray-300'
//                 } ${isEditing ? 'bg-gray-50' : ''}`}
//               />
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                 {pinCodeLookupLoading ? (
//                   <CircularProgress size={20} />
//                 ) : pinCodeValid ? (
//                   <CheckCircleIcon className="text-green-500" />
//                 ) : (
//                   <LocationIcon className="text-gray-400" />
//                 )}
//               </div>
//               {formData.pinCode.length === 6 && (
//                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                   <span className={`text-sm ${pinCodeValid ? 'text-green-600' : 'text-gray-500'}`}>
//                     {pinCodeValid ? '✓ Valid' : 'Checking...'}
//                   </span>
//                 </div>
//               )}
//             </div>
//             {pinCodeLookupError && (
//               <div className="text-red-500 text-sm">{pinCodeLookupError}</div>
//             )}
//             {pinCodeLookupLoading && (
//               <LinearProgress className="h-1" />
//             )}
//           </div>

//           {/* State Field */}
//           <div>
//             <label className="text-gray-700 font-medium block mb-2">State *</label>
//             <input
//               type="text"
//               value={formData.state}
//               onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
//               placeholder="State will auto-fill"
//               readOnly={pinCodeValid}
//               className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                 pinCodeValid ? 'bg-gray-50' : ''
//               }`}
//             />
//           </div>

//           {/* District Field */}
//           <div>
//             <label className="text-gray-700 font-medium block mb-2">District *</label>
//             <input
//               type="text"
//               value={formData.district}
//               onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
//               placeholder="District will auto-fill"
//               readOnly={pinCodeValid}
//               className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                 pinCodeValid ? 'bg-gray-50' : ''
//               }`}
//             />
//           </div>

//           {/* Taluk Field */}
//           <div>
//             <label className="text-gray-700 font-medium block mb-2">Taluk *</label>
//             <input
//               type="text"
//               value={formData.taluk}
//               onChange={(e) => setFormData(prev => ({ ...prev, taluk: e.target.value }))}
//               placeholder="Taluk will auto-fill"
//               readOnly={pinCodeValid}
//               className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                 pinCodeValid ? 'bg-gray-50' : ''
//               }`}
//             />
//           </div>

//           {/* Info Box */}
//           {pinCodeValid && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <div className="flex items-center text-blue-700">
//                 <LocationIcon className="mr-2" />
//                 <span className="text-sm">Address details auto-filled from India Post PIN code database</span>
//               </div>
//             </div>
//           )}
//         </DialogContent>

//         <DialogActions className="px-6 py-4 border-t border-gray-200">
//           <button
//             onClick={handleCloseDialog}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!pinCodeValid || !formData.state || !formData.district || !formData.taluk}
//             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//           >
//             {isEditing ? 'Update Record' : 'Save Record'}
//           </button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar (MUI) */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//           elevation={6}
//           variant="filled"
//           className="shadow-lg"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }











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

  const fetchPinCodeDetails = async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      showSnackbar("Please enter a valid 6-digit PIN code", "error");
      return;
    }

    try {
      setPinCodeLoading(true);
      const response = await axios.get("/api/states-details", {
        params: { pincode }
      });

      if (response.data.success && response.data.data) {
        const { state, district, taluk } = response.data.data;
        setFormData(prev => ({
          ...prev,
          state,
          district,
          taluk
        }));
        showSnackbar("Address details auto-filled successfully!", "success");
      } else {
        showSnackbar(response.data.error || "Invalid PIN code", "error");
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || "Failed to fetch address details", "error");
    } finally {
      setPinCodeLoading(false);
    }
  };


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
    if (!formData.pinCode.trim() || !formData.state.trim() || !formData.district.trim() || !formData.taluk.trim()) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    if (formData.pinCode.length !== 6 || !/^\d+$/.test(formData.pinCode)) {
      showSnackbar("Please enter a valid 6-digit PIN code", "error");
      return;
    }

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
    
    if (value.length === 6 && /^\d+$/.test(value)) {
      fetchPinCodeDetails(value);
    }
  };

  const handleManualFetch = () => {
    if (formData.pinCode.length === 6 && /^\d+$/.test(formData.pinCode)) {
      fetchPinCodeDetails(formData.pinCode);
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
                  <th className="p-[.6rem] text-sm text-left font-semibold">PIN Code</th>
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
                    <td className="p-[.6rem] text-sm">
                      <div className="font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {state.pinCode}
                      </div>
                    </td>
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
                        <button
                          onClick={() => handleDeleteClick(state)}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Record"
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
              <div>
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
              </div>

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