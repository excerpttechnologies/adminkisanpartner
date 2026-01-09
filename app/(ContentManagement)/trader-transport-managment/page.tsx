// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// /* ================= Interfaces ================= */

// interface ProductItem {
//   productId: string;
//   grade: string;
//   quantity: number;
//   nearestMarket: string;
//   deliveryDate?: string;
// }

// interface MarketDetails {
//   _id: string;
//   marketName: string;
//   exactAddress: string;
//   landmark?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
// }

// interface TraderLocation {
//   address: string;
//   district: string;
//   state: string;
//   pincode: string;
//   taluk: string;
//   villageGramaPanchayat: string;
//   post?: string;
// }

// interface TraderDetails {
//   traderId: string;
//   traderName: string;
//   traderMobile: string;
//   location: TraderLocation;
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity: string;
//   driverName: string;
//   driverMobile: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   pickupMarket?: MarketDetails;
//   traderDetails?: TraderDetails;
//   productItems: ProductItem[];
//   transporterDetails?: TransporterDetails;
//   transporterStatus?: string;
//   adminPickupKey?: string;
//   createdAt: string;
// }

// interface ProductDetails {
//   [key: string]: string;
// }

// /* ================= Component ================= */

// const AdminTransport: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [productNames, setProductNames] = useState<ProductDetails>({});
//   const [loading, setLoading] = useState(true);

//   /* ================= Fetch Product Names ================= */
//   const fetchProductNames = async (productIds: string[]) => {
//     const names: ProductDetails = {};

//     await Promise.all(
//       productIds.map(async (id) => {
//         try {
//           const res = await axios.get(`https://kisan.etpl.ai/product/${id}`);
//           names[id] =
//             res.data?.data?.productName ||
//             res.data?.data?.subCategoryId?.name ||
//             "Product";
//         } catch {
//           names[id] = "Product";
//         }
//       })
//     );

//     setProductNames(names);
//   };

//   /* ================= Fetch Market ================= */
//   const fetchMarket = async (marketId: string) => {
//     try {
//       const res = await axios.get(`https://kisan.etpl.ai/api/market/${marketId}`);
//       if (res.data?.data) return res.data.data;
//     } catch (err) {
//       console.error("Market fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Trader ================= */
//   const fetchTrader = async (traderId: string) => {
//     try {
//       const res = await axios.get(`https://kisan.etpl.ai/farmer/register/all`, {
//         params: { traderId, role: "trader" },
//       });

//       if (res.data.success && res.data.data.length > 0) {
//         const t = res.data.data[0];
//         return {
//           traderId,
//           traderName: t.personalInfo?.name || "N/A",
//           traderMobile: t.personalInfo?.mobileNo || "N/A",
//           location: {
//             address: t.personalInfo?.address || "",
//             state: t.personalInfo?.state || "",
//             pincode: t.personalInfo?.pincode || "",
//             district: t.personalInfo?.district || "",
//             taluk: t.personalInfo?.taluk || "",
//             villageGramaPanchayat: t.personalInfo?.villageGramaPanchayat || "",
//             post: t.personalInfo?.post || "",
//           },
//         };
//       }
//     } catch (err) {
//       console.error("Trader fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Orders ================= */
//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

//         if (res.data.success) {
//           const orderList = res.data.data;

//           const enriched = await Promise.all(
//             orderList.map(async (o: any) => {
//               // Fetch market details if available
//               const marketId = o.productItems?.[0]?.nearestMarket;
//               const pickupMarket = marketId ? await fetchMarket(marketId) : null;
              
//               // Fetch trader details
//               const traderDetails = await fetchTrader(o.traderId);
              
//               return {
//                 _id: o._id,
//                 orderId: o.orderId,
//                 traderId: o.traderId,
//                 productItems: o.productItems || [],
//                 pickupMarket,
//                 traderDetails,
//                 transporterDetails: o.transporterDetails || undefined,
//                 transporterStatus: o.transporterStatus || "pending",
//                 adminPickupKey: o.adminPickupKey || undefined,
//                 createdAt: o.createdAt || new Date().toISOString(),
//               };
//             })
//           );

//           // Fetch product names for all unique product IDs
//           const productIds: string[] = [];
//           enriched.forEach((o) =>
//             o.productItems.forEach((p) => {
//               if (!productIds.includes(p.productId)) productIds.push(p.productId);
//             })
//           );

//           await fetchProductNames(productIds);
//           setOrders(enriched);
//         }
//       } catch (err) {
//         console.error("Order fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrders();
//   }, []);

//   /* ================= Handle Select Transporter ================= */
//   const handleSelectTransporter = async (orderId: string) => {
//     try {
//       const res = await axios.post(
//         `https://kisan.etpl.ai/api/orders/${orderId}/admin-select-transporter`
//       );

//       alert("Pickup Key Generated ✅");

//       // Update the selected order with new pickup key
//       if (selectedOrder) {
//         setSelectedOrder({
//           ...selectedOrder,
//           adminPickupKey: res.data.pickupKey,
//         });
//       }

//       // Update the orders list
//       setOrders(prevOrders =>
//         prevOrders.map(order =>
//           order.orderId === orderId
//             ? { ...order, adminPickupKey: res.data.pickupKey }
//             : order
//         )
//       );
//     } catch (err) {
//       console.error("Error generating pickup key:", err);
//       alert("Failed to generate pickup key");
//     }
//   };

//   /* ================= Status Badge Colors ================= */
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "started":
//         return "bg-yellow-100 text-yellow-800";
//       case "accepted":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-xl font-semibold text-gray-600">Loading Orders...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">🛠 Transport Management (Admin)</h1>
//         <p className="text-gray-600">Manage transporters, generate pickup keys, and track orders</p>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Pickup Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Delivery Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Transporter
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Items Count
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <tr 
//                   key={order._id} 
//                   className="hover:bg-gray-50 transition-colors duration-150"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-semibold text-gray-900">{order.orderId}</div>
//                     <div className="text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     {order.pickupMarket ? (
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.pickupMarket.marketName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {order.pickupMarket.district}, {order.pickupMarket.state}
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Not specified</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {order.traderDetails ? (
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.traderDetails.traderName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {order.traderDetails.location.district}, {order.traderDetails.location.state}
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Loading...</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {order.transporterDetails ? (
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.transporterDetails.transporterName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {order.transporterDetails.vehicleType}
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-400">Waiting for transporter</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.transporterStatus || "pending")}`}>
//                       {order.transporterStatus || "pending"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-center">
//                       <div className="text-lg font-bold text-gray-900">
//                         {order.productItems.length}
//                       </div>
//                       <div className="text-sm text-gray-500">items</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {selectedOrder && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div 
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
//                   <p className="text-gray-600 mt-1">{selectedOrder.orderId}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* Order Information */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📋</span>
//                   Order Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm text-gray-500">Order ID</p>
//                     <p className="font-medium">{selectedOrder.orderId}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-sm text-gray-500">Created At</p>
//                     <p className="font-medium">
//                       {new Date(selectedOrder.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-sm text-gray-500">Trader ID</p>
//                     <p className="font-medium">{selectedOrder.traderId}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Pickup Details */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-green-100 text-green-600 p-2 rounded-lg">📍</span>
//                   Pickup Location
//                 </h3>
//                 {selectedOrder.pickupMarket ? (
//                   <div className="bg-white border border-gray-200 rounded-lg p-4">
//                     <h4 className="font-bold text-gray-800 text-lg mb-2">
//                       {selectedOrder.pickupMarket.marketName}
//                     </h4>
//                     <p className="text-gray-600 mb-2">{selectedOrder.pickupMarket.exactAddress}</p>
//                     <div className="flex flex-wrap gap-2 text-sm">
//                       <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
//                         {selectedOrder.pickupMarket.district}
//                       </span>
//                       <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
//                         {selectedOrder.pickupMarket.state}
//                       </span>
//                       {selectedOrder.pickupMarket.pincode && (
//                         <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
//                           📮 {selectedOrder.pickupMarket.pincode}
//                         </span>
//                       )}
//                     </div>
//                     {selectedOrder.pickupMarket.landmark && (
//                       <p className="mt-3 text-sm text-gray-500">
//                         <span className="font-medium">Landmark:</span> {selectedOrder.pickupMarket.landmark}
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-400">
//                     No pickup location specified
//                   </div>
//                 )}
//               </div>

//               {/* Delivery Details */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">🏠</span>
//                   Delivery Location
//                 </h3>
//                 {selectedOrder.traderDetails ? (
//                   <div className="bg-white border border-gray-200 rounded-lg p-4">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h4 className="font-bold text-gray-800 text-lg">
//                           {selectedOrder.traderDetails.traderName}
//                         </h4>
//                         <p className="text-blue-600 font-medium mt-1">
//                           📱 {selectedOrder.traderDetails.traderMobile}
//                         </p>
//                       </div>
//                     </div>
//                     <p className="text-gray-600 mb-3">{selectedOrder.traderDetails.location.address}</p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-500">📍</span>
//                         <span>{selectedOrder.traderDetails.location.taluk}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-500">🏛️</span>
//                         <span>{selectedOrder.traderDetails.location.district}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-500">🌍</span>
//                         <span>{selectedOrder.traderDetails.location.state}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-500">📮</span>
//                         <span>{selectedOrder.traderDetails.location.pincode}</span>
//                       </div>
//                     </div>
//                     {selectedOrder.traderDetails.location.villageGramaPanchayat && (
//                       <div className="mt-3 pt-3 border-t border-gray-100">
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Panchayat:</span> {selectedOrder.traderDetails.location.villageGramaPanchayat}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-400">
//                     Loading trader details...
//                   </div>
//                 )}
//               </div>

//               {/* Product Items */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">📦</span>
//                   Product Items ({selectedOrder.productItems.length})
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {selectedOrder.productItems.map((item, idx) => (
//                     <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
//                       <div className="flex justify-between items-start mb-3">
//                         <h4 className="font-bold text-gray-800">
//                           {productNames[item.productId] || "Product"}
//                         </h4>
//                         <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
//                           Grade: {item.grade}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <div className="text-lg font-bold text-gray-900">
//                           {item.quantity} units
//                         </div>
//                         <div className="text-xs text-gray-500 font-mono">
//                           ID: {item.productId.substring(0, 8)}...
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-red-100 text-red-600 p-2 rounded-lg">🚚</span>
//                   Transporter Information
//                 </h3>
//                 {selectedOrder.transporterDetails ? (
//                   <div className="bg-white border border-gray-200 rounded-lg p-5">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Transporter Name</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.transporterName}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Contact</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.transporterMobile}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Vehicle Type</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.vehicleType}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Vehicle Number</p>
//                         <p className="font-medium font-mono">{selectedOrder.transporterDetails.vehicleNumber}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Capacity</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.vehicleCapacity}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">Driver Name</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.driverName}</p>
//                       </div>
//                       <div className="space-y-1 md:col-span-2 lg:col-span-1">
//                         <p className="text-sm text-gray-500">Driver Contact</p>
//                         <p className="font-medium">{selectedOrder.transporterDetails.driverMobile}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
//                     No transporter assigned yet
//                   </div>
//                 )}
//               </div>

//               {/* Admin Actions */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="bg-green-100 text-green-600 p-2 rounded-lg">🛠</span>
//                   Admin Actions
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-4">
//                     <span className="text-gray-700 font-medium">Status:</span>
//                     <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedOrder.transporterStatus || "pending")}`}>
//                       {selectedOrder.transporterStatus || "pending"}
//                     </span>
//                   </div>

//                   {selectedOrder.transporterDetails && !selectedOrder.adminPickupKey && (
//                     <button
//                       onClick={() => handleSelectTransporter(selectedOrder.orderId)}
//                       className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
//                     >
//                       <span>✓</span>
//                       Select Transporter & Generate Pickup Key
//                     </button>
//                   )}

//                   {selectedOrder.adminPickupKey && (
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
//                           🔐
//                         </div>
//                         <div>
//                           <h4 className="font-bold text-blue-800">Pickup Key Generated</h4>
//                           <p className="text-sm text-blue-600">
//                             Share this key with the transporter to start the journey
//                           </p>
//                         </div>
//                       </div>
//                       <div className="bg-white border-2 border-blue-300 rounded-lg p-4 text-center">
//                         <div className="text-sm text-gray-500 mb-2">PICKUP KEY</div>
//                         <div className="text-3xl font-bold text-blue-700 font-mono tracking-widest">
//                           {selectedOrder.adminPickupKey}
//                         </div>
//                       </div>
//                       <div className="mt-3 text-xs text-gray-500 text-center">
//                         Valid for this order only • Expires upon completion
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminTransport;






//UPDATED BY SAGAR



"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* ================= Interfaces ================= */

interface ProductItem {
  productId: string;
  grade: string;
  quantity: number;
  nearestMarket: string;
  deliveryDate?: string;
}

interface MarketDetails {
  _id: string;
  marketName: string;
  exactAddress: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

interface TraderLocation {
  address: string;
  district: string;
  state: string;
  pincode: string;
  taluk: string;
  villageGramaPanchayat: string;
  post?: string;
}

interface TraderDetails {
  traderId: string;
  traderName: string;
  traderMobile: string;
  location: TraderLocation;
}

interface TransporterDetails {
  transporterId: string;
  transporterName: string;
  transporterMobile: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity: string;
  driverName: string;
  driverMobile: string;
}

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
  pickupMarket?: MarketDetails;
  traderDetails?: TraderDetails;
  productItems: ProductItem[];
  transporterDetails?: TransporterDetails;
  transporterStatus?: string;
  adminPickupKey?: string;
  createdAt: string;
}

interface ProductDetails {
  [key: string]: string;
}

/* ================= Component ================= */

const AdminTransport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productNames, setProductNames] = useState<ProductDetails>({});
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Product Names ================= */
  const fetchProductNames = async (productIds: string[]) => {
    const names: ProductDetails = {};

    await Promise.all(
      productIds.map(async (id) => {
        try {
          const res = await axios.get(`https://kisan.etpl.ai/product/${id}`);
          names[id] =
            res.data?.data?.productName ||
            res.data?.data?.subCategoryId?.name ||
            "Product";
        } catch {
          names[id] = "Product";
        }
      })
    );

    setProductNames(names);
  };

  /* ================= Fetch Market ================= */
  const fetchMarket = async (marketId: string) => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/api/market/${marketId}`);
      if (res.data?.data) return res.data.data;
    } catch (err) {
      console.error("Market fetch error:", err);
    }
    return null;
  };

  /* ================= Fetch Trader ================= */
  const fetchTrader = async (traderId: string) => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/farmer/register/all`, {
        params: { traderId, role: "trader" },
      });

      if (res.data.success && res.data.data.length > 0) {
        const t = res.data.data[0];
        return {
          traderId,
          traderName: t.personalInfo?.name || "N/A",
          traderMobile: t.personalInfo?.mobileNo || "N/A",
          location: {
            address: t.personalInfo?.address || "",
            state: t.personalInfo?.state || "",
            pincode: t.personalInfo?.pincode || "",
            district: t.personalInfo?.district || "",
            taluk: t.personalInfo?.taluk || "",
            villageGramaPanchayat: t.personalInfo?.villageGramaPanchayat || "",
            post: t.personalInfo?.post || "",
          },
        };
      }
    } catch (err) {
      console.error("Trader fetch error:", err);
    }
    return null;
  };

  /* ================= Fetch Orders ================= */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

        if (res.data.success) {
          const orderList = res.data.data;

          const enriched = await Promise.all(
            orderList.map(async (o: any) => {
              // Fetch market details if available
              const marketId = o.productItems?.[0]?.nearestMarket;
              const pickupMarket = marketId ? await fetchMarket(marketId) : null;
              
              // Fetch trader details
              const traderDetails = await fetchTrader(o.traderId);
              
              return {
                _id: o._id,
                orderId: o.orderId,
                traderId: o.traderId,
                productItems: o.productItems || [],
                pickupMarket,
                traderDetails,
                transporterDetails: o.transporterDetails || undefined,
                transporterStatus: o.transporterStatus || "pending",
                adminPickupKey: o.adminPickupKey || undefined,
                createdAt: o.createdAt || new Date().toISOString(),
              };
            })
          );

          // Fetch product names for all unique product IDs
          const productIds: string[] = [];
         enriched.forEach((o) =>
  o.productItems.forEach((p: ProductItem) => {
    if (!productIds.includes(p.productId)) productIds.push(p.productId);
  })
);

          await fetchProductNames(productIds);
          setOrders(enriched);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* ================= Handle Select Transporter ================= */
  const handleSelectTransporter = async (orderId: string) => {
    try {
      const res = await axios.post(
        `https://kisan.etpl.ai/api/orders/${orderId}/admin-select-transporter`
      );

      alert("Pickup Key Generated ✅");

      // Update the selected order with new pickup key
      if (selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          adminPickupKey: res.data.pickupKey,
        });
      }

      // Update the orders list
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, adminPickupKey: res.data.pickupKey }
            : order
        )
      );
    } catch (err) {
      console.error("Error generating pickup key:", err);
      alert("Failed to generate pickup key");
    }
  };

  /* ================= Status Badge Colors ================= */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "started":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading Orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🛠 Transport Management (Admin)</h1>
        <p className="text-gray-600">Manage transporters, generate pickup keys, and track orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pickup Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Delivery Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Transporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Items Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{order.orderId}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.pickupMarket ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.pickupMarket.marketName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.pickupMarket.district}, {order.pickupMarket.state}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.traderDetails ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.traderDetails.traderName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.traderDetails.location.district}, {order.traderDetails.location.state}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Loading...</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.transporterDetails ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.transporterDetails.transporterName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.transporterDetails.vehicleType}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Waiting for transporter</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.transporterStatus || "pending")}`}>
                      {order.transporterStatus || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {order.productItems.length}
                      </div>
                      <div className="text-sm text-gray-500">items</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <p className="text-gray-600 mt-1">{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📋</span>
                  Order Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder.orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Trader ID</p>
                    <p className="font-medium">{selectedOrder.traderId}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Details */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-600 p-2 rounded-lg">📍</span>
                  Pickup Location
                </h3>
                {selectedOrder.pickupMarket ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 text-lg mb-2">
                      {selectedOrder.pickupMarket.marketName}
                    </h4>
                    <p className="text-gray-600 mb-2">{selectedOrder.pickupMarket.exactAddress}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {selectedOrder.pickupMarket.district}
                      </span>
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        {selectedOrder.pickupMarket.state}
                      </span>
                      {selectedOrder.pickupMarket.pincode && (
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                          📮 {selectedOrder.pickupMarket.pincode}
                        </span>
                      )}
                    </div>
                    {selectedOrder.pickupMarket.landmark && (
                      <p className="mt-3 text-sm text-gray-500">
                        <span className="font-medium">Landmark:</span> {selectedOrder.pickupMarket.landmark}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No pickup location specified
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">🏠</span>
                  Delivery Location
                </h3>
                {selectedOrder.traderDetails ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">
                          {selectedOrder.traderDetails.traderName}
                        </h4>
                        <p className="text-blue-600 font-medium mt-1">
                          📱 {selectedOrder.traderDetails.traderMobile}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{selectedOrder.traderDetails.location.address}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📍</span>
                        <span>{selectedOrder.traderDetails.location.taluk}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">🏛️</span>
                        <span>{selectedOrder.traderDetails.location.district}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">🌍</span>
                        <span>{selectedOrder.traderDetails.location.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📮</span>
                        <span>{selectedOrder.traderDetails.location.pincode}</span>
                      </div>
                    </div>
                    {selectedOrder.traderDetails.location.villageGramaPanchayat && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Panchayat:</span> {selectedOrder.traderDetails.location.villageGramaPanchayat}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Loading trader details...
                  </div>
                )}
              </div>

              {/* Product Items */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">📦</span>
                  Product Items ({selectedOrder.productItems.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.productItems.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-800">
                          {productNames[item.productId] || "Product"}
                        </h4>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Grade: {item.grade}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-900">
                          {item.quantity} units
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          ID: {item.productId.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transporter Details */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 p-2 rounded-lg">🚚</span>
                  Transporter Information
                </h3>
                {selectedOrder.transporterDetails ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Transporter Name</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.transporterName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.transporterMobile}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Vehicle Type</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.vehicleType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Vehicle Number</p>
                        <p className="font-medium font-mono">{selectedOrder.transporterDetails.vehicleNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.vehicleCapacity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Driver Name</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.driverName}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2 lg:col-span-1">
                        <p className="text-sm text-gray-500">Driver Contact</p>
                        <p className="font-medium">{selectedOrder.transporterDetails.driverMobile}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    No transporter assigned yet
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-600 p-2 rounded-lg">🛠</span>
                  Admin Actions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedOrder.transporterStatus || "pending")}`}>
                      {selectedOrder.transporterStatus || "pending"}
                    </span>
                  </div>

                  {selectedOrder.transporterDetails && !selectedOrder.adminPickupKey && (
                    <button
                      onClick={() => handleSelectTransporter(selectedOrder.orderId)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      Select Transporter & Generate Pickup Key
                    </button>
                  )}

                  {selectedOrder.adminPickupKey && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                          🔐
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-800">Pickup Key Generated</h4>
                          <p className="text-sm text-blue-600">
                            Share this key with the transporter to start the journey
                          </p>
                        </div>
                      </div>
                      <div className="bg-white border-2 border-blue-300 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 mb-2">PICKUP KEY</div>
                        <div className="text-3xl font-bold text-blue-700 font-mono tracking-widest">
                          {selectedOrder.adminPickupKey}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 text-center">
                        Valid for this order only • Expires upon completion
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransport;