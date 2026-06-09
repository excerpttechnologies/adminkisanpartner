// // app/_components/b2b/B2BRefundList.tsx
// "use client";

// import React, { useState, useEffect } from "react";

// interface RefundItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
//   reason: string;
//   _id: string;
// }

// interface B2BRefund {
//   _id: string;
//   refundId: string;
//   orderId: string;
//   b2bUserId: string;
//   razorpayPaymentId: string;
//   razorpayRefundId?: string;
//   approvedBy: string;
//   processedBy: string;
//   staffRemarks: string;
//   amount: number;
//   refundAmount: number;
//   reason: string;
//   description?: string;
//   refundType: "full" | "partial";
//   items: RefundItem[];
//   status: "requested" | "approved" | "processing" | "completed" | "rejected" | "cancelled" | "failed";
//   transactionId?: string;
//   refundMode: "razorpay" | "bank_transfer" | "wallet" | "manual";
//   requestedAt: string;
//   approvedAt?: string;
//   processedAt?: string;
//   completedAt?: string;
//   userRemarks?: string;
//   adminRemarks?: string;
//   errorMessage?: string;
//   retryCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// const B2BRefundList: React.FC = () => {
//   const [refunds, setRefunds] = useState<B2BRefund[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRefund, setSelectedRefund] = useState<B2BRefund | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     refundId: "",
//     orderId: "",
//     status: "",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 10;

//   const fetchRefunds = async (page = 1) => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: itemsPerPage.toString(),
//         ...(filters.refundId && { refundId: filters.refundId }),
//         ...(filters.orderId && { orderId: filters.orderId }),
//         ...(filters.status && { status: filters.status }),
//       });

//       const response = await fetch(`/api/b2b-re-fund?${queryParams}`);
//       const result = await response.json();

