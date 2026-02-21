














// 'use client';

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaDownload,
//   FaSearch,
//   FaFilter,
//   FaShoppingCart,
//   FaUser,
//   FaStore,
//   FaTruck,
//   FaReceipt,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaSave,
//   FaFileAlt,
//   FaPhone,
//   FaEnvelope,
//   FaCalendarAlt,
//   FaBox,
//   FaTags,
//   FaMapMarkerAlt,
//   FaCheck,
//   FaBoxes,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaCreditCard,
//   FaInfoCircle,
//   FaFileInvoiceDollar
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import OrderEditModal from '../OrderEditModal/page';

// // Interfaces
// interface MarketDetails {
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface ProductItem {
//   productId: string;
//   productName: string;
//   grade: string;
//   quantity: number;
//   deliveryDate: string;
//   nearestMarket: string;
//   marketDetails: MarketDetails | null;
//   pricePerUnit: number;
//   totalAmount: number;
// }

// interface PaymentRecord {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   paymentHistory: PaymentRecord[];
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile?: string;
//   transporterEmail?: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity?: string;
//   driverName?: string;
//   driverMobile?: string;
//   acceptedAt: string;
//   transporterReached?: boolean;
//   goodsConditionCorrect?: boolean;
//   quantityCorrect?: boolean;
//   adminNotes?: string;
//   verifiedBy?: string;
//   verifiedByName?: string;
//   verifiedAt?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   traderMobile?: string;
//   traderEmail?: string;
//   farmerName?: string;
//   farmerMobile: string;
//   farmerEmail?: string;
//   productItems: ProductItem[];
//   orderStatus: string;
//   transporterStatus?: string;
//   transporterDetails?: TransporterDetails;
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
//   createdAt: string;
// }

// const AdminOrdersRedesign: React.FC = () => {
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
//   const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
//   // Mobile view state
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

//   // Verification state
//   const [verificationData, setVerificationData] = useState({
//     transporterReached: false,
//     goodsConditionCorrect: false,
//     quantityCorrect: false,
//     adminNotes: '',
//   });

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';
//   const tableRef = useRef<HTMLDivElement>(null);

//   // Fetch all orders function
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
//     let url = `${API_BASE}/orders`;
    
//     // Add filters to URL if present
//     const params = new URLSearchParams();
//     if (statusFilter) params.append('status', statusFilter);
//     if (transporterStatusFilter) params.append('transporterStatus', transporterStatusFilter);
//     if (searchInput) params.append('search', searchInput);
    
//     const queryString = params.toString();
//     if (queryString) {
//       url += `?${queryString}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setAllOrders(data.data || []);
//         setTotalItems(data.data?.length || 0);
//         // toast.success(`Loaded ${data.data?.length || 0} orders`);
//       } else {
//         toast.error('Failed to fetch orders');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, transporterStatusFilter, searchInput]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // Apply pagination to displayed orders
//   useEffect(() => {
//     if (allOrders.length === 0) {
//       setDisplayedOrders([]);
//       setTotalPages(1);
//       setCurrentPage(1);
//       return;
//     }

//     // Calculate total pages
//     const totalPagesCount = Math.ceil(allOrders.length / itemsPerPage);
//     setTotalPages(totalPagesCount);
    
//     // Ensure current page is valid
//     if (currentPage > totalPagesCount) {
//       setCurrentPage(1);
//     }
    
//     // Calculate start and end indices
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
    
//     // Get orders for current page
//     const ordersForPage = allOrders.slice(startIndex, endIndex);
//     setDisplayedOrders(ordersForPage);
    
//   }, [allOrders, currentPage, itemsPerPage]);

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     // Scroll to top of table on page change
//     if (tableRef.current) {
//       tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
//     const newLimit = Number(event.target.value);
//     setItemsPerPage(newLimit);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   // Calculate pagination range
//   const getPaginationRange = () => {
//     const startItem = (currentPage - 1) * itemsPerPage + 1;
//     const endItem = Math.min(currentPage * itemsPerPage, allOrders.length);
//     return { startItem, endItem };
//   };

//   // Invoice generation functions
//   const generateFarmerInvoice = (order: Order) => {
//     if (!order || !order.adminToFarmerPayment) {
//       toast.error('No farmer payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Farmer Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #198754; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #198754; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">FARMER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-FARMER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Payment Status:</strong> ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.adminToFarmerPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #198754;">
//                 TOTAL PAYABLE TO FARMER: ${formatCurrency(order.adminToFarmerPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Farmer invoice generated for order: ${order.orderId}`);
//   };

//   const generateTraderInvoice = (order: Order) => {
//     if (!order || !order.traderToAdminPayment) {
//       toast.error('No trader payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Trader Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #0d6efd; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #0d6efd; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">TRADER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-TRADER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Payment Status:</strong> ${order.traderToAdminPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.traderToAdminPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.traderToAdminPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.traderToAdminPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #0d6efd;">
//                 TOTAL PAYABLE BY TRADER: ${formatCurrency(order.traderToAdminPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Trader invoice generated for order: ${order.orderId}`);
//   };

//   // Export functions - use allOrders for exports
//   const handleCopyToClipboard = async () => {
//     const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//     const csvContent = [
//       headers.join("\t"),
//       ...allOrders.map((order) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         const verificationStatus = getVerificationStatus(order);
//         return [
//           order.orderId,
//           new Date(order.createdAt).toLocaleDateString(),
//           order.traderName,
//           order.farmerName || "N/A",
//           order.productItems.length,
//           totalAmount,
//           order.orderStatus,
//           verificationStatus,
//           order.traderToAdminPayment?.paymentStatus || "N/A",
//           order.adminToFarmerPayment?.paymentStatus || "N/A"
//         ].join("\t");
//       })
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(csvContent);
//       toast.success("Orders copied to clipboard!");
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = () => {
//     const data = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return {
//         "Order ID": order.orderId,
//         "Date": new Date(order.createdAt).toLocaleDateString(),
//         "Trader Name": order.traderName,
//         "Trader Mobile": order.traderMobile || "N/A",
//         "Farmer Name": order.farmerName || "N/A",
//         "Farmer Mobile": order.farmerMobile || "N/A",
//         "Items Count": order.productItems.length,
//         "Total Quantity": order.productItems.reduce((sum, item) => sum + item.quantity, 0),
//         "Total Amount": totalAmount,
//         "Order Status": order.orderStatus,
//         "Verification Status": verificationStatus,
//         "Transporter Status": order.transporterStatus || "N/A",
//         "Trader Payment Status": order.traderToAdminPayment?.paymentStatus || "N/A",
//         "Trader Paid Amount": order.traderToAdminPayment?.paidAmount || 0,
//         "Farmer Payment Status": order.adminToFarmerPayment?.paymentStatus || "N/A",
//         "Farmer Paid Amount": order.adminToFarmerPayment?.paidAmount || 0,
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Orders");
//     writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allOrders.map((order) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         const verificationStatus = getVerificationStatus(order);
//         return [
//           `"${order.orderId}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`,
//           `"${order.traderName}"`,
//           `"${order.farmerName || "N/A"}"`,
//           order.productItems.length,
//           totalAmount,
//           `"${order.orderStatus}"`,
//           `"${verificationStatus}"`,
//           `"${order.traderToAdminPayment?.paymentStatus || "N/A"}"`,
//           `"${order.adminToFarmerPayment?.paymentStatus || "N/A"}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Orders Management Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Trader", "Farmer", "Items", "Total Amount", "Status", "Verification"];
//     const tableRows: any = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return [
//         order.orderId,
//         order.traderName,
//         order.farmerName || "N/A",
//         order.productItems.length,
//         `₹${totalAmount}`,
//         order.orderStatus,
//         verificationStatus
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [76, 175, 80] },
//     });
    
//     doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
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
//           h1 { color: #1f2937; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #f3f4f6; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           @media print { @page { size: landscape; } }
//         </style>
//       </head>
//       <body>
//         <h1>Orders Management Report</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Trader</th>
//               <th>Farmer</th>
//               <th>Items</th>
//               <th>Total Amount</th>
//               <th>Status</th>
//               <th>Verification</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allOrders.map((order) => {
//               const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//               const verificationStatus = getVerificationStatus(order);
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td>${order.traderName}</td>
//                   <td>${order.farmerName || "N/A"}</td>
//                   <td>${order.productItems.length}</td>
//                   <td>₹${totalAmount}</td>
//                   <td>${order.orderStatus}</td>
//                   <td>${verificationStatus}</td>
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
//     toast.success("Printing orders...");
//   };

//   // Status badge colors
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//       case 'partial':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'processing':
//       case 'accepted':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'completed':
//       case 'paid':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled':
//       case 'rejected':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'in_transit':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Verification status badge colors
//   const getVerificationColor = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'bg-green-100 text-green-800 border-green-200';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     } else if (details.verifiedAt) {
//       return 'bg-red-100 text-red-800 border-red-200';
//     } else {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Get verification status text
//   const getVerificationStatus = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'Not Available';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'Verified';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'Partial';
//     } else if (details.verifiedAt) {
//       return 'Pending';
//     } else {
//       return 'Not Verified';
//     }
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
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setDetailsDialogOpen(true);
//   };

//   // Open edit dialog - UPDATED TO USE OrderEditModal
//   const openEditDialog = (order: Order) => {
//     if (window.openEditOrderModal) {
//       window.openEditOrderModal(order.orderId);
//     }
//   };

//   // Open verification dialog
//   const openVerificationDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setVerificationDialogOpen(true);
//   };

//   // Delete order
//   const handleDeleteOrder = async () => {
//     if (!currentOrder) return;
//     console.log(currentOrder._id)
//     try {
//       const response = await fetch(`/api/order/${currentOrder._id}`, {
//         method: 'DELETE',
//       });
      
//       const result = await response.json();
      
//       if (result.success) {
//         toast.success('Order deleted successfully!');
//         setDeleteDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error('Failed to delete order');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error deleting order');
//     }
//   };

//   // Save verification
//   const saveVerification = async () => {
//     if (!currentOrder || !currentOrder.transporterDetails) {
//       toast.error('No transporter details available');
//       return;
//     }

//     const adminId = localStorage.getItem('adminId') || 'admin-001';
//     const adminName = localStorage.getItem('userName') || 'Admin';

//     const data = {
//       ...verificationData,
//       adminId,
//       adminName,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success('Verification updated successfully!');
//         setVerificationDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error('Failed to update verification');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error updating verification');
//     }
//   };

//   // Calculate order total
//   const calculateOrderTotal = (order: Order) => {
//     return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   };

//   // Toggle mobile card expansion
//   const toggleMobileCard = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (loading && allOrders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   const { startItem, endItem } = getPaginationRange();

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 ">
//       {/* Header */}
//       <div className="lg:mb-0 mb-3">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FaShoppingCart className="text-blue-600" />
//           Order Management
//         </h1>
//         <p className="text-gray-600 mt-2">Manage and monitor all marketplace orders</p>
//       </div>

//       {/* Export Buttons - Desktop */}
//       <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2  p-3 rounded  mb-1">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//           >
//             <btn.icon className="text-sm" />
  
//           </button>
//         ))}
//       </div>

//       {/* Export Buttons - Mobile */}
//       <div className="lg:hidden flex flex-wrap gap-2 mb-3">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center justify-center gap-1 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
           
//           >
//             <btn.icon className="text-sm" />
           
//           </button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
//         <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
//             </div>
//             <FaShoppingCart className="text-blue-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Completed</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {allOrders.filter(o => o.orderStatus === 'completed').length}
//               </p>
//             </div>
//             <FaCheckCircle className="text-green-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Pending</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {allOrders.filter(o => o.orderStatus === 'pending').length}
//               </p>
//             </div>
//             <FaTimesCircle className="text-yellow-500 text-2xl" />
//           </div>
//         </div>
//         <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {formatCurrency(allOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0))}
//               </p>
//             </div>
//             <FaRupeeSign className="text-purple-500 text-2xl" />
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded shadow mb-6 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               placeholder="Search orders..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaFilter className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Order Status</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="in_transit">In Transit</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Transporter Status Filter */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaTruck className="text-gray-400" />
//             </div>
//             <select
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//               value={transporterStatusFilter}
//               onChange={(e) => setTransporterStatusFilter(e.target.value)}
//             >
//               <option value="">All Transporter Status</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={fetchOrders}
//               className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//             >
//               <FaSearch />
//               Search
//             </button>
//             <button
//               onClick={() => {
//                 setStatusFilter('');
//                 setTransporterStatusFilter('');
//                 setSearchInput('');
//                 setCurrentPage(1);
//               }}
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
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                   {/* Order ID */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
//                       <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
//                     </div>
//                   </td>

//                   {/* Trader */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaStore className="text-gray-400 mr-2" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{order.traderName}</div>
//                         {order.traderMobile && (
//                           <div className="text-xs text-gray-500">{order.traderMobile}</div>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Farmer */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaUser className="text-gray-400 mr-2" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{order.farmerName || 'N/A'}</div>
//                         {order.farmerMobile && (
//                           <div className="text-xs text-gray-500">{order.farmerMobile}</div>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Products */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <FaBox className="text-gray-400 mr-2" />
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{order.productItems.length} items</div>
//                         <div className="text-xs text-gray-500">
//                           {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Total */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="text-sm font-bold text-green-700">
//                       <FaRupeeSign className="inline mr-1" />
//                       {calculateOrderTotal(order).toLocaleString()}
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
//                       {order.orderStatus}
//                     </span>
//                   </td>

//                   {/* Verification Status - NEW FIELD */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                       {getVerificationStatus(order)}
//                     </span>
//                   </td>

//                   {/* Actions - UPDATED WITH INVOICE DOWNLOAD ICON */}
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => openDetailsDialog(order)}
//                         className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
//                         title="View Details"
//                       >
//                         <FaEye />
//                       </button>
//                       <button
//                         onClick={() => openEditDialog(order)}
//                         className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors"
//                         title="Edit Order"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setCurrentOrder(order);
//                           setDeleteDialogOpen(true);
//                         }}
//                         className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
//                         title="Delete Order"
//                       >
//                         <FaTrash />
//                       </button>
//                       {order.transporterDetails && (
//                         <button
//                           onClick={() => openVerificationDialog(order)}
//                           className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
//                           title="Verification"
//                         >
//                           <FaCheck />
//                         </button>
//                       )}
//                       {/* INVOICE DOWNLOAD BUTTON */}
//                       {order.traderToAdminPayment && (
//                         <button
//                           onClick={() => generateTraderInvoice(order)}
//                           className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50 transition-colors"
//                           title="Download Trader Invoice"
//                         >
//                           <FaFileInvoiceDollar />
//                         </button>
//                       )}
//                       {order.adminToFarmerPayment && (
//                         <button
//                           onClick={() => generateFarmerInvoice(order)}
//                           className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
//                           title="Download Farmer Invoice"
//                         >
//                           <FaReceipt />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* No Orders State */}
//         {allOrders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">
//               <FaShoppingCart />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Cards (visible only on mobile) */}
//       <div className="lg:hidden space-y-4">
//         {displayedOrders.map((order) => (
//           <div key={order._id} className="bg-white rounded shadow p-4">
//             <div className="flex justify-between items-start mb-3">
//               <div>
//                 <div className="font-bold text-blue-600">{order.orderId}</div>
//                 <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => openDetailsDialog(order)}
//                   className="text-blue-600 p-1"
//                 >
//                   <FaEye />
//                 </button>
//                 <button
//                   onClick={() => toggleMobileCard(order._id)}
//                   className="text-gray-500 p-1"
//                 >
//                   {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <div className="text-xs text-gray-500">Trader</div>
//                 <div className="font-medium text-sm">{order.traderName}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Farmer</div>
//                 <div className="font-medium text-sm">{order.farmerName || 'N/A'}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Items</div>
//                 <div className="font-medium text-sm">{order.productItems.length}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Total</div>
//                 <div className="font-bold text-green-700 text-sm">
//                   <FaRupeeSign className="inline mr-1" />
//                   {calculateOrderTotal(order).toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <div className="text-xs text-gray-500">Status</div>
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
//                   {order.orderStatus}
//                 </span>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Verification</div>
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                   {getVerificationStatus(order)}
//                 </span>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mb-3">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => openEditDialog(order)}
//                   className="text-green-600 p-1"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => {
//                     setCurrentOrder(order);
//                     setDeleteDialogOpen(true);
//                   }}
//                   className="text-red-600 p-1"
//                 >
//                   <FaTrash />
//                 </button>
//                 {/* INVOICE DOWNLOAD BUTTON FOR MOBILE */}
//                 {order.traderToAdminPayment && (
//                   <button
//                     onClick={() => generateTraderInvoice(order)}
//                     className="text-yellow-600 p-1"
//                     title="Trader Invoice"
//                   >
//                     <FaFileInvoiceDollar />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Expanded Content */}
//             {expandedOrder === order._id && (
//               <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Trader Mobile</div>
//                     <div className="text-sm">{order.traderMobile || 'N/A'}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Farmer Mobile</div>
//                     <div className="text-sm">{order.farmerMobile || 'N/A'}</div>
//                   </div>
//                 </div>
                
//                 {order.traderToAdminPayment && (
//                   <div>
//                     <div className="text-xs text-gray-500">Trader Payment</div>
//                     <div className="text-sm font-medium">
//                       {order.traderToAdminPayment.paymentStatus} - 
//                       <span className="text-green-700 ml-1">
//                         ₹{order.traderToAdminPayment.paidAmount} paid
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {order.adminToFarmerPayment && (
//                   <div>
//                     <div className="text-xs text-gray-500">Farmer Payment</div>
//                     <div className="text-sm font-medium">
//                       {order.adminToFarmerPayment.paymentStatus} - 
//                       <span className="text-green-700 ml-1">
//                         ₹{order.adminToFarmerPayment.paidAmount} paid
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-2 pt-2">
//                   {order.transporterDetails && (
//                     <button
//                       onClick={() => openVerificationDialog(order)}
//                       className="flex-1 bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-medium"
//                     >
//                       Verification
//                     </button>
//                   )}
//                   {order.traderToAdminPayment && (
//                     <button
//                       onClick={() => generateTraderInvoice(order)}
//                       className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm font-medium"
//                     >
//                       Trader Invoice
//                     </button>
//                   )}
//                   {order.adminToFarmerPayment && (
//                     <button
//                       onClick={() => generateFarmerInvoice(order)}
//                       className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium"
//                     >
//                       Farmer Invoice
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pagination and Limit Controls */}
//       {allOrders.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4  p-4 bg-white rounded shadow">
//           {/* Items per page selector */}
//           <div className="flex items-center gap-3">
            
            
//             <div className="text-sm text-gray-600">
//               Showing {startItem} to {endItem} of {allOrders.length} orders
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

//       {/* Order Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaEye className="text-blue-600" />
//                 Order Details: {currentOrder?.orderId}
//               </h2>
//               <p className="text-gray-600">Complete order information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && (
//             <div className="space-y-6 max-h-[70vh] overflow-y-auto">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUser className="text-blue-600" />
//                     Farmer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.farmerName || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{currentOrder.farmerMobile || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{currentOrder.farmerEmail || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaStore className="text-green-600" />
//                     Trader Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.traderName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{currentOrder.traderMobile || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{currentOrder.traderEmail || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Status and Dates */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Order Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentOrder.orderStatus)}`}>
//                     {currentOrder.orderStatus}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Transporter Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentOrder.transporterStatus || 'pending')}`}>
//                     {currentOrder.transporterStatus || 'pending'}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Created</h4>
//                   <p className="text-gray-700">{formatDateTime(currentOrder.createdAt)}</p>
//                 </div>
//               </div>

//               {/* Verification Status */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-purple-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                     <FaCheck />
//                     Verification Status
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.transporterReached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.transporterReached ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Transporter Reached</div>
//                         <div className="text-sm text-gray-500">Destination arrival</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.goodsConditionCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.goodsConditionCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Goods Condition</div>
//                         <div className="text-sm text-gray-500">Quality check</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.quantityCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.quantityCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Quantity Correct</div>
//                         <div className="text-sm text-gray-500">Amount verification</div>
//                       </div>
//                     </div>
//                   </div>
//                   {currentOrder.transporterDetails.verifiedAt && (
//                     <div className="mt-4 pt-4 border-t border-gray-200">
//                       <div className="text-sm text-gray-600">
//                         Verified by <span className="font-bold">{currentOrder.transporterDetails.verifiedByName || 'Admin'}</span> on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Payment Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {currentOrder.traderToAdminPayment && (
//                   <div className="border border-blue-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-blue-700">Trader to Admin Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.traderToAdminPayment.paymentStatus)}`}>
//                           {currentOrder.traderToAdminPayment.paymentStatus}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentOrder.adminToFarmerPayment && (
//                   <div className="border border-green-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-green-700">Admin to Farmer Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.adminToFarmerPayment.paymentStatus)}`}>
//                           {currentOrder.adminToFarmerPayment.paymentStatus}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Products Table */}
//               <div className="border rounded overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <FaBoxes className="text-purple-600" />
//                     Product Items ({currentOrder.productItems.length})
//                   </h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentOrder.productItems.map((item, index) => (
//                         <tr key={index}>
//                           <td className="px-4 py-3">{item.productName}</td>
//                           <td className="px-4 py-3">
//                             <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                               {item.grade}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">{item.quantity}</td>
//                           <td className="px-4 py-3">{formatCurrency(item.pricePerUnit)}</td>
//                           <td className="px-4 py-3 font-bold">{formatCurrency(item.totalAmount)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-50">
//                       <tr>
//                         <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
//                         <td className="px-4 py-3 font-bold text-green-700">
//                           {formatCurrency(calculateOrderTotal(currentOrder))}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-gray-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTruck className="text-orange-600" />
//                     Transporter Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Name:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.transporterName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Vehicle:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleType}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Number:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Driver:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.driverName || 'N/A'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Accepted:</span>
//                           <span className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Capacity:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
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
//             {currentOrder?.traderToAdminPayment && (
//               <button
//                 onClick={() => generateTraderInvoice(currentOrder)}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
//               >
//                 <FaFileInvoiceDollar />
//                 Trader Invoice
//               </button>
//             )}
//             {currentOrder?.adminToFarmerPayment && (
//               <button
//                 onClick={() => generateFarmerInvoice(currentOrder)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
//               >
//                 <FaReceipt />
//                 Farmer Invoice
//               </button>
//             )}
//           </div>
//         </div>
//       </Dialog>

//       {/* Edit Order Dialog - REMOVED and replaced with OrderEditModal */}

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//               <FaTrash className="h-6 w-6 text-red-600" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Delete Order {currentOrder?.orderId}?
//             </h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setDeleteDialogOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteOrder}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Verification Dialog */}
//       <Dialog
//         open={verificationDialogOpen}
//         onClose={() => setVerificationDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <FaCheck className="text-purple-600" />
//               Verification: {currentOrder?.orderId}
//             </h2>
//             <button
//               onClick={() => setVerificationDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && currentOrder.transporterDetails && (
//             <div className="space-y-6">
//               {/* Verification Checks */}
//               <div className="space-y-4">
//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="transporterReached"
//                     checked={verificationData.transporterReached}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         transporterReached: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="transporterReached" className="ml-3">
//                     <div className="font-medium">Transporter Reached Destination</div>
//                     <div className="text-sm text-gray-500">Confirm arrival at delivery location</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="goodsConditionCorrect"
//                     checked={verificationData.goodsConditionCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         goodsConditionCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="goodsConditionCorrect" className="ml-3">
//                     <div className="font-medium">Goods Condition is Correct</div>
//                     <div className="text-sm text-gray-500">Verify goods are in good condition</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="quantityCorrect"
//                     checked={verificationData.quantityCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         quantityCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="quantityCorrect" className="ml-3">
//                     <div className="font-medium">Quantity is Correct</div>
//                     <div className="text-sm text-gray-500">Confirm delivered quantity matches order</div>
//                   </label>
//                 </div>
//               </div>

//               {/* Admin Notes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Admin Notes
//                 </label>
//                 <textarea
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
//                   value={verificationData.adminNotes}
//                   onChange={(e) =>
//                     setVerificationData({
//                       ...verificationData,
//                       adminNotes: e.target.value,
//                     })
//                   }
//                   placeholder="Add any notes or observations..."
//                 />
//               </div>

//               {/* Previous Verification Info */}
//               {currentOrder.transporterDetails.verifiedAt && (
//                 <div className="p-4 bg-blue-50 rounded">
//                   <div className="text-sm text-blue-700">
//                     Last verified by{' '}
//                     <span className="font-bold">
//                       {currentOrder.transporterDetails.verifiedByName || 'Admin'}
//                     </span>{' '}
//                     on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   onClick={() => setVerificationDialogOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveVerification}
//                   className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
//                 >
//                   <FaSave />
//                   Save Verification
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Dialog>

//       {/* Order Edit Modal */}
//       <OrderEditModal />
//     </div>
//   );
// };

// export default AdminOrdersRedesign;





















// 'use client';

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaFilter,
//   FaShoppingCart,
//   FaUser,
//   FaStore,
//   FaTruck,
//   FaReceipt,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaSave,
//   FaBox,
//   FaCheck,
//   FaBoxes,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaFileInvoiceDollar,
//   FaSpinner,
//   FaExclamationCircle,
//   FaClipboardCheck,
//   FaMoneyBillWave,
//   FaCalendarAlt,
//   FaFileInvoice,
//   FaUserTie,
//   FaWeightHanging
// } from 'react-icons/fa';
// import { AiOutlineFileSearch } from 'react-icons/ai';
// import toast from 'react-hot-toast';
// import AdminFarmerPaymentModal from '../FarmerPaymentModal/page';
// import OrderEditModal from '../OrderEditModal/page';


// // Define the interface for farmer payment modal data
// export interface FarmerPaymentModalData {
//   orderId: string;
//   farmerName: string;
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   onPaymentSuccess?: () => void;
// }

// // Declare global window properties
// declare global {
//   interface Window {
//     openEditOrderModal?: (orderId: string) => void;
//     openFarmerPaymentModal?: (data: FarmerPaymentModalData) => void;
//   }
// }

// // Interfaces
// interface MarketDetails {
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface ProductItem {
//   productId: string;
//   productName: string;
//   grade: string;
//   quantity: number;
//   deliveryDate: string;
//   nearestMarket: string;
//   marketDetails: MarketDetails | null;
//   pricePerUnit: number;
//   totalAmount: number;
// }

// interface PaymentRecord {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
//   paymentMethod?: string;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   paymentHistory: PaymentRecord[];
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile?: string;
//   transporterEmail?: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity?: string;
//   driverName?: string;
//   driverMobile?: string;
//   acceptedAt: string;
//   transporterReached?: boolean;
//   goodsConditionCorrect?: boolean;
//   quantityCorrect?: boolean;
//   adminNotes?: string;
//   verifiedBy?: string;
//   verifiedByName?: string;
//   verifiedAt?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   traderMobile?: string;
//   traderEmail?: string;
//   farmerName?: string;
//   farmerMobile: string;
//   farmerEmail?: string;
//   productItems: ProductItem[];
//   orderStatus: string;
//   transporterStatus?: string;
//   transporterDetails?: TransporterDetails;
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
//   createdAt: string;
// }

// const AdminOrdersRedesign: React.FC = () => {
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
//   // Mobile view state
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

//   // Verification state
//   const [verificationData, setVerificationData] = useState({
//     transporterReached: false,
//     goodsConditionCorrect: false,
//     quantityCorrect: false,
//     adminNotes: '',
//   });

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';
//   const tableRef = useRef<HTMLDivElement>(null);

//   // Fetch all orders function
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
//     let url = `${API_BASE}/orders`;
    
//     // Add filters to URL if present
//     const params = new URLSearchParams();
//     if (statusFilter) params.append('status', statusFilter);
//     if (transporterStatusFilter) params.append('transporterStatus', transporterStatusFilter);
//     if (searchInput) params.append('search', searchInput);
    
//     const queryString = params.toString();
//     if (queryString) {
//       url += `?${queryString}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setAllOrders(data.data || []);
//         setTotalItems(data.data?.length || 0);
//         // toast.success(`Loaded ${data.data?.length || 0} orders`);
//       } else {
//         toast.error('Failed to fetch orders');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, transporterStatusFilter, searchInput]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // Apply pagination to displayed orders
//   useEffect(() => {
//     if (allOrders.length === 0) {
//       setDisplayedOrders([]);
//       setTotalPages(1);
//       setCurrentPage(1);
//       return;
//     }

//     // Calculate total pages
//     const totalPagesCount = Math.ceil(allOrders.length / itemsPerPage);
//     setTotalPages(totalPagesCount);
    
//     // Ensure current page is valid
//     if (currentPage > totalPagesCount) {
//       setCurrentPage(1);
//     }
    
//     // Calculate start and end indices
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
    
//     // Get orders for current page
//     const ordersForPage = allOrders.slice(startIndex, endIndex);
//     setDisplayedOrders(ordersForPage);
    
//   }, [allOrders, currentPage, itemsPerPage]);

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     // Scroll to top of table on page change
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
//     const endItem = Math.min(currentPage * itemsPerPage, allOrders.length);
//     return { startItem, endItem };
//   };

//   // Status badge configuration
//   const getStatusBadge = (status: string) => {
//     const statusConfig: { [key: string]: { color: string; bg: string; icon: any } } = {
//       pending: { color: 'text-yellow-800', bg: 'bg-yellow-100', icon: FaExclamationCircle },
//       processing: { color: 'text-blue-800', bg: 'bg-blue-100', icon: FaSpinner },
//       in_transit: { color: 'text-indigo-800', bg: 'bg-indigo-100', icon: FaTruck },
//       completed: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
//       cancelled: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
//       accepted: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
//       rejected: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
//       partial: { color: 'text-orange-800', bg: 'bg-orange-100', icon: FaExclamationCircle },
//       paid: { color: 'text-emerald-800', bg: 'bg-emerald-100', icon: FaCheckCircle },
//     };
    
//     return statusConfig[status] || { color: 'text-gray-800', bg: 'bg-gray-100', icon: FaExclamationCircle };
//   };

//   // Invoice generation functions
//   const generateFarmerInvoice = (order: Order) => {
//     if (!order || !order.adminToFarmerPayment) {
//       toast.error('No farmer payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Farmer Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #198754; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #198754; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">FARMER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-FARMER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Payment Status:</strong> ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.adminToFarmerPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #198754;">
//                 TOTAL PAYABLE TO FARMER: ${formatCurrency(order.adminToFarmerPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Farmer invoice generated for order: ${order.orderId}`);
//   };

//   const generateTraderInvoice = (order: Order) => {
//     if (!order || !order.traderToAdminPayment) {
//       toast.error('No trader payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Trader Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #0d6efd; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #0d6efd; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">TRADER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-TRADER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Payment Status:</strong> ${order.traderToAdminPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.traderToAdminPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.traderToAdminPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.traderToAdminPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #0d6efd;">
//                 TOTAL PAYABLE BY TRADER: ${formatCurrency(order.traderToAdminPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Trader invoice generated for order: ${order.orderId}`);
//   };

//   // Export functions
//   // const handleCopyToClipboard = async () => {
//   //   const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//   //   const csvContent = [
//   //     headers.join("\t"),
//   //     ...allOrders.map((order) => {
//   //       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   //       const verificationStatus = getVerificationStatus(order);
//   //       return [
//   //         order.orderId,
//   //         new Date(order.createdAt).toLocaleDateString(),
//   //         order.traderName,
//   //         order.farmerName || "N/A",
//   //         order.productItems.length,
//   //         totalAmount,
//   //         order.orderStatus,
//   //         verificationStatus,
//   //         order.traderToAdminPayment?.paymentStatus || "N/A",
//   //         order.adminToFarmerPayment?.paymentStatus || "N/A"
//   //       ].join("\t");
//   //     })
//   //   ].join("\n");
    
//   //   try {
//   //     await navigator.clipboard.writeText(csvContent);
//   //     toast.success("Orders copied to clipboard!");
//   //   } catch (err) {
//   //     console.error("Failed to copy: ", err);
//   //     toast.error("Failed to copy to clipboard");
//   //   }
//   // };

//   const handleCopyToClipboard = async () => {
//   const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
  
//   // Create separator line
//   const separator = "─".repeat(100);
  
//   // Format each cell with padding
//   const formatCell = (value:any) => {
//     const strValue = String(value || "");
//     return strValue.padEnd(15).substring(0, 15);
//   };
  
//   const tableContent = [
//     // Headers row
//     headers.map(header => formatCell(header)).join(" │ "),
//     separator,
    
//     // Data rows
//     ...allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
      
//       return [
//         formatCell(order.orderId),
//         formatCell(new Date(order.createdAt).toLocaleDateString()),
//         formatCell(order.traderName),
//         formatCell(order.farmerName || "N/A"),
//         formatCell(order.productItems.length),
//         formatCell(totalAmount),
//         formatCell(order.orderStatus),
//         formatCell(verificationStatus),
//         formatCell(order.traderToAdminPayment?.paymentStatus || "N/A"),
//         formatCell(order.adminToFarmerPayment?.paymentStatus || "N/A")
//       ].join(" │ ");
//     })
//   ].join("\n");
  
//   try {
//     await navigator.clipboard.writeText(tableContent);
//     toast.success("Orders copied to clipboard in table format!");
//   } catch (err) {
//     console.error("Failed to copy: ", err);
//     toast.error("Failed to copy to clipboard");
//   }
// };


//   const handleExportExcel = () => {
//     const data = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return {
//         "Order ID": order.orderId,
//         "Date": new Date(order.createdAt).toLocaleDateString(),
//         "Trader Name": order.traderName,
//         "Trader Mobile": order.traderMobile || "N/A",
//         "Farmer Name": order.farmerName || "N/A",
//         "Farmer Mobile": order.farmerMobile || "N/A",
//         "Items Count": order.productItems.length,
//         "Total Quantity": order.productItems.reduce((sum, item) => sum + item.quantity, 0),
//         "Total Amount": totalAmount,
//         "Order Status": order.orderStatus,
//         "Verification Status": verificationStatus,
//         "Transporter Status": order.transporterStatus || "N/A",
//         "Trader Payment Status": order.traderToAdminPayment?.paymentStatus || "N/A",
//         "Trader Paid Amount": order.traderToAdminPayment?.paidAmount || 0,
//         "Farmer Payment Status": order.adminToFarmerPayment?.paymentStatus || "N/A",
//         "Farmer Paid Amount": order.adminToFarmerPayment?.paidAmount || 0,
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Orders");
//     writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allOrders.map((order) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         const verificationStatus = getVerificationStatus(order);
//         return [
//           `"${order.orderId}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`,
//           `"${order.traderName}"`,
//           `"${order.farmerName || "N/A"}"`,
//           order.productItems.length,
//           totalAmount,
//           `"${order.orderStatus}"`,
//           `"${verificationStatus}"`,
//           `"${order.traderToAdminPayment?.paymentStatus || "N/A"}"`,
//           `"${order.adminToFarmerPayment?.paymentStatus || "N/A"}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Orders Management Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Trader", "Farmer", "Items", "Total Amount", "Status", "Verification"];
//     const tableRows: any = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return [
//         order.orderId,
//         order.traderName,
//         order.farmerName || "N/A",
//         order.productItems.length,
//         `₹${totalAmount}`,
//         order.orderStatus,
//         verificationStatus
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [76, 175, 80] },
//     });
    
//     doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
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
//           h1 { color: #1f2937; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #f3f4f6; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           @media print { @page { size: landscape; } }
//         </style>
//       </head>
//       <body>
//         <h1>Orders Management Report</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Trader</th>
//               <th>Farmer</th>
//               <th>Items</th>
//               <th>Total Amount</th>
//               <th>Status</th>
//               <th>Verification</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allOrders.map((order) => {
//               const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//               const verificationStatus = getVerificationStatus(order);
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td>${order.traderName}</td>
//                   <td>${order.farmerName || "N/A"}</td>
//                   <td>${order.productItems.length}</td>
//                   <td>₹${totalAmount}</td>
//                   <td>${order.orderStatus}</td>
//                   <td>${verificationStatus}</td>
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
//     toast.success("Printing orders...");
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
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

//   // Get verification status
//   const getVerificationStatus = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'Not Available';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'Verified';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'Partial';
//     } else if (details.verifiedAt) {
//       return 'Pending';
//     } else {
//       return 'Not Verified';
//     }
//   };

//   // Get verification color
//   const getVerificationColor = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'bg-green-100 text-green-800 border-green-200';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     } else if (details.verifiedAt) {
//       return 'bg-red-100 text-red-800 border-red-200';
//     } else {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Open details dialog
//   const openDetailsDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setDetailsDialogOpen(true);
//   };

//   // Open edit dialog
//   const openEditDialog = (order: Order) => {
//     if (window.openEditOrderModal) {
//       window.openEditOrderModal(order.orderId);
//     }
//   };

//   // Open verification dialog
//   const openVerificationDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setVerificationDialogOpen(true);
//   };

//   // Open farmer payment modal
//   const openFarmerPaymentModal = (order: Order) => {
//     if (window.openFarmerPaymentModal && order.adminToFarmerPayment) {
//       window.openFarmerPaymentModal({
//         orderId: order.orderId,
//         farmerName: order.farmerName || 'N/A',
//         totalAmount: order.adminToFarmerPayment.totalAmount,
//         paidAmount: order.adminToFarmerPayment.paidAmount,
//         remainingAmount: order.adminToFarmerPayment.remainingAmount,
//         onPaymentSuccess: fetchOrders
//       });
//     }
//   };

//   // Delete order
//   const handleDeleteOrder = async () => {
//     if (!currentOrder) return;
    
//     try {
//       const response = await fetch(`/api/order/${currentOrder._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       const result = await response.json();

//       if (result.success) {
//         toast.success('Order deleted successfully!');
//         setDeleteDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error(result.message || 'Failed to delete order');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error deleting order');
//     }
//   };

//   // Save verification
//   const saveVerification = async () => {
//     if (!currentOrder || !currentOrder.transporterDetails) {
//       toast.error('No transporter details available');
//       return;
//     }

//     const adminId = localStorage.getItem('adminId') || 'admin-001';
//     const adminName = localStorage.getItem('userName') || 'Admin';

//     const data = {
//       ...verificationData,
//       adminId,
//       adminName,
//       verificationDate: new Date().toISOString()
//     };

//     try {
//       const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
//         method: 'PATCH',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success('Verification updated successfully!');
//         setVerificationDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error('Failed to update verification');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error updating verification');
//     }
//   };

//   // Calculate order total
//   const calculateOrderTotal = (order: Order) => {
//     return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   };

//   // Toggle mobile card expansion
//   const toggleMobileCard = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   // Calculate payment percentage
//   const getPaymentPercentage = (paid: number, total: number) => {
//     if (total === 0) return 0;
//     return Math.round((paid / total) * 100);
//   };

//   if (loading && allOrders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   const { startItem, endItem } = getPaginationRange();

//   return (
//     <>
//       <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
//         {/* Header */}
//         <div className="lg:mb-0 mb-3">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaShoppingCart className="text-blue-600" />
//             Order Management
//           </h1>
//           <p className="text-gray-600 mt-2">Manage and monitor all marketplace orders</p>
//         </div>

//         {/* Export Buttons - Desktop */}
//         <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
//           {[
//             { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//             { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//             { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//             { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//             { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//           ].map((btn, i) => (
//             <button
//               key={i}
//               onClick={btn.onClick}
//               className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//             >
//               <btn.icon className="text-sm" />
//             </button>
//           ))}
//         </div>

//         {/* Export Buttons - Mobile */}
//         <div className="lg:hidden flex flex-wrap gap-2 mb-3">
//           {[
//             { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//             { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//             { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//             { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//             { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//           ].map((btn, i) => (
//             <button
//               key={i}
//               onClick={btn.onClick}
//               className={`flex items-center justify-center gap-1 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
//             >
//               <btn.icon className="text-sm" />
//             </button>
//           ))}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
//           <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
//               </div>
//               <FaShoppingCart className="text-blue-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {allOrders.filter(o => o.orderStatus === 'completed').length}
//                 </p>
//               </div>
//               <FaCheckCircle className="text-green-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {allOrders.filter(o => o.orderStatus === 'pending').length}
//                 </p>
//               </div>
//               <FaTimesCircle className="text-yellow-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Value</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(allOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0))}
//                 </p>
//               </div>
//               <FaRupeeSign className="text-purple-500 text-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded shadow mb-6 p-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 placeholder="Search orders..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaFilter className="text-gray-400" />
//               </div>
//               <select
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">All Order Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="in_transit">In Transit</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             {/* Transporter Status Filter */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaTruck className="text-gray-400" />
//               </div>
//               <select
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//                 value={transporterStatusFilter}
//                 onChange={(e) => setTransporterStatusFilter(e.target.value)}
//               >
//                 <option value="">All Transporter Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="completed">Completed</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex xl:gap-2 gap-1 overflow-x-scroll">
//               <button
//                 onClick={fetchOrders}
//                 className="flex-1  w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//               >
//                 <FaSearch />
//                 Search
//               </button>
//               <button
//                 onClick={() => {
//                   setStatusFilter('');
//                   setTransporterStatusFilter('');
//                   setSearchInput('');
//                   setCurrentPage(1);
//                 }}
//                 className="flex-1 flex w-fit items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//               >
//                 <FaSync />
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table (hidden on mobile) */}
//         <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {displayedOrders.map((order) => (
//                   <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                     {/* Order ID */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
//                         <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
//                       </div>
//                     </td>

//                     {/* Trader */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaStore className="text-gray-400 mr-2" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{order.traderName}</div>
//                           {order.traderMobile && (
//                             <div className="text-xs text-gray-500">{order.traderMobile}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Farmer */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaUser className="text-gray-400 mr-2" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{order.farmerName || 'N/A'}</div>
//                           {order.farmerMobile && (
//                             <div className="text-xs text-gray-500">{order.farmerMobile}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Products */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FaBox className="text-gray-400 mr-2" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{order.productItems.length} items</div>
//                           <div className="text-xs text-gray-500">
//                             {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Total */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="text-sm font-bold text-green-700">
//                         <FaRupeeSign className="inline mr-1" />
//                         {calculateOrderTotal(order).toLocaleString()}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
//                         {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                         {order.orderStatus}
//                       </span>
//                     </td>

//                     {/* Verification Status */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                         {getVerificationStatus(order)}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => openDetailsDialog(order)}
//                           className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           onClick={() => openEditDialog(order)}
//                           className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors"
//                           title="Edit Order"
//                         >
//                           <FaEdit />
//                         </button>
//                         {/* <button
//                           onClick={() => {
//                             setCurrentOrder(order);
//                             setDeleteDialogOpen(true);
//                           }}
//                           className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
//                           title="Delete Order"
//                         >
//                           <FaTrash />
//                         </button> */}
//                         {order.transporterDetails && (
//                           <button
//                             onClick={() => openVerificationDialog(order)}
//                             className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
//                             title="Verification"
//                           >
//                             <FaCheck />
//                           </button>
//                         )}
//                         {/* INVOICE DOWNLOAD BUTTON */}
//                         {order.traderToAdminPayment && (
//                           <button
//                             onClick={() => generateTraderInvoice(order)}
//                             className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50 transition-colors"
//                             title="Download Trader Invoice"
//                           >
//                             <FaFileInvoiceDollar />
//                           </button>
//                         )}
//                         {order.adminToFarmerPayment && (
//                           <button
//                             onClick={() => generateFarmerInvoice(order)}
//                             className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
//                             title="Download Farmer Invoice"
//                           >
//                             <FaReceipt />
//                           </button>
//                         )}
//                         {/* PAYMENT BUTTON */}
//                         {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
//                           <button
//                             onClick={() => openFarmerPaymentModal(order)}
//                             className="text-emerald-600 hover:text-emerald-900 p-2 rounded hover:bg-emerald-50 transition-colors"
//                             title="Make Payment to Farmer"
//                           >
//                             <FaMoneyBillWave />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* No Orders State */}
//           {allOrders.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
//                 <AiOutlineFileSearch />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//               <p className="text-gray-500">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>

//         {/* Mobile Cards (visible only on mobile) */}
//         <div className="lg:hidden space-y-4">
//           {displayedOrders.map((order) => (
//             <div key={order._id} className="bg-white rounded shadow p-4">
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <div className="font-bold text-blue-600">{order.orderId}</div>
//                   <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => openDetailsDialog(order)}
//                     className="text-blue-600 p-1"
//                   >
//                     <FaEye />
//                   </button>
//                   <button
//                     onClick={() => toggleMobileCard(order._id)}
//                     className="text-gray-500 p-1"
//                   >
//                     {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <div className="text-xs text-gray-500">Trader</div>
//                   <div className="font-medium text-sm">{order.traderName}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Farmer</div>
//                   <div className="font-medium text-sm">{order.farmerName || 'N/A'}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Items</div>
//                   <div className="font-medium text-sm">{order.productItems.length}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Total</div>
//                   <div className="font-bold text-green-700 text-sm">
//                     <FaRupeeSign className="inline mr-1" />
//                     {calculateOrderTotal(order).toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <div className="text-xs text-gray-500">Status</div>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
//                     {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                     {order.orderStatus}
//                   </span>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Verification</div>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                     {getVerificationStatus(order)}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mb-3">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => openEditDialog(order)}
//                     className="text-green-600 p-1"
//                   >
//                     <FaEdit />
//                   </button>
//                   {/* <button
//                     onClick={() => {
//                       setCurrentOrder(order);
//                       setDeleteDialogOpen(true);
//                     }}
//                     className="text-red-600 p-1"
//                   >
//                     <FaTrash />
//                   </button> */}
//                   {/* INVOICE DOWNLOAD BUTTON FOR MOBILE */}
//                   {order.traderToAdminPayment && (
//                     <button
//                       onClick={() => generateTraderInvoice(order)}
//                       className="text-yellow-600 p-1"
//                       title="Trader Invoice"
//                     >
//                       <FaFileInvoiceDollar />
//                     </button>
//                   )}
//                   {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
//                     <button
//                       onClick={() => openFarmerPaymentModal(order)}
//                       className="text-emerald-600 p-1"
//                       title="Make Payment to Farmer"
//                     >
//                       <FaMoneyBillWave />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {expandedOrder === order._id && (
//                 <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <div className="text-xs text-gray-500">Trader Mobile</div>
//                       <div className="text-sm">{order.traderMobile || 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Farmer Mobile</div>
//                       <div className="text-sm">{order.farmerMobile || 'N/A'}</div>
//                     </div>
//                   </div>
                  
//                   {order.traderToAdminPayment && (
//                     <div>
//                       <div className="text-xs text-gray-500">Trader Payment</div>
//                       <div className="text-sm font-medium">
//                         {order.traderToAdminPayment.paymentStatus} - 
//                         <span className="text-green-700 ml-1">
//                           ₹{order.traderToAdminPayment.paidAmount} paid
//                         </span>
//                       </div>
//                       {order.traderToAdminPayment.remainingAmount > 0 && (
//                         <div className="text-xs text-red-600">
//                           ₹{order.traderToAdminPayment.remainingAmount} remaining
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {order.adminToFarmerPayment && (
//                     <div>
//                       <div className="text-xs text-gray-500">Farmer Payment</div>
//                       <div className="text-sm font-medium">
//                         {order.adminToFarmerPayment.paymentStatus} - 
//                         <span className="text-green-700 ml-1">
//                           ₹{order.adminToFarmerPayment.paidAmount} paid
//                         </span>
//                       </div>
//                       {order.adminToFarmerPayment.remainingAmount > 0 && (
//                         <div className="text-xs text-red-600">
//                           ₹{order.adminToFarmerPayment.remainingAmount} remaining
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="flex flex-wrap gap-2 pt-2">
//                     {order.transporterDetails && (
//                       <button
//                         onClick={() => openVerificationDialog(order)}
//                         className="flex-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-medium"
//                       >
//                         Verification
//                       </button>
//                     )}
//                     {order.traderToAdminPayment && (
//                       <button
//                         onClick={() => generateTraderInvoice(order)}
//                         className="flex-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-medium"
//                       >
//                         Trader Invoice
//                       </button>
//                     )}
//                     {order.adminToFarmerPayment && (
//                       <button
//                         onClick={() => generateFarmerInvoice(order)}
//                         className="flex-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium"
//                       >
//                         Farmer Invoice
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Pagination and Limit Controls */}
//         {allOrders.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow">
//             {/* Items per page selector */}
//             <div className="flex items-center gap-3">
//               <div className="text-sm text-gray-600">
//                 Showing {startItem} to {endItem} of {allOrders.length} orders
//               </div>
//               <FormControl size="small" className="min-w-[120px]">
//                 <InputLabel id="items-per-page-label">Show</InputLabel>
//                 <Select
//                   labelId="items-per-page-label"
//                   value={itemsPerPage}
//                   label="Show"
//                   onChange={handleItemsPerPageChange}
//                 >
//                   <MenuItem value={5}>5</MenuItem>
//                   <MenuItem value={10}>10</MenuItem>
//                   <MenuItem value={20}>20</MenuItem>
//                   <MenuItem value={50}>50</MenuItem>
//                   <MenuItem value={100}>100</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>

//             {/* Pagination component */}
//             <div className="flex flex-col sm:flex-row items-center gap-3">
//               <div className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </div>
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={handlePageChange}
//                 color="primary"
//                 shape="rounded"
//                 size="small"
//                 showFirstButton
//                 showLastButton
//                 siblingCount={1}
//                 boundaryCount={1}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Order Details Dialog */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaEye className="text-blue-600" />
//                 Order Details: {currentOrder?.orderId}
//               </h2>
//               <p className="text-gray-600">Complete order information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && (
//             <div className="space-y-6 max-h-[70vh] overflow-y-auto">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUser className="text-blue-600" />
//                     Farmer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.farmerName || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{currentOrder.farmerMobile || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{currentOrder.farmerEmail || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaStore className="text-green-600" />
//                     Trader Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.traderName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{currentOrder.traderMobile || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{currentOrder.traderEmail || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Status and Dates */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Order Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.orderStatus).bg} ${getStatusBadge(currentOrder.orderStatus).color}`}>
//                     {React.createElement(getStatusBadge(currentOrder.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                     {currentOrder.orderStatus}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Transporter Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.transporterStatus || 'pending').bg} ${getStatusBadge(currentOrder.transporterStatus || 'pending').color}`}>
//                     {React.createElement(getStatusBadge(currentOrder.transporterStatus || 'pending').icon, { className: "h-3 w-3 mr-1" })}
//                     {currentOrder.transporterStatus || 'pending'}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Created</h4>
//                   <p className="text-gray-700">{formatDateTime(currentOrder.createdAt)}</p>
//                 </div>
//               </div>

//               {/* Verification Status */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-purple-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                     <FaCheck />
//                     Verification Status
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.transporterReached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.transporterReached ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Transporter Reached</div>
//                         <div className="text-sm text-gray-500">Destination arrival</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.goodsConditionCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.goodsConditionCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Goods Condition</div>
//                         <div className="text-sm text-gray-500">Quality check</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.quantityCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.quantityCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Quantity Correct</div>
//                         <div className="text-sm text-gray-500">Amount verification</div>
//                       </div>
//                     </div>
//                   </div>
//                   {currentOrder.transporterDetails.verifiedAt && (
//                     <div className="mt-4 pt-4 border-t border-gray-200">
//                       <div className="text-sm text-gray-600">
//                         Verified by <span className="font-bold">{currentOrder.transporterDetails.verifiedByName || 'Admin'}</span> on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Payment Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {currentOrder.traderToAdminPayment && (
//                   <div className="border border-blue-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-blue-700">Trader to Admin Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).color}`}>
//                           {currentOrder.traderToAdminPayment.paymentStatus}
//                         </span>
//                       </div>
//                       {currentOrder.traderToAdminPayment.paymentHistory && currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
//                           <div className="space-y-2">
//                             {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
//                               <div key={index} className="flex justify-between text-sm">
//                                 <span className="text-gray-600">
//                                   {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
//                                 </span>
//                                 <span className="font-medium text-green-600">
//                                   {formatCurrency(payment.amount)}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {currentOrder.adminToFarmerPayment && (
//                   <div className="border border-green-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-green-700">Admin to Farmer Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).color}`}>
//                           {currentOrder.adminToFarmerPayment.paymentStatus}
//                         </span>
//                       </div>
//                       {currentOrder.adminToFarmerPayment.paymentHistory && currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
//                           <div className="space-y-2">
//                             {currentOrder.adminToFarmerPayment.paymentHistory.map((payment, index) => (
//                               <div key={index} className="flex justify-between text-sm">
//                                 <span className="text-gray-600">
//                                   {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
//                                 </span>
//                                 <span className="font-medium text-green-600">
//                                   {formatCurrency(payment.amount)}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     {currentOrder.adminToFarmerPayment.remainingAmount > 0 && (
//                       <button
//                         onClick={() => {
//                           setDetailsDialogOpen(false);
//                           openFarmerPaymentModal(currentOrder);
//                         }}
//                         className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded hover:from-emerald-600 hover:to-green-600 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <FaMoneyBillWave />
//                         Make Payment to Farmer
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Products Table */}
//               <div className="border rounded overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <FaBoxes className="text-purple-600" />
//                     Product Items ({currentOrder.productItems.length})
//                   </h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentOrder.productItems.map((item, index) => (
//                         <tr key={index}>
//                           <td className="px-4 py-3">{item.productName}</td>
//                           <td className="px-4 py-3">
//                             <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                               {item.grade}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">{item.quantity}</td>
//                           <td className="px-4 py-3">{formatCurrency(item.pricePerUnit)}</td>
//                           <td className="px-4 py-3 font-bold">{formatCurrency(item.totalAmount)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-50">
//                       <tr>
//                         <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
//                         <td className="px-4 py-3 font-bold text-green-700">
//                           {formatCurrency(calculateOrderTotal(currentOrder))}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-gray-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTruck className="text-orange-600" />
//                     Transporter Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Name:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.transporterName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Vehicle:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleType}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Number:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Driver:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.driverName || 'N/A'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Accepted:</span>
//                           <span className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Capacity:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dialog Footer */}
//           <div className="mt-6 pt-6 border-t flex flex-wrap justify-end gap-3">
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Close
//             </button>
//             {currentOrder?.traderToAdminPayment && (
//               <button
//                 onClick={() => generateTraderInvoice(currentOrder)}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
//               >
//                 <FaFileInvoiceDollar />
//                 Trader Invoice
//               </button>
//             )}
//             {currentOrder?.adminToFarmerPayment && (
//               <button
//                 onClick={() => generateFarmerInvoice(currentOrder)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
//               >
//                 <FaReceipt />
//                 Farmer Invoice
//               </button>
//             )}
//           </div>
//         </div>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//               <FaTrash className="h-6 w-6 text-red-600" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Delete Order {currentOrder?.orderId}?
//             </h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setDeleteDialogOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteOrder}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Verification Dialog */}
//       <Dialog
//         open={verificationDialogOpen}
//         onClose={() => setVerificationDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <FaCheck className="text-purple-600" />
//               Verification: {currentOrder?.orderId}
//             </h2>
//             <button
//               onClick={() => setVerificationDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && currentOrder.transporterDetails && (
//             <div className="space-y-6">
//               {/* Verification Checks */}
//               <div className="space-y-4">
//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="transporterReached"
//                     checked={verificationData.transporterReached}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         transporterReached: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="transporterReached" className="ml-3">
//                     <div className="font-medium">Transporter Reached Destination</div>
//                     <div className="text-sm text-gray-500">Confirm arrival at delivery location</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="goodsConditionCorrect"
//                     checked={verificationData.goodsConditionCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         goodsConditionCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="goodsConditionCorrect" className="ml-3">
//                     <div className="font-medium">Goods Condition is Correct</div>
//                     <div className="text-sm text-gray-500">Verify goods are in good condition</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="quantityCorrect"
//                     checked={verificationData.quantityCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         quantityCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="quantityCorrect" className="ml-3">
//                     <div className="font-medium">Quantity is Correct</div>
//                     <div className="text-sm text-gray-500">Confirm delivered quantity matches order</div>
//                   </label>
//                 </div>
//               </div>

//               {/* Admin Notes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Admin Notes
//                 </label>
//                 <textarea
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
//                   value={verificationData.adminNotes}
//                   onChange={(e) =>
//                     setVerificationData({
//                       ...verificationData,
//                       adminNotes: e.target.value,
//                     })
//                   }
//                   placeholder="Add any notes or observations..."
//                 />
//               </div>

//               {/* Previous Verification Info */}
//               {currentOrder.transporterDetails.verifiedAt && (
//                 <div className="p-4 bg-blue-50 rounded">
//                   <div className="text-sm text-blue-700">
//                     Last verified by{' '}
//                     <span className="font-bold">
//                       {currentOrder.transporterDetails.verifiedByName || 'Admin'}
//                     </span>{' '}
//                     on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   onClick={() => setVerificationDialogOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveVerification}
//                   className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
//                 >
//                   <FaSave />
//                   Save Verification
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Dialog>

//       {/* External Modals */}
//       <AdminFarmerPaymentModal />
//       <OrderEditModal />
//     </>
//   );
// };

// export default AdminOrdersRedesign;





// 'use client';

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
// import { utils, writeFile } from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaFilter,
//   FaShoppingCart,
//   FaUser,
//   FaStore,
//   FaTruck,
//   FaReceipt,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSync,
//   FaPrint,
//   FaFilePdf,
//   FaFileExcel,
//   FaCopy,
//   FaTimes,
//   FaSave,
//   FaBox,
//   FaCheck,
//   FaBoxes,
//   FaFileCsv,
//   FaChevronDown,
//   FaChevronUp,
//   FaFileInvoiceDollar,
//   FaSpinner,
//   FaExclamationCircle,
//   FaClipboardCheck,
//   FaMoneyBillWave,
//   FaCalendarAlt,
//   FaFileInvoice,
//   FaUserTie,
//   FaWeightHanging
// } from 'react-icons/fa';
// import { AiOutlineFileSearch } from 'react-icons/ai';
// import toast from 'react-hot-toast';
// import AdminFarmerPaymentModal from '../FarmerPaymentModal/page';
// import OrderEditModal from '../OrderEditModal/page';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';

// // Define the interface for farmer payment modal data
// export interface FarmerPaymentModalData {
//   orderId: string;
//   farmerName: string;
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   onPaymentSuccess?: () => void;
// }

// // Declare global window properties
// declare global {
//   interface Window {
//     openEditOrderModal?: (orderId: string) => void;
//     openFarmerPaymentModal?: (data: FarmerPaymentModalData) => void;
//   }
// }

// // Interfaces
// interface MarketDetails {
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface ProductItem {
//   productId: string;
//   productName: string;
//   grade: string;
//   quantity: number;
//   deliveryDate: string;
//   nearestMarket: string;
//   marketDetails: MarketDetails | null;
//   pricePerUnit: number;
//   totalAmount: number;
// }

// interface PaymentRecord {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
//   paymentMethod?: string;
// }

// interface PaymentDetails {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: string;
//   paymentHistory: PaymentRecord[];
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile?: string;
//   transporterEmail?: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity?: string;
//   driverName?: string;
//   driverMobile?: string;
//   acceptedAt: string;
//   transporterReached?: boolean;
//   goodsConditionCorrect?: boolean;
//   quantityCorrect?: boolean;
//   adminNotes?: string;
//   verifiedBy?: string;
//   verifiedByName?: string;
//   verifiedAt?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   traderMobile?: string;
//   traderEmail?: string;
//   traderId?: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerEmail?: string;
//   farmerId?: string;
//   productItems: ProductItem[];
//   orderStatus: string;
//   transporterStatus?: string;
//   transporterDetails?: TransporterDetails;
//   traderToAdminPayment?: PaymentDetails;
//   adminToFarmerPayment?: PaymentDetails;
//   createdAt: string;
// }

// interface FarmerDetails {
//   farmerId: string;
//   personalInfo: {
//     taluk: string;
//     name: string;
//     mobileNo: string;
//     email: string;
//   };
// }

// interface TraderDetails {
//   traderId: string;
//   personalInfo: {
//     taluk: string;
//     name: string;
//     mobileNo: string;
//     email: string;
//   };
// }

// const AdminOrdersRedesign: React.FC = () => {
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
//   // New state for farmer/trader details and expanded order info
//   const [farmerDetails, setFarmerDetails] = useState<{[key: string]: FarmerDetails}>({});
//   const [traderDetails, setTraderDetails] = useState<{[key: string]: TraderDetails}>({});
//   const [expandedOrderDetails, setExpandedOrderDetails] = useState<{[key: string]: boolean}>({});
  
//   // State for dialog details
//   const [dialogFarmerDetails, setDialogFarmerDetails] = useState<FarmerDetails | null>(null);
//   const [dialogTraderDetails, setDialogTraderDetails] = useState<TraderDetails | null>(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Dialog states
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
//   const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
//   // Mobile view state
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

//   // Verification state
//   const [verificationData, setVerificationData] = useState({
//     transporterReached: false,
//     goodsConditionCorrect: false,
//     quantityCorrect: false,
//     adminNotes: '',
//   });

//   const API_BASE = 'https://kisan.etpl.ai/api/admin';
//   const tableRef = useRef<HTMLDivElement>(null);
//   const [user, setUser] = useState<{role: string, taluka: string}>();

//   // Fetch user session on component mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       const session = await getAdminSessionAction();
//       if (session?.admin) {
//         setUser(session.admin);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Fetch farmer details by ID
//   const fetchFarmerDetails = async (farmerId: string): Promise<FarmerDetails | null> => {
//     if (!farmerId || farmerId === 'undefined') return null;
    
//     try {
//       const response = await fetch(`/api/farmers?search=${farmerId}`);
//       const data = await response.json();
      
//       if (data.success && data.data && data.data.length > 0) {
//         const farmerData = data.data[0];
//         return {
//           farmerId: farmerData.farmerId || farmerId,
//           personalInfo: {
//             taluk: farmerData.personalInfo?.taluk || '',
//             name: farmerData.personalInfo?.name || '',
//             mobileNo: farmerData.personalInfo?.mobileNo || '',
//             email: farmerData.personalInfo?.email || ''
//           }
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching farmer details:', error);
//       return null;
//     }
//   };

//   // Fetch trader details by ID
//   const fetchTraderDetails = async (traderId: string): Promise<TraderDetails | null> => {
//     if (!traderId || traderId === 'undefined') return null;
    
//     try {
//       const response = await fetch(`/api/farmers?search=${traderId}`);
//       const data = await response.json();
      
//       if (data.success && data.data && data.data.length > 0) {
//         const traderData = data.data[0];
//         return {
//           traderId: traderData.traderId || traderId,
//           personalInfo: {
//             taluk: traderData.personalInfo?.taluk || '',
//             name: traderData.personalInfo?.name || '',
//             mobileNo: traderData.personalInfo?.mobileNo || '',
//             email: traderData.personalInfo?.email || ''
//           }
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching trader details:', error);
//       return null;
//     }
//   };

//   // Fetch all orders with taluka filtering for subadmin
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);

//     let url = `${API_BASE}/orders`;
    
//     // Add filters to URL if present
//     const params = new URLSearchParams();
//     if (statusFilter) params.append('status', statusFilter);
//     if (transporterStatusFilter) params.append('transporterStatus', transporterStatusFilter);
//     if (searchInput) params.append('search', searchInput);
    
//     const queryString = params.toString();
//     if (queryString) {
//       url += `?${queryString}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         const orders = data.data || [];
        
//         // If user is subadmin, filter orders by taluka
//         if (user?.role === 'subadmin' && user?.taluka) {
//           const filtered = [];
//           const farmerDetailsMap: {[key: string]: FarmerDetails} = {};
//           const traderDetailsMap: {[key: string]: TraderDetails} = {};
          
//           // Fetch details for each order and filter
//           for (const order of orders) {
//             let shouldInclude = false;
            
//             // Check farmer taluka
//             if (order.farmerId) {
//               const farmerDetail = await fetchFarmerDetails(order.farmerId);
//               if (farmerDetail) {
//                 farmerDetailsMap[order.farmerId] = farmerDetail;
//                 if (farmerDetail.personalInfo.taluk === user.taluka) {
//                   shouldInclude = true;
//                 }
//               }
//             }
            
//             // Check trader taluka if not already included
//             if (!shouldInclude && order.traderId) {
//               const traderDetail = await fetchTraderDetails(order.traderId);
//               if (traderDetail) {
//                 traderDetailsMap[order.traderId] = traderDetail;
//                 if (traderDetail.personalInfo.taluk === user.taluka) {
//                   shouldInclude = true;
//                 }
//               }
//             }
            
//             if (shouldInclude) {
//               filtered.push(order);
//             }
//           }
          
//           setAllOrders(filtered);
//           setFarmerDetails(farmerDetailsMap);
//           setTraderDetails(traderDetailsMap);
//           setTotalItems(filtered.length);
//         } else {
//           // For admin users, show all orders
//           setAllOrders(orders);
//           setTotalItems(orders.length);
//         }
        
//       } else {
//         toast.error('Failed to fetch orders');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, transporterStatusFilter, searchInput, user]);

//   // Fetch orders when user or filters change
//   useEffect(() => {
//     if (user) {
//       fetchOrders();
//     }
//   }, [fetchOrders, user]);

//   // Apply pagination to displayed orders
//   useEffect(() => {
//     if (allOrders.length === 0) {
//       setDisplayedOrders([]);
//       setTotalPages(1);
//       setCurrentPage(1);
//       return;
//     }

//     // Calculate total pages
//     const totalPagesCount = Math.ceil(allOrders.length / itemsPerPage);
//     setTotalPages(totalPagesCount);
    
//     // Ensure current page is valid
//     if (currentPage > totalPagesCount) {
//       setCurrentPage(1);
//     }
    
//     // Calculate start and end indices
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
    
//     // Get orders for current page
//     const ordersForPage = allOrders.slice(startIndex, endIndex);
//     setDisplayedOrders(ordersForPage);
    
//   }, [allOrders, currentPage, itemsPerPage]);

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     // Scroll to top of table on page change
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
//     const endItem = Math.min(currentPage * itemsPerPage, allOrders.length);
//     return { startItem, endItem };
//   };

//   // Status badge configuration
//   const getStatusBadge = (status: string) => {
//     const statusConfig: { [key: string]: { color: string; bg: string; icon: any } } = {
//       pending: { color: 'text-yellow-800', bg: 'bg-yellow-100', icon: FaExclamationCircle },
//       processing: { color: 'text-blue-800', bg: 'bg-blue-100', icon: FaSpinner },
//       in_transit: { color: 'text-indigo-800', bg: 'bg-indigo-100', icon: FaTruck },
//       completed: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
//       cancelled: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
//       accepted: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
//       rejected: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
//       partial: { color: 'text-orange-800', bg: 'bg-orange-100', icon: FaExclamationCircle },
//       paid: { color: 'text-emerald-800', bg: 'bg-emerald-100', icon: FaCheckCircle },
//     };
    
//     return statusConfig[status] || { color: 'text-gray-800', bg: 'bg-gray-100', icon: FaExclamationCircle };
//   };

//   // Get farmer details for an order
//   const getFarmerDetails = (order: Order) => {
//     if (!order.farmerId) return null;
//     return farmerDetails[order.farmerId];
//   };

//   // Get trader details for an order
//   const getTraderDetails = (order: Order) => {
//     if (!order.traderId) return null;
//     return traderDetails[order.traderId];
//   };

//   // Get farmer taluka
//   const getFarmerTaluka = (order: Order) => {
//     const details = getFarmerDetails(order);
//     return details?.personalInfo?.taluk || 'N/A';
//   };

//   // Get trader taluka
//   const getTraderTaluka = (order: Order) => {
//     const details = getTraderDetails(order);
//     return details?.personalInfo?.taluk || 'N/A';
//   };

//   // Get farmer mobile
//   const getFarmerMobile = (order: Order) => {
//     const details = getFarmerDetails(order);
//     return details?.personalInfo?.mobileNo || 'N/A';
//   };

//   // Get trader mobile
//   const getTraderMobile = (order: Order) => {
//     const details = getTraderDetails(order);
//     return details?.personalInfo?.mobileNo || 'N/A';
//   };

//   // Get farmer email
//   const getFarmerEmail = (order: Order) => {
//     const details = getFarmerDetails(order);
//     return details?.personalInfo?.email || 'N/A';
//   };

//   // Get trader email
//   const getTraderEmail = (order: Order) => {
//     const details = getTraderDetails(order);
//     return details?.personalInfo?.email || 'N/A';
//   };

//   // Toggle expanded order details
//   const toggleExpandedDetails = (orderId: string) => {
//     setExpandedOrderDetails(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }));
//   };

//   // Invoice generation functions
//   const generateFarmerInvoice = (order: Order) => {
//     if (!order || !order.adminToFarmerPayment) {
//       toast.error('No farmer payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Farmer Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #198754; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #198754; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">FARMER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-FARMER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Payment Status:</strong> ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.adminToFarmerPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #198754;">
//                 TOTAL PAYABLE TO FARMER: ${formatCurrency(order.adminToFarmerPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Farmer invoice generated for order: ${order.orderId}`);
//   };

//   const generateTraderInvoice = (order: Order) => {
//     if (!order || !order.traderToAdminPayment) {
//       toast.error('No trader payment details available');
//       return;
//     }

//     const invoiceContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Invoice - Trader Payment</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
//         .invoice-container { max-width: 800px; margin: 0 auto; }
//         .header { text-align: center; margin-bottom: 30px; }
//         .company-name { color: #0d6efd; font-size: 28px; font-weight: bold; }
//         .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th { background-color: #0d6efd; color: white; padding: 12px; text-align: left; }
//         td { padding: 10px; border-bottom: 1px solid #ddd; }
//         .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
//     </style>
// </head>
// <body>
//     <div class="invoice-container">
//         <div class="header">
//             <div class="company-name">KISAN TRADING</div>
//             <div class="invoice-title">TRADER PAYMENT INVOICE</div>
//         </div>
        
//         <div>
//             <p><strong>Invoice Number:</strong> ${order.orderId}-TRADER</p>
//             <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Trader Name:</strong> ${order.traderName}</p>
//             <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
//             <p><strong>Payment Status:</strong> ${order.traderToAdminPayment.paymentStatus.toUpperCase()}</p>
//         </div>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Grade</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Amount</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${order.productItems.map(item => `
//                 <tr>
//                     <td>${item.productName}</td>
//                     <td>${item.grade}</td>
//                     <td>${item.quantity}</td>
//                     <td>${formatCurrency(item.pricePerUnit)}</td>
//                     <td>${formatCurrency(item.totalAmount)}</td>
//                 </tr>
//                 `).join('')}
//             </tbody>
//         </table>
        
//         <div class="total-section">
//             <p><strong>Total Product Value:</strong> ${formatCurrency(order.traderToAdminPayment.totalAmount)}</p>
//             <p><strong>Paid Amount:</strong> ${formatCurrency(order.traderToAdminPayment.paidAmount)}</p>
//             <p><strong>Remaining Amount:</strong> ${formatCurrency(order.traderToAdminPayment.remainingAmount)}</p>
//             <p style="font-size: 18px; font-weight: bold; color: #0d6efd;">
//                 TOTAL PAYABLE BY TRADER: ${formatCurrency(order.traderToAdminPayment.totalAmount)}
//             </p>
//         </div>
        
//         <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
//             <p>This is a computer generated invoice. No signature required.</p>
//             <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
//             <p>Invoice generated on: ${new Date().toLocaleString()}</p>
//         </div>
// </body>
// </html>
//     `;

//     const blob = new Blob([invoiceContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success(`Trader invoice generated for order: ${order.orderId}`);
//   };

//   // Export functions
//   const handleCopyToClipboard = async () => {
//     const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//     // Create separator line
//     const separator = "─".repeat(100);
    
//     // Format each cell with padding
//     const formatCell = (value:any) => {
//       const strValue = String(value || "");
//       return strValue.padEnd(15).substring(0, 15);
//     };
    
//     const tableContent = [
//       // Headers row
//       headers.map(header => formatCell(header)).join(" │ "),
//       separator,
      
//       // Data rows
//       ...allOrders.map((order) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         const verificationStatus = getVerificationStatus(order);
        
//         return [
//           formatCell(order.orderId),
//           formatCell(new Date(order.createdAt).toLocaleDateString()),
//           formatCell(order.traderName),
//           formatCell(order.farmerName || "N/A"),
//           formatCell(order.productItems.length),
//           formatCell(totalAmount),
//           formatCell(order.orderStatus),
//           formatCell(verificationStatus),
//           formatCell(order.traderToAdminPayment?.paymentStatus || "N/A"),
//           formatCell(order.adminToFarmerPayment?.paymentStatus || "N/A")
//         ].join(" │ ");
//       })
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success("Orders copied to clipboard in table format!");
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExportExcel = () => {
//     const data = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return {
//         "Order ID": order.orderId,
//         "Date": new Date(order.createdAt).toLocaleDateString(),
//         "Trader Name": order.traderName,
//         "Trader Mobile": getTraderMobile(order),
//         "Trader Taluk": getTraderTaluka(order),
//         "Farmer Name": order.farmerName || "N/A",
//         "Farmer Mobile": getFarmerMobile(order),
//         "Farmer Taluk": getFarmerTaluka(order),
//         "Items Count": order.productItems.length,
//         "Total Quantity": order.productItems.reduce((sum, item) => sum + item.quantity, 0),
//         "Total Amount": totalAmount,
//         "Order Status": order.orderStatus,
//         "Verification Status": verificationStatus,
//         "Transporter Status": order.transporterStatus || "N/A",
//         "Trader Payment Status": order.traderToAdminPayment?.paymentStatus || "N/A",
//         "Trader Paid Amount": order.traderToAdminPayment?.paidAmount || 0,
//         "Farmer Payment Status": order.adminToFarmerPayment?.paymentStatus || "N/A",
//         "Farmer Paid Amount": order.adminToFarmerPayment?.paidAmount || 0,
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Orders");
//     writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
//     toast.success("Excel file exported!");
//   };

//   const handleExportCSV = () => {
//     const headers = ["Order ID", "Date", "Trader", "Trader Taluk", "Trader Mobile", "Farmer", "Farmer Taluk", "Farmer Mobile", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
//     const csvContent = [
//       headers.join(","),
//       ...allOrders.map((order) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         const verificationStatus = getVerificationStatus(order);
//         return [
//           `"${order.orderId}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`,
//           `"${order.traderName}"`,
//           `"${getTraderTaluka(order)}"`,
//           `"${getTraderMobile(order)}"`,
//           `"${order.farmerName || "N/A"}"`,
//           `"${getFarmerTaluka(order)}"`,
//           `"${getFarmerMobile(order)}"`,
//           order.productItems.length,
//           totalAmount,
//           `"${order.orderStatus}"`,
//           `"${verificationStatus}"`,
//           `"${order.traderToAdminPayment?.paymentStatus || "N/A"}"`,
//           `"${order.adminToFarmerPayment?.paymentStatus || "N/A"}"`
//         ].join(",");
//       })
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//     toast.success("CSV file exported!");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Orders Management Report", 14, 16);
    
//     const tableColumn = ["Order ID", "Trader", "Trader Taluk", "Trader Mobile", "Farmer", "Farmer Taluk", "Farmer Mobile", "Items", "Total Amount", "Status", "Verification"];
//     const tableRows: any = allOrders.map((order) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       const verificationStatus = getVerificationStatus(order);
//       return [
//         order.orderId,
//         order.traderName,
//         getTraderTaluka(order),
//         getTraderMobile(order),
//         order.farmerName || "N/A",
//         getFarmerTaluka(order),
//         getFarmerMobile(order),
//         order.productItems.length,
//         `₹${totalAmount}`,
//         order.orderStatus,
//         verificationStatus
//       ];
//     });
    
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [76, 175, 80] },
//     });
    
//     doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
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
//           h1 { color: #1f2937; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #f3f4f6; padding: 12px; text-align: left; }
//           td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//           @media print { @page { size: landscape; } }
//         </style>
//       </head>
//       <body>
//         <h1>Orders Management Report</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Trader</th>
//               <th>Trader Taluk</th>
//               <th>Trader Mobile</th>
//               <th>Farmer</th>
//               <th>Farmer Taluk</th>
//               <th>Farmer Mobile</th>
//               <th>Items</th>
//               <th>Total Amount</th>
//               <th>Status</th>
//               <th>Verification</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${allOrders.map((order) => {
//               const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//               const verificationStatus = getVerificationStatus(order);
//               return `
//                 <tr>
//                   <td>${order.orderId}</td>
//                   <td>${new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td>${order.traderName}</td>
//                   <td>${getTraderTaluka(order)}</td>
//                   <td>${getTraderMobile(order)}</td>
//                   <td>${order.farmerName || "N/A"}</td>
//                   <td>${getFarmerTaluka(order)}</td>
//                   <td>${getFarmerMobile(order)}</td>
//                   <td>${order.productItems.length}</td>
//                   <td>₹${totalAmount}</td>
//                   <td>${order.orderStatus}</td>
//                   <td>${verificationStatus}</td>
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
//     toast.success("Printing orders...");
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
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

//   // Get verification status
//   const getVerificationStatus = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'Not Available';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'Verified';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'Partial';
//     } else if (details.verifiedAt) {
//       return 'Pending';
//     } else {
//       return 'Not Verified';
//     }
//   };

//   // Get verification color
//   const getVerificationColor = (order: Order) => {
//     const details = order.transporterDetails;
    
//     if (!details) {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
    
//     const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
//     if (transporterReached && goodsConditionCorrect && quantityCorrect) {
//       return 'bg-green-100 text-green-800 border-green-200';
//     } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     } else if (details.verifiedAt) {
//       return 'bg-red-100 text-red-800 border-red-200';
//     } else {
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Open details dialog with enhanced information
//   const openDetailsDialog = async (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
    
//     // Reset dialog details
//     setDialogFarmerDetails(null);
//     setDialogTraderDetails(null);
    
//     // Fetch farmer details for dialog
//     if (order.farmerId) {
//       try {
//         const farmerDetail = await fetchFarmerDetails(order.farmerId);
//         if (farmerDetail) {
//           setDialogFarmerDetails(farmerDetail);
//         }
//       } catch (error) {
//         console.error('Error fetching farmer details for dialog:', error);
//       }
//     }
    
//     // Fetch trader details for dialog
//     if (order.traderId) {
//       try {
//         const traderDetail = await fetchTraderDetails(order.traderId);
//         if (traderDetail) {
//           setDialogTraderDetails(traderDetail);
//         }
//       } catch (error) {
//         console.error('Error fetching trader details for dialog:', error);
//       }
//     }
    
//     setDetailsDialogOpen(true);
//   };

//   // Open edit dialog
//   const openEditDialog = (order: Order) => {
//     if (window.openEditOrderModal) {
//       window.openEditOrderModal(order.orderId);
//     }
//   };

//   // Open verification dialog
//   const openVerificationDialog = (order: Order) => {
//     setCurrentOrder(order);
//     setVerificationData({
//       transporterReached: order.transporterDetails?.transporterReached || false,
//       goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
//       quantityCorrect: order.transporterDetails?.quantityCorrect || false,
//       adminNotes: order.transporterDetails?.adminNotes || '',
//     });
//     setVerificationDialogOpen(true);
//   };

//   // Open farmer payment modal
//   const openFarmerPaymentModal = (order: Order) => {
//     if (window.openFarmerPaymentModal && order.adminToFarmerPayment) {
//       window.openFarmerPaymentModal({
//         orderId: order.orderId,
//         farmerName: order.farmerName || 'N/A',
//         totalAmount: order.adminToFarmerPayment.totalAmount,
//         paidAmount: order.adminToFarmerPayment.paidAmount,
//         remainingAmount: order.adminToFarmerPayment.remainingAmount,
//         onPaymentSuccess: fetchOrders
//       });
//     }
//   };

//   // Delete order
//   const handleDeleteOrder = async () => {
//     if (!currentOrder) return;
    
//     try {
//       const response = await fetch(`/api/order/${currentOrder._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       const result = await response.json();

//       if (result.success) {
//         toast.success('Order deleted successfully!');
//         setDeleteDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error(result.message || 'Failed to delete order');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error deleting order');
//     }
//   };

//   // Save verification
//   const saveVerification = async () => {
//     if (!currentOrder || !currentOrder.transporterDetails) {
//       toast.error('No transporter details available');
//       return;
//     }

//     const adminId = localStorage.getItem('adminId') || 'admin-001';
//     const adminName = localStorage.getItem('userName') || 'Admin';

//     const data = {
//       ...verificationData,
//       adminId,
//       adminName,
//       verificationDate: new Date().toISOString()
//     };

//     try {
//       const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
//         method: 'PATCH',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success('Verification updated successfully!');
//         setVerificationDialogOpen(false);
//         fetchOrders();
//       } else {
//         toast.error('Failed to update verification');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error updating verification');
//     }
//   };

//   // Calculate order total
//   const calculateOrderTotal = (order: Order) => {
//     return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   };

//   // Toggle mobile card expansion
//   const toggleMobileCard = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   // Calculate payment percentage
//   const getPaymentPercentage = (paid: number, total: number) => {
//     if (total === 0) return 0;
//     return Math.round((paid / total) * 100);
//   };

//   if (loading && allOrders.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   const { startItem, endItem } = getPaginationRange();

//   return (
//     <>
//       <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
//         {/* Header with user role info */}
//         <div className="lg:mb-0 mb-3">
//           <div className="flex justify-between flex-wrap gap-y-2 items-start">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaShoppingCart className="text-blue-600" />
//                 Order Management
//               </h1>
//               <p className="text-gray-600 mt-2">Manage and monitor all marketplace orders</p>
//             </div>
//             {user && (
//               <div className="bg-blue-50 px-3 sm:block hidden  py-2 rounded border border-blue-200">
//                 <div className="text-sm text-blue-700 font-medium">
//                   Logged in as: <span className="font-bold capitalize">{user.role}</span>
//                   {user.role === 'subadmin' && (
//                     <div className="text-xs text-blue-600 mt-1">
//                       Taluka: <span className="font-semibold">{user.taluka}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Export Buttons - Desktop */}
//         <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
//           {[
//             { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//             { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//             { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//             { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//             { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//           ].map((btn, i) => (
//             <button
//               key={i}
//               onClick={btn.onClick}
//               className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//             >
//               <btn.icon className="text-sm" />
//             </button>
//           ))}
//         </div>

//         {/* Export Buttons - Mobile */}
//         <div className="lg:hidden flex flex-wrap gap-2 mb-3">
//           {[
//             { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//             { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//             { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//             { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//             { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//           ].map((btn, i) => (
//             <button
//               key={i}
//               onClick={btn.onClick}
//               className={`flex items-center justify-center gap-1 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
//             >
//               <btn.icon className="text-sm" />
//             </button>
//           ))}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
//           <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
//               </div>
//               <FaShoppingCart className="text-blue-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {allOrders.filter(o => o.orderStatus === 'completed').length}
//                 </p>
//               </div>
//               <FaCheckCircle className="text-green-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {allOrders.filter(o => o.orderStatus === 'pending').length}
//                 </p>
//               </div>
//               <FaTimesCircle className="text-yellow-500 text-2xl" />
//             </div>
//           </div>
//           <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Value</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(allOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0))}
//                 </p>
//               </div>
//               <FaRupeeSign className="text-purple-500 text-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded shadow mb-6 p-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 placeholder="Search orders..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaFilter className="text-gray-400" />
//               </div>
//               <select
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">All Order Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="in_transit">In Transit</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             {/* Transporter Status Filter */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaTruck className="text-gray-400" />
//               </div>
//               <select
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
//                 value={transporterStatusFilter}
//                 onChange={(e) => setTransporterStatusFilter(e.target.value)}
//               >
//                 <option value="">All Transporter Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="completed">Completed</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex xl:gap-2 gap-1 overflow-x-scroll">
//               <button
//                 onClick={fetchOrders}
//                 className="flex-1  w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//               >
//                 <FaSearch />
//                 Search
//               </button>
//               <button
//                 onClick={() => {
//                   setStatusFilter('');
//                   setTransporterStatusFilter('');
//                   setSearchInput('');
//                   setCurrentPage(1);
//                 }}
//                 className="flex-1 flex w-fit items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//               >
//                 <FaSync />
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table (hidden on mobile) */}
//         <div className="hidden lg:block bg-white rounded shadow overflow-hidden" ref={tableRef}>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader (Taluk)</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer (Taluk)</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {displayedOrders.map((order) => {
//                   const farmerTaluk = getFarmerTaluka(order);
//                   const traderTaluk = getTraderTaluka(order);
//                   const isExpanded = expandedOrderDetails[order._id];
                  
//                   return (
//                     <React.Fragment key={order._id}>
//                       <tr className="hover:bg-gray-50 transition-colors">
//                         {/* Order ID */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div>
//                             <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
//                             <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
//                           </div>
//                         </td>

//                         {/* Trader with Taluk */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <FaStore className="text-gray-400 mr-2" />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{order.traderName}</div>
//                               <div className="text-xs text-gray-500">
//                                 {traderTaluk}
//                                 {getTraderMobile(order) !== 'N/A' && ` • ${getTraderMobile(order)}`}
//                               </div>
//                             </div>
//                             <button
//                               onClick={() => toggleExpandedDetails(order._id)}
//                               className="ml-2 text-gray-400 hover:text-gray-600"
//                             >
//                               {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//                             </button>
//                           </div>
//                         </td>

//                         {/* Farmer with Taluk */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <FaUser className="text-gray-400 mr-2" />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{order.farmerName || 'N/A'}</div>
//                               <div className="text-xs text-gray-500">
//                                 {farmerTaluk}
//                                 {getFarmerMobile(order) !== 'N/A' && ` • ${getFarmerMobile(order)}`}
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Products */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <FaBox className="text-gray-400 mr-2" />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{order.productItems.length} items</div>
//                               <div className="text-xs text-gray-500">
//                                 {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Total */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div className="text-sm font-bold text-green-700">
//                             <FaRupeeSign className="inline mr-1" />
//                             {calculateOrderTotal(order).toLocaleString()}
//                           </div>
//                         </td>

