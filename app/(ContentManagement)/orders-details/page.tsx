


// "use client"

// import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';

// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaSearch,
//   FaFilter,
//   FaBox,
//   FaUser,
//   FaShoppingCart,
//   FaCalendarAlt,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaFileAlt,
//   FaBoxes,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaCreditCard,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaReceipt,
//   FaClipboardList,
//   FaGlobe,
//   FaCity,
//   FaMapPin,
//   FaTruck,
//   FaUserTie,
//   FaUserFriends,
//   FaShippingFast
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces
// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile: string;
//   vehicleNumber: string;
//   vehicleType: string;
//   driverName: string;
//   pickupLocation: string;
//   deliveryLocation: string;
//   estimatedPickupDate?: string;
//   estimatedDeliveryDate?: string;
//   actualPickupDate?: string;
//   actualDeliveryDate?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   farmerId: string;
//   farmerName?: string;
//   transporterDetails?: TransporterDetails;
//   orderStatus: 'pending' | 'processing' | 'in_transit' | 'completed' | 'cancelled';
//   createdAt: string;
//   updatedAt: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Order[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
//   error?: string;
//   message?: string;
// }

// const OrdersReport: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
//     const[data,setData]=useState<{
//       taluka:string,
//       role:string
//     }>()
  
//   // Filter states
//   const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
//   const [orderIdFilter, setOrderIdFilter] = useState<string>('');
//   const [traderIdFilter, setTraderIdFilter] = useState<string>('');
//   const [farmerIdFilter, setFarmerIdFilter] = useState<string>('');
//   const [transporterIdFilter, setTransporterIdFilter] = useState<string>('');
  
//   // Sorting states
//   const [sortField, setSortField] = useState<string>('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItemsState, setTotalItemsState] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
//   // Mobile view state
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

//   const API_BASE ='/api';
//   const tableRef = useRef<HTMLDivElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Fetch orders with server-side pagination and sorting
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (orderStatusFilter) params.append('orderStatus', orderStatusFilter);
//     if (orderIdFilter) params.append('orderId', orderIdFilter);
//     if (traderIdFilter) params.append('traderId', traderIdFilter);
//     if (farmerIdFilter) params.append('farmerId', farmerIdFilter);
//     if (transporterIdFilter) params.append('transporterId', transporterIdFilter);
//     params.append('page', currentPage.toString());
//     params.append('limit', itemsPerPage.toString());
//     params.append('sortBy', sortField);
//     params.append('order', sortOrder);

//     const session = await getAdminSessionAction();
//           setData(session?.admin)
//           if(session?.admin?.role == "subadmin"){
//            params.append('taluk', session?.admin.taluka);
//           }

//     try {
//       const response = await axios.get(`${API_BASE}/orders-details?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
//         setOrders(data);
//         setTotalItemsState(response.data.pagination?.total || data.length);
//         setTotalPages(response.data.pagination?.totalPages || 1);
        
//         // For export functionality, fetch all data without pagination but with sorting
//         const exportParams = new URLSearchParams();
//         if (searchInput) exportParams.append('search', searchInput);
//         if (orderStatusFilter) exportParams.append('orderStatus', orderStatusFilter);
//         if (orderIdFilter) exportParams.append('orderId', orderIdFilter);
//         if (traderIdFilter) exportParams.append('traderId', traderIdFilter);
//         if (farmerIdFilter) exportParams.append('farmerId', farmerIdFilter);
//         if (transporterIdFilter) exportParams.append('transporterId', transporterIdFilter);
//         exportParams.append('limit', '10000'); // Large limit for all data
//         exportParams.append('sortBy', sortField);
//         exportParams.append('order', sortOrder);
        
//         const exportResponse = await axios.get(`${API_BASE}/orders-details?${exportParams.toString()}`);
//         if (exportResponse.data.success) {
//           setAllOrders(exportResponse.data.data || []);
//         } else {
//           // Fallback to current data if export fails
//           setAllOrders(data);
//         }
//       } else {
//         toast.error(response.data.error || 'Failed to fetch orders');
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE, searchInput, orderStatusFilter, orderIdFilter, traderIdFilter, farmerIdFilter, transporterIdFilter, currentPage, itemsPerPage, sortField, sortOrder]);

//   // Initial data fetch
//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // Debounced search
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       if (searchInput !== '' || traderIdFilter !== '' || orderIdFilter !== '') {
//         setCurrentPage(1);
//         fetchOrders();
//       }
//     }, 500); // 500ms delay

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput, traderIdFilter, orderIdFilter]);

//   // Get unique traders for filter dropdown
//   const getUniqueTraders = useMemo(() => {
//     const traders = allOrders
//       .map(order => ({ id: order.traderId, name: order.traderName }))
//       .filter((trader, index, self) => 
//         trader.id && 
//         trader.id.trim() !== '' && 
//         index === self.findIndex(t => t.id === trader.id)
//       );
//     return traders.sort((a, b) => a.name.localeCompare(b.name));
//   }, [allOrders]);

//   // Get unique transporters for filter dropdown
//   const getUniqueTransporters = useMemo(() => {
//     const transporters = allOrders
//       .map(order => order.transporterDetails?.transporterId)
//       .filter(transporterId => transporterId && transporterId.trim() !== '');
//     return [...new Set(transporters)].sort();
//   }, [allOrders]);

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
//       return <FaSearch className="inline ml-1 text-gray-400" />;
//     }
//     return sortOrder === 'asc' 
//       ? <FaChevronUp className="inline ml-1 text-blue-600" /> 
//       : <FaChevronDown className="inline ml-1 text-blue-600" />;
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
//     const endItem = Math.min(currentPage * itemsPerPage, totalItemsState);
//     return { startItem, endItem };
//   };

//   // Export functions
//   const handleCopyToClipboard = async () => {
//     const headers = ["Order ID", "Trader ID", "Trader Name", "Farmer ID", "Farmer Name", "Transporter ID", "Transporter Name", "Vehicle Number", "Order Status", "Created At"];
    
//     const csvContent = [
//       headers.join("\t"),
//       ...allOrders.map((order) => {
//         return [
//           order.orderId || '',
//           order.traderId || '',
//           order.traderName || '',
//           order.farmerId || '',
//           order.farmerName || 'N/A',
//           order.transporterDetails?.transporterId || 'N/A',
//           order.transporterDetails?.transporterName || 'N/A',
//           order.transporterDetails?.vehicleNumber || 'N/A',
//           order.orderStatus || '',
//           new Date(order.createdAt).toLocaleDateString()
//         ].join("\t");
//       })
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(csvContent);
//       toast.success("Data copied to clipboard!");
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = () => {
//     const data = allOrders.map((order) => {
//       return {
//         "Order ID": order.orderId,
//         "Trader ID": order.traderId,
//         "Trader Name": order.traderName,
//         "Farmer ID": order.farmerId,
//         "Farmer Name": order.farmerName || 'N/A',
//         "Transporter ID": order.transporterDetails?.transporterId || 'N/A',
//         "Transporter Name": order.transporterDetails?.transporterName || 'N/A',
//         "Transporter Mobile": order.transporterDetails?.transporterMobile || 'N/A',
//         "Vehicle Number": order.transporterDetails?.vehicleNumber || 'N/A',
//         "Vehicle Type": order.transporterDetails?.vehicleType || 'N/A',
//         "Driver Name": order.transporterDetails?.driverName || 'N/A',
//         "Pickup Location": order.transporterDetails?.pickupLocation || 'N/A',
//         "Delivery Location": order.transporterDetails?.deliveryLocation || 'N/A',
//         "Order Status": order.orderStatus,
//         "Created At": new Date(order.createdAt).toLocaleString(),
//         "Updated At": new Date(order.updatedAt).toLocaleString(),
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Orders Report");
//     writeFile(wb, `orders-report-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Trader Name", "Farmer Name", "Transporter Name", "Vehicle Number", "Order Status", "Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allOrders.map((order) => {
//         return [
//           `"${order.orderId}"`,
//           `"${order.traderName}"`,
//           `"${order.farmerName || 'N/A'}"`,
//           `"${order.transporterDetails?.transporterName || 'N/A'}"`,
//           `"${order.transporterDetails?.vehicleNumber || 'N/A'}"`,
//           `"${order.orderStatus}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF('landscape');
//     doc.text("Orders Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Trader", "Farmer", "Transporter", "Vehicle", "Status", "Date"];
//     const tableRows: any = allOrders.map((order) => {
//       return [
//         order.orderId,
//         order.traderName,
//         order.farmerName || 'N/A',
//         order.transporterDetails?.transporterName || 'N/A',
//         order.transporterDetails?.vehicleNumber || 'N/A',
//         order.orderStatus,
//         new Date(order.createdAt).toLocaleDateString()
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });
    
//     doc.save(`orders-report-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Orders Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-processing { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-in_transit { background-color: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-completed { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-cancelled { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Orders Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
//         <p>Total Orders: ${allOrders.length}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Trader</th>
//               <th>Farmer</th>
//               <th>Transporter</th>
//               <th>Vehicle</th>
//               <th>Order Status</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allOrders.map((order) => {
//               const statusClass = `status-${order.orderStatus}`;
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${order.traderName}<br><small>ID: ${order.traderId}</small></td>
//                   <td>${order.farmerName || 'N/A'}<br><small>ID: ${order.farmerId}</small></td>
//                   <td>${order.transporterDetails?.transporterName || 'N/A'}<br><small>ID: ${order.transporterDetails?.transporterId || 'N/A'}</small></td>
//                   <td>${order.transporterDetails?.vehicleNumber || 'N/A'}</td>
//                   <td><span class="${statusClass}">${order.orderStatus.toUpperCase()}</span></td>
//                   <td>${new Date(order.createdAt).toLocaleDateString()}</td>
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
//     toast.success("Printing orders report...");
//   };

//   // Order status badge colors
//   const getOrderStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'processing':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'in_transit':
//         return 'bg-indigo-100 text-indigo-800 border-indigo-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format status text
//   const formatStatus = (status: string) => {
//     return status.replace(/\b\w/g, l => l.toUpperCase()).replace('_', ' ');
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format date time
//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Open details dialog
//   const openDetailsDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setOrderStatusFilter('');
//     setOrderIdFilter('');
//     setTraderIdFilter('');
//     setFarmerIdFilter('');
//     setTransporterIdFilter('');
//     setSortField('createdAt');
//     setSortOrder('desc');
//     setCurrentPage(1);
//   };

//   // Apply search and filters
//   const applyFilters = () => {
//     setCurrentPage(1);
//     fetchOrders();
//   };

//   // Calculate stats
//   const calculateStats = () => {
//     const totalOrders = allOrders.length;
//     const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending').length;
//     const inTransitOrders = allOrders.filter(o => o.orderStatus === 'in_transit').length;
//     const completedOrders = allOrders.filter(o => o.orderStatus === 'completed').length;
//     const cancelledOrders = allOrders.filter(o => o.orderStatus === 'cancelled').length;
//     const transporterAssigned = allOrders.filter(o => o.transporterDetails).length;
    
//     return { totalOrders, pendingOrders, inTransitOrders, completedOrders, cancelledOrders, transporterAssigned };
//   };

//   const { totalOrders, pendingOrders, inTransitOrders, completedOrders, cancelledOrders, transporterAssigned } = calculateStats();
//   const { startItem, endItem } = getPaginationRange();

//   if (loading && orders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaShoppingCart className="text-blue-600" />
//           Orders Report
//         </h1>
//         <p className="text-gray-600 mt-1">Track trader-farmer orders with transporter details and order status</p>
//       </div>

//       {/* Export Buttons - Desktop */}
//       <div className="hidden lg:flex justify-end flex-wrap gap-2 mb-4">
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
//             className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium text-sm`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//             <span className="hidden sm:inline">{btn.label}</span>
//           </button>
//         ))}
//       </div>

//       {/* Export Buttons - Mobile */}
//       <div className="lg:hidden flex flex-wrap gap-2 mb-4">
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
//             className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
//             title={btn.title}
//           >
//             <btn.icon className="text-lg" />
//           </button>
//         ))}
//       </div>
//  {
//         data?.role=="admin"&&<>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Orders</p>
//               <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
//             </div>
//             <FaShoppingCart className="text-blue-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Pending</p>
//               <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
//             </div>
//             <FaClipboardList className="text-yellow-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-indigo-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">In Transit</p>
//               <p className="text-xl font-bold text-gray-900">{inTransitOrders}</p>
//             </div>
//             <FaTruck className="text-indigo-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Completed</p>
//               <p className="text-xl font-bold text-gray-900">{completedOrders}</p>
//             </div>
//             <FaCheckCircle className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Cancelled</p>
//               <p className="text-xl font-bold text-gray-900">{cancelledOrders}</p>
//             </div>
//             <FaTimesCircle className="text-red-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">With Transporters</p>
//               <p className="text-xl font-bold text-gray-900">{transporterAssigned}</p>
//             </div>
//             <FaShippingFast className="text-purple-500 text-xl" />
//           </div>
//         </div>
//       </div>
// </>}

//       {/* Filters Section */}
//       <div className="bg-white rounded-lg shadow mb-4 p-3">
//         <div className="flex items-center gap-2 mb-3">
//           <FaFilter className="text-gray-500" />
//           <h3 className="text-sm font-medium text-gray-700">Filters</h3>
//         </div>
        
//         {/* Main Filters Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
//           {/* Search */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="Search by trader name, order ID..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </div>

//           {/* Order ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaReceipt className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="Order ID"
//               value={orderIdFilter}
//               onChange={(e) => setOrderIdFilter(e.target.value)}
//             />
//           </div>

//           {/* Order Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaClipboardList className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={orderStatusFilter}
//               onChange={(e) => setOrderStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="in_transit">In Transit</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Trader ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserTie className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={traderIdFilter}
//               onChange={(e) => setTraderIdFilter(e.target.value)}
//             >
//               <option value="">All Traders</option>
//               {getUniqueTraders.map((trader) => (
//                 <option key={trader.id} value={trader.id}>
//                   {trader.name} ({trader.id})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Farmer ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserFriends className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="Farmer ID"
//               value={farmerIdFilter}
//               onChange={(e) => setFarmerIdFilter(e.target.value)}
//             />
//           </div>

//           {/* Transporter ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaTruck className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={transporterIdFilter}
//               onChange={(e) => setTransporterIdFilter(e.target.value)}
//             >
//               <option value="">All Transporters</option>
//               {getUniqueTransporters.map((transporterId) => (
//                 <option key={transporterId} value={transporterId}>
//                   {transporterId}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={applyFilters}
//             className="w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
//           >
//             <FaSearch />
//             Apply Filters
//           </button>
//           <button
//             onClick={resetFilters}
//             className="w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
//           >
//             <FaSync />
//             Reset All
//           </button>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden" ref={tableRef}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('orderId')}
//                 >
//                   Order ID {getSortIcon('orderId')}
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('traderName')}
//                 >
//                   Trader Details {getSortIcon('traderName')}
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('farmerName')}
//                 >
//                   Farmer Details {getSortIcon('farmerName')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Transporter Details
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Order Status
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   Date {getSortIcon('createdAt')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                   {/* Order ID */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
//                     <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
//                   </td>

//                   {/* Trader Details */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaUserTie className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium text-gray-900 truncate">{order.traderName}</div>
//                         <div className="text-xs text-gray-500 truncate">{order.traderId}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Farmer Details */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaUserFriends className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium text-gray-900 truncate">{order.farmerName || 'N/A'}</div>
//                         <div className="text-xs text-gray-500 truncate">{order.farmerId}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Transporter Details */}
//                   <td className="px-4 py-3">
//                     {order.transporterDetails ? (
//                       <div className="flex items-center">
//                         <FaTruck className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium text-gray-900 truncate">{order.transporterDetails.transporterName}</div>
//                           <div className="text-xs text-gray-500 truncate whitespace-normal">
//                             {order.transporterDetails.vehicleNumber} ({order.transporterDetails.vehicleType})
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-xs text-gray-400">Not assigned</div>
//                     )}
//                   </td>

//                   {/* Order Status */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
//                       {formatStatus(order.orderStatus)}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</div>
//                         <div className="text-xs text-gray-500">{formatDate(order.updatedAt)}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Actions - View Details */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <button
//                       onClick={() => openDetailsDialog(order)}
//                       className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
//                       title="View Order Details"
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
//         {orders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-4xl mb-4">
//               <FaShoppingCart className="mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-3">
//         {orders.map((order) => (
//           <div key={order._id} className="bg-white rounded-lg shadow p-3">
//             <div className="flex justify-between items-start mb-3">
//               <div className="min-w-0 flex-1">
//                 <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
//                 <div className="text-xs text-gray-500 truncate">{formatDate(order.createdAt)}</div>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <button
//                   onClick={() => openDetailsDialog(order)}
//                   className="text-blue-600 p-1"
//                   title="View Details"
//                 >
//                   <FaEye />
//                 </button>
//                 <button
//                   onClick={() => setExpandedOrder(
//                     expandedOrder === order._id 
//                       ? null 
//                       : order._id
//                   )}
//                   className="text-gray-500 p-1"
//                   title={expandedOrder === order._id ? "Collapse" : "Expand"}
//                 >
//                   {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-2 mb-2">
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Trader</div>
//                 <div className="font-medium text-xs truncate">{order.traderName}</div>
//                 <div className="text-xs text-gray-500 truncate">ID: {order.traderId}</div>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Farmer</div>
//                 <div className="font-medium text-xs truncate">{order.farmerName || 'N/A'}</div>
//                 <div className="text-xs text-gray-500 truncate">ID: {order.farmerId}</div>
//               </div>
//             </div>

//             <div className="mb-2">
//               <div className="text-xs text-gray-500 mb-1">Transporter</div>
//               {order.transporterDetails ? (
//                 <div className="flex items-center gap-2">
//                   <FaTruck className="text-gray-400 text-xs" />
//                   <div className="text-xs font-medium truncate">{order.transporterDetails.transporterName}</div>
//                 </div>
//               ) : (
//                 <div className="text-xs text-gray-400">Not assigned</div>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-2 mb-2">
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Order Status</div>
//                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)} truncate`}>
//                   {formatStatus(order.orderStatus)}
//                 </span>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Updated</div>
//                 <div className="font-medium text-xs truncate">{formatDate(order.updatedAt)}</div>
//               </div>
//             </div>

//             {/* Expanded Content */}
//             {expandedOrder === order._id && (
//               <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
//                 {/* Transporter Details */}
//                 {order.transporterDetails && (
//                   <div>
//                     <div className="text-xs text-gray-500 mb-2">Transporter Details</div>
//                     <div className="space-y-2">
//                       <div className="grid grid-cols-2 gap-2">
//                         <div>
//                           <div className="text-xs text-gray-500">Name</div>
//                           <div className="text-xs font-medium">{order.transporterDetails.transporterName}</div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Mobile</div>
//                           <div className="text-xs font-medium">{order.transporterDetails.transporterMobile}</div>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2">
//                         <div>
//                           <div className="text-xs text-gray-500">Vehicle</div>
//                           <div className="text-xs font-medium">{order.transporterDetails.vehicleNumber}</div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Type</div>
//                           <div className="text-xs font-medium">{order.transporterDetails.vehicleType}</div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Driver</div>
//                         <div className="text-xs font-medium">{order.transporterDetails.driverName}</div>
//                       </div>
//                       {order.transporterDetails.pickupLocation && (
//                         <div>
//                           <div className="text-xs text-gray-500">Pickup Location</div>
//                           <div className="text-xs">{order.transporterDetails.pickupLocation}</div>
//                         </div>
//                       )}
//                       {order.transporterDetails.estimatedDeliveryDate && (
//                         <div>
//                           <div className="text-xs text-gray-500">Est. Delivery</div>
//                           <div className="text-xs font-medium">{formatDate(order.transporterDetails.estimatedDeliveryDate)}</div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {orders.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg shadow mt-4">
//           {/* Items per page selector */}
//           <div className="flex items-center gap-3">
//             <div className="text-xs text-gray-600">
//               Showing {startItem} to {endItem} of {totalItemsState} records
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

//           {/* Pagination component */}
//           <div className="flex flex-col sm:flex-row items-center gap-3">
//             <div className="text-xs text-gray-600">
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

//       {/* Order Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4 pb-3 border-b">
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
//                 <FaReceipt className="text-blue-600 flex-shrink-0" />
//                 <span className="truncate">Order Details: {currentOrder?.orderId}</span>
//               </h2>
//               <p className="text-gray-600 text-sm truncate">Complete order information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
//               title="Close"
//             >
//               <FaTimes size={20} />
//             </button>
//           </div>

//           {currentOrder && (
//             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
//               {/* Order Header */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaClipboardList className="text-blue-600" />
//                     Order Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Order ID:</span>
//                       <span className="font-medium text-sm">{currentOrder.orderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Order Status:</span>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(currentOrder.orderStatus)}`}>
//                         {formatStatus(currentOrder.orderStatus)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Created:</span>
//                       <span className="font-medium text-sm">{formatDateTime(currentOrder.createdAt)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Updated:</span>
//                       <span className="font-medium text-sm">{formatDateTime(currentOrder.updatedAt)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-green-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaUserTie className="text-green-600" />
//                     Trader Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader ID:</span>
//                       <span className="font-medium text-sm">{currentOrder.traderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader Name:</span>
//                       <span className="font-medium text-sm">{currentOrder.traderName}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Farmer Information */}
//               <div className="bg-gray-50 p-3 rounded">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaUserFriends className="text-purple-600" />
//                   Farmer Information
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 text-sm">Farmer ID:</span>
//                     <span className="font-medium text-sm">{currentOrder.farmerId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 text-sm">Farmer Name:</span>
//                     <span className="font-medium text-sm">{currentOrder.farmerName || 'N/A'}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Transporter Information */}
//               {currentOrder.transporterDetails && (
//                 <div className="bg-indigo-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaTruck className="text-indigo-600" />
//                     Transporter Details
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Transporter ID</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterId}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Transporter Name</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterName}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Mobile Number</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterMobile}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Vehicle Number</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.vehicleNumber}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Vehicle Type</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.vehicleType}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Driver Name</div>
//                         <div className="text-sm font-medium">{currentOrder.transporterDetails.driverName}</div>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Pickup Location</div>
//                         <div className="text-sm">{currentOrder.transporterDetails.pickupLocation}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500 mb-1">Delivery Location</div>
//                         <div className="text-sm">{currentOrder.transporterDetails.deliveryLocation}</div>
//                       </div>
//                     </div>
                    
//                     {(currentOrder.transporterDetails.estimatedPickupDate || currentOrder.transporterDetails.estimatedDeliveryDate) && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
//                         {currentOrder.transporterDetails.estimatedPickupDate && (
//                           <div>
//                             <div className="text-xs text-gray-500 mb-1">Estimated Pickup</div>
//                             <div className="text-sm font-medium">{formatDate(currentOrder.transporterDetails.estimatedPickupDate)}</div>
//                           </div>
//                         )}
//                         {currentOrder.transporterDetails.estimatedDeliveryDate && (
//                           <div>
//                             <div className="text-xs text-gray-500 mb-1">Estimated Delivery</div>
//                             <div className="text-sm font-medium">{formatDate(currentOrder.transporterDetails.estimatedDeliveryDate)}</div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dialog Footer */}
//           <div className="mt-4 pt-3 border-t flex justify-end">
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default OrdersReport;










"use client"

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

import autoTable from 'jspdf-autotable';
import {
  FaEye,
  FaSearch,
  FaFilter,
  FaBox,
  FaUser,
  FaShoppingCart,
  FaCalendarAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaCopy,
  FaTimes,
  FaFileAlt,
  FaBoxes,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaReceipt,
  FaClipboardList,
  FaGlobe,
  FaCity,
  FaMapPin,
  FaTruck,
  FaUserTie,
  FaUserFriends,
  FaShippingFast
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface TransporterDetails {
  transporterId: string;
  transporterName: string;
  transporterMobile: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  pickupLocation: string;
  deliveryLocation: string;
  estimatedPickupDate?: string;
  estimatedDeliveryDate?: string;
  actualPickupDate?: string;
  actualDeliveryDate?: string;
}

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
  traderName: string;
  farmerId: string;
  farmerName?: string;
  transporterDetails?: TransporterDetails;
  orderStatus: 'pending' | 'processing' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  // New fields from your API data
  farmerDetails?: {
    personalInfo: {
      state?: string;
      district?: string;
      taluk?: string;
      // other fields
    };
  };
  traderDetails?: {
    personalInfo: {
      state?: string;
      district?: string;
      taluk?: string;
      // other fields
    };
  };
}

interface ApiResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
  message?: string;
}

const OrdersReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
    const[data,setData]=useState<{
      taluka:string,
      role:string
    }>()
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
  const [orderIdFilter, setOrderIdFilter] = useState<string>('');
  const [traderIdFilter, setTraderIdFilter] = useState<string>('');
  const [farmerIdFilter, setFarmerIdFilter] = useState<string>('');
  const [transporterIdFilter, setTransporterIdFilter] = useState<string>('');
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItemsState, setTotalItemsState] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Mobile view state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const API_BASE ='/api';
  const tableRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch orders with server-side pagination and sorting
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (orderStatusFilter) params.append('orderStatus', orderStatusFilter);
    if (orderIdFilter) params.append('orderId', orderIdFilter);
    if (traderIdFilter) params.append('traderId', traderIdFilter);
    if (farmerIdFilter) params.append('farmerId', farmerIdFilter);
    if (transporterIdFilter) params.append('transporterId', transporterIdFilter);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    const session = await getAdminSessionAction();
          setData(session?.admin)
          if(session?.admin?.role == "subadmin"){
           params.append('taluk', session?.admin.taluka);
          }

    try {
      const response = await axios.get(`${API_BASE}/orders-details?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setOrders(data);
        setTotalItemsState(response.data.pagination?.total || data.length);
        setTotalPages(response.data.pagination?.totalPages || 1);
        
        // For export functionality, fetch all data without pagination but with sorting
        const exportParams = new URLSearchParams();
        if (searchInput) exportParams.append('search', searchInput);
        if (orderStatusFilter) exportParams.append('orderStatus', orderStatusFilter);
        if (orderIdFilter) exportParams.append('orderId', orderIdFilter);
        if (traderIdFilter) exportParams.append('traderId', traderIdFilter);
        if (farmerIdFilter) exportParams.append('farmerId', farmerIdFilter);
        if (transporterIdFilter) exportParams.append('transporterId', transporterIdFilter);
        exportParams.append('limit', '10000'); // Large limit for all data
        exportParams.append('sortBy', sortField);
        exportParams.append('order', sortOrder);
        
        const exportResponse = await axios.get(`${API_BASE}/orders-details?${exportParams.toString()}`);
        if (exportResponse.data.success) {
          setAllOrders(exportResponse.data.data || []);
        } else {
          // Fallback to current data if export fails
          setAllOrders(data);
        }
      } else {
        toast.error(response.data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, searchInput, orderStatusFilter, orderIdFilter, traderIdFilter, farmerIdFilter, transporterIdFilter, currentPage, itemsPerPage, sortField, sortOrder]);

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchInput !== '' || traderIdFilter !== '' || orderIdFilter !== '') {
        setCurrentPage(1);
        fetchOrders();
      }
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, traderIdFilter, orderIdFilter]);

  // Get unique traders for filter dropdown
  const getUniqueTraders = useMemo(() => {
    const traders = allOrders
      .map(order => ({ id: order.traderId, name: order.traderName }))
      .filter((trader, index, self) => 
        trader.id && 
        trader.id.trim() !== '' && 
        index === self.findIndex(t => t.id === trader.id)
      );
    return traders.sort((a, b) => a.name.localeCompare(b.name));
  }, [allOrders]);

  // Get unique transporters for filter dropdown
  const getUniqueTransporters = useMemo(() => {
    const transporters = allOrders
      .map(order => order.transporterDetails?.transporterId)
      .filter(transporterId => transporterId && transporterId.trim() !== '');
    return [...new Set(transporters)].sort();
  }, [allOrders]);

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
      return <FaSearch className="inline ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FaChevronUp className="inline ml-1 text-blue-600" /> 
      : <FaChevronDown className="inline ml-1 text-blue-600" />;
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
    const endItem = Math.min(currentPage * itemsPerPage, totalItemsState);
    return { startItem, endItem };
  };

  // Export functions
  const handleCopyToClipboard = async () => {
    const headers = ["Order ID", "Trader ID", "Trader Name", "Farmer ID", "Farmer Name", "Transporter ID", "Transporter Name", "Vehicle Number", "Order Status", "Created At"];
    
    const csvContent = [
      headers.join("\t"),
      ...allOrders.map((order) => {
        return [
          order.orderId || '',
          order.traderId || '',
          order.traderName || '',
          order.farmerId || '',
          order.farmerName || 'N/A',
          order.transporterDetails?.transporterId || 'N/A',
          order.transporterDetails?.transporterName || 'N/A',
          order.transporterDetails?.vehicleNumber || 'N/A',
          order.orderStatus || '',
          new Date(order.createdAt).toLocaleDateString()
        ].join("\t");
      })
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(csvContent);
      toast.success("Data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = allOrders.map((order) => {
      return {
        "Order ID": order.orderId,
        "Trader ID": order.traderId,
        "Trader Name": order.traderName,
        "Trader State": order.traderDetails?.personalInfo?.state || 'N/A',
        "Trader District": order.traderDetails?.personalInfo?.district || 'N/A',
        "Trader Taluk": order.traderDetails?.personalInfo?.taluk || 'N/A',
        "Farmer ID": order.farmerId,
        "Farmer Name": order.farmerName || 'N/A',
        "Farmer State": order.farmerDetails?.personalInfo?.state || 'N/A',
        "Farmer District": order.farmerDetails?.personalInfo?.district || 'N/A',
        "Farmer Taluk": order.farmerDetails?.personalInfo?.taluk || 'N/A',
        "Transporter ID": order.transporterDetails?.transporterId || 'N/A',
        "Transporter Name": order.transporterDetails?.transporterName || 'N/A',
        "Transporter Mobile": order.transporterDetails?.transporterMobile || 'N/A',
        "Vehicle Number": order.transporterDetails?.vehicleNumber || 'N/A',
        "Vehicle Type": order.transporterDetails?.vehicleType || 'N/A',
        "Driver Name": order.transporterDetails?.driverName || 'N/A',
        "Pickup Location": order.transporterDetails?.pickupLocation || 'N/A',
        "Delivery Location": order.transporterDetails?.deliveryLocation || 'N/A',
        "Order Status": order.orderStatus,
        "Created At": new Date(order.createdAt).toLocaleString(),
        "Updated At": new Date(order.updatedAt).toLocaleString(),
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders Report");
    writeFile(wb, `orders-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Trader Name", "Trader Location", "Farmer Name", "Farmer Location", "Transporter Name", "Vehicle Number", "Order Status", "Date"];
    
    const csvContent = [
      headers.join(","),
      ...allOrders.map((order) => {
        return [
          `"${order.orderId}"`,
          `"${order.traderName}"`,
          `"${order.traderDetails?.personalInfo?.district || 'N/A'}, ${order.traderDetails?.personalInfo?.state || 'N/A'}"`,
          `"${order.farmerName || 'N/A'}"`,
          `"${order.farmerDetails?.personalInfo?.district || 'N/A'}, ${order.farmerDetails?.personalInfo?.state || 'N/A'}"`,
          `"${order.transporterDetails?.transporterName || 'N/A'}"`,
          `"${order.transporterDetails?.vehicleNumber || 'N/A'}"`,
          `"${order.orderStatus}"`,
          `"${new Date(order.createdAt).toLocaleDateString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Orders Report", 14, 16);
    
    const tableColumn = ["Order ID", "Trader", "Trader Location", "Farmer", "Farmer Location", "Transporter", "Vehicle", "Status", "Date"];
    const tableRows: any = allOrders.map((order) => {
      return [
        order.orderId,
        order.traderName,
        `${order.traderDetails?.personalInfo?.district || 'N/A'}, ${order.traderDetails?.personalInfo?.state || 'N/A'}`,
        order.farmerName || 'N/A',
        `${order.farmerDetails?.personalInfo?.district || 'N/A'}, ${order.farmerDetails?.personalInfo?.state || 'N/A'}`,
        order.transporterDetails?.transporterName || 'N/A',
        order.transporterDetails?.vehicleNumber || 'N/A',
        order.orderStatus,
        new Date(order.createdAt).toLocaleDateString()
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`orders-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orders Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-processing { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-in_transit { background-color: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-completed { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-cancelled { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Orders Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Orders: ${allOrders.length}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Trader</th>
              <th>Trader Location</th>
              <th>Farmer</th>
              <th>Farmer Location</th>
              <th>Transporter</th>
              <th>Vehicle</th>
              <th>Order Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.map((order) => {
              const statusClass = `status-${order.orderStatus}`;
              return `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${order.traderName}<br><small>ID: ${order.traderId}</small></td>
                  <td>${order.traderDetails?.personalInfo?.district || 'N/A'}, ${order.traderDetails?.personalInfo?.state || 'N/A'}<br><small>Taluk: ${order.traderDetails?.personalInfo?.taluk || 'N/A'}</small></td>
                  <td>${order.farmerName || 'N/A'}<br><small>ID: ${order.farmerId}</small></td>
                  <td>${order.farmerDetails?.personalInfo?.district || 'N/A'}, ${order.farmerDetails?.personalInfo?.state || 'N/A'}<br><small>Taluk: ${order.farmerDetails?.personalInfo?.taluk || 'N/A'}</small></td>
                  <td>${order.transporterDetails?.transporterName || 'N/A'}<br><small>ID: ${order.transporterDetails?.transporterId || 'N/A'}</small></td>
                  <td>${order.transporterDetails?.vehicleNumber || 'N/A'}</td>
                  <td><span class="${statusClass}">${order.orderStatus.toUpperCase()}</span></td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
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
    toast.success("Printing orders report...");
  };

  // Order status badge colors
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace(/\b\w/g, l => l.toUpperCase()).replace('_', ' ');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open details dialog
  const openDetailsDialog = (order: Order) => {
    setCurrentOrder(order);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setOrderStatusFilter('');
    setOrderIdFilter('');
    setTraderIdFilter('');
    setFarmerIdFilter('');
    setTransporterIdFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  // Calculate stats
  const calculateStats = () => {
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending').length;
    const inTransitOrders = allOrders.filter(o => o.orderStatus === 'in_transit').length;
    const completedOrders = allOrders.filter(o => o.orderStatus === 'completed').length;
    const cancelledOrders = allOrders.filter(o => o.orderStatus === 'cancelled').length;
    const transporterAssigned = allOrders.filter(o => o.transporterDetails).length;
    
    return { totalOrders, pendingOrders, inTransitOrders, completedOrders, cancelledOrders, transporterAssigned };
  };

  const { totalOrders, pendingOrders, inTransitOrders, completedOrders, cancelledOrders, transporterAssigned } = calculateStats();
  const { startItem, endItem } = getPaginationRange();

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaShoppingCart className="text-blue-600" />
          Orders Report
        </h1>
        <p className="text-gray-600 mt-1">Track trader-farmer orders with transporter details and order status</p>
      </div>

      {/* Export Buttons - Desktop */}
      <div className="hidden lg:flex justify-end flex-wrap gap-2 mb-4">
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
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium text-sm`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Export Buttons - Mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-4">
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
            className={`flex items-center justify-center p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
            title={btn.title}
          >
            <btn.icon className="text-lg" />
          </button>
        ))}
      </div>
 {
        data?.role=="admin"&&<>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <FaShoppingCart className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Pending</p>
              <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <FaClipboardList className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">In Transit</p>
              <p className="text-xl font-bold text-gray-900">{inTransitOrders}</p>
            </div>
            <FaTruck className="text-indigo-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Completed</p>
              <p className="text-xl font-bold text-gray-900">{completedOrders}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Cancelled</p>
              <p className="text-xl font-bold text-gray-900">{cancelledOrders}</p>
            </div>
            <FaTimesCircle className="text-red-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">With Transporters</p>
              <p className="text-xl font-bold text-gray-900">{transporterAssigned}</p>
            </div>
            <FaShippingFast className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>
</>}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-4 p-3">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>
        
        {/* Main Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Search by trader name, order ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Order ID Filter */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaReceipt className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Order ID"
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
            />
          </div> */}

          {/* Order Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClipboardList className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Trader ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserTie className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={traderIdFilter}
              onChange={(e) => setTraderIdFilter(e.target.value)}
            >
              <option value="">All Traders</option>
              {getUniqueTraders.map((trader) => (
                <option key={trader.id} value={trader.id}>
                  {trader.name} ({trader.id})
                </option>
              ))}
            </select>
          </div>

          {/* Farmer ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserFriends className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="Farmer ID"
              value={farmerIdFilter}
              onChange={(e) => setFarmerIdFilter(e.target.value)}
            />
          </div>

          {/* Transporter ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTruck className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={transporterIdFilter}
              onChange={(e) => setTransporterIdFilter(e.target.value)}
            >
              <option value="">All Transporters</option>
              {getUniqueTransporters.map((transporterId) => (
                <option key={transporterId} value={transporterId}>
                  {transporterId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            <FaSearch />
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
          >
            <FaSync />
            Reset All
          </button>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('orderId')}
                >
                  Order ID {getSortIcon('orderId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('traderName')}
                >
                  Trader Details {getSortIcon('traderName')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('farmerName')}
                >
                  Farmer Details {getSortIcon('farmerName')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Transporter Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Order Status
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('createdAt')}
                >
                  Date {getSortIcon('createdAt')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  {/* Order ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
                    <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                  </td>

                  {/* Trader Details - Updated with location info */}
                  <td className="px-4 py-3">
                    <div className="flex items-start">
                      <FaUserTie className="text-gray-400 mr-2 flex-shrink-0 mt-1" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{order.traderName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {order.traderId}</div>
                        {order.traderDetails?.personalInfo && (
                          <div className="mt-1 text-xs text-gray-600">
                            <div className="flex flex-wrap gap-1">
                              {order.traderDetails.personalInfo.state && (
                                <span className="flex items-center">
                                  <FaGlobe className="mr-1" /> {order.traderDetails.personalInfo.state}
                                </span>
                              )}
                              {order.traderDetails.personalInfo.district && (
                                <span className="flex items-center">
                                  <FaCity className="mr-1" /> {order.traderDetails.personalInfo.district}
                                </span>
                              )}
                              {order.traderDetails.personalInfo.taluk && (
                                <span className="flex items-center">
                                  <FaMapPin className="mr-1" /> {order.traderDetails.personalInfo.taluk}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Farmer Details - Updated with location info */}
                  <td className="px-4 py-3">
                    <div className="flex items-start">
                      <FaUserFriends className="text-gray-400 mr-2 flex-shrink-0 mt-1" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{order.farmerName || 'N/A'}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {order.farmerId}</div>
                        {order.farmerDetails?.personalInfo && (
                          <div className="mt-1 text-xs text-gray-600">
                            <div className="flex flex-wrap gap-1">
                              {order.farmerDetails.personalInfo.state && (
                                <span className="flex items-center">
                                  <FaGlobe className="mr-1" /> {order.farmerDetails.personalInfo.state}
                                </span>
                              )}
                              {order.farmerDetails.personalInfo.district && (
                                <span className="flex items-center">
                                  <FaCity className="mr-1" /> {order.farmerDetails.personalInfo.district}
                                </span>
                              )}
                              {order.farmerDetails.personalInfo.taluk && (
                                <span className="flex items-center">
                                  <FaMapPin className="mr-1" /> {order.farmerDetails.personalInfo.taluk}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Transporter Details */}
                  <td className="px-4 py-3">
                    {order.transporterDetails ? (
                      <div className="flex items-start">
                        <FaTruck className="text-gray-400 mr-2 flex-shrink-0 mt-1" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{order.transporterDetails.transporterName}</div>
                          <div className="text-xs text-gray-500 truncate whitespace-normal">
                            {order.transporterDetails.vehicleNumber} ({order.transporterDetails.vehicleType})
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {order.transporterDetails.driverName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Not assigned</div>
                    )}
                  </td>

                  {/* Order Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
                      {formatStatus(order.orderStatus)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.updatedAt)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Actions - View Details */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openDetailsDialog(order)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="View Order Details"
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
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <FaShoppingCart className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-3">
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
                <div className="text-xs text-gray-500 truncate">{formatDate(order.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openDetailsDialog(order)}
                  className="text-blue-600 p-1"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => setExpandedOrder(
                    expandedOrder === order._id 
                      ? null 
                      : order._id
                  )}
                  className="text-gray-500 p-1"
                  title={expandedOrder === order._id ? "Collapse" : "Expand"}
                >
                  {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="truncate">
                <div className="text-xs text-gray-500">Trader</div>
                <div className="font-medium text-xs truncate">{order.traderName}</div>
                <div className="text-xs text-gray-500 truncate">ID: {order.traderId}</div>
                {order.traderDetails?.personalInfo && (
                  <div className="text-xs text-gray-600 truncate">
                    {order.traderDetails.personalInfo.district && (
                      <span>{order.traderDetails.personalInfo.district}</span>
                    )}
                    {order.traderDetails.personalInfo.state && (
                      <span>, {order.traderDetails.personalInfo.state}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Farmer</div>
                <div className="font-medium text-xs truncate">{order.farmerName || 'N/A'}</div>
                <div className="text-xs text-gray-500 truncate">ID: {order.farmerId}</div>
                {order.farmerDetails?.personalInfo && (
                  <div className="text-xs text-gray-600 truncate">
                    {order.farmerDetails.personalInfo.district && (
                      <span>{order.farmerDetails.personalInfo.district}</span>
                    )}
                    {order.farmerDetails.personalInfo.state && (
                      <span>, {order.farmerDetails.personalInfo.state}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Transporter</div>
              {order.transporterDetails ? (
                <div className="flex items-center gap-2">
                  <FaTruck className="text-gray-400 text-xs" />
                  <div className="text-xs font-medium truncate">{order.transporterDetails.transporterName}</div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">Not assigned</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="truncate">
                <div className="text-xs text-gray-500">Order Status</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)} truncate`}>
                  {formatStatus(order.orderStatus)}
                </span>
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Updated</div>
                <div className="font-medium text-xs truncate">{formatDate(order.updatedAt)}</div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedOrder === order._id && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                {/* Trader Location Details */}
                {order.traderDetails?.personalInfo && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Trader Location</div>
                    <div className="space-y-1">
                      {order.traderDetails.personalInfo.state && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">State:</span>
                          <span className="text-xs font-medium">{order.traderDetails.personalInfo.state}</span>
                        </div>
                      )}
                      {order.traderDetails.personalInfo.district && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">District:</span>
                          <span className="text-xs font-medium">{order.traderDetails.personalInfo.district}</span>
                        </div>
                      )}
                      {order.traderDetails.personalInfo.taluk && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Taluk:</span>
                          <span className="text-xs font-medium">{order.traderDetails.personalInfo.taluk}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Farmer Location Details */}
                {order.farmerDetails?.personalInfo && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Farmer Location</div>
                    <div className="space-y-1">
                      {order.farmerDetails.personalInfo.state && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">State:</span>
                          <span className="text-xs font-medium">{order.farmerDetails.personalInfo.state}</span>
                        </div>
                      )}
                      {order.farmerDetails.personalInfo.district && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">District:</span>
                          <span className="text-xs font-medium">{order.farmerDetails.personalInfo.district}</span>
                        </div>
                      )}
                      {order.farmerDetails.personalInfo.taluk && (
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Taluk:</span>
                          <span className="text-xs font-medium">{order.farmerDetails.personalInfo.taluk}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Transporter Details */}
                {order.transporterDetails && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Transporter Details</div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-500">Name</div>
                          <div className="text-xs font-medium">{order.transporterDetails.transporterName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Mobile</div>
                          <div className="text-xs font-medium">{order.transporterDetails.transporterMobile}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-500">Vehicle</div>
                          <div className="text-xs font-medium">{order.transporterDetails.vehicleNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Type</div>
                          <div className="text-xs font-medium">{order.transporterDetails.vehicleType}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Driver</div>
                        <div className="text-xs font-medium">{order.transporterDetails.driverName}</div>
                      </div>
                      {order.transporterDetails.pickupLocation && (
                        <div>
                          <div className="text-xs text-gray-500">Pickup Location</div>
                          <div className="text-xs">{order.transporterDetails.pickupLocation}</div>
                        </div>
                      )}
                      {order.transporterDetails.estimatedDeliveryDate && (
                        <div>
                          <div className="text-xs text-gray-500">Est. Delivery</div>
                          <div className="text-xs font-medium">{formatDate(order.transporterDetails.estimatedDeliveryDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination and Limit Controls */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg shadow mt-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              Showing {startItem} to {endItem} of {totalItemsState} records
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

          {/* Pagination component */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs text-gray-600">
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

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
                <FaReceipt className="text-blue-600 flex-shrink-0" />
                <span className="truncate">Order Details: {currentOrder?.orderId}</span>
              </h2>
              <p className="text-gray-600 text-sm truncate">Complete order information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {currentOrder && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaClipboardList className="text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Order ID:</span>
                      <span className="font-medium text-sm">{currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Order Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(currentOrder.orderStatus)}`}>
                        {formatStatus(currentOrder.orderStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Created:</span>
                      <span className="font-medium text-sm">{formatDateTime(currentOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Updated:</span>
                      <span className="font-medium text-sm">{formatDateTime(currentOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaUserTie className="text-green-600" />
                    Trader Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader ID:</span>
                      <span className="font-medium text-sm">{currentOrder.traderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader Name:</span>
                      <span className="font-medium text-sm">{currentOrder.traderName}</span>
                    </div>
                    {/* Trader Location Details */}
                    {currentOrder.traderDetails?.personalInfo && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">State:</span>
                          <span className="font-medium text-sm">{currentOrder.traderDetails.personalInfo.state || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">District:</span>
                          <span className="font-medium text-sm">{currentOrder.traderDetails.personalInfo.district || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">Taluk:</span>
                          <span className="font-medium text-sm">{currentOrder.traderDetails.personalInfo.taluk || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Farmer Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaUserFriends className="text-purple-600" />
                  Farmer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Farmer ID:</span>
                    <span className="font-medium text-sm">{currentOrder.farmerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Farmer Name:</span>
                    <span className="font-medium text-sm">{currentOrder.farmerName || 'N/A'}</span>
                  </div>
                  {/* Farmer Location Details */}
                  {currentOrder.farmerDetails?.personalInfo && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">State:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerDetails.personalInfo.state || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">District:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerDetails.personalInfo.district || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Taluk:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerDetails.personalInfo.taluk || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Transporter Information */}
              {currentOrder.transporterDetails && (
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaTruck className="text-indigo-600" />
                    Transporter Details
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Transporter ID</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Transporter Name</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Mobile Number</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.transporterMobile}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Vehicle Number</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.vehicleNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Vehicle Type</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.vehicleType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Driver Name</div>
                        <div className="text-sm font-medium">{currentOrder.transporterDetails.driverName}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Pickup Location</div>
                        <div className="text-sm">{currentOrder.transporterDetails.pickupLocation}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Delivery Location</div>
                        <div className="text-sm">{currentOrder.transporterDetails.deliveryLocation}</div>
                      </div>
                    </div>
                    
                    {(currentOrder.transporterDetails.estimatedPickupDate || currentOrder.transporterDetails.estimatedDeliveryDate) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                        {currentOrder.transporterDetails.estimatedPickupDate && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Estimated Pickup</div>
                            <div className="text-sm font-medium">{formatDate(currentOrder.transporterDetails.estimatedPickupDate)}</div>
                          </div>
                        )}
                        {currentOrder.transporterDetails.estimatedDeliveryDate && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Estimated Delivery</div>
                            <div className="text-sm font-medium">{formatDate(currentOrder.transporterDetails.estimatedDeliveryDate)}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dialog Footer */}
          <div className="mt-4 pt-3 border-t flex justify-end">
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OrdersReport;