//       if (result.success) {
//         setRefunds(result.data);
//         setTotalPages(result.pagination.totalPages);
//         setCurrentPage(page);
//       } else {
//         console.error("Failed to fetch refunds");
//       }
//     } catch (error) {
//       console.error("Error fetching refunds:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRefunds();
//   }, [filters]);

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       requested: "bg-blue-100 text-blue-800",
//       approved: "bg-yellow-100 text-yellow-800",
//       processing: "bg-purple-100 text-purple-800",
//       completed: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//       cancelled: "bg-gray-100 text-gray-800",
//       failed: "bg-red-100 text-red-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const statistics = {
//     total: refunds.length,
//     totalAmount: refunds.reduce((sum, r) => sum + r.refundAmount, 0),
//     completed: refunds.filter((r) => r.status === "completed").length,
//     pending: refunds.filter((r) => r.status === "requested" || r.status === "processing").length,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">B2B Refund Management</h1>
//           <p className="text-gray-600 mt-2">Manage and track all refund requests from B2B customers</p>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-600">Total Refunds</div>
//             <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-600">Total Amount</div>
//             <div className="text-2xl font-bold text-green-600">₹{statistics.totalAmount.toFixed(2)}</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-600">Completed</div>
//             <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-600">Pending</div>
//             <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow mb-6 p-4">
//           <div className="flex flex-wrap gap-3">
//             <input
//               type="text"
//               placeholder="Search by Refund ID"
//               value={filters.refundId}
//               onChange={(e) => setFilters({ ...filters, refundId: e.target.value })}
//               className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Search by Order ID"
//               value={filters.orderId}
//               onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
//               className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="requested">Requested</option>
//               <option value="approved">Approved</option>
//               <option value="processing">Processing</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//               <option value="failed">Failed</option>
//             </select>
//             <button
//               onClick={() => {
//                 setFilters({ refundId: "", orderId: "", status: "" });
//                 fetchRefunds();
//               }}
//               className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-2 text-gray-600">Loading...</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {refunds.map((refund) => (
//                       <tr key={refund._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-blue-600">{refund.refundId}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono">{refund.orderId}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <span className="text-sm font-semibold text-green-600">₹{refund.refundAmount.toFixed(2)}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${refund.refundType === 'full' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
//                             {refund.refundType.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(refund.status)}`}>
//                             {refund.status.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm">{refund.refundMode.toUpperCase()}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {formatDate(refund.requestedAt)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             onClick={() => {
//                               setSelectedRefund(refund);
//                               setModalOpen(true);
//                             }}
//                             className="text-blue-600 hover:text-blue-800 font-medium"
//                           >
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
//                   <button
//                     onClick={() => fetchRefunds(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm text-gray-700">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => fetchRefunds(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {modalOpen && selectedRefund && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//               <h2 className="text-xl font-bold">Refund Details - {selectedRefund.refundId}</h2>
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Refund ID</label>
//                   <p className="text-sm font-mono text-blue-600">{selectedRefund.refundId}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Order ID</label>
//                   <p className="text-sm font-mono">{selectedRefund.orderId}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Amount</label>
//                   <p className="text-lg font-bold text-green-600">₹{selectedRefund.refundAmount.toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Status</label>
//                   <p>
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRefund.status)}`}>
//                       {selectedRefund.status.toUpperCase()}
//                     </span>
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Refund Type</label>
//                   <p>{selectedRefund.refundType.toUpperCase()}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Refund Mode</label>
//                   <p>{selectedRefund.refundMode.toUpperCase()}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Razorpay Payment ID</label>
//                   <p className="text-sm font-mono">{selectedRefund.razorpayPaymentId}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Razorpay Refund ID</label>
//                   <p className="text-sm font-mono">{selectedRefund.razorpayRefundId || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Approved By</label>
//                   <p>{selectedRefund.approvedBy}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Processed By</label>
//                   <p>{selectedRefund.processedBy}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="text-sm font-medium text-gray-500">Reason</label>
//                   <p>{selectedRefund.reason}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="text-sm font-medium text-gray-500">Staff Remarks</label>
//                   <p>{selectedRefund.staffRemarks || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Requested At</label>
//                   <p>{formatDate(selectedRefund.requestedAt)}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Completed At</label>
//                   <p>{selectedRefund.completedAt ? formatDate(selectedRefund.completedAt) : "Pending"}</p>
//                 </div>
//               </div>

//               {/* Items Table */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Refunded Items</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200 border">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
//                         <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Quantity</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reason</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedRefund.items.map((item) => (
//                         <tr key={item._id}>
//                           <td className="px-4 py-2 text-sm">{item.productName}</td>
//                           <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
//                           <td className="px-4 py-2 text-sm text-right">₹{item.price.toFixed(2)}</td>
//                           <td className="px-4 py-2 text-sm text-right">₹{item.subtotal.toFixed(2)}</td>
//                           <td className="px-4 py-2 text-sm">{item.reason}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
            
//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default B2BRefundList;












// // app/_components/b2b/B2BRefundList.tsx
// "use client";

// import React, { useState, useEffect } from "react";

// interface RefundItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
//   reason: string;
//   _id: string;
// }

// interface B2BRefund {
//   _id: string;
//   refundId: string;
//   orderId: string;
//   b2bUserId: string;
//   razorpayPaymentId: string;
//   razorpayRefundId?: string;
//   approvedBy: string;
//   processedBy: string;
//   staffRemarks: string;
//   amount: number;
//   refundAmount: number;
//   reason: string;
//   description?: string;
//   refundType: "full" | "partial";
//   items: RefundItem[];
//   status: "requested" | "approved" | "processing" | "completed" | "rejected" | "cancelled" | "failed";
//   transactionId?: string;
//   refundMode: "razorpay" | "bank_transfer" | "wallet" | "manual";
//   requestedAt: string;
//   approvedAt?: string;
//   processedAt?: string;
//   completedAt?: string;
//   userRemarks?: string;
//   adminRemarks?: string;
//   errorMessage?: string;
//   retryCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// const B2BRefundList: React.FC = () => {
//   const [refunds, setRefunds] = useState<B2BRefund[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRefund, setSelectedRefund] = useState<B2BRefund | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     refundId: "",
//     orderId: "",
//     status: "",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 10;

//   const fetchRefunds = async (page = 1) => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: itemsPerPage.toString(),
//         ...(filters.refundId && { refundId: filters.refundId }),
//         ...(filters.orderId && { orderId: filters.orderId }),
//         ...(filters.status && { status: filters.status }),
//       });

//       const response = await fetch(`/api/b2b-re-fund?${queryParams}`);
//       const result = await response.json();

//       if (result.success) {
//         setRefunds(result.data);
//         setTotalPages(result.pagination.totalPages);
//         setCurrentPage(page);
//       } else {
//         console.error("Failed to fetch refunds");
//       }
//     } catch (error) {
//       console.error("Error fetching refunds:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRefunds();
//   }, [filters]);

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       requested: "bg-blue-100 text-blue-800",
//       approved: "bg-yellow-100 text-yellow-800",
//       processing: "bg-purple-100 text-purple-800",
//       completed: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//       cancelled: "bg-gray-100 text-gray-800",
//       failed: "bg-red-100 text-red-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const statistics = {
//     total: refunds.length,
//     totalAmount: refunds.reduce((sum, r) => sum + r.refundAmount, 0),
//     completed: refunds.filter((r) => r.status === "completed").length,
//     pending: refunds.filter((r) => r.status === "requested" || r.status === "processing").length,
//   };

//   return (
//     // Removed min-h-screen and outer padding - let parent handle spacing
//     <div className="py-6 lg:py-8">
//       {/* Header */}
//       <div className="mb-6 lg:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">B2B Refund Management</h1>
//         <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage and track all refund requests from B2B customers</p>
//       </div>

//       {/* Statistics Cards - Responsive Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
//           <div className="text-xs sm:text-sm text-gray-600">Total Refunds</div>
//           <div className="text-xl sm:text-2xl font-bold text-gray-900">{statistics.total}</div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
//           <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
//           <div className="text-xl sm:text-2xl font-bold text-green-600">₹{statistics.totalAmount.toFixed(2)}</div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
//           <div className="text-xs sm:text-sm text-gray-600">Completed</div>
//           <div className="text-xl sm:text-2xl font-bold text-green-600">{statistics.completed}</div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4 sm:p-6">
//           <div className="text-xs sm:text-sm text-gray-600">Pending</div>
//           <div className="text-xl sm:text-2xl font-bold text-yellow-600">{statistics.pending}</div>
//         </div>
//       </div>

//       {/* Filters - Responsive */}
//       <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-5">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by Refund ID"
//               value={filters.refundId}
//               onChange={(e) => setFilters({ ...filters, refundId: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by Order ID"
//               value={filters.orderId}
//               onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
//           <div className="sm:w-48">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             >
//               <option value="">All Status</option>
//               <option value="requested">Requested</option>
//               <option value="approved">Approved</option>
//               <option value="processing">Processing</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//               <option value="failed">Failed</option>
//             </select>
//           </div>
//           <div>
//             <button
//               onClick={() => {
//                 setFilters({ refundId: "", orderId: "", status: "" });
//                 fetchRefunds();
//               }}
//               className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition text-sm"
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <p className="mt-2 text-gray-600">Loading...</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View - Hidden on mobile */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {refunds.map((refund) => (
//                     <tr key={refund._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-mono text-blue-600">{refund.refundId}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-mono">{refund.orderId}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right">
//                         <span className="text-sm font-semibold text-green-600">₹{refund.refundAmount.toFixed(2)}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${refund.refundType === 'full' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
//                           {refund.refundType.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(refund.status)}`}>
//                           {refund.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm">{refund.refundMode.toUpperCase()}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {formatDate(refund.requestedAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => {
//                             setSelectedRefund(refund);
//                             setModalOpen(true);
//                           }}
//                           className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//                         >
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Card View - Visible only on mobile/tablet */}
//             <div className="lg:hidden divide-y divide-gray-200">
//               {refunds.map((refund) => (
//                 <div key={refund._id} className="p-4 hover:bg-gray-50 transition-colors">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                           {refund.refundId}
//                         </span>
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(refund.status)}`}>
//                           {refund.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-500">Order ID:</span>
//                           <span className="font-mono text-gray-900">{refund.orderId}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-500">Amount:</span>
//                           <span className="font-bold text-green-600">₹{refund.refundAmount.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-500">Type:</span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${refund.refundType === 'full' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
//                             {refund.refundType.toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-500">Mode:</span>
//                           <span className="text-gray-900">{refund.refundMode.toUpperCase()}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-500">Requested:</span>
//                           <span className="text-gray-600 text-xs">{formatDate(refund.requestedAt)}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         setSelectedRefund(refund);
//                         setModalOpen(true);
//                       }}
//                       className="ml-3 text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap"
//                     >
//                       View Details →
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Empty State */}
//             {refunds.length === 0 && (
//               <div className="text-center py-12">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <p className="mt-2 text-gray-600">No refund requests found</p>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
//                 <button
//                   onClick={() => fetchRefunds(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
//                 >
//                   Previous
//                 </button>
//                 <span className="text-sm text-gray-700">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => fetchRefunds(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Modal - Responsive */}
//       {modalOpen && selectedRefund && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
//               <h2 className="text-lg sm:text-xl font-bold truncate">Refund Details - {selectedRefund.refundId}</h2>
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl leading-none flex-shrink-0 ml-2"
//               >
//                 ×
//               </button>
//             </div>
            
//             <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//               {/* Basic Info - Responsive Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Refund ID</label>
//                   <p className="text-sm font-mono text-blue-600 break-all">{selectedRefund.refundId}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Order ID</label>
//                   <p className="text-sm font-mono break-all">{selectedRefund.orderId}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Amount</label>
//                   <p className="text-base sm:text-lg font-bold text-green-600">₹{selectedRefund.refundAmount.toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Status</label>
//                   <p>
//                     <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusColor(selectedRefund.status)}`}>
//                       {selectedRefund.status.toUpperCase()}
//                     </span>
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Refund Type</label>
//                   <p className="text-sm">{selectedRefund.refundType.toUpperCase()}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Refund Mode</label>
//                   <p className="text-sm">{selectedRefund.refundMode.toUpperCase()}</p>
//                 </div>
//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Razorpay Payment ID</label>
//                   <p className="text-xs sm:text-sm font-mono break-all">{selectedRefund.razorpayPaymentId}</p>
//                 </div>
//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Razorpay Refund ID</label>
//                   <p className="text-xs sm:text-sm font-mono break-all">{selectedRefund.razorpayRefundId || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Approved By</label>
//                   <p className="text-sm break-all">{selectedRefund.approvedBy}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Processed By</label>
//                   <p className="text-sm break-all">{selectedRefund.processedBy}</p>
//                 </div>
//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Reason</label>
//                   <p className="text-sm break-words">{selectedRefund.reason}</p>
//                 </div>
//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Staff Remarks</label>
//                   <p className="text-sm break-words">{selectedRefund.staffRemarks || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Requested At</label>
//                   <p className="text-xs sm:text-sm">{formatDate(selectedRefund.requestedAt)}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-medium text-gray-500">Completed At</label>
//                   <p className="text-xs sm:text-sm">{selectedRefund.completedAt ? formatDate(selectedRefund.completedAt) : "Pending"}</p>
//                 </div>
//               </div>

//               {/* Items Table - Responsive */}
//               <div>
//                 <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Refunded Items</h3>
                
//                 {/* Desktop Items Table */}
//                 <div className="hidden sm:block overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200 border">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
//                         <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Quantity</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reason</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedRefund.items.map((item) => (
//                         <tr key={item._id}>
//                           <td className="px-4 py-2 text-sm">{item.productName}</td>
//                           <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
//                           <td className="px-4 py-2 text-sm text-right">₹{item.price.toFixed(2)}</td>
//                           <td className="px-4 py-2 text-sm text-right">₹{item.subtotal.toFixed(2)}</td>
//                           <td className="px-4 py-2 text-sm">{item.reason}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile Items Cards */}
//                 <div className="sm:hidden space-y-3">
//                   {selectedRefund.items.map((item) => (
//                     <div key={item._id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                       <div className="font-medium text-sm mb-2">{item.productName}</div>
//                       <div className="space-y-1 text-xs">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Quantity:</span>
//                           <span className="font-medium">{item.quantity}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Price:</span>
//                           <span className="font-medium">₹{item.price.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Subtotal:</span>
//                           <span className="font-medium text-green-600">₹{item.subtotal.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Reason:</span>
//                           <span className="text-right flex-1 ml-2">{item.reason}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default B2BRefundList;













