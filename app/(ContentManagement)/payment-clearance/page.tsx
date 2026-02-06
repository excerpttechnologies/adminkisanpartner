




// "use client"

// import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';

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
//   FaStore,
//   FaTag,
//   FaWeight,
//   FaShippingFast,
//   FaMoneyBillWave,
//   FaChartLine,
//   FaUsers,
//   FaFileInvoiceDollar,
//   FaUserTag,
//   FaMobileAlt,
//   FaHome
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// // Interfaces
// interface FarmerInfo {
//   farmerId?: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerAddress?: string;
//   farmerVillage?: string;
//   farmerPincode?: string;
//   farmerDistrict?: string;
// }

// interface PaymentRecord {
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   lastStatusChangeDate: string;
//   farmerId?: string;
//   farmerInfo?: FarmerInfo;
//   _id?: string; // Add _id field for unique identification
// }

// interface ApiResponse {
//   success: boolean;
//   reportName: string;
//   reportDescription: string;
//   data: PaymentRecord[];
//   summary: {
//     totalClearedOrders: number;
//     totalClearedAmount: number;
//     averageClearedAmount: number;
//     tradersCount: number;
//     clearedThisWeek: number;
//     clearedThisMonth: number;
//   };
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   filtersApplied?: {
//     paymentStatus: string;
//     traderId: string | null;
//     orderId: string | null;
//     startDate: string | null;
//     endDate: string | null;
//   };
//   error?: string;
//   message?: string;
// }

// const TradersPaymentClearanceReport: React.FC = () => {
//   const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
//   const [allPaymentRecords, setAllPaymentRecords] = useState<PaymentRecord[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>('');
//   const[data,setData]=useState<{
//       taluka:string,
//       role:string
//     }>()

//   // Filter states
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('paid');
//   const [traderIdFilter, setTraderIdFilter] = useState<string>('');
//   const [orderIdFilter, setOrderIdFilter] = useState<string>('');
//   const [startDateFilter, setStartDateFilter] = useState<string>('');
//   const [endDateFilter, setEndDateFilter] = useState<string>('');

//   // Sorting states
//   const [sortField, setSortField] = useState<string>('lastStatusChangeDate');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItemsState, setTotalItemsState] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);

//   // Summary state
//   const [summary, setSummary] = useState({
//     totalClearedOrders: 0,
//     totalClearedAmount: 0,
//     averageClearedAmount: 0,
//     tradersCount: 0,
//     clearedThisWeek: 0,
//     clearedThisMonth: 0
//   });

//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [currentRecord, setCurrentRecord] = useState<PaymentRecord | null>(null);

//   // Mobile view state
//   const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

//   // Farmer details cache
//   const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';
//   const tableRef = useRef<HTMLDivElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

//   // Fetch payment records with server-side pagination and sorting
//   const fetchPaymentRecords = useCallback(async () => {
//     setLoading(true);

//     try {
//       const params = new URLSearchParams();

//       if (searchInput) params.append('search', searchInput);
//       if (traderIdFilter) params.append('traderId', traderIdFilter);
//       if (orderIdFilter) params.append('orderId', orderIdFilter);
//       if (startDateFilter) params.append('startDate', startDateFilter);
//       if (endDateFilter) params.append('endDate', endDateFilter);
//       if (paymentStatusFilter && paymentStatusFilter !== 'all') {
//         params.append('paymentStatus', paymentStatusFilter);
//       }

//       params.append('page', currentPage.toString());
//       params.append('limit', itemsPerPage.toString());
//       params.append('sortBy', sortField);
//       params.append('order', sortOrder);


//  const session = await getAdminSessionAction();
//       setData(session?.admin)
//       if(session?.admin?.role == "subadmin"){
//        params.append('taluk', session?.admin.taluka);
//       }

//       const res = await axios.get(
//         `/api/trader-payment-clearance?${params.toString()}`
//       );

//       const data: ApiResponse = res.data;

//       if (!data.success) {
//         toast.error(data.error || "Failed to fetch payment records");
//         return;
//       }

//       const recordsWithIds = await Promise.all(
//         (data.data || []).map(async (record, index) => {
//           const baseRecord = {
//             ...record,
//             _id: record._id || `${record.orderId}-${record.traderId}-${index}`
//           };

//           if (record.farmerId) {
//             const farmerInfo = await fetchFarmerDetails(record.farmerId);
//             return { ...baseRecord, farmerInfo };
//           }

//           return baseRecord;
//         })
//       );

//       setPaymentRecords(recordsWithIds);
//       setTotalItemsState(data.pagination?.total || 0);
//       setTotalPages(data.pagination?.totalPages || 1);
//       setSummary(data.summary);
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.error || "Error fetching records");
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     searchInput,
//     traderIdFilter,
//     orderIdFilter,
//     startDateFilter,
//     endDateFilter,
//     paymentStatusFilter,
//     currentPage,
//     itemsPerPage,
//     sortField,
//     sortOrder,
//     fetchFarmerDetails
//   ]);

//   const fetchAllPaymentRecordsForExport = async () => {
//     try {
//       const params = new URLSearchParams();

//       if (searchInput) params.append('search', searchInput);
//       if (traderIdFilter) params.append('traderId', traderIdFilter);
//       if (orderIdFilter) params.append('orderId', orderIdFilter);
//       if (startDateFilter) params.append('startDate', startDateFilter);
//       if (endDateFilter) params.append('endDate', endDateFilter);
//       if (paymentStatusFilter && paymentStatusFilter !== 'all') {
//         params.append('paymentStatus', paymentStatusFilter);
//       }

//       params.append('limit', '100000');

//       const res = await axios.get(
//         `/api/trader-payment-clearance?${params.toString()}`
//       );

//       if (res.data.success) {
//         const records = await Promise.all(
//           res.data.data.map(async (record: PaymentRecord) => {
//             if (record.farmerId) {
//               const farmerInfo = await fetchFarmerDetails(record.farmerId);
//               return { ...record, farmerInfo };
//             }
//             return record;
//           })
//         );

//         setAllPaymentRecords(records);
//         return records;
//       }
//     } catch {
//       toast.error("Failed to load export data");
//       return [];
//     }
//     return [];
//   };

//   // Debounced search - FIXED: Added fetchPaymentRecords to dependency array
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1);
//       fetchPaymentRecords();
//     }, 500); // 500ms delay

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchInput, traderIdFilter, orderIdFilter, startDateFilter, endDateFilter, paymentStatusFilter]);

//   // FIXED: Added useEffect for pagination changes
//   useEffect(() => {
//     fetchPaymentRecords();
//   }, [currentPage, itemsPerPage, sortField, sortOrder]);

//   // Get unique traders for filter dropdown
//   const getUniqueTraders = useMemo(() => {
//     const traders = paymentRecords
//       .map(record => ({ id: record.traderId, name: record.traderName }))
//       .filter((trader, index, self) =>
//         trader.id &&
//         trader.id.trim() !== '' &&
//         index === self.findIndex(t => t.id === trader.id)
//       );
//     return traders.sort((a, b) => a.name.localeCompare(b.name));
//   }, [paymentRecords]);

//   // Get unique order IDs for filter dropdown
//   const getUniqueOrderIds = useMemo(() => {
//     const orderIds = paymentRecords
//       .map(record => record.orderId)
//       .filter(orderId => orderId && orderId.trim() !== '');
//     return [...new Set(orderIds)].sort();
//   }, [paymentRecords]);

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

//   // Generate unique key for records
//   const generateRecordKey = (record: PaymentRecord, index: number) => {
//     return record._id || `${record.orderId}-${record.traderId}-${index}-${Date.now()}`;
//   };

//   // Export functions - FIXED: Added data fetching before export
//   const handleCopyToClipboard = async (): Promise<void> => {
//     const records = await fetchAllPaymentRecordsForExport();
    
//     if (!records || records.length === 0) {
//       toast.error("No payment records to copy");
//       return;
//     }

//     // Define headers with optimal widths
//     const headers = [
//       { name: "Order ID", width: 12 },
//       { name: "Trader", width: 22 },
//       { name: "Farmer", width: 20 },
//       { name: "Total", width: 14 },
//       { name: "Paid", width: 12 },
//       { name: "Due", width: 12 },
//       { name: "Status", width: 18 },
//       { name: "Paid %", width: 8 }
//     ];

//     // Create header row
//     const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
//     const separator = "─".repeat(headerRow.length);

//     // Format currency with ₹ symbol
//     const formatCurrency = (amount: number): string =>
//       `₹${(amount || 0).toLocaleString('en-IN')}`;

