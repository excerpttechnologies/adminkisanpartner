






// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Search,
//   Filter,
//   Package,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import Pagination from "@mui/material/Pagination";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   date: string;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 10;

//   /* =========================
//      FETCH ORDERS
//   ========================= */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `/api/b2b-orders?page=${page}&limit=${limit}&status=${filterStatus}&search=${searchTerm}`
//         );

//         const json = await res.json();

//         if (json.success) {
//           const formatted = json.data.map((order: any) => ({
//            id: order._id,
//              orderId: order.orderId,
//             customer: order.addressSnapshot?.fullName || "N/A",
//             product:
//               order.items?.[0]?.productName || "Multiple Items",
//             quantity:
//               order.items?.reduce(
//                 (sum: number, item: any) => sum + item.quantity,
//                 0
//               ) + " items",
//             total: `₹${order.totalAmount}`,
//             status: mapStatus(order.status),
//             date: order.createdAt,
//           }));

//           setOrders(formatted);
//           setTotalPages(json.pagination.totalPages);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [page, searchTerm, filterStatus]);

//   /* =========================
//      STATS
//   ========================= */
//   const stats = {
//     total: orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   /* =========================
//      LOADING
//   ========================= */
//   if (loading) {
//     return <div className="p-10 text-center">Loading orders...</div>;
//   }

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="p-4 bg-white rounded-xl shadow">
//           <ShoppingBag /> Total: {stats.total}
//         </div>
//         <div className="p-4 bg-white rounded-xl shadow">
//           <DollarSign /> Revenue: ₹{stats.revenue}
//         </div>
//         <div className="p-4 bg-white rounded-xl shadow">
//           <CheckCircle /> Delivered: {stats.delivered}
//         </div>
//         <div className="p-4 bg-white rounded-xl shadow">
//           <AlertCircle /> Pending: {stats.pending}
//         </div>
//       </div>

//       {/* FILTERS */}
//       <div className="flex gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => {
//             setPage(1);
//             setSearchTerm(e.target.value);
//           }}
//           className="border p-2 rounded"
//         />

//         <select
//           value={filterStatus}
//           onChange={(e) => {
//             setPage(1);
//             setFilterStatus(e.target.value);
//           }}
//           className="border p-2 rounded"
//         >
//           <option value="all">All</option>
//           <option value="pending">Pending</option>
//           <option value="processing">Processing</option>
//           <option value="shipped">Shipped</option>
//           <option value="delivered">Delivered</option>
//         </select>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-auto">
//         <table className="w-full">
//           <thead className="bg-gray-100 text-sm">
//             <tr>
//               <th className="p-3 text-left">Order ID</th>
//               <th className="p-3 text-left">Customer</th>
//               <th className="p-3 text-left">Product</th>
//               <th className="p-3 text-left">Qty</th>
//               <th className="p-3 text-left">Total</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className="border-t">
//                 <td className="p-3 font-semibold text-indigo-600">
//                   {order.id}
//                 </td>
//                 <td className="p-3">{order.customer}</td>
//                 <td className="p-3">{order.product}</td>
//                 <td className="p-3">{order.quantity}</td>
//                 <td className="p-3 font-bold">{order.total}</td>
//                 <td className="p-3">{order.status}</td>
//                 <td className="p-3">
//                   {new Date(order.date).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {orders.length === 0 && (
//           <div className="p-6 text-center text-gray-500">
//             <Package size={32} className="mx-auto mb-2" />
//             No orders found
//           </div>
//         )}
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center mt-6">
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={(_, value) => setPage(value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default B2BOrders;











// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   SlidersHorizontal,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   date: string;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   /* =========================
//      FETCH ORDERS
//   ========================= */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//         );
//         const json = await res.json();

//         if (json.success) {
//           const formatted = json.data.map((order: any) => ({
//             id: order._id,
//             orderId: order.orderId,
//             customer: order.addressSnapshot?.fullName || "N/A",
//             product: order.items?.[0]?.productName || "Multiple Items",
//             quantity:
//               order.items?.reduce(
//                 (sum: number, item: any) => sum + item.quantity,
//                 0
//               ) + " items",
//             total: `₹${order.totalAmount}`,
//             status: mapStatus(order.status),
//             date: order.createdAt,
//           }));

//           setOrders(formatted);
//           setTotalPages(json.pagination.totalPages);
//           setTotalCount(json.pagination.total || json.data.length);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   /* =========================
//      STATS
//   ========================= */
//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div
//       className="p-6 min-h-screen"
//       style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* PAGE HEADER */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage and track all B2B orders
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           icon={ShoppingBag}
//           label="Total Orders"
//           value={stats.total}
//           color="bg-indigo-500"
//         />
//         <StatCard
//           icon={DollarSign}
//           label="Total Revenue"
//           value={`₹${stats.revenue.toLocaleString("en-IN")}`}
//           color="bg-green-500"
//         />
//         <StatCard
//           icon={CheckCircle}
//           label="Delivered"
//           value={stats.delivered}
//           color="bg-emerald-500"
//         />
//         <StatCard
//           icon={AlertCircle}
//           label="Pending"
//           value={stats.pending}
//           color="bg-orange-400"
//         />
//       </div>

//       {/* FILTER BAR */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//         <div className="flex flex-wrap gap-3 items-center justify-between">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[220px] max-w-md">
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Search orders, customers..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setPage(1);
//                 setSearchTerm(e.target.value);
//               }}
//               className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
//             />
//           </div>

//           <div className="flex gap-3 items-center flex-wrap">
//             {/* Status Filter */}
//             <div className="relative">
//               <Filter
//                 size={13}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => {
//                   setPage(1);
//                   setFilterStatus(e.target.value);
//                 }}
//                 className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//               </select>
//             </div>

//             {/* Rows per page */}
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span className="font-medium">Rows:</span>
//               {[10, 25, 50, 100].map((n) => (
//                 <button
//                   key={n}
//                   onClick={() => {
//                     setRowsPerPage(n);
//                     setPage(1);
//                   }}
//                   className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                     rowsPerPage === n
//                       ? "bg-indigo-600 text-white shadow"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {n}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SHOWING COUNT */}
//       {!loading && orders.length > 0 && (
//         <p className="text-xs text-gray-500 mb-3 px-1">
//           Showing{" "}
//           <span className="font-semibold text-gray-700">
//             {startItem}–{endItem}
//           </span>{" "}
//           of <span className="font-semibold text-gray-700">{stats.total}</span>{" "}
//           orders · Page {page} of {totalPages}
//         </p>
//       )}

//       {/* TABLE */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-16 text-center">
//             <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//             <p className="text-sm text-gray-500">Loading orders...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Order ID <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Customer <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Product <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Qty <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Total <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                      Status <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Date <SortIcon />
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {orders.map((order, idx) => (
//                   <tr
//                     key={order.id}
//                     className="hover:bg-indigo-50/40 transition-colors"
//                   >
//                     <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
//                       #{order.orderId || order.id.slice(-6).toUpperCase()}
//                     </td>
//                     <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                       {order.customer}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
//                       {order.product}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                       {order.quantity}
//                     </td>
//                     <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
//                       {order.total}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <StatusBadge status={order.status} />
//                     </td>
//                     <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                       {new Date(order.date).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1">
//                         {/* View */}
//                         <button
//                           className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition"
//                           title="View"
//                         >
//                           <Eye size={15} />
//                         </button>
//                         {/* Edit */}
//                         <button
//                           className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition"
//                           title="Edit"
//                         >
//                           <Pencil size={15} />
//                         </button>
//                         {/* Toggle */}
//                         <button
//                           className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition"
//                           title="Toggle Status"
//                         >
//                           <Power size={15} />
//                         </button>
//                         {/* Delete */}
//                         <button
//                           className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
//                           title="Delete"
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {orders.length === 0 && (
//               <div className="py-16 text-center text-gray-400">
//                 <Package size={36} className="mx-auto mb-3 opacity-40" />
//                 <p className="font-medium">No orders found</p>
//                 <p className="text-xs mt-1">Try adjusting your filters</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-2 mt-6">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//           >
//             <ChevronLeft size={15} /> Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .filter(
//               (p) =>
//                 p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
//             )
//             .reduce<(number | "...")[]>((acc, p, idx, arr) => {
//               if (idx > 0 && p - (arr[idx - 1] as number) > 1)
//                 acc.push("...");
//               acc.push(p);
//               return acc;
//             }, [])
//             .map((p, idx) =>
//               p === "..." ? (
//                 <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
//                   …
//                 </span>
//               ) : (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p as number)}
//                   className={`w-9 h-9 text-sm rounded-lg font-semibold transition ${
//                     page === p
//                       ? "bg-indigo-600 text-white shadow"
//                       : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               )
//             )}

//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages}
//             className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//           >
//             Next <ChevronRight size={15} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default B2BOrders;








// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   SlidersHorizontal,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CreditCard,
//   Calendar,
//   Hash,
//   IndianRupee,
//   Banknote,
//   Receipt,
//   Clock,
//   Check,
//   AlertTriangle,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   date: string;
//   raw?: any; // Store full order data for modal
// }

// interface PaymentDetails {
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   amount?: number;
//   currency?: string;
//   status?: "pending" | "success" | "failed";
//   paymentMethod?: string;
//   paidAt?: Date;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE
// ========================= */
// const PaymentStatusBadge = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Success
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Initiated
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// const ViewOrderModal = ({
//   order,
//   onClose,
// }: {
//   order: Order | null;
//   onClose: () => void;
// }) => {
//   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;
//   const paymentDetails: PaymentDetails | undefined = rawOrder.paymentDetails;

//   // Check if payment exists and is successful
//   const hasValidPayment = paymentDetails && paymentDetails.status === "success";
//   const paymentExists = paymentDetails && paymentDetails.status !== undefined;
//   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-100 px-5">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "details"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Order Details
//             {activeTab === "details" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "payment"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Payment Information
//             {!hasValidPayment && paymentNotPaid && (
//               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
//                 Not Paid
//               </span>
//             )}
//             {activeTab === "payment" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-5">
//           {activeTab === "details" ? (
//             <div className="space-y-6">
//               {/* Customer Info */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Package size={14} className="text-indigo-500" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400">Full Name</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-400">Address</p>
//                     <p className="text-gray-700 text-sm">
//                       {rawOrder.addressSnapshot?.addressLine1}
//                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                       <br />
//                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={14} className="text-indigo-500" />
//                   Order Items
//                 </h3>
//                 <div className="space-y-2">
//                   {rawOrder.items?.map((item: any, idx: number) => (
//                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.productName}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                       </div>
//                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="bg-indigo-50/30 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//                   </div>
//                   {rawOrder.tax > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{rawOrder.tax}</span>
//                     </div>
//                   )}
//                   {rawOrder.shippingCharge > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Shipping</span>
//                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                     </div>
//                   )}
//                   {rawOrder.discount > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="text-green-600">-₹{rawOrder.discount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Status Timeline */}
//               {rawOrder.statusHistory && rawOrder.statusHistory.length > 0 && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-700 mb-3">Status History</h3>
//                   <div className="space-y-3">
//                     {rawOrder.statusHistory.map((history: any, idx: number) => (
//                       <div key={idx} className="flex items-start gap-3">
//                         <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5" />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-700 capitalize">{history.status}</p>
//                           {history.note && <p className="text-xs text-gray-500">{history.note}</p>}
//                           <p className="text-xs text-gray-400">
//                             {new Date(history.timestamp).toLocaleString()}
//                             {history.updatedBy && ` by ${history.updatedBy}`}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {/* Payment Status Header */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-sm font-semibold text-gray-700">Payment Status</h3>
//                   <PaymentStatusBadge status={paymentDetails?.status} />
//                 </div>
//                 {!paymentExists && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment has not been initiated for this order.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "pending" && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <Clock size={14} />
//                     Payment is pending. Waiting for customer to complete payment.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "failed" && (
//                   <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment failed. Please check with the customer.
//                   </p>
//                 )}
//               </div>

//               {/* Payment Details */}
//               {paymentExists ? (
//                 <div className="space-y-4">
//                   <div className="bg-white border border-gray-100 rounded-xl p-4">
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                       <CreditCard size={14} className="text-indigo-500" />
//                       Transaction Details
//                     </h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                         <span className="text-sm text-gray-500 flex items-center gap-2">
//                           <Hash size={12} />
//                           Razorpay Order ID
//                         </span>
//                         <span className="text-sm font-mono text-gray-700">
//                           {paymentDetails.razorpayOrderId || "—"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                         <span className="text-sm text-gray-500 flex items-center gap-2">
//                           <Receipt size={12} />
//                           Razorpay Payment ID
//                         </span>
//                         <span className="text-sm font-mono text-gray-700">
//                           {paymentDetails.razorpayPaymentId || "—"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                         <span className="text-sm text-gray-500 flex items-center gap-2">
//                           <IndianRupee size={12} />
//                           Amount
//                         </span>
//                         <span className="text-base font-semibold text-gray-800">
//                           {paymentDetails.currency || "INR"} {paymentDetails.amount || rawOrder.totalAmount}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                         <span className="text-sm text-gray-500 flex items-center gap-2">
//                           <Banknote size={12} />
//                           Payment Method
//                         </span>
//                         <span className="text-sm text-gray-700 capitalize">
//                           {paymentDetails.paymentMethod || "Razorpay"}
//                         </span>
//                       </div>
//                       {paymentDetails.paidAt && (
//                         <div className="flex justify-between items-center py-2">
//                           <span className="text-sm text-gray-500 flex items-center gap-2">
//                             <Calendar size={12} />
//                             Paid At
//                           </span>
//                           <span className="text-sm text-gray-700">
//                             {new Date(paymentDetails.paidAt).toLocaleString()}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-yellow-50/50 rounded-xl p-6 text-center border border-yellow-100">
//                   <CreditCard size={32} className="mx-auto text-yellow-400 mb-3" />
//                   <p className="text-sm text-yellow-700 font-medium">No Payment Information Available</p>
//                   <p className="text-xs text-yellow-500 mt-1">
//                     Payment details will appear once the customer completes the checkout process.
//                   </p>
//                 </div>
//               )}

//               {/* Additional Info for Not Paid Orders */}
//               {paymentNotPaid && (
//                 <div className="bg-blue-50/30 rounded-xl p-4">
//                   <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                     <Clock size={14} className="text-blue-500" />
//                     Payment Pending Actions
//                   </h3>
//                   <p className="text-xs text-gray-600">
//                     You can remind the customer to complete the payment or check back later for updated payment status.
//                     Orders without successful payment will not be processed for shipping.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Add this new modal component after ViewOrderModal
// const EditOrderModal = ({
//   order,
//   onClose,
//   onSave,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onSave: (updatedOrder: any) => void;
// }) => {
//   const [formData, setFormData] = useState({
//     status: "",
//     customer: "",
//     phoneNumber: "",
//     address: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (order?.raw) {
//       setFormData({
//         status: order.raw.status || "",
//         customer: order.raw.addressSnapshot?.fullName || "",
//         phoneNumber: order.raw.addressSnapshot?.phoneNumber || "",
//         address: `${order.raw.addressSnapshot?.addressLine1 || ""} ${
//           order.raw.addressSnapshot?.addressLine2 || ""
//         }`.trim(),
//       });
//     }
//   }, [order]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status: formData.status,
//           addressSnapshot: {
//             fullName: formData.customer,
//             phoneNumber: formData.phoneNumber,
//           },
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         onSave(result.data);
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error updating order:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800">Edit Order</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Order Status
//             </label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Customer Name
//             </label>
//             <input
//               type="text"
//               value={formData.customer}
//               onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={formData.phoneNumber}
//               onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   /* =========================
//      FETCH ORDERS
//   ========================= */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//         );
//         const json = await res.json();

//         if (json.success) {
//           const formatted = json.data.map((order: any) => ({
//             id: order._id,
//             orderId: order.orderId,
//             customer: order.addressSnapshot?.fullName || "N/A",
//             product: order.items?.[0]?.productName || "Multiple Items",
//             quantity:
//               order.items?.reduce(
//                 (sum: number, item: any) => sum + item.quantity,
//                 0
//               ) + " items",
//             total: `₹${order.totalAmount}`,
//             status: mapStatus(order.status),
//             date: order.createdAt,
//             raw: order, // Store full order data
//           }));

//           setOrders(formatted);
//           setTotalPages(json.pagination.totalPages);
//           setTotalCount(json.pagination.total || json.data.length);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   /* =========================
//      STATS
//   ========================= */
//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   /* =========================
//      HANDLERS
//   ========================= */
//   const handleViewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleEditOrder = (order: Order) => {
//     // Placeholder for edit functionality
//     console.log("Edit order:", order);
//     // You can implement edit modal or redirect to edit page
//   };

//   const handleToggleStatus = (order: Order) => {
//     // Placeholder for status toggle
//     console.log("Toggle status for:", order);
//   };

//   const handleDeleteOrder = (order: Order) => {
//     // Placeholder for delete functionality
//     console.log("Delete order:", order);
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <>
//       <div
//         className="p-6 min-h-screen"
//         style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}
//       >
//         {/* PAGE HEADER */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage and track all B2B orders
//           </p>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard
//             icon={ShoppingBag}
//             label="Total Orders"
//             value={stats.total}
//             color="bg-indigo-500"
//           />
//           <StatCard
//             icon={DollarSign}
//             label="Total Revenue"
//             value={`₹${stats.revenue.toLocaleString("en-IN")}`}
//             color="bg-green-500"
//           />
//           <StatCard
//             icon={CheckCircle}
//             label="Delivered"
//             value={stats.delivered}
//             color="bg-emerald-500"
//           />
//           <StatCard
//             icon={AlertCircle}
//             label="Pending"
//             value={stats.pending}
//             color="bg-orange-400"
//           />
//         </div>

//         {/* FILTER BAR */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             {/* Search */}
//             <div className="relative flex-1 min-w-[220px] max-w-md">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search orders, customers..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
//               />
//             </div>

//             <div className="flex gap-3 items-center flex-wrap">
//               {/* Status Filter */}
//               <div className="relative">
//                 <Filter
//                   size={13}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setPage(1);
//                     setFilterStatus(e.target.value);
//                   }}
//                   className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                 </select>
//               </div>

//               {/* Rows per page */}
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="font-medium">Rows:</span>
//                 {[10, 25, 50, 100].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       setRowsPerPage(n);
//                       setPage(1);
//                     }}
//                     className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                       rowsPerPage === n
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SHOWING COUNT */}
//         {!loading && orders.length > 0 && (
//           <p className="text-xs text-gray-500 mb-3 px-1">
//             Showing{" "}
//             <span className="font-semibold text-gray-700">
//               {startItem}–{endItem}
//             </span>{" "}
//             of <span className="font-semibold text-gray-700">{stats.total}</span>{" "}
//             orders · Page {page} of {totalPages}
//           </p>
//         )}

//         {/* TABLE */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-sm text-gray-500">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Order ID <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Customer <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Product <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Qty <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Total <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                        Status <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Date <SortIcon />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order, idx) => (
//                     <tr
//                       key={order.id}
//                       className="hover:bg-indigo-50/40 transition-colors"
//                     >
//                       <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
//                         #{order.orderId || order.id.slice(-6).toUpperCase()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                         {order.customer}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
//                         {order.product}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         {order.quantity}
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
//                         {order.total}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <StatusBadge status={order.status} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                         {new Date(order.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           {/* View */}
//                           <button
//                             onClick={() => handleViewOrder(order)}
//                             className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition"
//                             title="View Order Details"
//                           >
//                             <Eye size={15} />
//                           </button>
//                           {/* Edit */}
//                           <button
//                             onClick={() => handleEditOrder(order)}
//                             className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition"
//                             title="Edit Order"
//                           >
//                             <Pencil size={15} />
//                           </button>
//                           {/* Toggle */}
//                           <button
//                             onClick={() => handleToggleStatus(order)}
//                             className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition"
//                             title="Toggle Status"
//                           >
//                             <Power size={15} />
//                           </button>
//                           {/* Delete */}
//                           <button
//                             onClick={() => handleDeleteOrder(order)}
//                             className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
//                             title="Delete Order"
//                           >
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div className="py-16 text-center text-gray-400">
//                   <Package size={36} className="mx-auto mb-3 opacity-40" />
//                   <p className="font-medium">No orders found</p>
//                   <p className="text-xs mt-1">Try adjusting your filters</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(
//                 (p) =>
//                   p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
//               )
//               .reduce<(number | "...")[]>((acc, p, idx, arr) => {
//                 if (idx > 0 && p - (arr[idx - 1] as number) > 1)
//                   acc.push("...");
//                 acc.push(p);
//                 return acc;
//               }, [])
//               .map((p, idx) =>
//                 p === "..." ? (
//                   <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
//                     …
//                   </span>
//                 ) : (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p as number)}
//                     className={`w-9 h-9 text-sm rounded-lg font-semibold transition ${
//                       page === p
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 )
//               )}

//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* View Order Modal */}
//       {isModalOpen && (
//         <ViewOrderModal
//           order={selectedOrder}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default B2BOrders;









// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CreditCard,
//   Calendar,
//   Hash,
//   IndianRupee,
//   Banknote,
//   Receipt,
//   Clock,
//   Check,
//   AlertTriangle,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   date: string;
//   raw?: any;
// }

// interface PaymentDetails {
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   amount?: number;
//   currency?: string;
//   status?: "pending" | "success" | "failed";
//   paymentMethod?: string;
//   paidAt?: Date;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE
// ========================= */
// const PaymentStatusBadge = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Success
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Initiated
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    TOAST NOTIFICATION
// ========================= */
// const ToastNotification = ({ 
//   message, 
//   type, 
//   onClose 
// }: { 
//   message: string; 
//   type: "success" | "error"; 
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 ${
//       type === "success" ? "bg-green-500" : "bg-red-500"
//     } text-white`}>
//       {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
//       <span className="text-sm font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80">
//         <X size={14} />
//       </button>
//     </div>
//   );
// };

// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// const ViewOrderModal = ({
//   order,
//   onClose,
// }: {
//   order: Order | null;
//   onClose: () => void;
// }) => {
//   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;
//   const paymentDetails: PaymentDetails | undefined = rawOrder.paymentDetails;

//   const hasValidPayment = paymentDetails && paymentDetails.status === "success";
//   const paymentExists = paymentDetails && paymentDetails.status !== undefined;
//   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 px-5">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "details"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Order Details
//             {activeTab === "details" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "payment"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Payment Information
//             {!hasValidPayment && paymentNotPaid && (
//               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
//                 Not Paid
//               </span>
//             )}
//             {activeTab === "payment" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5">
//           {activeTab === "details" ? (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Package size={14} className="text-indigo-500" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400">Full Name</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-400">Address</p>
//                     <p className="text-gray-700 text-sm">
//                       {rawOrder.addressSnapshot?.addressLine1}
//                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                       <br />
//                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={14} className="text-indigo-500" />
//                   Order Items
//                 </h3>
//                 <div className="space-y-2">
//                   {rawOrder.items?.map((item: any, idx: number) => (
//                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.productName}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                       </div>
//                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-indigo-50/30 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//                   </div>
//                   {rawOrder.tax > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{rawOrder.tax}</span>
//                     </div>
//                   )}
//                   {rawOrder.shippingCharge > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Shipping</span>
//                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                     </div>
//                   )}
//                   {rawOrder.discount > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="text-green-600">-₹{rawOrder.discount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-sm font-semibold text-gray-700">Payment Status</h3>
//                   <PaymentStatusBadge status={paymentDetails?.status} />
//                 </div>
//                 {!paymentExists && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment has not been initiated for this order.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "pending" && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <Clock size={14} />
//                     Payment is pending. Waiting for customer to complete payment.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "failed" && (
//                   <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment failed. Please check with the customer.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    EDIT ORDER MODAL - Only Status
// ========================= */
// const EditOrderModal = ({
//   order,
//   onClose,
//   onSave,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onSave: (updatedOrder: any) => void;
// }) => {
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (order?.raw) {
//       setStatus(order.raw.status || "pending");
//     }
//   }, [order]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: status }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onSave(data.data);
//         onClose();
//       } else {
//         setError(data.message || "Failed to update order status");
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-5">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Order Status
//             </label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             >
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//             </select>
//             <p className="text-xs text-gray-500 mt-1">
//               Changing status will be recorded in order history
//             </p>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? "Updating..." : "Update Status"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    DELETE CONFIRMATION MODAL
// ========================= */
// const DeleteConfirmModal = ({
//   order,
//   onClose,
//   onConfirm,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onConfirm: () => void;
// }) => {
//   const [loading, setLoading] = useState(false);

//   if (!order) return null;

//   const handleDelete = async () => {
//     setLoading(true);
//     await onConfirm();
//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-5">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <Trash2 size={24} className="text-red-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
//             Delete Order
//           </h3>
//           <p className="text-sm text-gray-500 text-center mb-6">
//             Are you sure you want to delete order #{order.orderId || order.id.slice(-6).toUpperCase()}?
//             This action cannot be undone.
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
//             >
//               {loading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    MAIN COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState<Order | null>(null);
//   const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         const formatted = json.data.map((order: any) => ({
//           id: order._id,
//           orderId: order.orderId,
//           customer: order.addressSnapshot?.fullName || "N/A",
//           product: order.items?.[0]?.productName || "Multiple Items",
//           quantity:
//             order.items?.reduce(
//               (sum: number, item: any) => sum + item.quantity,
//               0
//             ) + " items",
//           total: `₹${order.totalAmount}`,
//           status: mapStatus(order.status),
//           date: order.createdAt,
//           raw: order,
//         }));

//         setOrders(formatted);
//         setTotalPages(json.pagination.totalPages);
//         setTotalCount(json.pagination.total || json.data.length);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setToast({ message: "Failed to fetch orders", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   const handleViewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleEditOrder = (order: Order) => {
//     setEditingOrder(order);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveOrder = async (updatedOrder: any) => {
//     await fetchOrders();
//     setToast({ message: "Order status updated successfully!", type: "success" });
//   };

//   const handleDeleteOrder = (order: Order) => {
//     setDeletingOrder(order);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingOrder) return;

//     try {
//       const response = await fetch(`/api/b2b-orders/${deletingOrder.id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: "Order deleted successfully!", type: "success" });
//         setIsDeleteModalOpen(false);
//         setDeletingOrder(null);
//       } else {
//         setToast({ message: "Failed to delete order", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   const handleToggleStatus = async (order: Order) => {
//     const statusCycle = ["pending", "processing", "shipped", "delivered"];
//     const currentIndex = statusCycle.indexOf(order.raw?.status || "pending");
//     const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: `Order status updated to ${nextStatus}`, type: "success" });
//       } else {
//         setToast({ message: "Failed to update status", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <>
//       <div className="p-6 min-h-screen" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
//         {toast && (
//           <ToastNotification
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage and track all B2B orders</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-indigo-500" />
//           <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="bg-green-500" />
//           <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
//           <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-400" />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             <div className="relative flex-1 min-w-[220px] max-w-md">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders, customers..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             <div className="flex gap-3 items-center flex-wrap">
//               <div className="relative">
//                 <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setPage(1);
//                     setFilterStatus(e.target.value);
//                   }}
//                   className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="font-medium">Rows:</span>
//                 {[10, 25, 50, 100].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       setRowsPerPage(n);
//                       setPage(1);
//                     }}
//                     className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                       rowsPerPage === n
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {!loading && orders.length > 0 && (
//           <p className="text-xs text-gray-500 mb-3 px-1">
//             Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>{" "}
//             of <span className="font-semibold text-gray-700">{stats.total}</span> orders · Page {page} of {totalPages}
//           </p>
//         )}

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-sm text-gray-500">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-indigo-50/40 transition-colors">
//                       <td className="px-4 py-3 font-semibold text-indigo-600">#{order.orderId || order.id.slice(-6).toUpperCase()}</td>
//                       <td className="px-4 py-3 text-gray-800 font-medium">{order.customer}</td>
//                       <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{order.product}</td>
//                       <td className="px-4 py-3 text-gray-600">{order.quantity}</td>
//                       <td className="px-4 py-3 font-bold text-gray-800">{order.total}</td>
//                       <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
//                       <td className="px-4 py-3 text-gray-500">
//                         {new Date(order.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition" title="View Order Details">
//                             <Eye size={15} />
//                           </button>
//                           <button onClick={() => handleEditOrder(order)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="Edit Order Status">
//                             <Pencil size={15} />
//                           </button>
//                           <button onClick={() => handleToggleStatus(order)} className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition" title="Quick Status Toggle">
//                             <Power size={15} />
//                           </button>
//                           <button onClick={() => handleDeleteOrder(order)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition" title="Delete Order">
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div className="py-16 text-center text-gray-400">
//                   <Package size={36} className="mx-auto mb-3 opacity-40" />
//                   <p className="font-medium">No orders found</p>
//                   <p className="text-xs mt-1">Try adjusting your filters</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <ViewOrderModal
//           order={selectedOrder}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}

//       {isEditModalOpen && (
//         <EditOrderModal
//           order={editingOrder}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setEditingOrder(null);
//           }}
//           onSave={handleSaveOrder}
//         />
//       )}

//       {isDeleteModalOpen && (
//         <DeleteConfirmModal
//           order={deletingOrder}
//           onClose={() => {
//             setIsDeleteModalOpen(false);
//             setDeletingOrder(null);
//           }}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//     </>
//   );
// };

// export default B2BOrders;
















// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CreditCard,
//   Calendar,
//   Hash,
//   IndianRupee,
//   Banknote,
//   Receipt,
//   Clock,
//   Check,
//   AlertTriangle,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   paymentStatus: string;
//   paymentMethod: string;
//   date: string;
//   raw?: any;
// }

// interface PaymentDetails {
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   amount?: number;
//   currency?: string;
//   status?: "pending" | "success" | "failed";
//   paymentMethod?: string;
//   paidAt?: Date;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE (for table)
// ========================= */
// const PaymentStatusBadgeTable = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Paid
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Paid
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE (for modal)
// ========================= */
// const PaymentStatusBadge = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Success
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Initiated
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    TOAST NOTIFICATION
// ========================= */
// const ToastNotification = ({ 
//   message, 
//   type, 
//   onClose 
// }: { 
//   message: string; 
//   type: "success" | "error"; 
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 ${
//       type === "success" ? "bg-green-500" : "bg-red-500"
//     } text-white`}>
//       {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
//       <span className="text-sm font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80">
//         <X size={14} />
//       </button>
//     </div>
//   );
// };

// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// const ViewOrderModal = ({
//   order,
//   onClose,
// }: {
//   order: Order | null;
//   onClose: () => void;
// }) => {
//   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;
//   const paymentDetails: PaymentDetails | undefined = rawOrder.paymentDetails;

//   const hasValidPayment = paymentDetails && paymentDetails.status === "success";
//   const paymentExists = paymentDetails && paymentDetails.status !== undefined;
//   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 px-5">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "details"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Order Details
//             {activeTab === "details" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "payment"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Payment Information
//             {!hasValidPayment && paymentNotPaid && (
//               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
//                 Not Paid
//               </span>
//             )}
//             {activeTab === "payment" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5">
//           {activeTab === "details" ? (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Package size={14} className="text-indigo-500" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400">Full Name</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-400">Address</p>
//                     <p className="text-gray-700 text-sm">
//                       {rawOrder.addressSnapshot?.addressLine1}
//                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                       <br />
//                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={14} className="text-indigo-500" />
//                   Order Items
//                 </h3>
//                 <div className="space-y-2">
//                   {rawOrder.items?.map((item: any, idx: number) => (
//                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.productName}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                       </div>
//                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-indigo-50/30 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//                   </div>
//                   {rawOrder.tax > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{rawOrder.tax}</span>
//                     </div>
//                   )}
//                   {rawOrder.shippingCharge > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Shipping</span>
//                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                     </div>
//                   )}
//                   {rawOrder.discount > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="text-green-600">-₹{rawOrder.discount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-sm font-semibold text-gray-700">Payment Status</h3>
//                   <PaymentStatusBadge status={paymentDetails?.status} />
//                 </div>
//                 {!paymentExists && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment has not been initiated for this order.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "pending" && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <Clock size={14} />
//                     Payment is pending. Waiting for customer to complete payment.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "failed" && (
//                   <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment failed. Please check with the customer.
//                   </p>
//                 )}
//               </div>

//               {/* Payment Details Section */}
//               {paymentExists && paymentDetails?.razorpayPaymentId && (
//                 <div className="bg-white border border-gray-100 rounded-xl p-4">
//                   <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <CreditCard size={14} className="text-indigo-500" />
//                     Transaction Details
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     {paymentDetails.razorpayPaymentId && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-500">Payment ID:</span>
//                         <span className="font-mono text-gray-700">{paymentDetails.razorpayPaymentId}</span>
//                       </div>
//                     )}
//                     {paymentDetails.amount && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-500">Amount:</span>
//                         <span className="font-semibold text-gray-800">₹{paymentDetails.amount}</span>
//                       </div>
//                     )}
//                     {paymentDetails.paymentMethod && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-500">Method:</span>
//                         <span className="text-gray-700 capitalize">{paymentDetails.paymentMethod}</span>
//                       </div>
//                     )}
//                     {paymentDetails.paidAt && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-500">Paid At:</span>
//                         <span className="text-gray-700">{new Date(paymentDetails.paidAt).toLocaleString()}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    EDIT ORDER MODAL - Only Status
// ========================= */
// // const EditOrderModal = ({
// //   order,
// //   onClose,
// //   onSave,
// // }: {
// //   order: Order | null;
// //   onClose: () => void;
// //   onSave: (updatedOrder: any) => void;
// // }) => {
// //   const [status, setStatus] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (order?.raw) {
// //       setStatus(order.raw.status || "pending");
// //     }
// //   }, [order]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!order) return;

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const response = await fetch(`/api/b2b-orders/${order.id}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status: status }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         onSave(data.data);
// //         onClose();
// //       } else {
// //         setError(data.message || "Failed to update order status");
// //       }
// //     } catch (error) {
// //       console.error("Error updating order status:", error);
// //       setError("Network error. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (!order) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
// //         <div className="flex items-center justify-between p-5 border-b border-gray-100">
// //           <div>
// //             <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
// //             <p className="text-sm text-gray-500 mt-0.5">
// //               #{order.orderId || order.id.slice(-6).toUpperCase()}
// //             </p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="p-5 space-y-5">
// //           {error && (
// //             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
// //               {error}
// //             </div>
// //           )}

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Order Status
// //             </label>
// //             <select
// //               value={status}
// //               onChange={(e) => setStatus(e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
// //             >
// //               <option value="pending">Pending</option>
// //               <option value="confirmed">Confirmed</option>
// //               <option value="processing">Processing</option>
// //               <option value="shipped">Shipped</option>
// //               <option value="out_for_delivery">Out for Delivery</option>
// //               <option value="delivered">Delivered</option>
// //               <option value="cancelled">Cancelled</option>
// //               <option value="refunded">Refunded</option>
// //             </select>
// //             <p className="text-xs text-gray-500 mt-1">
// //               Changing status will be recorded in order history
// //             </p>
// //           </div>

// //           <div className="flex gap-3 pt-4">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
// //             >
// //               {loading ? "Updating..." : "Update Status"}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };



// /* =========================
//    EDIT ORDER MODAL - Full Order Details View with Status Update
// ========================= */
// const EditOrderModal = ({
//   order,
//   onClose,
//   onSave,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onSave: (updatedOrder: any) => void;
// }) => {
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (order?.raw) {
//       setStatus(order.raw.status || "pending");
//     }
//   }, [order]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: status }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onSave(data.data);
//         onClose();
//       } else {
//         setError(data.message || "Failed to update order status");
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Status Update Section */}
//           <div className="bg-indigo-50/30 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Power size={14} className="text-indigo-500" />
//               Update Order Status
//             </h3>
//             <div className="space-y-3">
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="out_for_delivery">Out for Delivery</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               <p className="text-xs text-gray-500">
//                 Changing status will be recorded in order history
//               </p>
//             </div>
//           </div>

//           {/* Customer Information */}
//           <div className="bg-gray-50 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Package size={14} className="text-indigo-500" />
//               Customer Information
//             </h3>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-xs text-gray-400">Full Name</p>
//                 <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">Phone</p>
//                 <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-xs text-gray-400">Address</p>
//                 <p className="text-gray-700 text-sm">
//                   {rawOrder.addressSnapshot?.addressLine1}
//                   {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                   <br />
//                   {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Order Items */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <ShoppingBag size={14} className="text-indigo-500" />
//               Order Items
//             </h3>
//             <div className="space-y-2">
//               {rawOrder.items?.map((item: any, idx: number) => (
//                 <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-800">{item.productName}</p>
//                     <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                   </div>
//                   <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-indigo-50/30 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Subtotal</span>
//                 <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//               </div>
//               {rawOrder.tax > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Tax</span>
//                   <span className="text-gray-700">₹{rawOrder.tax}</span>
//                 </div>
//               )}
//               {rawOrder.shippingCharge > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Shipping</span>
//                   <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                 </div>
//               )}
//               {rawOrder.discount > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Discount</span>
//                   <span className="text-green-600">-₹{rawOrder.discount}</span>
//                 </div>
//               )}
//               <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                 <span className="text-gray-800">Total</span>
//                 <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? "Updating..." : "Update Status"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    DELETE CONFIRMATION MODAL
// ========================= */
// const DeleteConfirmModal = ({
//   order,
//   onClose,
//   onConfirm,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onConfirm: () => void;
// }) => {
//   const [loading, setLoading] = useState(false);

//   if (!order) return null;

//   const handleDelete = async () => {
//     setLoading(true);
//     await onConfirm();
//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-5">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <Trash2 size={24} className="text-red-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
//             Delete Order
//           </h3>
//           <p className="text-sm text-gray-500 text-center mb-6">
//             Are you sure you want to delete order #{order.orderId || order.id.slice(-6).toUpperCase()}?
//             This action cannot be undone.
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
//             >
//               {loading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    MAIN COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState<Order | null>(null);
//   const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         const formatted = json.data.map((order: any) => ({
//           id: order._id,
//           orderId: order.orderId,
//           customer: order.addressSnapshot?.fullName || "N/A",
//           product: order.items?.[0]?.productName || "Multiple Items",
//           quantity:
//             order.items?.reduce(
//               (sum: number, item: any) => sum + item.quantity,
//               0
//             ) + " items",
//           total: `₹${order.totalAmount}`,
//           status: mapStatus(order.status),
//           paymentStatus: order.paymentDetails?.status || "not_initiated",
//           paymentMethod: order.paymentDetails?.paymentMethod || "N/A",
//           date: order.createdAt,
//           raw: order,
//         }));

//         setOrders(formatted);
//         setTotalPages(json.pagination.totalPages);
//         setTotalCount(json.pagination.total || json.data.length);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setToast({ message: "Failed to fetch orders", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     paid: orders.filter((o) => o.paymentStatus === "success").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   const handleViewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleEditOrder = (order: Order) => {
//     setEditingOrder(order);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveOrder = async (updatedOrder: any) => {
//     await fetchOrders();
//     setToast({ message: "Order status updated successfully!", type: "success" });
//   };

//   const handleDeleteOrder = (order: Order) => {
//     setDeletingOrder(order);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingOrder) return;

//     try {
//       const response = await fetch(`/api/b2b-orders/${deletingOrder.id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: "Order deleted successfully!", type: "success" });
//         setIsDeleteModalOpen(false);
//         setDeletingOrder(null);
//       } else {
//         setToast({ message: "Failed to delete order", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   const handleToggleStatus = async (order: Order) => {
//     const statusCycle = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
//     const currentIndex = statusCycle.indexOf(order.raw?.status || "pending");
//     const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: `Order status updated to ${nextStatus}`, type: "success" });
//       } else {
//         setToast({ message: "Failed to update status", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <>
//       <div className="p-6 min-h-screen" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
//         {toast && (
//           <ToastNotification
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage and track all B2B orders</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-indigo-500" />
//           <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="bg-green-500" />
//           <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
//           <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-400" />
//           <StatCard icon={CreditCard} label="Paid Orders" value={stats.paid} color="bg-purple-500" />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             <div className="relative flex-1 min-w-[220px] max-w-md">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders, customers..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             <div className="flex gap-3 items-center flex-wrap">
//               <div className="relative">
//                 <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setPage(1);
//                     setFilterStatus(e.target.value);
//                   }}
//                   className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="out_for_delivery">Out for Delivery</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="font-medium">Rows:</span>
//                 {[10, 25, 50, 100].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       setRowsPerPage(n);
//                       setPage(1);
//                     }}
//                     className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                       rowsPerPage === n
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {!loading && orders.length > 0 && (
//           <p className="text-xs text-gray-500 mb-3 px-1">
//             Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>{" "}
//             of <span className="font-semibold text-gray-700">{stats.total}</span> orders · Page {page} of {totalPages}
//           </p>
//         )}

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-sm text-gray-500">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-indigo-50/40 transition-colors">
//                       <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
//                         #{order.orderId || order.id.slice(-6).toUpperCase()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                         {order.customer}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
//                         {order.product}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         {order.quantity}
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
//                         {order.total}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <PaymentStatusBadgeTable status={order.paymentStatus} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         <span className="inline-flex items-center gap-1">
//                           <CreditCard size={12} className="text-gray-400" />
//                           {order.paymentMethod === "razorpay" ? "Razorpay" : order.paymentMethod || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <StatusBadge status={order.status} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                         {new Date(order.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition" title="View Order Details">
//                             <Eye size={15} />
//                           </button>
//                           <button onClick={() => handleEditOrder(order)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="Edit Order Status">
//                             <Pencil size={15} />
//                           </button>
//                           <button onClick={() => handleToggleStatus(order)} className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition" title="Quick Status Toggle">
//                             <Power size={15} />
//                           </button>
                         
                          
//                         </div>
//                        </td>
//                      </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div className="py-16 text-center text-gray-400">
//                   <Package size={36} className="mx-auto mb-3 opacity-40" />
//                   <p className="font-medium">No orders found</p>
//                   <p className="text-xs mt-1">Try adjusting your filters</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <ViewOrderModal
//           order={selectedOrder}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}

//       {isEditModalOpen && (
//         <EditOrderModal
//           order={editingOrder}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setEditingOrder(null);
//           }}
//           onSave={handleSaveOrder}
//         />
//       )}

//       {isDeleteModalOpen && (
//         <DeleteConfirmModal
//           order={deletingOrder}
//           onClose={() => {
//             setIsDeleteModalOpen(false);
//             setDeletingOrder(null);
//           }}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//     </>
//   );
// };

// export default B2BOrders;















// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CreditCard,
//   Calendar,
//   Hash,
//   IndianRupee,
//   Banknote,
//   Receipt,
//   Clock,
//   Check,
//   AlertTriangle,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   paymentStatus: string;
//   paymentMethod: string;
//   date: string;
//   raw?: any;
// }

// interface PaymentDetails {
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   amount?: number;
//   currency?: string;
//   status?: "pending" | "success" | "failed";
//   paymentMethod?: string;
//   paidAt?: Date;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE
// ========================= */
// const PaymentStatusBadgeTable = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Paid
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Paid
//     </span>
//   );
// };

// const PaymentStatusBadge = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Success
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Initiated
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    TOAST NOTIFICATION
// ========================= */
// const ToastNotification = ({ 
//   message, 
//   type, 
//   onClose 
// }: { 
//   message: string; 
//   type: "success" | "error"; 
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 ${
//       type === "success" ? "bg-green-500" : "bg-red-500"
//     } text-white`}>
//       {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
//       <span className="text-sm font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80">
//         <X size={14} />
//       </button>
//     </div>
//   );
// };

// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// const ViewOrderModal = ({
//   order,
//   onClose,
// }: {
//   order: Order | null;
//   onClose: () => void;
// }) => {
//   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;
//   const paymentDetails: PaymentDetails | undefined = rawOrder.paymentDetails;

//   const hasValidPayment = paymentDetails && paymentDetails.status === "success";
//   const paymentExists = paymentDetails && paymentDetails.status !== undefined;
//   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 px-5">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "details"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Order Details
//             {activeTab === "details" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "payment"
//                 ? "text-indigo-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Payment Information
//             {!hasValidPayment && paymentNotPaid && (
//               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
//                 Not Paid
//               </span>
//             )}
//             {activeTab === "payment" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5">
//           {activeTab === "details" ? (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Package size={14} className="text-indigo-500" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400">Full Name</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-400">Address</p>
//                     <p className="text-gray-700 text-sm">
//                       {rawOrder.addressSnapshot?.addressLine1}
//                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                       <br />
//                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={14} className="text-indigo-500" />
//                   Order Items
//                 </h3>
//                 <div className="space-y-2">
//                   {rawOrder.items?.map((item: any, idx: number) => (
//                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.productName}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                       </div>
//                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-indigo-50/30 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//                   </div>
//                   {rawOrder.tax > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{rawOrder.tax}</span>
//                     </div>
//                   )}
//                   {rawOrder.shippingCharge > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Shipping</span>
//                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                     </div>
//                   )}
//                   {rawOrder.discount > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="text-green-600">-₹{rawOrder.discount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-sm font-semibold text-gray-700">Payment Status</h3>
//                   <PaymentStatusBadge status={paymentDetails?.status} />
//                 </div>
//                 {!paymentExists && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment has not been initiated for this order.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "pending" && (
//                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
//                     <Clock size={14} />
//                     Payment is pending. Waiting for customer to complete payment.
//                   </p>
//                 )}
//                 {paymentDetails?.status === "failed" && (
//                   <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
//                     <AlertTriangle size={14} />
//                     Payment failed. Please check with the customer.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    EDIT ORDER MODAL - Full Details View with Status Update Only
// ========================= */
// /* =========================
//    EDIT ORDER MODAL - With Editable Customer Information
// ========================= */
// const EditOrderModal = ({
//   order,
//   onClose,
//   onSave,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onSave: (updatedOrder: any) => void;
// }) => {
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     if (order?.raw) {
//       setStatus(order.raw.status || "pending");
//       setFormData({
//         fullName: order.raw.addressSnapshot?.fullName || "",
//         phoneNumber: order.raw.addressSnapshot?.phoneNumber || "",
//         addressLine1: order.raw.addressSnapshot?.addressLine1 || "",
//         city: order.raw.addressSnapshot?.city || "",
//         state: order.raw.addressSnapshot?.state || "",
//         pincode: order.raw.addressSnapshot?.pincode || "",
//       });
//     }
//   }, [order]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status: status,
//           addressSnapshot: {
//             fullName: formData.fullName,
//             phoneNumber: formData.phoneNumber,
//             addressLine1: formData.addressLine1,
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onSave(data.data);
//         onClose();
//       } else {
//         setError(data.message || "Failed to update order");
//       }
//     } catch (error) {
//       console.error("Error updating order:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order || !order.raw) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Update Order</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Status Update Section */}
//           <div className="bg-indigo-50/30 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Power size={14} className="text-indigo-500" />
//               Update Order Status
//             </h3>
//             <div className="space-y-3">
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="out_for_delivery">Out for Delivery</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               <p className="text-xs text-gray-500">
//                 Changing status will be recorded in order history
//               </p>
//             </div>
//           </div>

//           {/* Customer Information - Editable */}
//           <div className="bg-gray-50 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Package size={14} className="text-indigo-500" />
//               Customer Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName}
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phoneNumber}
//                   onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Address Line
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.addressLine1}
//                   onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.state}
//                   onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Pincode
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.pincode}
//                   onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? "Updating..." : "Update Order"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    DELETE CONFIRMATION MODAL
// ========================= */
// const DeleteConfirmModal = ({
//   order,
//   onClose,
//   onConfirm,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onConfirm: () => void;
// }) => {
//   const [loading, setLoading] = useState(false);

//   if (!order) return null;

//   const handleDelete = async () => {
//     setLoading(true);
//     await onConfirm();
//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-5">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <Trash2 size={24} className="text-red-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
//             Delete Order
//           </h3>
//           <p className="text-sm text-gray-500 text-center mb-6">
//             Are you sure you want to delete order #{order.orderId || order.id.slice(-6).toUpperCase()}?
//             This action cannot be undone.
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
//             >
//               {loading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    MAIN COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState<Order | null>(null);
//   const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         const formatted = json.data.map((order: any) => ({
//           id: order._id,
//           orderId: order.orderId,
//           customer: order.addressSnapshot?.fullName || "N/A",
//           product: order.items?.[0]?.productName || "Multiple Items",
//           quantity:
//             order.items?.reduce(
//               (sum: number, item: any) => sum + item.quantity,
//               0
//             ) + " items",
//           total: `₹${order.totalAmount}`,
//           status: mapStatus(order.status),
//           paymentStatus: order.paymentDetails?.status || "not_initiated",
//           paymentMethod: order.paymentDetails?.paymentMethod || "N/A",
//           date: order.createdAt,
//           raw: order,
//         }));

//         setOrders(formatted);
//         setTotalPages(json.pagination.totalPages);
//         setTotalCount(json.pagination.total || json.data.length);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setToast({ message: "Failed to fetch orders", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     paid: orders.filter((o) => o.paymentStatus === "success").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   const handleViewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleEditOrder = (order: Order) => {
//     setEditingOrder(order);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveOrder = async (updatedOrder: any) => {
//     await fetchOrders();
//     setToast({ message: "Order status updated successfully!", type: "success" });
//   };

//   const handleDeleteOrder = (order: Order) => {
//     setDeletingOrder(order);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingOrder) return;

//     try {
//       const response = await fetch(`/api/b2b-orders/${deletingOrder.id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: "Order deleted successfully!", type: "success" });
//         setIsDeleteModalOpen(false);
//         setDeletingOrder(null);
//       } else {
//         setToast({ message: "Failed to delete order", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   const handleToggleStatus = async (order: Order) => {
//     const statusCycle = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
//     const currentIndex = statusCycle.indexOf(order.raw?.status || "pending");
//     const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

//     try {
//       const response = await fetch(`/api/b2b-orders/${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: `Order status updated to ${nextStatus}`, type: "success" });
//       } else {
//         setToast({ message: "Failed to update status", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <>
//       <div className="p-6 min-h-screen" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
//         {toast && (
//           <ToastNotification
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage and track all B2B orders</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-indigo-500" />
//           <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="bg-green-500" />
//           <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
//           <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-400" />
//           <StatCard icon={CreditCard} label="Paid Orders" value={stats.paid} color="bg-purple-500" />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             <div className="relative flex-1 min-w-[220px] max-w-md">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders, customers..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             <div className="flex gap-3 items-center flex-wrap">
//               <div className="relative">
//                 <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setPage(1);
//                     setFilterStatus(e.target.value);
//                   }}
//                   className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="out_for_delivery">Out for Delivery</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="font-medium">Rows:</span>
//                 {[10, 25, 50, 100].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       setRowsPerPage(n);
//                       setPage(1);
//                     }}
//                     className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                       rowsPerPage === n
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {!loading && orders.length > 0 && (
//           <p className="text-xs text-gray-500 mb-3 px-1">
//             Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>{" "}
//             of <span className="font-semibold text-gray-700">{stats.total}</span> orders · Page {page} of {totalPages}
//           </p>
//         )}

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-sm text-gray-500">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-indigo-50/40 transition-colors">
//                       <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
//                         #{order.orderId || order.id.slice(-6).toUpperCase()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                         {order.customer}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
//                         {order.product}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         {order.quantity}
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
//                         {order.total}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <PaymentStatusBadgeTable status={order.paymentStatus} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         <span className="inline-flex items-center gap-1">
//                           <CreditCard size={12} className="text-gray-400" />
//                           {order.paymentMethod === "razorpay" ? "Razorpay" : order.paymentMethod || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <StatusBadge status={order.status} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                         {new Date(order.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition" title="View Order Details">
//                             <Eye size={15} />
//                           </button>
//                           <button onClick={() => handleEditOrder(order)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="Edit Order Status">
//                             <Pencil size={15} />
//                           </button>
//                           <button onClick={() => handleToggleStatus(order)} className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition" title="Quick Status Toggle">
//                             <Power size={15} />
//                           </button>
//                           <button onClick={() => handleDeleteOrder(order)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition" title="Delete Order">
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div className="py-16 text-center text-gray-400">
//                   <Package size={36} className="mx-auto mb-3 opacity-40" />
//                   <p className="font-medium">No orders found</p>
//                   <p className="text-xs mt-1">Try adjusting your filters</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <ViewOrderModal
//           order={selectedOrder}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}

//       {isEditModalOpen && (
//         <EditOrderModal
//           order={editingOrder}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setEditingOrder(null);
//           }}
//           onSave={handleSaveOrder}
//         />
//       )}

//       {isDeleteModalOpen && (
//         <DeleteConfirmModal
//           order={deletingOrder}
//           onClose={() => {
//             setIsDeleteModalOpen(false);
//             setDeletingOrder(null);
//           }}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//     </>
//   );
// };

// export default B2BOrders;















// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Pencil,
//   Power,
//   Trash2,
//   Search,
//   Filter,
//   ShoppingBag,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Package,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CreditCard,
//   Calendar,
//   Hash,
//   IndianRupee,
//   Banknote,
//   Receipt,
//   Clock,
//   Check,
//   AlertTriangle,
// } from "lucide-react";

// /* =========================
//    TYPES
// ========================= */
// interface Order {
//   id: string;
//   orderId: string;
//   customer: string;
//   product: string;
//   quantity: string;
//   total: string;
//   status: "Delivered" | "Processing" | "Shipped" | "Pending";
//   paymentStatus: string;
//   paymentMethod: string;
//   date: string;
//   raw?: any;
// }

// interface PaymentDetails {
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   amount?: number;
//   currency?: string;
//   status?: "pending" | "success" | "failed";
//   paymentMethod?: string;
//   paidAt?: Date;
// }

// /* =========================
//    STATUS MAPPING
// ========================= */
// const mapStatus = (status: string): Order["status"] => {
//   switch (status) {
//     case "delivered":
//       return "Delivered";
//     case "processing":
//     case "confirmed":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     default:
//       return "Pending";
//   }
// };

// /* =========================
//    STATUS BADGE
// ========================= */
// const statusConfig: Record<
//   Order["status"],
//   { label: string; bg: string; text: string; dot: string }
// > = {
//   Delivered: {
//     label: "Delivered",
//     bg: "bg-green-50",
//     text: "text-green-700",
//     dot: "bg-green-500",
//   },
//   Processing: {
//     label: "Processing",
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     dot: "bg-blue-500",
//   },
//   Shipped: {
//     label: "Shipped",
//     bg: "bg-orange-50",
//     text: "text-orange-700",
//     dot: "bg-orange-500",
//   },
//   Pending: {
//     label: "Pending",
//     bg: "bg-yellow-50",
//     text: "text-yellow-700",
//     dot: "bg-yellow-500",
//   },
// };

// const StatusBadge = ({ status }: { status: Order["status"] }) => {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// /* =========================
//    PAYMENT STATUS BADGE
// ========================= */
// const PaymentStatusBadgeTable = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Paid
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Paid
//     </span>
//   );
// };

// const PaymentStatusBadge = ({ status }: { status?: string }) => {
//   if (!status || status === "pending") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
//         <Clock size={12} />
//         Pending
//       </span>
//     );
//   }
//   if (status === "success") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
//         <Check size={12} />
//         Success
//       </span>
//     );
//   }
//   if (status === "failed") {
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
//         <AlertTriangle size={12} />
//         Failed
//       </span>
//     );
//   }
//   return (
//     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
//       <CreditCard size={12} />
//       Not Initiated
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   color: string;
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
//     <div className={`p-3 rounded-xl ${color}`}>
//       <Icon size={20} className="text-white" />
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
//     </div>
//   </div>
// );

// /* =========================
//    SORT ICON
// ========================= */
// const SortIcon = () => (
//   <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
// );

// /* =========================
//    TOAST NOTIFICATION
// ========================= */
// const ToastNotification = ({ 
//   message, 
//   type, 
//   onClose 
// }: { 
//   message: string; 
//   type: "success" | "error"; 
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 5000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 ${
//       type === "success" ? "bg-green-500" : "bg-red-500"
//     } text-white`}>
//       {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
//       <span className="text-sm font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80">
//         <X size={14} />
//       </button>
//     </div>
//   );
// };

// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// // const ViewOrderModal = ({
// //   order,
// //   onClose,
// // }: {
// //   order: Order | null;
// //   onClose: () => void;
// // }) => {
// //   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

// //   if (!order || !order.raw) return null;

// //   const rawOrder = order.raw;
// //   const paymentDetails: PaymentDetails | undefined = rawOrder.paymentDetails;

// //   const hasValidPayment = paymentDetails && paymentDetails.status === "success";
// //   const paymentExists = paymentDetails && paymentDetails.status !== undefined;
// //   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
// //         <div className="flex items-center justify-between p-5 border-b border-gray-100">
// //           <div>
// //             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
// //             <p className="text-sm text-gray-500 mt-0.5">
// //               #{order.orderId || order.id.slice(-6).toUpperCase()}
// //             </p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <div className="flex border-b border-gray-100 px-5">
// //           <button
// //             onClick={() => setActiveTab("details")}
// //             className={`px-4 py-3 text-sm font-medium transition relative ${
// //               activeTab === "details"
// //                 ? "text-indigo-600"
// //                 : "text-gray-500 hover:text-gray-700"
// //             }`}
// //           >
// //             Order Details
// //             {activeTab === "details" && (
// //               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
// //             )}
// //           </button>
// //           <button
// //             onClick={() => setActiveTab("payment")}
// //             className={`px-4 py-3 text-sm font-medium transition relative ${
// //               activeTab === "payment"
// //                 ? "text-indigo-600"
// //                 : "text-gray-500 hover:text-gray-700"
// //             }`}
// //           >
// //             Payment Information
// //             {!hasValidPayment && paymentNotPaid && (
// //               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
// //                 Not Paid
// //               </span>
// //             )}
// //             {activeTab === "payment" && (
// //               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
// //             )}
// //           </button>
// //         </div>

// //         <div className="flex-1 overflow-y-auto p-5">
// //           {activeTab === "details" ? (
// //             <div className="space-y-6">
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
// //                   <Package size={14} className="text-indigo-500" />
// //                   Customer Information
// //                 </h3>
// //                 <div className="grid grid-cols-2 gap-3 text-sm">
// //                   <div>
// //                     <p className="text-xs text-gray-400">Full Name</p>
// //                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-gray-400">Phone</p>
// //                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
// //                   </div>
// //                   <div className="col-span-2">
// //                     <p className="text-xs text-gray-400">Address</p>
// //                     <p className="text-gray-700 text-sm">
// //                       {rawOrder.addressSnapshot?.addressLine1}
// //                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
// //                       <br />
// //                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
// //                   <ShoppingBag size={14} className="text-indigo-500" />
// //                   Order Items
// //                 </h3>
// //                 <div className="space-y-2">
// //                   {rawOrder.items?.map((item: any, idx: number) => (
// //                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
// //                       <div className="flex-1">
// //                         <p className="font-medium text-gray-800">{item.productName}</p>
// //                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
// //                       </div>
// //                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="bg-indigo-50/30 rounded-xl p-4">
// //                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
// //                 <div className="space-y-2 text-sm">
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-500">Subtotal</span>
// //                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
// //                   </div>
// //                   {rawOrder.tax > 0 && (
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Tax</span>
// //                       <span className="text-gray-700">₹{rawOrder.tax}</span>
// //                     </div>
// //                   )}
// //                   {rawOrder.shippingCharge > 0 && (
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Shipping</span>
// //                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
// //                     </div>
// //                   )}
// //                   {rawOrder.discount > 0 && (
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Discount</span>
// //                       <span className="text-green-600">-₹{rawOrder.discount}</span>
// //                     </div>
// //                   )}
// //                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
// //                     <span className="text-gray-800">Total</span>
// //                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="space-y-6">
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <div className="flex items-center justify-between">
// //                   <h3 className="text-sm font-semibold text-gray-700">Payment Status</h3>
// //                   <PaymentStatusBadge status={paymentDetails?.status} />
// //                 </div>
// //                 {!paymentExists && (
// //                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
// //                     <AlertTriangle size={14} />
// //                     Payment has not been initiated for this order.
// //                   </p>
// //                 )}
// //                 {paymentDetails?.status === "pending" && (
// //                   <p className="text-sm text-yellow-600 mt-2 flex items-center gap-2">
// //                     <Clock size={14} />
// //                     Payment is pending. Waiting for customer to complete payment.
// //                   </p>
// //                 )}
// //                 {paymentDetails?.status === "failed" && (
// //                   <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
// //                     <AlertTriangle size={14} />
// //                     Payment failed. Please check with the customer.
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
// //           <button
// //             onClick={onClose}
// //             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
// //           >
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };












// /* =========================
//    VIEW ORDER MODAL
// ========================= */
// const ViewOrderModal = ({
//   order,
//   onClose,
// }: {
//   order: Order | null;
//   onClose: () => void;
// }) => {
//   const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

//   if (!order || !order.raw) return null;

//   const rawOrder = order.raw;
//   const paymentDetails = rawOrder.paymentDetails;

//   const hasValidPayment = paymentDetails?.status === "success";
//   const paymentExists = paymentDetails?.status !== undefined;
//   const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 px-5">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "details" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Order Details
//             {activeTab === "details" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("payment")}
//             className={`px-4 py-3 text-sm font-medium transition relative ${
//               activeTab === "payment" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Payment Information
//             {!hasValidPayment && paymentNotPaid && (
//               <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
//                 Not Paid
//               </span>
//             )}
//             {activeTab === "payment" && (
//               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
//             )}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5">
//           {activeTab === "details" ? (
//             <div className="space-y-6">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Package size={14} className="text-indigo-500" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400">Full Name</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-400">Address</p>
//                     <p className="text-gray-700 text-sm">
//                       {rawOrder.addressSnapshot?.addressLine1}
//                       {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
//                       <br />
//                       {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={14} className="text-indigo-500" />
//                   Order Items
//                 </h3>
//                 <div className="space-y-2">
//                   {rawOrder.items?.map((item: any, idx: number) => (
//                     <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.productName}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
//                       </div>
//                       <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-indigo-50/30 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{rawOrder.subtotal}</span>
//                   </div>
//                   {rawOrder.tax > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{rawOrder.tax}</span>
//                     </div>
//                   )}
//                   {rawOrder.shippingCharge > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Shipping</span>
//                       <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
//                     </div>
//                   )}
//                   {rawOrder.discount > 0 && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span className="text-green-600">-₹{rawOrder.discount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-indigo-700 text-lg">₹{rawOrder.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // ===================== PAYMENT TAB =====================
//             <div className="space-y-5">

//               {/* Payment Overview */}
//               <div className="bg-gray-50 rounded-xl p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <CreditCard size={14} className="text-indigo-500" />
//                     Payment Overview
//                   </h3>
//                   <PaymentStatusBadge status={paymentDetails?.status} />
//                 </div>

//                 {paymentDetails ? (
//                   <div className="grid grid-cols-2 gap-3 text-sm pt-1">
//                     <div>
//                       <p className="text-xs text-gray-400">Total Amount</p>
//                       <p className="font-semibold text-gray-800">
//                         ₹{paymentDetails.amount
//                           ? (paymentDetails.amount / 100).toLocaleString("en-IN")
//                           : rawOrder.totalAmount || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Currency</p>
//                       <p className="font-medium text-gray-800">{paymentDetails.currency || "INR"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Payment Method</p>
//                       <p className="font-medium text-gray-800 capitalize">
//                         {paymentDetails.paymentMethod || "N/A"}
//                       </p>
//                     </div>
//                     {paymentDetails.paidAt && (
//                       <div>
//                         <p className="text-xs text-gray-400">Paid At</p>
//                         <p className="font-medium text-gray-800">
//                           {new Date(paymentDetails.paidAt).toLocaleString("en-IN", {
//                             day: "2-digit", month: "short", year: "numeric",
//                             hour: "2-digit", minute: "2-digit"
//                           })}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-yellow-600 flex items-center gap-2 pt-1">
//                     <AlertTriangle size={14} />
//                     Payment has not been initiated for this order.
//                   </p>
//                 )}
//               </div>

//               {/* Razorpay IDs */}
//               {paymentDetails && (paymentDetails.razorpayOrderId || paymentDetails.razorpayPaymentId) && (
//                 <div className="bg-gray-50 rounded-xl p-4 space-y-3">
//                   <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <Receipt size={14} className="text-indigo-500" />
//                     Razorpay Details
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     {paymentDetails.razorpayOrderId && (
//                       <div className="flex flex-col gap-0.5">
//                         <p className="text-xs text-gray-400">Razorpay Order ID</p>
//                         <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
//                           {paymentDetails.razorpayOrderId}
//                         </p>
//                       </div>
//                     )}
//                     {paymentDetails.razorpayPaymentId && (
//                       <div className="flex flex-col gap-0.5">
//                         <p className="text-xs text-gray-400">Razorpay Payment ID</p>
//                         <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
//                           {paymentDetails.razorpayPaymentId}
//                         </p>
//                       </div>
//                     )}
//                     {paymentDetails.razorpaySignature && (
//                       <div className="flex flex-col gap-0.5">
//                         <p className="text-xs text-gray-400">Signature</p>
//                         <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
//                           {paymentDetails.razorpaySignature}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Status Messages */}
//               {paymentDetails?.status === "pending" && (
//                 <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg px-4 py-3">
//                   <Clock size={14} />
//                   Payment is pending. Waiting for customer to complete payment.
//                 </div>
//               )}
//               {paymentDetails?.status === "failed" && (
//                 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
//                   <AlertTriangle size={14} />
//                   Payment failed. Please check with the customer.
//                 </div>
//               )}
//               {paymentDetails?.status === "success" && (
//                 <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3">
//                   <Check size={14} />
//                   Payment completed successfully.
//                 </div>
//               )}

//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };





// /* =========================
//    EDIT ORDER MODAL
// ========================= */
// const EditOrderModal = ({
//   order,
//   onClose,
//   onSave,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onSave: (updatedOrder: any) => void;
// }) => {
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     if (order?.raw) {
//       setStatus(order.raw.status || "pending");
//       setFormData({
//         fullName: order.raw.addressSnapshot?.fullName || "",
//         phoneNumber: order.raw.addressSnapshot?.phoneNumber || "",
//         addressLine1: order.raw.addressSnapshot?.addressLine1 || "",
//         city: order.raw.addressSnapshot?.city || "",
//         state: order.raw.addressSnapshot?.state || "",
//         pincode: order.raw.addressSnapshot?.pincode || "",
//       });
//     }
//   }, [order]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`/api/b2b-orders?id=${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status: status,
//           addressSnapshot: {
//             fullName: formData.fullName,
//             phoneNumber: formData.phoneNumber,
//             addressLine1: formData.addressLine1,
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onSave(data.data);
//         onClose();
//       } else {
//         setError(data.message || "Failed to update order");
//       }
//     } catch (error) {
//       console.error("Error updating order:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order || !order.raw) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Update Order</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               #{order.orderId || order.id.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Status Update Section */}
//           <div className="bg-indigo-50/30 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Power size={14} className="text-indigo-500" />
//               Update Order Status
//             </h3>
//             <div className="space-y-3">
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="out_for_delivery">Out for Delivery</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               <p className="text-xs text-gray-500">
//                 Changing status will be recorded in order history
//               </p>
//             </div>
//           </div>

//           {/* Customer Information */}
//           <div className="bg-gray-50 rounded-xl p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <Package size={14} className="text-indigo-500" />
//               Customer Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName}
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phoneNumber}
//                   onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Address Line
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.addressLine1}
//                   onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.state}
//                   onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Pincode
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.pincode}
//                   onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? "Updating..." : "Update Order"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    DELETE CONFIRMATION MODAL
// ========================= */
// const DeleteConfirmModal = ({
//   order,
//   onClose,
//   onConfirm,
// }: {
//   order: Order | null;
//   onClose: () => void;
//   onConfirm: () => void;
// }) => {
//   const [loading, setLoading] = useState(false);

//   if (!order) return null;

//   const handleDelete = async () => {
//     setLoading(true);
//     await onConfirm();
//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-5">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <Trash2 size={24} className="text-red-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
//             Delete Order
//           </h3>
//           <p className="text-sm text-gray-500 text-center mb-6">
//             Are you sure you want to delete order #{order.orderId || order.id.slice(-6).toUpperCase()}?
//             This action cannot be undone.
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
//             >
//               {loading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    MAIN COMPONENT
// ========================= */
// const B2BOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState<Order | null>(null);
//   const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
//       );
//       const json = await res.json();

//       if (json.success) {
//         const formatted = json.data.map((order: any) => ({
//           id: order._id,
//           orderId: order.orderId,
//           customer: order.addressSnapshot?.fullName || "N/A",
//           product: order.items?.[0]?.productName || "Multiple Items",
//           quantity:
//             order.items?.reduce(
//               (sum: number, item: any) => sum + item.quantity,
//               0
//             ) + " items",
//           total: `₹${order.totalAmount}`,
//           status: mapStatus(order.status),
//           paymentStatus: order.paymentDetails?.status || "not_initiated",
//           paymentMethod: order.paymentDetails?.paymentMethod || "N/A",
//           date: order.createdAt,
//           raw: order,
//         }));

//         setOrders(formatted);
//         setTotalPages(json.pagination.totalPages);
//         setTotalCount(json.pagination.total || json.data.length);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setToast({ message: "Failed to fetch orders", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, searchTerm, filterStatus, rowsPerPage]);

//   const stats = {
//     total: totalCount || orders.length,
//     delivered: orders.filter((o) => o.status === "Delivered").length,
//     pending: orders.filter((o) => o.status === "Pending").length,
//     paid: orders.filter((o) => o.paymentStatus === "success").length,
//     revenue: orders.reduce((sum, order) => {
//       const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
//       return sum + val;
//     }, 0),
//   };

//   const startItem = (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, stats.total);

//   const handleViewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleEditOrder = (order: Order) => {
//     setEditingOrder(order);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveOrder = async (updatedOrder: any) => {
//     await fetchOrders();
//     setToast({ message: "Order updated successfully!", type: "success" });
//   };

//   const handleDeleteOrder = (order: Order) => {
//     setDeletingOrder(order);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingOrder) return;

//     try {
//       const response = await fetch(`/api/b2b-orders?id=${deletingOrder.id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: "Order deleted successfully!", type: "success" });
//         setIsDeleteModalOpen(false);
//         setDeletingOrder(null);
//       } else {
//         setToast({ message: "Failed to delete order", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   const handleToggleStatus = async (order: Order) => {
//     const statusCycle = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
//     const currentIndex = statusCycle.indexOf(order.raw?.status || "pending");
//     const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

//     try {
//       const response = await fetch(`/api/b2b-orders?id=${order.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });

//       if (response.ok) {
//         await fetchOrders();
//         setToast({ message: `Order status updated to ${nextStatus}`, type: "success" });
//       } else {
//         setToast({ message: "Failed to update status", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setToast({ message: "Network error. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <>
//       <div className="p-6 min-h-screen" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
//         {toast && (
//           <ToastNotification
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">B2B Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage and track all B2B orders</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-indigo-500" />
//           <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="bg-green-500" />
//           <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
//           <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-400" />
//           <StatCard icon={CreditCard} label="Paid Orders" value={stats.paid} color="bg-purple-500" />
//         </div>

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
//           <div className="flex flex-wrap gap-3 items-center justify-between">
//             <div className="relative flex-1 min-w-[220px] max-w-md">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by order ID, customer, Razorpay ID..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             <div className="flex gap-3 items-center flex-wrap">
//               <div className="relative">
//                 <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setPage(1);
//                     setFilterStatus(e.target.value);
//                   }}
//                   className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="out_for_delivery">Out for Delivery</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="font-medium">Rows:</span>
//                 {[10, 25, 50, 100].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       setRowsPerPage(n);
//                       setPage(1);
//                     }}
//                     className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
//                       rowsPerPage === n
//                         ? "bg-indigo-600 text-white shadow"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {!loading && orders.length > 0 && (
//           <p className="text-xs text-gray-500 mb-3 px-1">
//             Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>{" "}
//             of <span className="font-semibold text-gray-700">{stats.total}</span> orders · Page {page} of {totalPages}
//           </p>
//         )}

//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
//               <p className="text-sm text-gray-500">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-100">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date <SortIcon /></th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-indigo-50/40 transition-colors">
//                       <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
//                         #{order.orderId || order.id.slice(-6).toUpperCase()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                         {order.customer}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
//                         {order.product}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         {order.quantity}
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
//                         {order.total}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <PaymentStatusBadgeTable status={order.paymentStatus} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                         <span className="inline-flex items-center gap-1">
//                           <CreditCard size={12} className="text-gray-400" />
//                           {order.paymentMethod === "razorpay" ? "Razorpay" : order.paymentMethod || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <StatusBadge status={order.status} />
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                         {new Date(order.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition" title="View Order Details">
//                             <Eye size={15} />
//                           </button>
//                           <button onClick={() => handleEditOrder(order)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="Edit Order">
//                             <Pencil size={15} />
//                           </button>
//                           <button onClick={() => handleToggleStatus(order)} className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition" title="Quick Status Toggle">
//                             <Power size={15} />
//                           </button>
                          
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {orders.length === 0 && (
//                 <div className="py-16 text-center text-gray-400">
//                   <Package size={36} className="mx-auto mb-3 opacity-40" />
//                   <p className="font-medium">No orders found</p>
//                   <p className="text-xs mt-1">Try adjusting your filters</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={15} /> Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               Next <ChevronRight size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <ViewOrderModal
//           order={selectedOrder}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       )}

//       {isEditModalOpen && (
//         <EditOrderModal
//           order={editingOrder}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setEditingOrder(null);
//           }}
//           onSave={handleSaveOrder}
//         />
//       )}

//       {isDeleteModalOpen && (
//         <DeleteConfirmModal
//           order={deletingOrder}
//           onClose={() => {
//             setIsDeleteModalOpen(false);
//             setDeletingOrder(null);
//           }}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//     </>
//   );
// };

// export default B2BOrders;













"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Power,
  Trash2,
  Search,
  Filter,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Package,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  Calendar,
  Hash,
  IndianRupee,
  Banknote,
  Receipt,
  Clock,
  Check,
  AlertTriangle,
} from "lucide-react";

/* =========================
   TYPES
========================= */
interface Order {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  quantity: string;
  total: string;
  status: "Delivered" | "Processing" | "Shipped" | "Pending";
  paymentStatus: string;
  paymentMethod: string;
  date: string;
  raw?: any;
}

interface PaymentDetails {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "success" | "failed";
  paymentMethod?: string;
  paidAt?: Date;
}

/* =========================
   STATUS MAPPING
========================= */
const mapStatus = (status: string): Order["status"] => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "processing":
    case "confirmed":
      return "Processing";
    case "shipped":
      return "Shipped";
    default:
      return "Pending";
  }
};

/* =========================
   STATUS BADGE
========================= */
const statusConfig: Record<
  Order["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  Delivered: {
    label: "Delivered",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Processing: {
    label: "Processing",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Shipped: {
    label: "Shipped",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  Pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
};

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* =========================
   PAYMENT STATUS BADGE
========================= */
const PaymentStatusBadgeTable = ({ status }: { status?: string }) => {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-1.5 md:px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 whitespace-nowrap">
        <Clock size={12} />
        Pending
      </span>
    );
  }
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-1.5 md:px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 whitespace-nowrap">
        <Check size={12} />
        Paid
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-1.5 md:px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 whitespace-nowrap">
        <AlertTriangle size={12} />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-1.5 md:px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 whitespace-nowrap">
      <CreditCard size={12} />
      Not Paid
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status?: string }) => {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
        <Clock size={12} />
        Pending
      </span>
    );
  }
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <Check size={12} />
        Success
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
        <AlertTriangle size={12} />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
      <CreditCard size={12} />
      Not Initiated
    </span>
  );
};

/* =========================
   STAT CARD
========================= */
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) => {
  // Format large numbers with abbreviations for better display
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
      if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
      return `₹${val}`;
    }
    // Handle string values that start with ₹
    const numVal = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (numVal >= 10000000) return `₹${(numVal / 10000000).toFixed(1)}Cr`;
    if (numVal >= 100000) return `₹${(numVal / 100000).toFixed(1)}L`;
    if (numVal >= 1000) return `₹${(numVal / 1000).toFixed(1)}K`;
    return val;
  };

  const displayValue = formatValue(value);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-5 flex items-center gap-2 md:gap-4">
      <div className={`p-2 md:p-3 rounded-xl ${color} flex-shrink-0`}>
        <Icon size={16} className="md:text-2xl text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm md:text-xl font-bold text-gray-800 mt-0.5 truncate" title={typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}>
          {displayValue}
        </p>
      </div>
    </div>
  );
};

/* =========================
   SORT ICON
========================= */
const SortIcon = () => (
  <ArrowUpDown size={13} className="inline ml-1 text-gray-400" />
);

/* =========================
   TOAST NOTIFICATION
========================= */
const ToastNotification = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: "success" | "error"; 
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white max-w-[90vw] md:max-w-sm`}>
      {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={14} />
      </button>
    </div>
  );
};

/* =========================
   VIEW ORDER MODAL
========================= */
const ViewOrderModal = ({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "payment">("details");

  if (!order || !order.raw) return null;

  const rawOrder = order.raw;
  const paymentDetails = rawOrder.paymentDetails;

  const hasValidPayment = paymentDetails?.status === "success";
  const paymentExists = paymentDetails?.status !== undefined;
  const paymentNotPaid = !paymentExists || paymentDetails?.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-2 md:mx-0">
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              #{order.orderId || order.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-4 md:px-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium transition relative whitespace-nowrap ${
              activeTab === "details" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Order Details
            {activeTab === "details" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium transition relative whitespace-nowrap ${
              activeTab === "payment" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Payment Information
            {!hasValidPayment && paymentNotPaid && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                Not Paid
              </span>
            )}
            {activeTab === "payment" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {activeTab === "details" ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package size={14} className="text-indigo-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="font-medium text-gray-800 break-words">{rawOrder.addressSnapshot?.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 break-words">{rawOrder.addressSnapshot?.phoneNumber || "N/A"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-gray-700 text-sm break-words">
                      {rawOrder.addressSnapshot?.addressLine1}
                      {rawOrder.addressSnapshot?.addressLine2 && `, ${rawOrder.addressSnapshot.addressLine2}`}
                      <br />
                      {rawOrder.addressSnapshot?.city}, {rawOrder.addressSnapshot?.state} - {rawOrder.addressSnapshot?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-indigo-500" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {rawOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 break-words">{item.productName}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} {item.unit || ""} × ₹{item.price}</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{item.subtotal}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between flex-wrap gap-1">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700">₹{rawOrder.subtotal}</span>
                  </div>
                  {rawOrder.tax > 0 && (
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-700">₹{rawOrder.tax}</span>
                    </div>
                  )}
                  {rawOrder.shippingCharge > 0 && (
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-700">₹{rawOrder.shippingCharge}</span>
                    </div>
                  )}
                  {rawOrder.discount > 0 && (
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">-₹{rawOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-indigo-100 font-semibold flex-wrap gap-1">
                    <span className="text-gray-800">Total</span>
                    <span className="text-indigo-700 text-base md:text-lg">₹{rawOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard size={14} className="text-indigo-500" />
                    Payment Overview
                  </h3>
                  <PaymentStatusBadge status={paymentDetails?.status} />
                </div>

                {paymentDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
                    <div>
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="font-semibold text-gray-800 break-words">
                        ₹{paymentDetails.amount
                          ? (paymentDetails.amount / 100).toLocaleString("en-IN")
                          : rawOrder.totalAmount || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Currency</p>
                      <p className="font-medium text-gray-800">{paymentDetails.currency || "INR"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment Method</p>
                      <p className="font-medium text-gray-800 capitalize">
                        {paymentDetails.paymentMethod || "N/A"}
                      </p>
                    </div>
                    {paymentDetails.paidAt && (
                      <div>
                        <p className="text-xs text-gray-400">Paid At</p>
                        <p className="font-medium text-gray-800 text-sm break-words">
                          {new Date(paymentDetails.paidAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600 flex items-center gap-2 pt-1">
                    <AlertTriangle size={14} />
                    Payment has not been initiated for this order.
                  </p>
                )}
              </div>

              {paymentDetails && (paymentDetails.razorpayOrderId || paymentDetails.razorpayPaymentId) && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Receipt size={14} className="text-indigo-500" />
                    Razorpay Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {paymentDetails.razorpayOrderId && (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-gray-400">Razorpay Order ID</p>
                        <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
                          {paymentDetails.razorpayOrderId}
                        </p>
                      </div>
                    )}
                    {paymentDetails.razorpayPaymentId && (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-gray-400">Razorpay Payment ID</p>
                        <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
                          {paymentDetails.razorpayPaymentId}
                        </p>
                      </div>
                    )}
                    {paymentDetails.razorpaySignature && (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-gray-400">Signature</p>
                        <p className="font-mono text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 break-all">
                          {paymentDetails.razorpaySignature}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentDetails?.status === "pending" && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg px-4 py-3">
                  <Clock size={14} />
                  Payment is pending. Waiting for customer to complete payment.
                </div>
              )}
              {paymentDetails?.status === "failed" && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                  <AlertTriangle size={14} />
                  Payment failed. Please check with the customer.
                </div>
              )}
              {paymentDetails?.status === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3">
                  <Check size={14} />
                  Payment completed successfully.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   EDIT ORDER MODAL
========================= */
const EditOrderModal = ({
  order,
  onClose,
  onSave,
}: {
  order: Order | null;
  onClose: () => void;
  onSave: (updatedOrder: any) => void;
}) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (order?.raw) {
      setStatus(order.raw.status || "pending");
      setFormData({
        fullName: order.raw.addressSnapshot?.fullName || "",
        phoneNumber: order.raw.addressSnapshot?.phoneNumber || "",
        addressLine1: order.raw.addressSnapshot?.addressLine1 || "",
        city: order.raw.addressSnapshot?.city || "",
        state: order.raw.addressSnapshot?.state || "",
        pincode: order.raw.addressSnapshot?.pincode || "",
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/b2b-orders?id=${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status,
          addressSnapshot: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            addressLine1: formData.addressLine1,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data.data);
        onClose();
      } else {
        setError(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!order || !order.raw) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 md:mx-0">
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Update Order</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              #{order.orderId || order.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="bg-indigo-50/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Power size={14} className="text-indigo-500" />
              Update Order Status
            </h3>
            <div className="space-y-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <p className="text-xs text-gray-500">
                Changing status will be recorded in order history
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package size={14} className="text-indigo-500" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Updating..." : "Update Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   DELETE CONFIRMATION MODAL
========================= */
const DeleteConfirmModal = ({
  order,
  onClose,
  onConfirm,
}: {
  order: Order | null;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 md:mx-0">
        <div className="p-5">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
            Delete Order
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete order #{order.orderId || order.id.slice(-6).toUpperCase()}?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   MOBILE ORDER CARD
========================= */
const MobileOrderCard = ({ order, onView, onEdit, onToggleStatus }: { 
  order: Order; 
  onView: (order: Order) => void; 
  onEdit: (order: Order) => void; 
  onToggleStatus: (order: Order) => void;
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-indigo-600 font-semibold text-sm">
            #{order.orderId || order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-gray-800 font-medium text-sm mt-1">{order.customer}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Product:</span>
          <span className="text-gray-700 font-medium truncate max-w-[180px]">{order.product}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Quantity:</span>
          <span className="text-gray-700">{order.quantity}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total:</span>
          <span className="text-gray-800 font-bold">{order.total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment:</span>
          <PaymentStatusBadgeTable status={order.paymentStatus} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date:</span>
          <span className="text-gray-500 text-xs">
            {new Date(order.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button 
          onClick={() => onView(order)} 
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition text-sm"
        >
          <Eye size={14} /> View
        </button>
        <button 
          onClick={() => onEdit(order)} 
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition text-sm"
        >
          <Pencil size={14} /> Edit
        </button>
        <button 
          onClick={() => onToggleStatus(order)} 
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition text-sm"
        >
          <Power size={14} /> Status
        </button>
      </div>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
const B2BOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Check if mobile view (screen width < 768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/b2b-orders?page=${page}&limit=${rowsPerPage}&status=${filterStatus}&search=${searchTerm}`
      );
      const json = await res.json();

      if (json.success) {
        const formatted = json.data.map((order: any) => ({
          id: order._id,
          orderId: order.orderId,
          customer: order.addressSnapshot?.fullName || "N/A",
          product: order.items?.[0]?.productName || "Multiple Items",
          quantity:
            order.items?.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            ) + " items",
          total: `₹${order.totalAmount}`,
          status: mapStatus(order.status),
          paymentStatus: order.paymentDetails?.status || "not_initiated",
          paymentMethod: order.paymentDetails?.paymentMethod || "N/A",
          date: order.createdAt,
          raw: order,
        }));

        setOrders(formatted);
        setTotalPages(json.pagination.totalPages);
        setTotalCount(json.pagination.total || json.data.length);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setToast({ message: "Failed to fetch orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, filterStatus, rowsPerPage]);

  const stats = {
    total: totalCount || orders.length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    pending: orders.filter((o) => o.status === "Pending").length,
    paid: orders.filter((o) => o.paymentStatus === "success").length,
    revenue: orders.reduce((sum, order) => {
      const val = parseFloat(order.total.replace(/[^0-9.]/g, ""));
      return sum + val;
    }, 0),
  };

  const startItem = (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, stats.total);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSaveOrder = async (updatedOrder: any) => {
    await fetchOrders();
    setToast({ message: "Order updated successfully!", type: "success" });
  };

  const handleDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;

    try {
      const response = await fetch(`/api/b2b-orders?id=${deletingOrder.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchOrders();
        setToast({ message: "Order deleted successfully!", type: "success" });
        setIsDeleteModalOpen(false);
        setDeletingOrder(null);
      } else {
        setToast({ message: "Failed to delete order", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setToast({ message: "Network error. Please try again.", type: "error" });
    }
  };

  const handleToggleStatus = async (order: Order) => {
    const statusCycle = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
    const currentIndex = statusCycle.indexOf(order.raw?.status || "pending");
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      const response = await fetch(`/api/b2b-orders?id=${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        setToast({ message: `Order status updated to ${nextStatus}`, type: "success" });
      } else {
        setToast({ message: "Failed to update status", type: "error" });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({ message: "Network error. Please try again.", type: "error" });
    }
  };

  return (
    <>
      <div className="p-3 md:p-6 min-h-screen" style={{ background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">B2B Orders</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Manage and track all B2B orders</p>
        </div>

        {/* Stats Grid - Responsive with 2 columns on mobile, 5 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-indigo-500" />
          <StatCard icon={DollarSign} label="Total Revenue" value={stats.revenue} color="bg-green-500" />
          <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
          <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-400" />
          <StatCard icon={CreditCard} label="Paid Orders" value={stats.paid} color="bg-purple-500" />
        </div>

        {/* Search and Filters - Responsive */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer, Razorpay ID..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative flex-1 sm:flex-none">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setPage(1);
                    setFilterStatus(e.target.value);
                  }}
                  className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-500">
                <span className="font-medium hidden sm:inline">Rows:</span>
                {[10, 25, 50, 100].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setRowsPerPage(n);
                      setPage(1);
                    }}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-semibold transition ${
                      rowsPerPage === n
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!loading && orders.length > 0 && (
          <p className="text-xs text-gray-500 mb-3 px-1">
            Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>{" "}
            of <span className="font-semibold text-gray-700">{stats.total}</span> orders · Page {page} of {totalPages}
          </p>
        )}

        {/* Orders Section - Desktop Table / Mobile Cards */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date <SortIcon /></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
                          #{order.orderId || order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                          {order.product}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {order.quantity}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
                          {order.total}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PaymentStatusBadgeTable status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <CreditCard size={12} className="text-gray-400" />
                            {order.paymentMethod === "razorpay" ? "Razorpay" : order.paymentMethod || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition" title="View Order Details">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => handleEditOrder(order)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="Edit Order">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => handleToggleStatus(order)} className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 transition" title="Quick Status Toggle">
                              <Power size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible only on mobile */}
              <div className="md:hidden p-3">
                {orders.map((order) => (
                  <MobileOrderCard 
                    key={order.id} 
                    order={order} 
                    onView={handleViewOrder} 
                    onEdit={handleEditOrder} 
                    onToggleStatus={handleToggleStatus} 
                  />
                ))}
              </div>

              {orders.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <Package size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No orders found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} className="md:text-sm" /> Prev
            </button>
            <span className="text-xs md:text-sm text-gray-500 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} className="md:text-sm" />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {isEditModalOpen && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingOrder(null);
          }}
          onSave={handleSaveOrder}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          order={deletingOrder}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingOrder(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default B2BOrders;