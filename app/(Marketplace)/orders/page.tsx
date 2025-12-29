
// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaFilter,
//   FaTruck,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaPrint,
//   FaCheck,
//   FaUser,
//   FaStore,
//   FaCalendarAlt,
//   FaBoxes,
//   FaRupeeSign,
//   FaShoppingCart,
//   FaTags,
//   FaChevronDown,
//   FaChevronUp,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaCreditCard,
//   FaFileAlt,
//   FaPhone,
//   FaEnvelope,
//   FaInfoCircle
// } from "react-icons/fa";
// import {
//   Box,
//   Modal,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Pagination,
//   Chip,
// } from "@mui/material";
// import { utils, writeFile } from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { usePathname } from "next/navigation";
// import toast from "react-hot-toast";

// /* ================= TYPES BASED ON YOUR API RESPONSE ================= */

// interface ProductItem {
//   productId: string;
//   farmerId: string;
//   grade: string;
//   quantity: number;
//   pricePerUnit: number;
//   deliveryDate: string;
//   totalAmount: number;
//   _id: string;
// }

// interface PaymentHistoryItem {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId: string;
//   razorpayOrderId: string;
//   razorpaySignature: string;
//   _id: string;
// }

// interface TraderToAdminPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: "paid" | "pending";
//   paymentHistory: PaymentHistoryItem[];
// }

// interface AdminToFarmerPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: "paid" | "pending";
//   paymentHistory: PaymentHistoryItem[];
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile: string;
//   transporterEmail: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity: string;
//   driverName: string;
//   driverMobile: string;
//   acceptedAt: string;
//   adminNotes: string;
//   goodsConditionCorrect: boolean;
//   quantityCorrect: boolean;
//   transporterReached: boolean;
//   verifiedBy: string;
//   verifiedByName: string;
// }

// interface Order {
//   _id: string;
//   traderId: string;
//   traderName: string;
//   traderMobile: string;
//   traderEmail: string;
//   farmerId: string;
//   productItems: ProductItem[];
//   traderToAdminPayment: TraderToAdminPayment;
//   traderAcceptedStatus: boolean;
//   farmerAcceptedStatus: boolean;
//   orderStatus: string;
//   createdAt: string;
//   updatedAt: string;
//   orderId: string;
//   __v: number;
//   adminToFarmerPayment: AdminToFarmerPayment;
//   farmerName: string;
//   transporterDetails?: TransporterDetails;
//   transporterStatus?: string;
// }

// /* ================= MODAL STYLE ================= */

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "95%", sm: "90%", md: 800 },
//   maxHeight: "90vh",
//   overflowY: "auto",
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: { xs: 2, sm: 3, md: 4 },
// };

// /* ================= COMPONENT ================= */

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [search, setSearch] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("All");
//   const [orderStatus, setOrderStatus] = useState("All");
//   const [transporterStatus, setTransporterStatus] = useState("All");
//   const [date, setDate] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);

//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [limit, setLimit] = useState(10);
//   const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [expandedItems, setExpandedItems] = useState<string[]>([]);

//   const tableRef = useRef<HTMLDivElement | null>(null);
//   const pathname = usePathname();

//   /* ================= GET ORDERS ================= */

//   const getOrders = async () => {
//     setLoading(true);
//     try {
//       const params: any = {
//         search,
//         page,
//         limit,
//       };

//       // Add filters only if they're not "All"
//       if (paymentStatus !== "All") params.paymentStatus = paymentStatus;
//       if (orderStatus !== "All") params.orderStatus = orderStatus;
//       if (transporterStatus !== "All") params.transporterStatus = transporterStatus;
//       if (date) params.date = date;

//       const res = await axios.get("/api/order", { params });

//       if (res.data.success) {
//         setOrders(res.data.data || []);
//         setTotalPages(Math.ceil(res.data.total / limit) || 1);
//         setTotalOrders(res.data.total || 0);
//       } else {
//         setOrders([]);
//         setTotalOrders(0);
//         toast.error("Failed to load orders");
//       }

//       // Reset selection when data changes
//       setSelectedOrders([]);
//       setSelectAll(false);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Failed to load orders");
//       setOrders([]);
//       setTotalOrders(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getOrders();
//   }, [search, paymentStatus, orderStatus, transporterStatus, date, page, pathname, limit]);

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allOrderIds = orders.map(order => order._id);
//       setSelectedOrders(allOrderIds);
//       setSelectAll(true);
//     } else {
//       setSelectedOrders([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedOrders([...selectedOrders, id]);
//     } else {
//       setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ================= BULK DELETE ================= */

//   const handleBulkDelete = async () => {
//     if (selectedOrders.length === 0) {
//       toast.error("No orders selected");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post("/api/order/bulk-delete", {
//         ids: selectedOrders
//       });

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setSelectedOrders([]);
//         setSelectAll(false);
//         setBulkDeleteOpen(false);
//         getOrders();
//       } else {
//         toast.error("Failed to delete orders");
//       }
//     } catch (error: any) {
//       console.error("Bulk delete error:", error);
//       toast.error("Error deleting orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SINGLE UPDATE ================= */

//   const handleUpdate = async () => {
//     if (!currentOrder) return;
//     setLoading(true);
//     setEditOpen(false);

//     try {
//       await axios.put(`/api/order/${currentOrder._id}`, {
//         orderStatus: currentOrder.orderStatus,
//         transporterStatus: currentOrder.transporterStatus,
//         "traderToAdminPayment.paymentStatus": currentOrder.traderToAdminPayment.paymentStatus,
//         "adminToFarmerPayment.paymentStatus": currentOrder.adminToFarmerPayment.paymentStatus
//       });
//       toast.success("Order updated successfully");
//       getOrders();
//     } catch (error) {
//       toast.error("Failed to update order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SINGLE DELETE ================= */

//   const handleDelete = async () => {
//     if (!currentOrder) return;
//     setLoading(true);
//     setDeleteOpen(false);

//     try {
//       await axios.delete(`/api/order/${currentOrder._id}`);
//       toast.success("Order deleted successfully");
//       getOrders();
//     } catch (error) {
//       toast.error("Failed to delete order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const handleCopyToClipboard = async () => {
//     const headers = ["Sr.", "Order ID", "Date", "Farmer", "Trader", "Items Count", "Total Amount", "Trader Payment", "Farmer Payment", "Order Status"];

//     const csvContent = [
//       headers.join("\t"),
//       ...orders.map((order, index) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         return [
//           index + 1 + (page - 1) * limit,
//           order.orderId,
//           new Date(order.createdAt).toLocaleDateString(),
//           order.farmerName,
//           order.traderName,
//           order.productItems.length,
//           totalAmount,
//           order.traderToAdminPayment.paymentStatus,
//           order.adminToFarmerPayment.paymentStatus,
//           order.orderStatus,
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
//     const data = orders.map((order, index) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       return {
//         "Sr.": index + 1 + (page - 1) * limit,
//         "Order ID": order.orderId,
//         "Date": new Date(order.createdAt).toLocaleDateString(),
//         "Farmer ID": order.farmerId,
//         "Farmer Name": order.farmerName,
//         "Trader ID": order.traderId,
//         "Trader Name": order.traderName,
//         "Trader Mobile": order.traderMobile,
//         "Trader Email": order.traderEmail,
//         "Items Count": order.productItems.length,
//         "Total Amount": totalAmount,
//         "Trader Payment Status": order.traderToAdminPayment.paymentStatus,
//         "Trader Paid Amount": order.traderToAdminPayment.paidAmount,
//         "Trader Remaining Amount": order.traderToAdminPayment.remainingAmount,
//         "Farmer Payment Status": order.adminToFarmerPayment.paymentStatus,
//         "Farmer Paid Amount": order.adminToFarmerPayment.paidAmount,
//         "Farmer Remaining Amount": order.adminToFarmerPayment.remainingAmount,
//         "Order Status": order.orderStatus,
//         "Transporter Status": order.transporterStatus || "N/A",
//         "Trader Accepted": order.traderAcceptedStatus ? "Yes" : "No",
//         "Farmer Accepted": order.farmerAcceptedStatus ? "Yes" : "No",
//         "Created At": new Date(order.createdAt).toLocaleString(),
//         "Updated At": new Date(order.updatedAt).toLocaleString(),
//       };
//     });

//     const ws = utils.json_to_sheet(data);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, "Orders");
//     writeFile(wb, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const handleExportCSV = () => {
//     const headers = ["Sr.", "Order ID", "Date", "Farmer", "Trader", "Items Count", "Total Amount", "Trader Payment", "Farmer Payment", "Order Status"];

//     const csvContent = [
//       headers.join(","),
//       ...orders.map((order, index) => {
//         const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//         return [
//           index + 1 + (page - 1) * limit,
//           `"${order.orderId}"`,
//           `"${new Date(order.createdAt).toLocaleDateString()}"`,
//           `"${order.farmerName}"`,
//           `"${order.traderName}"`,
//           order.productItems.length,
//           totalAmount,
//           `"${order.traderToAdminPayment.paymentStatus}"`,
//           `"${order.adminToFarmerPayment.paymentStatus}"`,
//           `"${order.orderStatus}"`,
//         ].join(",");
//       })
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Orders Management Report", 14, 16);

//     const tableColumn = ["Sr.", "Order ID", "Farmer", "Trader", "Items", "Total Amount", "Trader Payment", "Farmer Payment"];
//     const tableRows: any = orders.map((order, index) => {
//       const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//       return [
//         index + 1 + (page - 1) * limit,
//         order.orderId,
//         order.farmerName,
//         order.traderName,
//         order.productItems.length,
//         `₹${totalAmount}`,
//         order.traderToAdminPayment.paymentStatus,
//         order.adminToFarmerPayment.paymentStatus
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
//   };

//   /* ================= PRINT FUNCTION ================= */

//   const handlePrint = () => {
//     if (orders.length === 0) {
//       alert("No orders to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       alert("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Orders Report</title>
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
//           .status-badge {
//             padding: 4px 10px;
//             border-radius: 12px;
//             font-size: 11px;
//             font-weight: 600;
//             display: inline-block;
//           }
//           .payment-paid {
//             background-color: #d1fae5;
//             color: #065f46;
//           }
//           .payment-pending {
//             background-color: #fef3c7;
//             color: #92400e;
//           }
//           .order-completed {
//             background-color: #d1fae5;
//             color: #065f46;
//           }
//           .order-pending {
//             background-color: #fef3c7;
//             color: #92400e;
//           }
//           .order-cancelled {
//             background-color: #fee2e2;
//             color: #991b1b;
//           }
//           .total-amount {
//             font-weight: bold;
//             color: #059669;
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
//               size: landscape;
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
//           <h1>📦 Orders Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Orders: ${totalOrders} | Showing: ${orders.length} orders</div>
//           <div class="header-info">Page: ${page} of ${totalPages}</div>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Farmer</th>
//               <th>Trader</th>
//               <th>Items</th>
//               <th>Total Amount</th>
//               <th>Trader Payment</th>
//               <th>Farmer Payment</th>
//               <th>Order Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${orders.map((order, index) => {
//               const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//               const orderDate = new Date(order.createdAt).toLocaleDateString();
//               const traderPaymentClass = `payment-${order.traderToAdminPayment.paymentStatus}`;
//               const farmerPaymentClass = `payment-${order.adminToFarmerPayment.paymentStatus}`;
//               const orderStatusClass = `order-${order.orderStatus.toLowerCase()}`;

//               return `
//                 <tr>
//                   <td>${index + 1 + (page - 1) * limit}</td>
//                   <td><strong>${order.orderId}</strong></td>
//                   <td>${orderDate}</td>
//                   <td>${order.farmerName}</td>
//                   <td>${order.traderName}</td>
//                   <td>${order.productItems.length}</td>
//                   <td>₹${totalAmount}</td>
//                   <td><span class="status-badge ${traderPaymentClass}">${order.traderToAdminPayment.paymentStatus}</span></td>
//                   <td><span class="status-badge ${farmerPaymentClass}">${order.adminToFarmerPayment.paymentStatus}</span></td>
//                   <td><span class="status-badge ${orderStatusClass}">${order.orderStatus}</span></td>
//                 </tr>
//               `;
//             }).join('')}
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

