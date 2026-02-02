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
  FaCreditCard,
  FaMoneyBillWave,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaPercentage,
  FaReceipt,
  FaChartLine,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaHistory,
  FaClock
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminSessionAction } from '@/app/actions/auth-actions';
import { AiOutlineClose } from 'react-icons/ai';

// Interfaces
interface FarmerPayment {
  orderId: string;
  farmerId: string;
  farmerName: string;
  createdAt: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paidDate?: string;
  farmerState?:string;
  farmerDistrict?:string;
  farmerTaluka?:string;
  farmerMobile?:string;
  farmerAddress?:string;
  farmerPincode?:string;
}

const FarmerPaymentsReport: React.FC = () => {
  const [paymentsData, setPaymentsData] = useState<FarmerPayment[]>([]);
  const [allPaymentsData, setAllPaymentsData] = useState<FarmerPayment[]>([]);
  const [displayedData, setDisplayedData] = useState<FarmerPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Filter states
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  // Sorting states
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Current item for details dialog
  const [currentItem, setCurrentItem] = useState<FarmerPayment | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  
  // Mobile view state
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const[user,setUser]=useState<{
        taluka:string,
        role:string
      }>()

  const API_BASE ='/api';
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch payments data with server-side pagination and sorting
  const fetchPaymentsData = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (searchInput) params.append('search', searchInput);
    if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
    if (paymentMethodFilter) params.append('paymentMethod', paymentMethodFilter);
    if (dateRangeFilter.start) params.append('startDate', dateRangeFilter.start);
    if (dateRangeFilter.end) params.append('endDate', dateRangeFilter.end);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    params.append('sortBy', sortField);
    params.append('order', sortOrder);

    const session = await getAdminSessionAction();
                                setUser(session?.admin)
                                if(session?.admin?.role == "subadmin"){
                                 params.append('taluk',session?.admin?.taluka)
                               }
        

    try {
      const response = await axios.get(`${API_BASE}/adminToFarmerPayment?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setPaymentsData(data);
        setDisplayedData(data);
        setTotalItems(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
        
        // For export functionality, fetch all data without pagination but with sorting
        const exportParams = new URLSearchParams();
        if (searchInput) exportParams.append('search', searchInput);
        if (paymentStatusFilter) exportParams.append('paymentStatus', paymentStatusFilter);
        if (paymentMethodFilter) exportParams.append('paymentMethod', paymentMethodFilter);
        if (dateRangeFilter.start) exportParams.append('startDate', dateRangeFilter.start);
        if (dateRangeFilter.end) exportParams.append('endDate', dateRangeFilter.end);
        exportParams.append('limit', '10000'); // Large limit for all data
        exportParams.append('sortBy', sortField);
        exportParams.append('order', sortOrder);
        
        const exportResponse = await axios.get(`${API_BASE}/adminToFarmerPayment?${exportParams.toString()}`);
        if (exportResponse.data.success) {
          setAllPaymentsData(exportResponse.data.data || []);
        }
      } else {
        toast.error('Failed to fetch farmer payments data');
      }
    } catch (error) {
      console.error('Error fetching farmer payments:', error);
      toast.error('Error fetching farmer payments data');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, searchInput, paymentStatusFilter, paymentMethodFilter, dateRangeFilter, currentPage, itemsPerPage, sortField, sortOrder]);

  // Fetch data when filters, pagination or sorting changes
  useEffect(() => {
    fetchPaymentsData();
  }, [currentPage, itemsPerPage, sortField, sortOrder, fetchPaymentsData]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
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
  // const handleCopyToClipboard = async () => {
  //   const headers = ["Order ID", "Farmer ID", "Farmer Name", "Total Amount", "Paid Amount", "Remaining", "Status", "Payment Date", "Payment Method"];
    
  //   const csvContent = [
  //     headers.join("\t"),
  //     ...allPaymentsData.map((item) => [
  //       item.orderId,
  //       item.farmerId,
  //       item.farmerName,
  //       item.totalAmount,
  //       item.paidAmount,
  //       item.remainingAmount,
  //       item.paymentStatus,
  //       item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A',
  //       item.paymentMethod || 'N/A'
  //     ].join("\t"))
  //   ].join("\n");
    
  //   try {
  //     await navigator.clipboard.writeText(csvContent);
  //     toast.success("Data copied to clipboard!");
  //   } catch (err) {
  //     console.error("Failed to copy: ", err);
  //     toast.error("Failed to copy to clipboard");
  //   }
  // };
const handleCopyToClipboard = async (): Promise<void> => {
  if (!allPaymentsData || allPaymentsData.length === 0) {
    toast.error("No payment data to copy");
    return;
  }

  // Define headers with optimized widths
  const headers = [
    { name: "Order ID", width: 14 },
    { name: "Farmer", width: 22 },
    { name: "Total", width: 14 },
    { name: "Paid", width: 12 },
    { name: "Due", width: 12 },
    { name: "Status", width: 16 },
    { name: "Paid Date", width: 14 },
    { name: "Method", width: 12 }
  ];
  
  // Create header row
  const headerRow = headers.map(h => h.name.padEnd(h.width)).join(" │ ");
  const separator = "─".repeat(headerRow.length);
  
  // Format currency with ₹ symbol
  const formatCurrency = (amount: number): string => 
    `₹${(amount || 0).toLocaleString('en-IN')}`;
  
  // Format each payment row
  const paymentRows = allPaymentsData.map((item: any) => {
    // Format farmer info
    const farmerInfo = `${item.farmerName || "N/A"} (${item.farmerId?.substring(0, 8) || "N/A"}...)`;
    const formattedFarmer = farmerInfo.length > 20 
      ? farmerInfo.substring(0, 17) + "..." 
      : farmerInfo;
    
    // Calculate payment percentage
    const paymentPercentage = item.totalAmount > 0 
      ? Math.round((item.paidAmount / item.totalAmount) * 100) 
      : 0;
    
    // Format status with emoji
    const paymentStatus = item.paymentStatus || "N/A";
    const statusEmoji = paymentStatus === "completed" ? "✅" : 
                       paymentStatus === "partially_paid" ? "💰" : 
                       paymentStatus === "pending" ? "⏳" : 
                       paymentStatus === "failed" ? "❌" : "";
    
    // Format payment date
    const paymentDate = item.paidDate 
      ? new Date(item.paidDate).toLocaleDateString() 
      : "Not Paid";
    
    // Format payment method
    const paymentMethod = item.paymentMethod || "N/A";
    const methodIcon = paymentMethod.toLowerCase().includes("bank") ? "🏦" : 
                      paymentMethod.toLowerCase().includes("upi") ? "📱" : 
                      paymentMethod.toLowerCase().includes("cash") ? "💵" : "💳";
    
    // Create row values with padding
    const rowValues = [
      (item.orderId || "N/A").padEnd(headers[0].width),
      formattedFarmer.padEnd(headers[1].width),
      formatCurrency(item.totalAmount || 0).padEnd(headers[2].width),
      formatCurrency(item.paidAmount || 0).padEnd(headers[3].width),
      formatCurrency(item.remainingAmount || 0).padEnd(headers[4].width),
      `${statusEmoji} ${paymentStatus} (${paymentPercentage}%)`.padEnd(headers[5].width),
      paymentDate.padEnd(headers[6].width),
      `${methodIcon} ${paymentMethod}`.padEnd(headers[7].width)
    ];
    
    return rowValues.join(" │ ");
  });
  
  // Calculate payment analytics
  const analytics = allPaymentsData.reduce((acc: any, item: any) => {
    acc.totalAmount += item.totalAmount || 0;
    acc.totalPaid += item.paidAmount || 0;
    acc.totalDue += item.remainingAmount || 0;
    acc.byStatus[item.paymentStatus] = (acc.byStatus[item.paymentStatus] || 0) + 1;
    acc.byMethod[item.paymentMethod] = (acc.byMethod[item.paymentMethod] || 0) + 1;
    
    // Count paid items
    if (item.paidDate) {
      acc.paidCount++;
    }
    
    return acc;
  }, {
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    byStatus: {},
    byMethod: {},
    paidCount: 0
  });
  
  const collectionRate = analytics.totalAmount > 0 
    ? Math.round((analytics.totalPaid / analytics.totalAmount) * 100) 
    : 0;
  
  // Build complete table with analytics
  const tableContent = [
    "👨‍🌾 FARMER PAYMENTS REPORT",
    "=".repeat(headerRow.length),
    headerRow,
    separator,
    ...paymentRows,
    separator,
    "",
    "💰 FINANCIAL SUMMARY",
    `• Total Payments: ${allPaymentsData.length}`,
    `• Total Billed: ₹${analytics.totalAmount.toLocaleString('en-IN')}`,
    `• Total Paid: ₹${analytics.totalPaid.toLocaleString('en-IN')}`,
    `• Total Due: ₹${analytics.totalDue.toLocaleString('en-IN')}`,
    `• Collection Rate: ${collectionRate}%`,
    `• Average Payment: ₹${Math.round(analytics.totalPaid / analytics.paidCount).toLocaleString('en-IN')}`,
    "",
    "📊 PAYMENT STATUS DISTRIBUTION",
    ...Object.entries(analytics.byStatus).map(([status, count]: [string, any]) => {
      const amountByStatus = allPaymentsData
        .filter((item: any) => item.paymentStatus === status)
        .reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0);
      return `• ${status}: ${count} payments (₹${amountByStatus.toLocaleString('en-IN')})`;
    }),
    "",
    "💳 PAYMENT METHOD ANALYSIS",
    ...Object.entries(analytics.byMethod).map(([method, count]: [string, any]) => 
      `• ${method}: ${count} payments (${Math.round((count / allPaymentsData.length) * 100)}%)`
    ),
    "",
    "👥 FARMER PAYMENT INSIGHTS",
    `• Unique Farmers: ${new Set(allPaymentsData.map((item: any) => item.farmerId)).size}`,
    `• Unique Orders: ${new Set(allPaymentsData.map((item: any) => item.orderId)).size}`,
    `• Payments Made: ${analytics.paidCount}`,
    `• Pending Payments: ${allPaymentsData.length - analytics.paidCount}`,
    "",
    "📅 TIMELINE ANALYSIS",
    `• Paid Payments: ${analytics.paidCount}`,
    `• Unpaid Payments: ${allPaymentsData.filter((item: any) => !item.paidDate).length}`,
    `• Average Payment Amount: ₹${Math.round(analytics.totalPaid / Math.max(analytics.paidCount, 1)).toLocaleString('en-IN')}`,
    "",
    `🔍 Report Generated: ${new Date().toLocaleString()}`
  ].join("\n");
  
  try {
    await navigator.clipboard.writeText(tableContent);
    toast.success(`Copied ${allPaymentsData.length} farmer payments!`);
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy to clipboard");
  }
};
  const handleExportExcel = () => {
    const data = allPaymentsData.map((item) => ({
      "Order ID": item.orderId,
      "Farmer ID": item.farmerId,
      "Farmer Name": item.farmerName,
      "Total Amount": item.totalAmount,
      "Paid Amount": item.paidAmount,
      "Remaining Amount": item.remainingAmount,
      "Payment Status": formatStatus(item.paymentStatus),
      "Payment Date": item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A',
      "Payment Method": item.paymentMethod || 'N/A',
      "Payment Amount": item.paymentAmount || 0,
      "Created Date": new Date(item.createdAt).toLocaleDateString(),
      "Completion Rate": `${((item.paidAmount / item.totalAmount) * 100).toFixed(2)}%`
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Farmer Payments");
    writeFile(wb, `farmer-payments-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Farmer ID", "Farmer Name", "Total Amount", "Paid Amount", "Remaining", "Status", "Payment Date", "Payment Method"];
    
    const csvContent = [
      headers.join(","),
      ...allPaymentsData.map((item) => [
        `"${item.orderId}"`,
        `"${item.farmerId}"`,
        `"${item.farmerName}"`,
        item.totalAmount,
        item.paidAmount,
        item.remainingAmount,
        `"${formatStatus(item.paymentStatus)}"`,
        `"${item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'}"`,
        `"${item.paymentMethod || 'N/A'}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `farmer-payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Farmer Payments Report", 14, 16);
    
    const tableColumn = ["Order ID", "Farmer", "Total Amount", "Paid", "Remaining", "Status", "Payment Date"];
    const tableRows: any = allPaymentsData.map((item) => [
      item.orderId,
      `${item.farmerName} (${item.farmerId})`,
      `₹${item.totalAmount}`,
      `₹${item.paidAmount}`,
      `₹${item.remainingAmount}`,
      formatStatus(item.paymentStatus),
      item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`farmer-payments-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file exported!");
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farmer Payments Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-partial { background-color: #dbeafe; color: #1e40af; }
          .status-completed { background-color: #d1fae5; color: #065f46; }
          .total-row { background-color: #f3f4f6; font-weight: bold; }
          @media print { 
            @page { size: landscape; } 
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Farmer Payments Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Farmer</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            ${allPaymentsData.map((item) => {
              const statusClass = `status-${item.paymentStatus}`;
              return `
                <tr>
                  <td>${item.orderId}</td>
                  <td>${item.farmerName} (${item.farmerId})</td>
                  <td>₹${item.totalAmount}</td>
                  <td>₹${item.paidAmount}</td>
                  <td>₹${item.remainingAmount}</td>
                  <td class="${statusClass}">${formatStatus(item.paymentStatus)}</td>
                  <td>${item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'}</td>
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
    toast.success("Printing farmer payments report...");
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partial':
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

  // Calculate completion percentage
  const calculateCompletionPercentage = (item: FarmerPayment) => {
    if (item.totalAmount === 0) return 0;
    return Math.round((item.paidAmount / item.totalAmount) * 100);
  };

  // Open details dialog
  const openDetailsDialog = (item: FarmerPayment) => {
    setCurrentItem(item);
    setDetailsDialogOpen(true);
  };

  // Reset filters and sorting
  const resetFilters = () => {
    setSearchInput('');
    setPaymentStatusFilter('');
    setPaymentMethodFilter('');
    setDateRangeFilter({ start: '', end: '' });
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply search and filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchPaymentsData();
  };

  // Calculate stats
  const calculateStats = () => {
    const totalAmount = allPaymentsData.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalPaid = allPaymentsData.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalRemaining = allPaymentsData.reduce((sum, item) => sum + item.remainingAmount, 0);
    const pendingPayments = allPaymentsData.filter(item => item.paymentStatus === 'pending').length;
    const completedPayments = allPaymentsData.filter(item => item.paymentStatus === 'completed').length;
    const overallCompletion = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
    
    return { totalAmount, totalPaid, totalRemaining, pendingPayments, completedPayments, overallCompletion };
  };

  const { totalAmount, totalPaid, totalRemaining, pendingPayments, completedPayments, overallCompletion } = calculateStats();
  const { startItem, endItem } = getPaginationRange();

  if (loading && allPaymentsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farmer payments data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
      {/* Header */}
      <div className="lg:mb-0 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaMoneyBillWave className="text-blue-600" />
          Farmer Payments Report
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage farmer payment transactions</p>
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

         {
  user?.role == "admin" &&<>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <FaRupeeSign className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallCompletion}%</p>
            </div>
            <FaPercentage className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>
</>}
      {/* Additional Stats */}


              {
  user?.role == "admin" &&<>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
            </div>
            <FaClock className="text-yellow-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Payments</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
            </div>
            <FaCheckCircle className="text-green-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            </div>
            <FaHistory className="text-blue-600 text-2xl" />
          </div>
        </div>
      </div>
      </>}

      {/* Filters */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {/* Search */}
          <div className="col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full px-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search order, farmer ID, name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
             { searchInput.length >0 &&<AiOutlineClose onClick={()=>setSearchInput("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTags className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCreditCard className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

         

          {/* Sorting Selector */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="paidDate">Sort by Payment Date</option>
              <option value="totalAmount">Sort by Total Amount</option>
              <option value="remainingAmount">Sort by Remaining Amount</option>
              <option value="orderId">Sort by Order ID</option>
              <option value="farmerName">Sort by Farmer Name</option>
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
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderId')}
                >
                  Order ID {getSortIcon('orderId')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('farmerName')}
                >
                  Farmer Details {getSortIcon('farmerName')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalAmount')}
                >
                  Total Amount {getSortIcon('totalAmount')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paidAmount')}
                >
                  Paid Amount {getSortIcon('paidAmount')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('remainingAmount')}
                >
                  Remaining {getSortIcon('remainingAmount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paymentStatus')}
                >
                  Status {getSortIcon('paymentStatus')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paidDate')}
                >
                  Payment Date {getSortIcon('paidDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.map((item, index) => {
                const completion = calculateCompletionPercentage(item);
                return (
                  <tr key={`${item.orderId}-${item.farmerId}-${index}`} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{item.orderId}</div>
                      <div className="text-xs text-gray-500">{formatDate(item.createdAt)}</div>
                    </td>

                    {/* Farmer Details */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-green-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.farmerName}</div>
                          <div className="text-xs text-gray-500">{item.farmerId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        <FaRupeeSign className="inline mr-1" />
                        {item.totalAmount.toLocaleString()}
                      </div>
                    </td>

                    {/* Paid Amount */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-700">
                        <FaRupeeSign className="inline mr-1" />
                        {item.paidAmount.toLocaleString()}
                      </div>
                    </td>

                    {/* Remaining Amount */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-yellow-700">
                        <FaRupeeSign className="inline mr-1" />
                        {item.remainingAmount.toLocaleString()}
                      </div>
                    </td>

                    {/* Completion Percentage */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{completion}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.paymentStatus)}`}>
                        {formatStatus(item.paymentStatus)}
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.paidDate ? formatDate(item.paidDate) : 'N/A'}
                          </div>
                          {item.paymentMethod && (
                            <div className="text-xs text-gray-500">{item.paymentMethod}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions - Only View */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openDetailsDialog(item)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
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
        {displayedData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
              <FaMoneyBillWave />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No farmer payment data found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Cards (visible only on mobile) */}
      <div className="lg:hidden space-y-4">
        {displayedData.map((item, index) => {
          const completion = calculateCompletionPercentage(item);
          return (
            <div key={`${item.orderId}-${item.farmerId}-${index}`} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-blue-600">{item.orderId}</div>
                  <div className="text-sm text-gray-500">{item.farmerName}</div>
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

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="font-bold text-gray-900 text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {item.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Paid Amount</div>
                  <div className="font-bold text-green-700 text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {item.paidAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Remaining</div>
                  <div className="font-bold text-yellow-700 text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {item.remainingAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.paymentStatus)}`}>
                    {formatStatus(item.paymentStatus)}
                  </span>
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Payment Progress</span>
                  <span>{completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedItem === `${item.orderId}-${item.farmerId}` && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Farmer ID</div>
                      <div className="text-sm font-medium">{item.farmerId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Payment Method</div>
                      <div className="text-sm">{item.paymentMethod || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Payment Amount</div>
                      <div className="text-sm font-medium">
                        {item.paymentAmount ? `₹${item.paymentAmount.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Payment Date</div>
                      <div className="text-sm">{item.paidDate ? formatDate(item.paidDate) : 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-sm">{formatDateTime(item.createdAt)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination and Limit Controls */}
      {displayedData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
          {/* Items per page selector */}
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

          {/* Pagination component */}
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

      {/* Details Dialog - FIXED VERSION */}
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
                Payment Details: {currentItem?.orderId}
              </h2>
              <p className="text-gray-600">Complete payment transaction information</p>
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
            <>
              {(() => {
                const completion = calculateCompletionPercentage(currentItem);
                return (
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
                            <span className="text-gray-600">Farmer ID:</span>
                            <span className="font-medium">{currentItem.farmerId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FaUser className="text-green-600" />
                          Farmer Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer Name:</span>
                            <span className="font-medium">{currentItem.farmerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer ID:</span>
                            <span className="font-medium">{currentItem.farmerId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer State:</span>
                            <span className="font-medium">{currentItem.farmerState}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer District:</span>
                            <span className="font-medium">{currentItem.farmerDistrict}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer Taluka:</span>
                            <span className="font-medium">{currentItem.farmerTaluka}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farmer Mobile:</span>
                            <span className="font-medium">{currentItem.farmerMobile}</span>
                          </div>
                           <div className="flex justify-between">
                            <span className="text-gray-600">Farmer Pincode:</span>
                            <span className="font-medium">{currentItem.farmerPincode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Amounts */}
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaMoneyBillWave className="text-purple-600" />
                        Payment Amounts
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded border">
                          <div className="text-gray-600 text-sm mb-1">Total Amount</div>
                          <div className="font-bold text-2xl text-gray-900">
                            <FaRupeeSign className="inline mr-1" />
                            {currentItem.totalAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white rounded border border-green-200">
                          <div className="text-gray-600 text-sm mb-1">Paid Amount</div>
                          <div className="font-bold text-2xl text-green-700">
                            <FaRupeeSign className="inline mr-1" />
                            {currentItem.paidAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white rounded border border-yellow-200">
                          <div className="text-gray-600 text-sm mb-1">Remaining Amount</div>
                          <div className="font-bold text-2xl text-yellow-700">
                            <FaRupeeSign className="inline mr-1" />
                            {currentItem.remainingAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Completion Progress Bar */}
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Payment Progress</span>
                          <span className="font-semibold">{completion}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full" 
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FaTags className="text-orange-600" />
                          Status Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentItem.paymentStatus)}`}>
                              {formatStatus(currentItem.paymentStatus)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completion Rate:</span>
                            <span className="font-bold text-lg">{completion}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FaCreditCard className="text-red-600" />
                          Payment Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{currentItem.paymentMethod || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Date:</span>
                            <span className="font-medium">
                              {currentItem.paidDate ? formatDateTime(currentItem.paidDate) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Payment Amount:</span>
                            <span className="font-medium">
                              {currentItem.paymentAmount 
                                ? `₹${currentItem.paymentAmount.toLocaleString()}`
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
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

export default FarmerPaymentsReport;



















