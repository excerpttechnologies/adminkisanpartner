
// "use client"

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaSearch,
//   FaFilter,
//   FaUser,
//   FaCalendarAlt,
//   FaTags,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaFileAlt,
//   FaRoad,
//   FaShippingFast,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaClipboardCheck,
//   FaReceipt,
//   FaChartLine,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaHistory,
//   FaClock,
//   FaBox,
//   FaUserCheck,
//   FaWarehouse,
//   FaTruckLoading
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces
// interface TransporterDetail {
//   traderId: string;
//   traderName: string;
//   farmerId: string;
//   transporterStatus: string;
//   createdAt: string;
//   orderId: string;
//   transporterDetails?: {
//     transporterName?: string;
//     vehicleNumber?: string;
//     driverName?: string;
//     transporterReached?: boolean;
//     goodsConditionCorrect?: boolean;
//     quantityCorrect?: boolean;
//     verifiedByName?: string;
//     verifiedAt?: string;
//   };
// }

// const ShipmentReport: React.FC = () => {
//   const [shipmentData, setShipmentData] = useState<TransporterDetail[]>([]);
//   const [allShipmentData, setAllShipmentData] = useState<TransporterDetail[]>([]);
//   const [displayedData, setDisplayedData] = useState<TransporterDetail[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
  