//   /* ================= FORMAT FUNCTIONS ================= */

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatOrderStatus = (status: string) => {
//     if (!status) return "N/A";
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const calculateOrderSummary = (order: Order) => {
//     const totalAmount = order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//     const totalQuantity = order.productItems.reduce((sum, item) => sum + item.quantity, 0);
//     const itemsCount = order.productItems.length;

//     return { totalAmount, totalQuantity, itemsCount };
//   };

//   const toggleItemExpansion = (itemId: string) => {
//     setExpandedItems(prev => 
//       prev.includes(itemId) 
//         ? prev.filter(id => id !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-xs md:p-1 overflow-x-auto min-h-screen">
//       {/* Header Section */}
//       {loading && orders.length === 0 && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       <div className="mb-5 flex flex-wrap justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Orders Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all marketplace orders. {totalOrders} orders found.
//           </p>
//         </div>
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedOrders.length > 0 && (
//         <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FaCheck className="text-red-600" />
//               <span className="font-medium text-red-700">
//                 {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <button
//               onClick={() => setBulkDeleteOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//             >
//               <FaTrash className="w-4 h-4" />
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Export Buttons Section */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-xs bg-white p-[.6rem] shadow">
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
//             className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//           >
//             <btn.icon className="text-xs" />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-xs">
//         <div className="gap-[.6rem] text-xs items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-4">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by Order ID, Farmer, Trader..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Payment Status Filter */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <select
//                 value={paymentStatus}
//                 onChange={(e) => setPaymentStatus(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value="All">All Payment Status</option>
//                 <option value="paid">Paid</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
//           </div>

//           {/* Order Status Filter */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <select
//                 value={orderStatus}
//                 onChange={(e) => setOrderStatus(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value="All">All Order Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>

//           {/* Date Filter */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex gap-[.6rem] text-xs">
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setPaymentStatus("All");
//                 setOrderStatus("All");
//                 setTransporterStatus("All");
//                 setDate("");
//                 setLimit(10);
//                 setPage(1);
//               }}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
//             >
//               Reset
//             </button>
//             <button
//               onClick={() => getOrders()}
//               className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
//             >
//               Apply
//             </button>
//           </div>

//           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-xs bg-white p-[.6rem] text-xs">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//               { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//               { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//               >
//                 <btn.icon className="text-xs" />
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Desktop Table (hidden on mobile) */}
//       <div className="hidden lg:block bg-white rounded shadow" ref={tableRef}>
//         <table className="min-w-full">
//           <thead className="border-b border-zinc-200">
//             <tr className="*:text-zinc-800">
//               <th className="p-[.6rem] text-xs text-left font-semibold w-10">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAll}
//                   className="rounded border-gray-300"
//                 />
//               </th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Sr.</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Order ID</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Date</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Farmer</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Trader</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Items</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Total Amount</th>
//               <th className="p-[.6rem] lg:w-32 text-xs text-left font-semibold">Trader Payment</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Farmer Payment</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Order Status</th>
//               <th className="p-[.6rem] text-xs text-left font-semibold">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {orders.map((order, index) => {
//               const summary = calculateOrderSummary(order);
//               return (
//                 <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="p-[.6rem] text-xs">
//                     <input
//                       type="checkbox"
//                       checked={selectedOrders.includes(order._id)}
//                       onChange={(e) => handleSelectOne(order._id, e.target.checked)}
//                       className="rounded border-gray-300"
//                     />
//                   </td>
//                   <td className="p-[.6rem] text-xs">{index + 1 + (page - 1) * limit}</td>
//                   <td className="p-[.6rem] text-xs font-medium">
//                     <div className="font-bold text-blue-600">{order.orderId}</div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     {formatDateTime(order.createdAt)}
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className="flex items-center gap-1">
//                       <FaUser className="text-gray-400 text-xs" />
//                       <span>{order.farmerName}</span>
//                     </div>
//                     <div className="text-xs text-gray-500">{order.farmerId}</div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className="flex items-center gap-1">
//                       <FaStore className="text-gray-400 text-xs" />
//                       <span>{order.traderName}</span>
//                     </div>
//                     <div className="text-xs text-gray-500">{order.traderId}</div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className="flex items-center gap-1">
//                       <FaBoxes className="text-gray-400" />
//                       <span>{order.productItems.length} items</span>
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {summary.totalQuantity} units
//                     </div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className="font-semibold text-green-700">
//                       <FaRupeeSign className="inline text-xs mr-1" />
//                       {summary.totalAmount}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Avg: ₹{(summary.totalAmount / summary.totalQuantity).toFixed(2)}
//                     </div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <span className={`px-2 py-1 rounded text-xs font-medium
//                       ${order.traderToAdminPayment.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
//                         "bg-yellow-100 text-yellow-800"}`}>
//                       {order.traderToAdminPayment.paymentStatus}
//                     </span>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Paid: ₹{order.traderToAdminPayment.paidAmount}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Remaining: ₹{order.traderToAdminPayment.remainingAmount}
//                     </div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <span className={`px-2 py-1 rounded text-xs font-medium
//                       ${order.adminToFarmerPayment.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
//                         "bg-yellow-100 text-yellow-800"}`}>
//                       {order.adminToFarmerPayment.paymentStatus}
//                     </span>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Paid: ₹{order.adminToFarmerPayment.paidAmount}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Remaining: ₹{order.adminToFarmerPayment.remainingAmount}
//                     </div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className={`px-2 py-1 rounded text-xs font-medium
//                       ${order.orderStatus === "completed" ? "bg-green-100 text-green-800" :
//                         order.orderStatus === "cancelled" ? "bg-red-100 text-red-800" :
//                         "bg-blue-100 text-blue-800"}`}>
//                       {formatOrderStatus(order.orderStatus)}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Farmer: {order.farmerAcceptedStatus ? <FaCheckCircle className="inline text-green-500" /> : <FaTimesCircle className="inline text-red-500" />}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Trader: {order.traderAcceptedStatus ? <FaCheckCircle className="inline text-green-500" /> : <FaTimesCircle className="inline text-red-500" />}
//                     </div>
//                   </td>
//                   <td className="p-[.6rem] text-xs">
//                     <div className="flex gap-[.6rem] text-xs">
//                       <button
//                         onClick={() => {
//                           setCurrentOrder(order);
//                           setViewOpen(true);
//                           setExpandedItems([]);
//                         }}
//                         className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="View Details"
//                       >
//                         <FaEye />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setCurrentOrder(order);
//                           setEditOpen(true);
//                         }}
//                         className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                         title="Edit Order"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setCurrentOrder(order);
//                           setDeleteOpen(true);
//                         }}
//                         className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Delete Order"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards (visible only on small devices) */}
//       <div className="lg:hidden space-y-2 p-[.2rem] text-xs">
//         {orders.map((order, index) => {
//           const summary = calculateOrderSummary(order);
//           return (
//             <div key={order._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedOrders.includes(order._id)}
//                     onChange={(e) => handleSelectOne(order._id, e.target.checked)}
//                     className="rounded border-gray-300"
//                   />
//                   <div className="flex flex-wrap gap-y-2">
//                     <span className="font-bold text-gray-800">#{order.orderId}</span>
//                     <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold
//                       ${order.orderStatus === "completed" ? "bg-green-100 text-green-800" :
//                         order.orderStatus === "cancelled" ? "bg-red-100 text-red-800" :
//                         "bg-blue-100 text-blue-800"}`}>
//                       {formatOrderStatus(order.orderStatus)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-[.6rem] text-xs">
//                   <button onClick={() => { setCurrentOrder(order); setViewOpen(true); setExpandedItems([]); }} className="p-1.5 text-blue-600">
//                     <FaEye />
//                   </button>
//                   <button onClick={() => { setCurrentOrder(order); setEditOpen(true); }} className="p-1.5 text-green-600">
//                     <FaEdit />
//                   </button>
//                   <button onClick={() => { setCurrentOrder(order); setDeleteOpen(true); }} className="p-1.5 text-red-600">
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                   <div>
//                     <div className="text-xs text-gray-500">Farmer</div>
//                     <div className="flex items-center gap-1">
//                       <FaUser className="text-gray-400 text-xs" />
//                       <span>{order.farmerName}</span>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Trader</div>
//                     <div className="flex items-center gap-1">
//                       <FaStore className="text-gray-400 text-xs" />
//                       <span>{order.traderName}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                   <div>
//                     <div className="text-xs text-gray-500">Date</div>
//                     <div>{formatDate(order.createdAt)}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Items</div>
//                     <div>{order.productItems.length} items ({summary.totalQuantity} units)</div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                   <div>
//                     <div className="text-xs text-gray-500">Trader Payment</div>
//                     <div className={`text-xs ${order.traderToAdminPayment.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
//                       {order.traderToAdminPayment.paymentStatus}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Farmer Payment</div>
//                     <div className={`text-xs ${order.adminToFarmerPayment.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
//                       {order.adminToFarmerPayment.paymentStatus}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                   <div>
//                     <div className="text-xs text-gray-500">Total Amount</div>
//                     <div className="font-bold text-green-700">
//                       <FaRupeeSign className="inline text-xs mr-1" />
//                       {summary.totalAmount}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Acceptance</div>
//                     <div className="text-xs">
//                       F: {order.farmerAcceptedStatus ? <FaCheckCircle className="inline text-green-500" /> : <FaTimesCircle className="inline text-red-500" />}
//                       {" "}
//                       T: {order.traderAcceptedStatus ? <FaCheckCircle className="inline text-green-500" /> : <FaTimesCircle className="inline text-red-500" />}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {orders.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">📦</div>
//           <h3 className="text-xl font-semibold mb-2">No orders found</h3>
//           <p className="text-gray-500">Try adjusting your search or filters</p>
//           <button onClick={getOrders} className="border border-green-300 text-xs rounded p-1 mt-2 px-3 cursor-pointer bg-green-300 text-white">Reload</button>
//         </div>
//       )}

//       {/* Material-UI Pagination */}
//       {orders.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (page - 1) * limit}-{Math.min(page * limit, totalOrders)}</span> of{" "}
//             <span className="font-semibold">{totalOrders}</span> orders
//             <select value={limit} onChange={(e)=>setLimit(Number(e.target.value))} className="p-1 ml-3 border border-zinc-300 rounded">
//               {[2,5,10,15,20,25,30,40,50,60,70,80,90,100].map((data,i)=>(
//                 <option key={i} value={data}>{data}</option>
//               ))}
//             </select>
//           </div>

//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={(event, value) => setPage(value)}
//             color="primary"
//             shape="rounded"
//             showFirstButton
//             showLastButton
//           />
//         </div>
//       )}

//       {/* EDIT MODAL */}
//       <Modal open={editOpen} onClose={() => setEditOpen(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" className="mb-4">
//             Update Order #{currentOrder?.orderId}
//           </Typography>
//           <br />
//           <FormControl fullWidth className="mt-4">
//             <InputLabel>Trader Payment Status</InputLabel>
//             <Select
//               value={currentOrder?.traderToAdminPayment.paymentStatus || ""}
//               label="Trader Payment Status"
//               onChange={(e) =>
//                 setCurrentOrder((prev: any) => ({
//                   ...prev,
//                   traderToAdminPayment: {
//                     ...prev?.traderToAdminPayment,
//                     paymentStatus: e.target.value,
//                   }
//                 }))
//               }
//             >
//               <MenuItem value="paid">Paid</MenuItem>
//               <MenuItem value="pending">Pending</MenuItem>
//             </Select>
//           </FormControl>
//           <br />
//           <FormControl fullWidth className="mt-4">
//             <InputLabel>Farmer Payment Status</InputLabel>
//             <Select
//               value={currentOrder?.adminToFarmerPayment.paymentStatus || ""}
//               label="Farmer Payment Status"
//               onChange={(e) =>
//                 setCurrentOrder((prev: any) => ({
//                   ...prev,
//                   adminToFarmerPayment: {
//                     ...prev?.adminToFarmerPayment,
//                     paymentStatus: e.target.value,
//                   }
//                 }))
//               }
//             >
//               <MenuItem value="paid">Paid</MenuItem>
//               <MenuItem value="pending">Pending</MenuItem>
//             </Select>
//           </FormControl>
//           <br />
//           <FormControl fullWidth className="mt-4">
//             <InputLabel>Order Status</InputLabel>
//             <Select
//               value={currentOrder?.orderStatus || ""}
//               label="Order Status"
//               onChange={(e) =>
//                 setCurrentOrder((prev: any) => ({
//                   ...prev,
//                   orderStatus: e.target.value,
//                 }))
//               }
//             >
//               <MenuItem value="pending">Pending</MenuItem>
//               <MenuItem value="confirmed">Confirmed</MenuItem>
//               <MenuItem value="completed">Completed</MenuItem>
//               <MenuItem value="cancelled">Cancelled</MenuItem>
//             </Select>
//           </FormControl>
//           <div className="flex justify-end gap-2 mt-6">
//             <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//             <Button variant="contained" onClick={handleUpdate}>
//               Save Changes
//             </Button>
//           </div>
//         </Box>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <Typography variant="h6" className="mb-2">
//               Delete Order #{currentOrder?.orderId}?
//             </Typography>
//             <Typography className="text-gray-600 mb-6">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </Typography>
//             <div className="flex justify-center gap-[.6rem] text-xs">
//               <Button onClick={() => setDeleteOpen(false)} variant="outlined">
//                 Cancel
//               </Button>
//               <Button onClick={handleDelete} variant="contained" color="error">
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </Box>
//       </Modal>

//       {/* BULK DELETE MODAL */}
//       <Modal open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}>
//         <Box sx={modalStyle}>
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">🗑️</div>
//             <Typography variant="h6" className="mb-2">
//               Delete {selectedOrders.length} Selected Orders?
//             </Typography>
//             <Typography className="text-gray-600 mb-6">
//               Are you sure you want to delete {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''}? 
//               This action cannot be undone.
//             </Typography>
//             <div className="flex justify-center gap-[.6rem] text-xs">
//               <Button onClick={() => setBulkDeleteOpen(false)} variant="outlined">
//                 Cancel
//               </Button>
//               <Button onClick={handleBulkDelete} variant="contained" color="error">
//                 Delete {selectedOrders.length} Orders
//               </Button>
//             </div>
//           </div>
//         </Box>
//       </Modal>

//       {/* VIEW DETAILS MODAL */}
//       <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
//         <Box sx={modalStyle}>
//           {currentOrder && (
//             <>
//               <div className="sticky top-0 bg-white z-10 pb-4 border-b">
//                 <Typography variant="h6" className="mb-2">
//                   <FaInfoCircle className="inline mr-2 text-blue-600" />
//                   Order Details: #{currentOrder.orderId}
//                 </Typography>
//                 <div className="flex flex-wrap gap-2">
//                   <Chip 
//                     label={`Status: ${formatOrderStatus(currentOrder.orderStatus)}`}
//                     color={
//                       currentOrder.orderStatus === "completed" ? "success" :
//                       currentOrder.orderStatus === "cancelled" ? "error" :
//                       "primary"
//                     }
//                     size="small"
//                   />
//                   <Chip 
//                     label={`Trader Payment: ${currentOrder.traderToAdminPayment.paymentStatus}`}
//                     color={
//                       currentOrder.traderToAdminPayment.paymentStatus === "paid" ? "success" : "warning"
//                     }
//                     size="small"
//                   />
//                   <Chip 
//                     label={`Farmer Payment: ${currentOrder.adminToFarmerPayment.paymentStatus}`}
//                     color={
//                       currentOrder.adminToFarmerPayment.paymentStatus === "paid" ? "success" : "warning"
//                     }
//                     size="small"
//                   />
//                 </div>
//               </div>

//               <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaCalendarAlt className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Order Information</h3>
//                     </div>
//                     <div className="space-y-2 text-xs">
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Order ID:</span>
//                         <span className="font-medium">{currentOrder.orderId}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Created At:</span>
//                         <span className="font-medium">{formatDateTime(currentOrder.createdAt)}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Updated At:</span>
//                         <span className="font-medium">{formatDateTime(currentOrder.updatedAt)}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Farmer Accepted:</span>
//                         <span className={`font-medium ${currentOrder.farmerAcceptedStatus ? 'text-green-600' : 'text-red-600'}`}>
//                           {currentOrder.farmerAcceptedStatus ? <FaCheckCircle className="inline" /> : <FaTimesCircle className="inline" />}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Trader Accepted:</span>
//                         <span className={`font-medium ${currentOrder.traderAcceptedStatus ? 'text-green-600' : 'text-red-600'}`}>
//                           {currentOrder.traderAcceptedStatus ? <FaCheckCircle className="inline" /> : <FaTimesCircle className="inline" />}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaCreditCard className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Payment Information</h3>
//                     </div>
//                     <div className="space-y-2 text-xs">
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Trader Payment:</span>
//                         <span className={`font-medium ${currentOrder.traderToAdminPayment.paymentStatus === "paid" ? 'text-green-600' : 'text-yellow-600'}`}>
//                           {currentOrder.traderToAdminPayment.paymentStatus}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-medium">₹{currentOrder.traderToAdminPayment.paidAmount}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Remaining Amount:</span>
//                         <span className="font-medium">₹{currentOrder.traderToAdminPayment.remainingAmount}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Farmer Payment:</span>
//                         <span className={`font-medium ${currentOrder.adminToFarmerPayment.paymentStatus === "paid" ? 'text-green-600' : 'text-yellow-600'}`}>
//                           {currentOrder.adminToFarmerPayment.paymentStatus}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Paid Amount:</span>
//                         <span className="font-medium">₹{currentOrder.adminToFarmerPayment.paidAmount}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Remaining Amount:</span>
//                         <span className="font-medium">₹{currentOrder.adminToFarmerPayment.remainingAmount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Party Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaUser className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Farmer Details</h3>
//                     </div>
//                     <div className="space-y-2 text-xs">
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Name:</span>
//                         <span className="font-medium">{currentOrder.farmerName}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">ID:</span>
//                         <span className="font-medium">{currentOrder.farmerId}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaStore className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Trader Details</h3>
//                     </div>
//                     <div className="space-y-2 text-xs">
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">Name:</span>
//                         <span className="font-medium">{currentOrder.traderName}</span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-gray-600">ID:</span>
//                         <span className="font-medium">{currentOrder.traderId}</span>
//                       </div>
//                       {currentOrder.traderMobile && (
//                         <div className="grid grid-cols-2">
//                           <span className="text-gray-600 flex items-center gap-1">
//                             <FaPhone className="text-xs" /> Mobile:
//                           </span>
//                           <span className="font-medium">{currentOrder.traderMobile}</span>
//                         </div>
//                       )}
//                       {currentOrder.traderEmail && (
//                         <div className="grid grid-cols-2">
//                           <span className="text-gray-600 flex items-center gap-1">
//                             <FaEnvelope className="text-xs" /> Email:
//                           </span>
//                           <span className="font-medium">{currentOrder.traderEmail}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transporter Details */}
//                 {currentOrder.transporterDetails && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaTruck className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Transporter Details</h3>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
//                       <div>
//                         <div className="text-gray-600">Name</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.transporterName}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Mobile</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.transporterMobile}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Vehicle Type</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.vehicleType}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Vehicle Number</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.vehicleNumber}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Capacity</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.vehicleCapacity}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Driver Name</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.driverName}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Driver Mobile</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.driverMobile}</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Accepted At</div>
//                         <div className="font-medium">{formatDateTime(currentOrder.transporterDetails.acceptedAt)}</div>
//                       </div>
//                     </div>
//                     <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
//                       <div>
//                         <div className="text-gray-600">Goods Condition</div>
//                         <div className={`font-medium ${currentOrder.transporterDetails.goodsConditionCorrect ? 'text-green-600' : 'text-red-600'}`}>
//                           {currentOrder.transporterDetails.goodsConditionCorrect ? "Correct" : "Not Correct"}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Quantity</div>
//                         <div className={`font-medium ${currentOrder.transporterDetails.quantityCorrect ? 'text-green-600' : 'text-red-600'}`}>
//                           {currentOrder.transporterDetails.quantityCorrect ? "Correct" : "Not Correct"}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-gray-600">Transporter Reached</div>
//                         <div className={`font-medium ${currentOrder.transporterDetails.transporterReached ? 'text-green-600' : 'text-red-600'}`}>
//                           {currentOrder.transporterDetails.transporterReached ? "Yes" : "No"}
//                         </div>
//                       </div>
//                     </div>
//                     {currentOrder.transporterDetails.adminNotes && (
//                       <div className="mt-3">
//                         <div className="text-gray-600">Admin Notes</div>
//                         <div className="font-medium">{currentOrder.transporterDetails.adminNotes}</div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Financial Summary */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center gap-2 mb-3">
//                     <FaRupeeSign className="text-gray-500" />
//                     <h3 className="text-sm font-semibold">Financial Summary</h3>
//                   </div>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
//                     <div className="text-center p-3 bg-white rounded">
//                       <div className="text-gray-600 mb-1">Total Items</div>
//                       <div className="text-2xl font-bold">{currentOrder.productItems.length}</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded">
//                       <div className="text-gray-600 mb-1">Total Quantity</div>
//                       <div className="text-2xl font-bold">
//                         {currentOrder.productItems.reduce((sum, item) => sum + item.quantity, 0)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded">
//                       <div className="text-gray-600 mb-1">Total Amount</div>
//                       <div className="text-2xl font-bold text-green-700">
//                         ₹{currentOrder.productItems.reduce((sum, item) => sum + item.totalAmount, 0)}
//                       </div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded">
//                       <div className="text-gray-600 mb-1">Avg Price/Unit</div>
//                       <div className="text-2xl font-bold">
//                         ₹{(
//                           currentOrder.productItems.reduce((sum, item) => sum + item.totalAmount, 0) /
//                           currentOrder.productItems.reduce((sum, item) => sum + item.quantity, 1)
//                         ).toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <FaBoxes className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Order Items ({currentOrder.productItems.length})</h3>
//                     </div>
//                   </div>

//                   {/* Items List */}
//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {currentOrder.productItems.map((item, index) => {
//                       const isExpanded = expandedItems.includes(item._id);
//                       return (
//                         <div key={item._id} className="bg-white rounded-lg border p-3">
//                           <div 
//                             className="flex justify-between items-center cursor-pointer"
//                             onClick={() => toggleItemExpansion(item._id)}
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                 <span className="text-xs font-bold text-blue-700">{index + 1}</span>
//                               </div>
//                               <div>
//                                 <div className="font-medium text-xs">
//                                   Product ID: {item.productId}
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   Farmer ID: {item.farmerId}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                               <div className="text-right">
//                                 <div className="font-bold text-green-700 text-xs">₹{item.totalAmount}</div>
//                                 <div className="text-xs text-gray-500">
//                                   {item.quantity} × ₹{item.pricePerUnit}
//                                 </div>
//                               </div>
//                               <div className="text-gray-400">
//                                 {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
//                               </div>
//                             </div>
//                           </div>

//                           {isExpanded && (
//                             <div className="mt-3 pt-3 border-t space-y-3">
//                               {/* Product Details */}
//                               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
//                                 <div>
//                                   <div className="text-gray-600">Product ID</div>
//                                   <div className="font-medium">{item.productId}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Farmer ID</div>
//                                   <div className="font-medium">{item.farmerId}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Delivery Date</div>
//                                   <div className="font-medium">{formatDate(item.deliveryDate)}</div>
//                                 </div>
//                               </div>

//                               {/* Grade Details */}
//                               <div className="bg-blue-50 p-3 rounded">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <FaTags className="text-blue-500 text-xs" />
//                                   <h4 className="text-xs font-semibold">Product Details</h4>
//                                 </div>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
//                                   <div>
//                                     <div className="text-gray-600">Grade</div>
//                                     <div className="font-medium">{item.grade}</div>
//                                   </div>
//                                   <div>
//                                     <div className="text-gray-600">Price/Unit</div>
//                                     <div className="font-medium">₹{item.pricePerUnit}</div>
//                                   </div>
//                                   <div>
//                                     <div className="text-gray-600">Quantity</div>
//                                     <div className="font-medium">{item.quantity}</div>
//                                   </div>
//                                   <div>
//                                     <div className="text-gray-600">Total Amount</div>
//                                     <div className="font-bold text-green-700">₹{item.totalAmount}</div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Total Items Summary */}
//                   <div className="mt-4 pt-4 border-t">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
//                       <div className="text-center p-2 bg-white rounded border">
//                         <div className="text-gray-600">Total Items</div>
//                         <div className="font-bold text-lg">{currentOrder.productItems.length}</div>
//                       </div>
//                       <div className="text-center p-2 bg-white rounded border">
//                         <div className="text-gray-600">Total Quantity</div>
//                         <div className="font-bold text-lg">
//                           {currentOrder.productItems.reduce((sum, item) => sum + item.quantity, 0)}
//                         </div>
//                       </div>
//                       <div className="text-center p-2 bg-white rounded border">
//                         <div className="text-gray-600">Total Amount</div>
//                         <div className="font-bold text-lg text-green-700">
//                           ₹{currentOrder.productItems.reduce((sum, item) => sum + item.totalAmount, 0)}
//                         </div>
//                       </div>
//                       <div className="text-center p-2 bg-white rounded border">
//                         <div className="text-gray-600">Avg Price/Unit</div>
//                         <div className="font-bold text-lg">
//                           ₹{(
//                             currentOrder.productItems.reduce((sum, item) => sum + item.totalAmount, 0) /
//                             currentOrder.productItems.reduce((sum, item) => sum + item.quantity, 1)
//                           ).toFixed(2)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment History */}
//                 {(currentOrder.traderToAdminPayment.paymentHistory.length > 0 || 
//                   currentOrder.adminToFarmerPayment.paymentHistory.length > 0) && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <FaFileAlt className="text-gray-500" />
//                       <h3 className="text-sm font-semibold">Payment History</h3>
//                     </div>

//                     {/* Trader Payment History */}
//                     {currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
//                       <div className="mb-4">
//                         <h4 className="text-xs font-semibold mb-2">Trader Payments:</h4>
//                         <div className="space-y-2">
//                           {currentOrder.traderToAdminPayment.paymentHistory.map((payment, index) => (
//                             <div key={payment._id} className="bg-white p-3 rounded border text-xs">
//                               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                                 <div>
//                                   <div className="text-gray-600">Amount</div>
//                                   <div className="font-medium">₹{payment.amount}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Paid Date</div>
//                                   <div className="font-medium">{formatDateTime(payment.paidDate)}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Razorpay ID</div>
//                                   <div className="font-medium truncate">{payment.razorpayPaymentId}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Order ID</div>
//                                   <div className="font-medium">{payment.razorpayOrderId}</div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Farmer Payment History */}
//                     {currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
//                       <div>
//                         <h4 className="text-xs font-semibold mb-2">Farmer Payments:</h4>
//                         <div className="space-y-2">
//                           {currentOrder.adminToFarmerPayment.paymentHistory.map((payment, index) => (
//                             <div key={payment._id} className="bg-white p-3 rounded border text-xs">
//                               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                                 <div>
//                                   <div className="text-gray-600">Amount</div>
//                                   <div className="font-medium">₹{payment.amount}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Paid Date</div>
//                                   <div className="font-medium">{formatDateTime(payment.paidDate)}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Razorpay ID</div>
//                                   <div className="font-medium truncate">{payment.razorpayPaymentId}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-gray-600">Order ID</div>
//                                   <div className="font-medium">{payment.razorpayOrderId}</div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end mt-6 pt-6 border-t">
//                 <Button onClick={() => setViewOpen(false)} variant="contained" color="primary">
//                   Close Details
//                 </Button>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// }















"use client"

import React, { useEffect, useState } from "react";

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

// Dynamic Invoice Interfaces
interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  termsConditions: string[];
  gstNumber?: string;
  panNumber?: string;
}

interface ProductGradeInfo {
  grade: string;
  basePrice: number;
  appreciationRate?: number;
  depreciationRate?: number;
}

interface FeeStructure {
  processingFarmerPercent: number;
  processingTraderPercent: number;
  laborFarmer: number;
  laborTrader: number;
  transportFarmer: number;
  transportTrader: number;
  advancePercentage: number;
}

interface InvoiceProduct {
  grade: string;
  quantity: number;
  price: number;
  total: number;
  depreciation?: number;
  appreciation?: number;
}

interface InvoiceData {
  farmer: {
    products: InvoiceProduct[];
    totalQuantity: number;
    processingFees: { farmer: number; trader: number };
    labor: { farmer: number; trader: number };
    transport: { farmer: number; trader: number };
    advance: number;
    finalAmount: number;
    gstAmount: number;
    netAmount: number;
  };
  trader: {
    products: InvoiceProduct[];
    totalQuantity: number;
    processingFees: { farmer: number; trader: number };
    labor: { farmer: number; trader: number };
    transport: { farmer: number; trader: number };
    advance: number;
    finalAmount: number;
    gstAmount: number;
    netAmount: number;
  };
}

interface Order {
  _id: string;
  orderId: string;
  traderName: string;
  traderMobile?: string;
  traderEmail?: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerEmail?: string;
  productItems: ProductItem[];
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  traderToAdminPayment?: PaymentDetails;
  adminToFarmerPayment?: PaymentDetails;
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [transporterStatusFilter, setTransporterStatusFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [verificationData, setVerificationData] = useState({
    transporterReached: false,
    goodsConditionCorrect: false,
    quantityCorrect: false,
    adminNotes: '',
  });

  // Dynamic data states
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    termsConditions: []
  });
  const [productGrades, setProductGrades] = useState<ProductGradeInfo[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    processingFarmerPercent: 0,
    processingTraderPercent: 0,
    laborFarmer: 0,
    laborTrader: 0,
    transportFarmer: 0,
    transportTrader: 0,
    advancePercentage: 0
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceType, setInvoiceType] = useState<'farmer' | 'trader'>('farmer');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    farmer: {
      products: [],
      totalQuantity: 0,
      processingFees: { farmer: 0, trader: 0 },
      labor: { farmer: 0, trader: 0 },
      transport: { farmer: 0, trader: 0 },
      advance: 0,
      finalAmount: 0,
      gstAmount: 0,
      netAmount: 0
    },
    trader: {
      products: [],
      totalQuantity: 0,
      processingFees: { farmer: 0, trader: 0 },
      labor: { farmer: 0, trader: 0 },
      transport: { farmer: 0, trader: 0 },
      advance: 0,
      finalAmount: 0,
      gstAmount: 0,
      netAmount: 0
    }
  });
  const [editingInvoice, setEditingInvoice] = useState<boolean>(false);

  const API_BASE = 'https://kisan.etpl.ai/api/admin';

  useEffect(() => {
    fetchOrders();
    fetchDynamicData();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    let url = `${API_BASE}/orders?`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (transporterStatusFilter) url += `transporterStatus=${transporterStatusFilter}&`;
    if (searchInput) url += `search=${searchInput}&`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        alert('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDynamicData = async () => {
    try {
      // Fetch invoice settings
      const settingsRes = await fetch(`${API_BASE}/settings/invoice`);
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setInvoiceSettings(settingsData.data);
      }

      // Fetch product grades with prices
      const gradesRes = await fetch(`${API_BASE}/products/grades`);
      const gradesData = await gradesRes.json();
      if (gradesData.success) {
        setProductGrades(gradesData.data);
      }

      // Fetch fee structure
      const feesRes = await fetch(`${API_BASE}/settings/fees`);
      const feesData = await feesRes.json();
      if (feesData.success) {
        setFeeStructure(feesData.data);
      }
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
      // Set fallback data if API fails
      setInvoiceSettings({
        companyName: 'AGRI TRADING COMPANY',
        companyAddress: '123 Market Street, Agricultural District, Pin: 560001',
        companyPhone: '+91 9876543210',
        companyEmail: 'info@agritrading.com',
        termsConditions: [
          'Payment due within 30 days',
          'Late payment interest @ 1.5% per month',
          'All disputes subject to jurisdiction'
        ],
        gstNumber: 'GSTIN123456789',
        panNumber: 'ABCDE1234F'
      });

      setProductGrades([
        { grade: 'A Grade', basePrice: 100, appreciationRate: 5 },
        { grade: 'B Grade', basePrice: 80, appreciationRate: 3 },
        { grade: 'C Grade', basePrice: 60, depreciationRate: 2 },
        { grade: 'D Grade', basePrice: 40, depreciationRate: 5 },
        { grade: 'All Mix', basePrice: 70 }
      ]);
    }
  };

  const openDetailsModal = (order: Order) => {
    setCurrentOrder(order);
    setVerificationData({
      transporterReached: order.transporterDetails?.transporterReached || false,
      goodsConditionCorrect: order.transporterDetails?.goodsConditionCorrect || false,
      quantityCorrect: order.transporterDetails?.quantityCorrect || false,
      adminNotes: order.transporterDetails?.adminNotes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(false);
  };

  const calculateDepreciationAppreciation = (grade: string, baseAmount: number) => {
    const gradeInfo = productGrades.find(g => g.grade === grade);
    if (!gradeInfo) return { depreciation: 0, appreciation: 0 };

    const depreciation = gradeInfo.depreciationRate
      ? (baseAmount * gradeInfo.depreciationRate) / 100
      : 0;
    const appreciation = gradeInfo.appreciationRate
      ? (baseAmount * gradeInfo.appreciationRate) / 100
      : 0;

    return { depreciation, appreciation };
  };

  const initializeInvoiceData = (order: Order) => {
    const products: InvoiceProduct[] = [];
    let totalQuantity = 0;

    // Group products by grade from actual order data
    const gradeGroups = order.productItems.reduce((acc, item) => {
      if (!acc[item.grade]) {
        acc[item.grade] = {
          quantity: 0,
          total: 0,
          pricePerUnit: item.pricePerUnit,
          grade: item.grade
        };
      }
      acc[item.grade].quantity += item.quantity;
      acc[item.grade].total += item.totalAmount;
      totalQuantity += item.quantity;
      return acc;
    }, {} as Record<string, { quantity: number; total: number; pricePerUnit: number; grade: string }>);

    // Create invoice products with dynamic calculations
    Object.entries(gradeGroups).forEach(([grade, data]) => {
      const { depreciation, appreciation } = calculateDepreciationAppreciation(grade, data.total);

      products.push({
        grade,
        quantity: data.quantity,
        price: data.pricePerUnit,
        total: data.total,
        depreciation,
        appreciation
      });
    });

    // Sort by grade
    const gradeOrder = ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'All Mix'];
    products.sort((a, b) => gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade));

    // Calculate base amount from products
    const productsTotal = products.reduce((sum, p) => {
      return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
    }, 0);

    // Calculate advance based on percentage from feeStructure
    const advanceAmount = productsTotal * (feeStructure.advancePercentage / 100);

    // Calculate processing fees
    const processingFarmerAmount = productsTotal * (feeStructure.processingFarmerPercent / 100);
    const processingTraderAmount = productsTotal * (feeStructure.processingTraderPercent / 100);

    // Calculate GST (assuming 18%)
    const gstRate = 0.18;
    const taxableAmount = productsTotal + processingFarmerAmount + processingTraderAmount +
      feeStructure.laborFarmer + feeStructure.laborTrader +
      feeStructure.transportFarmer + feeStructure.transportTrader;
    const gstAmount = taxableAmount * gstRate;

    // Calculate net amount
    const netAmount = taxableAmount + gstAmount;

    const newInvoiceData: InvoiceData = {
      farmer: {
        products: [...products],
        totalQuantity,
        processingFees: {
          farmer: processingFarmerAmount,
          trader: processingTraderAmount
        },
        labor: {
          farmer: feeStructure.laborFarmer,
          trader: feeStructure.laborTrader
        },
        transport: {
          farmer: feeStructure.transportFarmer,
          trader: feeStructure.transportTrader
        },
        advance: advanceAmount,
        finalAmount: netAmount - advanceAmount,
        gstAmount,
        netAmount
      },
      trader: {
        products: [...products],
        totalQuantity,
        processingFees: {
          farmer: processingFarmerAmount,
          trader: processingTraderAmount
        },
        labor: {
          farmer: feeStructure.laborFarmer,
          trader: feeStructure.laborTrader
        },
        transport: {
          farmer: feeStructure.transportFarmer,
          trader: feeStructure.transportTrader
        },
        advance: advanceAmount,
        finalAmount: netAmount + advanceAmount,
        gstAmount,
        netAmount
      }
    };

    setInvoiceData(newInvoiceData);
  };

  const openInvoiceModal = (order: Order, type: 'farmer' | 'trader') => {
    setCurrentOrder(order);
    setInvoiceType(type);
    initializeInvoiceData(order);
    setShowInvoiceModal(true);
  };

  const handleInvoiceChange = (field: string, value: any, subField?: string) => {
    setInvoiceData(prev => {
      const newData = { ...prev };

      if (field.includes('.')) {
        const [main, sub] = field.split('.');
        if (main === 'farmer' || main === 'trader') {
          if (subField) {
            (newData[main] as any)[sub][subField] = value;
          } else {
            (newData[main] as any)[sub] = value;
          }
        }
      } else {
        if (subField) {
          (newData[invoiceType] as any)[field][subField] = value;
        } else {
          (newData[invoiceType] as any)[field] = value;
        }
      }

      // Recalculate final amount
      const productsTotal = newData[invoiceType].products.reduce((sum: number, p: InvoiceProduct) => {
        return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
      }, 0);

      const feesTotal =
        (newData[invoiceType].processingFees.farmer || 0) +
        (newData[invoiceType].processingFees.trader || 0) +
        (newData[invoiceType].labor.farmer || 0) +
        (newData[invoiceType].labor.trader || 0) +
        (newData[invoiceType].transport.farmer || 0) +
        (newData[invoiceType].transport.trader || 0);

      // Recalculate GST and net amount
      const gstRate = 0.18;
      const taxableAmount = productsTotal + feesTotal;
      const gstAmount = taxableAmount * gstRate;
      const netAmount = taxableAmount + gstAmount;

      newData[invoiceType].gstAmount = gstAmount;
      newData[invoiceType].netAmount = netAmount;

      if (invoiceType === 'farmer') {
        newData[invoiceType].finalAmount = netAmount - newData[invoiceType].advance;
      } else {
        newData[invoiceType].finalAmount = netAmount + newData[invoiceType].advance;
      }

      return newData;
    });
  };

  const handleProductChange = (index: number, field: keyof InvoiceProduct, value: number) => {
    setInvoiceData(prev => {
      const newData = { ...prev };
      const product = newData[invoiceType].products[index];

      if (field === 'price' || field === 'quantity') {
        (product as any)[field] = value;
        product.total = product.price * product.quantity;

        // Recalculate depreciation/appreciation based on new total
        const { depreciation, appreciation } = calculateDepreciationAppreciation(product.grade, product.total);
        product.depreciation = depreciation;
        product.appreciation = appreciation;
      } else if (field === 'depreciation' || field === 'appreciation') {
        (product as any)[field] = value;
      }

      // Recalculate all amounts
      const productsTotal = newData[invoiceType].products.reduce((sum, p) => {
        return sum + p.total + (p.appreciation || 0) - (p.depreciation || 0);
      }, 0);

      const feesTotal =
        (newData[invoiceType].processingFees.farmer || 0) +
        (newData[invoiceType].processingFees.trader || 0) +
        (newData[invoiceType].labor.farmer || 0) +
        (newData[invoiceType].labor.trader || 0) +
        (newData[invoiceType].transport.farmer || 0) +
        (newData[invoiceType].transport.trader || 0);

      const gstRate = 0.18;
      const taxableAmount = productsTotal + feesTotal;
      const gstAmount = taxableAmount * gstRate;
      const netAmount = taxableAmount + gstAmount;

      newData[invoiceType].gstAmount = gstAmount;
      newData[invoiceType].netAmount = netAmount;

      if (invoiceType === 'farmer') {
        newData[invoiceType].finalAmount = netAmount - newData[invoiceType].advance;
      } else {
        newData[invoiceType].finalAmount = netAmount + newData[invoiceType].advance;
      }

      return newData;
    });
  };

  const saveInvoice = async () => {
    if (!currentOrder) return;

    try {
      const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceType,
          invoiceData: invoiceData[invoiceType],
          updatedBy: localStorage.getItem('adminId') || 'admin-001',
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Invoice saved successfully!');
        closeInvoiceModal();
      } else {
        alert('Failed to save invoice: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving invoice');
    }
  };

  const generateInvoicePDF = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${currentOrder?.orderId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .company-name { font-size: 24px; font-weight: bold; }
                .invoice-title { background: #f0f0f0; padding: 10px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-section { margin-top: 30px; text-align: right; }
                .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${invoiceContent.innerHTML}
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">Print Invoice</button>
                <button onclick="window.close()">Close</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const saveVerification = async () => {
    if (!currentOrder || !currentOrder.transporterDetails) {
      alert('No transporter details available');
      return;
    }

    const adminId = localStorage.getItem('adminId') || 'admin-001';
    const adminName = localStorage.getItem('userName') || 'Admin';

    const data = {
      ...verificationData,
      adminId,
      adminName,
    };

    try {
      const response = await fetch(`${API_BASE}/orders/${currentOrder.orderId}/verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert('Verification updated successfully!');
        closeModal();
        fetchOrders();
      } else {
        alert('Failed to update verification: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating verification');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const statusColors: { [key: string]: React.CSSProperties } = {
      pending: { backgroundColor: '#ffc107', color: '#000' },
      processing: { backgroundColor: '#0dcaf0', color: '#000' },
      in_transit: { backgroundColor: '#0d6efd', color: '#fff' },
      completed: { backgroundColor: '#198754', color: '#fff' },
      cancelled: { backgroundColor: '#dc3545', color: '#fff' },
      accepted: { backgroundColor: '#198754', color: '#fff' },
      rejected: { backgroundColor: '#dc3545', color: '#fff' },
      partial: { backgroundColor: '#ffc107', color: '#000' },
      paid: { backgroundColor: '#198754', color: '#fff' },
    };
    return statusColors[status] || { backgroundColor: '#6c757d', color: '#fff' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #0d6efd',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}
          />
          <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading orders...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#212529' }}>
          📋 Order Management
        </h1>
        <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>Manage and verify transportation orders with payment details</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.375rem',
          padding: '1rem',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Order Status
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Transporter Status
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={transporterStatusFilter}
                onChange={(e) => setTransporterStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontWeight: '500' }}>
                Search
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #ced4da',
                  backgroundColor: '#fff',
                  color: '#212529'
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Order ID, Trader, Farmer..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={fetchOrders}
              >
                🔍 Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.375rem',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>📦</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>No orders found</h4>
                <p style={{ color: '#6c757d', margin: 0 }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Order ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Trader</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Farmer</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Products</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Order Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Transporter Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Trader Payment</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Farmer Payment</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Verification</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        style={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <strong style={{ color: '#0d6efd' }}>{order.orderId}</strong>
                          <br />
                          <small style={{ color: '#6c757d' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <div>{order.traderName}</div>
                          {order.traderMobile && (
                            <small style={{ color: '#6c757d' }}>{order.traderMobile}</small>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <div>{order.farmerName || 'N/A'}</div>
                          {order.farmerMobile && (
                            <small style={{ color: '#6c757d' }}>{order.farmerMobile}</small>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            backgroundColor: '#0dcaf0',
                            color: '#000',
                            fontSize: '0.875em',
                            fontWeight: '500'
                          }}>
                            {order.productItems.length} item(s)
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            fontSize: '0.875em',
                            fontWeight: '500',
                            ...getStatusBadgeStyle(order.orderStatus)
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25em 0.5em',
                            borderRadius: '0.25rem',
                            fontSize: '0.875em',
                            fontWeight: '500',
                            ...getStatusBadgeStyle(order.transporterStatus || 'pending')
                          }}>
                            {order.transporterStatus || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.traderToAdminPayment ? (
                            <div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Total:</small>{' '}
                                <strong>
                                  {formatCurrency(order.traderToAdminPayment.totalAmount)}
                                </strong>
                              </div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
                                {formatCurrency(order.traderToAdminPayment.paidAmount)}
                              </div>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.75em',
                                fontWeight: '500',
                                marginTop: '0.25rem',
                                ...getStatusBadgeStyle(order.traderToAdminPayment.paymentStatus)
                              }}>
                                {order.traderToAdminPayment.paymentStatus}
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.adminToFarmerPayment ? (
                            <div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Total:</small>{' '}
                                <strong>
                                  {formatCurrency(order.adminToFarmerPayment.totalAmount)}
                                </strong>
                              </div>
                              <div>
                                <small style={{ color: '#6c757d' }}>Paid:</small>{' '}
                                {formatCurrency(order.adminToFarmerPayment.paidAmount)}
                              </div>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.75em',
                                fontWeight: '500',
                                marginTop: '0.25rem',
                                ...getStatusBadgeStyle(order.adminToFarmerPayment.paymentStatus)
                              }}>
                                {order.adminToFarmerPayment.paymentStatus}
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                          {order.transporterDetails ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.transporterReached ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Reached"
                              >
                                {order.transporterDetails.transporterReached ? '✓' : '✗'}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.goodsConditionCorrect ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Condition"
                              >
                                {order.transporterDetails.goodsConditionCorrect ? '✓' : '✗'}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  borderRadius: '0.25rem',
                                  backgroundColor: order.transporterDetails.quantityCorrect ? '#198754' : '#6c757d',
                                  color: '#fff',
                                  cursor: 'help'
                                }}
                                title="Quantity"
                              >
                                {order.transporterDetails.quantityCorrect ? '✓' : '✗'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#6c757d' }}>No transporter</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6', display: 'flex', gap: '0.5rem' }}>
                          <button
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                              backgroundColor: '#0d6efd',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
                            }}
                            onClick={() => openDetailsModal(order)}
                          >
                            👁️ View
                          </button>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.875rem',
                                backgroundColor: '#198754',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                if (dropdown.style.display === 'block') {
                                  dropdown.style.display = 'none';
                                } else {
                                  dropdown.style.display = 'block';
                                }
                              }}
                            >
                              📝 Edit
                            </button>
                            <div style={{
                              display: 'none',
                              position: 'absolute',
                              backgroundColor: 'white',
                              minWidth: '160px',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                              zIndex: 1,
                              borderRadius: '0.25rem',
                              right: 0
                            }}>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInvoiceModal(order, 'farmer');
                                  const dropdown = (e.currentTarget.parentElement as HTMLElement);
                                  dropdown.style.display = 'none';
                                }}
                              >
                                👨‍🌾 Farmer Invoice
                              </button>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInvoiceModal(order, 'trader');
                                  const dropdown = (e.currentTarget.parentElement as HTMLElement);
                                  dropdown.style.display = 'none';
                                }}
                              >
                                💼 Trader Invoice
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && currentOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem',
          overflow: 'auto'
        }}>
          <div id="invoice-content" style={{
            backgroundColor: '#fff',
            borderRadius: '0.375rem',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: invoiceType === 'farmer' ? '#198754' : '#0d6efd',
              color: '#fff',
              padding: '1rem',
              borderTopLeftRadius: '0.375rem',
              borderTopRightRadius: '0.375rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {invoiceType === 'farmer' ? '👨‍🌾 Farmer Invoice' : '💼 Trader Invoice'} - {currentOrder.orderId}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => setEditingInvoice(!editingInvoice)}
                >
                  {editingInvoice ? '👁️ Preview' : '✏️ Edit'}
                </button>
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={generateInvoicePDF}
                >
                  📄 Generate PDF
                </button>
                <button
                  onClick={closeInvoiceModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body - Invoice Content */}
            <div style={{ padding: '2rem' }}>
              {/* Company Header - Dynamic from DB */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{invoiceSettings.companyName || 'AGRI TRADING COMPANY'}</h1>
                <p style={{ margin: 0, color: '#666' }}>{invoiceSettings.companyAddress || '123 Market Street, Agricultural District'}</p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Phone: {invoiceSettings.companyPhone || '+91 9876543210'} | Email: {invoiceSettings.companyEmail || 'info@agritrading.com'}
                </p>
                {invoiceSettings.gstNumber && (
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    GST: {invoiceSettings.gstNumber} | PAN: {invoiceSettings.panNumber}
                  </p>
                )}
                <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>
                    INVOICE {invoiceType === 'farmer' ? 'FOR FARMER' : 'FOR TRADER'}
                  </h3>
                </div>
              </div>

              {/* Customer Info - Dynamic from Order */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                    {invoiceType === 'farmer' ? 'Farmer Details:' : 'Trader Details:'}
                  </h4>
                  <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerName || 'N/A' : currentOrder.traderName}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerMobile || '' : currentOrder.traderMobile || ''}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    {invoiceType === 'farmer' ? currentOrder.farmerEmail || '' : currentOrder.traderEmail || ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Invoice Info:</h4>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Order ID:</strong> {currentOrder.orderId}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Invoice Type:</strong> {invoiceType === 'farmer' ? 'Farmer Payment' : 'Trader Billing'}
                  </p>
                </div>
              </div>

              {/* Products Table - Dynamic from Order Products */}
              <div style={{ marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Grade</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'center' }}>Quantity</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Price/Unit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Depreciation (-)</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Appreciation (+)</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData[invoiceType].products.map((product, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                          {editingInvoice ? (
                            <input
                              type="text"
                              value={product.grade}
                              onChange={(e) => handleProductChange(index, 'grade', e.target.value as any)}
                              style={{ width: '100%', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                            />
                          ) : (
                            <strong>{product.grade}</strong>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                              style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'center' }}
                            />
                          ) : (
                            product.quantity
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.price)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', color: '#dc3545' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.depreciation || 0}
                              onChange={(e) => handleProductChange(index, 'depreciation', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.depreciation || 0)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', color: '#198754' }}>
                          {editingInvoice ? (
                            <input
                              type="number"
                              value={product.appreciation || 0}
                              onChange={(e) => handleProductChange(index, 'appreciation', parseFloat(e.target.value))}
                              style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                            />
                          ) : (
                            formatCurrency(product.appreciation || 0)
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                          {formatCurrency(product.total + (product.appreciation || 0) - (product.depreciation || 0))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td colSpan={5} style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                        Products Total:
                      </td>
                      <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: '600' }}>
                        {formatCurrency(invoiceData[invoiceType].products.reduce((sum, p) => sum + p.total + (p.appreciation || 0) - (p.depreciation || 0), 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Processing Fees, Labor, Transport - Dynamic from Fee Structure */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Processing Fees</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer (%):</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].processingFees.farmer}
                        onChange={(e) => handleInvoiceChange('processingFees', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].processingFees.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader (%):</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].processingFees.trader}
                        onChange={(e) => handleInvoiceChange('processingFees', parseFloat(e.target.value), 'trader')}
                        style={{ width: '80px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].processingFees.trader)}</span>
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Labour Charges</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].labor.farmer}
                        onChange={(e) => handleInvoiceChange('labor', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].labor.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].labor.trader}
                        onChange={(e) => handleInvoiceChange('labor', parseFloat(e.target.value), 'trader')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].labor.trader)}</span>
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Transport Charges</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Farmer:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].transport.farmer}
                        onChange={(e) => handleInvoiceChange('transport', parseFloat(e.target.value), 'farmer')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].transport.farmer)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trader:</span>
                    {editingInvoice ? (
                      <input
                        type="number"
                        value={invoiceData[invoiceType].transport.trader}
                        onChange={(e) => handleInvoiceChange('transport', parseFloat(e.target.value), 'trader')}
                        style={{ width: '100px', padding: '0.25rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                      />
                    ) : (
                      <span>{formatCurrency(invoiceData[invoiceType].transport.trader)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Calculation */}
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST (18%):</span>
                  <strong>{formatCurrency(invoiceData[invoiceType].gstAmount)}</strong>
                </div>
              </div>

              {/* Advance Payment */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.25rem' }}>
                  <h4 style={{ margin: 0, color: '#495057' }}>Advance Payment</h4>
                  {editingInvoice ? (
                    <input
                      type="number"
                      value={invoiceData[invoiceType].advance}
                      onChange={(e) => handleInvoiceChange('advance', parseFloat(e.target.value))}
                      style={{ width: '150px', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem', textAlign: 'right' }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                      {formatCurrency(invoiceData[invoiceType].advance)}
                    </span>
                  )}
                </div>
              </div>

              {/* Final Total */}
              <div style={{ borderTop: '2px solid #495057', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#495057' }}>
                      {invoiceType === 'farmer' ? 'Amount Payable to Farmer' : 'Amount Receivable from Trader'}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
                      Net Amount: {formatCurrency(invoiceData[invoiceType].netAmount)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#198754' }}>
                      {formatCurrency(invoiceData[invoiceType].finalAmount)}
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
                      Inclusive of all charges and taxes
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer - Dynamic Terms & Conditions */}
              <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
                <div>
                  <p style={{ margin: '0.25rem 0' }}><strong>Terms & Conditions:</strong></p>
                  {invoiceSettings.termsConditions.map((term, index) => (
                    <p key={index} style={{ margin: '0.25rem 0' }}>{term}</p>
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0.25rem 0' }}>For {invoiceSettings.companyName || 'AGRI TRADING COMPANY'}</p>
                  <div style={{ marginTop: '2rem' }}>
                    <p style={{ margin: '0.25rem 0' }}>Authorized Signature</p>
                    <p style={{ margin: '0.25rem 0' }}>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem'
            }}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={closeInvoiceModal}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#198754',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={saveInvoice}
              >
                💾 Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && currentOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.375rem',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#0d6efd',
              color: '#fff',
              padding: '1rem',
              borderTopLeftRadius: '0.375rem',
              borderTopRightRadius: '0.375rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                📄 Order Details
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1rem' }}>
              {/* Order Information */}
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#495057' }}>
                    ℹ️ Order Information
                  </h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Order ID:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.orderId}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Trader:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              {currentOrder.traderName}
                              {currentOrder.traderMobile && (
                                <>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>{currentOrder.traderMobile}</small>
                                </>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Farmer:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              {currentOrder.farmerName || 'N/A'}
                              {currentOrder.farmerMobile && (
                                <>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>{currentOrder.farmerMobile}</small>
                                </>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Order Status:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.875em',
                                fontWeight: '500',
                                ...getStatusBadgeStyle(currentOrder.orderStatus)
                              }}>
                                {currentOrder.orderStatus}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Transporter Status:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25em 0.5em',
                                borderRadius: '0.25rem',
                                fontSize: '0.875em',
                                fontWeight: '500',
                                ...getStatusBadgeStyle(currentOrder.transporterStatus || 'pending')
                              }}>
                                {currentOrder.transporterStatus || 'pending'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Created At:</td>
                            <td style={{ padding: '0.5rem 0' }}>{new Date(currentOrder.createdAt).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Trader to Admin Payment */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  borderLeft: '3px solid #0d6efd',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#0d6efd',
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      ➡️ Trader to Admin Payment
                    </h4>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    {currentOrder.traderToAdminPayment ? (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Total Amount:</span>
                            <strong style={{ fontSize: '1.125rem' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.totalAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Paid Amount:</span>
                            <strong style={{ color: '#198754' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.paidAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Remaining:</span>
                            <strong style={{ color: '#dc3545' }}>
                              {formatCurrency(currentOrder.traderToAdminPayment.remainingAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6c757d' }}>Status:</span>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25em 0.5em',
                              borderRadius: '0.25rem',
                              fontSize: '0.875em',
                              fontWeight: '500',
                              ...getStatusBadgeStyle(currentOrder.traderToAdminPayment.paymentStatus)
                            }}>
                              {currentOrder.traderToAdminPayment.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {currentOrder.traderToAdminPayment.paymentHistory &&
                          currentOrder.traderToAdminPayment.paymentHistory.length > 0 && (
                            <div>
                              <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#495057' }}>
                                Payment History:
                              </h5>
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Date</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Amount</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Payment ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentOrder.traderToAdminPayment.paymentHistory.map(
                                      (payment, idx) => (
                                        <tr key={idx}>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small>{new Date(payment.paidDate).toLocaleDateString()}</small>
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            {formatCurrency(payment.amount)}
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small style={{ color: '#6c757d' }}>
                                              {payment.razorpayPaymentId || 'N/A'}
                                            </small>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                      </>
                    ) : (
                      <p style={{ color: '#6c757d', margin: 0 }}>No payment details available</p>
                    )}
                  </div>
                </div>

                {/* Admin to Farmer Payment */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  borderLeft: '3px solid #198754',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#198754',
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      ➡️ Admin to Farmer Payment
                    </h4>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    {currentOrder.adminToFarmerPayment ? (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Total Amount:</span>
                            <strong style={{ fontSize: '1.125rem' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.totalAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Paid Amount:</span>
                            <strong style={{ color: '#198754' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.paidAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6c757d' }}>Remaining:</span>
                            <strong style={{ color: '#dc3545' }}>
                              {formatCurrency(currentOrder.adminToFarmerPayment.remainingAmount)}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6c757d' }}>Status:</span>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25em 0.5em',
                              borderRadius: '0.25rem',
                              fontSize: '0.875em',
                              fontWeight: '500',
                              ...getStatusBadgeStyle(currentOrder.adminToFarmerPayment.paymentStatus)
                            }}>
                              {currentOrder.adminToFarmerPayment.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {currentOrder.adminToFarmerPayment.paymentHistory &&
                          currentOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
                            <div>
                              <h5 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#495057' }}>
                                Payment History:
                              </h5>
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Date</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Amount</th>
                                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057' }}>Payment ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentOrder.adminToFarmerPayment.paymentHistory.map(
                                      (payment, idx) => (
                                        <tr key={idx}>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small>{new Date(payment.paidDate).toLocaleDateString()}</small>
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            {formatCurrency(payment.amount)}
                                          </td>
                                          <td style={{ padding: '0.5rem', border: '1px solid #dee2e6' }}>
                                            <small style={{ color: '#6c757d' }}>
                                              {payment.razorpayPaymentId || 'N/A'}
                                            </small>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                      </>
                    ) : (
                      <p style={{ color: '#6c757d', margin: 0 }}>No payment details available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Items */}
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#495057' }}>
                    📦 Product Items
                  </h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Product</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Grade</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Quantity</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Price/Unit</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Total</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Market</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrder.productItems.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.productName}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.grade}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{formatCurrency(item.pricePerUnit)}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                              <strong>{formatCurrency(item.totalAmount)}</strong>
                            </td>
                            <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                              {item.marketDetails ? (
                                <>
                                  <strong>{item.marketDetails.marketName}</strong>
                                  <br />
                                  <small style={{ color: '#6c757d' }}>
                                    {item.marketDetails.exactAddress}
                                    {item.marketDetails.district && (
                                      <>, {item.marketDetails.district}</>
                                    )}
                                  </small>
                                </>
                              ) : (
                                item.nearestMarket || 'N/A'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Transporter Details and Verification */}
              {currentOrder.transporterDetails && (
                <>
                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #0dcaf0',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#0dcaf0',
                      color: '#fff',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem' }}>
                        🚚 Transporter Information
                      </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Name:</td>
                                <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.transporterDetails.transporterName}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Mobile:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.transporterMobile || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Email:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.transporterEmail || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Driver:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.driverName || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d', width: '40%' }}>Vehicle Type:</td>
                                <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{currentOrder.transporterDetails.vehicleType}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Vehicle Number:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.vehicleNumber}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Capacity:</td>
                                <td style={{ padding: '0.5rem 0' }}>{currentOrder.transporterDetails.vehicleCapacity || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6c757d' }}>Accepted At:</td>
                                <td style={{ padding: '0.5rem 0' }}>{new Date(currentOrder.transporterDetails.acceptedAt).toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #198754',
                    borderRadius: '0.375rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#198754',
                      color: '#fff',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem' }}>
                        ✅ Verification Checklist
                      </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div
                        onMouseEnter={(e) => {
                          // hover color
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          // restore original color based on condition
                          e.currentTarget.style.backgroundColor =
                            verificationData.transporterReached ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.transporterReached
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.transporterReached}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                transporterReached: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Transporter Reached Destination</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Confirm that transporter has arrived at the delivery location
                            </small>
                          </div>
                        </label>
                      </div>

                      <div
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            verificationData.goodsConditionCorrect ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.goodsConditionCorrect
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.goodsConditionCorrect}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                goodsConditionCorrect: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Goods Condition is Correct</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Verify that goods are in good condition without damage
                            </small>
                          </div>
                        </label>
                      </div>

                      <div
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            verificationData.quantityCorrect ? '#d1e7dd' : '#f8f9fa';
                        }}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '1rem',
                          borderRadius: '0.25rem',
                          backgroundColor: verificationData.quantityCorrect
                            ? '#d1e7dd'
                            : '#f8f9fa',
                          transition: 'background-color 0.2s',
                        }}
                      >

                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verificationData.quantityCorrect}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                quantityCorrect: e.target.checked,
                              })
                            }
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                          />
                          <div>
                            <strong>Quantity is Correct</strong>
                            <small style={{ display: 'block', color: '#6c757d', marginTop: '0.25rem' }}>
                              Confirm that delivered quantity matches order quantity
                            </small>
                          </div>
                        </label>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                          Admin Notes
                        </label>
                        <textarea
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #ced4da',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                          placeholder="Add any notes or observations..."
                          value={verificationData.adminNotes}
                          onChange={(e) =>
                            setVerificationData({
                              ...verificationData,
                              adminNotes: e.target.value,
                            })
                          }
                        />
                      </div>

                      {currentOrder.transporterDetails.verifiedAt && (
                        <div style={{
                          backgroundColor: '#d1ecf1',
                          color: '#0c5460',
                          padding: '0.75rem',
                          borderRadius: '0.25rem',
                          marginBottom: '1rem',
                          border: '1px solid #bee5eb'
                        }}>
                          <small>
                            ℹ️ Last verified by{' '}
                            <strong>
                              {currentOrder.transporterDetails.verifiedByName || 'Admin'}
                            </strong>{' '}
                            on{' '}
                            {new Date(
                              currentOrder.transporterDetails.verifiedAt
                            ).toLocaleString()}
                          </small>
                        </div>
                      )}

                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#198754',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '1rem'
                        }}
                        onClick={saveVerification}
                      >
                        ✅ Save Verification
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!currentOrder.transporterDetails && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  marginTop: '1rem',
                  border: '1px solid #ffeaa7'
                }}>
                  ⚠️ No transporter assigned to this order yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