//     // Format each payment record
//     const paymentRows = records.map((record: any) => {
//       // Format trader info
//       const traderInfo = `${record.traderName || "N/A"} (${record.traderId?.substring(0, 8) || "N/A"}...)`;
//       const formattedTrader = traderInfo.length > 20
//         ? traderInfo.substring(0, 17) + "..."
//         : traderInfo;

//       // Format farmer info
//       const farmerInfo = record.farmerInfo ?
//         `${record.farmerInfo.farmerName || "N/A"} (${record.farmerInfo.farmerId || "N/A"})` :
//         "No Farmer";
//       const formattedFarmer = farmerInfo.length > 18
//         ? farmerInfo.substring(0, 15) + "..."
//         : farmerInfo;

//       // Calculate payment percentage
//       const paymentPercentage = record.totalAmount > 0
//         ? Math.round((record.paidAmount / record.totalAmount) * 100)
//         : 0;

//       // Format status with emoji
//       const paymentStatus = record.paymentStatus || "N/A";
//       const statusEmoji = paymentStatus === "completed" ? "✅" :
//         paymentStatus === "partially_paid" ? "💰" :
//           paymentStatus === "pending" ? "⏳" :
//             paymentStatus === "failed" ? "❌" : "";

//       // Create row values with padding
//       const rowValues = [
//         (record.orderId || "N/A").padEnd(headers[0].width),
//         formattedTrader.padEnd(headers[1].width),
//         formattedFarmer.padEnd(headers[2].width),
//         formatCurrency(record.totalAmount || 0).padEnd(headers[3].width),
//         formatCurrency(record.paidAmount || 0).padEnd(headers[4].width),
//         formatCurrency(record.remainingAmount || 0).padEnd(headers[5].width),
//         `${statusEmoji} ${paymentStatus}`.padEnd(headers[6].width),
//         `${paymentPercentage}%`.padEnd(headers[7].width)
//       ];

//       return rowValues.join(" │ ");
//     });

//     // Calculate financial analytics
//     const totals = records.reduce((acc: any, record: any) => {
//       acc.totalAmount += record.totalAmount || 0;
//       acc.totalPaid += record.paidAmount || 0;
//       acc.totalDue += record.remainingAmount || 0;
//       acc.byStatus[record.paymentStatus] = (acc.byStatus[record.paymentStatus] || 0) + 1;
//       return acc;
//     }, {
//       totalAmount: 0,
//       totalPaid: 0,
//       totalDue: 0,
//       byStatus: {}
//     });

//     const collectionRate = totals.totalAmount > 0
//       ? Math.round((totals.totalPaid / totals.totalAmount) * 100)
//       : 0;

//     // Build complete table with analytics
//     const tableContent = [
//       "💰 PAYMENT COLLECTION REPORT",
//       "=".repeat(headerRow.length),
//       headerRow,
//       separator,
//       ...paymentRows,
//       separator,
//       "",
//       "📊 FINANCIAL SUMMARY",
//       `• Total Records: ${records.length}`,
//       `• Total Billed Amount: ₹${totals.totalAmount.toLocaleString('en-IN')}`,
//       `• Total Collected: ₹${totals.totalPaid.toLocaleString('en-IN')}`,
//       `• Total Outstanding: ₹${totals.totalDue.toLocaleString('en-IN')}`,
//       `• Collection Rate: ${collectionRate}%`,
//       `• Average Collection: ₹${Math.round(totals.totalPaid / records.length).toLocaleString('en-IN')}`,
//       "",
//       "📈 PAYMENT STATUS DISTRIBUTION",
//       ...Object.entries(totals.byStatus).map(([status, count]: [string, any]) => {
//         const amountByStatus = records
//           .filter((r: any) => r.paymentStatus === status)
//           .reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
//         return `• ${status}: ${count} records (₹${amountByStatus.toLocaleString('en-IN')})`;
//       }),
//       "",
//       "👥 FARMER STATISTICS",
//       `• Total Farmers: ${[...new Set(records.map(o => o.farmerId).filter(Boolean))].length}`,
//       `• Records with Farmers: ${records.filter(o => o.farmerId).length}`,
//       "",
//       "🎯 COLLECTION INSIGHTS",
//       `• Fully Paid: ${records.filter((r: any) => r.paymentStatus === "completed").length}`,
//       `• Partially Paid: ${records.filter((r: any) => r.paymentStatus === "partially_paid").length}`,
//       `• Pending: ${records.filter((r: any) => r.paymentStatus === "pending").length}`,
//       `• High Value (>₹10K): ${records.filter((r: any) => (r.totalAmount || 0) > 10000).length}`,
//       "",
//       "📅 REPORT METADATA",
//       `• Report Period: All Time`,
//       `• Generated: ${new Date().toLocaleString()}`,
//       `• Data Source: ${records.length} payment records`
//     ].join("\n");

//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success(`Copied ${records.length} payment records!`);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = async () => {
//     const records = await fetchAllPaymentRecordsForExport();
//     if (records.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const data = records.map((record) => {
//       return {
//         "Order ID": record.orderId,
//         "Trader ID": record.traderId,
//         "Trader Name": record.traderName,
//         "Farmer ID": record.farmerInfo?.farmerId || 'N/A',
//         "Farmer Name": record.farmerInfo?.farmerName || 'N/A',
//         "Farmer Mobile": record.farmerInfo?.farmerMobile || 'N/A',
//         "Farmer Address": record.farmerInfo?.farmerAddress || 'N/A',
//         "Total Amount": record.totalAmount,
//         "Paid Amount": record.paidAmount,
//         "Remaining Amount": record.remainingAmount,
//         "Payment Status": record.paymentStatus,
//         "Payment Completed": record.remainingAmount === 0 ? "Yes" : "No",
//         "Payment Percentage": record.totalAmount > 0 ? ((record.paidAmount / record.totalAmount) * 100).toFixed(2) + "%" : "0%"
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Traders Payment Clearance");
//     writeFile(wb, `traders-payment-clearance-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = async () => {
//     const records = await fetchAllPaymentRecordsForExport();
//     if (records.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const headers = ["Order ID", "Trader Name", "Farmer Name", "Total Amount", "Paid Amount", "Remaining Amount", "Payment Status"];

//     const csvContent = [
//       headers.join(","),
//       ...records.map((record) => {
//         return [
//           `"${record.orderId}"`,
//           `"${record.traderName}"`,
//           `"${record.farmerInfo?.farmerName || 'N/A'}"`,
//           record.totalAmount,
//           record.paidAmount,
//           record.remainingAmount,
//           `"${record.paymentStatus}"`
//         ].join(",");
//       })
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `traders-payment-clearance-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = async () => {
//     const records = await fetchAllPaymentRecordsForExport();
//     if (records.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const doc = new jsPDF('landscape');
//     doc.text("Traders Payment Clearance Report", 14, 16);

//     const tableColumn = ["Order ID", "Trader", "Farmer", "Total Amount", "Paid Amount", "Remaining", "Status"];
//     const tableRows: any = records.map((record) => {
//       return [
//         record.orderId,
//         record.traderName,
//         record.farmerInfo?.farmerName || 'N/A',
//         `₹${record.totalAmount.toLocaleString()}`,
//         `₹${record.paidAmount.toLocaleString()}`,
//         `₹${record.remainingAmount.toLocaleString()}`,
//         record.paymentStatus
//       ];
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [59, 130, 246] },
//     });

//     doc.save(`traders-payment-clearance-${new Date().toISOString().split('T')[0]}.pdf`);
//     toast.success("PDF file exported!");
//   };

//   const handlePrint = async () => {
//     const records = await fetchAllPaymentRecordsForExport();
//     if (records.length === 0) {
//       toast.error("No data to print");
//       return;
//     }

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Traders Payment Clearance Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
//           .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
//           .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
//           .summary-item { text-align: center; }
//           .summary-value { font-size: 24px; font-weight: bold; color: #1f2937; }
//           .summary-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           .status-paid { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .status-partial { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
//           .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
//           .farmer-label { font-weight: bold; color: #166534; }
//           @media print { 
//             @page { size: landscape; } 
//             body { margin: 0; padding: 20px; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Traders Payment Clearance Report</h1>
//         <p>Generated on: ${new Date().toLocaleString()}</p>
        
//         <div class="summary">
//           <h3>Summary</h3>
//           <div class="summary-grid">
//             <div class="summary-item">
//               <div class="summary-value">${summary.totalClearedOrders}</div>
//               <div class="summary-label">Total Cleared Orders</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">₹${summary.totalClearedAmount.toLocaleString()}</div>
//               <div class="summary-label">Total Cleared Amount</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">${summary.tradersCount}</div>
//               <div class="summary-label">Traders</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">₹${summary.averageClearedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
//               <div class="summary-label">Average Amount</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">${summary.clearedThisWeek}</div>
//               <div class="summary-label">Cleared This Week</div>
//             </div>
//             <div class="summary-item">
//               <div class="summary-value">${summary.clearedThisMonth}</div>
//               <div class="summary-label">Cleared This Month</div>
//             </div>
//           </div>
//         </div>
        
//         <p>Total Records: ${records.length}</p>
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
//             </tr>
//           </thead>
//           <tbody>
//             ${records.map((record) => {
//       const statusClass = `status-${record.paymentStatus}`;
//       return `
//                 <tr>
//                   <td>${record.orderId}</td>
//                   <td>${record.traderName}<br><small>ID: ${record.traderId}</small></td>
//                   <td>
//                     ${record.farmerInfo ? `
//                       <div class="farmer-info">
//                         <div><span class="farmer-label">Name:</span> ${record.farmerInfo.farmerName}</div>
//                         <div><span class="farmer-label">ID:</span> ${record.farmerInfo.farmerId}</div>
//                         <div><span class="farmer-label">Mobile:</span> ${record.farmerInfo.farmerMobile}</div>
//                         <div><span class="farmer-label">Address:</span> ${record.farmerInfo.farmerAddress}</div>
//                       </div>
//                     ` : 'No Farmer'}
//                   </td>
//                   <td>₹${record.totalAmount.toLocaleString()}</td>
//                   <td>₹${record.paidAmount.toLocaleString()}</td>
//                   <td>₹${record.remainingAmount.toLocaleString()}</td>
//                   <td><span class="${statusClass}">${record.paymentStatus.toUpperCase()}</span></td>
//                 </tr>
//               `;
//     }).join('')}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     printWindow?.document.write(printContent);
//     printWindow?.document.close();
//     printWindow?.print();
//     toast.success("Printing payment clearance report...");
//   };

//   // Payment status badge colors
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'paid':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'partial':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'unpaid':
//         return 'bg-red-100 text-red-800 border-red-200';
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

//   // Calculate payment percentage
//   const calculatePaymentPercentage = (paid: number, total: number) => {
//     if (total === 0) return 0;
//     return Math.round((paid / total) * 100);
//   };

//   // Open details dialog
//   const openDetailsDialog = (record: PaymentRecord) => {
//     setCurrentRecord(record);
//     setDetailsDialogOpen(true);
//   };

//   // Reset filters and sorting
//   const resetFilters = () => {
//     setSearchInput('');
//     setPaymentStatusFilter('paid');
//     setTraderIdFilter('');
//     setOrderIdFilter('');
//     setStartDateFilter('');
//     setEndDateFilter('');
//     setSortField('lastStatusChangeDate');
//     setSortOrder('desc');
//     setCurrentPage(1);
//   };

//   // Apply search and filters
//   const applyFilters = () => {
//     setCurrentPage(1);
//     fetchPaymentRecords();
//   };

//   const { startItem, endItem } = getPaginationRange();

//   if (loading && paymentRecords.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading payment clearance records...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaMoneyBillWave className="text-green-600" />
//           Traders Payment Clearance Report
//         </h1>
//         <p className="text-gray-600 mt-1">Monitor and manage trader payment clearance status and records</p>
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

//        {
//   data?.role == "admin" &&<>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Cleared Orders</p>
//               <p className="text-xl font-bold text-gray-900">{summary.totalClearedOrders}</p>
//             </div>
//             <FaFileInvoiceDollar className="text-blue-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Cleared Amount</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalClearedAmount)}</p>
//             </div>
//             <FaMoneyBillWave className="text-green-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Average Amount</p>
//               <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.averageClearedAmount)}</p>
//             </div>
//             <FaChartLine className="text-purple-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Total Traders</p>
//               <p className="text-xl font-bold text-gray-900">{summary.tradersCount}</p>
//             </div>
//             <FaUsers className="text-yellow-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-indigo-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Cleared This Week</p>
//               <p className="text-xl font-bold text-gray-900">{summary.clearedThisWeek}</p>
//             </div>
//             <FaCalendarAlt className="text-indigo-500 text-xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs">Cleared This Month</p>
//               <p className="text-xl font-bold text-gray-900">{summary.clearedThisMonth}</p>
//             </div>
//             <FaClipboardList className="text-red-500 text-xl" />
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
//               placeholder="Search by trader name, order ID, farmer name..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
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
//               <option value="paid">Paid</option>
//               <option value="pending">Pending</option>
//               <option value="partial">Partial</option>
//               <option value="unpaid">Unpaid</option>
//               <option value="all">All Status</option>
//             </select>
//           </div>

//           {/* Trader ID Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUser className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-sm"
//               value={traderIdFilter}
//               onChange={(e) => setTraderIdFilter(e.target.value)}
//             >
//               <option value="">All Traders</option>
//               {getUniqueTraders.map((trader) => (
//                 <option key={`trader-${trader.id}`} value={trader.id}>
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
//                   onClick={() => handleSort('totalAmount')}
//                 >
//                   Amount Details {getSortIcon('totalAmount')}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Payment Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {paymentRecords.map((record, index) => {
//                 const paymentPercentage = calculatePaymentPercentage(record.paidAmount, record.totalAmount);

//                 return (
//                   <tr key={generateRecordKey(record, index)} className="hover:bg-gray-50 transition-colors">
//                     {/* Order ID */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm font-medium text-blue-600">{record.orderId}</div>
//                       <div className="text-xs text-gray-500">Trader ID: {record.traderId}</div>
//                     </td>

//                     {/* Trader Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <div className="text-sm font-medium text-gray-900 truncate">{record.traderName}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Farmer Details */}
//                     <td className="px-4 py-3">
//                       {record.farmerInfo ? (
//                         <div className="space-y-1 min-w-0">
//                           {/* Farmer ID and Name */}
//                           <div className="flex items-center">
//                             <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
//                             <div className="min-w-0">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {record.farmerInfo.farmerName}
//                               </div>
//                               <div className="text-xs text-gray-500 truncate">
//                                 ID: {record.farmerInfo.farmerId}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Mobile Number */}
//                           {record.farmerInfo.farmerMobile !== 'N/A' && (
//                             <div className="flex items-center text-xs text-gray-600 ml-6">
//                               <FaMobileAlt className="mr-1 flex-shrink-0" />
//                               <span className="truncate">{record.farmerInfo.farmerMobile}</span>
//                             </div>
//                           )}

//                           {/* Address */}
//                           {record.farmerInfo.farmerAddress !== 'N/A' && record.farmerInfo.farmerAddress !== '' && (
//                             <div className="flex items-start text-xs text-gray-600 ml-6">
//                               <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                               <span className="truncate">{record.farmerInfo.farmerAddress}</span>
//                             </div>
//                           )}

//                           {/* Show when no address is available */}
//                           {(record.farmerInfo.farmerAddress === 'N/A' || record.farmerInfo.farmerAddress === '') && (
//                             <div className="flex items-center text-xs text-gray-400 italic ml-6">
//                               <FaHome className="mr-1 flex-shrink-0" />
//                               <span>No address available</span>
//                             </div>
//                           )}
//                         </div>
//                       ) : record.farmerId ? (
//                         <div className="text-xs text-gray-500 italic">
//                           Loading farmer details...
//                         </div>
//                       ) : (
//                         <div className="text-xs text-gray-400 italic">
//                           No farmer assigned
//                         </div>
//                       )}
//                     </td>

//                     {/* Amount Details */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Total:</span>
//                           <span className="text-sm font-semibold">{formatCurrency(record.totalAmount)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Paid:</span>
//                           <span className="text-sm font-semibold text-green-600">{formatCurrency(record.paidAmount)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Remaining:</span>
//                           <span className={`text-sm font-semibold ${record.remainingAmount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
//                             {formatCurrency(record.remainingAmount)}
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
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)}`}>
//                         {formatStatus(record.paymentStatus)}
//                       </span>
//                       {record.remainingAmount === 0 && (
//                         <div className="mt-1 text-xs text-green-600 flex items-center">
//                           <FaCheckCircle className="mr-1" /> Fully Cleared
//                         </div>
//                       )}
//                     </td>

//                     {/* Actions - View Details */}
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <button
//                         onClick={() => openDetailsDialog(record)}
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
//         {paymentRecords.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-4xl mb-4">
//               <FaMoneyBillWave className="mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No payment clearance records found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-3">
//         {paymentRecords.map((record, index) => {
//           const paymentPercentage = calculatePaymentPercentage(record.paidAmount, record.totalAmount);

//           return (
//             <div key={generateRecordKey(record, index)} className="bg-white rounded-lg shadow p-3">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="min-w-0 flex-1">
//                   <div className="font-bold text-blue-600 text-sm truncate">{record.orderId}</div>
//                   <div className="text-xs text-gray-500 truncate">{record.traderName}</div>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => openDetailsDialog(record)}
//                     className="text-blue-600 p-1"
//                     title="View Details"
//                   >
//                     <FaEye />
//                   </button>
//                   <button
//                     onClick={() => setExpandedRecord(
//                       expandedRecord === record._id
//                         ? null
//                         : (record._id || record.orderId)
//                     )}
//                     className="text-gray-500 p-1"
//                     title={expandedRecord === (record._id || record.orderId) ? "Collapse" : "Expand"}
//                   >
//                     {expandedRecord === (record._id || record.orderId) ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                 </div>
//               </div>

//               {/* Farmer Info in Mobile View */}
//               {record.farmerInfo && (
//                 <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-green-500">
//                   <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium truncate">{record.farmerInfo.farmerName}</div>
//                         <div className="text-xs text-gray-500 truncate">ID: {record.farmerInfo.farmerId}</div>
//                       </div>
//                     </div>
//                     {record.farmerInfo.farmerMobile !== 'N/A' && (
//                       <div className="flex items-center text-xs text-gray-600 ml-6">
//                         <FaMobileAlt className="mr-1 flex-shrink-0" />
//                         <span className="truncate">{record.farmerInfo.farmerMobile}</span>
//                       </div>
//                     )}
//                     {record.farmerInfo.farmerAddress !== 'N/A' && record.farmerInfo.farmerAddress !== '' && (
//                       <div className="flex items-start text-xs text-gray-600 ml-6">
//                         <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
//                         <span className="truncate">{record.farmerInfo.farmerAddress}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Total Amount</div>
//                   <div className="font-bold text-sm truncate">{formatCurrency(record.totalAmount)}</div>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Trader ID</div>
//                   <div className="font-medium text-xs truncate">{record.traderId}</div>
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
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)} truncate`}>
//                     {formatStatus(record.paymentStatus)}
//                   </span>
//                 </div>
//                 <div className="truncate">
//                   <div className="text-xs text-gray-500">Last Updated</div>
//                   <div className="font-medium text-xs truncate">
//                     {new Date(record.lastStatusChangeDate).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {expandedRecord === (record._id || record.orderId) && (
//                 <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
//                   {/* Farmer Details in Expanded View */}
//                   {record.farmerInfo && (
//                     <div className="bg-green-50 p-2 rounded">
//                       <div className="text-xs text-gray-500 mb-2">Farmer Information</div>
//                       <div className="space-y-2">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <div className="text-xs text-gray-600">Name</div>
//                             <div className="text-sm font-medium">{record.farmerInfo.farmerName}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-600">ID</div>
//                             <div className="text-sm font-medium">{record.farmerInfo.farmerId}</div>
//                           </div>
//                         </div>
//                         {record.farmerInfo.farmerMobile !== 'N/A' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Mobile</div>
//                             <div className="text-sm font-medium">{record.farmerInfo.farmerMobile}</div>
//                           </div>
//                         )}
//                         {record.farmerInfo.farmerAddress !== 'N/A' && record.farmerInfo.farmerAddress !== '' && (
//                           <div>
//                             <div className="text-xs text-gray-600">Address</div>
//                             <div className="text-sm font-medium">{record.farmerInfo.farmerAddress}</div>
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
//                         <span className="text-sm font-bold text-green-600">{formatCurrency(record.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Remaining Amount:</span>
//                         <span className={`text-sm font-bold ${record.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                           {formatCurrency(record.remainingAmount)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Payment Status:</span>
//                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)}`}>
//                           {formatStatus(record.paymentStatus)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {paymentRecords.length > 0 && (
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

//       {/* Payment Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-4 pb-3 border-b">
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
//                 <FaFileInvoiceDollar className="text-blue-600 flex-shrink-0" />
//                 <span className="truncate">Payment Details: {currentRecord?.orderId}</span>
//               </h2>
//               <p className="text-gray-600 text-sm truncate">Complete payment clearance information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
//               title="Close"
//             >
//               <FaTimes size={20} />
//             </button>
//           </div>

//           {currentRecord && (
//             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
//               {/* Payment Header */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaReceipt className="text-blue-600" />
//                     Order Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Order ID:</span>
//                       <span className="font-medium text-sm">{currentRecord.orderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader ID:</span>
//                       <span className="font-medium text-sm">{currentRecord.traderId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Trader Name:</span>
//                       <span className="font-medium text-sm">{currentRecord.traderName}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-green-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaCreditCard className="text-green-600" />
//                     Payment Status
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Payment Status:</span>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentRecord.paymentStatus)}`}>
//                         {formatStatus(currentRecord.paymentStatus)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Fully Cleared:</span>
//                       <span className={`font-medium text-sm ${currentRecord.remainingAmount === 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         {currentRecord.remainingAmount === 0 ? 'Yes' : 'No'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Farmer Information Section */}
//               {currentRecord.farmerInfo && (
//                 <div className="bg-yellow-50 p-3 rounded">
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FaUserTag className="text-yellow-600" />
//                     Farmer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Farmer ID:</span>
//                       <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Name:</span>
//                       <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600 text-sm">Mobile:</span>
//                       <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerMobile}</span>
//                     </div>
//                     {currentRecord.farmerInfo.farmerAddress && currentRecord.farmerInfo.farmerAddress !== 'N/A' && (
//                       <div>
//                         <div className="text-gray-600 text-sm mb-1">Address:</div>
//                         <div className="font-medium text-sm text-gray-900">
//                           {currentRecord.farmerInfo.farmerAddress}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Amount Details */}
//               <div className="bg-gray-50 p-3 rounded">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FaMoneyBillWave className="text-purple-600" />
//                   Amount Details
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div className="text-center p-2 bg-white rounded border">
//                       <div className="text-xs text-gray-500 mb-1">Total Amount</div>
//                       <div className="text-lg font-bold text-gray-900">{formatCurrency(currentRecord.totalAmount)}</div>
//                     </div>
//                     <div className="text-center p-2 bg-white rounded border border-green-200">
//                       <div className="text-xs text-gray-500 mb-1">Paid Amount</div>
//                       <div className="text-lg font-bold text-green-600">{formatCurrency(currentRecord.paidAmount)}</div>
//                     </div>
//                     <div className={`text-center p-2 bg-white rounded border ${currentRecord.remainingAmount > 0 ? 'border-red-200' : 'border-green-200'}`}>
//                       <div className="text-xs text-gray-500 mb-1">Remaining Amount</div>
//                       <div className={`text-lg font-bold ${currentRecord.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                         {formatCurrency(currentRecord.remainingAmount)}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment Progress */}
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-xs text-gray-600">Payment Progress</span>
//                       <span className="text-xs font-medium">
//                         {calculatePaymentPercentage(currentRecord.paidAmount, currentRecord.totalAmount)}% Complete
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-green-600 h-2 rounded-full"
//                         style={{ width: `${calculatePaymentPercentage(currentRecord.paidAmount, currentRecord.totalAmount)}%` }}
//                       ></div>
//                     </div>
//                     <div className="flex justify-between text-xs text-gray-500 mt-1">
//                       <span>0%</span>
//                       <span>50%</span>
//                       <span>100%</span>
//                     </div>
//                   </div>

//                   {/* Payment Summary */}
//                   <div className="pt-3 border-t">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Payment Summary:</span>
//                       <span className={`text-sm font-bold ${currentRecord.remainingAmount === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
//                         {currentRecord.remainingAmount === 0
//                           ? 'Fully Paid'
//                           : `${formatCurrency(currentRecord.remainingAmount)} Pending`}
//                       </span>
//                     </div>
//                     {currentRecord.paidAmount > currentRecord.totalAmount && (
//                       <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
//                         <FaMoneyBillWave className="inline mr-1" />
//                         Note: Paid amount exceeds total amount. This may indicate a refund or adjustment.
//                       </div>
//                     )}
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

// export default TradersPaymentClearanceReport;


"use client"

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

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
  FaStore,
  FaTag,
  FaWeight,
  FaShippingFast,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaUserTag,
  FaMobileAlt,
  FaHome,
  FaEnvelope,
  FaLocationArrow
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Interfaces
interface FarmerInfo {
  farmerId?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerAddress?: string;
  farmerVillage?: string;
  farmerPincode?: string;
  farmerDistrict?: string;
}

interface TraderDetails {
  traderId: string;
  role: string;
  registrationStatus: string;
  isActive: boolean;
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address: string;
    villageGramaPanchayat: string;
    pincode: string;
    state: string;
    district: string;
    taluk: string;
    post: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  commodities: string[];
  nearestMarkets: string[];
  subcategories: string[];
  registeredAt: string;
  updatedAt: string;
  state: string;
  district: string;
  taluk: string;
  mobileNo: string;
  email: string;
  address: string;
  pincode: string;
  villageGramaPanchayat: string;
}

interface PaymentRecord {
  orderId: string;
  traderId: string;
  traderName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  lastStatusChangeDate: string;
  farmerId?: string;
  farmerInfo?: FarmerInfo;
  traderDetails?: TraderDetails;
  _id?: string;
}

interface ApiResponse {
  success: boolean;
  reportName: string;
  reportDescription: string;
  data: PaymentRecord[];
  summary: {
    totalClearedOrders: number;
    totalClearedAmount: number;
    averageClearedAmount: number;
    tradersCount: number;
    clearedThisWeek: number;
    clearedThisMonth: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filtersApplied?: {
    paymentStatus: string;
    traderId: string | null;
    orderId: string | null;
    startDate: string | null;
    endDate: string | null;
  };
  error?: string;
  message?: string;
}

const TradersPaymentClearanceReport: React.FC = () => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [allPaymentRecords, setAllPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const[data,setData]=useState<{
      taluka:string,
      role:string
    }>()

  // Filter states
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('paid');
  const [traderIdFilter, setTraderIdFilter] = useState<string>('');
  const [orderIdFilter, setOrderIdFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Sorting states
  const [sortField, setSortField] = useState<string>('lastStatusChangeDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItemsState, setTotalItemsState] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Summary state
  const [summary, setSummary] = useState({
    totalClearedOrders: 0,
    totalClearedAmount: 0,
    averageClearedAmount: 0,
    tradersCount: 0,
    clearedThisWeek: 0,
    clearedThisMonth: 0
  });

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<PaymentRecord | null>(null);

  // Mobile view state
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // Farmer details cache
  const [farmerDetailsCache, setFarmerDetailsCache] = useState<Record<string, FarmerInfo>>({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';
  const tableRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch payment records with server-side pagination and sorting
  const fetchPaymentRecords = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (searchInput) params.append('search', searchInput);
      if (traderIdFilter) params.append('traderId', traderIdFilter);
      if (orderIdFilter) params.append('orderId', orderIdFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);
      if (paymentStatusFilter && paymentStatusFilter !== 'all') {
        params.append('paymentStatus', paymentStatusFilter);
      }

      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      params.append('sortBy', sortField);
      params.append('order', sortOrder);


 const session = await getAdminSessionAction();
      setData(session?.admin)
      if(session?.admin?.role == "subadmin"){
       params.append('taluk', session?.admin.taluka);
      }

      const res = await axios.get(
        `/api/trader-payment-clearance?${params.toString()}`
      );

      const data: ApiResponse = res.data;

      if (!data.success) {
        toast.error(data.error || "Failed to fetch payment records");
        return;
      }

      const recordsWithIds = await Promise.all(
        (data.data || []).map(async (record, index) => {
          const baseRecord = {
            ...record,
            _id: record._id || `${record.orderId}-${record.traderId}-${index}`
          };

          if (record.farmerId) {
            const farmerInfo = await fetchFarmerDetails(record.farmerId);
            return { ...baseRecord, farmerInfo };
          }

          return baseRecord;
        })
      );

      setPaymentRecords(recordsWithIds);
      setTotalItemsState(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setSummary(data.summary);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error fetching records");
    } finally {
      setLoading(false);
    }
  }, [
    searchInput,
    traderIdFilter,
    orderIdFilter,
    startDateFilter,
    endDateFilter,
    paymentStatusFilter,
    currentPage,
    itemsPerPage,
    sortField,
    sortOrder,
    fetchFarmerDetails
  ]);

  const fetchAllPaymentRecordsForExport = async () => {
    try {
      const params = new URLSearchParams();

      if (searchInput) params.append('search', searchInput);
      if (traderIdFilter) params.append('traderId', traderIdFilter);
      if (orderIdFilter) params.append('orderId', orderIdFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);
      if (paymentStatusFilter && paymentStatusFilter !== 'all') {
        params.append('paymentStatus', paymentStatusFilter);
      }

      params.append('limit', '100000');

      const res = await axios.get(
        `/api/trader-payment-clearance?${params.toString()}`
      );

      if (res.data.success) {
        const records = await Promise.all(
          res.data.data.map(async (record: PaymentRecord) => {
            if (record.farmerId) {
              const farmerInfo = await fetchFarmerDetails(record.farmerId);
              return { ...record, farmerInfo };
            }
            return record;
          })
        );

        setAllPaymentRecords(records);
        return records;
      }
    } catch {
      toast.error("Failed to load export data");
      return [];
    }
    return [];
  };

  // Debounced search - FIXED: Added fetchPaymentRecords to dependency array
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchPaymentRecords();
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, traderIdFilter, orderIdFilter, startDateFilter, endDateFilter, paymentStatusFilter]);

  // FIXED: Added useEffect for pagination changes
  useEffect(() => {
    fetchPaymentRecords();
  }, [currentPage, itemsPerPage, sortField, sortOrder]);

  // Get unique traders for filter dropdown
  const getUniqueTraders = useMemo(() => {
    const traders = paymentRecords
      .map(record => ({ id: record.traderId, name: record.traderName }))
      .filter((trader, index, self) =>
        trader.id &&
        trader.id.trim() !== '' &&
        index === self.findIndex(t => t.id === trader.id)
      );
    return traders.sort((a, b) => a.name.localeCompare(b.name));
  }, [paymentRecords]);

  // Get unique order IDs for filter dropdown
  const getUniqueOrderIds = useMemo(() => {
    const orderIds = paymentRecords
      .map(record => record.orderId)
      .filter(orderId => orderId && orderId.trim() !== '');
    return [...new Set(orderIds)].sort();
  }, [paymentRecords]);

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

  // Generate unique key for records
  const generateRecordKey = (record: PaymentRecord, index: number) => {
    return record._id || `${record.orderId}-${record.traderId}-${index}-${Date.now()}`;
  };

  // Export functions - FIXED: Added data fetching before export
  const handleCopyToClipboard = async (): Promise<void> => {
    const records = await fetchAllPaymentRecordsForExport();
    
    if (!records || records.length === 0) {
      toast.error("No payment records to copy");
      return;
    }

    // Define headers with optimal widths
    const headers = [
      { name: "Order ID", width: 12 },
      { name: "Trader", width: 22 },
      { name: "Trader Mobile", width: 15 },
      { name: "Trader Email", width: 25 },
      { name: "State", width: 15 },
      { name: "District", width: 15 },
      { name: "Taluk", width: 15 },
      { name: "Farmer", width: 20 },
      { name: "Total", width: 14 },
      { name: "Paid", width: 12 },
      { name: "Due", width: 12 },
      { name: "Status", width: 18 },
      { name: "Paid %", width: 8 }
    ];

    // Create header row
    const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
    const separator = "─".repeat(headerRow.length);

    // Format currency with ₹ symbol
    const formatCurrency = (amount: number): string =>
      `₹${(amount || 0).toLocaleString('en-IN')}`;

    // Format each payment record
    const paymentRows = records.map((record: any) => {
      // Format trader info
      const traderInfo = `${record.traderName || "N/A"} (${record.traderId?.substring(0, 8) || "N/A"}...)`;
      const formattedTrader = traderInfo.length > 20
        ? traderInfo.substring(0, 17) + "..."
        : traderInfo;

      // Format trader contact info
      const traderMobile = record.traderDetails?.mobileNo || record.traderDetails?.personalInfo?.mobileNo || "N/A";
      const traderEmail = record.traderDetails?.email || record.traderDetails?.personalInfo?.email || "N/A";
      const traderState = record.traderDetails?.state || record.traderDetails?.personalInfo?.state || "N/A";
      const traderDistrict = record.traderDetails?.district || record.traderDetails?.personalInfo?.district || "N/A";
      const traderTaluk = record.traderDetails?.taluk || record.traderDetails?.personalInfo?.taluk || "N/A";

      // Format farmer info
      const farmerInfo = record.farmerInfo ?
        `${record.farmerInfo.farmerName || "N/A"} (${record.farmerInfo.farmerId || "N/A"})` :
        "No Farmer";
      const formattedFarmer = farmerInfo.length > 18
        ? farmerInfo.substring(0, 15) + "..."
        : farmerInfo;

      // Calculate payment percentage
      const paymentPercentage = record.totalAmount > 0
        ? Math.round((record.paidAmount / record.totalAmount) * 100)
        : 0;

      // Format status with emoji
      const paymentStatus = record.paymentStatus || "N/A";
      const statusEmoji = paymentStatus === "completed" ? "✅" :
        paymentStatus === "partially_paid" ? "💰" :
          paymentStatus === "pending" ? "⏳" :
            paymentStatus === "failed" ? "❌" : "";

      // Create row values with padding
      const rowValues = [
        (record.orderId || "N/A").padEnd(headers[0].width),
        formattedTrader.padEnd(headers[1].width),
        traderMobile.padEnd(headers[2].width),
        traderEmail.padEnd(headers[3].width),
        traderState.padEnd(headers[4].width),
        traderDistrict.padEnd(headers[5].width),
        traderTaluk.padEnd(headers[6].width),
        formattedFarmer.padEnd(headers[7].width),
        formatCurrency(record.totalAmount || 0).padEnd(headers[8].width),
        formatCurrency(record.paidAmount || 0).padEnd(headers[9].width),
        formatCurrency(record.remainingAmount || 0).padEnd(headers[10].width),
        `${statusEmoji} ${paymentStatus}`.padEnd(headers[11].width),
        `${paymentPercentage}%`.padEnd(headers[12].width)
      ];

      return rowValues.join(" │ ");
    });

    // Calculate financial analytics
    const totals = records.reduce((acc: any, record: any) => {
      acc.totalAmount += record.totalAmount || 0;
      acc.totalPaid += record.paidAmount || 0;
      acc.totalDue += record.remainingAmount || 0;
      acc.byStatus[record.paymentStatus] = (acc.byStatus[record.paymentStatus] || 0) + 1;
      return acc;
    }, {
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      byStatus: {}
    });

    const collectionRate = totals.totalAmount > 0
      ? Math.round((totals.totalPaid / totals.totalAmount) * 100)
      : 0;

    // Build complete table with analytics
    const tableContent = [
      "💰 PAYMENT COLLECTION REPORT",
      "=".repeat(headerRow.length),
      headerRow,
      separator,
      ...paymentRows,
      separator,
      "",
      "📊 FINANCIAL SUMMARY",
      `• Total Records: ${records.length}`,
      `• Total Billed Amount: ₹${totals.totalAmount.toLocaleString('en-IN')}`,
      `• Total Collected: ₹${totals.totalPaid.toLocaleString('en-IN')}`,
      `• Total Outstanding: ₹${totals.totalDue.toLocaleString('en-IN')}`,
      `• Collection Rate: ${collectionRate}%`,
      `• Average Collection: ₹${Math.round(totals.totalPaid / records.length).toLocaleString('en-IN')}`,
      "",
      "📈 PAYMENT STATUS DISTRIBUTION",
      ...Object.entries(totals.byStatus).map(([status, count]: [string, any]) => {
        const amountByStatus = records
          .filter((r: any) => r.paymentStatus === status)
          .reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
        return `• ${status}: ${count} records (₹${amountByStatus.toLocaleString('en-IN')})`;
      }),
      "",
      "👥 TRADER STATISTICS",
      `• Total Traders: ${[...new Set(records.map(o => o.traderId).filter(Boolean))].length}`,
      `• Records with Traders: ${records.filter(o => o.traderId).length}`,
      "",
      "👤 FARMER STATISTICS",
      `• Total Farmers: ${[...new Set(records.map(o => o.farmerId).filter(Boolean))].length}`,
      `• Records with Farmers: ${records.filter(o => o.farmerId).length}`,
      "",
      "🎯 COLLECTION INSIGHTS",
      `• Fully Paid: ${records.filter((r: any) => r.paymentStatus === "completed").length}`,
      `• Partially Paid: ${records.filter((r: any) => r.paymentStatus === "partially_paid").length}`,
      `• Pending: ${records.filter((r: any) => r.paymentStatus === "pending").length}`,
      `• High Value (>₹10K): ${records.filter((r: any) => (r.totalAmount || 0) > 10000).length}`,
      "",
      "📅 REPORT METADATA",
      `• Report Period: All Time`,
      `• Generated: ${new Date().toLocaleString()}`,
      `• Data Source: ${records.length} payment records`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`Copied ${records.length} payment records!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = async () => {
    const records = await fetchAllPaymentRecordsForExport();
    if (records.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = records.map((record) => {
      const traderDetails = record.traderDetails;
      return {
        "Order ID": record.orderId,
        "Trader ID": record.traderId,
        "Trader Name": record.traderName,
        "Trader Mobile": traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo || 'N/A',
        "Trader Email": traderDetails?.email || traderDetails?.personalInfo?.email || 'N/A',
        "Trader State": traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A',
        "Trader District": traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A',
        "Trader Taluk": traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A',
        "Trader Address": traderDetails?.address || traderDetails?.personalInfo?.address || 'N/A',
        "Trader Pincode": traderDetails?.pincode || traderDetails?.personalInfo?.pincode || 'N/A',
        "Farmer ID": record.farmerInfo?.farmerId || 'N/A',
        "Farmer Name": record.farmerInfo?.farmerName || 'N/A',
        "Farmer Mobile": record.farmerInfo?.farmerMobile || 'N/A',
        "Farmer Address": record.farmerInfo?.farmerAddress || 'N/A',
        "Total Amount": record.totalAmount,
        "Paid Amount": record.paidAmount,
        "Remaining Amount": record.remainingAmount,
        "Payment Status": record.paymentStatus,
        "Payment Completed": record.remainingAmount === 0 ? "Yes" : "No",
        "Payment Percentage": record.totalAmount > 0 ? ((record.paidAmount / record.totalAmount) * 100).toFixed(2) + "%" : "0%"
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Traders Payment Clearance");
    writeFile(wb, `traders-payment-clearance-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = async () => {
    const records = await fetchAllPaymentRecordsForExport();
    if (records.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Order ID", "Trader Name", "Trader Mobile", "Trader Email", "State", "District", "Taluk", "Farmer Name", "Total Amount", "Paid Amount", "Remaining Amount", "Payment Status"];

    const csvContent = [
      headers.join(","),
      ...records.map((record) => {
        const traderDetails = record.traderDetails;
        return [
          `"${record.orderId}"`,
          `"${record.traderName}"`,
          `"${traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo || 'N/A'}"`,
          `"${traderDetails?.email || traderDetails?.personalInfo?.email || 'N/A'}"`,
          `"${traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A'}"`,
          `"${traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A'}"`,
          `"${traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A'}"`,
          `"${record.farmerInfo?.farmerName || 'N/A'}"`,
          record.totalAmount,
          record.paidAmount,
          record.remainingAmount,
          `"${record.paymentStatus}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `traders-payment-clearance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = async () => {
    const records = await fetchAllPaymentRecordsForExport();
    if (records.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF('landscape');
    doc.text("Traders Payment Clearance Report", 14, 16);

    const tableColumn = ["Order ID", "Trader", "Trader Mobile", "State", "District", "Taluk", "Farmer", "Total Amount", "Paid Amount", "Remaining", "Status"];
    const tableRows: any = records.map((record) => {
      const traderDetails = record.traderDetails;
      return [
        record.orderId,
        record.traderName,
        traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo || 'N/A',
        traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A',
        traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A',
        traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A',
        record.farmerInfo?.farmerName || 'N/A',
        `₹${record.totalAmount.toLocaleString()}`,
        `₹${record.paidAmount.toLocaleString()}`,
        `₹${record.remainingAmount.toLocaleString()}`,
        record.paymentStatus
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`traders-payment-clearance-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = async () => {
    const records = await fetchAllPaymentRecordsForExport();
    if (records.length === 0) {
      toast.error("No data to print");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Traders Payment Clearance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .summary-item { text-align: center; }
          .summary-value { font-size: 24px; font-weight: bold; color: #1f2937; }
          .summary-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-paid { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-pending { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .status-partial { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
          .trader-info { background-color: #f0f9ff; padding: 8px; border-radius: 6px; margin: 5px 0; }
          .farmer-info { background-color: #f0fdf4; padding: 8px; border-radius: 6px; margin: 5px 0; }
          .trader-label { font-weight: bold; color: #1d4ed8; }
          .farmer-label { font-weight: bold; color: #166534; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Traders Payment Clearance Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <h3>Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${summary.totalClearedOrders}</div>
              <div class="summary-label">Total Cleared Orders</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">₹${summary.totalClearedAmount.toLocaleString()}</div>
              <div class="summary-label">Total Cleared Amount</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${summary.tradersCount}</div>
              <div class="summary-label">Traders</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">₹${summary.averageClearedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div class="summary-label">Average Amount</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${summary.clearedThisWeek}</div>
              <div class="summary-label">Cleared This Week</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${summary.clearedThisMonth}</div>
              <div class="summary-label">Cleared This Month</div>
            </div>
          </div>
        </div>
        
        <p>Total Records: ${records.length}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Trader Details</th>
              <th>Farmer Details</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((record) => {
      const traderDetails = record.traderDetails;
      const statusClass = `status-${record.paymentStatus}`;
      return `
                <tr>
                  <td>${record.orderId}</td>
                  <td>
                    <div class="trader-info">
                      <div><span class="trader-label">Name:</span> ${record.traderName}</div>
                      <div><span class="trader-label">ID:</span> ${record.traderId}</div>
                      <div><span class="trader-label">Mobile:</span> ${traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo || 'N/A'}</div>
                      <div><span class="trader-label">Email:</span> ${traderDetails?.email || traderDetails?.personalInfo?.email || 'N/A'}</div>
                      <div><span class="trader-label">Location:</span> ${traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A'}, ${traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A'}, ${traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    ${record.farmerInfo ? `
                      <div class="farmer-info">
                        <div><span class="farmer-label">Name:</span> ${record.farmerInfo.farmerName}</div>
                        <div><span class="farmer-label">ID:</span> ${record.farmerInfo.farmerId}</div>
                        <div><span class="farmer-label">Mobile:</span> ${record.farmerInfo.farmerMobile}</div>
                        <div><span class="farmer-label">Address:</span> ${record.farmerInfo.farmerAddress}</div>
                      </div>
                    ` : 'No Farmer'}
                  </td>
                  <td>₹${record.totalAmount.toLocaleString()}</td>
                  <td>₹${record.paidAmount.toLocaleString()}</td>
                  <td>₹${record.remainingAmount.toLocaleString()}</td>
                  <td><span class="${statusClass}">${record.paymentStatus.toUpperCase()}</span></td>
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
    toast.success("Printing payment clearance report...");
  };

  // Payment status badge colors
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
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

  // Calculate payment percentage
  const calculatePaymentPercentage = (paid: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  // Open details dialog
  const openDetailsDialog = (record: PaymentRecord) => {
    setCurrentRecord(record);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setPaymentStatusFilter('paid');
    setTraderIdFilter('');
    setOrderIdFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSortField('lastStatusChangeDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchPaymentRecords();
  };

  const { startItem, endItem } = getPaginationRange();

  if (loading && paymentRecords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment clearance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          Traders Payment Clearance Report
        </h1>
        <p className="text-gray-600 mt-1">Monitor and manage trader payment clearance status and records</p>
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

      {/* Stats Cards */}
      {
        data?.role == "admin" &&<>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Total Cleared Orders</p>
                  <p className="text-xl font-bold text-gray-900">{summary.totalClearedOrders}</p>
                </div>
                <FaFileInvoiceDollar className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Total Cleared Amount</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalClearedAmount)}</p>
                </div>
                <FaMoneyBillWave className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Average Amount</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.averageClearedAmount)}</p>
                </div>
                <FaChartLine className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Total Traders</p>
                  <p className="text-xl font-bold text-gray-900">{summary.tradersCount}</p>
                </div>
                <FaUsers className="text-yellow-500 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Cleared This Week</p>
                  <p className="text-xl font-bold text-gray-900">{summary.clearedThisWeek}</p>
                </div>
                <FaCalendarAlt className="text-indigo-500 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Cleared This Month</p>
                  <p className="text-xl font-bold text-gray-900">{summary.clearedThisMonth}</p>
                </div>
                <FaClipboardList className="text-red-500 text-xl" />
              </div>
            </div>
          </div>
        </>
      }

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
              placeholder="Search by trader name, order ID, farmer name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCreditCard className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none  bg-white text-sm"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="all">All Status</option>
            </select>
          </div>

          {/* Trader ID Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none  bg-white text-sm"
              value={traderIdFilter}
              onChange={(e) => setTraderIdFilter(e.target.value)}
            >
              <option value="">All Traders</option>
              {getUniqueTraders.map((trader) => (
                <option key={`trader-${trader.id}`} value={trader.id}>
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
                  onClick={() => handleSort('totalAmount')}
                >
                  Amount Details {getSortIcon('totalAmount')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentRecords.map((record, index) => {
                const paymentPercentage = calculatePaymentPercentage(record.paidAmount, record.totalAmount);
                const traderDetails = record.traderDetails;

                return (
                  <tr key={generateRecordKey(record, index)} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{record.orderId}</div>
                      <div className="text-xs text-gray-500">Trader ID: {record.traderId}</div>
                    </td>

                    {/* Trader Details - Updated with state, district, taluk, mobile, email */}
                    <td className="px-4 py-3">
                      <div className="space-y-1 min-w-0">
                        {/* Trader Name */}
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{record.traderName}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {record.traderId}</div>
                          </div>
                        </div>

                        {/* Trader Mobile */}
                        {(traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo) && (
                          <div className="flex items-center text-xs text-gray-600 ml-6">
                            <FaMobileAlt className="mr-1 flex-shrink-0" />
                            <span className="truncate">{traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo}</span>
                          </div>
                        )}

                        {/* Trader Email */}
                        {(traderDetails?.email || traderDetails?.personalInfo?.email) && (
                          <div className="flex items-center text-xs text-gray-600 ml-6">
                            <FaEnvelope className="mr-1 flex-shrink-0" />
                            <span className="truncate">{traderDetails?.email || traderDetails?.personalInfo?.email}</span>
                          </div>
                        )}

                        {/* Trader Location */}
                        <div className="flex items-center text-xs text-gray-600 ml-6">
                          <FaLocationArrow className="mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A'}, 
                            {traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A'}, 
                            {traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Farmer Details */}
                    <td className="px-4 py-3">
                      {record.farmerInfo ? (
                        <div className="space-y-1 min-w-0">
                          {/* Farmer ID and Name */}
                          <div className="flex items-center">
                            <FaUserTag className="text-green-500 mr-2 flex-shrink-0 text-xs" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {record.farmerInfo.farmerName}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                ID: {record.farmerInfo.farmerId}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Number */}
                          {record.farmerInfo.farmerMobile !== 'N/A' && (
                            <div className="flex items-center text-xs text-gray-600 ml-6">
                              <FaMobileAlt className="mr-1 flex-shrink-0" />
                              <span className="truncate">{record.farmerInfo.farmerMobile}</span>
                            </div>
                          )}

                          {/* Address */}
                          {record.farmerInfo.farmerAddress !== 'N/A' && record.farmerInfo.farmerAddress !== '' && (
                            <div className="flex items-start text-xs text-gray-600 ml-6">
                              <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                              <span className="truncate">{record.farmerInfo.farmerAddress}</span>
                            </div>
                          )}

                          {/* Show when no address is available */}
                          {(record.farmerInfo.farmerAddress === 'N/A' || record.farmerInfo.farmerAddress === '') && (
                            <div className="flex items-center text-xs text-gray-400 italic ml-6">
                              <FaHome className="mr-1 flex-shrink-0" />
                              <span>No address available</span>
                            </div>
                          )}
                        </div>
                      ) : record.farmerId ? (
                        <div className="text-xs text-gray-500 italic">
                          Loading farmer details...
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">
                          No farmer assigned
                        </div>
                      )}
                    </td>

                    {/* Amount Details */}
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Total:</span>
                          <span className="text-sm font-semibold">{formatCurrency(record.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Paid:</span>
                          <span className="text-sm font-semibold text-green-600">{formatCurrency(record.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Remaining:</span>
                          <span className={`text-sm font-semibold ${record.remainingAmount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatCurrency(record.remainingAmount)}
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {formatStatus(record.paymentStatus)}
                      </span>
                      {record.remainingAmount === 0 && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                          <FaCheckCircle className="mr-1" /> Fully Cleared
                        </div>
                      )}
                    </td>

                    {/* Actions - View Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openDetailsDialog(record)}
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
        {paymentRecords.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">
              <FaMoneyBillWave className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment clearance records found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-3">
        {paymentRecords.map((record, index) => {
          const paymentPercentage = calculatePaymentPercentage(record.paidAmount, record.totalAmount);
          const traderDetails = record.traderDetails;

          return (
            <div key={generateRecordKey(record, index)} className="bg-white rounded-lg shadow p-3">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-blue-600 text-sm truncate">{record.orderId}</div>
                  <div className="text-xs text-gray-500 truncate">{record.traderName}</div>
                  <div className="text-xs text-gray-400 truncate">ID: {record.traderId}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openDetailsDialog(record)}
                    className="text-blue-600 p-1"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => setExpandedRecord(
                      expandedRecord === record._id
                        ? null
                        : (record._id || record.orderId)
                    )}
                    className="text-gray-500 p-1"
                    title={expandedRecord === (record._id || record.orderId) ? "Collapse" : "Expand"}
                  >
                    {expandedRecord === (record._id || record.orderId) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Trader Info in Mobile View */}
              <div className="mb-2 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                <div className="text-xs text-gray-500 mb-1">Trader Details</div>
                <div className="space-y-1">
                  {/* Trader Mobile */}
                  {(traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo) && (
                    <div className="flex items-center text-xs">
                      <FaMobileAlt className="text-blue-500 mr-2 text-xs flex-shrink-0" />
                      <span className="truncate">{traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo}</span>
                    </div>
                  )}

                  {/* Trader Email */}
                  {(traderDetails?.email || traderDetails?.personalInfo?.email) && (
                    <div className="flex items-center text-xs">
                      <FaEnvelope className="text-blue-500 mr-2 text-xs flex-shrink-0" />
                      <span className="truncate">{traderDetails?.email || traderDetails?.personalInfo?.email}</span>
                    </div>
                  )}

                  {/* Trader Location */}
                  <div className="flex items-center text-xs">
                    <FaLocationArrow className="text-blue-500 mr-2 text-xs flex-shrink-0" />
                    <span className="truncate">
                      {traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A'}, 
                      {traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A'}, 
                      {traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farmer Info in Mobile View */}
              {record.farmerInfo && (
                <div className="mb-2 p-2 bg-green-50 rounded border-l-2 border-green-500">
                  <div className="text-xs text-gray-500 mb-1">Farmer Details</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <FaUserTag className="text-green-500 mr-2 text-xs flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{record.farmerInfo.farmerName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {record.farmerInfo.farmerId}</div>
                      </div>
                    </div>
                    {record.farmerInfo.farmerMobile !== 'N/A' && (
                      <div className="flex items-center text-xs text-gray-600 ml-6">
                        <FaMobileAlt className="mr-1 flex-shrink-0" />
                        <span className="truncate">{record.farmerInfo.farmerMobile}</span>
                      </div>
                    )}
                    {record.farmerInfo.farmerAddress !== 'N/A' && record.farmerInfo.farmerAddress !== '' && (
                      <div className="flex items-start text-xs text-gray-600 ml-6">
                        <FaHome className="mr-1 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{record.farmerInfo.farmerAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="truncate">
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="font-bold text-sm truncate">{formatCurrency(record.totalAmount)}</div>
                </div>
                <div className="truncate">
                  <div className="text-xs text-gray-500">Payment Status</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)} truncate`}>
                    {formatStatus(record.paymentStatus)}
                  </span>
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

              {/* Expanded Content */}
              {expandedRecord === (record._id || record.orderId) && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {/* Trader Details in Expanded View */}
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-xs text-gray-500 mb-2">Trader Information</div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-600">Name</div>
                          <div className="text-sm font-medium">{record.traderName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">ID</div>
                          <div className="text-sm font-medium">{record.traderId}</div>
                        </div>
                      </div>
                      {(traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo) && (
                        <div>
                          <div className="text-xs text-gray-600">Mobile</div>
                          <div className="text-sm font-medium">{traderDetails?.mobileNo || traderDetails?.personalInfo?.mobileNo}</div>
                        </div>
                      )}
                      {(traderDetails?.email || traderDetails?.personalInfo?.email) && (
                        <div>
                          <div className="text-xs text-gray-600">Email</div>
                          <div className="text-sm font-medium">{traderDetails?.email || traderDetails?.personalInfo?.email}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-600">Location</div>
                        <div className="text-sm font-medium">
                          {traderDetails?.state || traderDetails?.personalInfo?.state || 'N/A'}, 
                          {traderDetails?.district || traderDetails?.personalInfo?.district || 'N/A'}, 
                          {traderDetails?.taluk || traderDetails?.personalInfo?.taluk || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Payment Breakdown</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Paid Amount:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(record.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Remaining Amount:</span>
                        <span className={`text-sm font-bold ${record.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(record.remainingAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Payment Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(record.paymentStatus)}`}>
                          {formatStatus(record.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination and Limit Controls */}
      {paymentRecords.length > 0 && (
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

      {/* Payment Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
                <FaFileInvoiceDollar className="text-blue-600 flex-shrink-0" />
                <span className="truncate">Payment Details: {currentRecord?.orderId}</span>
              </h2>
              <p className="text-gray-600 text-sm truncate">Complete payment clearance information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {currentRecord && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Payment Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaReceipt className="text-blue-600" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Order ID:</span>
                      <span className="font-medium text-sm">{currentRecord.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader ID:</span>
                      <span className="font-medium text-sm">{currentRecord.traderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trader Name:</span>
                      <span className="font-medium text-sm">{currentRecord.traderName}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaCreditCard className="text-green-600" />
                    Payment Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(currentRecord.paymentStatus)}`}>
                        {formatStatus(currentRecord.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Fully Cleared:</span>
                      <span className={`font-medium text-sm ${currentRecord.remainingAmount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currentRecord.remainingAmount === 0 ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trader Information Section */}
              {currentRecord.traderDetails && (
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaUser className="text-indigo-600" />
                    Trader Information
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Mobile Number</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <FaMobileAlt className="text-gray-500" />
                          {currentRecord.traderDetails.mobileNo || currentRecord.traderDetails.personalInfo?.mobileNo || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Email Address</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          {currentRecord.traderDetails.email || currentRecord.traderDetails.personalInfo?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">State</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          {currentRecord.traderDetails.state || currentRecord.traderDetails.personalInfo?.state || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">District</div>
                        <div className="text-sm font-medium">
                          {currentRecord.traderDetails.district || currentRecord.traderDetails.personalInfo?.district || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Taluk</div>
                        <div className="text-sm font-medium">
                          {currentRecord.traderDetails.taluk || currentRecord.traderDetails.personalInfo?.taluk || 'N/A'}
                        </div>
                      </div>
                    </div>
                    {(currentRecord.traderDetails.address || currentRecord.traderDetails.personalInfo?.address) && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Address</div>
                        <div className="text-sm font-medium">
                          {currentRecord.traderDetails.address || currentRecord.traderDetails.personalInfo?.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Farmer Information Section */}
              {currentRecord.farmerInfo && (
                <div className="bg-yellow-50 p-3 rounded">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaUserTag className="text-yellow-600" />
                    Farmer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Farmer ID:</span>
                      <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Name:</span>
                      <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Mobile:</span>
                      <span className="font-medium text-sm">{currentRecord.farmerInfo.farmerMobile}</span>
                    </div>
                    {currentRecord.farmerInfo.farmerAddress && currentRecord.farmerInfo.farmerAddress !== 'N/A' && (
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Address:</div>
                        <div className="font-medium text-sm text-gray-900">
                          {currentRecord.farmerInfo.farmerAddress}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amount Details */}
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-purple-600" />
                  Amount Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(currentRecord.totalAmount)}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border border-green-200">
                      <div className="text-xs text-gray-500 mb-1">Paid Amount</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(currentRecord.paidAmount)}</div>
                    </div>
                    <div className={`text-center p-2 bg-white rounded border ${currentRecord.remainingAmount > 0 ? 'border-red-200' : 'border-green-200'}`}>
                      <div className="text-xs text-gray-500 mb-1">Remaining Amount</div>
                      <div className={`text-lg font-bold ${currentRecord.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(currentRecord.remainingAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Payment Progress</span>
                      <span className="text-xs font-medium">
                        {calculatePaymentPercentage(currentRecord.paidAmount, currentRecord.totalAmount)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${calculatePaymentPercentage(currentRecord.paidAmount, currentRecord.totalAmount)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Payment Summary:</span>
                      <span className={`text-sm font-bold ${currentRecord.remainingAmount === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {currentRecord.remainingAmount === 0
                          ? 'Fully Paid'
                          : `${formatCurrency(currentRecord.remainingAmount)} Pending`}
                      </span>
                    </div>
                    {currentRecord.paidAmount > currentRecord.totalAmount && (
                      <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                        <FaMoneyBillWave className="inline mr-1" />
                        Note: Paid amount exceeds total amount. This may indicate a refund or adjustment.
                      </div>
                    )}
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

export default TradersPaymentClearanceReport;