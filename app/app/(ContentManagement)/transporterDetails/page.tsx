
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


















"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaEye,
  FaSearch,
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaTags,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaCopy,
  FaTimes,
  FaFileAlt,
  FaRoad,
  FaShippingFast,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaClipboardCheck,
  FaReceipt,
  FaChartLine,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaHistory,
  FaClock,
  FaBox,
  FaUserCheck,
  FaWarehouse,
  FaTruckLoading,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaGlobeAsia,
  FaCity,
  FaBuilding
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface TransporterDetail {
  traderId: string;
  traderName: string;
  farmerId: string;
  farmerName: string;
  transporterStatus: string;
  createdAt: string;
  orderId: string;
  // New location fields
  farmerState: string;
  farmerDistrict: string;
  farmerTaluk: string;
  traderState: string;
  traderDistrict: string;
  traderTaluk: string;
  transporterDetails?: {
    transporterName?: string;
    vehicleNumber?: string;
    driverName?: string;
    transporterReached?: boolean;
    goodsConditionCorrect?: boolean;
    quantityCorrect?: boolean;
    verifiedByName?: string;
    verifiedAt?: string;
  };
}

const ShipmentReport: React.FC = () => {
  const [shipmentData, setShipmentData] = useState<TransporterDetail[]>([]);
  const [allShipmentData, setAllShipmentData] = useState<TransporterDetail[]>([]);
  const [displayedData, setDisplayedData] = useState<TransporterDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Current item for details dialog
  const [currentItem, setCurrentItem] = useState<TransporterDetail | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  
  // Mobile view state
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch shipment data with server-side pagination and sorting
  const fetchShipmentData = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (statusFilter) params.append('status', statusFilter);
    if (dateRangeFilter.start) params.append('startDate', dateRangeFilter.start);
    if (dateRangeFilter.end) params.append('endDate', dateRangeFilter.end);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    params.append('sortBy', sortField);
    params.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');

    try {
      const response = await axios.get(`/api/transporterDetails?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setShipmentData(data);
        setDisplayedData(data);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 1);
        
        // For export functionality, fetch all data
        const exportParams = new URLSearchParams();
        if (searchInput) exportParams.append('search', searchInput);
        if (statusFilter) exportParams.append('status', statusFilter);
        if (dateRangeFilter.start) exportParams.append('startDate', dateRangeFilter.start);
        if (dateRangeFilter.end) exportParams.append('endDate', dateRangeFilter.end);
        exportParams.append('limit', '10000');
        exportParams.append('sortBy', sortField);
        exportParams.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');
        
        const exportResponse = await axios.get(`/api/transporterDetails?${exportParams.toString()}`);
        if (exportResponse.data.success) {
          setAllShipmentData(exportResponse.data.data || []);
        }
      } else {
        toast.error('Failed to fetch shipment data');
      }
    } catch (error) {
      console.error('Error fetching shipment data:', error);
      toast.error('Error fetching shipment data');
    } finally {
      setLoading(false);
    }
  }, [searchInput, statusFilter, dateRangeFilter, currentPage, itemsPerPage, sortField, sortOrder]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchShipmentData();
  }, []);

  // Fetch data when filters, pagination or sorting changes
  useEffect(() => {
    fetchShipmentData();
  }, [currentPage, itemsPerPage, sortField, sortOrder, fetchShipmentData]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Get sort icon for a field
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FaSortUp className="inline ml-1 text-blue-600" /> 
      : <FaSortDown className="inline ml-1 text-blue-600" />;
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return { startItem, endItem };
  };

  // Export functions
  const handleCopyToClipboard = async (): Promise<void> => {
    if (!allShipmentData || allShipmentData.length === 0) {
      toast.error("No shipment data to copy");
      return;
    }

    // Define headers with optimal widths
    const headers = [
      { name: "Order ID", width: 14 },
      { name: "Farmer ID", width: 12 },
      { name: "Farmer Name", width: 18 },
      { name: "Farmer State", width: 15 },
      { name: "Farmer District", width: 18 },
      { name: "Farmer Taluk", width: 15 },
      { name: "Trader", width: 18 },
      { name: "Trader State", width: 15 },
      { name: "Trader District", width: 18 },
      { name: "Trader Taluk", width: 15 },
      { name: "Status", width: 16 },
      { name: "Transporter", width: 20 },
      { name: "Vehicle", width: 15 },
      { name: "Date", width: 12 }
    ];
    
    // Create header row
    const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
    const separator = "─".repeat(headerRow.length);
    
    // Format each shipment row
    const shipmentRows = allShipmentData.map((item: TransporterDetail) => {
      // Format farmer ID (truncate if long)
      const farmerId = item.farmerId || "N/A";
      const formattedFarmerId = farmerId.length > 10 
        ? farmerId.substring(0, 8) + "..." 
        : farmerId;
      
      // Format trader name
      const traderName = item.traderName || "N/A";
      const formattedTrader = traderName.length > 16 
        ? traderName.substring(0, 13) + "..." 
        : traderName;
      
      // Format status with emoji
      const status = formatStatus(item.transporterStatus) || "N/A";
      const statusEmoji = status.toLowerCase().includes("assigned") ? "🚚" : 
                         status.toLowerCase().includes("picked") ? "📦" : 
                         status.toLowerCase().includes("delivered") ? "✅" : 
                         status.toLowerCase().includes("pending") ? "⏳" : 
                         status.toLowerCase().includes("cancelled") ? "❌" : "📋";
      
      // Format transporter details
      const transporter = item.transporterDetails?.transporterName || "N/A";
      const formattedTransporter = transporter.length > 18 
        ? transporter.substring(0, 15) + "..." 
        : transporter;
      
      // Format vehicle number (clean up)
      const vehicle = item.transporterDetails?.vehicleNumber || "N/A";
      const formattedVehicle = vehicle.toUpperCase().replace(/\s+/g, "");
      
      // Format date
      const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";
      
      // Format location details
      const farmerState = item.farmerState || "N/A";
      const farmerDistrict = item.farmerDistrict || "N/A";
      const farmerTaluk = item.farmerTaluk || "N/A";
      const farmerName = item.farmerName || "N/A";
      const traderState = item.traderState || "N/A";
      const traderDistrict = item.traderDistrict || "N/A";
      const traderTaluk = item.traderTaluk || "N/A";
      
      // Create row values with padding
      const rowValues = [
        (item.orderId || "N/A").padEnd(headers[0].width),
        formattedFarmerId.padEnd(headers[1].width),
        farmerName.substring(0, 17).padEnd(headers[2].width),
        farmerState.substring(0, 14).padEnd(headers[3].width),
        farmerDistrict.substring(0, 17).padEnd(headers[4].width),
        farmerTaluk.substring(0, 14).padEnd(headers[5].width),
        formattedTrader.padEnd(headers[6].width),
        traderState.substring(0, 14).padEnd(headers[7].width),
        traderDistrict.substring(0, 17).padEnd(headers[8].width),
        traderTaluk.substring(0, 14).padEnd(headers[9].width),
        `${statusEmoji} ${status}`.padEnd(headers[10].width),
        formattedTransporter.padEnd(headers[11].width),
        formattedVehicle.padEnd(headers[12].width),
        date.padEnd(headers[13].width)
      ];
      
      return rowValues.join(" │ ");
    });
    
    // Calculate shipment analytics
    const analytics = allShipmentData.reduce((acc: any, item: TransporterDetail) => {
      const status = formatStatus(item.transporterStatus) || "unknown";
      acc.byStatus[status] = (acc.byStatus[status] || 0) + 1;
      
      // Count assigned transporters
      if (item.transporterDetails?.transporterName) {
        acc.withTransporter++;
      }
      
      // Count with vehicle numbers
      if (item.transporterDetails?.vehicleNumber) {
        acc.withVehicle++;
      }
      
      // Count unique states
      if (item.farmerState) {
        acc.farmerStates.add(item.farmerState);
      }
      if (item.traderState) {
        acc.traderStates.add(item.traderState);
      }
      
      // Count complete location info
      if (item.farmerState && item.farmerDistrict && item.farmerTaluk) {
        acc.completeFarmerLocation++;
      }
      if (item.traderState && item.traderDistrict && item.traderTaluk) {
        acc.completeTraderLocation++;
      }
      
      return acc;
    }, {
      byStatus: {},
      withTransporter: 0,
      withVehicle: 0,
      farmerStates: new Set(),
      traderStates: new Set(),
      completeFarmerLocation: 0,
      completeTraderLocation: 0
    });
    
    // Get unique transporters
    const uniqueTransporters = new Set(
      allShipmentData
        .map((item: TransporterDetail) => item.transporterDetails?.transporterName)
        .filter(Boolean)
    );
    
    // Build complete table with analytics
    const tableContent = [
      "🚚 SHIPMENT & LOGISTICS REPORT",
      "=".repeat(headerRow.length),
      headerRow,
      separator,
      ...shipmentRows,
      separator,
      "",
      "📊 SHIPMENT ANALYTICS",
      `• Total Shipments: ${allShipmentData.length}`,
      `• With Transporter Assigned: ${analytics.withTransporter} (${Math.round(analytics.withTransporter/allShipmentData.length*100)}%)`,
      `• With Vehicle Details: ${analytics.withVehicle} (${Math.round(analytics.withVehicle/allShipmentData.length*100)}%)`,
      `• Unique Transporters: ${uniqueTransporters.size}`,
      `• Complete Farmer Locations: ${analytics.completeFarmerLocation} (${Math.round(analytics.completeFarmerLocation/allShipmentData.length*100)}%)`,
      `• Complete Trader Locations: ${analytics.completeTraderLocation} (${Math.round(analytics.completeTraderLocation/allShipmentData.length*100)}%)`,
      "",
      "📈 SHIPMENT STATUS DISTRIBUTION",
      ...Object.entries(analytics.byStatus).map(([status, count]: [string, any]) => 
        `• ${status}: ${count} shipments (${Math.round((count / allShipmentData.length) * 100)}%)`
      ),
      "",
      "👥 ENTITY STATISTICS",
      `• Unique Farmers: ${new Set(allShipmentData.map((item: TransporterDetail) => item.farmerId)).size}`,
      `• Unique Traders: ${new Set(allShipmentData.map((item: TransporterDetail) => item.traderName)).size}`,
      `• Unique Orders: ${new Set(allShipmentData.map((item: TransporterDetail) => item.orderId)).size}`,
      "",
      "📍 GEOGRAPHICAL DISTRIBUTION",
      `• Farmer States: ${Array.from(analytics.farmerStates).join(", ")}`,
      `• Trader States: ${Array.from(analytics.traderStates).join(", ")}`,
      "",
      "📅 TIMELINE INSIGHTS",
      `• Earliest Shipment: ${allShipmentData.length > 0 ? new Date(Math.min(...allShipmentData.map((item: TransporterDetail) => new Date(item.createdAt).getTime()))).toLocaleDateString() : "N/A"}`,
      `• Latest Shipment: ${allShipmentData.length > 0 ? new Date(Math.max(...allShipmentData.map((item: TransporterDetail) => new Date(item.createdAt).getTime()))).toLocaleDateString() : "N/A"}`,
      `• Average Shipments per Day: ${calculateAveragePerDay()}`,
      "",
      `🔍 Report Generated: ${new Date().toLocaleString()}`
    ].join("\n");
    
    // Helper function to calculate average shipments per day
    function calculateAveragePerDay(): string {
      if (allShipmentData.length === 0) return "0";
      
      const dates = allShipmentData.map((item: TransporterDetail) => 
        new Date(item.createdAt).toDateString()
      );
      const uniqueDays = new Set(dates).size;
      
      return (allShipmentData.length / uniqueDays).toFixed(1);
    }
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`Copied ${allShipmentData.length} shipment records!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = allShipmentData.map((item) => ({
      "Order ID": item.orderId,
      "Farmer ID": item.farmerId,
      "Farmer Name": item.farmerName || 'N/A',
      "Farmer State": item.farmerState || 'N/A',
      "Farmer District": item.farmerDistrict || 'N/A',
      "Farmer Taluk": item.farmerTaluk || 'N/A',
      "Trader ID": item.traderId,
      "Trader Name": item.traderName,
      "Trader State": item.traderState || 'N/A',
      "Trader District": item.traderDistrict || 'N/A',
      "Trader Taluk": item.traderTaluk || 'N/A',
      "Status": formatStatus(item.transporterStatus),
      "Transporter Name": item.transporterDetails?.transporterName || 'N/A',
      "Vehicle Number": item.transporterDetails?.vehicleNumber || 'N/A',
      "Driver Name": item.transporterDetails?.driverName || 'N/A',
      "Transporter Reached": item.transporterDetails?.transporterReached ? 'Yes' : 'No',
      "Goods Condition": item.transporterDetails?.goodsConditionCorrect ? 'Correct' : 'Incorrect',
      "Quantity Verified": item.transporterDetails?.quantityCorrect ? 'Correct' : 'Incorrect',
      "Verified By": item.transporterDetails?.verifiedByName || 'N/A',
      "Verified Date": item.transporterDetails?.verifiedAt ? new Date(item.transporterDetails.verifiedAt).toLocaleDateString() : 'N/A',
      "Created Date": new Date(item.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Shipment Report");
    writeFile(wb, `shipment-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = [
      "Order ID", "Farmer ID", "Farmer Name", "Farmer State", "Farmer District", "Farmer Taluk",
      "Trader", "Trader State", "Trader District", "Trader Taluk", 
      "Status", "Transporter", "Vehicle", "Created Date"
    ];
    
    const csvContent = [
      headers.join(","),
      ...allShipmentData.map((item) => [
        `"${item.orderId}"`,
        `"${item.farmerId}"`,
        `"${item.farmerName || 'N/A'}"`,
        `"${item.farmerState || 'N/A'}"`,
        `"${item.farmerDistrict || 'N/A'}"`,
        `"${item.farmerTaluk || 'N/A'}"`,
        `"${item.traderName}"`,
        `"${item.traderState || 'N/A'}"`,
        `"${item.traderDistrict || 'N/A'}"`,
        `"${item.traderTaluk || 'N/A'}"`,
        `"${formatStatus(item.transporterStatus)}"`,
        `"${item.transporterDetails?.transporterName || 'N/A'}"`,
        `"${item.transporterDetails?.vehicleNumber || 'N/A'}"`,
        `"${new Date(item.createdAt).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `shipment-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Shipment Report", 14, 16);
    
    const tableColumn = [
      "Order ID", "Farmer ID", "Farmer State", "Farmer District",
      "Trader", "Trader State", "Trader District", "Status", 
      "Transporter", "Vehicle", "Created Date"
    ];
    const tableRows: any = allShipmentData.map((item) => [
      item.orderId,
      item.farmerId,
      item.farmerState || 'N/A',
      item.farmerDistrict || 'N/A',
      item.traderName,
      item.traderState || 'N/A',
      item.traderDistrict || 'N/A',
      formatStatus(item.transporterStatus),
      item.transporterDetails?.transporterName || 'N/A',
      item.transporterDetails?.vehicleNumber || 'N/A',
      new Date(item.createdAt).toLocaleDateString()
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`shipment-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipment Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4CAF50; color: white; padding: 12px; text-align: left; font-size: 12px; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-accepted { background-color: #d1fae5; color: #065f46; }
          .status-completed { background-color: #10b981; color: white; }
          .location-info { font-size: 0.85em; color: #666; }
          .farmer-location { color: #059669; }
          .trader-location { color: #2563eb; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Shipment Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Farmer ID</th>
              <th>Farmer Location</th>
              <th>Trader</th>
              <th>Trader Location</th>
              <th>Status</th>
              <th>Transporter</th>
              <th>Vehicle</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${allShipmentData.map((item) => {
              const statusClass = `status-${item.transporterStatus}`;
              const farmerLocation = item.farmerState ? 
                `<div>${item.farmerDistrict || 'N/A'}, ${item.farmerState}</div>
                 ${item.farmerTaluk ? `<div class="location-info farmer-location">Taluk: ${item.farmerTaluk}</div>` : ''}` : 
                'N/A';
              
              const traderLocation = item.traderState ? 
                `<div>${item.traderDistrict || 'N/A'}, ${item.traderState}</div>
                 ${item.traderTaluk ? `<div class="location-info trader-location">Taluk: ${item.traderTaluk}</div>` : ''}` : 
                'N/A';
              
              return `
                <tr>
                  <td>${item.orderId}</td>
                  <td>${item.farmerId}</td>
                  <td>${farmerLocation}</td>
                  <td>${item.traderName}</td>
                  <td>${traderLocation}</td>
                  <td class="${statusClass}">${formatStatus(item.transporterStatus)}</td>
                  <td>${item.transporterDetails?.transporterName || 'N/A'}</td>
                  <td>${item.transporterDetails?.vehicleNumber || 'N/A'}</td>
                  <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
    toast.success("Printing shipment report...");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format boolean to Yes/No
  const formatBoolean = (value?: boolean) => {
    return value ? 'Yes' : 'No';
  };

  // Format location display
  const formatLocation = (state: string, district: string, taluk: string) => {
    if (!state && !district) return 'N/A';
    
    let location = '';
    if (district) location += district;
    if (state) location += location ? `, ${state}` : state;
    if (taluk) location += ` (${taluk})`;
    
    return location || 'N/A';
  };

  // Open details dialog
  const openDetailsDialog = (item: TransporterDetail) => {
    setCurrentItem(item);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setDateRangeFilter({ start: '', end: '' });
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    fetchShipmentData();
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchShipmentData();
  };

  // Calculate stats
  const calculateStats = () => {
    const totalShipments = allShipmentData.length;
    const completedShipments = allShipmentData.filter(item => item.transporterStatus === 'completed').length;
    const pendingShipments = allShipmentData.filter(item => item.transporterStatus === 'pending').length;
    const acceptedShipments = allShipmentData.filter(item => item.transporterStatus === 'accepted').length;
    const completionRate = totalShipments > 0 ? Math.round((completedShipments / totalShipments) * 100) : 0;
    
    // Calculate unique states
    const uniqueFarmerStates = new Set(allShipmentData.map(item => item.farmerState).filter(Boolean)).size;
    const uniqueTraderStates = new Set(allShipmentData.map(item => item.traderState).filter(Boolean)).size;
    
    // Calculate complete location info
    const completeFarmerLocations = allShipmentData.filter(item => 
      item.farmerState && item.farmerDistrict && item.farmerTaluk
    ).length;
    
    const completeTraderLocations = allShipmentData.filter(item => 
      item.traderState && item.traderDistrict && item.traderTaluk
    ).length;
    
    return { 
      totalShipments, 
      completedShipments, 
      pendingShipments, 
      acceptedShipments, 
      completionRate,
      uniqueFarmerStates,
      uniqueTraderStates,
      completeFarmerLocations,
      completeTraderLocations
    };
  };

  const { 
    totalShipments, 
    completedShipments, 
    pendingShipments, 
    acceptedShipments, 
    completionRate,
    uniqueFarmerStates,
    uniqueTraderStates,
    completeFarmerLocations,
    completeTraderLocations
  } = calculateStats();
  
  const { startItem, endItem } = getPaginationRange();

  if (loading && allShipmentData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="lg:mb-0 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaTruck className="text-green-600" />
          Shipment Report
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage transporter details and shipment status</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy to clipboard", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Export to Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "Export to CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "Export to PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print report", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-3">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, title: "Copy", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, title: "Excel", color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, title: "CSV", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, title: "PDF", color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, title: "Print", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[50px]`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-3">
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
            </div>
            <FaTruck className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{acceptedShipments}</p>
            </div>
            <FaCheckCircle className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingShipments}</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedShipments}</p>
            </div>
            <FaChartLine className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Farmer States</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueFarmerStates}</p>
              <p className="text-xs text-gray-500 mt-1">{completeFarmerLocations} complete</p>
            </div>
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Trader States</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueTraderStates}</p>
              <p className="text-xs text-gray-500 mt-1">{completeTraderLocations} complete</p>
            </div>
            <FaBuilding className="text-indigo-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Complete Farmer Loc</p>
              <p className="text-2xl font-bold text-gray-900">{completeFarmerLocations}</p>
              <p className="text-xs text-gray-500 mt-1">${totalShipments > 0 ? Math.round((completeFarmerLocations/totalShipments)*100) : 0}%</p>
            </div>
            <FaUser className="text-teal-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Complete Trader Loc</p>
              <p className="text-2xl font-bold text-gray-900">{completeTraderLocations}</p>
              <p className="text-xs text-gray-500 mt-1">${totalShipments > 0 ? Math.round((completeTraderLocations/totalShipments)*100) : 0}%</p>
            </div>
            <FaWarehouse className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Search */}
          <div className="col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Search order, farmer, trader..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTags className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Date Range - Start Date */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={dateRangeFilter.start}
              onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
              placeholder="From Date"
            />
          </div>

          {/* Date Range - End Date */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={dateRangeFilter.end}
              onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
              placeholder="To Date"
            />
          </div>

          {/* Sorting Selector */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="orderId">Sort by Order ID</option>
              <option value="traderName">Sort by Trader Name</option>
              <option value="transporterStatus">Sort by Status</option>
              <option value="farmerState">Sort by Farmer State</option>
              <option value="traderState">Sort by Trader State</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${
                sortOrder === 'asc' 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
              title={sortOrder === 'asc' ? 'Ascending order' : 'Descending order'}
            >
              {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 col-span-2 md:col-span-1">
            <button
              onClick={applyFilters}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <FaSearch />
              Search
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              <FaSync />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderId')}
                >
                  Order ID {getSortIcon('orderId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('farmerId')}
                >
                  Farmer Details {getSortIcon('farmerId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('farmerState')}
                >
                  Farmer Location {getSortIcon('farmerState')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('traderName')}
                >
                  Trader Details {getSortIcon('traderName')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('traderState')}
                >
                  Trader Location {getSortIcon('traderState')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('transporterStatus')}
                >
                  Status {getSortIcon('transporterStatus')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('transporterDetails.transporterName')}
                >
                  Transporter {getSortIcon('transporterDetails.transporterName')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  Created Date {getSortIcon('createdAt')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.map((item, index) => (
                <tr key={`${item.orderId}-${item.farmerId}-${index}`} className="hover:bg-gray-50 transition-colors">
                  {/* Order ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{item.orderId}</div>
                  </td>

                  {/* Farmer Details */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FaUser className="text-green-500 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.farmerId}
                        </div>
                        {item.farmerName && (
                          <div className="text-xs text-gray-500">
                            {item.farmerName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Farmer Location */}
                  <td className="px-4 py-3">
                    {(item.farmerState || item.farmerDistrict || item.farmerTaluk) ? (
                      <div className="text-sm">
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-red-400 mr-2 mt-0.5 flex-shrink-0" size={12} />
                          <div>
                            {item.farmerDistrict && (
                              <div className="font-medium text-gray-900">{item.farmerDistrict}</div>
                            )}
                            <div className="text-xs text-gray-600">
                              {item.farmerState && <span>{item.farmerState}</span>}
                              {item.farmerTaluk && item.farmerState && <span>, </span>}
                              {item.farmerTaluk && <span>{item.farmerTaluk}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">No location</div>
                    )}
                  </td>

                  {/* Trader Details */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FaBuilding className="text-blue-500 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.traderName}</div>
                        <div className="text-xs text-gray-500">ID: {item.traderId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Trader Location */}
                  <td className="px-4 py-3">
                    {(item.traderState || item.traderDistrict || item.traderTaluk) ? (
                      <div className="text-sm">
                        <div className="flex items-start">
                          <FaGlobeAsia className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={12} />
                          <div>
                            {item.traderDistrict && (
                              <div className="font-medium text-gray-900">{item.traderDistrict}</div>
                            )}
                            <div className="text-xs text-gray-600">
                              {item.traderState && <span>{item.traderState}</span>}
                              {item.traderTaluk && item.traderState && <span>, </span>}
                              {item.traderTaluk && <span>{item.traderTaluk}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">No location</div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.transporterStatus)}`}>
                      {formatStatus(item.transporterStatus)}
                    </span>
                  </td>

                  {/* Transporter Details */}
                  <td className="px-4 py-3">
                    {item.transporterDetails ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <FaTruck className="inline mr-1 text-gray-400" />
                          {item.transporterDetails.transporterName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.transporterDetails.vehicleNumber || 'No vehicle'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Not assigned</div>
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openDetailsDialog(item)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Data State */}
        {displayedData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <FaTruck />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipment data found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-4">
        {displayedData.map((item, index) => (
          <div key={`${item.orderId}-${item.farmerId}-${index}`} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-blue-600">{item.orderId}</div>
                <div className="text-sm text-gray-500">
                  Farmer: {item.farmerId}
                  {item.farmerName && <span> ({item.farmerName})</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDetailsDialog(item)}
                  className="text-blue-600 p-1"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => setExpandedItem(
                    expandedItem === `${item.orderId}-${item.farmerId}` 
                      ? null 
                      : `${item.orderId}-${item.farmerId}`
                  )}
                  className="text-gray-500 p-1"
                  title={expandedItem === `${item.orderId}-${item.farmerId}` ? "Collapse" : "Expand"}
                >
                  {expandedItem === `${item.orderId}-${item.farmerId}` ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Trader</div>
                <div className="text-sm font-medium">{item.traderName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.transporterStatus)}`}>
                  {formatStatus(item.transporterStatus)}
                </span>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Farmer Location */}
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <div className="text-xs text-gray-500 flex items-center mb-1">
                  <FaUser className="mr-1 text-green-500" size={10} />
                  Farmer Location
                </div>
                <div className="text-sm">
                  {item.farmerDistrict && (
                    <div className="font-medium text-gray-900">{item.farmerDistrict}</div>
                  )}
                  <div className="text-xs text-gray-600">
                    {item.farmerState && <span>{item.farmerState}</span>}
                    {item.farmerTaluk && item.farmerState && <span>, </span>}
                    {item.farmerTaluk && <span>{item.farmerTaluk}</span>}
                    {!item.farmerState && !item.farmerDistrict && !item.farmerTaluk && (
                      <span className="text-gray-400 italic">No location</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Trader Location */}
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <div className="text-xs text-gray-500 flex items-center mb-1">
                  <FaBuilding className="mr-1 text-blue-500" size={10} />
                  Trader Location
                </div>
                <div className="text-sm">
                  {item.traderDistrict && (
                    <div className="font-medium text-gray-900">{item.traderDistrict}</div>
                  )}
                  <div className="text-xs text-gray-600">
                    {item.traderState && <span>{item.traderState}</span>}
                    {item.traderTaluk && item.traderState && <span>, </span>}
                    {item.traderTaluk && <span>{item.traderTaluk}</span>}
                    {!item.traderState && !item.traderDistrict && !item.traderTaluk && (
                      <span className="text-gray-400 italic">No location</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transporter and Date */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Transporter</div>
                <div className="text-sm font-medium">
                  {item.transporterDetails?.transporterName || 'Not assigned'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Created</div>
                <div className="text-sm">{formatDate(item.createdAt)}</div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItem === `${item.orderId}-${item.farmerId}` && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                {item.transporterDetails && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500">Vehicle Number</div>
                        <div className="text-sm font-medium">
                          {item.transporterDetails.vehicleNumber || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Driver Name</div>
                        <div className="text-sm">{item.transporterDetails.driverName || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Transporter Reached</div>
                        <div className="text-sm">{formatBoolean(item.transporterDetails.transporterReached)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Goods Condition</div>
                        <div className="text-sm">{formatBoolean(item.transporterDetails.goodsConditionCorrect)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500">Quantity Verified</div>
                        <div className="text-sm">{formatBoolean(item.transporterDetails.quantityCorrect)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Verified By</div>
                        <div className="text-sm">{item.transporterDetails.verifiedByName || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Verified At</div>
                      <div className="text-sm">
                        {item.transporterDetails.verifiedAt 
                          ? formatDateTime(item.transporterDetails.verifiedAt)
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </>
                )}
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-500">Trader ID</div>
                  <div className="text-sm font-medium">{item.traderId}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination and Limit Controls */}
      {displayedData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing {startItem} to {endItem} of {totalItems} records
            </div>
            <FormControl size="small" className="min-w-[120px]">
              <InputLabel id="items-per-page-label">Show</InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                label="Show"
                onChange={handleItemsPerPageChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="small"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                Shipment Details: {currentItem?.orderId}
              </h2>
              <p className="text-gray-600">Complete shipment and transporter information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentItem && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaReceipt className="text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{currentItem.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created Date:</span>
                      <span className="font-medium">{formatDateTime(currentItem.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.transporterStatus)}`}>
                        {formatStatus(currentItem.transporterStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    Parties Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Farmer ID:</span>
                      <span className="font-medium">
                        {currentItem.farmerId}
                        {currentItem.farmerName && <span className="ml-1 text-gray-500">({currentItem.farmerName})</span>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trader:</span>
                      <span className="font-medium">{currentItem.traderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trader ID:</span>
                      <span className="font-medium">{currentItem.traderId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Farmer Location */}
                  <div className="bg-white p-4 rounded border border-green-100">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                      <FaUser className="text-green-600" />
                      Farmer Location
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">{currentItem.farmerState || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{currentItem.farmerDistrict || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taluk:</span>
                        <span className="font-medium">{currentItem.farmerTaluk || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trader Location */}
                  <div className="bg-white p-4 rounded border border-blue-100">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-700">
                      <FaBuilding className="text-blue-600" />
                      Trader Location
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">{currentItem.traderState || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{currentItem.traderDistrict || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taluk:</span>
                        <span className="font-medium">{currentItem.traderTaluk || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transporter Details */}
              {currentItem.transporterDetails ? (
                <>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaTruck className="text-purple-600" />
                      Transporter Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded border">
                        <div className="text-gray-600 text-sm mb-1">Transporter Name</div>
                        <div className="font-bold text-lg text-gray-900">
                          {currentItem.transporterDetails.transporterName || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded border border-blue-200">
                        <div className="text-gray-600 text-sm mb-1">Vehicle Number</div>
                        <div className="font-bold text-lg text-blue-700">
                          {currentItem.transporterDetails.vehicleNumber || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded border border-green-200">
                        <div className="text-gray-600 text-sm mb-1">Driver Name</div>
                        <div className="font-bold text-lg text-green-700">
                          {currentItem.transporterDetails.driverName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaClipboardCheck className="text-orange-600" />
                      Verification Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`text-center p-4 rounded border ${
                        currentItem.transporterDetails.transporterReached 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}>
                        <div className="text-gray-600 text-sm mb-1">Transporter Reached</div>
                        <div className={`font-bold text-lg ${
                          currentItem.transporterDetails.transporterReached 
                            ? 'text-green-700' 
                            : 'text-gray-700'
                        }`}>
                          {formatBoolean(currentItem.transporterDetails.transporterReached)}
                        </div>
                      </div>
                      <div className={`text-center p-4 rounded border ${
                        currentItem.transporterDetails.goodsConditionCorrect 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="text-gray-600 text-sm mb-1">Goods Condition</div>
                        <div className={`font-bold text-lg ${
                          currentItem.transporterDetails.goodsConditionCorrect 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {formatBoolean(currentItem.transporterDetails.goodsConditionCorrect)}
                        </div>
                      </div>
                      <div className={`text-center p-4 rounded border ${
                        currentItem.transporterDetails.quantityCorrect 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="text-gray-600 text-sm mb-1">Quantity Verified</div>
                        <div className={`font-bold text-lg ${
                          currentItem.transporterDetails.quantityCorrect 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {formatBoolean(currentItem.transporterDetails.quantityCorrect)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Verified By</div>
                        <div className="font-medium text-lg">
                          {currentItem.transporterDetails.verifiedByName || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Verified At</div>
                        <div className="font-medium text-lg">
                          {currentItem.transporterDetails.verifiedAt 
                            ? formatDateTime(currentItem.transporterDetails.verifiedAt)
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                    <FaClock className="text-yellow-600" />
                    Transporter Not Assigned
                  </h3>
                  <p className="text-yellow-700">
                    No transporter has been assigned to this shipment yet. The shipment is currently pending.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dialog Footer */}
          <div className="mt-6 pt-6 border-t flex justify-end gap-3">
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShipmentReport;