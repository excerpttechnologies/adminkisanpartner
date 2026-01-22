










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
//   FaMapPin,
//   FaTruck,
//   FaUserTie,
//   FaUserFriends,
//   FaShippingFast,
//   FaGavel,
//   FaHandshake,
//   FaMoneyBillWave,
//   FaChartLine,
//   FaHistory,
//   FaWallet,
//   FaCreditCard as FaCreditCardAlt,
//   FaUserTag,
//   FaMobileAlt,
//   FaHome
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces
// interface PaymentHistory {
//   amount: number;
//   paymentMethod: string;
//   paidDate: string;
//   transactionId?: string;
// }

// interface TraderToAdminPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   paymentHistory: PaymentHistory[];
//   lastPaymentDate?: string;
//   nextPaymentDue?: string;
// }

// interface FarmerInfo {
//   farmerId?: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerAddress?: string;
//   farmerVillage?: string;
//   farmerPincode?: string;
//   farmerDistrict?: string;
// }

// interface Order {
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   traderToAdminPayment: TraderToAdminPayment;
//   createdAt: string;
//   updatedAt: string;
//   farmerId?: string;
//   farmerInfo?: FarmerInfo;
//   totalValue?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Order[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   summary?: {
//     totalOrders: number;
//     totalAmount: number;
//     totalPaid: number;
//     totalRemaining: number;
//     paidOrders: number;
//     partialOrders: number;
//     unpaidOrders: number;
//   };
//   error?: string;
//   message?: string;
// }

// const TestOrderPayments: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
  
//   // Filter states
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
//   const [traderIdFilter, setTraderIdFilter] = useState<string>('');
//   const [orderIdFilter, setOrderIdFilter] = useState<string>('');
//   const [minAmountFilter, setMinAmountFilter] = useState<string>('');
//   const [maxAmountFilter, setMaxAmountFilter] = useState<string>('');
  
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

//   // Farmer details cache
//   const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

//   const API_BASE ="/api";
//   const tableRef = useRef<HTMLDivElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const pageChangeInProgress = useRef<boolean>(false);

//   // Fetch farmer details
//   const fetchFarmerDetails = useCallback(async (farmerId: string): Promise<FarmerInfo> => {
//     if (farmerDetailsCache[farmerId]) {
//       return farmerDetailsCache[farmerId];
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/farmers?search=${farmerId}`);
      
//       if (response.data.success && response.data.data && response.data.data.length > 0) {
//         const farmerData = response.data.data[0];
        
//         // Build address from personalInfo
//         let address = '';
//         if (farmerData.personalInfo?.address) {
//           address = farmerData.personalInfo.address;
//         }
        
//         // Add village if available
//         if (farmerData.personalInfo?.villageGramaPanchayat) {
//           if (address) address += ', ';
//           address += farmerData.personalInfo.villageGramaPanchayat;
//         }
        
//         // Add district if available
//         if (farmerData.personalInfo?.district) {
//           if (address) address += ', ';
//           address += farmerData.personalInfo.district;
//         }
        
//         // Add pincode if available
//         if (farmerData.personalInfo?.pincode) {
//           if (address) address += ' - ';
//           address += farmerData.personalInfo.pincode;
//         }

//         const farmerInfo: FarmerInfo = {
//           farmerId: farmerData.farmerId,
//           farmerName: farmerData.personalInfo?.name || 'N/A',
//           farmerMobile: farmerData.personalInfo?.mobileNo || 'N/A',
//           farmerAddress: address || 'N/A',
//           farmerVillage: farmerData.personalInfo?.villageGramaPanchayat || 'N/A',
//           farmerPincode: farmerData.personalInfo?.pincode || 'N/A',
//           farmerDistrict: farmerData.personalInfo?.district || 'N/A'
//         };
        
//         // Update cache
//         setFarmerDetailsCache(prev => ({
//           ...prev,
//           [farmerId]: farmerInfo
//         }));
        
//         return farmerInfo;
//       }
//     } catch (error) {
//       console.error(`Error fetching farmer details for ${farmerId}:`, error);
//     }
    
//     // Return default if fetch fails
//     return {
//       farmerId,
//       farmerName: 'Not Found',
//       farmerMobile: 'N/A',
//       farmerAddress: 'N/A'
//     };
//   }, [API_BASE, farmerDetailsCache]);

//   // Fetch orders with server-side pagination and sorting - FIXED: Single API call
//   const fetchOrders = useCallback(async (isForExport = false) => {
//     if (!isForExport) {
//       setLoading(true);
//     }
    
//     const params = new URLSearchParams();
//     if (searchInput) params.append('search', searchInput);
//     if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
//     if (traderIdFilter) params.append('traderId', traderIdFilter);
//     if (orderIdFilter) params.append('orderId', orderIdFilter);
//     if (minAmountFilter) params.append('minAmount', minAmountFilter);
//     if (maxAmountFilter) params.append('maxAmount', maxAmountFilter);
    
//     // For export, get all data, for normal fetch, use pagination
//     if (!isForExport) {
//       params.append('page', currentPage.toString());
//       params.append('limit', itemsPerPage.toString());
//     } else {
//       params.append('limit', '10000');
//     }
    
//     params.append('sortBy', sortField);
//     params.append('order', sortOrder);

//     try {
//       const response = await axios.get(`${API_BASE}/order-payments?${params.toString()}`);
      
//       if (response.data.success) {
//         const data = response.data.data || [];
        
//         // Process orders and fetch farmer details
//         const processedOrders = await Promise.all(
//           data.map(async (order: Order) => {
//             if (order.farmerId) {
//               const farmerInfo = await fetchFarmerDetails(order.farmerId);
//               return {
//                 ...order,
//                 farmerInfo
//               };
//             }
//             return order;
//           })
//         );
        
//         if (isForExport) {
//           setAllOrders(processedOrders);
//           return processedOrders;
//         } else {
//           setOrders(processedOrders);
//           setTotalItemsState(response.data.pagination?.total || data.length);
//           setTotalPages(response.data.pagination?.totalPages || 1);
//         }
//       } else {
//         if (!isForExport) {
//           toast.error(response.data.error || 'Failed to fetch order payments');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching order payments:', error);
//       if (!isForExport) {
//         toast.error('Error fetching order payments');
//       }
//     } finally {
//       if (!isForExport) {
//         setLoading(false);
//         pageChangeInProgress.current = false;
//       }
//     }
    
//     return [];
//   }, [
//     API_BASE, 
//     searchInput, 
//     paymentStatusFilter, 
//     traderIdFilter, 
//     orderIdFilter, 
//     minAmountFilter, 
//     maxAmountFilter, 
//     currentPage, 
//     itemsPerPage, 
//     sortField, 
//     sortOrder, 
//     fetchFarmerDetails
//   ]);

//   // Separate function to fetch export data
//   const fetchExportData = useCallback(async () => {
//     try {
//       const exportData = await fetchOrders(true);
//       setAllOrders(exportData);
//       return exportData;
//     } catch (error) {
//       console.error('Error fetching export data:', error);
//       return [];
//     }
//   }, [fetchOrders]);

//   // Initial data fetch and when pagination/sorting changes
//   useEffect(() => {
//     fetchOrders();
//   }, [currentPage, itemsPerPage, sortField, sortOrder]);

//   // Debounced search for filters - FIXED: Added all filter dependencies
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1);
//       fetchOrders();
//     }, 500);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput, paymentStatusFilter, traderIdFilter, orderIdFilter, minAmountFilter, maxAmountFilter]);

//   // Get unique traders for filter dropdown
//   const getUniqueTraders = useMemo(() => {
//     const traders = allOrders.length > 0 ? allOrders : orders;
//     const uniqueTraders = traders
//       .map(order => ({ id: order.traderId, name: order.traderName }))
//       .filter((trader, index, self) => 
//         trader.id && 
//         trader.id.trim() !== '' && 
//         index === self.findIndex(t => t.id === trader.id)
//       );
//     return uniqueTraders.sort((a, b) => a.name.localeCompare(b.name));
//   }, [allOrders, orders]);

//   // Get unique order IDs for filter dropdown
//   const getUniqueOrderIds = useMemo(() => {
//     const orderList = allOrders.length > 0 ? allOrders : orders;
//     const orderIds = orderList
//       .map(order => order.orderId)
//       .filter(orderId => orderId && orderId.trim() !== '');
//     return [...new Set(orderIds)].sort();
//   }, [allOrders, orders]);

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

//   // Handle page change - FIXED: Added debounce and proper state handling
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     // Prevent multiple rapid clicks
//     if (pageChangeInProgress.current || value === currentPage) {
//       return;
//     }
    
//     pageChangeInProgress.current = true;
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

//   const handleCopyToClipboard = async (): Promise<void> => {
//     let ordersToExport = allOrders;
    
//     // If allOrders is empty, fetch export data
//     if (ordersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       ordersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (ordersToExport.length === 0) {
//       toast.error("No orders to copy");
//       return;
//     }

//     // Define headers with widths
//     const headers = [
//       { name: "Order ID", width: 12 },
//       { name: "Trader", width: 20 },
//       { name: "Farmer", width: 20 },
//       { name: "Amount", width: 15 },
//       { name: "Paid", width: 12 },
//       { name: "Due", width: 12 },
//       { name: "Status", width: 15 },
//       { name: "History", width: 10 },
//       { name: "Date", width: 12 }
//     ];
    
//     // Create header row
//     const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//     const separator = "─".repeat(headerRow.length);
    
//     // Format each payment row
//     const paymentRows = ordersToExport.map((order: any) => {
//       const payment = order.traderToAdminPayment || {};
      
//       // Format trader name with ID
//       const traderInfo = `${order.traderName || "N/A"} (${order.traderId || "N/A"})`;
//       const formattedTrader = traderInfo.length > 18 
//         ? traderInfo.substring(0, 15) + "..." 
//         : traderInfo;
      
//       // Format farmer info
//       const farmerInfo = order.farmerInfo ? 
//         `${order.farmerInfo.farmerName || "N/A"} (${order.farmerInfo.farmerId || "N/A"})` : 
//         "No Farmer";
//       const formattedFarmer = farmerInfo.length > 18 
//         ? farmerInfo.substring(0, 15) + "..." 
//         : farmerInfo;
      
//       // Format amounts with ₹ symbol and thousands separator
//       const formatCurrency = (amount: number) => 
//         `₹${(amount || 0).toLocaleString('en-IN')}`;
      
//       const totalAmount = formatCurrency(payment.totalAmount || 0);
//       const paidAmount = formatCurrency(payment.paidAmount || 0);
//       const dueAmount = formatCurrency(payment.remainingAmount || 0);
      
//       // Format payment status with emoji
//       const paymentStatus = payment.paymentStatus || "N/A";
//       const statusEmoji = paymentStatus === "paid" ? "✅" : 
//                         paymentStatus === "partial" ? "💰" : 
//                         paymentStatus === "pending" ? "⏳" : 
//                         paymentStatus === "unpaid" ? "❌" : "";
      
//       // Get payment history count
//       const historyCount = payment.paymentHistory?.length || 0;
//       const historyText = historyCount > 0 ? `${historyCount} 📋` : "0";
      
//       // Create row values with padding
//       const rowValues = [
//         (order.orderId || "").padEnd(headers[0].width),
//         formattedTrader.padEnd(headers[1].width),
//         formattedFarmer.padEnd(headers[2].width),
//         totalAmount.padEnd(headers[3].width),
//         paidAmount.padEnd(headers[4].width),
//         dueAmount.padEnd(headers[5].width),
//         `${statusEmoji} ${paymentStatus}`.padEnd(headers[6].width),
//         historyText.padEnd(headers[7].width),
//         (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A").padEnd(headers[8].width)
//       ];
      
//       return rowValues.join(" │ ");
//     });
    
//     // Calculate financial statistics
//     const totals = ordersToExport.reduce((acc: any, order: any) => {
//       const payment = order.traderToAdminPayment || {};
//       acc.totalAmount += payment.totalAmount || 0;
//       acc.paidAmount += payment.paidAmount || 0;
//       acc.dueAmount += payment.remainingAmount || 0;
//       return acc;
//     }, { totalAmount: 0, paidAmount: 0, dueAmount: 0 });
    
//     const statusCounts = ordersToExport.reduce((acc: any, order: any) => {
//       const status = order.traderToAdminPayment?.paymentStatus || "unknown";
//       acc[status] = (acc[status] || 0) + 1;
//       return acc;
//     }, {});
    
//     // Build complete table with summary
//     const tableContent = [
//       "💰 TRADER PAYMENTS SUMMARY",
//       "=".repeat(headerRow.length),
//       headerRow,
//       separator,
//       ...paymentRows,
//       separator,
//       "",
//       "📊 FINANCIAL SUMMARY",
//       `• Total Orders: ${ordersToExport.length}`,
//       `• Total Billed Amount: ₹${totals.totalAmount.toLocaleString('en-IN')}`,
//       `• Total Paid Amount: ₹${totals.paidAmount.toLocaleString('en-IN')}`,
//       `• Total Due Amount: ₹${totals.dueAmount.toLocaleString('en-IN')}`,
//       `• Collection Rate: ${totals.totalAmount > 0 ? Math.round((totals.paidAmount / totals.totalAmount) * 100) : 0}%`,
//       "",
//       "👥 FARMER STATISTICS",
//       `• Total Farmers: ${[...new Set(ordersToExport.map(o => o.farmerId).filter(Boolean))].length}`,
//       `• Orders with Farmers: ${ordersToExport.filter(o => o.farmerId).length}`,
//       "",
//       "📈 PAYMENT STATUS DISTRIBUTION",
//       ...Object.entries(statusCounts).map(([status, count]: [string, any]) => 
//         `• ${status}: ${count} (${Math.round((count / ordersToExport.length) * 100)}%)`
//       ),
//       "",
//       "💳 PAYMENT HISTORY",
//       `• Total Transactions: ${ordersToExport.reduce((sum: number, order: any) => 
//         sum + (order.traderToAdminPayment?.paymentHistory?.length || 0), 0)}`,
//       `• Average Transactions per Order: ${Math.round(
//         ordersToExport.reduce((sum: number, order: any) => 
//           sum + (order.traderToAdminPayment?.paymentHistory?.length || 0), 0) / ordersToExport.length
//       )}`,
//       "",
//       `📅 Report Generated: ${new Date().toLocaleString()}`
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success(`Copied ${ordersToExport.length} payment records!`);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = async () => {
//     let ordersToExport = allOrders;
    
//     // If allOrders is empty, fetch export data
//     if (ordersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       ordersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (ordersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const data = ordersToExport.map((order) => {
//       const payment = order.traderToAdminPayment;
//       return {
//         "Order ID": order.orderId,
//         "Trader ID": order.traderId,
//         "Trader Name": order.traderName,
//         "Farmer ID": order.farmerInfo?.farmerId || 'N/A',
//         "Farmer Name": order.farmerInfo?.farmerName || 'N/A',
//         "Farmer Mobile": order.farmerInfo?.farmerMobile || 'N/A',
//         "Farmer Address": order.farmerInfo?.farmerAddress || 'N/A',
//         "Total Amount": payment.totalAmount,
//         "Paid Amount": payment.paidAmount,
//         "Remaining Amount": payment.remainingAmount,
//         "Payment Status": payment.paymentStatus,
//         "Payment History Count": payment.paymentHistory.length,
//         "Last Payment Date": payment.lastPaymentDate ? new Date(payment.lastPaymentDate).toLocaleString() : 'N/A',
//         "Next Payment Due": payment.nextPaymentDue ? new Date(payment.nextPaymentDue).toLocaleString() : 'N/A',
//         "Created At": new Date(order.createdAt).toLocaleString(),
//         "Updated At": new Date(order.updatedAt).toLocaleString(),
//         "Payment Percentage": payment.totalAmount > 0 ? ((payment.paidAmount / payment.totalAmount) * 100).toFixed(2) + "%" : "0%",
//         "Payment Completion": payment.remainingAmount === 0 ? "Fully Paid" : "Pending"
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Order Payments");
//     writeFile(wb, `order-payments-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = async () => {
//     let ordersToExport = allOrders;
    
//     // If allOrders is empty, fetch export data
//     if (ordersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       ordersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (ordersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }
    
//     const headers = ["Order ID", "Trader Name", "Farmer Name", "Total Amount", "Paid Amount", "Remaining", "Status", "Payment History", "Date"];
    
//     const csvContent = [
//       headers.join(","),
//       ...ordersToExport.map((order) => {
//         const payment = order.traderToAdminPayment;
//         return [
//           `"${order.orderId}"`,
//           `"${order.traderName}"`,
//           `"${order.farmerInfo?.farmerName || 'N/A'}"`,
//           payment.totalAmount,
//           payment.paidAmount,
//           payment.remainingAmount,
//           `"${payment.paymentStatus}"`,
//           payment.paymentHistory.length,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `order-payments-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = async () => {
//     let ordersToExport = allOrders;
    
//     // If allOrders is empty, fetch export data
//     if (ordersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       ordersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (ordersToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }
    
//     const doc = new jsPDF('landscape');
//     doc.text("Order Payments Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Trader", "Farmer", "Total", "Paid", "Remaining", "Status", "History", "Date"];
//     const tableRows: any = ordersToExport.map((order) => {
//       const payment = order.traderToAdminPayment;
//       return [
//         order.orderId,
//         order.traderName,
//         order.farmerInfo?.farmerName || 'N/A',
//         `₹${payment.totalAmount.toLocaleString()}`,
//         `₹${payment.paidAmount.toLocaleString()}`,
//         `₹${payment.remainingAmount.toLocaleString()}`,
//         payment.paymentStatus,
//         payment.paymentHistory.length,
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
    
//     doc.save(`order-payments-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = async () => {
//     let ordersToExport = allOrders;
    
//     // If allOrders is empty, fetch export data
//     if (ordersToExport.length === 0) {
//       toast.loading("Fetching data for export...", { id: "export" });
//       ordersToExport = await fetchExportData();
//       toast.dismiss("export");
//     }
    
//     if (ordersToExport.length === 0) {
//       toast.error("No data to print");
//       return;
//     }
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Order Payments Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
//           .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
//           .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
//           .summary-item { text-align: center; }
//           .summary-value { font-size: 20px; font-weight: bold; color: #1f2937; }
//           .summary-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .status-paid { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-partial { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-unpaid { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
//           .farmer-label { font-weight: bold; color: #166534; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Order Payments Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
        
//         <div class="summary">
//           <h3>Payment Summary</h3>
//           <div class="summary-grid">
//             <div class="summary-item">
//               <div class="summary-value">${ordersToExport.length}</div>
//               <div class="summary-label">Total Orders</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.totalAmount, 0).toLocaleString()}</div>
//               <div class="summary-label">Total Amount</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.paidAmount, 0).toLocaleString()}</div>
//               <div class="summary-label">Total Paid</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.remainingAmount, 0).toLocaleString()}</div>
//               <div class="summary-label">Total Remaining</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">${ordersToExport.filter(o => o.traderToAdminPayment.paymentStatus === 'paid').length}</div>
//               <div class="summary-label">Fully Paid</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">${ordersToExport.filter(o => o.traderToAdminPayment.paymentStatus === 'partial').length}</div>
//               <div class="summary-label">Partial Payments</div>
//             </div>
//           </div>
//         </div>
        
//         <p>Total Records: ${ordersToExport.length}</p>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Trader</th>
//               <th>Farmer</th>
//               <th>Total Amount</th>
//               <th>Paid Amount</th>
//               <th>Remaining Amount</th>
//               <th>Payment Status</th>
//               <th>Payment History</th>
//               <th>Created Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${ordersToExport.map((order) => {
//               const payment = order.traderToAdminPayment;
//               const statusClass = `status-${payment.paymentStatus}`;
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${order.traderName}<br><small>ID: ${order.traderId}</small></td>
//                   <td>
//                     ${order.farmerInfo ? `
//                       <div class="farmer-info">
//                         <div><span class="farmer-label">Name:</span> ${order.farmerInfo.farmerName}</div>
//                         <div><span class="farmer-label">ID:</span> ${order.farmerInfo.farmerId}</div>
//                         <div><span class="farmer-label">Mobile:</span> ${order.farmerInfo.farmerMobile}</div>
//                         <div><span class="farmer-label">Address:</span> ${order.farmerInfo.farmerAddress}</div>
//                       </div>
//                     ` : 'No Farmer'}
//                   </td>
//                   <td>₹${payment.totalAmount.toLocaleString()}</td>
//                   <td>₹${payment.paidAmount.toLocaleString()}</td>
//                   <td>₹${payment.remainingAmount.toLocaleString()}</td>
//                   <td><span class="${statusClass}">${payment.paymentStatus.toUpperCase()}</span></td>
//                   <td>${payment.paymentHistory.length} payments</td>
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
//     toast.success("Printing order payments report...");
//   };

//   // Payment status badge colors
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'paid':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'partial':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'unpaid':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'pending':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
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

//   // Calculate payment percentage
//   const calculatePaymentPercentage = (paid: number, total: number) => {
//     if (total === 0) return 0;
//     return Math.round((paid / total) * 100);
//   };

//   // Open details dialog
//   const openDetailsDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setPaymentStatusFilter('');
//     setTraderIdFilter('');
//     setOrderIdFilter('');
//     setMinAmountFilter('');
//     setMaxAmountFilter('');
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
//     const ordersForStats = allOrders.length > 0 ? allOrders : orders;
//     const totalOrders = ordersForStats.length;
//     const totalAmount = ordersForStats.reduce((sum, order) => sum + order.traderToAdminPayment.totalAmount, 0);
//     const totalPaid = ordersForStats.reduce((sum, order) => sum + order.traderToAdminPayment.paidAmount, 0);
//     const totalRemaining = ordersForStats.reduce((sum, order) => sum + order.traderToAdminPayment.remainingAmount, 0);
    
//     const paidOrders = ordersForStats.filter(o => o.traderToAdminPayment.paymentStatus === 'paid').length;
//     const partialOrders = ordersForStats.filter(o => o.traderToAdminPayment.paymentStatus === 'partial').length;
//     const unpaidOrders = ordersForStats.filter(o => o.traderToAdminPayment.paymentStatus === 'unpaid').length;
    
//     const totalPayments = ordersForStats.reduce((sum, order) => sum + order.traderToAdminPayment.paymentHistory.length, 0);
//     const averagePayment = totalPayments > 0 ? totalPaid / totalPayments : 0;
    
//     return { 
//       totalOrders, 
//       totalAmount, 
//       totalPaid, 
//       totalRemaining, 
//       paidOrders, 
//       partialOrders, 
//       unpaidOrders,
//       totalPayments,
//       averagePayment
//     };
//   };

//   const { totalOrders, totalAmount, totalPaid, totalRemaining, paidOrders, partialOrders, unpaidOrders, totalPayments, averagePayment } = calculateStats();
//   const { startItem, endItem } = getPaginationRange();

//   if (loading && orders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading order payments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaWallet className="text-blue-600" />
//           Order Payments Report
//         </h1>
//         <p className="text-gray-600 mt-1">Monitor trader to admin payment status, history, and reconciliation</p>
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
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Amount</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
//             </div>
//             <FaMoneyBillWave className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Paid</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
//             </div>
//             <FaCheckCircle className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Remaining</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
//             </div>
//             <FaTimesCircle className="text-red-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Fully Paid Orders</p>
//               <p className="text-xl font-bold text-gray-900">{paidOrders}</p>
//             </div>
//             <FaWallet className="text-yellow-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Payments</p>
//               <p className="text-xl font-bold text-gray-900">{totalPayments}</p>
//             </div>
//             <FaHistory className="text-purple-500 text-xl" />
//           </div>
//         </div>
//       </div>

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
//               placeholder="Search by order ID, trader name..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </div>

//           {/* Order ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaReceipt className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={orderIdFilter}
//               onChange={(e) => setOrderIdFilter(e.target.value)}
//             >
//               <option value="">All Orders</option>
//               {getUniqueOrderIds.map((orderId) => (
//                 <option key={orderId} value={orderId}>
//                   {orderId}
//                 </option>
//               ))}
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
//               <option value="">All Status</option>
//               <option value="paid">Paid</option>
//               <option value="partial">Partial</option>
//               <option value="unpaid">Unpaid</option>
//               <option value="pending">Pending</option>
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
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Trader Details
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Farmer Details
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
//                   onClick={() => handleSort('traderToAdminPayment.totalAmount')}
//                 >
//                   Payment Details {getSortIcon('traderToAdminPayment.totalAmount')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Payment Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Payment History
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
//               {orders.map((order,i) => {
//                 const payment = order.traderToAdminPayment;
//                 const paymentPercentage = calculatePaymentPercentage(payment.paidAmount, payment.totalAmount);
                
//                 return (
//                   <tr key={i} className="hover:bg-gray-50 transition-colors">
//                     {/* Order ID */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
//                       <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
//                     </td>

//                     {/* Trader Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaUserTie className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium text-gray-900 truncate">{order.traderName}</div>
//                           <div className="text-xs text-gray-500 truncate">{order.traderId}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Farmer Details */}
//                     <td className="px-4 py-3">
//                       {order.farmerInfo ? (
//                         <div className="space-y-1 min-w-0">
//                           {/* Farmer ID and Name */}
//                           <div className="flex items-center">
//                             <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
//                             <div className="min-w-0">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {order.farmerInfo.farmerName}
//                               </div>
//                               <div className="text-xs text-gray-500 truncate">
//                                 ID: {order.farmerInfo.farmerId}
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Mobile Number */}
//                           {order.farmerInfo.farmerMobile !== 'N/A' && (
//                             <div className="flex items-center text-xs text-gray-600 ml-6">
//                               <FaMobileAlt className="mr-1 flex-shrink-0" />
//                               <span className="truncate">{order.farmerInfo.farmerMobile}</span>
//                             </div>
//                           )}
                          
//                           {/* Address */}
//                           {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
//                             <div className="flex items-start text-xs text-gray-600 ml-6">
//                               <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                               <span className="truncate">{order.farmerInfo.farmerAddress}</span>
//                             </div>
//                           )}
                          
//                           {/* Show when no address is available */}
//                           {(order.farmerInfo.farmerAddress === 'N/A' || order.farmerInfo.farmerAddress === '') && (
//                             <div className="flex items-center text-xs text-gray-400 italic ml-6">
//                               <FaHome className="mr-1 flex-shrink-0" />
//                               <span>No address available</span>
//                             </div>
//                           )}
//                         </div>
//                       ) : order.farmerId ? (
//                         <div className="text-xs text-gray-500 italic">
//                           Loading farmer details...
//                         </div>
//                       ) : (
//                         <div className="text-xs text-gray-400 italic">
//                           No farmer assigned
//                         </div>
//                       )}
//                     </td>

//                     {/* Payment Details */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Total:</span>
//                           <span className="text-sm font-semibold">{formatCurrency(payment.totalAmount)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Paid:</span>
//                           <span className="text-sm font-semibold text-green-600">{formatCurrency(payment.paidAmount)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Remaining:</span>
//                           <span className={`text-sm font-semibold ${payment.remainingAmount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
//                             {formatCurrency(payment.remainingAmount)}
//                           </span>
//                         </div>
//                         {/* Progress bar */}
//                         <div className="w-full bg-gray-200 rounded-full h-1.5">
//                           <div 
//                             className="bg-green-600 h-1.5 rounded-full" 
//                             style={{ width: `${paymentPercentage}%` }}
//                           ></div>
//                         </div>
//                         <div className="text-xs text-gray-500 text-right">
//                           {paymentPercentage}% paid
//                         </div>
//                       </div>
//                     </td>

//                     {/* Payment Status */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.paymentStatus)}`}>
//                         {formatStatus(payment.paymentStatus)}
//                       </span>
//                       {payment.remainingAmount === 0 && (
//                         <div className="mt-1 text-xs text-green-600 flex items-center">
//                           <FaCheckCircle className="mr-1" /> Fully Paid
//                         </div>
//                       )}
//                     </td>

//                     {/* Payment History */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center">
//                         <FaHistory className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{payment.paymentHistory.length}</div>
//                           <div className="text-xs text-gray-500">payments</div>
//                         </div>
//                       </div>
//                       {payment.lastPaymentDate && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           Last: {formatDate(payment.lastPaymentDate)}
//                         </div>
//                       )}
//                     </td>

//                     {/* Date */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaCalendarAlt className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</div>
//                           <div className="text-xs text-gray-500">{formatDate(order.updatedAt)}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Actions - View Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <button
//                         onClick={() => openDetailsDialog(order)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
//                         title="View Payment Details"
//                       >
//                         <FaEye />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* No Data State */}
//         {orders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-4xl mb-4">
//               <FaWallet className="mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No order payments found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-3">
//         {orders.map((order,i) => {
//           const payment = order.traderToAdminPayment;
//           const paymentPercentage = calculatePaymentPercentage(payment.paidAmount, payment.totalAmount);
          
//           return (
//             <div key={i} className="bg-white rounded-lg shadow p-3">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="min-w-0 flex-1">
//                   <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
//                   <div className="text-xs text-gray-500 truncate">{order.traderName}</div>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => openDetailsDialog(order)}
//                     className="text-blue-600 p-1"
//                     title="View Details"
//                   >
//                     <FaEye />
//                   </button>
//                   <button
//                     onClick={() => setExpandedOrder(
//                       expandedOrder === order.orderId 
//                         ? null 
//                         : order.orderId
//                     )}
//                     className="text-gray-500 p-1"
//                     title={expandedOrder === order.orderId ? "Collapse" : "Expand"}
//                   >
//                     {expandedOrder === order.orderId ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                 </div>
//               </div>

//               {/* Farmer Info in Mobile View */}
//               {order.farmerInfo && (
//                 <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-green-500">
//                   <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium truncate">{order.farmerInfo.farmerName}</div>
//                         <div className="text-xs text-gray-500 truncate">ID: {order.farmerInfo.farmerId}</div>
//                       </div>
//                     </div>
//                     {order.farmerInfo.farmerMobile !== 'N/A' && (
//                       <div className="flex items-center text-xs text-gray-600 ml-6">
//                         <FaMobileAlt className="mr-1 flex-shrink-0" />
//                         <span className="truncate">{order.farmerInfo.farmerMobile}</span>
//                       </div>
//                     )}
//                     {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
//                       <div className="flex items-start text-xs text-gray-600 ml-6">
//                         <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                         <span className="truncate">{order.farmerInfo.farmerAddress}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Total Amount</div>
//                   <div className="font-bold text-sm truncate">{formatCurrency(payment.totalAmount)}</div>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Trader ID</div>
//                   <div className="font-medium text-xs truncate">{order.traderId}</div>
//                 </div>
//               </div>

//               <div className="mb-2">
//                 <div className="text-xs text-gray-500 mb-1">Payment Progress</div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex-1 bg-gray-200 rounded-full h-1.5">
//                     <div 
//                       className="bg-green-600 h-1.5 rounded-full" 
//                       style={{ width: `${paymentPercentage}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-xs font-medium">{paymentPercentage}%</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Payment Status</div>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.paymentStatus)} truncate`}>
//                     {formatStatus(payment.paymentStatus)}
//                   </span>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Payments</div>
//                   <div className="font-medium text-xs truncate">{payment.paymentHistory.length}</div>
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {expandedOrder === order.orderId && (
//                 <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
//                   {/* Farmer Details in Expanded View */}
//                   {order.farmerInfo && (
//                     <div className="bg-green-50 p-2 rounded">
//                       <div className="text-xs text-gray-500 mb-2">Farmer Information</div>
//                       <div className="space-y-2">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <div className="text-xs text-gray-600">Name</div>
//                             <div className="text-sm font-medium">{order.farmerInfo.farmerName}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-600">ID</div>
//                             <div className="text-sm font-medium">{order.farmerInfo.farmerId}</div>
//                           </div>
//                         </div>
//                         {order.farmerInfo.farmerMobile !== 'N/A' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Mobile</div>
//                             <div className="text-sm font-medium">{order.farmerInfo.farmerMobile}</div>
//                           </div>
//                         )}
//                         {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Address</div>
//                             <div className="text-sm font-medium">{order.farmerInfo.farmerAddress}</div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Amount Details */}
//                   <div>
//                     <div className="text-xs text-gray-500 mb-2">Payment Breakdown</div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Paid Amount:</span>
//                         <span className="text-sm font-bold text-green-600">{formatCurrency(payment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Remaining Amount:</span>
//                         <span className={`text-sm font-bold ${payment.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                           {formatCurrency(payment.remainingAmount)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment History */}
//                   {payment.paymentHistory.length > 0 && (
//                     <div>
//                       <div className="text-xs text-gray-500 mb-2">Recent Payments ({payment.paymentHistory.length})</div>
//                       <div className="space-y-2 max-h-40 overflow-y-auto">
//                         {payment.paymentHistory.slice(0, 3).map((paymentItem, index) => (
//                           <div key={index} className="bg-gray-50 p-2 rounded text-xs">
//                             <div className="flex justify-between items-center">
//                               <span className="font-medium">{formatCurrency(paymentItem.amount)}</span>
//                               <span className="text-gray-600 capitalize">{paymentItem.paymentMethod}</span>
//                             </div>
//                             <div className="text-gray-500 mt-1">{formatDate(paymentItem.paidDate)}</div>
//                           </div>
//                         ))}
//                         {payment.paymentHistory.length > 3 && (
//                           <div className="text-xs text-blue-600 text-center">
//                             +{payment.paymentHistory.length - 3} more payments
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Timeline */}
//                   <div className="bg-gray-50 p-2 rounded">
//                     <div className="text-xs text-gray-500 mb-1">Order Timeline</div>
//                     <div className="text-xs space-y-1">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Created:</span>
//                         <span>{formatDate(order.createdAt)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Updated:</span>
//                         <span>{formatDate(order.updatedAt)}</span>
//                       </div>
//                       {payment.lastPaymentDate && (
//                         <div className="flex justify-between text-green-600">
//                           <span>Last Payment:</span>
//                           <span>{formatDate(payment.lastPaymentDate)}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
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

//       {/* Order Payment Details Dialog */}
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
//                 <FaWallet className="text-blue-600 flex-shrink-0" />
//                 <span className="truncate">Payment Details: {currentOrder?.orderId}</span>
//               </h2>
//               <p className="text-gray-600 text-sm truncate">Complete payment information and history</p>
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
//             <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
//               {/* Payment Header */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-blue-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaReceipt className="text-blue-600" />
//                     Order Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Order ID:</span>
//                       <span className="font-medium text-sm">{currentOrder.orderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader ID:</span>
//                       <span className="font-medium text-sm">{currentOrder.traderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader Name:</span>
//                       <span className="font-medium text-sm">{currentOrder.traderName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Created:</span>
//                       <span className="font-medium text-sm">{formatDateTime(currentOrder.createdAt)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Farmer Information Section */}
//                 {currentOrder.farmerInfo && (
//                   <div className="bg-green-50 p-3 rounded">
//                     <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                       <FaUserTag className="text-green-600" />
//                       Farmer Information
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Farmer ID:</span>
//                         <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerId}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Name:</span>
//                         <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerName}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Mobile:</span>
//                         <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerMobile}</span>
//                       </div>
//                       {currentOrder.farmerInfo.farmerAddress && currentOrder.farmerInfo.farmerAddress !== 'N/A' && (
//                         <div>
//                           <div className="text-gray-600 text-sm mb-1">Address:</div>
//                           <div className="font-medium text-sm text-gray-900">
//                             {currentOrder.farmerInfo.farmerAddress}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="bg-yellow-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaCreditCardAlt className="text-yellow-600" />
//                     Payment Summary
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Payment Status:</span>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentOrder.traderToAdminPayment.paymentStatus)}`}>
//                         {formatStatus(currentOrder.traderToAdminPayment.paymentStatus)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Payment Progress:</span>
//                       <span className="font-medium text-sm">
//                         {calculatePaymentPercentage(
//                           currentOrder.traderToAdminPayment.paidAmount,
//                           currentOrder.traderToAdminPayment.totalAmount
//                         )}%
//                       </span>
//                     </div>
//                     {currentOrder.traderToAdminPayment.lastPaymentDate && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Last Payment:</span>
//                         <span className="font-medium text-sm">
//                           {formatDate(currentOrder.traderToAdminPayment.lastPaymentDate)}
//                         </span>
//                       </div>
//                     )}
//                     {currentOrder.traderToAdminPayment.nextPaymentDue && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 text-sm">Next Payment Due:</span>
//                         <span className="font-medium text-sm">
//                           {formatDate(currentOrder.traderToAdminPayment.nextPaymentDue)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Amount Details */}
//               <div className="bg-gray-50 p-3 rounded">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaMoneyBillWave className="text-purple-600" />
//                   Amount Details
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div className="text-center p-3 bg-white rounded border">
//                       <div className="text-xs text-gray-500 mb-1">Total Amount</div>
//                       <div className="text-lg font-bold text-gray-900">
//                         {formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded border border-green-200">
//                       <div className="text-xs text-gray-500 mb-1">Paid Amount</div>
//                       <div className="text-lg font-bold text-green-600">
//                         {formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}
//                       </div>
//                     </div>
//                     <div className={`text-center p-3 bg-white rounded border ${
//                       currentOrder.traderToAdminPayment.remainingAmount > 0 
//                         ? 'border-red-200' 
//                         : 'border-green-200'
//                     }`}>
//                       <div className="text-xs text-gray-500 mb-1">Remaining Amount</div>
//                       <div className={`text-lg font-bold ${
//                         currentOrder.traderToAdminPayment.remainingAmount > 0 
//                           ? 'text-red-600' 
//                           : 'text-green-600'
//                       }`}>
//                         {formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Payment Progress */}
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-xs text-gray-600">Payment Progress</span>
//                       <span className="text-xs font-medium">
//                         {calculatePaymentPercentage(
//                           currentOrder.traderToAdminPayment.paidAmount,
//                           currentOrder.traderToAdminPayment.totalAmount
//                         )}% Complete
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-600 h-2 rounded-full" 
//                         style={{ 
//                           width: `${calculatePaymentPercentage(
//                             currentOrder.traderToAdminPayment.paidAmount,
//                             currentOrder.traderToAdminPayment.totalAmount
//                           )}%` 
//                         }}
//                       ></div>
//                     </div>
//                     <div className="flex justify-between text-xs text-gray-500 mt-1">
//                       <span>0%</span>
//                       <span>50%</span>
//                       <span>100%</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment History */}
//               {currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
//                 <div className="bg-indigo-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaHistory className="text-indigo-600" />
//                     Payment History ({currentOrder.traderToAdminPayment.paymentHistory.length})
//                   </h3>
//                   <div className="space-y-2">
//                     {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
//                       <div key={index} className="bg-white p-3 rounded border border-gray-200">
//                         <div className="flex justify-between items-center mb-2">
//                           <div className="font-bold text-lg text-blue-600">
//                             {formatCurrency(payment.amount)}
//                           </div>
//                           <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
//                             {payment.paymentMethod}
//                           </span>
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           <div className="flex justify-between">
//                             <span>Paid Date:</span>
//                             <span className="font-medium">{formatDateTime(payment.paidDate)}</span>
//                           </div>
//                           {payment.transactionId && (
//                             <div className="mt-1">
//                               <span className="text-gray-500">Transaction ID:</span>
//                               <div className="font-mono text-xs break-all">{payment.transactionId}</div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Payment Summary */}
//               <div className="bg-yellow-50 p-3 rounded">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaChartLine className="text-yellow-600" />
//                   Payment Summary
//                 </h3>
//                 <div className="text-sm space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Total Payments Made:</span>
//                     <span className="font-bold">{currentOrder.traderToAdminPayment.paymentHistory.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Payment Completion:</span>
//                     <span className={`font-bold ${
//                       currentOrder.traderToAdminPayment.remainingAmount === 0 
//                         ? 'text-green-600' 
//                         : 'text-yellow-600'
//                     }`}>
//                       {currentOrder.traderToAdminPayment.remainingAmount === 0 
//                         ? 'Fully Paid' 
//                         : `${formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)} Pending`}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Collection Rate:</span>
//                     <span className="font-bold">
//                       {calculatePaymentPercentage(
//                         currentOrder.traderToAdminPayment.paidAmount,
//                         currentOrder.traderToAdminPayment.totalAmount
//                       )}%
//                     </span>
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

// export default TestOrderPayments;



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
  FaMapPin,
  FaTruck,
  FaUserTie,
  FaUserFriends,
  FaShippingFast,
  FaGavel,
  FaHandshake,
  FaMoneyBillWave,
  FaChartLine,
  FaHistory,
  FaWallet,
  FaCreditCard as FaCreditCardAlt,
  FaUserTag,
  FaMobileAlt,
  FaHome
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface PaymentHistory {
  amount: number;
  paymentMethod: string;
  paidDate: string;
  transactionId?: string;
}

interface TraderToAdminPayment {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentHistory: PaymentHistory[];
  lastPaymentDate?: string;
  nextPaymentDue?: string;
}

interface FarmerInfo {
  farmerId?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerAddress?: string;
  farmerVillage?: string;
  farmerPincode?: string;
  farmerDistrict?: string;
}

interface Order {
  orderId: string;
  traderId: string;
  traderName: string;
  traderToAdminPayment: TraderToAdminPayment;
  createdAt: string;
  updatedAt: string;
  farmerId?: string;
  farmerInfo?: FarmerInfo;
  totalValue?: number;
}

interface ApiResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    totalOrders: number;
    totalAmount: number;
    totalPaid: number;
    totalRemaining: number;
    paidOrders: number;
    partialOrders: number;
    unpaidOrders: number;
  };
  error?: string;
  message?: string;
}

const TestOrderPayments: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [traderIdFilter, setTraderIdFilter] = useState<string>('');
  const [orderIdFilter, setOrderIdFilter] = useState<string>('');
  const [minAmountFilter, setMinAmountFilter] = useState<string>('');
  const [maxAmountFilter, setMaxAmountFilter] = useState<string>('');
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItemsState, setTotalItemsState] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Stats states - FIXED: Added separate stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalRemaining: 0,
    paidOrders: 0,
    partialOrders: 0,
    unpaidOrders: 0,
    totalPayments: 0,
    averagePayment: 0
  });
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Mobile view state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Farmer details cache
  const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

  const API_BASE ="/api";
  const tableRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pageChangeInProgress = useRef<boolean>(false);

  // Fetch farmer details
  const fetchFarmerDetails = useCallback(async (farmerId: string): Promise<FarmerInfo> => {
    if (farmerDetailsCache[farmerId]) {
      return farmerDetailsCache[farmerId];
    }

    try {
      const response = await axios.get(`${API_BASE}/farmers?search=${farmerId}`);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const farmerData = response.data.data[0];
        
        // Build address from personalInfo
        let address = '';
        if (farmerData.personalInfo?.address) {
          address = farmerData.personalInfo.address;
        }
        
        // Add village if available
        if (farmerData.personalInfo?.villageGramaPanchayat) {
          if (address) address += ', ';
          address += farmerData.personalInfo.villageGramaPanchayat;
        }
        
        // Add district if available
        if (farmerData.personalInfo?.district) {
          if (address) address += ', ';
          address += farmerData.personalInfo.district;
        }
        
        // Add pincode if available
        if (farmerData.personalInfo?.pincode) {
          if (address) address += ' - ';
          address += farmerData.personalInfo.pincode;
        }

        const farmerInfo: FarmerInfo = {
          farmerId: farmerData.farmerId,
          farmerName: farmerData.personalInfo?.name || 'N/A',
          farmerMobile: farmerData.personalInfo?.mobileNo || 'N/A',
          farmerAddress: address || 'N/A',
          farmerVillage: farmerData.personalInfo?.villageGramaPanchayat || 'N/A',
          farmerPincode: farmerData.personalInfo?.pincode || 'N/A',
          farmerDistrict: farmerData.personalInfo?.district || 'N/A'
        };
        
        // Update cache
        setFarmerDetailsCache(prev => ({
          ...prev,
          [farmerId]: farmerInfo
        }));
        
        return farmerInfo;
      }
    } catch (error) {
      console.error(`Error fetching farmer details for ${farmerId}:`, error);
    }
    
    // Return default if fetch fails
    return {
      farmerId,
      farmerName: 'Not Found',
      farmerMobile: 'N/A',
      farmerAddress: 'N/A'
    };
  }, [API_BASE, farmerDetailsCache]);

  // Fetch orders with server-side pagination and sorting - UPDATED: Get stats from API
  const fetchOrders = useCallback(async (isForExport = false) => {
    if (!isForExport) {
      setLoading(true);
    }
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
    if (traderIdFilter) params.append('traderId', traderIdFilter);
    if (orderIdFilter) params.append('orderId', orderIdFilter);
    if (minAmountFilter) params.append('minAmount', minAmountFilter);
    if (maxAmountFilter) params.append('maxAmount', maxAmountFilter);
    
    // For export, get all data, for normal fetch, use pagination
    if (!isForExport) {
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
    } else {
      params.append('limit', '10000');
    }
    
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    try {
      const response = await axios.get(`${API_BASE}/order-payments?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        
        // Process orders and fetch farmer details
        const processedOrders = await Promise.all(
          data.map(async (order: Order) => {
            if (order.farmerId) {
              const farmerInfo = await fetchFarmerDetails(order.farmerId);
              return {
                ...order,
                farmerInfo
              };
            }
            return order;
          })
        );
        
        if (isForExport) {
          setAllOrders(processedOrders);
          return processedOrders;
        } else {
          setOrders(processedOrders);
          setTotalItemsState(response.data.pagination?.total || data.length);
          setTotalPages(response.data.pagination?.totalPages || 1);
          
          // FIXED: Update stats from API response or calculate from all data
          if (response.data.summary) {
            // Use stats from API if available
            const apiSummary = response.data.summary;
            setStats({
              totalOrders: apiSummary.totalOrders,
              totalAmount: apiSummary.totalAmount,
              totalPaid: apiSummary.totalPaid,
              totalRemaining: apiSummary.totalRemaining,
              paidOrders: apiSummary.paidOrders,
              partialOrders: apiSummary.partialOrders,
              unpaidOrders: apiSummary.unpaidOrders,
              totalPayments: 0, // These will be calculated separately
              averagePayment: 0
            });
          } else {
            // Calculate from current page data (temporary until we fetch all data for stats)
            const currentPageStats = calculateStatsFromOrders(processedOrders);
            // Keep the previous total orders but update other stats
            setStats(prev => ({
              ...prev,
              totalAmount: currentPageStats.totalAmount,
              totalPaid: currentPageStats.totalPaid,
              totalRemaining: currentPageStats.totalRemaining,
              paidOrders: currentPageStats.paidOrders,
              partialOrders: currentPageStats.partialOrders,
              unpaidOrders: currentPageStats.unpaidOrders,
              totalPayments: currentPageStats.totalPayments,
              averagePayment: currentPageStats.averagePayment
            }));
          }
        }
      } else {
        if (!isForExport) {
          toast.error(response.data.error || 'Failed to fetch order payments');
        }
      }
    } catch (error) {
      console.error('Error fetching order payments:', error);
      if (!isForExport) {
        toast.error('Error fetching order payments');
      }
    } finally {
      if (!isForExport) {
        setLoading(false);
        pageChangeInProgress.current = false;
      }
    }
    
    return [];
  }, [
    API_BASE, 
    searchInput, 
    paymentStatusFilter, 
    traderIdFilter, 
    orderIdFilter, 
    minAmountFilter, 
    maxAmountFilter, 
    currentPage, 
    itemsPerPage, 
    sortField, 
    sortOrder, 
    fetchFarmerDetails
  ]);

  // Helper function to calculate stats from orders array
  const calculateStatsFromOrders = (ordersList: Order[]) => {
    const totalOrders = ordersList.length;
    const totalAmount = ordersList.reduce((sum, order) => sum + order.traderToAdminPayment.totalAmount, 0);
    const totalPaid = ordersList.reduce((sum, order) => sum + order.traderToAdminPayment.paidAmount, 0);
    const totalRemaining = ordersList.reduce((sum, order) => sum + order.traderToAdminPayment.remainingAmount, 0);
    
    const paidOrders = ordersList.filter(o => o.traderToAdminPayment.paymentStatus === 'paid').length;
    const partialOrders = ordersList.filter(o => o.traderToAdminPayment.paymentStatus === 'partial').length;
    const unpaidOrders = ordersList.filter(o => o.traderToAdminPayment.paymentStatus === 'unpaid').length;
    
    const totalPayments = ordersList.reduce((sum, order) => sum + order.traderToAdminPayment.paymentHistory.length, 0);
    const averagePayment = totalPayments > 0 ? totalPaid / totalPayments : 0;
    
    return { 
      totalOrders, 
      totalAmount, 
      totalPaid, 
      totalRemaining, 
      paidOrders, 
      partialOrders, 
      unpaidOrders,
      totalPayments,
      averagePayment
    };
  };

  // Separate function to fetch export data
  const fetchExportData = useCallback(async () => {
    try {
      const exportData = await fetchOrders(true);
      setAllOrders(exportData);
      return exportData;
    } catch (error) {
      console.error('Error fetching export data:', error);
      return [];
    }
  }, [fetchOrders]);

  // Initial data fetch and when pagination/sorting changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, sortField, sortOrder]);

  // Debounced search for filters
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, paymentStatusFilter, traderIdFilter, orderIdFilter, minAmountFilter, maxAmountFilter]);

  // Get unique traders for filter dropdown
  const getUniqueTraders = useMemo(() => {
    const traders = allOrders.length > 0 ? allOrders : orders;
    const uniqueTraders = traders
      .map(order => ({ id: order.traderId, name: order.traderName }))
      .filter((trader, index, self) => 
        trader.id && 
        trader.id.trim() !== '' && 
        index === self.findIndex(t => t.id === trader.id)
      );
    return uniqueTraders.sort((a, b) => a.name.localeCompare(b.name));
  }, [allOrders, orders]);

  // Get unique order IDs for filter dropdown
  const getUniqueOrderIds = useMemo(() => {
    const orderList = allOrders.length > 0 ? allOrders : orders;
    const orderIds = orderList
      .map(order => order.orderId)
      .filter(orderId => orderId && orderId.trim() !== '');
    return [...new Set(orderIds)].sort();
  }, [allOrders, orders]);

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
    // Prevent multiple rapid clicks
    if (pageChangeInProgress.current || value === currentPage) {
      return;
    }
    
    pageChangeInProgress.current = true;
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

  const handleCopyToClipboard = async (): Promise<void> => {
    let ordersToExport = allOrders;
    
    // If allOrders is empty, fetch export data
    if (ordersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      ordersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (ordersToExport.length === 0) {
      toast.error("No orders to copy");
      return;
    }

    // Define headers with widths
    const headers = [
      { name: "Order ID", width: 12 },
      { name: "Trader", width: 20 },
      { name: "Farmer", width: 20 },
      { name: "Amount", width: 15 },
      { name: "Paid", width: 12 },
      { name: "Due", width: 12 },
      { name: "Status", width: 15 },
      { name: "History", width: 10 },
      { name: "Date", width: 12 }
    ];
    
    // Create header row
    const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
    const separator = "─".repeat(headerRow.length);
    
    // Format each payment row
    const paymentRows = ordersToExport.map((order: any) => {
      const payment = order.traderToAdminPayment || {};
      
      // Format trader name with ID
      const traderInfo = `${order.traderName || "N/A"} (${order.traderId || "N/A"})`;
      const formattedTrader = traderInfo.length > 18 
        ? traderInfo.substring(0, 15) + "..." 
        : traderInfo;
      
      // Format farmer info
      const farmerInfo = order.farmerInfo ? 
        `${order.farmerInfo.farmerName || "N/A"} (${order.farmerInfo.farmerId || "N/A"})` : 
        "No Farmer";
      const formattedFarmer = farmerInfo.length > 18 
        ? farmerInfo.substring(0, 15) + "..." 
        : farmerInfo;
      
      // Format amounts with ₹ symbol and thousands separator
      const formatCurrency = (amount: number) => 
        `₹${(amount || 0).toLocaleString('en-IN')}`;
      
      const totalAmount = formatCurrency(payment.totalAmount || 0);
      const paidAmount = formatCurrency(payment.paidAmount || 0);
      const dueAmount = formatCurrency(payment.remainingAmount || 0);
      
      // Format payment status with emoji
      const paymentStatus = payment.paymentStatus || "N/A";
      const statusEmoji = paymentStatus === "paid" ? "✅" : 
                        paymentStatus === "partial" ? "💰" : 
                        paymentStatus === "pending" ? "⏳" : 
                        paymentStatus === "unpaid" ? "❌" : "";
      
      // Get payment history count
      const historyCount = payment.paymentHistory?.length || 0;
      const historyText = historyCount > 0 ? `${historyCount} 📋` : "0";
      
      // Create row values with padding
      const rowValues = [
        (order.orderId || "").padEnd(headers[0].width),
        formattedTrader.padEnd(headers[1].width),
        formattedFarmer.padEnd(headers[2].width),
        totalAmount.padEnd(headers[3].width),
        paidAmount.padEnd(headers[4].width),
        dueAmount.padEnd(headers[5].width),
        `${statusEmoji} ${paymentStatus}`.padEnd(headers[6].width),
        historyText.padEnd(headers[7].width),
        (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A").padEnd(headers[8].width)
      ];
      
      return rowValues.join(" │ ");
    });
    
    // Calculate financial statistics
    const totals = ordersToExport.reduce((acc: any, order: any) => {
      const payment = order.traderToAdminPayment || {};
      acc.totalAmount += payment.totalAmount || 0;
      acc.paidAmount += payment.paidAmount || 0;
      acc.dueAmount += payment.remainingAmount || 0;
      return acc;
    }, { totalAmount: 0, paidAmount: 0, dueAmount: 0 });
    
    const statusCounts = ordersToExport.reduce((acc: any, order: any) => {
      const status = order.traderToAdminPayment?.paymentStatus || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Build complete table with summary
    const tableContent = [
      "💰 TRADER PAYMENTS SUMMARY",
      "=".repeat(headerRow.length),
      headerRow,
      separator,
      ...paymentRows,
      separator,
      "",
      "📊 FINANCIAL SUMMARY",
      `• Total Orders: ${ordersToExport.length}`,
      `• Total Billed Amount: ₹${totals.totalAmount.toLocaleString('en-IN')}`,
      `• Total Paid Amount: ₹${totals.paidAmount.toLocaleString('en-IN')}`,
      `• Total Due Amount: ₹${totals.dueAmount.toLocaleString('en-IN')}`,
      `• Collection Rate: ${totals.totalAmount > 0 ? Math.round((totals.paidAmount / totals.totalAmount) * 100) : 0}%`,
      "",
      "👥 FARMER STATISTICS",
      `• Total Farmers: ${[...new Set(ordersToExport.map(o => o.farmerId).filter(Boolean))].length}`,
      `• Orders with Farmers: ${ordersToExport.filter(o => o.farmerId).length}`,
      "",
      "📈 PAYMENT STATUS DISTRIBUTION",
      ...Object.entries(statusCounts).map(([status, count]: [string, any]) => 
        `• ${status}: ${count} (${Math.round((count / ordersToExport.length) * 100)}%)`
      ),
      "",
      "💳 PAYMENT HISTORY",
      `• Total Transactions: ${ordersToExport.reduce((sum: number, order: any) => 
        sum + (order.traderToAdminPayment?.paymentHistory?.length || 0), 0)}`,
      `• Average Transactions per Order: ${Math.round(
        ordersToExport.reduce((sum: number, order: any) => 
          sum + (order.traderToAdminPayment?.paymentHistory?.length || 0), 0) / ordersToExport.length
      )}`,
      "",
      `📅 Report Generated: ${new Date().toLocaleString()}`
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`Copied ${ordersToExport.length} payment records!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = async () => {
    let ordersToExport = allOrders;
    
    // If allOrders is empty, fetch export data
    if (ordersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      ordersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (ordersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = ordersToExport.map((order) => {
      const payment = order.traderToAdminPayment;
      return {
        "Order ID": order.orderId,
        "Trader ID": order.traderId,
        "Trader Name": order.traderName,
        "Farmer ID": order.farmerInfo?.farmerId || 'N/A',
        "Farmer Name": order.farmerInfo?.farmerName || 'N/A',
        "Farmer Mobile": order.farmerInfo?.farmerMobile || 'N/A',
        "Farmer Address": order.farmerInfo?.farmerAddress || 'N/A',
        "Total Amount": payment.totalAmount,
        "Paid Amount": payment.paidAmount,
        "Remaining Amount": payment.remainingAmount,
        "Payment Status": payment.paymentStatus,
        "Payment History Count": payment.paymentHistory.length,
        "Last Payment Date": payment.lastPaymentDate ? new Date(payment.lastPaymentDate).toLocaleString() : 'N/A',
        "Next Payment Due": payment.nextPaymentDue ? new Date(payment.nextPaymentDue).toLocaleString() : 'N/A',
        "Created At": new Date(order.createdAt).toLocaleString(),
        "Updated At": new Date(order.updatedAt).toLocaleString(),
        "Payment Percentage": payment.totalAmount > 0 ? ((payment.paidAmount / payment.totalAmount) * 100).toFixed(2) + "%" : "0%",
        "Payment Completion": payment.remainingAmount === 0 ? "Fully Paid" : "Pending"
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Order Payments");
    writeFile(wb, `order-payments-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = async () => {
    let ordersToExport = allOrders;
    
    // If allOrders is empty, fetch export data
    if (ordersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      ordersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (ordersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const headers = ["Order ID", "Trader Name", "Farmer Name", "Total Amount", "Paid Amount", "Remaining", "Status", "Payment History", "Date"];
    
    const csvContent = [
      headers.join(","),
      ...ordersToExport.map((order) => {
        const payment = order.traderToAdminPayment;
        return [
          `"${order.orderId}"`,
          `"${order.traderName}"`,
          `"${order.farmerInfo?.farmerName || 'N/A'}"`,
          payment.totalAmount,
          payment.paidAmount,
          payment.remainingAmount,
          `"${payment.paymentStatus}"`,
          payment.paymentHistory.length,
          `"${new Date(order.createdAt).toLocaleDateString()}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `order-payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = async () => {
    let ordersToExport = allOrders;
    
    // If allOrders is empty, fetch export data
    if (ordersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      ordersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (ordersToExport.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const doc = new jsPDF('landscape');
    doc.text("Order Payments Report", 14, 16);
    
    const tableColumn = ["Order ID", "Trader", "Farmer", "Total", "Paid", "Remaining", "Status", "History", "Date"];
    const tableRows: any = ordersToExport.map((order) => {
      const payment = order.traderToAdminPayment;
      return [
        order.orderId,
        order.traderName,
        order.farmerInfo?.farmerName || 'N/A',
        `₹${payment.totalAmount.toLocaleString()}`,
        `₹${payment.paidAmount.toLocaleString()}`,
        `₹${payment.remainingAmount.toLocaleString()}`,
        payment.paymentStatus,
        payment.paymentHistory.length,
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
    
    doc.save(`order-payments-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = async () => {
    let ordersToExport = allOrders;
    
    // If allOrders is empty, fetch export data
    if (ordersToExport.length === 0) {
      toast.loading("Fetching data for export...", { id: "export" });
      ordersToExport = await fetchExportData();
      toast.dismiss("export");
    }
    
    if (ordersToExport.length === 0) {
      toast.error("No data to print");
      return;
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Payments Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .summary-item { text-align: center; }
          .summary-value { font-size: 20px; font-weight: bold; color: #1f2937; }
          .summary-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-paid { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-partial { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-unpaid { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
          .farmer-label { font-weight: bold; color: #166534; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Order Payments Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <h3>Payment Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${ordersToExport.length}</div>
              <div class="summary-label">Total Orders</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.totalAmount, 0).toLocaleString()}</div>
              <div class="summary-label">Total Amount</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.paidAmount, 0).toLocaleString()}</div>
              <div class="summary-label">Total Paid</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">₹${ordersToExport.reduce((sum, o) => sum + o.traderToAdminPayment.remainingAmount, 0).toLocaleString()}</div>
              <div class="summary-label">Total Remaining</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${ordersToExport.filter(o => o.traderToAdminPayment.paymentStatus === 'paid').length}</div>
              <div class="summary-label">Fully Paid</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${ordersToExport.filter(o => o.traderToAdminPayment.paymentStatus === 'partial').length}</div>
              <div class="summary-label">Partial Payments</div>
            </div>
          </div>
        </div>
        
        <p>Total Records: ${ordersToExport.length}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Trader</th>
              <th>Farmer</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Payment Status</th>
              <th>Payment History</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${ordersToExport.map((order) => {
              const payment = order.traderToAdminPayment;
              const statusClass = `status-${payment.paymentStatus}`;
              return `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${order.traderName}<br><small>ID: ${order.traderId}</small></td>
                  <td>
                    ${order.farmerInfo ? `
                      <div class="farmer-info">
                        <div><span class="farmer-label">Name:</span> ${order.farmerInfo.farmerName}</div>
                        <div><span class="farmer-label">ID:</span> ${order.farmerInfo.farmerId}</div>
                        <div><span class="farmer-label">Mobile:</span> ${order.farmerInfo.farmerMobile}</div>
                        <div><span class="farmer-label">Address:</span> ${order.farmerInfo.farmerAddress}</div>
                      </div>
                    ` : 'No Farmer'}
                  </td>
                  <td>₹${payment.totalAmount.toLocaleString()}</td>
                  <td>₹${payment.paidAmount.toLocaleString()}</td>
                  <td>₹${payment.remainingAmount.toLocaleString()}</td>
                  <td><span class="${statusClass}">${payment.paymentStatus.toUpperCase()}</span></td>
                  <td>${payment.paymentHistory.length} payments</td>
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
    toast.success("Printing order payments report...");
  };

  // Payment status badge colors
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  // Calculate payment percentage
  const calculatePaymentPercentage = (paid: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  // Open details dialog
  const openDetailsDialog = (order: Order) => {
    setCurrentOrder(order);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setPaymentStatusFilter('');
    setTraderIdFilter('');
    setOrderIdFilter('');
    setMinAmountFilter('');
    setMaxAmountFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  // Destructure stats for easy access
  const { 
    totalOrders, 
    totalAmount, 
    totalPaid, 
    totalRemaining, 
    paidOrders, 
    partialOrders, 
    unpaidOrders, 
    totalPayments, 
    averagePayment 
  } = stats;
  
  const { startItem, endItem } = getPaginationRange();

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaWallet className="text-blue-600" />
          Order Payments Report
        </h1>
        <p className="text-gray-600 mt-1">Monitor trader to admin payment status, history, and reconciliation</p>
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

      {/* Stats Cards - FIXED: Using stats from API, not from current page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{totalItemsState}</p>
            </div>
            <FaShoppingCart className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <FaMoneyBillWave className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Paid</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Remaining</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
            </div>
            <FaTimesCircle className="text-red-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Fully Paid Orders</p>
              <p className="text-xl font-bold text-gray-900">{paidOrders}</p>
            </div>
            <FaWallet className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">Total Payments</p>
              <p className="text-xl font-bold text-gray-900">{totalPayments}</p>
            </div>
            <FaHistory className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

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
              placeholder="Search by order ID, trader name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Order ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaReceipt className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
            >
              <option value="">All Orders</option>
              {getUniqueOrderIds.map((orderId) => (
                <option key={orderId} value={orderId}>
                  {orderId}
                </option>
              ))}
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
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Trader Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Farmer Details
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('traderToAdminPayment.totalAmount')}
                >
                  Payment Details {getSortIcon('traderToAdminPayment.totalAmount')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Payment History
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
              {orders.map((order,i) => {
                const payment = order.traderToAdminPayment;
                const paymentPercentage = calculatePaymentPercentage(payment.paidAmount, payment.totalAmount);
                
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
                      <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>

                    {/* Trader Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{order.traderName}</div>
                          <div className="text-xs text-gray-500 truncate">{order.traderId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Farmer Details */}
                    <td className="px-4 py-3">
                      {order.farmerInfo ? (
                        <div className="space-y-1 min-w-0">
                          {/* Farmer ID and Name */}
                          <div className="flex items-center">
                            <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {order.farmerInfo.farmerName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                ID: {order.farmerInfo.farmerId}
                              </div>
                            </div>
                          </div>
                          
                          {/* Mobile Number */}
                          {order.farmerInfo.farmerMobile !== 'N/A' && (
                            <div className="flex items-center text-xs text-gray-600 ml-6">
                              <FaMobileAlt className="mr-1 flex-shrink-0" />
                              <span className="truncate">{order.farmerInfo.farmerMobile}</span>
                            </div>
                          )}
                          
                          {/* Address */}
                          {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
                            <div className="flex items-start text-xs text-gray-600 ml-6">
                              <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                              <span className="truncate">{order.farmerInfo.farmerAddress}</span>
                            </div>
                          )}
                          
                          {/* Show when no address is available */}
                          {(order.farmerInfo.farmerAddress === 'N/A' || order.farmerInfo.farmerAddress === '') && (
                            <div className="flex items-center text-xs text-gray-400 italic ml-6">
                              <FaHome className="mr-1 flex-shrink-0" />
                              <span>No address available</span>
                            </div>
                          )}
                        </div>
                      ) : order.farmerId ? (
                        <div className="text-xs text-gray-500 italic">
                          Loading farmer details...
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          No farmer assigned
                        </div>
                      )}
                    </td>

                    {/* Payment Details */}
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Total:</span>
                          <span className="text-sm font-semibold">{formatCurrency(payment.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Paid:</span>
                          <span className="text-sm font-semibold text-green-600">{formatCurrency(payment.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Remaining:</span>
                          <span className={`text-sm font-semibold ${payment.remainingAmount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatCurrency(payment.remainingAmount)}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${paymentPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {paymentPercentage}% paid
                        </div>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {formatStatus(payment.paymentStatus)}
                      </span>
                      {payment.remainingAmount === 0 && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                          <FaCheckCircle className="mr-1" /> Fully Paid
                        </div>
                      )}
                    </td>

                    {/* Payment History */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FaHistory className="text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.paymentHistory.length}</div>
                          <div className="text-xs text-gray-500">payments</div>
                        </div>
                      </div>
                      {payment.lastPaymentDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last: {formatDate(payment.lastPaymentDate)}
                        </div>
                      )}
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
                        title="View Payment Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No Data State */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <FaWallet className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No order payments found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        {orders.map((order,i) => {
          const payment = order.traderToAdminPayment;
          const paymentPercentage = calculatePaymentPercentage(payment.paidAmount, payment.totalAmount);
          
          return (
            <div key={i} className="bg-white rounded-lg shadow p-3">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-blue-600 text-sm truncate">{order.orderId}</div>
                  <div className="text-xs text-gray-500 truncate">{order.traderName}</div>
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
                      expandedOrder === order.orderId 
                        ? null 
                        : order.orderId
                    )}
                    className="text-gray-500 p-1"
                    title={expandedOrder === order.orderId ? "Collapse" : "Expand"}
                  >
                    {expandedOrder === order.orderId ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Farmer Info in Mobile View */}
              {order.farmerInfo && (
                <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                  <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{order.farmerInfo.farmerName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {order.farmerInfo.farmerId}</div>
                      </div>
                    </div>
                    {order.farmerInfo.farmerMobile !== 'N/A' && (
                      <div className="flex items-center text-xs text-gray-600 ml-6">
                        <FaMobileAlt className="mr-1 flex-shrink-0" />
                        <span className="truncate">{order.farmerInfo.farmerMobile}</span>
                      </div>
                    )}
                    {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
                      <div className="flex items-start text-xs text-gray-600 ml-6">
                        <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{order.farmerInfo.farmerAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="truncate">
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="font-bold text-sm truncate">{formatCurrency(payment.totalAmount)}</div>
                </div>
                <div className="truncate">
                  <div className="text-xs text-gray-500">Trader ID</div>
                  <div className="font-medium text-xs truncate">{order.traderId}</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">Payment Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${paymentPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium">{paymentPercentage}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="truncate">
                  <div className="text-xs text-gray-500">Payment Status</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.paymentStatus)} truncate`}>
                    {formatStatus(payment.paymentStatus)}
                  </span>
                </div>
                <div className="truncate">
                  <div className="text-xs text-gray-500">Payments</div>
                  <div className="font-medium text-xs truncate">{payment.paymentHistory.length}</div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrder === order.orderId && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* Farmer Details in Expanded View */}
                  {order.farmerInfo && (
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-xs text-gray-500 mb-2">Farmer Information</div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-600">Name</div>
                            <div className="text-sm font-medium">{order.farmerInfo.farmerName}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">ID</div>
                            <div className="text-sm font-medium">{order.farmerInfo.farmerId}</div>
                          </div>
                        </div>
                        {order.farmerInfo.farmerMobile !== 'N/A' && (
                          <div>
                            <div className="text-xs text-gray-600">Mobile</div>
                            <div className="text-sm font-medium">{order.farmerInfo.farmerMobile}</div>
                          </div>
                        )}
                        {order.farmerInfo.farmerAddress !== 'N/A' && order.farmerInfo.farmerAddress !== '' && (
                          <div>
                            <div className="text-xs text-gray-600">Address</div>
                            <div className="text-sm font-medium">{order.farmerInfo.farmerAddress}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Amount Details */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Payment Breakdown</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Paid Amount:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(payment.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Remaining Amount:</span>
                        <span className={`text-sm font-bold ${payment.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(payment.remainingAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  {payment.paymentHistory.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Recent Payments ({payment.paymentHistory.length})</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {payment.paymentHistory.slice(0, 3).map((paymentItem, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{formatCurrency(paymentItem.amount)}</span>
                              <span className="text-gray-600 capitalize">{paymentItem.paymentMethod}</span>
                            </div>
                            <div className="text-gray-500 mt-1">{formatDate(paymentItem.paidDate)}</div>
                          </div>
                        ))}
                        {payment.paymentHistory.length > 3 && (
                          <div className="text-xs text-blue-600 text-center">
                            +{payment.paymentHistory.length - 3} more payments
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500 mb-1">Order Timeline</div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span>{formatDate(order.updatedAt)}</span>
                      </div>
                      {payment.lastPaymentDate && (
                        <div className="flex justify-between text-green-600">
                          <span>Last Payment:</span>
                          <span>{formatDate(payment.lastPaymentDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

      {/* Order Payment Details Dialog */}
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
                <FaWallet className="text-blue-600 flex-shrink-0" />
                <span className="truncate">Payment Details: {currentOrder?.orderId}</span>
              </h2>
              <p className="text-gray-600 text-sm truncate">Complete payment information and history</p>
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
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Payment Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaReceipt className="text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Order ID:</span>
                      <span className="font-medium text-sm">{currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader ID:</span>
                      <span className="font-medium text-sm">{currentOrder.traderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader Name:</span>
                      <span className="font-medium text-sm">{currentOrder.traderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Created:</span>
                      <span className="font-medium text-sm">{formatDateTime(currentOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Farmer Information Section */}
                {currentOrder.farmerInfo && (
                  <div className="bg-green-50 p-3 rounded">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FaUserTag className="text-green-600" />
                      Farmer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Farmer ID:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Name:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Mobile:</span>
                        <span className="font-medium text-sm">{currentOrder.farmerInfo.farmerMobile}</span>
                      </div>
                      {currentOrder.farmerInfo.farmerAddress && currentOrder.farmerInfo.farmerAddress !== 'N/A' && (
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Address:</div>
                          <div className="font-medium text-sm text-gray-900">
                            {currentOrder.farmerInfo.farmerAddress}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaCreditCardAlt className="text-yellow-600" />
                    Payment Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentOrder.traderToAdminPayment.paymentStatus)}`}>
                        {formatStatus(currentOrder.traderToAdminPayment.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Progress:</span>
                      <span className="font-medium text-sm">
                        {calculatePaymentPercentage(
                          currentOrder.traderToAdminPayment.paidAmount,
                          currentOrder.traderToAdminPayment.totalAmount
                        )}%
                      </span>
                    </div>
                    {currentOrder.traderToAdminPayment.lastPaymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Last Payment:</span>
                        <span className="font-medium text-sm">
                          {formatDate(currentOrder.traderToAdminPayment.lastPaymentDate)}
                        </span>
                      </div>
                    )}
                    {currentOrder.traderToAdminPayment.nextPaymentDue && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Next Payment Due:</span>
                        <span className="font-medium text-sm">
                          {formatDate(currentOrder.traderToAdminPayment.nextPaymentDue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-purple-600" />
                  Amount Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border border-green-200">
                      <div className="text-xs text-gray-500 mb-1">Paid Amount</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}
                      </div>
                    </div>
                    <div className={`text-center p-3 bg-white rounded border ${
                      currentOrder.traderToAdminPayment.remainingAmount > 0 
                        ? 'border-red-200' 
                        : 'border-green-200'
                    }`}>
                      <div className="text-xs text-gray-500 mb-1">Remaining Amount</div>
                      <div className={`text-lg font-bold ${
                        currentOrder.traderToAdminPayment.remainingAmount > 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Payment Progress</span>
                      <span className="text-xs font-medium">
                        {calculatePaymentPercentage(
                          currentOrder.traderToAdminPayment.paidAmount,
                          currentOrder.traderToAdminPayment.totalAmount
                        )}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${calculatePaymentPercentage(
                            currentOrder.traderToAdminPayment.paidAmount,
                            currentOrder.traderToAdminPayment.totalAmount
                          )}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaHistory className="text-indigo-600" />
                    Payment History ({currentOrder.traderToAdminPayment.paymentHistory.length})
                  </h3>
                  <div className="space-y-2">
                    {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-lg text-blue-600">
                            {formatCurrency(payment.amount)}
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                            {payment.paymentMethod}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Paid Date:</span>
                            <span className="font-medium">{formatDateTime(payment.paidDate)}</span>
                          </div>
                          {payment.transactionId && (
                            <div className="mt-1">
                              <span className="text-gray-500">Transaction ID:</span>
                              <div className="font-mono text-xs break-all">{payment.transactionId}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-yellow-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaChartLine className="text-yellow-600" />
                  Payment Summary
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payments Made:</span>
                    <span className="font-bold">{currentOrder.traderToAdminPayment.paymentHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Completion:</span>
                    <span className={`font-bold ${
                      currentOrder.traderToAdminPayment.remainingAmount === 0 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {currentOrder.traderToAdminPayment.remainingAmount === 0 
                        ? 'Fully Paid' 
                        : `${formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)} Pending`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Rate:</span>
                    <span className="font-bold">
                      {calculatePaymentPercentage(
                        currentOrder.traderToAdminPayment.paidAmount,
                        currentOrder.traderToAdminPayment.totalAmount
                      )}%
                    </span>
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

export default TestOrderPayments;