//   // Filter states
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>({
//     start: '',
//     end: ''
//   });
  
//   // Sorting states
//   const [sortField, setSortField] = useState<string>('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
//   // Current item for details dialog
//   const [currentItem, setCurrentItem] = useState<TransporterDetail | null>(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  
//   // Mobile view state
//   const [expandedItem, setExpandedItem] = useState<string | null>(null);

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
//   const tableRef = useRef<HTMLDivElement>(null);

//   // Fetch shipment data with server-side pagination and sorting
//   const fetchShipmentData = useCallback(async () => {
//     setLoading(true);
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (statusFilter) params.append('status', statusFilter);
//     if (dateRangeFilter.start) params.append('startDate', dateRangeFilter.start);
//     if (dateRangeFilter.end) params.append('endDate', dateRangeFilter.end);
//     params.append('page', currentPage.toString());
//     params.append('limit', itemsPerPage.toString());
//     params.append('sortBy', sortField);
//     params.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');

//     try {
//       const response = await axios.get(`api/transporterDetails?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
//         setShipmentData(data);
//         setDisplayedData(data);
//         setTotalItems(response.data.totalRecords || 0);
//         setTotalPages(response.data.totalPages || 1);
        
//         // For export functionality, fetch all data
//         const exportParams = new URLSearchParams();
//         if (searchInput) exportParams.append('search', searchInput);
//         if (statusFilter) exportParams.append('status', statusFilter);
//         if (dateRangeFilter.start) exportParams.append('startDate', dateRangeFilter.start);
//         if (dateRangeFilter.end) exportParams.append('endDate', dateRangeFilter.end);
//         exportParams.append('limit', '10000');
//         exportParams.append('sortBy', sortField);
//         exportParams.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');
        
//         const exportResponse = await axios.get(`api/transporterDetails?${exportParams.toString()}`);
//         if (exportResponse.data.success) {
//           setAllShipmentData(exportResponse.data.data || []);
//         }
//       } else {
//         toast.error('Failed to fetch shipment data');
//       }
//     } catch (error) {
//       console.error('Error fetching shipment data:', error);
//       toast.error('Error fetching shipment data');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE, searchInput, statusFilter, dateRangeFilter, currentPage, itemsPerPage, sortField, sortOrder]);

//   // Initial fetch on component mount
//   useEffect(() => {
//     fetchShipmentData();
//   }, []);

//   // Fetch data when filters, pagination or sorting changes
//   useEffect(() => {
//     fetchShipmentData();
//   }, [currentPage, itemsPerPage, sortField, sortOrder, fetchShipmentData]);

//   // Handle sort
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('desc');
//     }
//     setCurrentPage(1);
//   };

//   // Get sort icon for a field
//   const getSortIcon = (field: string) => {
//     if (sortField !== field) {
//       return <FaSort className="inline ml-1 text-gray-400" />;
//     }
//     return sortOrder === 'asc' 
//       ? <FaSortUp className="inline ml-1 text-blue-600" /> 
//       : <FaSortDown className="inline ml-1 text-blue-600" />;
//   };

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     if (tableRef.current) {
//       tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
//     const newLimit = Number(event.target.value);
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//   };

//   // Calculate pagination range
//   const getPaginationRange = () => {
//     const startItem = (currentPage - 1) * itemsPerPage + 1;
//     const endItem = Math.min(currentPage * itemsPerPage, totalItems);
//     return { startItem, endItem };
//   };

//   // Export functions
//   // const handleCopyToClipboard = async () => {
//   //   const headers = ["Order ID", "Farmer ID", "Trader", "Status", "Transporter", "Vehicle", "Created Date"];
    
//   //   const csvContent = [
//   //     headers.join("\t"),
//   //     ...allShipmentData.map((item) => [
//   //       item.orderId,
//   //       item.farmerId,
//   //       item.traderName,
//   //       formatStatus(item.transporterStatus),
//   //       item.transporterDetails?.transporterName || 'N/A',
//   //       item.transporterDetails?.vehicleNumber || 'N/A',
//   //       new Date(item.createdAt).toLocaleDateString()
//   //     ].join("\t"))
//   //   ].join("\n");
    
//   //   try {
//   //     await navigator.clipboard.writeText(csvContent);
//   //     toast.success("Data copied to clipboard!");
//   //   } catch (err) {
//   //     console.error("Failed to copy: ", err);
//   //     toast.error("Failed to copy to clipboard");
//   //   }
//   // };
//  const handleCopyToClipboard = async (): Promise<void> => {
//   if (!allShipmentData || allShipmentData.length === 0) {
//     toast.error("No shipment data to copy");
//     return;
//   }

//   // Define headers with optimal widths
//   const headers = [
//     { name: "Order ID", width: 14 },
//     { name: "Farmer ID", width: 12 },
//     { name: "Trader", width: 18 },
//     { name: "Status", width: 16 },
//     { name: "Transporter", width: 20 },
//     { name: "Vehicle", width: 15 },
//     { name: "Date", width: 12 }
//   ];
  
//   // Create header row
//   const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//   const separator = "─".repeat(headerRow.length);
  
//   // Format each shipment row
//   const shipmentRows = allShipmentData.map((item: any) => {
//     // Format farmer ID (truncate if long)
//     const farmerId = item.farmerId || "N/A";
//     const formattedFarmerId = farmerId.length > 10 
//       ? farmerId.substring(0, 8) + "..." 
//       : farmerId;
    
//     // Format trader name
//     const traderName = item.traderName || "N/A";
//     const formattedTrader = traderName.length > 16 
//       ? traderName.substring(0, 13) + "..." 
//       : traderName;
    
//     // Format status with emoji
//     const status = formatStatus(item.transporterStatus) || "N/A";
//     const statusEmoji = status.toLowerCase().includes("assigned") ? "🚚" : 
//                        status.toLowerCase().includes("picked") ? "📦" : 
//                        status.toLowerCase().includes("delivered") ? "✅" : 
//                        status.toLowerCase().includes("pending") ? "⏳" : 
//                        status.toLowerCase().includes("cancelled") ? "❌" : "📋";
    
//     // Format transporter details
//     const transporter = item.transporterDetails?.transporterName || "N/A";
//     const formattedTransporter = transporter.length > 18 
//       ? transporter.substring(0, 15) + "..." 
//       : transporter;
    
//     // Format vehicle number (clean up)
//     const vehicle = item.transporterDetails?.vehicleNumber || "N/A";
//     const formattedVehicle = vehicle.toUpperCase().replace(/\s+/g, "");
    
//     // Format date
//     const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";
    
//     // Create row values with padding
//     const rowValues = [
//       (item.orderId || "N/A").padEnd(headers[0].width),
//       formattedFarmerId.padEnd(headers[1].width),
//       formattedTrader.padEnd(headers[2].width),
//       `${statusEmoji} ${status}`.padEnd(headers[3].width),
//       formattedTransporter.padEnd(headers[4].width),
//       formattedVehicle.padEnd(headers[5].width),
//       date.padEnd(headers[6].width)
//     ];
    
//     return rowValues.join(" │ ");
//   });
  
//   // Calculate shipment analytics
//   const analytics = allShipmentData.reduce((acc: any, item: any) => {
//     const status = formatStatus(item.transporterStatus) || "unknown";
//     acc.byStatus[status] = (acc.byStatus[status] || 0) + 1;
    
//     // Count assigned transporters
//     if (item.transporterDetails?.transporterName) {
//       acc.withTransporter++;
//     }
    
//     // Count with vehicle numbers
//     if (item.transporterDetails?.vehicleNumber) {
//       acc.withVehicle++;
//     }
    
//     return acc;
//   }, {
//     byStatus: {},
//     withTransporter: 0,
//     withVehicle: 0
//   });
  
//   // Get unique transporters
//   const uniqueTransporters = new Set(
//     allShipmentData
//       .map((item: any) => item.transporterDetails?.transporterName)
//       .filter(Boolean)
//   );
  
//   // Build complete table with analytics
//   const tableContent = [
//     "🚚 SHIPMENT & LOGISTICS REPORT",
//     "=".repeat(headerRow.length),
//     headerRow,
//     separator,
//     ...shipmentRows,
//     separator,
//     "",
//     "📊 SHIPMENT ANALYTICS",
//     `• Total Shipments: ${allShipmentData.length}`,
//     `• With Transporter Assigned: ${analytics.withTransporter} (${Math.round(analytics.withTransporter/allShipmentData.length*100)}%)`,
//     `• With Vehicle Details: ${analytics.withVehicle} (${Math.round(analytics.withVehicle/allShipmentData.length*100)}%)`,
//     `• Unique Transporters: ${uniqueTransporters.size}`,
//     "",
//     "📈 SHIPMENT STATUS DISTRIBUTION",
//     ...Object.entries(analytics.byStatus).map(([status, count]: [string, any]) => 
//       `• ${status}: ${count} shipments (${Math.round((count / allShipmentData.length) * 100)}%)`
//     ),
//     "",
//     "👥 ENTITY STATISTICS",
//     `• Unique Farmers: ${new Set(allShipmentData.map((item: any) => item.farmerId)).size}`,
//     `• Unique Traders: ${new Set(allShipmentData.map((item: any) => item.traderName)).size}`,
//     `• Unique Orders: ${new Set(allShipmentData.map((item: any) => item.orderId)).size}`,
//     "",
//     "📅 TIMELINE INSIGHTS",
//     `• Earliest Shipment: ${allShipmentData.length > 0 ? new Date(Math.min(...allShipmentData.map((item: any) => new Date(item.createdAt).getTime()))).toLocaleDateString() : "N/A"}`,
//     `• Latest Shipment: ${allShipmentData.length > 0 ? new Date(Math.max(...allShipmentData.map((item: any) => new Date(item.createdAt).getTime()))).toLocaleDateString() : "N/A"}`,
//     `• Average Shipments per Day: ${calculateAveragePerDay()}`,
//     "",
//     `🔍 Report Generated: ${new Date().toLocaleString()}`
//   ].join("\n");
  
//   // Helper function to calculate average shipments per day
//   function calculateAveragePerDay(): string {
//     if (allShipmentData.length === 0) return "0";
    
//     const dates = allShipmentData.map((item: any) => 
//       new Date(item.createdAt).toDateString()
//     );
//     const uniqueDays = new Set(dates).size;
    
//     return (allShipmentData.length / uniqueDays).toFixed(1);
//   }
  
//   try {
//     await navigator.clipboard.writeText(tableContent);
//     toast.success(`Copied ${allShipmentData.length} shipment records!`);
//   } catch (err) {
//     console.error("Failed to copy:", err);
//     toast.error("Failed to copy to clipboard");
//   }
// };

//   const handleExportExcel = () => {
//     const data = allShipmentData.map((item) => ({
//       "Order ID": item.orderId,
//       "Farmer ID": item.farmerId,
//       "Trader ID": item.traderId,
//       "Trader Name": item.traderName,
//       "Status": formatStatus(item.transporterStatus),
//       "Transporter Name": item.transporterDetails?.transporterName || 'N/A',
//       "Vehicle Number": item.transporterDetails?.vehicleNumber || 'N/A',
//       "Driver Name": item.transporterDetails?.driverName || 'N/A',
//       "Transporter Reached": item.transporterDetails?.transporterReached ? 'Yes' : 'No',
//       "Goods Condition": item.transporterDetails?.goodsConditionCorrect ? 'Correct' : 'Incorrect',
//       "Quantity Verified": item.transporterDetails?.quantityCorrect ? 'Correct' : 'Incorrect',
//       "Verified By": item.transporterDetails?.verifiedByName || 'N/A',
//       "Verified Date": item.transporterDetails?.verifiedAt ? new Date(item.transporterDetails.verifiedAt).toLocaleDateString() : 'N/A',
//       "Created Date": new Date(item.createdAt).toLocaleDateString(),
//     }));

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Shipment Report");
//     writeFile(wb, `shipment-report-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Farmer ID", "Trader", "Status", "Transporter", "Vehicle", "Created Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allShipmentData.map((item) => [
//         `"${item.orderId}"`,
//         `"${item.farmerId}"`,
//         `"${item.traderName}"`,
//         `"${formatStatus(item.transporterStatus)}"`,
//         `"${item.transporterDetails?.transporterName || 'N/A'}"`,
//         `"${item.transporterDetails?.vehicleNumber || 'N/A'}"`,
//         `"${new Date(item.createdAt).toLocaleDateString()}"`
//       ].join(","))
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `shipment-report-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF('landscape');
//     doc.text("Shipment Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Farmer ID", "Trader", "Status", "Transporter", "Vehicle", "Created Date"];
//     const tableRows: any = allShipmentData.map((item) => [
//       item.orderId,
//       item.farmerId,
//       item.traderName,
//       formatStatus(item.transporterStatus),
//       item.transporterDetails?.transporterName || 'N/A',
//       item.transporterDetails?.vehicleNumber || 'N/A',
//       new Date(item.createdAt).toLocaleDateString()
//     ]);
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [76, 175, 80] },
//     });
    
//     doc.save(`shipment-report-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Shipment Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #4CAF50; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .status-pending { background-color: #fef3c7; color: #92400e; }
//           .status-accepted { background-color: #d1fae5; color: #065f46; }
//           .status-completed { background-color: #10b981; color: white; }
//           .total-row { background-color: #f3f4f6; font-weight: bold; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Shipment Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Farmer ID</th>
//               <th>Trader</th>
//               <th>Status</th>
//               <th>Transporter</th>
//               <th>Vehicle</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allShipmentData.map((item) => {
//               const statusClass = `status-${item.transporterStatus}`;
//               return `
//                 <tr>
//                   <td>${item.orderId}</td>
//                   <td>${item.farmerId}</td>
//                   <td>${item.traderName}</td>
//                   <td class="${statusClass}">${formatStatus(item.transporterStatus)}</td>
//                   <td>${item.transporterDetails?.transporterName || 'N/A'}</td>
//                   <td>${item.transporterDetails?.vehicleNumber || 'N/A'}</td>
//                   <td>${new Date(item.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               `;
//             }).join('')}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     printWindow?.document.write(printContent);
//     printWindow?.document.close();
//     printWindow?.print();
//     toast.success("Printing shipment report...");
//   };

//   // Status badge colors
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'accepted':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format status text
//   const formatStatus = (status: string) => {
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format date time
//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Format boolean to Yes/No
//   const formatBoolean = (value?: boolean) => {
//     return value ? 'Yes' : 'No';
//   };

//   // Open details dialog
//   const openDetailsDialog = (item: TransporterDetail) => {
//     setCurrentItem(item);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setStatusFilter('');
//     setDateRangeFilter({ start: '', end: '' });
//     setSortField('createdAt');
//     setSortOrder('desc');
//     setCurrentPage(1);
//     fetchShipmentData();
//   };

//   // Apply search and filters
//   const applyFilters = () => {
//     setCurrentPage(1);
//     fetchShipmentData();
//   };

//   // Calculate stats
//   const calculateStats = () => {
//     const totalShipments = allShipmentData.length;
//     const completedShipments = allShipmentData.filter(item => item.transporterStatus === 'completed').length;
//     const pendingShipments = allShipmentData.filter(item => item.transporterStatus === 'pending').length;
//     const acceptedShipments = allShipmentData.filter(item => item.transporterStatus === 'accepted').length;
//     const completionRate = totalShipments > 0 ? Math.round((completedShipments / totalShipments) * 100) : 0;
    
//     return { totalShipments, completedShipments, pendingShipments, acceptedShipments, completionRate };
//   };

//   const { totalShipments, completedShipments, pendingShipments, acceptedShipments, completionRate } = calculateStats();
//   const { startItem, endItem } = getPaginationRange();

//   if (loading && allShipmentData.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading shipment data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* Header */}
//       <div className="lg:mb-0 mb-3">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaTruck className="text-green-600" />
//           Shipment Report
//         </h1>
//         <p className="text-gray-600 mt-2">Monitor and manage transporter details and shipment status</p>
//       </div>

//       {/* Export Buttons - Desktop */}
//       <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy to clipboard", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Export to Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "Export to CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "Export to PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print report", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center gap-2 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>

//       {/* Export Buttons - Mobile */}
//       <div className="lg:hidden flex flex-wrap gap-2 mb-3">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[50px]`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
//         <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Shipments</p>
//               <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
//             </div>
//             <FaTruck className="text-green-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Accepted</p>
//               <p className="text-2xl font-bold text-gray-900">{acceptedShipments}</p>
//             </div>
//             <FaCheckCircle className="text-blue-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Pending</p>
//               <p className="text-2xl font-bold text-gray-900">{pendingShipments}</p>
//             </div>
//             <FaClock className="text-yellow-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Completed</p>
//               <p className="text-2xl font-bold text-gray-900">{completedShipments}</p>
//             </div>
//             <FaChartLine className="text-purple-500 text-2xl" />
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded shadow mb-6 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//           {/* Search */}
//           <div className="col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//               placeholder="Search order, farmer, trader..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaTags className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           {/* Date Range - Start Date */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaCalendarAlt className="text-gray-400" />
//             </div>
//             <input
//               type="date"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//               value={dateRangeFilter.start}
//               onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
//               placeholder="From Date"
//             />
//           </div>

//           {/* Date Range - End Date */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaCalendarAlt className="text-gray-400" />
//             </div>
//             <input
//               type="date"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//               value={dateRangeFilter.end}
//               onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
//               placeholder="To Date"
//             />
//           </div>

//           {/* Sorting Selector */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSort className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
//               value={sortField}
//               onChange={(e) => {
//                 setSortField(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="createdAt">Sort by Created Date</option>
//               <option value="orderId">Sort by Order ID</option>
//               <option value="traderName">Sort by Trader Name</option>
//               <option value="transporterStatus">Sort by Status</option>
//             </select>
//           </div>

//           {/* Sort Order Toggle */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//                 setCurrentPage(1);
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${
//                 sortOrder === 'asc' 
//                   ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
//                   : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
//               }`}
//               title={sortOrder === 'asc' ? 'Ascending order' : 'Descending order'}
//             >
//               {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
//               {sortOrder === 'asc' ? 'Asc' : 'Desc'}
//             </button>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 col-span-2 md:col-span-1">
//             <button
//               onClick={applyFilters}
//               className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
//             >
//               <FaSearch />
//               Search
//             </button>
//             <button
//               onClick={resetFilters}
//               className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//             >
//               <FaSync />
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('orderId')}
//                 >
//                   Order ID {getSortIcon('orderId')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('farmerId')}
//                 >
//                   Farmer ID {getSortIcon('farmerId')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('traderName')}
//                 >
//                   Trader Details {getSortIcon('traderName')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('transporterStatus')}
//                 >
//                   Status {getSortIcon('transporterStatus')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('transporterDetails.transporterName')}
//                 >
//                   Transporter {getSortIcon('transporterDetails.transporterName')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('transporterDetails.verifiedAt')}
//                 >
//                   Verification {getSortIcon('transporterDetails.verifiedAt')}
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   Created Date {getSortIcon('createdAt')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedData.map((item, index) => (
//                 <tr key={`${item.orderId}-${item.farmerId}-${index}`} className="hover:bg-gray-50 transition-colors">
//                   {/* Order ID */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="text-sm font-medium text-blue-600">{item.orderId}</div>
//                   </td>

//                   {/* Farmer ID */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaUser className="text-green-400 mr-2" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {item.farmerId}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Trader Details */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaWarehouse className="text-blue-400 mr-2" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{item.traderName}</div>
//                         <div className="text-xs text-gray-500">ID: {item.traderId}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.transporterStatus)}`}>
//                       {formatStatus(item.transporterStatus)}
//                     </span>
//                   </td>

//                   {/* Transporter Details */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     {item.transporterDetails ? (
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           <FaTruck className="inline mr-1 text-gray-400" />
//                           {item.transporterDetails.transporterName || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {item.transporterDetails.vehicleNumber || 'No vehicle'}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-500 italic">Not assigned</div>
//                     )}
//                   </td>

//                   {/* Verification Details */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     {item.transporterDetails?.verifiedAt ? (
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {formatDate(item.transporterDetails.verifiedAt)}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           By: {item.transporterDetails.verifiedByName}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-500 italic">Not verified</div>
//                     )}
//                   </td>

//                   {/* Created Date */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaCalendarAlt className="text-gray-400 mr-2" />
//                       <div className="text-sm font-medium text-gray-900">
//                         {formatDate(item.createdAt)}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Actions */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <button
//                       onClick={() => openDetailsDialog(item)}
//                       className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
//                       title="View Details"
//                     >
//                       <FaEye />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* No Data State */}
//         {displayedData.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">
//               <FaTruck />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No shipment data found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-4">
//         {displayedData.map((item, index) => (
//           <div key={`${item.orderId}-${item.farmerId}-${index}`} className="bg-white rounded shadow p-4">
//             <div className="flex justify-between items-start mb-3">
//               <div>
//                 <div className="font-bold text-blue-600">{item.orderId}</div>
//                 <div className="text-sm text-gray-500">Farmer: {item.farmerId}</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => openDetailsDialog(item)}
//                   className="text-blue-600 p-1"
//                   title="View Details"
//                 >
//                   <FaEye />
//                 </button>
//                 <button
//                   onClick={() => setExpandedItem(
//                     expandedItem === `${item.orderId}-${item.farmerId}` 
//                       ? null 
//                       : `${item.orderId}-${item.farmerId}`
//                   )}
//                   className="text-gray-500 p-1"
//                   title={expandedItem === `${item.orderId}-${item.farmerId}` ? "Collapse" : "Expand"}
//                 >
//                   {expandedItem === `${item.orderId}-${item.farmerId}` ? <FaChevronUp /> : <FaChevronDown />}
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <div className="text-xs text-gray-500">Trader</div>
//                 <div className="text-sm font-medium">{item.traderName}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Status</div>
//                 <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.transporterStatus)}`}>
//                   {formatStatus(item.transporterStatus)}
//                 </span>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Transporter</div>
//                 <div className="text-sm font-medium">
//                   {item.transporterDetails?.transporterName || 'Not assigned'}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Created</div>
//                 <div className="text-sm">{formatDate(item.createdAt)}</div>
//               </div>
//             </div>

//             {/* Expanded Content */}
//             {expandedItem === `${item.orderId}-${item.farmerId}` && (
//               <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
//                 {item.transporterDetails && (
//                   <>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-gray-500">Vehicle Number</div>
//                         <div className="text-sm font-medium">
//                           {item.transporterDetails.vehicleNumber || 'N/A'}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Driver Name</div>
//                         <div className="text-sm">{item.transporterDetails.driverName || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Transporter Reached</div>
//                         <div className="text-sm">{formatBoolean(item.transporterDetails.transporterReached)}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Goods Condition</div>
//                         <div className="text-sm">{formatBoolean(item.transporterDetails.goodsConditionCorrect)}</div>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-gray-500">Quantity Verified</div>
//                         <div className="text-sm">{formatBoolean(item.transporterDetails.quantityCorrect)}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Verified By</div>
//                         <div className="text-sm">{item.transporterDetails.verifiedByName || 'N/A'}</div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <div className="text-xs text-gray-500">Verified At</div>
//                       <div className="text-sm">
//                         {item.transporterDetails.verifiedAt 
//                           ? formatDateTime(item.transporterDetails.verifiedAt)
//                           : 'N/A'
//                         }
//                       </div>
//                     </div>
//                   </>
//                 )}
                
//                 <div className="pt-3 border-t">
//                   <div className="text-xs text-gray-500">Trader ID</div>
//                   <div className="text-sm font-medium">{item.traderId}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {displayedData.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
//           <div className="flex items-center gap-3">
//             <div className="text-sm text-gray-600">
//               Showing {startItem} to {endItem} of {totalItems} records
//             </div>
//             <FormControl size="small" className="min-w-[120px]">
//               <InputLabel id="items-per-page-label">Show</InputLabel>
//               <Select
//                 labelId="items-per-page-label"
//                 value={itemsPerPage}
//                 label="Show"
//                 onChange={handleItemsPerPageChange}
//               >
//                 <MenuItem value={5}>5</MenuItem>
//                 <MenuItem value={10}>10</MenuItem>
//                 <MenuItem value={20}>20</MenuItem>
//                 <MenuItem value={50}>50</MenuItem>
//                 <MenuItem value={100}>100</MenuItem>
//               </Select>
//             </FormControl>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center gap-3">
//             <div className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               shape="rounded"
//               size="small"
//               showFirstButton
//               showLastButton
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </div>
//       )}

//       {/* Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaEye className="text-blue-600" />
//                 Shipment Details: {currentItem?.orderId}
//               </h2>
//               <p className="text-gray-600">Complete shipment and transporter information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//               title="Close"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentItem && (
//             <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//               {/* Order Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaReceipt className="text-blue-600" />
//                     Order Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Order ID:</span>
//                       <span className="font-medium">{currentItem.orderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Created Date:</span>
//                       <span className="font-medium">{formatDateTime(currentItem.createdAt)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Status:</span>
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.transporterStatus)}`}>
//                         {formatStatus(currentItem.transporterStatus)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUser className="text-green-600" />
//                     Parties Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Farmer ID:</span>
//                       <span className="font-medium">
//                         {currentItem.farmerId}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Trader:</span>
//                       <span className="font-medium">{currentItem.traderName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Trader ID:</span>
//                       <span className="font-medium">{currentItem.traderId}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               {currentItem.transporterDetails ? (
//                 <>
//                   <div className="bg-gray-50 p-4 rounded">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                       <FaTruck className="text-purple-600" />
//                       Transporter Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="text-center p-4 bg-white rounded border">
//                         <div className="text-gray-600 text-sm mb-1">Transporter Name</div>
//                         <div className="font-bold text-lg text-gray-900">
//                           {currentItem.transporterDetails.transporterName || 'N/A'}
//                         </div>
//                       </div>
//                       <div className="text-center p-4 bg-white rounded border border-blue-200">
//                         <div className="text-gray-600 text-sm mb-1">Vehicle Number</div>
//                         <div className="font-bold text-lg text-blue-700">
//                           {currentItem.transporterDetails.vehicleNumber || 'N/A'}
//                         </div>
//                       </div>
//                       <div className="text-center p-4 bg-white rounded border border-green-200">
//                         <div className="text-gray-600 text-sm mb-1">Driver Name</div>
//                         <div className="font-bold text-lg text-green-700">
//                           {currentItem.transporterDetails.driverName || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Verification Details */}
//                   <div className="bg-gray-50 p-4 rounded">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                       <FaClipboardCheck className="text-orange-600" />
//                       Verification Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className={`text-center p-4 rounded border ${
//                         currentItem.transporterDetails.transporterReached 
//                           ? 'border-green-200 bg-green-50' 
//                           : 'border-gray-200 bg-white'
//                       }`}>
//                         <div className="text-gray-600 text-sm mb-1">Transporter Reached</div>
//                         <div className={`font-bold text-lg ${
//                           currentItem.transporterDetails.transporterReached 
//                             ? 'text-green-700' 
//                             : 'text-gray-700'
//                         }`}>
//                           {formatBoolean(currentItem.transporterDetails.transporterReached)}
//                         </div>
//                       </div>
//                       <div className={`text-center p-4 rounded border ${
//                         currentItem.transporterDetails.goodsConditionCorrect 
//                           ? 'border-green-200 bg-green-50' 
//                           : 'border-red-200 bg-red-50'
//                       }`}>
//                         <div className="text-gray-600 text-sm mb-1">Goods Condition</div>
//                         <div className={`font-bold text-lg ${
//                           currentItem.transporterDetails.goodsConditionCorrect 
//                             ? 'text-green-700' 
//                             : 'text-red-700'
//                         }`}>
//                           {formatBoolean(currentItem.transporterDetails.goodsConditionCorrect)}
//                         </div>
//                       </div>
//                       <div className={`text-center p-4 rounded border ${
//                         currentItem.transporterDetails.quantityCorrect 
//                           ? 'border-green-200 bg-green-50' 
//                           : 'border-red-200 bg-red-50'
//                       }`}>
//                         <div className="text-gray-600 text-sm mb-1">Quantity Verified</div>
//                         <div className={`font-bold text-lg ${
//                           currentItem.transporterDetails.quantityCorrect 
//                             ? 'text-green-700' 
//                             : 'text-red-700'
//                         }`}>
//                           {formatBoolean(currentItem.transporterDetails.quantityCorrect)}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <div className="text-gray-600 text-sm mb-1">Verified By</div>
//                         <div className="font-medium text-lg">
//                           {currentItem.transporterDetails.verifiedByName || 'N/A'}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600 text-sm mb-1">Verified At</div>
//                         <div className="font-medium text-lg">
//                           {currentItem.transporterDetails.verifiedAt 
//                             ? formatDateTime(currentItem.transporterDetails.verifiedAt)
//                             : 'N/A'
//                           }
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-yellow-800">
//                     <FaClock className="text-yellow-600" />
//                     Transporter Not Assigned
//                   </h3>
//                   <p className="text-yellow-700">
//                     No transporter has been assigned to this shipment yet. The shipment is currently pending.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dialog Footer */}
//           <div className="mt-6 pt-6 border-t flex justify-end gap-3">
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default ShipmentReport;








'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAdminSessionAction } from '@/app/actions/auth-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  TablePagination,
  Alert,
  Card,
  CardContent,
  SelectChangeEvent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  ArrowUpward as AscIcon,
  ArrowDownward as DescIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Types matching your API response
interface PersonalInfo {
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

interface BankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
}

interface TransporterDetails {
  transporterName?: string;
  vehicleNumber?: string;
  driverName?: string;
  transporterReached?: boolean;
  goodsConditionCorrect?: boolean;
  quantityCorrect?: boolean;
  verifiedByName?: string;
  verifiedAt?: string;
}

interface ShipmentReport {
  orderId: string;
  farmerId: string;
  farmerName: string;
  farmerState: string;
  farmerDistrict: string;
  farmerTaluk: string;
  traderId: string;
  traderName: string;
  traderState: string;
  traderDistrict: string;
  traderTaluk: string;
  transporterStatus: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  transporterDetails?: TransporterDetails;
  createdAt: string;
  updatedAt?: string;
  farmerDetails?: {
    farmerId: string;
    personalInfo: PersonalInfo;
    role: string;
    registrationStatus: string;
    registeredAt: string;
    bankDetails?: BankDetails;
    isActive: boolean;
  };
  traderDetails?: {
    traderId: string;
    personalInfo: PersonalInfo;
    role: string;
    registrationStatus: string;
    registeredAt: string;
    bankDetails?: BankDetails;
    isActive: boolean;
  };
  debug?: any;
}

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  data: ShipmentReport[];
  debugInfo?: {
    ordersCollection: string;
    farmersCollection: string;
    farmerIdsFound: string[];
    farmerIdsMissing: string[];
    traderIdsFound: string[];
    traderIdsMissing: string[];
    queryParams: any;
  };
  message?: string;
}

interface AdminData {
  taluka: string;
  role: string;
  name?: string;
  email?: string;
}

// Helper function for safe string operations
const safeLowerCase = (str: string | undefined | null): string => {
  return str ? str.toLowerCase() : '';
};

const safeIncludes = (str: string | undefined | null, search: string): boolean => {
  if (!str) return false;
  return str.toLowerCase().includes(search.toLowerCase());
};

// Main component
const TransportDetailsPage = () => {
  // State for data
  const [reports, setReports] = useState<ShipmentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Admin session state
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  
  // UI state
  const [selectedReport, setSelectedReport] = useState<ShipmentReport | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  });

  // Local state for all data (for client-side filtering)
  const [allReports, setAllReports] = useState<ShipmentReport[]>([]);

  // Refs
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch admin session data
  const fetchAdminSession = useCallback(async () => {
    try {
      const session = await getAdminSessionAction();
      if (session?.admin) {
        setAdminData({
          taluka: session.admin.taluka || '',
          role: session.admin.role || 'subadmin',
          name: session.admin.name,
          email: session.admin.email
        });
      }
    } catch (err) {
      console.error('Error fetching admin session:', err);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  // Helper function to filter data by taluk for subadmins
  const filterDataByTaluk = useCallback((data: ShipmentReport[]): ShipmentReport[] => {
    if (!adminData || adminData.role !== 'subadmin' || !adminData.taluka) {
      return data;
    }
    
    const filtered = data.filter(report => {
      // Check if either farmer OR trader taluk matches (with null checks)
      const farmerTalukMatch = report.farmerTaluk === adminData.taluka;
      const traderTalukMatch = report.traderTaluk === adminData.taluka;
      return farmerTalukMatch || traderTalukMatch;
    });
    
    console.log(`Filtered ${data.length} records to ${filtered.length} records for taluk: ${adminData.taluka}`);
    return filtered;
  }, [adminData]);

  // Fetch all shipment reports (without filtering)
  const fetchAllShipmentReports = useCallback(async (abortSignal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters WITHOUT taluk filter
      const params = new URLSearchParams({
        page: '1', // Get all data
        limit: '1000', // Get larger set for client-side filtering
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        sortBy,
        sortOrder
      });

      console.log('Fetching all shipment reports with params:', params.toString());
      
      const response = await fetch(`/api/transporterDetails?${params}`, {
        signal: abortSignal,
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Remove duplicate orderIds and ensure required fields exist
        const uniqueReports = data.data
          .filter((report, index, self) =>
            index === self.findIndex((r) => r.orderId === report.orderId)
          )
          .map(report => ({
            ...report,
            // Ensure all required fields have default values if undefined
            farmerName: report.farmerName || 'Unknown Farmer',
            traderName: report.traderName || 'Unknown Trader',
            farmerId: report.farmerId || 'N/A',
            traderId: report.traderId || 'N/A',
            farmerTaluk: report.farmerTaluk || 'Unknown',
            traderTaluk: report.traderTaluk || 'Unknown',
            farmerState: report.farmerState || 'Unknown',
            traderState: report.traderState || 'Unknown',
            farmerDistrict: report.farmerDistrict || 'Unknown',
            traderDistrict: report.traderDistrict || 'Unknown',
            transporterStatus: report.transporterStatus || 'pending',
            createdAt: report.createdAt || new Date().toISOString()
          }));
        
        // Store all reports for client-side filtering
        setAllReports(uniqueReports);
        
        // Apply client-side filtering based on user role
        const filteredData = filterDataByTaluk(uniqueReports);
        
        // Calculate paginated data
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setReports(paginatedData);
        setTotalRecords(filteredData.length);
        
        // Update stats based on filtered data
        if (filteredData.length > 0) {
          const statusCounts = filteredData.reduce((acc, report) => {
            const status = report.transporterStatus || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          setStats({
            pending: statusCounts.pending || 0,
            inTransit: statusCounts['in-transit'] || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
            total: filteredData.length
          });
        } else {
          // Reset stats if no data
          setStats({
            pending: 0,
            inTransit: 0,
            completed: 0,
            cancelled: 0,
            total: 0
          });
        }
        
        // Store debug info for troubleshooting
        if (data.debugInfo) {
          setDebugInfo(data.debugInfo);
          console.log('Debug info from API:', data.debugInfo);
        }
        
      } else {
        // FIXED: Added message property to ApiResponse interface
        setError(data.message || 'Failed to fetch shipment reports');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching shipment reports:', err);
      setError(`Failed to load shipment reports: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, page, rowsPerPage, filterDataByTaluk]);

  // Apply filters to already loaded data
  const applyFiltersToLocalData = useCallback(() => {
    if (allReports.length === 0) return;

    let filteredData = [...allReports];
    
    // Apply search filter with safe operations
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredData = filteredData.filter(report => {
        // Check multiple fields for search term
        return (
          safeIncludes(report.orderId, searchLower) ||
          safeIncludes(report.farmerName, searchLower) ||
          safeIncludes(report.traderName, searchLower) ||
          safeIncludes(report.farmerId, searchLower) ||
          safeIncludes(report.traderId, searchLower) ||
          safeIncludes(report.farmerTaluk, searchLower) ||
          safeIncludes(report.traderTaluk, searchLower) ||
          safeIncludes(report.farmerDistrict, searchLower) ||
          safeIncludes(report.traderDistrict, searchLower) ||
          safeIncludes(report.transporterDetails?.transporterName, searchLower) ||
          safeIncludes(report.transporterDetails?.vehicleNumber, searchLower) ||
          safeIncludes(report.transporterDetails?.driverName, searchLower)
        );
      });
      console.log(`Search "${search}" filtered to ${filteredData.length} records`);
    }
    
    // Apply status filter
    if (statusFilter) {
      filteredData = filteredData.filter(report =>
        report.transporterStatus === statusFilter
      );
      console.log(`Status filter "${statusFilter}" applied: ${filteredData.length} records`);
    }
    
    // Apply role-based filtering
    filteredData = filterDataByTaluk(filteredData);
    
    // Apply sorting with null checks
    filteredData.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'orderId':
          aValue = a.orderId || '';
          bValue = b.orderId || '';
          break;
        case 'farmerName':
          aValue = a.farmerName || '';
          bValue = b.farmerName || '';
          break;
        case 'traderName':
          aValue = a.traderName || '';
          bValue = b.traderName || '';
          break;
        case 'transporterStatus':
          aValue = a.transporterStatus || '';
          bValue = b.transporterStatus || '';
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Calculate paginated data
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setReports(paginatedData);
    setTotalRecords(filteredData.length);
    
    // Update stats
    if (filteredData.length > 0) {
      const statusCounts = filteredData.reduce((acc, report) => {
        const status = report.transporterStatus || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      setStats({
        pending: statusCounts.pending || 0,
        inTransit: statusCounts['in-transit'] || 0,
        completed: statusCounts.completed || 0,
        cancelled: statusCounts.cancelled || 0,
        total: filteredData.length
      });
    } else {
      setStats({
        pending: 0,
        inTransit: 0,
        completed: 0,
        cancelled: 0,
        total: 0
      });
    }
  }, [allReports, search, statusFilter, sortBy, sortOrder, page, rowsPerPage, filterDataByTaluk]);

  // Fetch admin session on component mount
  useEffect(() => {
    fetchAdminSession();
  }, [fetchAdminSession]);

  // Initial fetch of shipment reports
  useEffect(() => {
    if (!adminLoading) {
      const controller = new AbortController();
      fetchAllShipmentReports(controller.signal);
      
      return () => {
        controller.abort();
      };
    }
  }, [fetchAllShipmentReports, adminLoading]);

  // Apply local filters when filters change
  useEffect(() => {
    if (allReports.length > 0) {
      applyFiltersToLocalData();
    }
  }, [applyFiltersToLocalData, allReports.length]);

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      setPage(0);
    }, 500);
  };

  // Handle Enter key press in search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPage(0);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(0);
    
    // Clear timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setPage(0);
    fetchAllShipmentReports();
  };

  // View details
  const handleViewDetails = (report: ShipmentReport) => {
    setSelectedReport(report);
    setDetailsOpen(true);
  };

  // Close details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedReport(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-transit': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-transit': return 'In Transit';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Get registration status chip color
  const getRegistrationColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'subadmin': return 'secondary';
      default: return 'default';
    }
  };

  // Render role badge
  const renderRoleBadge = () => {
    if (!adminData) return null;
    
    const roleColor = getRoleColor(adminData.role);
    const roleText = adminData.role === 'admin' ? 'Admin' : 'Subadmin';
    const icon = adminData.role === 'admin' ? <AdminIcon /> : <PersonIcon />;
    
    return (
      <Chip
        icon={icon}
        label={`${roleText}${adminData.role === 'subadmin' && adminData.taluka ? ` - ${adminData.taluka}` : ''}`}
        color={roleColor}
        variant="outlined"
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  // Check if current user can view all data (admin)
  const canViewAllData = adminData?.role === 'admin';

  // Calculate unique taluks in the data (for admin view)
  const uniqueTaluks = React.useMemo(() => {
    if (!reports.length) return [];
    const taluks = new Set<string>();
    reports.forEach(report => {
      if (report.farmerTaluk) taluks.add(report.farmerTaluk);
      if (report.traderTaluk) taluks.add(report.traderTaluk);
    });
    return Array.from(taluks).sort();
  }, [reports]);

  // Render loading state
  if ((adminLoading || loading) && reports.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Role Badge */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Shipment Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage all shipment orders with complete farmer and trader details
            {adminData?.role === 'subadmin' && adminData.taluka && (
              <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                {' '}(Filtered by Taluk: {adminData.taluka})
              </span>
            )}
          </Typography>
        </Box>
        {renderRoleBadge()}
      </Box>

      {/* Role Information Alert */}
      {adminData && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<InfoIcon />}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              <strong>{adminData.role === 'admin' ? 'Administrator View' : 'Subadmin View'}:</strong>{' '}
              {adminData.role === 'admin' 
                ? 'You can view shipment reports from all taluks.'
                : `You can only view shipment reports from ${adminData.taluka} taluka.`
              }
            </Typography>
            {adminData.role === 'admin' && uniqueTaluks.length > 0 && (
              <Typography variant="body2">
                <strong>Available Taluks:</strong> {uniqueTaluks.length}
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Debug Info (Development only) */}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize="small" />
            <Typography variant="body2">
              Debug: Found {debugInfo.farmerIdsFound?.length || 0} farmers, {debugInfo.traderIdsFound?.length || 0} traders
              {debugInfo.farmerIdsMissing?.length > 0 && `, Missing ${debugInfo.farmerIdsMissing.length} farmers`}
              {debugInfo.traderIdsMissing?.length > 0 && `, Missing ${debugInfo.traderIdsMissing.length} traders`}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Filters Card */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="Search by Order ID, Farmer/Trader name, Taluk, District..."
                value={search}
                onChange={handleSearch}
                onKeyPress={handleSearchKeyPress}
                size="small"
                InputProps={{
                  startAdornment: (
                    <IconButton 
                      size="small" 
                      onClick={() => setPage(0)}
                      sx={{ mr: 1 }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  ),
                  endAdornment: search && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearch('');
                        setPage(0);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ flex: '0 1 150px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-transit">In Transit</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: '0 1 150px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="orderId">Order ID</MenuItem>
                  <MenuItem value="farmerName">Farmer Name</MenuItem>
                  <MenuItem value="traderName">Trader Name</MenuItem>
                  <MenuItem value="transporterStatus">Status</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: '0 1 auto' }}>
              <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}>
                <IconButton onClick={() => handleSort(sortBy)} size="small">
                  {sortOrder === 'asc' ? <AscIcon /> : <DescIcon />}
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box sx={{ flex: '0 1 100px' }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={clearFilters}
                disabled={!search && !statusFilter && sortBy === 'createdAt'}
                startIcon={<ClearIcon />}
                size="small"
              >
                Clear
              </Button>
            </Box>
            
            <Box sx={{ flex: '0 1 120px' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                size="small"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </Box>
          </Box>
          {search && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Searching for: "{search}"
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 2,
        mb: 3 
      }}>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
              {adminData?.role === 'subadmin' && (
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  In {adminData.taluka}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                In Transit
              </Typography>
              <Typography variant="h4">{stats.inTransit}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Cancelled
              </Typography>
              <Typography variant="h4">{stats.cancelled}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
          <Card sx={{ 
            bgcolor: canViewAllData ? 'secondary.light' : 'grey.300',
            color: canViewAllData ? 'white' : 'text.primary'
          }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                View Type
              </Typography>
              <Typography variant="h6">
                {canViewAllData ? 'All Taluks' : 'Taluk Restricted'}
              </Typography>
              {!canViewAllData && adminData?.taluka && (
                <Typography variant="caption">
                  {adminData.taluka}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Taluk Info for Admin */}
      {adminData?.role === 'admin' && uniqueTaluks.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Taluks Overview
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {uniqueTaluks.slice(0, 10).map((taluk) => (
                <Chip
                  key={taluk}
                  label={taluk}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: 'primary.main' }}
                />
              ))}
              {uniqueTaluks.length > 10 && (
                <Chip
                  label={`+${uniqueTaluks.length - 10} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Shipment Reports Table */}
      <Card sx={{ boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Order Details
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Farmer Details
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Trader Details
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Status & Transporter
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <Typography variant="h6" color="textSecondary" gutterBottom>
                            No shipment reports found
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {search 
                              ? `No results found for "${search}"${adminData?.role === 'subadmin' ? ` in ${adminData.taluka} taluka` : ''}`
                              : statusFilter
                                ? `No ${statusFilter} orders found${adminData?.role === 'subadmin' ? ` in ${adminData.taluka} taluka` : ''}`
                                : adminData?.role === 'subadmin' 
                                  ? `No data available in ${adminData.taluka} taluka`
                                  : 'No data available'
                            }
                          </Typography>
                          {(search || statusFilter) && (
                            <Button 
                              variant="outlined" 
                              size="small" 
                              onClick={clearFilters}
                              sx={{ mt: 2 }}
                            >
                              Clear filters
                            </Button>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => (
                  <TableRow key={`${report.orderId}-${index}`} hover>
                    {/* Order Details Column */}
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          {report.orderId}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Created: {formatDate(report.createdAt)}
                        </Typography>
                        {report.updatedAt && report.updatedAt !== report.createdAt && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Updated: {formatDate(report.updatedAt)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Farmer Details Column */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          {report.farmerName || 'Unknown Farmer'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>ID:</strong> {report.farmerId || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>Taluk:</strong> {report.farmerTaluk || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>District:</strong> {report.farmerDistrict || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>State:</strong> {report.farmerState || 'Unknown'}
                        </Typography>
                        {report.farmerDetails?.personalInfo?.mobileNo && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            <strong>Contact:</strong> {report.farmerDetails.personalInfo.mobileNo}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Trader Details Column */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          {report.traderName || 'Unknown Trader'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>ID:</strong> {report.traderId || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          <strong>Taluk:</strong> {report.traderTaluk || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text-secondary" display="block">
                          <strong>District:</strong> {report.traderDistrict || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text-secondary" display="block">
                          <strong>State:</strong> {report.traderState || 'Unknown'}
                        </Typography>
                        {report.traderDetails?.personalInfo?.mobileNo && (
                          <Typography variant="caption" color="text-secondary" display="block">
                            <strong>Contact:</strong> {report.traderDetails.personalInfo.mobileNo}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip
                          label={getStatusText(report.transporterStatus)}
                          color={getStatusColor(report.transporterStatus) as any}
                          size="small"
                          sx={{ width: 'fit-content' }}
                        />
                        {report.transporterDetails?.transporterName && (
                          <Typography variant="caption" display="block">
                            <strong>Transporter:</strong> {report.transporterDetails.transporterName}
                          </Typography>
                        )}
                        {report.transporterDetails?.vehicleNumber && (
                          <Typography variant="caption" display="block">
                            <strong>Vehicle:</strong> {report.transporterDetails.vehicleNumber}
                          </Typography>
                        )}
                        {report.transporterDetails?.driverName && (
                          <Typography variant="caption" display="block">
                            <strong>Driver:</strong> {report.transporterDetails.driverName}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Date Column */}
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(report.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell>
                      <Tooltip title="View Full Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(report)}
                          color="primary"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #e0e0e0' }}
        />
      </Card>

      {/* Loading indicator for table updates */}
      {loading && reports.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Updating data...
          </Typography>
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div">
              Order Details: {selectedReport?.orderId}
            </Typography>
            {renderRoleBadge()}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 1 }}>
              {/* Order Info Section */}
              <Box sx={{ mb: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Order Information
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 2
                    }}>
                      <Box sx={{ flex: '1 1 200px' }}>
                        <Typography variant="body2" component="div">
                          <strong>Order ID:</strong> {selectedReport.orderId}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: '1 1 200px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" component="span">
                            <strong>Status:</strong>
                          </Typography>
                          <Chip 
                            label={getStatusText(selectedReport.transporterStatus)} 
                            color={getStatusColor(selectedReport.transporterStatus) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Box sx={{ flex: '1 1 200px' }}>
                        <Typography variant="body2" component="div">
                          <strong>Created:</strong> {formatDate(selectedReport.createdAt)}
                        </Typography>
                      </Box>
                      {selectedReport.updatedAt && (
                        <Box sx={{ flex: '1 1 200px' }}>
                          <Typography variant="body2" component="div">
                            <strong>Updated:</strong> {formatDate(selectedReport.updatedAt)}
                          </Typography>
                        </Box>
                      )}
                      {/* Show Taluk info prominently */}
                      <Box sx={{ flex: '1 1 200px' }}>
                        <Typography variant="body2" component="div">
                          <strong>Farmer Taluk:</strong> {selectedReport.farmerTaluk}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: '1 1 200px' }}>
                        <Typography variant="body2" component="div">
                          <strong>Trader Taluk:</strong> {selectedReport.traderTaluk}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Main content in two columns */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3 
              }}>
                {/* Farmer Complete Details */}
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Farmer Complete Details
                      </Typography>
                      
                      {/* Basic Info */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Basic Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" component="div">
                            <strong>Name:</strong> {selectedReport.farmerName}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>ID:</strong> {selectedReport.farmerId}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>Taluk:</strong> {selectedReport.farmerTaluk}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>District:</strong> {selectedReport.farmerDistrict}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>State:</strong> {selectedReport.farmerState}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Contact & Address */}
                      {selectedReport.farmerDetails && (
                        <>
                          <Box sx={{ mb: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                              Contact & Address
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {selectedReport.farmerDetails.personalInfo.mobileNo && (
                                <Typography variant="body2" component="div">
                                  <strong>Mobile:</strong> {selectedReport.farmerDetails.personalInfo.mobileNo}
                                </Typography>
                              )}
                              {selectedReport.farmerDetails.personalInfo.email && (
                                <Typography variant="body2" component="div">
                                  <strong>Email:</strong> {selectedReport.farmerDetails.personalInfo.email}
                                </Typography>
                              )}
                              {selectedReport.farmerDetails.personalInfo.address && (
                                <Typography variant="body2" component="div">
                                  <strong>Address:</strong> {selectedReport.farmerDetails.personalInfo.address}
                                </Typography>
                              )}
                              {selectedReport.farmerDetails.personalInfo.villageGramaPanchayat && (
                                <Typography variant="body2" component="div">
                                  <strong>Village/Grama Panchayat:</strong> {selectedReport.farmerDetails.personalInfo.villageGramaPanchayat}
                                </Typography>
                              )}
                              {selectedReport.farmerDetails.personalInfo.post && (
                                <Typography variant="body2" component="div">
                                  <strong>Post:</strong> {selectedReport.farmerDetails.personalInfo.post}
                                </Typography>
                              )}
                              {selectedReport.farmerDetails.personalInfo.pincode && (
                                <Typography variant="body2" component="div">
                                  <strong>Pincode:</strong> {selectedReport.farmerDetails.personalInfo.pincode}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          
                          {/* Bank Details */}
                          {selectedReport.farmerDetails.bankDetails && (
                            <Box sx={{ mb: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                Bank Details
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {selectedReport.farmerDetails.bankDetails.accountHolderName && (
                                  <Typography variant="body2" component="div">
                                    <strong>Account Holder:</strong> {selectedReport.farmerDetails.bankDetails.accountHolderName}
                                  </Typography>
                                )}
                                {selectedReport.farmerDetails.bankDetails.accountNumber && (
                                  <Typography variant="body2" component="div">
                                    <strong>Account Number:</strong> {selectedReport.farmerDetails.bankDetails.accountNumber}
                                  </Typography>
                                )}
                                {selectedReport.farmerDetails.bankDetails.ifscCode && (
                                  <Typography variant="body2" component="div">
                                    <strong>IFSC Code:</strong> {selectedReport.farmerDetails.bankDetails.ifscCode}
                                  </Typography>
                                )}
                                {selectedReport.farmerDetails.bankDetails.branch && (
                                  <Typography variant="body2" component="div">
                                    <strong>Branch:</strong> {selectedReport.farmerDetails.bankDetails.branch}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          )}
                          
                          {/* Registration Status */}
                          <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" component="div">
                                <strong>Registration Status:</strong>
                              </Typography>
                              <Chip 
                                label={selectedReport.farmerDetails.registrationStatus} 
                                size="small"
                                color={getRegistrationColor(selectedReport.farmerDetails.registrationStatus) as any}
                              />
                            </Box>
                            {selectedReport.farmerDetails.registeredAt && (
                              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                <strong>Registered At:</strong> {formatDate(selectedReport.farmerDetails.registeredAt)}
                              </Typography>
                            )}
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                              <strong>Active Status:</strong>{' '}
                              {selectedReport.farmerDetails.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Trader Complete Details */}
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Trader Complete Details
                      </Typography>
                      
                      {/* Basic Info */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Basic Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" component="div">
                            <strong>Name:</strong> {selectedReport.traderName}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>ID:</strong> {selectedReport.traderId}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>Taluk:</strong> {selectedReport.traderTaluk}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>District:</strong> {selectedReport.traderDistrict}
                          </Typography>
                          <Typography variant="body2" component="div">
                            <strong>State:</strong> {selectedReport.traderState}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Contact & Address */}
                      {selectedReport.traderDetails && (
                        <>
                          <Box sx={{ mb: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                              Contact & Address
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {selectedReport.traderDetails.personalInfo.mobileNo && (
                                <Typography variant="body2" component="div">
                                  <strong>Mobile:</strong> {selectedReport.traderDetails.personalInfo.mobileNo}
                                </Typography>
                              )}
                              {selectedReport.traderDetails.personalInfo.email && (
                                <Typography variant="body2" component="div">
                                  <strong>Email:</strong> {selectedReport.traderDetails.personalInfo.email}
                                </Typography>
                              )}
                              {selectedReport.traderDetails.personalInfo.address && (
                                <Typography variant="body2" component="div">
                                  <strong>Address:</strong> {selectedReport.traderDetails.personalInfo.address}
                                </Typography>
                              )}
                              {selectedReport.traderDetails.personalInfo.villageGramaPanchayat && (
                                <Typography variant="body2" component="div">
                                  <strong>Village/Grama Panchayat:</strong> {selectedReport.traderDetails.personalInfo.villageGramaPanchayat}
                                </Typography>
                              )}
                              {selectedReport.traderDetails.personalInfo.post && (
                                <Typography variant="body2" component="div">
                                  <strong>Post:</strong> {selectedReport.traderDetails.personalInfo.post}
                                </Typography>
                              )}
                              {selectedReport.traderDetails.personalInfo.pincode && (
                                <Typography variant="body2" component="div">
                                  <strong>Pincode:</strong> {selectedReport.traderDetails.personalInfo.pincode}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          
                          {/* Bank Details */}
                          {selectedReport.traderDetails.bankDetails && (
                            <Box sx={{ mb: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                Bank Details
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {selectedReport.traderDetails.bankDetails.accountHolderName && (
                                  <Typography variant="body2" component="div">
                                    <strong>Account Holder:</strong> {selectedReport.traderDetails.bankDetails.accountHolderName}
                                  </Typography>
                                )}
                                {selectedReport.traderDetails.bankDetails.accountNumber && (
                                  <Typography variant="body2" component="div">
                                    <strong>Account Number:</strong> {selectedReport.traderDetails.bankDetails.accountNumber}
                                  </Typography>
                                )}
                                {selectedReport.traderDetails.bankDetails.ifscCode && (
                                  <Typography variant="body2" component="div">
                                    <strong>IFSC Code:</strong> {selectedReport.traderDetails.bankDetails.ifscCode}
                                  </Typography>
                                )}
                                {selectedReport.traderDetails.bankDetails.branch && (
                                  <Typography variant="body2" component="div">
                                    <strong>Branch:</strong> {selectedReport.traderDetails.bankDetails.branch}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          )}
                          
                          {/* Registration Status */}
                          <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" component="div">
                                <strong>Registration Status:</strong>
                              </Typography>
                              <Chip 
                                label={selectedReport.traderDetails.registrationStatus} 
                                size="small"
                                color={getRegistrationColor(selectedReport.traderDetails.registrationStatus) as any}
                              />
                            </Box>
                            {selectedReport.traderDetails.registeredAt && (
                              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                <strong>Registered At:</strong> {formatDate(selectedReport.traderDetails.registeredAt)}
                              </Typography>
                            )}
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                              <strong>Active Status:</strong>{' '}
                              {selectedReport.traderDetails.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Transporter Details */}
              {selectedReport.transporterDetails && (
                <Box sx={{ mt: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Transporter Details
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                      }}>
                        <Box sx={{ flex: 1 }}>
                          {selectedReport.transporterDetails.transporterName && (
                            <Typography variant="body2" component="div">
                              <strong>Transporter:</strong> {selectedReport.transporterDetails.transporterName}
                            </Typography>
                          )}
                          {selectedReport.transporterDetails.vehicleNumber && (
                            <Typography variant="body2" component="div">
                              <strong>Vehicle No:</strong> {selectedReport.transporterDetails.vehicleNumber}
                            </Typography>
                          )}
                          {selectedReport.transporterDetails.driverName && (
                            <Typography variant="body2" component="div">
                              <strong>Driver:</strong> {selectedReport.transporterDetails.driverName}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          {selectedReport.transporterDetails.verifiedByName && (
                            <Typography variant="body2" component="div">
                              <strong>Verified By:</strong> {selectedReport.transporterDetails.verifiedByName}
                            </Typography>
                          )}
                          {selectedReport.transporterDetails.verifiedAt && (
                            <Typography variant="body2" component="div">
                              <strong>Verified At:</strong> {formatDate(selectedReport.transporterDetails.verifiedAt)}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedReport.transporterDetails.transporterReached !== undefined && (
                              <Chip 
                                label={selectedReport.transporterDetails.transporterReached ? 'Reached' : 'Not Reached'} 
                                size="small"
                                color={selectedReport.transporterDetails.transporterReached ? 'success' : 'default'}
                              />
                            )}
                            {selectedReport.transporterDetails.goodsConditionCorrect !== undefined && (
                              <Chip 
                                label={selectedReport.transporterDetails.goodsConditionCorrect ? 'Goods OK' : 'Goods Issue'} 
                                size="small"
                                color={selectedReport.transporterDetails.goodsConditionCorrect ? 'success' : 'error'}
                              />
                            )}
                            {selectedReport.transporterDetails.quantityCorrect !== undefined && (
                              <Chip 
                                label={selectedReport.transporterDetails.quantityCorrect ? 'Quantity OK' : 'Quantity Issue'} 
                                size="small"
                                color={selectedReport.transporterDetails.quantityCorrect ? 'success' : 'error'}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportDetailsPage;