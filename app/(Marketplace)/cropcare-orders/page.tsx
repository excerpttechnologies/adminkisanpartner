










// "use client"

// import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
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
//   FaMapPin
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces
// interface OrderItem {
//   productId: string;
//   productName: string;
//   seedId: string;
//   seedName: string;
//   seedPrice: number;
//   quantity: number;
//   image: string;
//   _id: string;
// }

// interface ShippingAddress {
//   name: string;
//   mobileNo: string;
//   address: string;
//   villageGramaPanchayat: string;
//   pincode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   post: string;
//   landmark: string;
//   _id: string;
// }

// interface Payment {
//   method: string;
//   status: string;
//   amount: number;
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   _id: string;
// }

// interface Order {
//   _id: string;
//   userId: string;
//   items: OrderItem[];
//   shippingAddress: ShippingAddress;
//   payment: Payment;
//   orderStatus: string;
//   subtotal: number;
//   gst: number;
//   shipping: number;
//   total: number;
//   createdAt: string;
//   updatedAt: string;
//   orderId: string;
// }

// const CropCareOrders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
  
//   // Filter states
//   const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
//   const [userIdFilter, setUserIdFilter] = useState<string>('');
//   const [stateFilter, setStateFilter] = useState<string>('');
//   const [districtFilter, setDistrictFilter] = useState<string>('');
//   const [talukFilter, setTalukFilter] = useState<string>('');
  
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

//   const API_BASE = '/api';
//   const tableRef = useRef<HTMLDivElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Fetch orders with server-side pagination and sorting
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (orderStatusFilter) params.append('orderStatus', orderStatusFilter);
//     if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
//     if (userIdFilter) params.append('userId', userIdFilter);
//     if (stateFilter) params.append('state', stateFilter);
//     if (districtFilter) params.append('district', districtFilter);
//     if (talukFilter) params.append('taluk', talukFilter);
//     params.append('page', currentPage.toString());
//     params.append('limit', itemsPerPage.toString());
//     params.append('sortBy', sortField);
//     params.append('order', sortOrder);

//     try {
//       const response = await axios.get(`${API_BASE}/cropcareorders?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
//         setOrders(data);
//         setTotalItemsState(response.data.total || 0);
//         setTotalPages(response.data.totalPages || 1);
        
//         // For export functionality, fetch all data without pagination but with sorting
//         const exportParams = new URLSearchParams();
//         if (searchInput) exportParams.append('search', searchInput);
//         if (orderStatusFilter) exportParams.append('orderStatus', orderStatusFilter);
//         if (paymentStatusFilter) exportParams.append('paymentStatus', paymentStatusFilter);
//         if (userIdFilter) exportParams.append('userId', userIdFilter);
//         if (stateFilter) exportParams.append('state', stateFilter);
//         if (districtFilter) exportParams.append('district', districtFilter);
//         if (talukFilter) exportParams.append('taluk', talukFilter);
//         exportParams.append('limit', '10000'); // Large limit for all data
//         exportParams.append('sortBy', sortField);
//         exportParams.append('order', sortOrder);
        
//         const exportResponse = await axios.get(`${API_BASE}/cropcareorders?${exportParams.toString()}`);
//         if (exportResponse.data.success) {
//           setAllOrders(exportResponse.data.data || []);
//         }
//       } else {
//         toast.error('Failed to fetch crop care orders');
//       }
//     } catch (error) {
//       console.error('Error fetching crop care orders:', error);
//       toast.error('Error fetching crop care orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE, searchInput, orderStatusFilter, paymentStatusFilter, userIdFilter, stateFilter, districtFilter, talukFilter, currentPage, itemsPerPage, sortField, sortOrder]);

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
//       if (searchInput !== '' || userIdFilter !== '') {
//         setCurrentPage(1);
//         fetchOrders();
//       }
//     }, 500); // 500ms delay

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput, userIdFilter]);

//   // Get unique states for filter dropdown
//   const getUniqueStates = useMemo(() => {
//     const states = allOrders
//       .map(order => order.shippingAddress.state)
//       .filter(state => state && state.trim() !== '');
//     return [...new Set(states)].sort();
//   }, [allOrders]);

//   // Get unique districts for filter dropdown
//   const getUniqueDistricts = useMemo(() => {
//     const districts = allOrders
//       .map(order => order.shippingAddress.district)
//       .filter(district => district && district.trim() !== '');
//     return [...new Set(districts)].sort();
//   }, [allOrders]);

//   // Get unique taluks for filter dropdown
//   const getUniqueTaluks = useMemo(() => {
//     const taluks = allOrders
//       .map(order => order.shippingAddress.taluk)
//       .filter(taluk => taluk && taluk.trim() !== '');
//     return [...new Set(taluks)].sort();
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

//   // // Export functions
//   // const handleCopyToClipboard = async () => {
//   //   const headers = ["Order ID", "User ID", "Customer Name", "Mobile", "State", "District", "Taluk", "Items Count", "Subtotal", "GST", "Shipping", "Total", "Payment Status", "Order Status", "Date"];
    
//   //   const csvContent = [
//   //     headers.join("\t"),
//   //     ...allOrders.map((order) => {
//   //       return [
//   //         order.orderId,
//   //         order.userId,
//   //         order.shippingAddress.name,
//   //         order.shippingAddress.mobileNo,
//   //         order.shippingAddress.state,
//   //         order.shippingAddress.district,
//   //         order.shippingAddress.taluk,
//   //         order.items.length,
//   //         order.subtotal,
//   //         order.gst,
//   //         order.shipping,
//   //         order.total,
//   //         order.payment.status,
//   //         order.orderStatus,
//   //         new Date(order.createdAt).toLocaleDateString()
//   //       ].join("\t");
//   //     })
//   //   ].join("\n");
    
//   //   try {
//   //     await navigator.clipboard.writeText(csvContent);
//   //     toast.success("Data copied to clipboard!");
//   //   } catch (err) {
//   //     console.error("Failed to copy: ", err);
//   //     toast.error("Failed to copy to clipboard");
//   //   }
//   // };


//   const handleCopyToClipboard = async (): Promise<void> => {
//   if (allOrders.length === 0) {
//     toast.error("No orders to copy");
//     return;
//   }

//   // Define headers with desired widths
//   const headers = [
//     { name: "Order ID", width: 15 },
//     { name: "Customer", width: 20 },
//     { name: "Mobile", width: 15 },
//     { name: "Location", width: 25 },
//     { name: "Items", width: 8 },
//     { name: "Amount", width: 12 },
//     { name: "Payment", width: 12 },
//     { name: "Status", width: 15 },
//     { name: "Date", width: 12 }
//   ];
  
//   // Create header row
//   const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//   const separator = "─".repeat(headerRow.length);
  
//   // Format each order row
//   const orderRows = allOrders.map((order: any) => {
//     // Format customer name (truncate if too long)
//     const customerName = order.shippingAddress?.name || "N/A";
//     const formattedCustomer = customerName.length > 18 
//       ? customerName.substring(0, 15) + "..." 
//       : customerName;
    
//     // Format location
//     const locationParts = [
//       order.shippingAddress?.taluk,
//       order.shippingAddress?.district,
//       order.shippingAddress?.state
//     ].filter(Boolean);
//     const location = locationParts.join(", ") || "N/A";
//     const formattedLocation = location.length > 23 
//       ? location.substring(0, 20) + "..." 
//       : location;
    
//     // Format payment status with emoji
//     const paymentStatus = order.payment?.status || "N/A";
//     const paymentEmoji = paymentStatus === "completed" ? "✅" : 
//                         paymentStatus === "pending" ? "⏳" : 
//                         paymentStatus === "failed" ? "❌" : "";
    
//     // Format order status with emoji
//     const orderStatus = order.orderStatus || "N/A";
//     const statusEmoji = orderStatus === "delivered" ? "📦" : 
//                        orderStatus === "shipped" ? "🚚" : 
//                        orderStatus === "processing" ? "🔄" : 
//                        orderStatus === "cancelled" ? "❌" : "📝";
    
//     // Create row values with padding
//     const rowValues = [
//       (order.orderId || "").padEnd(headers[0].width),
//       formattedCustomer.padEnd(headers[1].width),
//       (order.shippingAddress?.mobileNo || "N/A").padEnd(headers[2].width),
//       formattedLocation.padEnd(headers[3].width),
//       (order.items?.length || 0).toString().padEnd(headers[4].width),
//       `₹${(order.total || 0).toLocaleString()}`.padEnd(headers[5].width),
//       `${paymentEmoji} ${paymentStatus}`.padEnd(headers[6].width),
//       `${statusEmoji} ${orderStatus}`.padEnd(headers[7].width),
//       (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A").padEnd(headers[8].width)
//     ];
    
//     return rowValues.join(" │ ");
//   });
  
//   // Calculate totals
//   const totalAmount = allOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
//   const totalItems = allOrders.reduce((sum: number, order: any) => sum + (order.items?.length || 0), 0);
//   const completedPayments = allOrders.filter((order: any) => 
//     order.payment?.status === "completed"
//   ).length;
  
//   // Build complete table
//   const tableContent = [
//     "🛒 ORDER SUMMARY",
//     "=".repeat(headerRow.length),
//     headerRow,
//     separator,
//     ...orderRows,
//     separator,
//     "",
//     "📊 ORDER STATISTICS",
//     `• Total Orders: ${allOrders.length}`,
//     `• Total Items: ${totalItems}`,
//     `• Total Amount: ₹${totalAmount.toLocaleString()}`,
//     `• Completed Payments: ${completedPayments} (${Math.round(completedPayments/allOrders.length*100)}%)`,
//     `• Average Order Value: ₹${Math.round(totalAmount/allOrders.length)}`,
//     "",
//     "💰 PAYMENT STATUS",
//     `• Completed: ${allOrders.filter(o => o.payment?.status === "completed").length}`,
//     `• Pending: ${allOrders.filter(o => o.payment?.status === "pending").length}`,
//     `• Failed: ${allOrders.filter(o => o.payment?.status === "failed").length}`,
//     "",
//     "📦 ORDER STATUS",
//     `• Delivered: ${allOrders.filter(o => o.orderStatus === "delivered").length}`,
//     `• Shipped: ${allOrders.filter(o => o.orderStatus === "shipped").length}`,
//     `• Processing: ${allOrders.filter(o => o.orderStatus === "processing").length}`,
//     `• Cancelled: ${allOrders.filter(o => o.orderStatus === "cancelled").length}`,
//     "",
//     `📅 Report Generated: ${new Date().toLocaleString()}`
//   ].join("\n");
  
//   try {
//     await navigator.clipboard.writeText(tableContent);
//     toast.success(`Copied ${allOrders.length} orders to clipboard!`);
//   } catch (err) {
//     console.error("Failed to copy:", err);
//     toast.error("Failed to copy to clipboard");
//   }
// };

//   const handleExportExcel = () => {
//     const data = allOrders.map((order) => {
//       return {
//         "Order ID": order.orderId,
//         "User ID": order.userId,
//         "Customer Name": order.shippingAddress.name,
//         "Mobile": order.shippingAddress.mobileNo,
//         "Address": `${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
//         "State": order.shippingAddress.state,
//         "District": order.shippingAddress.district,
//         "Taluk": order.shippingAddress.taluk,
//         "Pincode": order.shippingAddress.pincode,
//         "Items Count": order.items.length,
//         "Items": order.items.map(item => `${item.productName} (${item.seedName})`).join("; "),
//         "Subtotal": order.subtotal,
//         "GST": order.gst,
//         "Shipping": order.shipping,
//         "Total": order.total,
//         "Payment Method": order.payment.method,
//         "Payment Status": order.payment.status,
//         "Order Status": order.orderStatus,
//         "Created At": new Date(order.createdAt).toLocaleString(),
//         "Updated At": new Date(order.updatedAt).toLocaleString(),
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Crop Care Orders");
//     writeFile(wb, `cropcare-orders-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Customer Name", "Mobile", "State", "District", "Items", "Total", "Payment Status", "Order Status", "Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allOrders.map((order) => {
//         const items = order.items.map(item => `${item.productName} (${item.seedName})`).join("; ");
//         return [
//           `"${order.orderId}"`,
//           `"${order.shippingAddress.name}"`,
//           `"${order.shippingAddress.mobileNo}"`,
//           `"${order.shippingAddress.state}"`,
//           `"${order.shippingAddress.district}"`,
//           `"${items}"`,
//           order.total,
//           `"${order.payment.status}"`,
//           `"${order.orderStatus}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `cropcare-orders-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF('landscape');
//     doc.text("Crop Care Orders Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Customer", "Mobile", "State", "District", "Items", "Total", "Payment", "Status", "Date"];
//     const tableRows: any = allOrders.map((order) => {
//       const items = order.items.slice(0, 2).map(item => `${item.productName}`).join(", ");
//       const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';
//       return [
//         order.orderId,
//         order.shippingAddress.name,
//         order.shippingAddress.mobileNo,
//         order.shippingAddress.state,
//         order.shippingAddress.district,
//         items + moreItems,
//         `₹${order.total}`,
//         order.payment.status,
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
    
//     doc.save(`cropcare-orders-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Crop Care Orders Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .total-row { background-color: #f3f4f6; font-weight: bold; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Crop Care Orders Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
//         <p>Total Orders: ${allOrders.length}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Mobile</th>
//               <th>State</th>
//               <th>District</th>
//               <th>Items Count</th>
//               <th>Total Amount</th>
//               <th>Payment Status</th>
//               <th>Order Status</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allOrders.map((order) => {
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${order.shippingAddress.name}</td>
//                   <td>${order.shippingAddress.mobileNo}</td>
//                   <td>${order.shippingAddress.state}</td>
//                   <td>${order.shippingAddress.district}</td>
//                   <td>${order.items.length}</td>
//                   <td>₹${order.total}</td>
//                   <td>${order.payment.status}</td>
//                   <td>${order.orderStatus}</td>
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
//     toast.success("Printing crop care orders report...");
//   };

//   // Order status badge colors
//   const getOrderStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'confirmed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'processing':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'delivered':
//         return 'bg-indigo-100 text-indigo-800 border-indigo-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Payment status badge colors
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'failed':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'refunded':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format status text
//   const formatStatus = (status: string) => {
//     return status.replace(/\b\w/g, l => l.toUpperCase());
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//     }).format(amount);
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
//     setPaymentStatusFilter('');
//     setUserIdFilter('');
//     setStateFilter('');
//     setDistrictFilter('');
//     setTalukFilter('');
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
//     const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
//     const totalOrders = allOrders.length;
//     const completedPayments = allOrders.filter(order => order.payment.status === 'completed').length;
//     const confirmedOrders = allOrders.filter(order => order.orderStatus === 'confirmed').length;
//     const totalItemsCount = allOrders.reduce((sum, order) => sum + order.items.length, 0);
    
//     return { totalRevenue, totalOrders, completedPayments, confirmedOrders, totalItemsCount };
//   };

//   const { totalRevenue, totalOrders, completedPayments, confirmedOrders, totalItemsCount } = calculateStats();
//   const { startItem, endItem } = getPaginationRange();

//   if (loading && allOrders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading crop care orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2 ">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaShoppingCart className="text-blue-600" />
//           Crop Care Orders
//         </h1>
//         <p className="text-gray-600 mt-1">Manage and track crop care product orders</p>
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

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//         <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Revenue</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
//             </div>
//             <FaRupeeSign className="text-blue-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Orders</p>
//               <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
//             </div>
//             <FaShoppingCart className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Completed Payments</p>
//               <p className="text-xl font-bold text-gray-900">{completedPayments}</p>
//             </div>
//             <FaCreditCard className="text-purple-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Items</p>
//               <p className="text-xl font-bold text-gray-900">{totalItemsCount}</p>
//             </div>
//             <FaBoxes className="text-yellow-500 text-xl" />
//           </div>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded shadow mb44 p-3">
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
//               placeholder="Search order ID, customer..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </div>

//           {/* User ID Filter */}
//           {/* <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUser className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//               placeholder="User ID"
//               value={userIdFilter}
//               onChange={(e) => setUserIdFilter(e.target.value)}
//             />
//           </div> */}

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
//               <option value="confirmed">Confirmed</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Payment Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaCreditCard className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={paymentStatusFilter}
//               onChange={(e) => setPaymentStatusFilter(e.target.value)}
//             >
//               <option value="">Payment Status</option>
//               <option value="completed">Completed</option>
//               <option value="pending">Pending</option>
//               <option value="failed">Failed</option>
//               <option value="refunded">Refunded</option>
//             </select>
//           </div>
//         </div>

//         {/* Location Filters Row */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
//           {/* State Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaGlobe className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={stateFilter}
//               onChange={(e) => setStateFilter(e.target.value)}
//             >
//               <option value="">All States</option>
//               {getUniqueStates.map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* District Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaCity className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={districtFilter}
//               onChange={(e) => setDistrictFilter(e.target.value)}
//             >
//               <option value="">All Districts</option>
//               {getUniqueDistricts.map((district) => (
//                 <option key={district} value={district}>
//                   {district}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Taluk Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaMapPin className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={talukFilter}
//               onChange={(e) => setTalukFilter(e.target.value)}
//             >
//               <option value="">All Taluks</option>
//               {getUniqueTaluks.map((taluk) => (
//                 <option key={taluk} value={taluk}>
//                   {taluk}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={applyFilters}
//             className=" w-fit flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
//           >
//             <FaSearch />
//             Apply Filters
//           </button>
//           <button
//             onClick={resetFilters}
//             className=" w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
//           >
//             <FaSync />
//             Reset All
//           </button>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded shadow ov4rflow-hidden" ref={tableRef}>
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
//                   onClick={() => handleSort('userId')}
//                 >
//                   Customer {getSortIcon('userId')}
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('shippingAddress.state')}
//                 >
//                   Location {getSortIcon('shippingAddress.state')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Items
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('total')}
//                 >
//                   Amount {getSortIcon('total')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Payment Status
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
//                     <div className="text-xs text-gray-500">{order.userId}</div>
//                   </td>

//                   {/* Customer */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium text-gray-900 truncate">{order.shippingAddress.name}</div>
//                         <div className="text-xs text-gray-500 truncate">{order.shippingAddress.mobileNo}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Location */}
//                   <td className="px-4 py-3">
//                     <div className="flex items-center">
//                       <FaMapMarkerAlt className="text-gray-400 mr-2 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium text-gray-900 truncate">{order.shippingAddress.state}</div>
//                         <div className="text-xs text-gray-500 truncate whitespace-normal">
//                           {order.shippingAddress.district}, {order.shippingAddress.taluk}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Items */}
//                   <td className="px-4 py-3">
//                     <div className="flex flex-col space-y-1 max-w-xs">
//                       {order.items.slice(0, 2).map((item, index) => (
//                         <div key={item._id} className="flex items-center">
//                           <FaBox className="text-gray-400 mr-2 text-xs flex-shrink-0" />
//                           <span className="text-sm truncate">
//                             {item.productName} ({item.seedName})
//                           </span>
//                           <span className="ml-2 text-xs text-gray-500 flex-shrink-0">×{item.quantity}</span>
//                         </div>
//                       ))}
//                       {order.items.length > 2 && (
//                         <div className="text-xs text-blue-600">
//                           +{order.items.length - 2} more items
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   {/* Amount */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <div className="text-sm font-bold text-green-700">
//                       <FaRupeeSign className="inline mr-1" />
//                       {order.total.toLocaleString()}
//                     </div>
//                     <div className="text-xs text-gray-500 whitespace-normal">
//                       Subtotal: ₹{order.subtotal} | GST: ₹{order.gst}
//                     </div>
//                   </td>

//                   {/* Payment Status */}
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment.status)}`}>
//                       {formatStatus(order.payment.status)}
//                     </span>
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
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No crop care orders found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-3">
//         {orders.map((order) => (
//           <div key={order._id} className="bg-white rounded shadow p-4">
//             <div className="flex justify-between items-start mb-3">
//               <div className="min-w-0 flex-1">
//                 <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
//                 <div className="text-xs text-gray-500 truncate">{order.shippingAddress.name}</div>
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
//                 <div className="text-xs text-gray-500">User ID</div>
//                 <div className="font-medium text-xs truncate">{order.userId}</div>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Location</div>
//                 <div className="font-medium text-xs truncate">{order.shippingAddress.state}</div>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Total Amount</div>
//                 <div className="font-bold text-green-700 text-xs truncate">
//                   <FaRupeeSign className="inline mr-1" />
//                   {order.total.toLocaleString()}
//                 </div>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Payment</div>
//                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment.status)} truncate`}>
//                   {formatStatus(order.payment.status)}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-2 mb-2">
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Order Status</div>
//                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)} truncate`}>
//                   {formatStatus(order.orderStatus)}
//                 </span>
//               </div>
//               <div className="truncate">
//                 <div className="text-xs text-gray-500">Date</div>
//                 <div className="font-medium text-xs truncate">{formatDate(order.createdAt)}</div>
//               </div>
//             </div>

//             {/* Expanded Content */}
//             {expandedOrder === order._id && (
//               <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
//                 {/* Items Details */}
//                 <div>
//                   <div className="text-xs text-gray-500 mb-2">Order Items ({order.items.length})</div>
//                   <div className="space-y-2">
//                     {order.items.map((item) => (
//                       <div key={item._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
//                         <div className="min-w-0 flex-1">
//                           <div className="font-medium text-xs truncate">{item.productName}</div>
//                           <div className="text-xs text-gray-500 truncate">{item.seedName}</div>
//                         </div>
//                         <div className="text-right flex-shrink-0 ml-2">
//                           <div className="font-bold text-xs">₹{item.seedPrice}</div>
//                           <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Location Details */}
//                 <div>
//                   <div className="text-xs text-gray-500 mb-2">Location Details</div>
//                   <div className="text-xs space-y-1">
//                     <div className="truncate"><span className="font-medium">State:</span> {order.shippingAddress.state}</div>
//                     <div className="truncate"><span className="font-medium">District:</span> {order.shippingAddress.district}</div>
//                     <div className="truncate"><span className="font-medium">Taluk:</span> {order.shippingAddress.taluk}</div>
//                     <div className="truncate"><span className="font-medium">Pincode:</span> {order.shippingAddress.pincode}</div>
//                   </div>
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <div className="text-xs text-gray-500">Subtotal</div>
//                     <div className="text-xs">₹{order.subtotal}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">GST</div>
//                     <div className="text-xs">₹{order.gst}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Shipping</div>
//                     <div className="text-xs">₹{order.shipping}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Total</div>
//                     <div className="font-bold text-xs">₹{order.total}</div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {orders.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded shadow mt44">
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
//                       <span className="text-gray-600 text-sm">User ID:</span>
//                       <span className="font-medium text-sm">{currentOrder.userId}</span>
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
//                     <FaCreditCard className="text-green-600" />
//                     Payment Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Payment Status:</span>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentOrder.payment.status)}`}>
//                         {formatStatus(currentOrder.payment.status)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Payment Method:</span>
//                       <span className="font-medium text-sm">{formatStatus(currentOrder.payment.method)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Amount Paid:</span>
//                       <span className="font-bold text-green-700 text-sm">
//                         <FaRupeeSign className="inline mr-1" />
//                         {currentOrder.payment.amount.toLocaleString()}
//                       </span>
//                     </div>
//                     {currentOrder.payment.razorpayOrderId && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Razorpay ID:</span>
//                         <span className="font-medium text-xs truncate max-w-[120px]">
//                           {currentOrder.payment.razorpayOrderId}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="bg-white border border-gray-200 rounded p-3">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaBox className="text-purple-600" />
//                   Order Items ({currentOrder.items.length})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seed Type</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentOrder.items.map((item) => (
//                         <tr key={item._id}>
//                           <td className="px-3 py-2">
//                             <div className="font-medium text-sm truncate">{item.productName}</div>
//                             <div className="text-xs text-gray-500 truncate">ID: {item.productId}</div>
//                           </td>
//                           <td className="px-3 py-2">
//                             <div className="text-sm truncate">{item.seedName}</div>
//                             <div className="text-xs text-gray-500 truncate">ID: {item.seedId}</div>
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="font-medium text-sm">
//                               <FaRupeeSign className="inline mr-1" />
//                               {item.seedPrice.toLocaleString()}
//                             </div>
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="font-medium text-sm">{item.quantity}</div>
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <div className="font-bold text-green-700 text-sm">
//                               <FaRupeeSign className="inline mr-1" />
//                               {(item.seedPrice * item.quantity).toLocaleString()}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Price Summary and Address */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaRupeeSign className="text-gray-600" />
//                     Price Summary
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Subtotal:</span>
//                       <span className="font-medium text-sm">
//                         <FaRupeeSign className="inline mr-1" />
//                         {currentOrder.subtotal.toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">GST (18%):</span>
//                       <span className="font-medium text-sm">
//                         <FaRupeeSign className="inline mr-1" />
//                         {currentOrder.gst.toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Shipping:</span>
//                       <span className="font-medium text-sm">
//                         <FaRupeeSign className="inline mr-1" />
//                         {currentOrder.shipping.toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between pt-2 border-t">
//                       <span className="text-gray-800 font-bold text-sm">Total Amount:</span>
//                       <span className="font-bold text-green-700">
//                         <FaRupeeSign className="inline mr-1" />
//                         {currentOrder.total.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaMapMarkerAlt className="text-red-600" />
//                     Shipping Address
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex items-start">
//                       <FaUser className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="font-medium text-sm truncate">{currentOrder.shippingAddress.name}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <FaPhone className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
//                       <div className="font-medium text-sm truncate">{currentOrder.shippingAddress.mobileNo}</div>
//                     </div>
//                     <div className="flex items-start">
//                       <FaMapMarkerAlt className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
//                       <div className="min-w-0 flex-1">
//                         <div className="font-medium text-sm mb-1">Address:</div>
//                         <div className="text-sm truncate">{currentOrder.shippingAddress.address}</div>
//                         <div className="text-xs text-gray-600 mt-1 space-y-0.5">
//                           <div className="truncate"><span className="font-medium">State:</span> {currentOrder.shippingAddress.state}</div>
//                           <div className="truncate"><span className="font-medium">District:</span> {currentOrder.shippingAddress.district}</div>
//                           <div className="truncate"><span className="font-medium">Taluk:</span> {currentOrder.shippingAddress.taluk}</div>
//                           <div className="truncate"><span className="font-medium">Pincode:</span> {currentOrder.shippingAddress.pincode}</div>
//                           {currentOrder.shippingAddress.landmark && (
//                             <div className="truncate"><span className="font-medium">Landmark:</span> {currentOrder.shippingAddress.landmark}</div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
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

// export default CropCareOrders;



















"use client"

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
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
  FaMapPin
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface OrderItem {
  productId: string;
  productName: string;
  seedId: string;
  seedName: string;
  seedPrice: number;
  quantity: number;
  image: string;
  _id: string;
}

interface ShippingAddress {
  name: string;
  mobileNo: string;
  address: string;
  villageGramaPanchayat: string;
  pincode: string;
  state: string;
  district: string;
  taluk: string;
  post: string;
  landmark: string;
  _id: string;
}

interface Payment {
  method: string;
  status: string;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: Payment;
  orderStatus: string;
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}

const CropCareOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [cropOrder, setAllcropOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [talukFilter, setTalukFilter] = useState<string>('');
  
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

  const API_BASE = '/api';
  const tableRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch orders with server-side pagination and sorting
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (orderStatusFilter) params.append('orderStatus', orderStatusFilter);
    if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
    if (userIdFilter) params.append('userId', userIdFilter);
    if (stateFilter) params.append('state', stateFilter);
    if (districtFilter) params.append('district', districtFilter);
    if (talukFilter) params.append('taluk', talukFilter);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    try {
      const response = await axios.get(`${API_BASE}/cropcareorders?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setOrders(data);
        setTotalItemsState(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
        
        // For export functionality, fetch all data without pagination but with sorting
        const exportParams = new URLSearchParams();
        if (searchInput) exportParams.append('search', searchInput);
        if (orderStatusFilter) exportParams.append('orderStatus', orderStatusFilter);
        if (paymentStatusFilter) exportParams.append('paymentStatus', paymentStatusFilter);
        if (userIdFilter) exportParams.append('userId', userIdFilter);
        if (stateFilter) exportParams.append('state', stateFilter);
        if (districtFilter) exportParams.append('district', districtFilter);
        if (talukFilter) exportParams.append('taluk', talukFilter);
        exportParams.append('limit', '10000'); // Large limit for all data
        exportParams.append('sortBy', sortField);
        exportParams.append('order', sortOrder);
        
        const exportResponse = await axios.get(`${API_BASE}/cropcareorders?${exportParams.toString()}`);
        if (exportResponse.data.success) {
          setAllOrders(exportResponse.data.data || []);
          setAllcropOrder(exportResponse.data.cropOrder || [])
        }
      } else {
        toast.error('Failed to fetch crop care orders');
      }
    } catch (error) {
      console.error('Error fetching crop care orders:', error);
      toast.error('Error fetching crop care orders');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, searchInput, orderStatusFilter, paymentStatusFilter, userIdFilter, stateFilter, districtFilter, talukFilter, currentPage, itemsPerPage, sortField, sortOrder]);

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
      if (searchInput !== '' || userIdFilter !== '') {
        setCurrentPage(1);
        fetchOrders();
      }
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, userIdFilter]);

  // Get unique states for filter dropdown
  const getUniqueStates = useMemo(() => {
    const states = cropOrder
      .map(order => order.shippingAddress.state)
      .filter(state => state && state.trim() !== '');
    return [...new Set(states)].sort();
  }, [allOrders]);

  // Get unique districts for filter dropdown
  const getUniqueDistricts = useMemo(() => {
    const districts = cropOrder
      .map(order => order.shippingAddress.district)
      .filter(district => district && district.trim() !== '');
    return [...new Set(districts)].sort();
  }, [allOrders]);

  // Get unique taluks for filter dropdown
  const getUniqueTaluks = useMemo(() => {
    const taluks = cropOrder
      .map(order => order.shippingAddress.taluk)
      .filter(taluk => taluk && taluk.trim() !== '');
    return [...new Set(taluks)].sort();
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
const handleCopyToClipboard = async (): Promise<void> => {
  if (allOrders.length === 0) {
    toast.error("No orders to copy");
    return;
  }

  // Define headers with desired widths
  const headers = [
    { name: "Order ID", width: 15 },
    { name: "Customer", width: 20 },
    { name: "Mobile", width: 15 },
    { name: "Location", width: 25 },
    { name: "Items", width: 8 },
    { name: "Amount", width: 12 },
    { name: "Payment", width: 12 },
    { name: "Status", width: 15 },
    { name: "Date", width: 12 }
  ];
  
  // Create header row
  const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
  const separator = "─".repeat(headerRow.length);
  
  // Format each order row
  const orderRows = allOrders.map((order: any) => {
    // Format customer name (truncate if too long)
    const customerName = order.shippingAddress?.name || "N/A";
    const formattedCustomer = customerName.length > 18 
      ? customerName.substring(0, 15) + "..." 
      : customerName;
    
    // Format location
    const locationParts = [
      order.shippingAddress?.taluk,
      order.shippingAddress?.district,
      order.shippingAddress?.state
    ].filter(Boolean);
    const location = locationParts.join(", ") || "N/A";
    const formattedLocation = location.length > 23 
      ? location.substring(0, 20) + "..." 
      : location;
    
    // Format payment status with emoji
    const paymentStatus = order.payment?.status || "N/A";
    const paymentEmoji = paymentStatus === "completed" ? "✅" : 
                        paymentStatus === "pending" ? "⏳" : 
                        paymentStatus === "failed" ? "❌" : "";
    
    // Format order status with emoji
    const orderStatus = order.orderStatus || "N/A";
    const statusEmoji = orderStatus === "delivered" ? "📦" : 
                       orderStatus === "shipped" ? "🚚" : 
                       orderStatus === "processing" ? "🔄" : 
                       orderStatus === "cancelled" ? "❌" : "📝";
    
    // Create row values with padding
    const rowValues = [
      (order.orderId || "").padEnd(headers[0].width),
      formattedCustomer.padEnd(headers[1].width),
      (order.shippingAddress?.mobileNo || "N/A").padEnd(headers[2].width),
      formattedLocation.padEnd(headers[3].width),
      (order.items?.length || 0).toString().padEnd(headers[4].width),
      `₹${(order.total || 0).toLocaleString()}`.padEnd(headers[5].width),
      `${paymentEmoji} ${paymentStatus}`.padEnd(headers[6].width),
      `${statusEmoji} ${orderStatus}`.padEnd(headers[7].width),
      (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A").padEnd(headers[8].width)
    ];
    
    return rowValues.join(" │ ");
  });
  
  // Calculate totals
  const totalAmount = allOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const totalItems = allOrders.reduce((sum: number, order: any) => sum + (order.items?.length || 0), 0);
  const completedPayments = allOrders.filter((order: any) => 
    order.payment?.status === "completed"
  ).length;
  
  // Build complete table
  const tableContent = [
    "🛒 ORDER SUMMARY",
    "=".repeat(headerRow.length),
    headerRow,
    separator,
    ...orderRows,
    separator,
    "",
    "📊 ORDER STATISTICS",
    `• Total Orders: ${allOrders.length}`,
    `• Total Items: ${totalItems}`,
    `• Total Amount: ₹${totalAmount.toLocaleString()}`,
    `• Completed Payments: ${completedPayments} (${Math.round(completedPayments/allOrders.length*100)}%)`,
    `• Average Order Value: ₹${Math.round(totalAmount/allOrders.length)}`,
    "",
    "💰 PAYMENT STATUS",
    `• Completed: ${allOrders.filter(o => o.payment?.status === "completed").length}`,
    `• Pending: ${allOrders.filter(o => o.payment?.status === "pending").length}`,
    `• Failed: ${allOrders.filter(o => o.payment?.status === "failed").length}`,
    "",
    "📦 ORDER STATUS",
    `• Delivered: ${allOrders.filter(o => o.orderStatus === "delivered").length}`,
    `• Shipped: ${allOrders.filter(o => o.orderStatus === "shipped").length}`,
    `• Processing: ${allOrders.filter(o => o.orderStatus === "processing").length}`,
    `• Cancelled: ${allOrders.filter(o => o.orderStatus === "cancelled").length}`,
    "",
    `📅 Report Generated: ${new Date().toLocaleString()}`
  ].join("\n");
  
  try {
    await navigator.clipboard.writeText(tableContent);
    toast.success(`Copied ${allOrders.length} orders to clipboard!`);
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy to clipboard");
  }
};

  const handleExportExcel = () => {
    const data = allOrders.map((order) => {
      return {
        "Order ID": order.orderId,
        "User ID": order.userId,
        "Customer Name": order.shippingAddress.name,
        "Mobile": order.shippingAddress.mobileNo,
        "Address": `${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
        "State": order.shippingAddress.state,
        "District": order.shippingAddress.district,
        "Taluk": order.shippingAddress.taluk,
        "Pincode": order.shippingAddress.pincode,
        "Items Count": order.items.length,
        "Items": order.items.map(item => `${item.productName} (${item.seedName})`).join("; "),
        "Subtotal": order.subtotal,
        "GST": order.gst,
        "Shipping": order.shipping,
        "Total": order.total,
        "Payment Method": order.payment.method,
        "Payment Status": order.payment.status,
        "Order Status": order.orderStatus,
        "Created At": new Date(order.createdAt).toLocaleString(),
        "Updated At": new Date(order.updatedAt).toLocaleString(),
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Crop Care Orders");
    writeFile(wb, `cropcare-orders-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer Name", "Mobile", "State", "District", "Items", "Total", "Payment Status", "Order Status", "Date"];
    
    const csvContent = [
      headers.join(","),
      ...allOrders.map((order) => {
        const items = order.items.map(item => `${item.productName} (${item.seedName})`).join("; ");
        return [
          `"${order.orderId}"`,
          `"${order.shippingAddress.name}"`,
          `"${order.shippingAddress.mobileNo}"`,
          `"${order.shippingAddress.state}"`,
          `"${order.shippingAddress.district}"`,
          `"${items}"`,
          order.total,
          `"${order.payment.status}"`,
          `"${order.orderStatus}"`,
          `"${new Date(order.createdAt).toLocaleDateString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cropcare-orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Crop Care Orders Report", 14, 16);
    
    const tableColumn = ["Order ID", "Customer", "Mobile", "State", "District", "Items", "Total", "Payment", "Status", "Date"];
    const tableRows: any = allOrders.map((order) => {
      const items = order.items.slice(0, 2).map(item => `${item.productName}`).join(", ");
      const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';
      return [
        order.orderId,
        order.shippingAddress.name,
        order.shippingAddress.mobileNo,
        order.shippingAddress.state,
        order.shippingAddress.district,
        items + moreItems,
        `₹${order.total}`,
        order.payment.status,
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
    
    doc.save(`cropcare-orders-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Crop Care Orders Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .total-row { background-color: #f3f4f6; font-weight: bold; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Crop Care Orders Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Orders: ${allOrders.length}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>State</th>
              <th>District</th>
              <th>Items Count</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.map((order) => {
              return `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${order.shippingAddress.name}</td>
                  <td>${order.shippingAddress.mobileNo}</td>
                  <td>${order.shippingAddress.state}</td>
                  <td>${order.shippingAddress.district}</td>
                  <td>${order.items.length}</td>
                  <td>₹${order.total}</td>
                  <td>${order.payment.status}</td>
                  <td>${order.orderStatus}</td>
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
    toast.success("Printing crop care orders report...");
  };

  // Order status badge colors
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Payment status badge colors
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
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
    setPaymentStatusFilter('');
    setUserIdFilter('');
    setStateFilter('');
    setDistrictFilter('');
    setTalukFilter('');
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
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = allOrders.length;
    const completedPayments = allOrders.filter(order => order.payment.status === 'completed').length;
    const confirmedOrders = allOrders.filter(order => order.orderStatus === 'confirmed').length;
    const totalItemsCount = allOrders.reduce((sum, order) => sum + order.items.length, 0);
    
    return { totalRevenue, totalOrders, completedPayments, confirmedOrders, totalItemsCount };
  };

  const { totalRevenue, totalOrders, completedPayments, confirmedOrders, totalItemsCount } = calculateStats();
  const { startItem, endItem } = getPaginationRange();

  if (loading && allOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crop care orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2 ">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaShoppingCart className="text-blue-600" />
          Crop Care Orders
        </h1>
        <p className="text-gray-600 mt-1">Manage and track crop care product orders</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <FaRupeeSign className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <FaShoppingCart className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Completed Payments</p>
              <p className="text-xl font-bold text-gray-900">{completedPayments}</p>
            </div>
            <FaCreditCard className="text-purple-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{totalItemsCount}</p>
            </div>
            <FaBoxes className="text-yellow-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded shadow mb44 p-3">
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
              placeholder="Search order ID, customer..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* User ID Filter */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCreditCard className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">Payment Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Location Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {/* State Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaGlobe className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">All States</option>
              {getUniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCity className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">All Districts</option>
              {getUniqueDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Taluk Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapPin className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={talukFilter}
              onChange={(e) => setTalukFilter(e.target.value)}
            >
              <option value="">All Taluks</option>
              {getUniqueTaluks.map((taluk) => (
                <option key={taluk} value={taluk}>
                  {taluk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className=" w-fit flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            <FaSearch />
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className=" w-fit flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
          >
            <FaSync />
            Reset All
          </button>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow ov4rflow-hidden" ref={tableRef}>
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
                  onClick={() => handleSort('userId')}
                >
                  Customer {getSortIcon('userId')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('shippingAddress.state')}
                >
                  Location {getSortIcon('shippingAddress.state')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Items
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('total')}
                >
                  Amount {getSortIcon('total')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Payment Status
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
                    <div className="text-xs text-gray-500">{order.userId}</div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{order.shippingAddress.name}</div>
                        <div className="text-xs text-gray-500 truncate">{order.shippingAddress.mobileNo}</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{order.shippingAddress.state}</div>
                        <div className="text-xs text-gray-500 truncate whitespace-normal">
                          {order.shippingAddress.district}, {order.shippingAddress.taluk}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1 max-w-xs">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={item._id} className="flex items-center">
                          <FaBox className="text-gray-400 mr-2 text-xs flex-shrink-0" />
                          <span className="text-sm truncate">
                            {item.productName} ({item.seedName})
                          </span>
                          <span className="ml-2 text-xs text-gray-500 flex-shrink-0">×{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      <FaRupeeSign className="inline mr-1" />
                      {order.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-normal">
                      Subtotal: ₹{order.subtotal} | GST: ₹{order.gst}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment.status)}`}>
                      {formatStatus(order.payment.status)}
                    </span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crop care orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
                <div className="text-xs text-gray-500 truncate">{order.shippingAddress.name}</div>
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
                <div className="text-xs text-gray-500">User ID</div>
                <div className="font-medium text-xs truncate">{order.userId}</div>
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium text-xs truncate">{order.shippingAddress.state}</div>
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Total Amount</div>
                <div className="font-bold text-green-700 text-xs truncate">
                  <FaRupeeSign className="inline mr-1" />
                  {order.total.toLocaleString()}
                </div>
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Payment</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment.status)} truncate`}>
                  {formatStatus(order.payment.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="truncate">
                <div className="text-xs text-gray-500">Order Status</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)} truncate`}>
                  {formatStatus(order.orderStatus)}
                </span>
              </div>
              <div className="truncate">
                <div className="text-xs text-gray-500">Date</div>
                <div className="font-medium text-xs truncate">{formatDate(order.createdAt)}</div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedOrder === order._id && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                {/* Items Details */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Order Items ({order.items.length})</div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs truncate">{item.productName}</div>
                          <div className="text-xs text-gray-500 truncate">{item.seedName}</div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-bold text-xs">₹{item.seedPrice}</div>
                          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Location Details</div>
                  <div className="text-xs space-y-1">
                    <div className="truncate"><span className="font-medium">State:</span> {order.shippingAddress.state}</div>
                    <div className="truncate"><span className="font-medium">District:</span> {order.shippingAddress.district}</div>
                    <div className="truncate"><span className="font-medium">Taluk:</span> {order.shippingAddress.taluk}</div>
                    <div className="truncate"><span className="font-medium">Pincode:</span> {order.shippingAddress.pincode}</div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Subtotal</div>
                    <div className="text-xs">₹{order.subtotal}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">GST</div>
                    <div className="text-xs">₹{order.gst}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Shipping</div>
                    <div className="text-xs">₹{order.shipping}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-bold text-xs">₹{order.total}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination and Limit Controls */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded shadow mt44">
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
                      <span className="text-gray-600 text-sm">User ID:</span>
                      <span className="font-medium text-sm">{currentOrder.userId}</span>
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
                    <FaCreditCard className="text-green-600" />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentOrder.payment.status)}`}>
                        {formatStatus(currentOrder.payment.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Method:</span>
                      <span className="font-medium text-sm">{formatStatus(currentOrder.payment.method)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Amount Paid:</span>
                      <span className="font-bold text-green-700 text-sm">
                        <FaRupeeSign className="inline mr-1" />
                        {currentOrder.payment.amount.toLocaleString()}
                      </span>
                    </div>
                    {currentOrder.payment.razorpayOrderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Razorpay ID:</span>
                        <span className="font-medium text-xs truncate max-w-[120px]">
                          {currentOrder.payment.razorpayOrderId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded p-3">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaBox className="text-purple-600" />
                  Order Items ({currentOrder.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seed Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentOrder.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-3 py-2">
                            <div className="font-medium text-sm truncate">{item.productName}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {item.productId}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm truncate">{item.seedName}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {item.seedId}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="font-medium text-sm">
                              <FaRupeeSign className="inline mr-1" />
                              {item.seedPrice.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="font-medium text-sm">{item.quantity}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="font-bold text-green-700 text-sm">
                              <FaRupeeSign className="inline mr-1" />
                              {(item.seedPrice * item.quantity).toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Summary and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaRupeeSign className="text-gray-600" />
                    Price Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Subtotal:</span>
                      <span className="font-medium text-sm">
                        <FaRupeeSign className="inline mr-1" />
                        {currentOrder.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">GST (18%):</span>
                      <span className="font-medium text-sm">
                        <FaRupeeSign className="inline mr-1" />
                        {currentOrder.gst.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Shipping:</span>
                      <span className="font-medium text-sm">
                        <FaRupeeSign className="inline mr-1" />
                        {currentOrder.shipping.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-800 font-bold text-sm">Total Amount:</span>
                      <span className="font-bold text-green-700">
                        <FaRupeeSign className="inline mr-1" />
                        {currentOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <FaUser className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{currentOrder.shippingAddress.name}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaPhone className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="font-medium text-sm truncate">{currentOrder.shippingAddress.mobileNo}</div>
                    </div>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm mb-1">Address:</div>
                        <div className="text-sm truncate">{currentOrder.shippingAddress.address}</div>
                        <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                          <div className="truncate"><span className="font-medium">State:</span> {currentOrder.shippingAddress.state}</div>
                          <div className="truncate"><span className="font-medium">District:</span> {currentOrder.shippingAddress.district}</div>
                          <div className="truncate"><span className="font-medium">Taluk:</span> {currentOrder.shippingAddress.taluk}</div>
                          <div className="truncate"><span className="font-medium">Pincode:</span> {currentOrder.shippingAddress.pincode}</div>
                          {currentOrder.shippingAddress.landmark && (
                            <div className="truncate"><span className="font-medium">Landmark:</span> {currentOrder.shippingAddress.landmark}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

export default CropCareOrders;