//                         {/* Status */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
//                             {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                             {order.orderStatus}
//                           </span>
//                         </td>

//                         {/* Verification Status */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                             {getVerificationStatus(order)}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => openDetailsDialog(order)}
//                               className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
//                               title="View Details"
//                             >
//                               <FaEye />
//                             </button>
//                             <button
//                               onClick={() => openEditDialog(order)}
//                               className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors"
//                               title="Edit Order"
//                             >
//                               <FaEdit />
//                             </button>
//                             {order.transporterDetails && (
//                               <button
//                                 onClick={() => openVerificationDialog(order)}
//                                 className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
//                                 title="Verification"
//                               >
//                                 <FaCheck />
//                               </button>
//                             )}
//                             {/* INVOICE DOWNLOAD BUTTON */}
//                             {order.traderToAdminPayment && (
//                               <button
//                                 onClick={() => generateTraderInvoice(order)}
//                                 className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50 transition-colors"
//                                 title="Download Trader Invoice"
//                               >
//                                 <FaFileInvoiceDollar />
//                               </button>
//                             )}
//                             {order.adminToFarmerPayment && (
//                               <button
//                                 onClick={() => generateFarmerInvoice(order)}
//                                 className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
//                                 title="Download Farmer Invoice"
//                               >
//                                 <FaReceipt />
//                               </button>
//                             )}
//                             {/* PAYMENT BUTTON */}
//                             {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
//                               <button
//                                 onClick={() => openFarmerPaymentModal(order)}
//                                 className="text-emerald-600 hover:text-emerald-900 p-2 rounded hover:bg-emerald-50 transition-colors"
//                                 title="Make Payment to Farmer"
//                               >
//                                 <FaMoneyBillWave />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
                      
//                       {/* Expanded Row with Additional Details */}
//                       {isExpanded && (
//                         <tr className="bg-blue-50">
//                           <td colSpan={8} className="px-6 py-4">
//                             <div className="grid grid-cols-2 gap-4 text-sm">
//                               <div>
//                                 <h4 className="font-semibold text-blue-700 mb-2">Trader Details</h4>
//                                 <div className="space-y-1">
//                                   <div><span className="text-gray-600">ID:</span> <span className="font-medium">{order.traderId || 'N/A'}</span></div>
//                                   <div><span className="text-gray-600">Taluk:</span> <span className="font-medium">{traderTaluk}</span></div>
//                                   <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{getTraderMobile(order)}</span></div>
//                                   <div><span className="text-gray-600">Email:</span> <span className="font-medium">{getTraderEmail(order)}</span></div>
//                                 </div>
//                               </div>
//                               <div>
//                                 <h4 className="font-semibold text-blue-700 mb-2">Farmer Details</h4>
//                                 <div className="space-y-1">
//                                   <div><span className="text-gray-600">ID:</span> <span className="font-medium">{order.farmerId || 'N/A'}</span></div>
//                                   <div><span className="text-gray-600">Taluk:</span> <span className="font-medium">{farmerTaluk}</span></div>
//                                   <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{getFarmerMobile(order)}</span></div>
//                                   <div><span className="text-gray-600">Email:</span> <span className="font-medium">{getFarmerEmail(order)}</span></div>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* No Orders State */}
//           {allOrders.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
//                 <AiOutlineFileSearch />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//               <p className="text-gray-500">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>

//         {/* Mobile Cards (visible only on mobile) */}
//         <div className="lg:hidden space-y-4">
//           {displayedOrders.map((order) => {
//             const farmerTaluk = getFarmerTaluka(order);
//             const traderTaluk = getTraderTaluka(order);
            
//             return (
//               <div key={order._id} className="bg-white rounded shadow p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <div className="font-bold text-blue-600">{order.orderId}</div>
//                     <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => openDetailsDialog(order)}
//                       className="text-blue-600 p-1"
//                     >
//                       <FaEye />
//                     </button>
//                     <button
//                       onClick={() => toggleMobileCard(order._id)}
//                       className="text-gray-500 p-1"
//                     >
//                       {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Trader (Taluk)</div>
//                     <div className="font-medium text-sm">{order.traderName}</div>
//                     <div className="text-xs text-gray-600">{traderTaluk}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Farmer (Taluk)</div>
//                     <div className="font-medium text-sm">{order.farmerName || 'N/A'}</div>
//                     <div className="text-xs text-gray-600">{farmerTaluk}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Items</div>
//                     <div className="font-medium text-sm">{order.productItems.length}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Total</div>
//                     <div className="font-bold text-green-700 text-sm">
//                       <FaRupeeSign className="inline mr-1" />
//                       {calculateOrderTotal(order).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Status</div>
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
//                       {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                       {order.orderStatus}
//                     </span>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Verification</div>
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
//                       {getVerificationStatus(order)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center mb-3">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openEditDialog(order)}
//                       className="text-green-600 p-1"
//                     >
//                       <FaEdit />
//                     </button>
//                     {/* INVOICE DOWNLOAD BUTTON FOR MOBILE */}
//                     {order.traderToAdminPayment && (
//                       <button
//                         onClick={() => generateTraderInvoice(order)}
//                         className="text-yellow-600 p-1"
//                         title="Trader Invoice"
//                       >
//                         <FaFileInvoiceDollar />
//                       </button>
//                     )}
//                     {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
//                       <button
//                         onClick={() => openFarmerPaymentModal(order)}
//                         className="text-emerald-600 p-1"
//                         title="Make Payment to Farmer"
//                       >
//                         <FaMoneyBillWave />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Expanded Content */}
//                 {expandedOrder === order._id && (
//                   <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <div className="text-xs text-gray-500">Trader ID</div>
//                         <div className="text-sm font-medium">{order.traderId || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Farmer ID</div>
//                         <div className="text-sm font-medium">{order.farmerId || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Trader Mobile</div>
//                         <div className="text-sm">{getTraderMobile(order)}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Farmer Mobile</div>
//                         <div className="text-sm">{getFarmerMobile(order)}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Trader Email</div>
//                         <div className="text-sm">{getTraderEmail(order)}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Farmer Email</div>
//                         <div className="text-sm">{getFarmerEmail(order)}</div>
//                       </div>
//                     </div>
                    
//                     {order.traderToAdminPayment && (
//                       <div>
//                         <div className="text-xs text-gray-500">Trader Payment</div>
//                         <div className="text-sm font-medium">
//                           {order.traderToAdminPayment.paymentStatus} - 
//                           <span className="text-green-700 ml-1">
//                             ₹{order.traderToAdminPayment.paidAmount} paid
//                           </span>
//                         </div>
//                         {order.traderToAdminPayment.remainingAmount > 0 && (
//                           <div className="text-xs text-red-600">
//                             ₹{order.traderToAdminPayment.remainingAmount} remaining
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {order.adminToFarmerPayment && (
//                       <div>
//                         <div className="text-xs text-gray-500">Farmer Payment</div>
//                         <div className="text-sm font-medium">
//                           {order.adminToFarmerPayment.paymentStatus} - 
//                           <span className="text-green-700 ml-1">
//                             ₹{order.adminToFarmerPayment.paidAmount} paid
//                           </span>
//                         </div>
//                         {order.adminToFarmerPayment.remainingAmount > 0 && (
//                           <div className="text-xs text-red-600">
//                             ₹{order.adminToFarmerPayment.remainingAmount} remaining
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex flex-wrap gap-2 pt-2">
//                       {order.transporterDetails && (
//                         <button
//                           onClick={() => openVerificationDialog(order)}
//                           className="flex-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-medium"
//                         >
//                           Verification
//                         </button>
//                       )}
//                       {order.traderToAdminPayment && (
//                         <button
//                           onClick={() => generateTraderInvoice(order)}
//                           className="flex-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-medium"
//                         >
//                           Trader Invoice
//                         </button>
//                       )}
//                       {order.adminToFarmerPayment && (
//                         <button
//                           onClick={() => generateFarmerInvoice(order)}
//                           className="flex-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium"
//                         >
//                           Farmer Invoice
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination and Limit Controls */}
//         {allOrders.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow">
//             {/* Items per page selector */}
//             <div className="flex items-center gap-3">
//               <div className="text-sm text-gray-600">
//                 Showing {startItem} to {endItem} of {allOrders.length} orders
//               </div>
//               <FormControl size="small" className="min-w-[120px]">
//                 <InputLabel id="items-per-page-label">Show</InputLabel>
//                 <Select
//                   labelId="items-per-page-label"
//                   value={itemsPerPage}
//                   label="Show"
//                   onChange={handleItemsPerPageChange}
//                 >
//                   <MenuItem value={5}>5</MenuItem>
//                   <MenuItem value={10}>10</MenuItem>
//                   <MenuItem value={20}>20</MenuItem>
//                   <MenuItem value={50}>50</MenuItem>
//                   <MenuItem value={100}>100</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>

//             {/* Pagination component */}
//             <div className="flex flex-col sm:flex-row items-center gap-3">
//               <div className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </div>
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={handlePageChange}
//                 color="primary"
//                 shape="rounded"
//                 size="small"
//                 showFirstButton
//                 showLastButton
//                 siblingCount={1}
//                 boundaryCount={1}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Order Details Dialog with Enhanced Information */}
//       <Dialog
//         open={detailsDialogOpen}
//         onClose={() => setDetailsDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <FaEye className="text-blue-600" />
//                 Order Details: {currentOrder?.orderId}
//               </h2>
//               <p className="text-gray-600">Complete order information</p>
//             </div>
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && (
//             <div className="space-y-6 max-h-[70vh] overflow-y-auto">
//               {/* User Role Info */}
//               {user && (
//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-medium text-blue-800">
//                         Viewing as: <span className="font-bold capitalize">{user.role}</span>
//                       </div>
//                       {user.role === 'subadmin' && (
//                         <div className="text-sm text-blue-600 mt-1">
//                           Showing orders from your taluka: <span className="font-semibold">{user.taluka}</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-sm text-blue-600">
//                       Farmer Taluk: <span className="font-medium">{dialogFarmerDetails?.personalInfo?.taluk || 'N/A'}</span>
//                       <br />
//                       Trader Taluk: <span className="font-medium">{dialogTraderDetails?.personalInfo?.taluk || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaUser className="text-blue-600" />
//                     Farmer Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.farmerName || dialogFarmerDetails?.personalInfo?.name || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">ID:</span>
//                       <span className="font-medium">{currentOrder.farmerId || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Taluk:</span>
//                       <span className="font-medium">{dialogFarmerDetails?.personalInfo?.taluk || 'Loading...'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{dialogFarmerDetails?.personalInfo?.mobileNo || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{dialogFarmerDetails?.personalInfo?.email || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaStore className="text-green-600" />
//                     Trader Information
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{currentOrder.traderName || dialogTraderDetails?.personalInfo?.name || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">ID:</span>
//                       <span className="font-medium">{currentOrder.traderId || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Taluk:</span>
//                       <span className="font-medium">{dialogTraderDetails?.personalInfo?.taluk || 'Loading...'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mobile:</span>
//                       <span className="font-medium">{dialogTraderDetails?.personalInfo?.mobileNo || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{dialogTraderDetails?.personalInfo?.email || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Status and Dates */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Order Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.orderStatus).bg} ${getStatusBadge(currentOrder.orderStatus).color}`}>
//                     {React.createElement(getStatusBadge(currentOrder.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
//                     {currentOrder.orderStatus}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Transporter Status</h4>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.transporterStatus || 'pending').bg} ${getStatusBadge(currentOrder.transporterStatus || 'pending').color}`}>
//                     {React.createElement(getStatusBadge(currentOrder.transporterStatus || 'pending').icon, { className: "h-3 w-3 mr-1" })}
//                     {currentOrder.transporterStatus || 'pending'}
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="font-semibold mb-2">Created</h4>
//                   <p className="text-gray-700">{formatDateTime(currentOrder.createdAt)}</p>
//                 </div>
//               </div>

//               {/* Verification Status */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-purple-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                     <FaCheck />
//                     Verification Status
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.transporterReached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.transporterReached ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Transporter Reached</div>
//                         <div className="text-sm text-gray-500">Destination arrival</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.goodsConditionCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.goodsConditionCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Goods Condition</div>
//                         <div className="text-sm text-gray-500">Quality check</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.quantityCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {currentOrder.transporterDetails.quantityCorrect ? <FaCheck /> : <FaTimes />}
//                       </div>
//                       <div>
//                         <div className="font-medium">Quantity Correct</div>
//                         <div className="text-sm text-gray-500">Amount verification</div>
//                       </div>
//                     </div>
//                   </div>
//                   {currentOrder.transporterDetails.verifiedAt && (
//                     <div className="mt-4 pt-4 border-t border-gray-200">
//                       <div className="text-sm text-gray-600">
//                         Verified by <span className="font-bold">{currentOrder.transporterDetails.verifiedByName || 'Admin'}</span> on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Payment Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {currentOrder.traderToAdminPayment && (
//                   <div className="border border-blue-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-blue-700">Trader to Admin Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).color}`}>
//                           {currentOrder.traderToAdminPayment.paymentStatus}
//                         </span>
//                       </div>
//                       {currentOrder.traderToAdminPayment.paymentHistory && currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
//                           <div className="space-y-2">
//                             {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
//                               <div key={index} className="flex justify-between text-sm">
//                                 <span className="text-gray-600">
//                                   {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
//                                 </span>
//                                 <span className="font-medium text-green-600">
//                                   {formatCurrency(payment.amount)}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {currentOrder.adminToFarmerPayment && (
//                   <div className="border border-green-200 rounded p-4">
//                     <h3 className="text-lg font-semibold mb-4 text-green-700">Admin to Farmer Payment</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold">{formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-bold text-green-600">{formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Remaining:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).color}`}>
//                           {currentOrder.adminToFarmerPayment.paymentStatus}
//                         </span>
//                       </div>
//                       {currentOrder.adminToFarmerPayment.paymentHistory && currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
//                           <div className="space-y-2">
//                             {currentOrder.adminToFarmerPayment.paymentHistory.map((payment, index) => (
//                               <div key={index} className="flex justify-between text-sm">
//                                 <span className="text-gray-600">
//                                   {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
//                                 </span>
//                                 <span className="font-medium text-green-600">
//                                   {formatCurrency(payment.amount)}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     {currentOrder.adminToFarmerPayment.remainingAmount > 0 && (
//                       <button
//                         onClick={() => {
//                           setDetailsDialogOpen(false);
//                           openFarmerPaymentModal(currentOrder);
//                         }}
//                         className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded hover:from-emerald-600 hover:to-green-600 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <FaMoneyBillWave />
//                         Make Payment to Farmer
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Products Table */}
//               <div className="border rounded overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <FaBoxes className="text-purple-600" />
//                     Product Items ({currentOrder.productItems.length})
//                   </h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentOrder.productItems.map((item, index) => (
//                         <tr key={index}>
//                           <td className="px-4 py-3">{item.productName}</td>
//                           <td className="px-4 py-3">
//                             <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                               {item.grade}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">{item.quantity}</td>
//                           <td className="px-4 py-3">{formatCurrency(item.pricePerUnit)}</td>
//                           <td className="px-4 py-3 font-bold">{formatCurrency(item.totalAmount)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-50">
//                       <tr>
//                         <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
//                         <td className="px-4 py-3 font-bold text-green-700">
//                           {formatCurrency(calculateOrderTotal(currentOrder))}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               {currentOrder.transporterDetails && (
//                 <div className="border border-gray-200 rounded p-4">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTruck className="text-orange-600" />
//                     Transporter Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Name:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.transporterName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Vehicle:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleType}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Number:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Driver:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.driverName || 'N/A'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Accepted:</span>
//                           <span className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Capacity:</span>
//                           <span className="font-medium">{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dialog Footer */}
//           <div className="mt-6 pt-6 border-t flex flex-wrap justify-end gap-3">
//             <button
//               onClick={() => setDetailsDialogOpen(false)}
//               className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Close
//             </button>
//             {currentOrder?.traderToAdminPayment && (
//               <button
//                 onClick={() => generateTraderInvoice(currentOrder)}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
//               >
//                 <FaFileInvoiceDollar />
//                 Trader Invoice
//               </button>
//             )}
//             {currentOrder?.adminToFarmerPayment && (
//               <button
//                 onClick={() => generateFarmerInvoice(currentOrder)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
//               >
//                 <FaReceipt />
//                 Farmer Invoice
//               </button>
//             )}
//           </div>
//         </div>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//               <FaTrash className="h-6 w-6 text-red-600" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Delete Order {currentOrder?.orderId}?
//             </h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setDeleteDialogOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteOrder}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Verification Dialog */}
//       <Dialog
//         open={verificationDialogOpen}
//         onClose={() => setVerificationDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b">
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <FaCheck className="text-purple-600" />
//               Verification: {currentOrder?.orderId}
//             </h2>
//             <button
//               onClick={() => setVerificationDialogOpen(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={24} />
//             </button>
//           </div>

//           {currentOrder && currentOrder.transporterDetails && (
//             <div className="space-y-6">
//               {/* Verification Checks */}
//               <div className="space-y-4">
//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="transporterReached"
//                     checked={verificationData.transporterReached}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         transporterReached: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="transporterReached" className="ml-3">
//                     <div className="font-medium">Transporter Reached Destination</div>
//                     <div className="text-sm text-gray-500">Confirm arrival at delivery location</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="goodsConditionCorrect"
//                     checked={verificationData.goodsConditionCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         goodsConditionCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="goodsConditionCorrect" className="ml-3">
//                     <div className="font-medium">Goods Condition is Correct</div>
//                     <div className="text-sm text-gray-500">Verify goods are in good condition</div>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     id="quantityCorrect"
//                     checked={verificationData.quantityCorrect}
//                     onChange={(e) =>
//                       setVerificationData({
//                         ...verificationData,
//                         quantityCorrect: e.target.checked,
//                       })
//                     }
//                     className="h-5 w-5 text-blue-600 rounded"
//                   />
//                   <label htmlFor="quantityCorrect" className="ml-3">
//                     <div className="font-medium">Quantity is Correct</div>
//                     <div className="text-sm text-gray-500">Confirm delivered quantity matches order</div>
//                   </label>
//                 </div>
//               </div>

//               {/* Admin Notes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Admin Notes
//                 </label>
//                 <textarea
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
//                   value={verificationData.adminNotes}
//                   onChange={(e) =>
//                     setVerificationData({
//                       ...verificationData,
//                       adminNotes: e.target.value,
//                     })
//                   }
//                   placeholder="Add any notes or observations..."
//                 />
//               </div>

//               {/* Previous Verification Info */}
//               {currentOrder.transporterDetails.verifiedAt && (
//                 <div className="p-4 bg-blue-50 rounded">
//                   <div className="text-sm text-blue-700">
//                     Last verified by{' '}
//                     <span className="font-bold">
//                       {currentOrder.transporterDetails.verifiedByName || 'Admin'}
//                     </span>{' '}
//                     on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   onClick={() => setVerificationDialogOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveVerification}
//                   className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
//                 >
//                   <FaSave />
//                   Save Verification
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Dialog>

//       {/* External Modals */}
//       <AdminFarmerPaymentModal />
//       <OrderEditModal />
//     </>
//   );
// };

// export default AdminOrdersRedesign;












 
 
 
 
 
 
 'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Dialog, Pagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaUser,
  FaStore,
  FaTruck,
  FaReceipt,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaCopy,
  FaTimes,
  FaSave,
  FaBox,
  FaCheck,
  FaBoxes,
  FaFileCsv,
  FaChevronDown,
  FaChevronUp,
  FaFileInvoiceDollar,
  FaSpinner,
  FaExclamationCircle,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileInvoice,
  FaUserTie,
  FaWeightHanging
} from 'react-icons/fa';
import { AiOutlineClose, AiOutlineFileSearch } from 'react-icons/ai';
import toast from 'react-hot-toast';
import AdminFarmerPaymentModal from '../FarmerPaymentModal/page';
import OrderEditModal from '../OrderEditModal/page';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

// Define the interface for farmer payment modal data
export interface FarmerPaymentModalData {
  orderId: string;
  farmerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  onPaymentSuccess?: () => void;
}

// Declare global window properties
declare global {
  interface Window {
    openEditOrderModal?: (orderId: string) => void;
    openFarmerPaymentModal?: (data: FarmerPaymentModalData) => void;
  }
}

// Interfaces
interface MarketDetails {
  marketName: string;
  pincode: string;
  postOffice?: string;
  district?: string;
  state?: string;
  exactAddress: string;
  landmark?: string;
}

interface ProductItem {
  productId: string;
  productName: string;
  grade: string;
  quantity: number;
  deliveryDate: string;
  nearestMarket: string;
  marketDetails: MarketDetails | null;
  pricePerUnit: number;
  totalAmount: number;
}

interface PaymentRecord {
  amount: number;
  paidDate: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
}

interface PaymentDetails {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentHistory: PaymentRecord[];
}

interface TransporterDetails {
  transporterId: string;
  transporterName: string;
  transporterMobile?: string;
  transporterEmail?: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity?: string;
  driverName?: string;
  driverMobile?: string;
  acceptedAt: string;
  transporterReached?: boolean;
  goodsConditionCorrect?: boolean;
  quantityCorrect?: boolean;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
}

interface Order {
  _id: string;
  orderId: string;
  traderName: string;
  traderMobile?: string;
  traderEmail?: string;
  traderId?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerEmail?: string;
  farmerId?: string;
  productItems: ProductItem[];
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  traderToAdminPayment?: PaymentDetails;
  adminToFarmerPayment?: PaymentDetails;
  createdAt: string;
}

interface FarmerDetails {
  farmerId: string;
  personalInfo: {
    taluk: string;
    name: string;
    mobileNo: string;
    email: string;
  };
}

interface TraderDetails {
  traderId: string;
  personalInfo: {
    taluk: string;
    name: string;
    mobileNo: string;
    email: string;
  };
}

const AdminOrdersRedesign: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // New state for farmer/trader details and expanded order info
  const [farmerDetails, setFarmerDetails] = useState<{[key: string]: FarmerDetails}>({});
  const [traderDetails, setTraderDetails] = useState<{[key: string]: TraderDetails}>({});
  const [expandedOrderDetails, setExpandedOrderDetails] = useState<{[key: string]: boolean}>({});
  
  // State for dialog details
  const [dialogFarmerDetails, setDialogFarmerDetails] = useState<FarmerDetails | null>(null);
  const [dialogTraderDetails, setDialogTraderDetails] = useState<TraderDetails | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Mobile view state
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Verification state
  const [verificationData, setVerificationData] = useState({
    transporterReached: false,
    goodsConditionCorrect: false,
    quantityCorrect: false,
    adminNotes: '',
  });

  const API_BASE = 'https://kisan.etpl.ai/api/admin';
  const tableRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{role: string, taluka: string}>();

  // Cache for farmer and trader details to reduce API calls
  const [detailsCache, setDetailsCache] = useState<{
    farmers: {[key: string]: FarmerDetails},
    traders: {[key: string]: TraderDetails}
  }>({ farmers: {}, traders: {} });

  // Fetch user session on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const session = await getAdminSessionAction();
      if (session?.admin) {
        setUser(session.admin);
      }
    };
    fetchUser();
  }, []);

  // Fetch farmer details by ID
  const fetchFarmerDetails = async (farmerId: string): Promise<FarmerDetails | null> => {
    if (!farmerId || farmerId === 'undefined') return null;
    
    // Check cache first
    if (detailsCache.farmers[farmerId]) {
      return detailsCache.farmers[farmerId];
    }
    
    try {
      const response = await fetch(`/api/farmers?search=${farmerId}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const farmerData = data.data[0];
        const farmerDetail = {
          farmerId: farmerData.farmerId || farmerId,
          personalInfo: {
            taluk: farmerData.personalInfo?.taluk || '',
            name: farmerData.personalInfo?.name || '',
            mobileNo: farmerData.personalInfo?.mobileNo || '',
            email: farmerData.personalInfo?.email || ''
          }
        };
        
        // Update cache
        setDetailsCache(prev => ({
          ...prev,
          farmers: { ...prev.farmers, [farmerId]: farmerDetail }
        }));
        
        return farmerDetail;
      }
      return null;
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      return null;
    }
  };

  // Fetch trader details by ID
  const fetchTraderDetails = async (traderId: string): Promise<TraderDetails | null> => {
    if (!traderId || traderId === 'undefined') return null;
    
    // Check cache first
    if (detailsCache.traders[traderId]) {
      return detailsCache.traders[traderId];
    }
    
    try {
      // Note: You need to update this to your actual traders API endpoint
      const response = await fetch(`/api/farmers?search=${traderId}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const traderData = data.data[0];
        const traderDetail = {
          traderId: traderData.traderId || traderId,
          personalInfo: {
            taluk: traderData.personalInfo?.taluk || traderData.taluk || '',
            name: traderData.personalInfo?.name || traderData.name || '',
            mobileNo: traderData.personalInfo?.mobileNo || traderData.mobile || '',
            email: traderData.personalInfo?.email || traderData.email || ''
          }
        };
        
        // Update cache
        setDetailsCache(prev => ({
          ...prev,
          traders: { ...prev.traders, [traderId]: traderDetail }
        }));
        
        return traderDetail;
      }
      return null;
    } catch (error) {
      console.error('Error fetching trader details:', error);
      return null;
    }
  };

  // Fetch all farmer and trader details for orders
  const fetchAllDetailsForOrders = async (orders: Order[]) => {
    const farmerIds = [...new Set(orders.map(order => order.farmerId).filter(Boolean))] as string[];
    const traderIds = [...new Set(orders.map(order => order.traderId).filter(Boolean))] as string[];
    
    const farmerDetailsMap: {[key: string]: FarmerDetails} = {};
    const traderDetailsMap: {[key: string]: TraderDetails} = {};
    
    // Fetch farmer details in parallel
    const farmerPromises = farmerIds.map(async (farmerId) => {
      const details = await fetchFarmerDetails(farmerId);
      if (details) {
        farmerDetailsMap[farmerId] = details;
      }
    });
    
    // Fetch trader details in parallel
    const traderPromises = traderIds.map(async (traderId) => {
      const details = await fetchTraderDetails(traderId);
      if (details) {
        traderDetailsMap[traderId] = details;
      }
    });
    
    await Promise.all([...farmerPromises, ...traderPromises]);
    
    return { farmerDetailsMap, traderDetailsMap };
  };

  // Fetch all orders with taluka filtering for subadmin
  const fetchOrders = useCallback(async () => {
    setLoading(true);

    let url = `${API_BASE}/orders`;
    
    // Add filters to URL if present
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (transporterStatusFilter) params.append('transporterStatus', transporterStatusFilter);
    if (searchInput) params.append('search', searchInput);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        let orders = data.data || [];
        
        // If user is subadmin, filter orders by taluka
        if (user?.role === 'subadmin' && user?.taluka) {
          const { farmerDetailsMap, traderDetailsMap } = await fetchAllDetailsForOrders(orders);
          
          const filtered = orders.filter((order:any) => {
            // Check farmer taluka
            if (order.farmerId && farmerDetailsMap[order.farmerId]) {
              if (farmerDetailsMap[order.farmerId].personalInfo.taluk === user.taluka) {
                return true;
              }
            }
            
            // Check trader taluka
            if (order.traderId && traderDetailsMap[order.traderId]) {
              if (traderDetailsMap[order.traderId].personalInfo.taluk === user.taluka) {
                return true;
              }
            }
            
            return false;
          });
          
          setAllOrders(filtered);
          setFarmerDetails(farmerDetailsMap);
          setTraderDetails(traderDetailsMap);
          setTotalItems(filtered.length);
          
          // Fetch details for filtered orders
          const filteredDetails = await fetchAllDetailsForOrders(filtered);
          setFarmerDetails(filteredDetails.farmerDetailsMap);
          setTraderDetails(filteredDetails.traderDetailsMap);
          
        } else {
          // For admin users, show all orders and fetch all details
          setAllOrders(orders);
          setTotalItems(orders.length);
          
          const { farmerDetailsMap, traderDetailsMap } = await fetchAllDetailsForOrders(orders);
          setFarmerDetails(farmerDetailsMap);
          setTraderDetails(traderDetailsMap);
        }
        
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, transporterStatusFilter, searchInput, user]);

  // Fetch orders when user or filters change
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [fetchOrders, user]);

  // Apply pagination to displayed orders
  useEffect(() => {
    if (allOrders.length === 0) {
      setDisplayedOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    // Calculate total pages
    const totalPagesCount = Math.ceil(allOrders.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    // Ensure current page is valid
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Get orders for current page
    const ordersForPage = allOrders.slice(startIndex, endIndex);
    setDisplayedOrders(ordersForPage);
    
  }, [allOrders, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top of table on page change
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
    const endItem = Math.min(currentPage * itemsPerPage, allOrders.length);
    return { startItem, endItem };
  };

  // Status badge configuration
  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bg: string; icon: any } } = {
      pending: { color: 'text-yellow-800', bg: 'bg-yellow-100', icon: FaExclamationCircle },
      processing: { color: 'text-blue-800', bg: 'bg-blue-100', icon: FaSpinner },
      in_transit: { color: 'text-indigo-800', bg: 'bg-indigo-100', icon: FaTruck },
      completed: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
      cancelled: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
      accepted: { color: 'text-green-800', bg: 'bg-green-100', icon: FaCheckCircle },
      rejected: { color: 'text-red-800', bg: 'bg-red-100', icon: FaTimesCircle },
      partial: { color: 'text-orange-800', bg: 'bg-orange-100', icon: FaExclamationCircle },
      paid: { color: 'text-emerald-800', bg: 'bg-emerald-100', icon: FaCheckCircle },
    };
    
    return statusConfig[status] || { color: 'text-gray-800', bg: 'bg-gray-100', icon: FaExclamationCircle };
  };

  // Get farmer details for an order
  const getFarmerDetails = (order: Order) => {
    if (!order.farmerId) return null;
    return farmerDetails[order.farmerId];
  };

  // Get trader details for an order
  const getTraderDetails = (order: Order) => {
    if (!order.traderId) return null;
    return traderDetails[order.traderId];
  };

  // Get farmer taluka
  const getFarmerTaluka = (order: Order) => {
    const details = getFarmerDetails(order);
    return details?.personalInfo?.taluk || 'N/A';
  };

  // Get trader taluka
  const getTraderTaluka = (order: Order) => {
    const details = getTraderDetails(order);
    return details?.personalInfo?.taluk || 'N/A';
  };

  // Get farmer mobile
  const getFarmerMobile = (order: Order) => {
    const details = getFarmerDetails(order);
    return details?.personalInfo?.mobileNo || order.farmerMobile || 'N/A';
  };

  // Get trader mobile
  const getTraderMobile = (order: Order) => {
    const details = getTraderDetails(order);
    return details?.personalInfo?.mobileNo || order.traderMobile || 'N/A';
  };

  // Get farmer email
  const getFarmerEmail = (order: Order) => {
    const details = getFarmerDetails(order);
    return details?.personalInfo?.email || order.farmerEmail || 'N/A';
  };

  // Get trader email
  const getTraderEmail = (order: Order) => {
    const details = getTraderDetails(order);
    return details?.personalInfo?.email || order.traderEmail || 'N/A';
  };

  // Toggle expanded order details
  const toggleExpandedDetails = (orderId: string) => {
    setExpandedOrderDetails(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Invoice generation functions
  const generateFarmerInvoice = (order: Order) => {
    if (!order || !order.adminToFarmerPayment) {
      toast.error('No farmer payment details available');
      return;
    }

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Farmer Payment</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { color: #198754; font-size: 28px; font-weight: bold; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #198754; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="invoice-title">FARMER PAYMENT INVOICE</div>
        </div>
        
        <div>
            <p><strong>Invoice Number:</strong> ${order.orderId}-FARMER</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
            <p><strong>Trader Name:</strong> ${order.traderName}</p>
            <p><strong>Payment Status:</strong> ${order.adminToFarmerPayment.paymentStatus.toUpperCase()}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Grade</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${order.productItems.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.grade}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.pricePerUnit)}</td>
                    <td>${formatCurrency(item.totalAmount)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <p><strong>Total Product Value:</strong> ${formatCurrency(order.adminToFarmerPayment.totalAmount)}</p>
            <p><strong>Paid Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.paidAmount)}</p>
            <p><strong>Remaining Amount:</strong> ${formatCurrency(order.adminToFarmerPayment.remainingAmount)}</p>
            <p style="font-size: 18px; font-weight: bold; color: #198754;">
                TOTAL PAYABLE TO FARMER: ${formatCurrency(order.adminToFarmerPayment.totalAmount)}
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
            <p>Invoice generated on: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Farmer_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Farmer invoice generated for order: ${order.orderId}`);
  };

  const generateTraderInvoice = (order: Order) => {
    if (!order || !order.traderToAdminPayment) {
      toast.error('No trader payment details available');
      return;
    }

    const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Trader Payment</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { color: #0d6efd; font-size: 28px; font-weight: bold; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #0d6efd; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { background: #e9ecef; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-name">KISAN TRADING</div>
            <div class="invoice-title">TRADER PAYMENT INVOICE</div>
        </div>
        
        <div>
            <p><strong>Invoice Number:</strong> ${order.orderId}-TRADER</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Trader Name:</strong> ${order.traderName}</p>
            <p><strong>Farmer Name:</strong> ${order.farmerName || 'N/A'}</p>
            <p><strong>Payment Status:</strong> ${order.traderToAdminPayment.paymentStatus.toUpperCase()}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Grade</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${order.productItems.map(item => `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.grade}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.pricePerUnit)}</td>
                    <td>${formatCurrency(item.totalAmount)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <p><strong>Total Product Value:</strong> ${formatCurrency(order.traderToAdminPayment.totalAmount)}</p>
            <p><strong>Paid Amount:</strong> ${formatCurrency(order.traderToAdminPayment.paidAmount)}</p>
            <p><strong>Remaining Amount:</strong> ${formatCurrency(order.traderToAdminPayment.remainingAmount)}</p>
            <p style="font-size: 18px; font-weight: bold; color: #0d6efd;">
                TOTAL PAYABLE BY TRADER: ${formatCurrency(order.traderToAdminPayment.totalAmount)}
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>This is a computer generated invoice. No signature required.</p>
            <p>KISAN TRADING • Agricultural Produce Trading Platform</p>
            <p>Invoice generated on: ${new Date().toLocaleString()}</p>
        </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trader_Invoice_${order.orderId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Trader invoice generated for order: ${order.orderId}`);
  };

  // Export functions
  const handleCopyToClipboard = async () => {
    const headers = ["Order ID", "Date", "Trader", "Farmer", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
    // Create separator line
    const separator = "─".repeat(100);
    
    // Format each cell with padding
    const formatCell = (value:any) => {
      const strValue = String(value || "");
      return strValue.padEnd(15).substring(0, 15);
    };
    
    const tableContent = [
      // Headers row
      headers.map(header => formatCell(header)).join(" │ "),
      separator,
      
      // Data rows
      ...allOrders.map((order) => {
        const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
        const verificationStatus = getVerificationStatus(order);
        
        return [
          formatCell(order.orderId),
          formatCell(new Date(order.createdAt).toLocaleDateString()),
          formatCell(order.traderName),
          formatCell(order.farmerName || "N/A"),
          formatCell(order.productItems.length),
          formatCell(totalAmount),
          formatCell(order.orderStatus),
          formatCell(verificationStatus),
          formatCell(order.traderToAdminPayment?.paymentStatus || "N/A"),
          formatCell(order.adminToFarmerPayment?.paymentStatus || "N/A")
        ].join(" │ ");
      })
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success("Orders copied to clipboard in table format!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = allOrders.map((order) => {
      const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const verificationStatus = getVerificationStatus(order);
      return {
        "Order ID": order.orderId,
        "Date": new Date(order.createdAt).toLocaleDateString(),
        "Trader Name": order.traderName,
        "Trader Mobile": getTraderMobile(order),
        "Trader Taluk": getTraderTaluka(order),
        "Farmer Name": order.farmerName || "N/A",
        "Farmer Mobile": getFarmerMobile(order),
        "Farmer Taluk": getFarmerTaluka(order),
        "Items Count": order.productItems.length,
        "Total Quantity": order.productItems.reduce((sum, item) => sum + item.quantity, 0),
        "Total Amount": totalAmount,
        "Order Status": order.orderStatus,
        "Verification Status": verificationStatus,
        "Transporter Status": order.transporterStatus || "N/A",
        "Trader Payment Status": order.traderToAdminPayment?.paymentStatus || "N/A",
        "Trader Paid Amount": order.traderToAdminPayment?.paidAmount || 0,
        "Farmer Payment Status": order.adminToFarmerPayment?.paymentStatus || "N/A",
        "Farmer Paid Amount": order.adminToFarmerPayment?.paidAmount || 0,
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file exported!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Trader", "Trader Taluk", "Trader Mobile", "Farmer", "Farmer Taluk", "Farmer Mobile", "Items", "Total Amount", "Order Status", "Verification", "Trader Payment", "Farmer Payment"];
    
    const csvContent = [
      headers.join(","),
      ...allOrders.map((order) => {
        const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
        const verificationStatus = getVerificationStatus(order);
        return [
          `"${order.orderId}"`,
          `"${new Date(order.createdAt).toLocaleDateString()}"`,
          `"${order.traderName}"`,
          `"${getTraderTaluka(order)}"`,
          `"${getTraderMobile(order)}"`,
          `"${order.farmerName || "N/A"}"`,
          `"${getFarmerTaluka(order)}"`,
          `"${getFarmerMobile(order)}"`,
          order.productItems.length,
          totalAmount,
          `"${order.orderStatus}"`,
          `"${verificationStatus}"`,
          `"${order.traderToAdminPayment?.paymentStatus || "N/A"}"`,
          `"${order.adminToFarmerPayment?.paymentStatus || "N/A"}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file exported!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Management Report", 14, 16);
    
    const tableColumn = ["Order ID", "Trader", "Trader Taluk", "Trader Mobile", "Farmer", "Farmer Taluk", "Farmer Mobile", "Items", "Total Amount", "Status", "Verification"];
    const tableRows: any = allOrders.map((order) => {
      const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const verificationStatus = getVerificationStatus(order);
      return [
        order.orderId,
        order.traderName,
        getTraderTaluka(order),
        getTraderMobile(order),
        order.farmerName || "N/A",
        getFarmerTaluka(order),
        getFarmerMobile(order),
        order.productItems.length,
        `₹${totalAmount}`,
        order.orderStatus,
        verificationStatus
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`);
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
          h1 { color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f3f4f6; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          @media print { @page { size: landscape; } }
        </style>
      </head>
      <body>
        <h1>Orders Management Report</h1>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Trader</th>
              <th>Trader Taluk</th>
              <th>Trader Mobile</th>
              <th>Farmer</th>
              <th>Farmer Taluk</th>
              <th>Farmer Mobile</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.map((order) => {
              const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
              const verificationStatus = getVerificationStatus(order);
              return `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.traderName}</td>
                  <td>${getTraderTaluka(order)}</td>
                  <td>${getTraderMobile(order)}</td>
                  <td>${order.farmerName || "N/A"}</td>
                  <td>${getFarmerTaluka(order)}</td>
                  <td>${getFarmerMobile(order)}</td>
                  <td>${order.productItems.length}</td>
                  <td>₹${totalAmount}</td>
                  <td>${order.orderStatus}</td>
                  <td>${verificationStatus}</td>
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
    toast.success("Printing orders...");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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

  // Get verification status
  const getVerificationStatus = (order: Order) => {
    const details = order.transporterDetails;
    
    if (!details) {
      return 'Not Available';
    }
    
    const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
    if (transporterReached && goodsConditionCorrect && quantityCorrect) {
      return 'Verified';
    } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
      return 'Partial';
    } else if (details.verifiedAt) {
      return 'Pending';
    } else {
      return 'Not Verified';
    }
  };

  // Get verification color
  const getVerificationColor = (order: Order) => {
    const details = order.transporterDetails;
    
    if (!details) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    const { transporterReached, goodsConditionCorrect, quantityCorrect } = details;
    
    if (transporterReached && goodsConditionCorrect && quantityCorrect) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (transporterReached || goodsConditionCorrect || quantityCorrect) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (details.verifiedAt) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Open details dialog with enhanced information
  const openDetailsDialog = async (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    
    // Reset dialog details
    setDialogFarmerDetails(null);
    setDialogTraderDetails(null);
    
    // Fetch farmer details for dialog
    if (order.farmerId) {
      try {
        const farmerDetail = await fetchFarmerDetails(order.farmerId);
        if (farmerDetail) {
          setDialogFarmerDetails(farmerDetail);
        }
      } catch (error) {
        console.error('Error fetching farmer details for dialog:', error);
      }
    }
    
    // Fetch trader details for dialog
    if (order.traderId) {
      try {
        const traderDetail = await fetchTraderDetails(order.traderId);
        if (traderDetail) {
          setDialogTraderDetails(traderDetail);
        }
      } catch (error) {
        console.error('Error fetching trader details for dialog:', error);
      }
    }
    
    setDetailsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (order: Order) => {
    if (window.openEditOrderModal) {
      window.openEditOrderModal(order.orderId);
    }
  };

  // Open verification dialog
  const openVerificationDialog = (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    setVerificationDialogOpen(true);
  };

  // Open farmer payment modal
  const openFarmerPaymentModal = (order: Order) => {
    if (window.openFarmerPaymentModal && order.adminToFarmerPayment) {
      window.openFarmerPaymentModal({
        orderId: order.orderId,
        farmerName: order.farmerName || 'N/A',
        totalAmount: order.adminToFarmerPayment.totalAmount,
        paidAmount: order.adminToFarmerPayment.paidAmount,
        remainingAmount: order.adminToFarmerPayment.remainingAmount,
        onPaymentSuccess: fetchOrders
      });
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!currentOrder) return;
    
    try {
      const response = await fetch(`/api/order/${currentOrder._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();

      if (result.success) {
        toast.success('Order deleted successfully!');
        setDeleteDialogOpen(false);
        fetchOrders();
      } else {
        toast.error(result.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting order');
    }
  };

  // Save verification
  const saveVerification = async () => {
    if (!currentOrder || !currentOrder.transporterDetails) {
      toast.error('No transporter details available');
      return;
    }

    const adminId = localStorage.getItem('adminId') || 'admin-001';
    const adminName = localStorage.getItem('userName') || 'Admin';

    const data = {
      ...verificationData,
      adminId,
      adminName,
      verificationDate: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Verification updated successfully!');
        setVerificationDialogOpen(false);
        fetchOrders();
      } else {
        toast.error('Failed to update verification');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating verification');
    }
  };

  // Calculate order total
  const calculateOrderTotal = (order: Order) => {
    return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  // Toggle mobile card expansion
  const toggleMobileCard = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Calculate payment percentage
  const getPaymentPercentage = (paid: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  if (loading && allOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const { startItem, endItem } = getPaginationRange();

  return (
    <>
      <div className="min-h-screen xl:w-[83vw] lg:w-[75vw] overflow-x-scroll bg-gray-50 p-4">
        {/* Header with user role info */}
        <div className="lg:mb-0 mb-3">
          <div className="flex justify-between flex-wrap gap-y-2 items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaShoppingCart className="text-blue-600" />
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">Manage and monitor all marketplace orders</p>
            </div>
            {user && (
              <div className="bg-blue-50 px-3 sm:block hidden  py-2 rounded border border-blue-200">
                <div className="text-sm text-blue-700 font-medium">
                  Logged in as: <span className="font-bold capitalize">{user.role}</span>
                  {user.role === 'subadmin' && (
                    <div className="text-xs text-blue-600 mt-1">
                      Taluka: <span className="font-semibold">{user.taluka}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Buttons - Desktop */}
        <div className="hidden lg:flex justify-end ml-auto flex-wrap gap-2 p-3 rounded mb-1">
          {[
            { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
            { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
            { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
            { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
            { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
            >
              <btn.icon className="text-sm" />
            </button>
          ))}
        </div>

        {/* Export Buttons - Mobile */}
        <div className="lg:hidden flex flex-wrap gap-2 mb-3">
          {[
            { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
            { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
            { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
            { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
            { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`flex items-center justify-center gap-1 p-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium flex-1 min-w-[60px]`}
            >
              <btn.icon className="text-sm" />
            </button>
          ))}
        </div>

        {/* Stats Cards */}
       {
        user?.role=="admin"&&<>
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
          <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
              </div>
              <FaShoppingCart className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allOrders.filter(o => o.orderStatus === 'completed').length}
                </p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allOrders.filter(o => o.orderStatus === 'pending').length}
                </p>
              </div>
              <FaTimesCircle className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(allOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0))}
                </p>
              </div>
              <FaRupeeSign className="text-purple-500 text-2xl" />
            </div>
          </div>
        </div>

        </>
       }
        {/* Filters */}
        <div className="bg-white rounded shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search orders..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
               { searchInput.length >0 &&<AiOutlineClose onClick={()=>setSearchInput("")} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-5 h-5" />}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none  bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Order Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Transporter Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTruck className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500  outline-none bg-white"
                value={transporterStatusFilter}
                onChange={(e) => setTransporterStatusFilter(e.target.value)}
              >
                <option value="">All Transporter Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex xl:gap-2 gap-1 overflow-x-scroll">
              <button
                onClick={fetchOrders}
                className="flex-1  w-fit flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <FaSearch />
                Search
              </button>
              <button
                onClick={() => {
                  setStatusFilter('');
                  setTransporterStatusFilter('');
                  setSearchInput('');
                  setCurrentPage(1);
                }}
                className="flex-1 flex w-fit items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader (Taluk)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer (Taluk)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedOrders.map((order) => {
                  const farmerTaluk = getFarmerTaluka(order);
                  const traderTaluk = getTraderTaluka(order);
                  const isExpanded = expandedOrderDetails[order._id];
                  
                  return (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        {/* Order ID */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-blue-600">{order.orderId}</div>
                            <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                          </div>
                        </td>

                        {/* Trader with Taluk */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{order.traderName}</div>
                              <div className="text-xs text-gray-500 truncate">
                                <span className="font-medium">Taluk:</span> {traderTaluk}
                              </div>
                              {getTraderMobile(order) !== 'N/A' && (
                                <div className="text-xs text-gray-500 truncate">
                                  <span className="font-medium">Mobile:</span> {getTraderMobile(order)}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => toggleExpandedDetails(order._id)}
                              className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                              title={isExpanded ? "Show less" : "Show more"}
                            >
                              {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                            </button>
                          </div>
                        </td>

                        {/* Farmer with Taluk */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{order.farmerName || 'N/A'}</div>
                              <div className="text-xs text-gray-500 truncate">
                                <span className="font-medium">Taluk:</span> {farmerTaluk}
                              </div>
                              {getFarmerMobile(order) !== 'N/A' && (
                                <div className="text-xs text-gray-500 truncate">
                                  <span className="font-medium">Mobile:</span> {getFarmerMobile(order)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Products */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBox className="text-gray-400 mr-2 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900">{order.productItems.length} items</div>
                              <div className="text-xs text-gray-500">
                                {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700">
                            <FaRupeeSign className="inline mr-1" />
                            {calculateOrderTotal(order).toLocaleString()}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
                            {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Verification Status */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
                            {getVerificationStatus(order)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openDetailsDialog(order)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => openEditDialog(order)}
                              className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors"
                              title="Edit Order"
                            >
                              <FaEdit />
                            </button>
                            {order.transporterDetails && (
                              <button
                                onClick={() => openVerificationDialog(order)}
                                className="text-purple-600 hover:text-purple-900 p-2 rounded hover:bg-purple-50 transition-colors"
                                title="Verification"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {/* INVOICE DOWNLOAD BUTTON */}
                            {order.traderToAdminPayment && (
                              <button
                                onClick={() => generateTraderInvoice(order)}
                                className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50 transition-colors"
                                title="Download Trader Invoice"
                              >
                                <FaFileInvoiceDollar />
                              </button>
                            )}
                            {order.adminToFarmerPayment && (
                              <button
                                onClick={() => generateFarmerInvoice(order)}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
                                title="Download Farmer Invoice"
                              >
                                <FaReceipt />
                              </button>
                            )}
                            {/* PAYMENT BUTTON */}
                            {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
                              <button
                                onClick={() => openFarmerPaymentModal(order)}
                                className="text-emerald-600 hover:text-emerald-900 p-2 rounded hover:bg-emerald-50 transition-colors"
                                title="Make Payment to Farmer"
                              >
                                <FaMoneyBillWave />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row with Additional Details */}
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <h4 className="font-semibold text-blue-700 mb-2">Trader Details</h4>
                                <div className="space-y-1">
                                  <div><span className="text-gray-600">ID:</span> <span className="font-medium">{order.traderId || 'N/A'}</span></div>
                                  <div><span className="text-gray-600">Taluk:</span> <span className="font-medium">{traderTaluk}</span></div>
                                  <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{getTraderMobile(order)}</span></div>
                                  <div><span className="text-gray-600">Email:</span> <span className="font-medium">{getTraderEmail(order)}</span></div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-blue-700 mb-2">Farmer Details</h4>
                                <div className="space-y-1">
                                  <div><span className="text-gray-600">ID:</span> <span className="font-medium">{order.farmerId || 'N/A'}</span></div>
                                  <div><span className="text-gray-600">Taluk:</span> <span className="font-medium">{farmerTaluk}</span></div>
                                  <div><span className="text-gray-600">Mobile:</span> <span className="font-medium">{getFarmerMobile(order)}</span></div>
                                  <div><span className="text-gray-600">Email:</span> <span className="font-medium">{getFarmerEmail(order)}</span></div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* No Orders State */}
          {allOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4 flex justify-center items-center">
                <AiOutlineFileSearch />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Mobile Cards (visible only on mobile) */}
        <div className="lg:hidden space-y-4">
          {displayedOrders.map((order) => {
            const farmerTaluk = getFarmerTaluka(order);
            const traderTaluk = getTraderTaluka(order);
            
            return (
              <div key={order._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-blue-600 truncate">{order.orderId}</div>
                    <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => openDetailsDialog(order)}
                      className="text-blue-600 p-1"
                      title="View Details"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => toggleMobileCard(order._id)}
                      className="text-gray-500 p-1"
                      title={expandedOrder === order._id ? "Show less" : "Show more"}
                    >
                      {expandedOrder === order._id ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Trader and Farmer Info in grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 font-medium mb-1">Trader</div>
                    <div className="font-medium text-sm truncate">{order.traderName}</div>
                    <div className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Taluk:</span> {traderTaluk}
                    </div>
                    {getTraderMobile(order) !== 'N/A' && (
                      <div className="text-xs text-gray-600 truncate">
                        <span className="font-medium">Mobile:</span> {getTraderMobile(order)}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 font-medium mb-1">Farmer</div>
                    <div className="font-medium text-sm truncate">{order.farmerName || 'N/A'}</div>
                    <div className="text-xs text-gray-600 truncate">
                      <span className="font-medium">Taluk:</span> {farmerTaluk}
                    </div>
                    {getFarmerMobile(order) !== 'N/A' && (
                      <div className="text-xs text-gray-600 truncate">
                        <span className="font-medium">Mobile:</span> {getFarmerMobile(order)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-500 font-medium mb-1">Products</div>
                    <div className="font-bold text-sm text-blue-700">
                      {order.productItems.length} items
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.productItems.reduce((sum, item) => sum + item.quantity, 0)} units
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-500 font-medium mb-1">Total Amount</div>
                    <div className="font-bold text-green-700 text-sm">
                      <FaRupeeSign className="inline mr-1" />
                      {calculateOrderTotal(order).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Status and Verification */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Order Status</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.orderStatus).bg} ${getStatusBadge(order.orderStatus).color}`}>
                      {React.createElement(getStatusBadge(order.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Verification</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVerificationColor(order)}`}>
                      {getVerificationStatus(order)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => openEditDialog(order)}
                    className="flex-1 min-w-[80px] bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <FaEdit size={12} />
                    Edit
                  </button>
                  
                  {order.transporterDetails && (
                    <button
                      onClick={() => openVerificationDialog(order)}
                      className="flex-1 min-w-[80px] bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <FaCheck size={12} />
                      Verify
                    </button>
                  )}
                  
                  {order.traderToAdminPayment && (
                    <button
                      onClick={() => generateTraderInvoice(order)}
                      className="flex-1 min-w-[80px] bg-yellow-100 text-yellow-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                      title="Trader Invoice"
                    >
                      <FaFileInvoiceDollar size={12} />
                      T. Invoice
                    </button>
                  )}
                  
                  {order.adminToFarmerPayment && order.adminToFarmerPayment.remainingAmount > 0 && (
                    <button
                      onClick={() => openFarmerPaymentModal(order)}
                      className="flex-1 min-w-[80px] bg-emerald-100 text-emerald-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                      title="Make Payment to Farmer"
                    >
                      <FaMoneyBillWave size={12} />
                      Pay Farmer
                    </button>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedOrder === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {/* Payment Information */}
                    <div className="space-y-3">
                      {order.traderToAdminPayment && (
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-xs text-gray-500 font-medium mb-1">Trader Payment</div>
                          <div className="text-sm font-medium">
                            Status: <span className="font-bold">{order.traderToAdminPayment.paymentStatus}</span>
                          </div>
                          <div className="text-sm">
                            Paid: <span className="font-bold text-green-700">
                              ₹{order.traderToAdminPayment.paidAmount.toLocaleString()}
                            </span>
                          </div>
                          {order.traderToAdminPayment.remainingAmount > 0 && (
                            <div className="text-xs text-red-600">
                              Remaining: ₹{order.traderToAdminPayment.remainingAmount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}

                      {order.adminToFarmerPayment && (
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-xs text-gray-500 font-medium mb-1">Farmer Payment</div>
                          <div className="text-sm font-medium">
                            Status: <span className="font-bold">{order.adminToFarmerPayment.paymentStatus}</span>
                          </div>
                          <div className="text-sm">
                            Paid: <span className="font-bold text-green-700">
                              ₹{order.adminToFarmerPayment.paidAmount.toLocaleString()}
                            </span>
                          </div>
                          {order.adminToFarmerPayment.remainingAmount > 0 && (
                            <div className="text-xs text-red-600">
                              Remaining: ₹{order.adminToFarmerPayment.remainingAmount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-500 font-medium mb-2">Additional Information</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Trader ID:</div>
                          <div className="font-medium truncate">{order.traderId || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Farmer ID:</div>
                          <div className="font-medium truncate">{order.farmerId || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Trader Email:</div>
                          <div className="font-medium truncate">{getTraderEmail(order)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Farmer Email:</div>
                          <div className="font-medium truncate">{getFarmerEmail(order)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {order.adminToFarmerPayment && (
                        <button
                          onClick={() => generateFarmerInvoice(order)}
                          className="flex-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <FaReceipt size={12} />
                          F. Invoice
                        </button>
                      )}
                      
                      <button
                        onClick={() => openDetailsDialog(order)}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <FaEye size={12} />
                        Full Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination and Limit Controls */}
        {allOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded shadow mt-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {allOrders.length} orders
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
      </div>

      {/* Order Details Dialog with Enhanced Information */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                Order Details: {currentOrder?.orderId}
              </h2>
              <p className="text-gray-600">Complete order information</p>
            </div>
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentOrder && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* User Role Info */}
              {user && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-800">
                        Viewing as: <span className="font-bold capitalize">{user.role}</span>
                      </div>
                      {user.role === 'subadmin' && (
                        <div className="text-sm text-blue-600 mt-1">
                          Showing orders from your taluka: <span className="font-semibold">{user.taluka}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-blue-600 text-right">
                      <div>Farmer Taluk: <span className="font-medium">{dialogFarmerDetails?.personalInfo?.taluk || 'N/A'}</span></div>
                      <div>Trader Taluk: <span className="font-medium">{dialogTraderDetails?.personalInfo?.taluk || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Farmer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentOrder.farmerName || dialogFarmerDetails?.personalInfo?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{currentOrder.farmerId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taluk:</span>
                      <span className="font-medium">{dialogFarmerDetails?.personalInfo?.taluk || 'Loading...'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{dialogFarmerDetails?.personalInfo?.mobileNo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{dialogFarmerDetails?.personalInfo?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaStore className="text-green-600" />
                    Trader Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentOrder.traderName || dialogTraderDetails?.personalInfo?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{currentOrder.traderId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taluk:</span>
                      <span className="font-medium">{dialogTraderDetails?.personalInfo?.taluk || 'Loading...'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{dialogTraderDetails?.personalInfo?.mobileNo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{dialogTraderDetails?.personalInfo?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.orderStatus).bg} ${getStatusBadge(currentOrder.orderStatus).color}`}>
                    {React.createElement(getStatusBadge(currentOrder.orderStatus).icon, { className: "h-3 w-3 mr-1" })}
                    {currentOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Transporter Status</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentOrder.transporterStatus || 'pending').bg} ${getStatusBadge(currentOrder.transporterStatus || 'pending').color}`}>
                    {React.createElement(getStatusBadge(currentOrder.transporterStatus || 'pending').icon, { className: "h-3 w-3 mr-1" })}
                    {currentOrder.transporterStatus || 'pending'}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Created</h4>
                  <p className="text-gray-700">{formatDateTime(currentOrder.createdAt)}</p>
                </div>
              </div>

              {/* Verification Status */}
              {currentOrder.transporterDetails && (
                <div className="border border-purple-200 rounded p-4">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
                    <FaCheck />
                    Verification Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.transporterReached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.transporterReached ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Transporter Reached</div>
                        <div className="text-sm text-gray-500">Destination arrival</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.goodsConditionCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.goodsConditionCorrect ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Goods Condition</div>
                        <div className="text-sm text-gray-500">Quality check</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${currentOrder.transporterDetails.quantityCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {currentOrder.transporterDetails.quantityCorrect ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <div className="font-medium">Quantity Correct</div>
                        <div className="text-sm text-gray-500">Amount verification</div>
                      </div>
                    </div>
                  </div>
                  {currentOrder.transporterDetails.verifiedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Verified by <span className="font-bold">{currentOrder.transporterDetails.verifiedByName || 'Admin'}</span> on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentOrder.traderToAdminPayment && (
                  <div className="border border-blue-200 rounded p-4">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Trader to Admin Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="font-bold text-green-600">{formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-bold text-red-600">{formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.traderToAdminPayment.paymentStatus).color}`}>
                          {currentOrder.traderToAdminPayment.paymentStatus}
                        </span>
                      </div>
                      {currentOrder.traderToAdminPayment.paymentHistory && currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
                          <div className="space-y-2">
                            {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
                                </span>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentOrder.adminToFarmerPayment && (
                  <div className="border border-green-200 rounded p-4">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">Admin to Farmer Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="font-bold text-green-600">{formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-bold text-red-600">{formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).bg} ${getStatusBadge(currentOrder.adminToFarmerPayment.paymentStatus).color}`}>
                          {currentOrder.adminToFarmerPayment.paymentStatus}
                        </span>
                      </div>
                      {currentOrder.adminToFarmerPayment.paymentHistory && currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Payment History:</p>
                          <div className="space-y-2">
                            {currentOrder.adminToFarmerPayment.paymentHistory.map((payment, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {formatDate(payment.paidDate)} - {payment.paymentMethod || 'Payment'}
                                </span>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {currentOrder.adminToFarmerPayment.remainingAmount > 0 && (
                      <button
                        onClick={() => {
                          setDetailsDialogOpen(false);
                          openFarmerPaymentModal(currentOrder);
                        }}
                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded hover:from-emerald-600 hover:to-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaMoneyBillWave />
                        Make Payment to Farmer
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Products Table */}
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaBoxes className="text-purple-600" />
                    Product Items ({currentOrder.productItems.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentOrder.productItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">{item.productName}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {item.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">{formatCurrency(item.pricePerUnit)}</td>
                          <td className="px-4 py-3 font-bold">{formatCurrency(item.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-bold">Total:</td>
                        <td className="px-4 py-3 font-bold text-green-700">
                          {formatCurrency(calculateOrderTotal(currentOrder))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Transporter Details */}
              {currentOrder.transporterDetails && (
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaTruck className="text-orange-600" />
                    Transporter Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.transporterName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.driverName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accepted:</span>
                          <span className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dialog Footer */}
          <div className="mt-6 pt-6 border-t flex flex-wrap justify-end gap-3">
            <button
              onClick={() => setDetailsDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {currentOrder?.traderToAdminPayment && (
              <button
                onClick={() => generateTraderInvoice(currentOrder)}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <FaFileInvoiceDollar />
                Trader Invoice
              </button>
            )}
            {currentOrder?.adminToFarmerPayment && (
              <button
                onClick={() => generateFarmerInvoice(currentOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaReceipt />
                Farmer Invoice
              </button>
            )}
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Order {currentOrder?.orderId}?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaCheck className="text-purple-600" />
              Verification: {currentOrder?.orderId}
            </h2>
            <button
              onClick={() => setVerificationDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {currentOrder && currentOrder.transporterDetails && (
            <div className="space-y-6">
              {/* Verification Checks */}
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id="transporterReached"
                    checked={verificationData.transporterReached}
                    onChange={(e) =>
                      setVerificationData({
                        ...verificationData,
                        transporterReached: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="transporterReached" className="ml-3">
                    <div className="font-medium">Transporter Reached Destination</div>
                    <div className="text-sm text-gray-500">Confirm arrival at delivery location</div>
                  </label>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id="goodsConditionCorrect"
                    checked={verificationData.goodsConditionCorrect}
                    onChange={(e) =>
                      setVerificationData({
                        ...verificationData,
                        goodsConditionCorrect: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="goodsConditionCorrect" className="ml-3">
                    <div className="font-medium">Goods Condition is Correct</div>
                    <div className="text-sm text-gray-500">Verify goods are in good condition</div>
                  </label>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id="quantityCorrect"
                    checked={verificationData.quantityCorrect}
                    onChange={(e) =>
                      setVerificationData({
                        ...verificationData,
                        quantityCorrect: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="quantityCorrect" className="ml-3">
                    <div className="font-medium">Quantity is Correct</div>
                    <div className="text-sm text-gray-500">Confirm delivered quantity matches order</div>
                  </label>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
                  value={verificationData.adminNotes}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      adminNotes: e.target.value,
                    })
                  }
                  placeholder="Add any notes or observations..."
                />
              </div>

              {/* Previous Verification Info */}
              {currentOrder.transporterDetails.verifiedAt && (
                <div className="p-4 bg-blue-50 rounded">
                  <div className="text-sm text-blue-700">
                    Last verified by{' '}
                    <span className="font-bold">
                      {currentOrder.transporterDetails.verifiedByName || 'Admin'}
                    </span>{' '}
                    on {formatDateTime(currentOrder.transporterDetails.verifiedAt)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setVerificationDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVerification}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  Save Verification
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* External Modals */}
      <AdminFarmerPaymentModal />
      <OrderEditModal />
    </>
  );
};

export default AdminOrdersRedesign;