// app/_components/b2b/B2BRefundList.tsx
"use client";

import React, { useState, useEffect } from "react";

interface RefundItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  reason: string;
  _id: string;
}

interface B2BRefund {
  _id: string;
  refundId: string;
  orderId: string;
  b2bUserId: string;
  razorpayPaymentId: string;
  razorpayRefundId?: string;
  approvedBy: string;
  processedBy: string;
  staffRemarks: string;
  amount: number;
  refundAmount: number;
  reason: string;
  description?: string;
  refundType: "full" | "partial";
  items: RefundItem[];
  status: "requested" | "approved" | "processing" | "completed" | "rejected" | "cancelled" | "failed";
  transactionId?: string;
  refundMode: "razorpay" | "bank_transfer" | "wallet" | "manual";
  requestedAt: string;
  approvedAt?: string;
  processedAt?: string;
  completedAt?: string;
  userRemarks?: string;
  adminRemarks?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

const B2BRefundList: React.FC = () => {
  const [refunds, setRefunds] = useState<B2BRefund[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<B2BRefund | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    refundId: "",
    orderId: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const fetchRefunds = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(filters.refundId && { refundId: filters.refundId }),
        ...(filters.orderId && { orderId: filters.orderId }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await fetch(`/api/b2b-re-fund?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setRefunds(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(page);
      } else {
        console.error("Failed to fetch refunds");
      }
    } catch (error) {
      console.error("Error fetching refunds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [filters]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      requested: "bg-blue-100 text-blue-800",
      approved: "bg-yellow-100 text-yellow-800",
      processing: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statistics = {
    total: refunds.length,
    totalAmount: refunds.reduce((sum, r) => sum + r.refundAmount, 0),
    completed: refunds.filter((r) => r.status === "completed").length,
    pending: refunds.filter((r) => r.status === "requested" || r.status === "processing").length,
  };

  return (
    <div className="py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">B2B Refund Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and track all refund requests from B2B customers</p>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="text-xs sm:text-sm text-gray-600">Total Refunds</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{statistics.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">₹{statistics.totalAmount.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{statistics.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{statistics.pending}</div>
        </div>
      </div>

      {/* Filters - Mobile Optimized with Toggle */}
      <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
        {/* Filter Toggle Button for Mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 sm:p-4 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium text-gray-700">Filters</span>
            {(filters.refundId || filters.orderId || filters.status) && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                Active
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter Fields */}
        <div className={`p-3 sm:p-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Refund ID"
                value={filters.refundId}
                onChange={(e) => setFilters({ ...filters, refundId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Order ID"
                value={filters.orderId}
                onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <button
              onClick={() => {
                setFilters({ refundId: "", orderId: "", status: "" });
                fetchRefunds();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View - Optimized for touch */}
            <div className="divide-y divide-gray-200">
              {refunds.map((refund) => (
                <div key={refund._id} className="p-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
                  <div className="space-y-3">
                    {/* Header with Refund ID and Status */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {refund.refundId}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(refund.status)}`}>
                            {refund.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRefund(refund);
                          setModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap ml-2"
                      >
                        Details →
                      </button>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Order ID:</span>
                        <p className="font-mono text-xs truncate">{refund.orderId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Amount:</span>
                        <p className="font-bold text-green-600">₹{refund.refundAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Type:</span>
                        <p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${refund.refundType === 'full' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {refund.refundType.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Mode:</span>
                        <p className="text-gray-900 text-xs">{refund.refundMode.toUpperCase()}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Requested:</span>
                        <p className="text-gray-600 text-xs">{formatDate(refund.requestedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {refunds.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-gray-600">No refund requests found</p>
              </div>
            )}

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200">
                <div className="flex justify-between items-center gap-2">
                  <button
                    onClick={() => fetchRefunds(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => fetchRefunds(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal - Mobile Optimized */}
      {modalOpen && selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-xl sm:rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold truncate flex-1">Refund Details</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none ml-2"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Quick Info Cards */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Refund ID</div>
                <div className="font-mono text-sm text-blue-600 break-all">{selectedRefund.refundId}</div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Order ID</div>
                  <div className="font-mono text-xs break-all">{selectedRefund.orderId}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="text-base font-bold text-green-600">₹{selectedRefund.refundAmount.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Status</div>
                  <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusColor(selectedRefund.status)}`}>
                    {selectedRefund.status.toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Type / Mode</div>
                  <div className="text-xs">{selectedRefund.refundType.toUpperCase()} • {selectedRefund.refundMode.toUpperCase()}</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Reason</label>
                  <p className="text-sm bg-gray-50 rounded-lg p-2 mt-1">{selectedRefund.reason}</p>
                </div>
                {selectedRefund.staffRemarks && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Staff Remarks</label>
                    <p className="text-sm bg-gray-50 rounded-lg p-2 mt-1">{selectedRefund.staffRemarks}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Requested At</label>
                    <p className="text-xs mt-1">{formatDate(selectedRefund.requestedAt)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Completed At</label>
                    <p className="text-xs mt-1">{selectedRefund.completedAt ? formatDate(selectedRefund.completedAt) : "Pending"}</p>
                  </div>
                </div>
              </div>

              {/* Refunded Items */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Refunded Items ({selectedRefund.items.length})</h3>
                <div className="space-y-2">
                  {selectedRefund.items.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-sm mb-2">{item.productName}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-1 font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-1 font-medium">₹{item.price.toFixed(2)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="ml-1 font-medium text-green-600">₹{item.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Reason:</span>
                          <span className="ml-1">{item.reason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BRefundList;