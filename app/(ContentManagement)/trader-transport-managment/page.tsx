// 'use client';

// import React, { useEffect, useState } from "react";
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

// interface GradePrice {
//   grade: string;
//   pricePerUnit: number;
//   totalQty: number;
//   quantityType: string;
//   priceType: string;
//   status: string;
// }

// interface FullProductDetails {
//   productId: string;
//   categoryId?: {
//     _id: string;
//     name: string;
//   };
//   subCategoryId?: string | {
//     _id: string;
//     name: string;
//   };
//   cropBriefDetails?: string;
//   farmingType?: string;
//   typeOfSeeds?: string;
//   packagingType?: string;
//   packageMeasurement?: string;
//   unitMeasurement?: string;
//   deliveryDate?: string;
//   deliveryTime?: string;
//   nearestMarket?: string;
//   cropPhotos?: string[];
//   gradePrices?: GradePrice[];
//   status?: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image?: string;
// }

// /* ================= Component ================= */

// const AdminTransport: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [productNames, setProductNames] = useState<ProductDetails>({});
//   const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= Fetch All Products ================= */
//   const fetchAllProducts = async () => {
//     try {
//       const res = await axios.get(`https://kisan.etpl.ai/product/all`);
//       if (res.data?.data) {
//         setAllProducts(res.data.data);
        
//         // Also extract product names
//         const names: ProductDetails = {};
//         res.data.data.forEach((product: FullProductDetails) => {
//           // Get subcategory name if it's an object, otherwise use categoryId name
//           let productName = "Product";
//           if (product.subCategoryId) {
//             if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//               productName = product.subCategoryId.name;
//             }
//           } else if (product.categoryId?.name) {
//             productName = product.categoryId.name;
//           }
//           names[product.productId] = productName;
//         });
//         setProductNames(names);
//       }
//     } catch (err) {
//       console.error("Products fetch error:", err);
//     }
//   };

//   /* ================= Fetch All SubCategories ================= */
//   const fetchSubCategories = async () => {
//     try {
//       const res = await axios.get(`https://kisan.etpl.ai/subcategory/all`);
//       if (res.data?.data) {
//         setSubCategories(res.data.data);
//       }
//     } catch (err) {
//       console.error("SubCategories fetch error:", err);
//     }
//   };

//   /* ================= Get SubCategory Name Helper ================= */
//   // const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
//   //   if (!product.subCategoryId) return "N/A";

//   //   // If backend already sent populated object with name
//   //   if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//   //     return product.subCategoryId.name;
//   //   }

//   //   // If only ID string, match from subCategories array
//   //   const subCatId = typeof product.subCategoryId === 'string' 
//   //     ? product.subCategoryId 
//   //     : product.subCategoryId._id;
    
//   //   const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
//   //   return subCat?.subCategoryName || "N/A";
//   // };

//   const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
//   if (!product.subCategoryId) return "N/A";

//   // If backend already sent populated object with name
//   if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//     return (product.subCategoryId as { name: string }).name;
//   }

//   // If only ID string, match from subCategories array
//   const subCatId = typeof product.subCategoryId === 'string' 
//     ? product.subCategoryId 
//     : (product.subCategoryId as { _id: string })._id;
  
//   const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
//   return subCat?.subCategoryName || "N/A";
// };
//   /* ================= Get Product Details by ID and Grade ================= */
//   const getProductDetails = (productId: string, grade: string) => {
//     const product = allProducts.find(p => p.productId === productId);
//     if (!product) return null;

//     const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
//     return {
//       ...product,
//       selectedGrade: gradeInfo
//     };
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

//         // First fetch subcategories and products
//         await fetchSubCategories();
//         await fetchAllProducts();

//         const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

//         if (res.data.success) {
//           const orderList = res.data.data;

//           const enriched = await Promise.all(
//             orderList.map(async (o: any) => {
//               const marketId = o.productItems?.[0]?.nearestMarket;
//               const pickupMarket = marketId ? await fetchMarket(marketId) : null;
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

//       if (selectedOrder) {
//         setSelectedOrder({
//           ...selectedOrder,
//           adminPickupKey: res.data.pickupKey,
//         });
//       }

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

//   /* ================= Styles ================= */
//   const thStyle = {
//     padding: "12px",
//     textAlign: "left" as const,
//     borderBottom: "2px solid #e5e7eb",
//     fontWeight: 600,
//     fontSize: "14px",
//   };

//   const tdStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #e5e7eb",
//     fontSize: "14px",
//   };

//   const modalOverlayStyle = {
//     position: "fixed" as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   };

//   const modalBoxStyle = {
//     background: "white",
//     padding: "30px",
//     borderRadius: "12px",
//     maxWidth: "900px",
//     width: "90%",
//     maxHeight: "90vh",
//     overflowY: "auto" as const,
//     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//   };

//   const sectionStyle = {
//     marginBottom: "24px",
//     paddingBottom: "20px",
//     borderBottom: "1px solid #e5e7eb",
//   };

//   const boxStyle = {
//     background: "#f9fafb",
//     padding: "16px",
//     borderRadius: "8px",
//     border: "1px solid #e5e7eb",
//   };

//   const gridStyle = {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "12px",
//   };

//   const enhancedProductBoxStyle = {
//     background: "#ffffff",
//     padding: "20px",
//     borderRadius: "10px",
//     border: "2px solid #e5e7eb",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   };

//   const infoItemStyle = {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: "4px",
//   };

//   const labelStyle = {
//     color: "#6b7280",
//     fontSize: "12px",
//     fontWeight: 500,
//     textTransform: "uppercase" as const,
//     letterSpacing: "0.5px",
//   };

//   /* ================= UI ================= */
//   if (loading) return <div style={{ padding: 40 }}>Loading Orders...</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>🛠 Trader Transport Management </h2>

//       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
//         <thead style={{ background: "#f3f4f6" }}>
//           <tr>
//             <th style={thStyle}>Order ID</th>
//             <th style={thStyle}>Pickup Location</th>
//             <th style={thStyle}>Delivery Location</th>
//             <th style={thStyle}>Transporter</th>
//             <th style={thStyle}>Status</th>
//             <th style={thStyle}>Items Count</th>
//             <th style={thStyle}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((o) => (
//             <tr key={o._id} style={{ background: "#fff" }}>
//               <td style={tdStyle}>
//                 <strong>{o.orderId}</strong>
//                 <br />
//                 <small style={{ color: "#666" }}>
//                   {new Date(o.createdAt).toLocaleDateString()}
//                 </small>
//               </td>
//               <td style={tdStyle}>
//                 {o.pickupMarket ? (
//                   <>
//                     <strong>{o.pickupMarket.marketName}</strong>
//                     <br />
//                     <small>{o.pickupMarket.district}, {o.pickupMarket.state}</small>
//                   </>
//                 ) : (
//                   "Not specified"
//                 )}
//               </td>
//               <td style={tdStyle}>
//                 {o.traderDetails ? (
//                   <>
//                     <strong>{o.traderDetails.traderName}</strong>
//                     <br />
//                     <small>
//                       {o.traderDetails.location.district}, {o.traderDetails.location.state}
//                     </small>
//                   </>
//                 ) : (
//                   "Loading..."
//                 )}
//               </td>
//               <td style={tdStyle}>
//                 {o.transporterDetails ? (
//                   <>
//                     <strong>{o.transporterDetails.transporterName}</strong>
//                     <br />
//                     <small>{o.transporterDetails.vehicleType}</small>
//                   </>
//                 ) : (
//                   <span style={{ color: "#999" }}>Waiting for transporter</span>
//                 )}
//               </td>
//               <td style={tdStyle}>
//                 <span style={{
//                   padding: "4px 8px",
//                   borderRadius: 4,
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   background: 
//                     o.transporterStatus === "completed" ? "#dcfce7" :
//                     o.transporterStatus === "started" ? "#fef3c7" :
//                     o.transporterStatus === "accepted" ? "#dbeafe" : "#f3f4f6",
//                   color: 
//                     o.transporterStatus === "completed" ? "#166534" :
//                     o.transporterStatus === "started" ? "#92400e" :
//                     o.transporterStatus === "accepted" ? "#1e40af" : "#6b7280",
//                 }}>
//                   {o.transporterStatus || "pending"}
//                 </span>
//               </td>
//               <td style={tdStyle}>
//                 <div style={{ textAlign: "center" as const }}>
//                   <strong>{o.productItems.length}</strong>
//                   <br />
//                   <small>items</small>
//                 </div>
//               </td>
//               <td style={tdStyle}>
//                 <button 
//                   onClick={() => setSelectedOrder(o)}
//                   style={{
//                     padding: "6px 12px",
//                     background: "#3b82f6",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 4,
//                     cursor: "pointer",
//                   }}
//                 >
//                   View Details
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ================= MODAL ================= */}
//       {selectedOrder && (
//         <div style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
//           <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <h3>Order Details: {selectedOrder.orderId}</h3>
//               <button 
//                 onClick={() => setSelectedOrder(null)}
//                 style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
//               >
//                 ✕
//               </button>
//             </div>

//             <div style={{ marginTop: 20 }}>
//               {/* Order Information */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>📋 Order Information</h4>
//                 <div style={gridStyle}>
//                   <div>
//                     <strong>Order ID:</strong> {selectedOrder.orderId}
//                   </div>
//                   <div>
//                     <strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Trader ID:</strong> {selectedOrder.traderId}
//                   </div>
//                 </div>
//               </div>

//               {/* Pickup Details */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>📍 Pickup Location</h4>
//                 {selectedOrder.pickupMarket ? (
//                   <div style={boxStyle}>
//                     <strong>{selectedOrder.pickupMarket.marketName}</strong>
//                     <p>{selectedOrder.pickupMarket.exactAddress}</p>
//                     <p>
//                       {selectedOrder.pickupMarket.district}, {selectedOrder.pickupMarket.state}
//                       {selectedOrder.pickupMarket.pincode && ` - ${selectedOrder.pickupMarket.pincode}`}
//                     </p>
//                     {selectedOrder.pickupMarket.landmark && (
//                       <p><small>Landmark: {selectedOrder.pickupMarket.landmark}</small></p>
//                     )}
//                   </div>
//                 ) : (
//                   <p style={{ color: "#999" }}>No pickup location specified</p>
//                 )}
//               </div>

//               {/* Delivery Details */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>🏠 Delivery Location</h4>
//                 {selectedOrder.traderDetails ? (
//                   <div style={boxStyle}>
//                     <strong>{selectedOrder.traderDetails.traderName}</strong>
//                     <p>📱 {selectedOrder.traderDetails.traderMobile}</p>
//                     <p>{selectedOrder.traderDetails.location.address}</p>
//                     <p>
//                       {selectedOrder.traderDetails.location.taluk}, {selectedOrder.traderDetails.location.district}
//                       <br />
//                       {selectedOrder.traderDetails.location.state} - {selectedOrder.traderDetails.location.pincode}
//                     </p>
//                     {selectedOrder.traderDetails.location.villageGramaPanchayat && (
//                       <p><small>Panchayat: {selectedOrder.traderDetails.location.villageGramaPanchayat}</small></p>
//                     )}
//                   </div>
//                 ) : (
//                   <p style={{ color: "#999" }}>Loading trader details...</p>
//                 )}
//               </div>

//               {/* Product Items - ENHANCED */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>📦 Product Items ({selectedOrder.productItems.length})</h4>
//                 <div style={{ display: "grid", gap: 16 }}>
//                   {selectedOrder.productItems.map((item, idx) => {
//                     const productDetails = getProductDetails(item.productId, item.grade);
                    
//                     return (
//                       <div key={idx} style={enhancedProductBoxStyle}>
//                         {/* Product Header */}
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
//                           <div>
//                             <h4 style={{ margin: 0, color: "#1f2937", fontSize: "16px" }}>
//                               {productNames[item.productId] || "Product"}
//                             </h4>
//                             <small style={{ color: "#6b7280" }}>ID: {item.productId}</small>
//                           </div>
//                           <span style={{ 
//                             background: "#dbeafe", 
//                             padding: "4px 12px", 
//                             borderRadius: 4, 
//                             fontSize: "13px",
//                             fontWeight: 600,
//                             color: "#1e40af"
//                           }}>
//                             Grade: {item.grade}
//                           </span>
//                         </div>

//                         {productDetails ? (
//                           <>
//                             {/* Category Info */}
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Product Name </small>
//                                 <strong>{getSubCategoryNameForProduct(productDetails)}</strong>
//                               </div>
//                             </div>

//                             {/* Product Description */}
//                             {productDetails.cropBriefDetails && (
//                               <div style={{ ...infoItemStyle, marginBottom: 12 }}>
//                                 <small style={labelStyle}>Description</small>
//                                 <p style={{ margin: "4px 0 0 0", color: "#374151" }}>
//                                   {productDetails.cropBriefDetails}
//                                 </p>
//                               </div>
//                             )}

//                             {/* Farming Details */}
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Farming Type</small>
//                                 <strong>{productDetails.farmingType || "N/A"}</strong>
//                               </div>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Seeds Type</small>
//                                 <strong>{productDetails.typeOfSeeds || "N/A"}</strong>
//                               </div>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Status</small>
//                                 <span style={{
//                                   padding: "2px 8px",
//                                   borderRadius: 4,
//                                   fontSize: "12px",
//                                   fontWeight: 600,
//                                   background: productDetails.status === "active" ? "#dcfce7" : "#fee2e2",
//                                   color: productDetails.status === "active" ? "#166534" : "#991b1b"
//                                 }}>
//                                   {productDetails.status || "N/A"}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Packaging Details */}
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Packaging Type</small>
//                                 <strong>{productDetails.packagingType || "N/A"}</strong>
//                               </div>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Package Size</small>
//                                 <strong>{productDetails.packageMeasurement || "N/A"}</strong>
//                               </div>
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Unit</small>
//                                 <strong>{productDetails.unitMeasurement || "N/A"}</strong>
//                               </div>
//                             </div>

//                             {/* Order Specific Details */}
//                             <div style={{ 
//                               background: "#f0f9ff", 
//                               padding: 12, 
//                               borderRadius: 6,
//                               marginBottom: 12
//                             }}>
//                               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Ordered Quantity</small>
//                                   <strong style={{ fontSize: "18px", color: "#0369a1" }}>
//                                     {item.quantity} {productDetails.unitMeasurement || "units"}
//                                   </strong>
//                                 </div>
//                                 {productDetails.selectedGrade && (
//                                   <div style={infoItemStyle}>
//                                     <small style={labelStyle}>Price per Unit</small>
//                                     <strong style={{ fontSize: "18px", color: "#0369a1" }}>
//                                       ₹{productDetails.selectedGrade.pricePerUnit}
//                                     </strong>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>

//                             {/* Grade Specific Info */}
//                             {productDetails.selectedGrade && (
//                               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Quantity Type</small>
//                                   <strong>{productDetails.selectedGrade.quantityType || "N/A"}</strong>
//                                 </div>
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Price Type</small>
//                                   <strong>{productDetails.selectedGrade.priceType || "N/A"}</strong>
//                                 </div>
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Available Qty</small>
//                                   <strong>{productDetails.selectedGrade.totalQty || "N/A"}</strong>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Delivery Info */}
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
//                               {productDetails.deliveryDate && (
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Delivery Date</small>
//                                   <strong>{new Date(productDetails.deliveryDate).toLocaleDateString()}</strong>
//                                 </div>
//                               )}
//                               {productDetails.deliveryTime && (
//                                 <div style={infoItemStyle}>
//                                   <small style={labelStyle}>Delivery Time</small>
//                                   <strong>{productDetails.deliveryTime}</strong>
//                                 </div>
//                               )}
//                             </div>

//                             {/* Crop Photos */}
//                             {productDetails.cropPhotos && productDetails.cropPhotos.length > 0 && (
//                               <div style={infoItemStyle}>
//                                 <small style={labelStyle}>Product Images</small>
//                                 <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
//                                   {productDetails.cropPhotos.slice(0, 4).map((photo, photoIdx) => (
//                                     <img 
//                                       key={photoIdx}
//                                       src={photo} 
//                                       alt={`Product ${photoIdx + 1}`}
//                                       style={{
//                                         width: 80,
//                                         height: 80,
//                                         objectFit: "cover",
//                                         borderRadius: 6,
//                                         border: "1px solid #e5e7eb"
//                                       }}
//                                       onError={(e) => {
//                                         (e.target as HTMLImageElement).style.display = 'none';
//                                       }}
//                                     />
//                                   ))}
//                                   {productDetails.cropPhotos.length > 4 && (
//                                     <div style={{
//                                       width: 80,
//                                       height: 80,
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       background: "#f3f4f6",
//                                       borderRadius: 6,
//                                       fontSize: "12px",
//                                       fontWeight: 600,
//                                       color: "#6b7280"
//                                     }}>
//                                       +{productDetails.cropPhotos.length - 4} more
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         ) : (
//                           <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
//                             <p>Product details not available</p>
//                             <small>Quantity: {item.quantity} units</small>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Transporter Details */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>🚚 Transporter Information</h4>
//                 {selectedOrder.transporterDetails ? (
//                   <div style={boxStyle}>
//                     <div style={gridStyle}>
//                       <div>
//                         <strong>Name:</strong> {selectedOrder.transporterDetails.transporterName}
//                       </div>
//                       <div>
//                         <strong>Contact:</strong> {selectedOrder.transporterDetails.transporterMobile}
//                       </div>
//                       <div>
//                         <strong>Vehicle:</strong> {selectedOrder.transporterDetails.vehicleType}
//                       </div>
//                       <div>
//                         <strong>Vehicle No:</strong> {selectedOrder.transporterDetails.vehicleNumber}
//                       </div>
//                       <div>
//                         <strong>Capacity:</strong> {selectedOrder.transporterDetails.vehicleCapacity}
//                       </div>
//                       <div>
//                         <strong>Driver:</strong> {selectedOrder.transporterDetails.driverName}
//                       </div>
//                       <div>
//                         <strong>Driver Contact:</strong> {selectedOrder.transporterDetails.driverMobile}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={{ color: "#999" }}>No transporter assigned yet</p>
//                 )}
//               </div>

//               {/* Admin Actions */}
//               <div style={sectionStyle}>
//                 <h4 style={{ marginBottom: 10, color: "#374151" }}>🛠 Admin Actions</h4>
//                 <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//                   <strong>Status:</strong>
//                   <span style={{
//                     padding: "4px 12px",
//                     borderRadius: 4,
//                     background: "#f3f4f6",
//                     fontWeight: "bold",
//                   }}>
//                     {selectedOrder.transporterStatus || "pending"}
//                   </span>
//                 </div>

//                 {selectedOrder.transporterDetails && !selectedOrder.adminPickupKey && (
//                   <button
//                     onClick={() => handleSelectTransporter(selectedOrder.orderId)}
//                     style={{
//                       marginTop: 15,
//                       padding: "10px 20px",
//                       background: "#10b981",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 6,
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Select Transporter & Generate Pickup Key
//                   </button>
//                 )}

//                 {selectedOrder.adminPickupKey && (
//                   <div style={{ marginTop: 15, padding: 15, background: "#f0f9ff", borderRadius: 8 }}>
//                     <strong style={{ color: "#0369a1" }}>🔐 Pickup Key Generated</strong>
//                     <p style={{ 
//                       fontSize: "24px", 
//                       fontWeight: "bold", 
//                       letterSpacing: "2px",
//                       background: "#1e40af",
//                       color: "white",
//                       padding: "10px",
//                       borderRadius: 6,
//                       textAlign: "center",
//                       marginTop: 10
//                     }}>
//                       {selectedOrder.adminPickupKey}
//                     </p>
//                     <p style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
//                       Share this key with the transporter to start the journey
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminTransport;









'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://kisan.etpl.ai';

interface Order {
  _id: string;
  orderId: string;
  traderName: string;
  traderMobile: string;
  marketToTraderTransport?: {
    status: string;
    transporterId?: string;
    transporterName?: string;
    transporterMobile?: string;
    adminGeneratedKey?: string;
    adminNotes?: string;
    journeyStartedAt?: string;
    journeyCompletedAt?: string;
    pickupKeyEnteredAt?: string;
    deliveryKeyEnteredAt?: string;
    deliveryKey?: string;
  };
}

const AdminMarkettoTrader: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/api/orders/market-to-trader/admin`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const res = await axios.get(url);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const generateAdminKey = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `KISANTRANSPORTER${randomNum}`;
  };

  const assignTransporter = async (order: Order) => {
    if (!order.marketToTraderTransport?.transporterId) {
      alert('No transporter assigned to this order');
      return;
    }

    const adminKey = generateAdminKey();
    
    try {
      const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/assign`, {
        orderId: order.orderId,
        transporterId: order.marketToTraderTransport.transporterId,
        adminGeneratedKey: adminKey,
        adminNotes
      });
      
      if (res.data.success) {
        setGeneratedKey(adminKey);
        setSelectedOrder(order);
        setShowKeyModal(true);
        setAdminNotes('');
        fetchOrders();
        
        console.log(`Notification sent to transporter: ${order.marketToTraderTransport.transporterName}`);
        alert(`Pickup key generated and sent to transporter ${order.marketToTraderTransport.transporterName}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error assigning transporter');
    }
  };

  const expireKey = async (orderId: string) => {
    if (!window.confirm('Expire this key? Transporter cannot use it anymore.')) return;
    
    try {
      const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/expire-key`, { orderId });
      
      if (res.data.success) {
        alert('Key expired successfully');
        fetchOrders();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error expiring key');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'accepted': return '#1976d2';
      case 'in_progress': return '#2196f3';
      case 'completed': return '#4caf50';
      default: return '#757575';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div style={{ padding: 20 }}>Loading orders...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: '#333' }}>Admin - Transport Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white'
          }}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Orders Count */}
      <div style={{ 
        marginBottom: 24, 
        padding: 16, 
        background: '#f5f5f5', 
        borderRadius: 8,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'accepted').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Accepted (Need Key)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>
            {orders.filter(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Pending</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>In Transit</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Completed</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          background: '#f5f5f5', 
          borderRadius: 8,
          color: '#666'
        }}>
          No transport orders found
        </div>
      ) : (
        <div style={{ 
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          background: '#fff'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Order ID</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Trader Info</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Transporter Info</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Key Details</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Timestamps</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const transport = order.marketToTraderTransport;
                const isPending = !transport || transport.status === 'pending';
                const isAccepted = transport?.status === 'accepted';
                const isInProgress = transport?.status === 'in_progress';
                const isCompleted = transport?.status === 'completed';
                const hasKey = !!transport?.adminGeneratedKey;
                const keyUsed = !!transport?.pickupKeyEnteredAt;

                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    {/* Order ID */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{order.orderId}</div>
                    </td>
                    
                    {/* Trader Info */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div><strong>{order.traderName}</strong></div>
                      <div style={{ fontSize: 14, color: '#666' }}>{order.traderMobile}</div>
                    </td>
                    
                    {/* Transporter Info */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      {transport?.transporterName ? (
                        <>
                          <div><strong>{transport.transporterName}</strong></div>
                          <div style={{ fontSize: 14, color: '#666' }}>{transport.transporterMobile}</div>
                        </>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic' }}>No transporter assigned</div>
                      )}
                    </td>
                    
                    {/* Status */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <span style={{
                        padding: '6px 12px',
                        background: getStatusColor(transport?.status),
                        color: 'white',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                      </span>
                      
                      {isAccepted && transport?.transporterName && (
                        <div style={{ 
                          marginTop: 8, 
                          padding: 8, 
                          background: '#e3f2fd', 
                          borderRadius: 4,
                          fontSize: 12 
                        }}>
                          ⚡ ACTION REQUIRED
                        </div>
                      )}
                    </td>
                    
                    {/* Key Details */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      {hasKey ? (
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Pickup Key:</div>
                          <div style={{ 
                            fontFamily: 'monospace', 
                            background: '#f5f5f5', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 12
                          }}>
                            {transport.adminGeneratedKey}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12 }}>
                            <span style={{ 
                              color: keyUsed ? '#4caf50' : '#ff9800',
                              fontWeight: 'bold'
                            }}>
                              {keyUsed ? '✅ USED' : '⏳ PENDING'}
                            </span>
                          </div>
                          {keyUsed && (
                            <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                              Used: {formatDate(transport.pickupKeyEnteredAt)}
                            </div>
                          )}
                        </div>
                      ) : isAccepted ? (
                        <div style={{ 
                          padding: 8, 
                          background: '#ffebee', 
                          borderRadius: 4,
                          color: '#d32f2f',
                          fontSize: 12
                        }}>
                          ⚠️ Need to generate key
                        </div>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic' }}>N/A</div>
                      )}
                      
                      {transport?.deliveryKey && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontWeight: 'bold', fontSize: 12 }}>Delivery Key:</div>
                          <div style={{ 
                            fontFamily: 'monospace', 
                            background: '#e8f5e9', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 12
                          }}>
                            {transport.deliveryKey}
                          </div>
                        </div>
                      )}
                    </td>
                    
                    {/* Timestamps */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      {transport?.journeyStartedAt && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: '#666' }}>Started:</div>
                          <div style={{ fontSize: 12 }}>{formatDate(transport.journeyStartedAt)}</div>
                        </div>
                      )}
                      {transport?.journeyCompletedAt && (
                        <div>
                          <div style={{ fontSize: 12, color: '#666' }}>Completed:</div>
                          <div style={{ fontSize: 12 }}>{formatDate(transport.journeyCompletedAt)}</div>
                        </div>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {isAccepted && !hasKey && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                assignTransporter(order);
                              }}
                              style={{
                                padding: '8px 16px',
                                background: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: 12,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              🔑 Generate Pickup Key
                            </button>
                            
                            <textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Admin notes (optional)"
                              rows={2}
                              style={{
                                width: '100%',
                                padding: 8,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                resize: 'vertical',
                                fontSize: 12
                              }}
                            />
                          </>
                        )}

                        {hasKey && !keyUsed && (
                          <button
                            onClick={() => expireKey(order.orderId)}
                            style={{
                              padding: '8px 16px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: 12,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Expire Key
                          </button>
                        )}

                        {isCompleted && (
                          <button
                            disabled
                            style={{
                              padding: '8px 16px',
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: 12,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✅ Completed
                          </button>
                        )}

                        {isPending && (
                          <button
                            disabled
                            style={{
                              padding: '8px 16px',
                              background: '#9e9e9e',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: 12,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ⏳ Waiting
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            disabled
                            style={{
                              padding: '8px 16px',
                              background: '#2196f3',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: 12,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            🚚 In Transit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Generated Key Modal */}
      {showKeyModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 40,
            borderRadius: 12,
            minWidth: 400,
            maxWidth: 500,
            textAlign: 'center'
          }}>
            <h2 style={{ marginTop: 0, color: '#4caf50' }}>✅ Pickup Key Generated!</h2>
            
            <div style={{ 
              margin: '24px 0',
              padding: 20,
              background: '#f5f5f5',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: 20,
              fontWeight: 'bold'
            }}>
              {generatedKey}
            </div>
            
            <p style={{ marginBottom: 16, color: '#666' }}>
              This key has been automatically sent to transporter:
            </p>
            
            {selectedOrder.marketToTraderTransport && (
              <div style={{ 
                marginBottom: 24, 
                padding: 12, 
                background: '#e3f2fd', 
                borderRadius: 6 
              }}>
                <strong>Transporter:</strong> {selectedOrder.marketToTraderTransport.transporterName}<br />
                <strong>Mobile:</strong> {selectedOrder.marketToTraderTransport.transporterMobile}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey);
                  alert('✅ Key copied to clipboard!');
                }}
                style={{
                  padding: '12px 24px',
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📋 Copy Key
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #ddd',
                  background: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Close
              </button>
            </div>
            
            <div style={{ 
              marginTop: 24, 
              padding: 12, 
              background: '#fff3cd', 
              borderRadius: 6,
              fontSize: 14,
              color: '#856404'
            }}>
              <strong>Note:</strong> The transporter will enter this key to start their journey.
            </div>
          </div>
        </div>
      )}

      {/* Admin Instructions */}
      <div style={{ 
        marginTop: 32, 
        padding: 20, 
        background: '#f0f7ff', 
        borderRadius: 8,
        border: '1px solid #bbdefb'
      }}>
        <h3 style={{ marginTop: 0, color: '#1976d2' }}>📋 Admin Workflow:</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              background: '#ff9800', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 14
            }}>1</div>
            <div>
              <div><strong>Order appears</strong> when transporter accepts it</div>
              <div style={{ fontSize: 14, color: '#666' }}>Status changes from "pending" to "accepted"</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              background: '#1976d2', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 14
            }}>2</div>
            <div>
              <div><strong>Generate pickup key</strong> for transporter</div>
              <div style={{ fontSize: 14, color: '#666' }}>Key automatically appears on transporter's screen</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              background: '#ff9800', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 14
            }}>3</div>
            <div>
              <div><strong>Transporter enters key</strong> and starts journey</div>
              <div style={{ fontSize: 14, color: '#666' }}>Status changes to "in_progress"</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              background: '#4caf50', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 14
            }}>4</div>
            <div>
              <div><strong>Trader generates delivery key</strong></div>
              <div style={{ fontSize: 14, color: '#666' }}>When goods are delivered and verified</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '50%', 
              background: '#4caf50', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 14
            }}>5</div>
            <div>
              <div><strong>Transporter enters delivery key</strong></div>
              <div style={{ fontSize: 14, color: '#666' }}>Journey marked as completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarkettoTrader;