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









// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE = 'https://kisan.etpl.ai';

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   traderMobile: string;
//   marketToTraderTransport?: {
//     status: string;
//     transporterId?: string;
//     transporterName?: string;
//     transporterMobile?: string;
//     adminGeneratedKey?: string;
//     adminNotes?: string;
//     journeyStartedAt?: string;
//     journeyCompletedAt?: string;
//     pickupKeyEnteredAt?: string;
//     deliveryKeyEnteredAt?: string;
//     deliveryKey?: string;
//   };
// }

// const AdminMarkettoTrader: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showKeyModal, setShowKeyModal] = useState(false);
//   const [generatedKey, setGeneratedKey] = useState('');
//   const [adminNotes, setAdminNotes] = useState('');
//   const [filter, setFilter] = useState<string>('all');

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/api/orders/market-to-trader/admin`;
//       if (filter !== 'all') {
//         url += `?status=${filter}`;
//       }
//       const res = await axios.get(url);
//       setOrders(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [filter]);

//   const generateAdminKey = () => {
//     const randomNum = Math.floor(100 + Math.random() * 900);
//     return `KISANTRANSPORTER${randomNum}`;
//   };

//   const assignTransporter = async (order: Order) => {
//     if (!order.marketToTraderTransport?.transporterId) {
//       alert('No transporter assigned to this order');
//       return;
//     }

//     const adminKey = generateAdminKey();
    
//     try {
//       const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/assign`, {
//         orderId: order.orderId,
//         transporterId: order.marketToTraderTransport.transporterId,
//         adminGeneratedKey: adminKey,
//         adminNotes
//       });
      
//       if (res.data.success) {
//         setGeneratedKey(adminKey);
//         setSelectedOrder(order);
//         setShowKeyModal(true);
//         setAdminNotes('');
//         fetchOrders();
        
//         console.log(`Notification sent to transporter: ${order.marketToTraderTransport.transporterName}`);
//         alert(`Pickup key generated and sent to transporter ${order.marketToTraderTransport.transporterName}`);
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error assigning transporter');
//     }
//   };

//   const expireKey = async (orderId: string) => {
//     if (!window.confirm('Expire this key? Transporter cannot use it anymore.')) return;
    
//     try {
//       const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/expire-key`, { orderId });
      
//       if (res.data.success) {
//         alert('Key expired successfully');
//         fetchOrders();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error expiring key');
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'pending': return '#ff9800';
//       case 'accepted': return '#1976d2';
//       case 'in_progress': return '#2196f3';
//       case 'completed': return '#4caf50';
//       default: return '#757575';
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading orders...</div>;

//   return (
//     <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
//       {/* Header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//         <h1 style={{ margin: 0, color: '#333' }}>Admin - Transport Management</h1>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{
//             padding: '8px 16px',
//             border: '1px solid #ddd',
//             borderRadius: 4,
//             background: 'white'
//           }}
//         >
//           <option value="all">All Orders</option>
//           <option value="pending">Pending</option>
//           <option value="accepted">Accepted</option>
//           <option value="in_progress">In Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       {/* Orders Count */}
//       <div style={{ 
//         marginBottom: 24, 
//         padding: 16, 
//         background: '#f5f5f5', 
//         borderRadius: 8,
//         display: 'grid',
//         gridTemplateColumns: 'repeat(4, 1fr)',
//         gap: 16
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'accepted').length}
//           </div>
//           <div style={{ fontSize: 14, color: '#666' }}>Accepted (Need Key)</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>
//             {orders.filter(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending').length}
//           </div>
//           <div style={{ fontSize: 14, color: '#666' }}>Pending</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
//           </div>
//           <div style={{ fontSize: 14, color: '#666' }}>In Transit</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
//           </div>
//           <div style={{ fontSize: 14, color: '#666' }}>Completed</div>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div style={{ 
//           padding: 40, 
//           textAlign: 'center', 
//           background: '#f5f5f5', 
//           borderRadius: 8,
//           color: '#666'
//         }}>
//           No transport orders found
//         </div>
//       ) : (
//         <div style={{ 
//           overflowX: 'auto',
//           border: '1px solid #e0e0e0',
//           borderRadius: 8,
//           background: '#fff'
//         }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: '#f5f5f5' }}>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Order ID</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Trader Info</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Transporter Info</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Status</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Key Details</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Timestamps</th>
//                 <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => {
//                 const transport = order.marketToTraderTransport;
//                 const isPending = !transport || transport.status === 'pending';
//                 const isAccepted = transport?.status === 'accepted';
//                 const isInProgress = transport?.status === 'in_progress';
//                 const isCompleted = transport?.status === 'completed';
//                 const hasKey = !!transport?.adminGeneratedKey;
//                 const keyUsed = !!transport?.pickupKeyEnteredAt;

//                 return (
//                   <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
//                     {/* Order ID */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       <div style={{ fontWeight: 'bold', color: '#333' }}>{order.orderId}</div>
//                     </td>
                    
//                     {/* Trader Info */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       <div><strong>{order.traderName}</strong></div>
//                       <div style={{ fontSize: 14, color: '#666' }}>{order.traderMobile}</div>
//                     </td>
                    
//                     {/* Transporter Info */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       {transport?.transporterName ? (
//                         <>
//                           <div><strong>{transport.transporterName}</strong></div>
//                           <div style={{ fontSize: 14, color: '#666' }}>{transport.transporterMobile}</div>
//                         </>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>No transporter assigned</div>
//                       )}
//                     </td>
                    
//                     {/* Status */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       <span style={{
//                         padding: '6px 12px',
//                         background: getStatusColor(transport?.status),
//                         color: 'white',
//                         borderRadius: 4,
//                         fontSize: 12,
//                         fontWeight: 'bold',
//                         display: 'inline-block'
//                       }}>
//                         {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                       </span>
                      
//                       {isAccepted && transport?.transporterName && (
//                         <div style={{ 
//                           marginTop: 8, 
//                           padding: 8, 
//                           background: '#e3f2fd', 
//                           borderRadius: 4,
//                           fontSize: 12 
//                         }}>
//                           ⚡ ACTION REQUIRED
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Key Details */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       {hasKey ? (
//                         <div>
//                           <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Pickup Key:</div>
//                           <div style={{ 
//                             fontFamily: 'monospace', 
//                             background: '#f5f5f5', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 12
//                           }}>
//                             {transport.adminGeneratedKey}
//                           </div>
//                           <div style={{ marginTop: 8, fontSize: 12 }}>
//                             <span style={{ 
//                               color: keyUsed ? '#4caf50' : '#ff9800',
//                               fontWeight: 'bold'
//                             }}>
//                               {keyUsed ? '✅ USED' : '⏳ PENDING'}
//                             </span>
//                           </div>
//                           {keyUsed && (
//                             <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
//                               Used: {formatDate(transport.pickupKeyEnteredAt)}
//                             </div>
//                           )}
//                         </div>
//                       ) : isAccepted ? (
//                         <div style={{ 
//                           padding: 8, 
//                           background: '#ffebee', 
//                           borderRadius: 4,
//                           color: '#d32f2f',
//                           fontSize: 12
//                         }}>
//                           ⚠️ Need to generate key
//                         </div>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>N/A</div>
//                       )}
                      
//                       {transport?.deliveryKey && (
//                         <div style={{ marginTop: 12 }}>
//                           <div style={{ fontWeight: 'bold', fontSize: 12 }}>Delivery Key:</div>
//                           <div style={{ 
//                             fontFamily: 'monospace', 
//                             background: '#e8f5e9', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 12
//                           }}>
//                             {transport.deliveryKey}
//                           </div>
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Timestamps */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       {transport?.journeyStartedAt && (
//                         <div style={{ marginBottom: 8 }}>
//                           <div style={{ fontSize: 12, color: '#666' }}>Started:</div>
//                           <div style={{ fontSize: 12 }}>{formatDate(transport.journeyStartedAt)}</div>
//                         </div>
//                       )}
//                       {transport?.journeyCompletedAt && (
//                         <div>
//                           <div style={{ fontSize: 12, color: '#666' }}>Completed:</div>
//                           <div style={{ fontSize: 12 }}>{formatDate(transport.journeyCompletedAt)}</div>
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Actions */}
//                     <td style={{ padding: '16px', verticalAlign: 'top' }}>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                         {isAccepted && !hasKey && (
//                           <>
//                             <button
//                               onClick={() => {
//                                 setSelectedOrder(order);
//                                 assignTransporter(order);
//                               }}
//                               style={{
//                                 padding: '8px 16px',
//                                 background: '#4caf50',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: 4,
//                                 cursor: 'pointer',
//                                 fontWeight: 'bold',
//                                 fontSize: 12,
//                                 whiteSpace: 'nowrap'
//                               }}
//                             >
//                               🔑 Generate Pickup Key
//                             </button>
                            
//                             <textarea
//                               value={adminNotes}
//                               onChange={(e) => setAdminNotes(e.target.value)}
//                               placeholder="Admin notes (optional)"
//                               rows={2}
//                               style={{
//                                 width: '100%',
//                                 padding: 8,
//                                 border: '1px solid #ddd',
//                                 borderRadius: 4,
//                                 resize: 'vertical',
//                                 fontSize: 12
//                               }}
//                             />
//                           </>
//                         )}

//                         {hasKey && !keyUsed && (
//                           <button
//                             onClick={() => expireKey(order.orderId)}
//                             style={{
//                               padding: '8px 16px',
//                               background: '#f44336',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               cursor: 'pointer',
//                               fontWeight: 'bold',
//                               fontSize: 12,
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             Expire Key
//                           </button>
//                         )}

//                         {isCompleted && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 16px',
//                               background: '#4caf50',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: 12,
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             ✅ Completed
//                           </button>
//                         )}

//                         {isPending && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 16px',
//                               background: '#9e9e9e',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: 12,
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             ⏳ Waiting
//                           </button>
//                         )}

//                         {isInProgress && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 16px',
//                               background: '#2196f3',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: 12,
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             🚚 In Transit
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Generated Key Modal */}
//       {showKeyModal && selectedOrder && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0,0,0,0.8)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             background: 'white',
//             padding: 40,
//             borderRadius: 12,
//             minWidth: 400,
//             maxWidth: 500,
//             textAlign: 'center'
//           }}>
//             <h2 style={{ marginTop: 0, color: '#4caf50' }}>✅ Pickup Key Generated!</h2>
            
//             <div style={{ 
//               margin: '24px 0',
//               padding: 20,
//               background: '#f5f5f5',
//               borderRadius: 8,
//               fontFamily: 'monospace',
//               fontSize: 20,
//               fontWeight: 'bold'
//             }}>
//               {generatedKey}
//             </div>
            
//             <p style={{ marginBottom: 16, color: '#666' }}>
//               This key has been automatically sent to transporter:
//             </p>
            
//             {selectedOrder.marketToTraderTransport && (
//               <div style={{ 
//                 marginBottom: 24, 
//                 padding: 12, 
//                 background: '#e3f2fd', 
//                 borderRadius: 6 
//               }}>
//                 <strong>Transporter:</strong> {selectedOrder.marketToTraderTransport.transporterName}<br />
//                 <strong>Mobile:</strong> {selectedOrder.marketToTraderTransport.transporterMobile}
//               </div>
//             )}
            
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
//               <button
//                 onClick={() => {
//                   navigator.clipboard.writeText(generatedKey);
//                   alert('✅ Key copied to clipboard!');
//                 }}
//                 style={{
//                   padding: '12px 24px',
//                   background: '#1976d2',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 6,
//                   cursor: 'pointer',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 📋 Copy Key
//               </button>
//               <button
//                 onClick={() => setShowKeyModal(false)}
//                 style={{
//                   padding: '12px 24px',
//                   border: '1px solid #ddd',
//                   background: 'none',
//                   borderRadius: 6,
//                   cursor: 'pointer',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 Close
//               </button>
//             </div>
            
//             <div style={{ 
//               marginTop: 24, 
//               padding: 12, 
//               background: '#fff3cd', 
//               borderRadius: 6,
//               fontSize: 14,
//               color: '#856404'
//             }}>
//               <strong>Note:</strong> The transporter will enter this key to start their journey.
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Admin Instructions */}
//       <div style={{ 
//         marginTop: 32, 
//         padding: 20, 
//         background: '#f0f7ff', 
//         borderRadius: 8,
//         border: '1px solid #bbdefb'
//       }}>
//         <h3 style={{ marginTop: 0, color: '#1976d2' }}>📋 Admin Workflow:</h3>
//         <div style={{ display: 'grid', gap: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14
//             }}>1</div>
//             <div>
//               <div><strong>Order appears</strong> when transporter accepts it</div>
//               <div style={{ fontSize: 14, color: '#666' }}>Status changes from "pending" to "accepted"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#1976d2', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14
//             }}>2</div>
//             <div>
//               <div><strong>Generate pickup key</strong> for transporter</div>
//               <div style={{ fontSize: 14, color: '#666' }}>Key automatically appears on transporter's screen</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14
//             }}>3</div>
//             <div>
//               <div><strong>Transporter enters key</strong> and starts journey</div>
//               <div style={{ fontSize: 14, color: '#666' }}>Status changes to "in_progress"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14
//             }}>4</div>
//             <div>
//               <div><strong>Trader generates delivery key</strong></div>
//               <div style={{ fontSize: 14, color: '#666' }}>When goods are delivered and verified</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14
//             }}>5</div>
//             <div>
//               <div><strong>Transporter enters delivery key</strong></div>
//               <div style={{ fontSize: 14, color: '#666' }}>Journey marked as completed</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMarkettoTrader;





//this is working 



//14/01/26







// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE = 'https://kisan.etpl.ai';

// interface ProductItem {
//   productId: string;
//   grade: string;
//   quantity: number;
//   nearestMarket: string;
// }

// interface MarketDetails {
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
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   traderMobile: string;
//   marketToTraderTransport?: {
//     status: string;
//     transporterId?: string;
//     transporterName?: string;
//     transporterMobile?: string;
//     adminGeneratedKey?: string;
//     adminNotes?: string;
//     journeyStartedAt?: string;
//     journeyCompletedAt?: string;
//     pickupKeyEnteredAt?: string;
//     deliveryKeyEnteredAt?: string;
//     deliveryKey?: string;
//   };
//   // New fields for the 3 things
//   productItems?: ProductItem[];
//   pickupMarket?: MarketDetails;
//   traderDetails?: {
//     location: TraderLocation;
//     // Keep original fields for backward compatibility
//     traderName: string;
//     traderMobile: string;
//   };
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
//   gradePrices?: Array<{
//     grade: string;
//     pricePerUnit: number;
//     totalQty: number;
//     quantityType: string;
//     priceType: string;
//     status: string;
//   }>;
//   cropPhotos?: string[];
//   status?: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image?: string;
// }

// const AdminMarkettoTrader: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showKeyModal, setShowKeyModal] = useState(false);
//   const [generatedKey, setGeneratedKey] = useState('');
//   const [adminNotes, setAdminNotes] = useState('');
//   const [filter, setFilter] = useState<string>('all');
  
//   // State for the 3 things
//   const [productNames, setProductNames] = useState<Record<string, string>>({});
//   const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

//   // Fetch all products for product names and subcategories
//   const fetchAllProducts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/product/all`);
//       if (res.data?.data) {
//         setAllProducts(res.data.data);
        
//         const names: Record<string, string> = {};
//         res.data.data.forEach((product: FullProductDetails) => {
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

//   const fetchSubCategories = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/subcategory/all`);
//       if (res.data?.data) {
//         setSubCategories(res.data.data);
//       }
//     } catch (err) {
//       console.error("SubCategories fetch error:", err);
//     }
//   };

//   // Helper function to get subcategory name
//   const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
//     if (!product.subCategoryId) return "N/A";
    
//     if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//       return (product.subCategoryId as { name: string }).name;
//     }
    
//     const subCatId = typeof product.subCategoryId === 'string' 
//       ? product.subCategoryId 
//       : (product.subCategoryId as { _id: string })._id;
    
//     const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
//     return subCat?.subCategoryName || "N/A";
//   };

//   // Helper function to get product details
//   const getProductDetails = (productId: string, grade: string) => {
//     const product = allProducts.find(p => p.productId === productId);
//     if (!product) return null;
    
//     const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
//     return {
//       ...product,
//       selectedGrade: gradeInfo
//     };
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch products and subcategories first
//       await fetchSubCategories();
//       await fetchAllProducts();
      
//       let url = `${API_BASE}/api/orders/market-to-trader/admin`;
//       if (filter !== 'all') {
//         url += `?status=${filter}`;
//       }
//       const res = await axios.get(url);
      
//       // Enrich orders with the 3 things
//       const enrichedOrders = await Promise.all(
//         (res.data.data || []).map(async (order: any) => {
//           try {
//             // Fetch order details to get productItems
//             const orderDetailsRes = await axios.get(`${API_BASE}/api/orders/${order.orderId}`);
//             const orderDetails = orderDetailsRes.data.data;
            
//             // Fetch pickup market details
//             let pickupMarket = null;
//             if (orderDetails?.productItems?.[0]?.nearestMarket) {
//               try {
//                 const marketRes = await axios.get(`${API_BASE}/api/market/${orderDetails.productItems[0].nearestMarket}`);
//                 pickupMarket = marketRes.data.data;
//               } catch (marketErr) {
//                 console.error("Market fetch error:", marketErr);
//               }
//             }
            
//             // Fetch trader details
//             let traderDetails = null;
//             if (order.traderId) {
//               try {
//                 const traderRes = await axios.get(`${API_BASE}/farmer/register/all`, {
//                   params: { traderId: order.traderId, role: "trader" }
//                 });
                
//                 if (traderRes.data.success && traderRes.data.data.length > 0) {
//                   const trader = traderRes.data.data[0];
//                   traderDetails = {
//                     traderName: trader.personalInfo?.name || order.traderName,
//                     traderMobile: trader.personalInfo?.mobileNo || order.traderMobile,
//                     location: {
//                       address: trader.personalInfo?.address || "",
//                       state: trader.personalInfo?.state || "",
//                       pincode: trader.personalInfo?.pincode || "",
//                       district: trader.personalInfo?.district || "",
//                       taluk: trader.personalInfo?.taluk || "",
//                       villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat || "",
//                     }
//                   };
//                 }
//               } catch (traderErr) {
//                 console.error("Trader fetch error:", traderErr);
//               }
//             }
            
//             return {
//               ...order,
//               productItems: orderDetails?.productItems || [],
//               pickupMarket,
//               traderDetails: traderDetails || {
//                 traderName: order.traderName,
//                 traderMobile: order.traderMobile,
//                 location: {
//                   address: '',
//                   district: '',
//                   state: '',
//                   pincode: '',
//                   taluk: '',
//                   villageGramaPanchayat: ''
//                 }
//               }
//             };
//           } catch (err) {
//             console.error("Error enriching order:", err);
//             return {
//               ...order,
//               productItems: [],
//               traderDetails: {
//                 traderName: order.traderName,
//                 traderMobile: order.traderMobile,
//                 location: {
//                   address: '',
//                   district: '',
//                   state: '',
//                   pincode: '',
//                   taluk: '',
//                   villageGramaPanchayat: ''
//                 }
//               }
//             };
//           }
//         })
//       );
      
//       setOrders(enrichedOrders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [filter]);

//   // View Order Details Function
//   const viewOrderDetails = (order: Order) => {
//     setSelectedOrderDetails(order);
//     setShowDetailsModal(true);
//   };

//   const generateAdminKey = () => {
//     const randomNum = Math.floor(100 + Math.random() * 900);
//     return `KISANTRANSPORTER${randomNum}`;
//   };

//   const assignTransporter = async (order: Order) => {
//     if (!order.marketToTraderTransport?.transporterId) {
//       alert('No transporter assigned to this order');
//       return;
//     }

//     const adminKey = generateAdminKey();
    
//     try {
//       const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/assign`, {
//         orderId: order.orderId,
//         transporterId: order.marketToTraderTransport.transporterId,
//         adminGeneratedKey: adminKey,
//         adminNotes
//       });
      
//       if (res.data.success) {
//         setGeneratedKey(adminKey);
//         setSelectedOrder(order);
//         setShowKeyModal(true);
//         setAdminNotes('');
//         fetchOrders();
        
//         console.log(`Notification sent to transporter: ${order.marketToTraderTransport.transporterName}`);
//         alert(`Pickup key generated and sent to transporter ${order.marketToTraderTransport.transporterName}`);
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error assigning transporter');
//     }
//   };

//   const expireKey = async (orderId: string) => {
//     if (!window.confirm('Expire this key? Transporter cannot use it anymore.')) return;
    
//     try {
//       const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/admin/expire-key`, { orderId });
      
//       if (res.data.success) {
//         alert('Key expired successfully');
//         fetchOrders();
//       }
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error expiring key');
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'pending': return '#ff9800';
//       case 'accepted': return '#1976d2';
//       case 'in_progress': return '#2196f3';
//       case 'completed': return '#4caf50';
//       default: return '#757575';
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   // Styles for responsive design
//   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
//   const responsiveTableStyle = {
//     overflowX: 'auto' as const,
//     border: '1px solid #e0e0e0',
//     borderRadius: 8,
//     background: '#fff',
//     marginTop: 16
//   };

//   const responsiveHeaderStyle = {
//     padding: isMobile ? '12px 8px' : '16px',
//     textAlign: 'left' as const,
//     borderBottom: '1px solid #e0e0e0',
//     fontWeight: 'bold' as const,
//     color: '#333',
//     fontSize: isMobile ? '12px' : '14px'
//   };

//   const responsiveCellStyle = {
//     padding: isMobile ? '12px 8px' : '16px',
//     verticalAlign: 'top' as const,
//     fontSize: isMobile ? '12px' : '14px'
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading orders...</div>;

//   return (
//     <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1400, margin: '0 auto' }}>
//       {/* Header */}
//       <div style={{ 
//         display: 'flex', 
//         flexDirection: isMobile ? 'column' : 'row',
//         justifyContent: 'space-between', 
//         alignItems: isMobile ? 'flex-start' : 'center', 
//         marginBottom: 24,
//         gap: isMobile ? 16 : 0
//       }}>
//         <h1 style={{ 
//           margin: 0, 
//           color: '#333',
//           fontSize: isMobile ? '20px' : '24px'
//         }}>
//           Admin - Transport Management
//         </h1>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{
//             padding: '8px 16px',
//             border: '1px solid #ddd',
//             borderRadius: 4,
//             background: 'white',
//             width: isMobile ? '100%' : 'auto',
//             fontSize: isMobile ? '14px' : '16px'
//           }}
//         >
//           <option value="all">All Orders</option>
//           <option value="pending">Pending</option>
//           <option value="accepted">Accepted</option>
//           <option value="in_progress">In Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       {/* Orders Count */}
//       <div style={{ 
//         marginBottom: 24, 
//         padding: isMobile ? 12 : 16, 
//         background: '#f5f5f5', 
//         borderRadius: 8,
//         display: 'grid',
//         gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
//         gap: isMobile ? 8 : 16
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#1976d2' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'accepted').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Accepted (Need Key)</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#ff9800' }}>
//             {orders.filter(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Pending</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#2196f3' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>In Transit</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#4caf50' }}>
//             {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Completed</div>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div style={{ 
//           padding: 40, 
//           textAlign: 'center', 
//           background: '#f5f5f5', 
//           borderRadius: 8,
//           color: '#666'
//         }}>
//           No transport orders found
//         </div>
//       ) : (
//         <div style={responsiveTableStyle}>
//           <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 800 : 'auto' }}>
//             <thead>
//               <tr style={{ background: '#f5f5f5' }}>
//                 <th style={responsiveHeaderStyle}>Order ID</th>
//                 <th style={responsiveHeaderStyle}>Pickup Location</th>
//                 <th style={responsiveHeaderStyle}>Delivery Location</th>
//                 <th style={responsiveHeaderStyle}>Items Count</th>
//                 <th style={responsiveHeaderStyle}>Transporter Info</th>
//                 <th style={responsiveHeaderStyle}>Status</th>
//                 <th style={responsiveHeaderStyle}>Key Details</th>
//                 <th style={responsiveHeaderStyle}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => {
//                 const transport = order.marketToTraderTransport;
//                 const isPending = !transport || transport.status === 'pending';
//                 const isAccepted = transport?.status === 'accepted';
//                 const isInProgress = transport?.status === 'in_progress';
//                 const isCompleted = transport?.status === 'completed';
//                 const hasKey = !!transport?.adminGeneratedKey;
//                 const keyUsed = !!transport?.pickupKeyEnteredAt;
//                 const itemsCount = order.productItems?.length || 0;

//                 return (
//                   <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
//                     {/* Order ID */}
//                     <td style={responsiveCellStyle}>
//                       <div style={{ fontWeight: 'bold', color: '#333' }}>{order.orderId}</div>
//                       <button
//                         onClick={() => viewOrderDetails(order)}
//                         style={{
//                           marginTop: 8,
//                           padding: '4px 8px',
//                           background: '#3b82f6',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: 4,
//                           cursor: 'pointer',
//                           fontSize: isMobile ? '11px' : '12px'
//                         }}
//                       >
//                         View Details
//                       </button>
//                     </td>
                    
//                     {/* Pickup Location */}
//                     <td style={responsiveCellStyle}>
//                       {order.pickupMarket ? (
//                         <div>
//                           <div><strong>{order.pickupMarket.marketName}</strong></div>
//                           <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#666', marginTop: 4 }}>
//                             {order.pickupMarket.district && `${order.pickupMarket.district}, `}
//                             {order.pickupMarket.state || 'N/A'}
//                           </div>
//                         </div>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>Not specified</div>
//                       )}
//                     </td>
                    
//                     {/* Delivery Location */}
//                     <td style={responsiveCellStyle}>
//                       <div>
//                         <div><strong>{order.traderDetails?.traderName || order.traderName}</strong></div>
//                         <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#666', marginTop: 4 }}>
//                           {order.traderDetails?.location?.district && `${order.traderDetails.location.district}, `}
//                           {order.traderDetails?.location?.state || 'N/A'}
//                         </div>
//                       </div>
//                     </td>
                    
//                     {/* Items Count */}
//                     <td style={responsiveCellStyle}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ 
//                           fontSize: isMobile ? 18 : 20, 
//                           fontWeight: 'bold', 
//                           color: '#1e40af' 
//                         }}>
//                           {itemsCount}
//                         </div>
//                         <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#666' }}>
//                           {itemsCount === 1 ? 'item' : 'items'}
//                         </div>
//                       </div>
//                     </td>
                    
//                     {/* Transporter Info */}
//                     <td style={responsiveCellStyle}>
//                       {transport?.transporterName ? (
//                         <>
//                           <div><strong>{transport.transporterName}</strong></div>
//                           <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#666' }}>
//                             {transport.transporterMobile}
//                           </div>
//                         </>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>No transporter assigned</div>
//                       )}
//                     </td>
                    
//                     {/* Status */}
//                     <td style={responsiveCellStyle}>
//                       <span style={{
//                         padding: '6px 12px',
//                         background: getStatusColor(transport?.status),
//                         color: 'white',
//                         borderRadius: 4,
//                         fontSize: isMobile ? '11px' : '12px',
//                         fontWeight: 'bold',
//                         display: 'inline-block'
//                       }}>
//                         {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                       </span>
                      
//                       {isAccepted && transport?.transporterName && (
//                         <div style={{ 
//                           marginTop: 8, 
//                           padding: 8, 
//                           background: '#e3f2fd', 
//                           borderRadius: 4,
//                           fontSize: isMobile ? '10px' : '12px' 
//                         }}>
//                           ⚡ ACTION REQUIRED
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Key Details */}
//                     <td style={responsiveCellStyle}>
//                       {hasKey ? (
//                         <div>
//                           <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: isMobile ? '11px' : '12px' }}>
//                             Pickup Key:
//                           </div>
//                           <div style={{ 
//                             fontFamily: 'monospace', 
//                             background: '#f5f5f5', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '10px' : '12px',
//                             wordBreak: 'break-all'
//                           }}>
//                             {transport.adminGeneratedKey}
//                           </div>
//                           <div style={{ marginTop: 8, fontSize: isMobile ? '10px' : '12px' }}>
//                             <span style={{ 
//                               color: keyUsed ? '#4caf50' : '#ff9800',
//                               fontWeight: 'bold'
//                             }}>
//                               {keyUsed ? '✅ USED' : '⏳ PENDING'}
//                             </span>
//                           </div>
//                           {keyUsed && (
//                             <div style={{ marginTop: 4, fontSize: isMobile ? '10px' : '12px', color: '#666' }}>
//                               Used: {formatDate(transport.pickupKeyEnteredAt)}
//                             </div>
//                           )}
//                         </div>
//                       ) : isAccepted ? (
//                         <div style={{ 
//                           padding: 8, 
//                           background: '#ffebee', 
//                           borderRadius: 4,
//                           color: '#d32f2f',
//                           fontSize: isMobile ? '10px' : '12px'
//                         }}>
//                           ⚠️ Need key
//                         </div>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic', fontSize: isMobile ? '10px' : '12px' }}>
//                           N/A
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Actions */}
//                     <td style={responsiveCellStyle}>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                         {isAccepted && !hasKey && (
//                           <>
//                             <button
//                               onClick={() => assignTransporter(order)}
//                               style={{
//                                 padding: '8px 12px',
//                                 background: '#4caf50',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: 4,
//                                 cursor: 'pointer',
//                                 fontWeight: 'bold',
//                                 fontSize: isMobile ? '10px' : '12px',
//                                 whiteSpace: 'nowrap'
//                               }}
//                             >
//                               🔑 Generate Key
//                             </button>
                            
//                             <textarea
//                               value={adminNotes}
//                               onChange={(e) => setAdminNotes(e.target.value)}
//                               placeholder="Admin notes"
//                               rows={2}
//                               style={{
//                                 width: '100%',
//                                 padding: 8,
//                                 border: '1px solid #ddd',
//                                 borderRadius: 4,
//                                 resize: 'vertical',
//                                 fontSize: isMobile ? '10px' : '12px'
//                               }}
//                             />
//                           </>
//                         )}

//                         {hasKey && !keyUsed && (
//                           <button
//                             onClick={() => expireKey(order.orderId)}
//                             style={{
//                               padding: '8px 12px',
//                               background: '#f44336',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               cursor: 'pointer',
//                               fontWeight: 'bold',
//                               fontSize: isMobile ? '10px' : '12px',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             Expire Key
//                           </button>
//                         )}

//                         {isCompleted && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 12px',
//                               background: '#4caf50',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: isMobile ? '10px' : '12px',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             ✅ Completed
//                           </button>
//                         )}

//                         {isPending && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 12px',
//                               background: '#9e9e9e',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: isMobile ? '10px' : '12px',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             ⏳ Waiting
//                           </button>
//                         )}

//                         {isInProgress && (
//                           <button
//                             disabled
//                             style={{
//                               padding: '8px 12px',
//                               background: '#2196f3',
//                               color: 'white',
//                               border: 'none',
//                               borderRadius: 4,
//                               fontWeight: 'bold',
//                               fontSize: isMobile ? '10px' : '12px',
//                               whiteSpace: 'nowrap'
//                             }}
//                           >
//                             🚚 In Transit
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Details Modal */}
//       {showDetailsModal && selectedOrderDetails && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0,0,0,0.8)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000,
//           padding: isMobile ? 16 : 24
//         }}>
//           <div style={{
//             background: 'white',
//             padding: isMobile ? 20 : 40,
//             borderRadius: 12,
//             width: isMobile ? '100%' : '90%',
//             maxWidth: 900,
//             maxHeight: '90vh',
//             overflowY: 'auto'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//               <h2 style={{ margin: 0, color: '#333' }}>Order Details: {selectedOrderDetails.orderId}</h2>
//               <button
//                 onClick={() => setShowDetailsModal(false)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   color: '#666'
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* 1. Pickup & Delivery Locations */}
//             <div style={{ marginBottom: 32 }}>
//               <h3 style={{ color: '#374151', marginBottom: 16 }}>📍 Locations</h3>
              
//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
//                 gap: 20,
//                 marginBottom: 24 
//               }}>
//                 {/* Pickup Location */}
//                 <div style={{ 
//                   background: '#f9fafb', 
//                   padding: 20, 
//                   borderRadius: 8,
//                   border: '1px solid #e5e7eb'
//                 }}>
//                   <h4 style={{ color: '#1e40af', marginTop: 0, marginBottom: 12 }}>Pickup From</h4>
//                   {selectedOrderDetails.pickupMarket ? (
//                     <>
//                       <div style={{ marginBottom: 8 }}>
//                         <strong style={{ display: 'block', fontSize: isMobile ? '14px' : '16px' }}>
//                           {selectedOrderDetails.pickupMarket.marketName}
//                         </strong>
//                         <span style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>
//                           {selectedOrderDetails.pickupMarket.exactAddress}
//                         </span>
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
//                         {selectedOrderDetails.pickupMarket.district && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.pickupMarket.district}
//                           </span>
//                         )}
//                         {selectedOrderDetails.pickupMarket.state && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.pickupMarket.state}
//                           </span>
//                         )}
//                         {selectedOrderDetails.pickupMarket.pincode && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.pickupMarket.pincode}
//                           </span>
//                         )}
//                       </div>
//                       {selectedOrderDetails.pickupMarket.landmark && (
//                         <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>
//                           <strong>Landmark:</strong> {selectedOrderDetails.pickupMarket.landmark}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div style={{ color: '#999', fontStyle: 'italic' }}>Pickup location not specified</div>
//                   )}
//                 </div>

//                 {/* Delivery Location */}
//                 <div style={{ 
//                   background: '#f0f9ff', 
//                   padding: 20, 
//                   borderRadius: 8,
//                   border: '1px solid #bae6fd'
//                 }}>
//                   <h4 style={{ color: '#0369a1', marginTop: 0, marginBottom: 12 }}>Deliver To</h4>
//                   {selectedOrderDetails.traderDetails ? (
//                     <>
//                       <div style={{ marginBottom: 8 }}>
//                         <strong style={{ display: 'block', fontSize: isMobile ? '14px' : '16px' }}>
//                           {selectedOrderDetails.traderDetails.traderName}
//                         </strong>
//                         <span style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>
//                           📱 {selectedOrderDetails.traderDetails.traderMobile}
//                         </span>
//                       </div>
//                       <div style={{ marginBottom: 8 }}>
//                         <span style={{ color: '#374151', fontSize: isMobile ? '12px' : '14px' }}>
//                           {selectedOrderDetails.traderDetails.location.address}
//                         </span>
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
//                         {selectedOrderDetails.traderDetails.location.taluk && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.traderDetails.location.taluk}
//                           </span>
//                         )}
//                         {selectedOrderDetails.traderDetails.location.district && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.traderDetails.location.district}
//                           </span>
//                         )}
//                         {selectedOrderDetails.traderDetails.location.state && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: isMobile ? '11px' : '12px'
//                           }}>
//                             {selectedOrderDetails.traderDetails.location.state}
//                           </span>
//                         )}
//                       </div>
//                       <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>
//                         <strong>Pincode:</strong> {selectedOrderDetails.traderDetails.location.pincode || 'N/A'}
//                         {selectedOrderDetails.traderDetails.location.villageGramaPanchayat && (
//                           <div style={{ marginTop: 4 }}>
//                             <strong>Panchayat:</strong> {selectedOrderDetails.traderDetails.location.villageGramaPanchayat}
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   ) : (
//                     <div style={{ color: '#999', fontStyle: 'italic' }}>Trader details not available</div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 2. Trader Details */}
//             <div style={{ marginBottom: 32 }}>
//               <h3 style={{ color: '#374151', marginBottom: 16 }}>👨‍🌾 Trader Information</h3>
//               <div style={{ 
//                 background: '#fefce8', 
//                 padding: 20, 
//                 borderRadius: 8,
//                 border: '1px solid #fde047'
//               }}>
//                 {selectedOrderDetails.traderDetails ? (
//                   <div style={{ 
//                     display: 'grid', 
//                     gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
//                     gap: 16 
//                   }}>
//                     <div>
//                       <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>Name</div>
//                       <div style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>
//                         {selectedOrderDetails.traderDetails.traderName}
//                       </div>
//                     </div>
//                     <div>
//                       <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>Mobile</div>
//                       <div style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>
//                         {selectedOrderDetails.traderDetails.traderMobile}
//                       </div>
//                     </div>
//                     <div>
//                       <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>Trader ID</div>
//                       <div style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>
//                         {selectedOrderDetails.traderId}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ color: '#999', fontStyle: 'italic' }}>Trader details not available</div>
//                 )}
//               </div>
//             </div>

//             {/* 3. Product Items */}
//             <div style={{ marginBottom: 32 }}>
//               <h3 style={{ color: '#374151', marginBottom: 16 }}>
//                 📦 Product Items ({selectedOrderDetails.productItems?.length || 0})
//               </h3>
              
//               {selectedOrderDetails.productItems && selectedOrderDetails.productItems.length > 0 ? (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                   {selectedOrderDetails.productItems.map((item, idx) => {
//                     const productDetails = getProductDetails(item.productId, item.grade);
                    
//                     return (
//                       <div key={idx} style={{ 
//                         background: '#ffffff', 
//                         padding: isMobile ? 16 : 20, 
//                         borderRadius: 8,
//                         border: '2px solid #e5e7eb',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//                       }}>
//                         {/* Product Header */}
//                         <div style={{ 
//                           display: 'flex', 
//                           flexDirection: isMobile ? 'column' : 'row',
//                           justifyContent: 'space-between', 
//                           alignItems: isMobile ? 'flex-start' : 'center',
//                           marginBottom: 16,
//                           gap: isMobile ? 8 : 0
//                         }}>
//                           <div>
//                             <h4 style={{ 
//                               margin: 0, 
//                               color: '#1f2937', 
//                               fontSize: isMobile ? '14px' : '16px' 
//                             }}>
//                               {productNames[item.productId] || "Product"}
//                             </h4>
//                             <small style={{ color: '#6b7280', fontSize: isMobile ? '11px' : '12px' }}>
//                               Product ID: {item.productId}
//                             </small>
//                           </div>
//                           <div style={{ 
//                             display: 'flex', 
//                             flexDirection: isMobile ? 'column' : 'row',
//                             gap: 8,
//                             alignItems: isMobile ? 'flex-start' : 'center'
//                           }}>
//                             <span style={{ 
//                               background: '#dbeafe', 
//                               padding: '4px 12px', 
//                               borderRadius: 4, 
//                               fontSize: isMobile ? '11px' : '13px',
//                               fontWeight: 600,
//                               color: '#1e40af'
//                             }}>
//                               Grade: {item.grade}
//                             </span>
//                             <span style={{ 
//                               background: '#dcfce7', 
//                               padding: '4px 12px', 
//                               borderRadius: 4, 
//                               fontSize: isMobile ? '11px' : '13px',
//                               fontWeight: 600,
//                               color: '#166534'
//                             }}>
//                               Qty: {item.quantity}
//                             </span>
//                           </div>
//                         </div>

//                         {productDetails ? (
//                           <div>
//                             {/* Category Info */}
//                             <div style={{ 
//                               display: 'grid', 
//                               gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
//                               gap: 12, 
//                               marginBottom: 16 
//                             }}>
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500,
//                                   textTransform: 'uppercase' 
//                                 }}>
//                                   Product Category
//                                 </small>
//                                 <div style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>
//                                   {getSubCategoryNameForProduct(productDetails)}
//                                 </div>
//                               </div>
//                               {productDetails.categoryId?.name && (
//                                 <div>
//                                   <small style={{ 
//                                     color: '#6b7280', 
//                                     fontSize: isMobile ? '11px' : '12px',
//                                     fontWeight: 500,
//                                     textTransform: 'uppercase' 
//                                   }}>
//                                     Main Category
//                                   </small>
//                                   <div style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>
//                                     {productDetails.categoryId.name}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             {/* Product Description */}
//                             {productDetails.cropBriefDetails && (
//                               <div style={{ marginBottom: 16 }}>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500,
//                                   textTransform: 'uppercase' 
//                                 }}>
//                                   Description
//                                 </small>
//                                 <p style={{ 
//                                   margin: '4px 0 0 0', 
//                                   color: '#374151',
//                                   fontSize: isMobile ? '12px' : '14px' 
//                                 }}>
//                                   {productDetails.cropBriefDetails}
//                                 </p>
//                               </div>
//                             )}

//                             {/* Product Details Grid */}
//                             <div style={{ 
//                               display: 'grid', 
//                               gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))', 
//                               gap: 12, 
//                               marginBottom: 16 
//                             }}>
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500 
//                                 }}>
//                                   Farming Type
//                                 </small>
//                                 <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                   {productDetails.farmingType || "N/A"}
//                                 </div>
//                               </div>
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500 
//                                 }}>
//                                   Seeds Type
//                                 </small>
//                                 <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                   {productDetails.typeOfSeeds || "N/A"}
//                                 </div>
//                               </div>
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500 
//                                 }}>
//                                   Packaging
//                                 </small>
//                                 <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                   {productDetails.packagingType || "N/A"}
//                                 </div>
//                               </div>
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500 
//                                 }}>
//                                   Unit
//                                 </small>
//                                 <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                   {productDetails.unitMeasurement || "N/A"}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Grade & Price Info */}
//                             {productDetails.selectedGrade && (
//                               <div style={{ 
//                                 background: '#f0f9ff', 
//                                 padding: 16, 
//                                 borderRadius: 6,
//                                 marginBottom: 16
//                               }}>
//                                 <h5 style={{ marginTop: 0, marginBottom: 12, color: '#0369a1' }}>Pricing Details</h5>
//                                 <div style={{ 
//                                   display: 'grid', 
//                                   gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))', 
//                                   gap: 12 
//                                 }}>
//                                   <div>
//                                     <small style={{ 
//                                       color: '#6b7280', 
//                                       fontSize: isMobile ? '11px' : '12px',
//                                       fontWeight: 500 
//                                     }}>
//                                       Price per Unit
//                                     </small>
//                                     <div style={{ 
//                                       fontWeight: 'bold', 
//                                       fontSize: isMobile ? '14px' : '18px',
//                                       color: '#0369a1'
//                                     }}>
//                                       ₹{productDetails.selectedGrade.pricePerUnit}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <small style={{ 
//                                       color: '#6b7280', 
//                                       fontSize: isMobile ? '11px' : '12px',
//                                       fontWeight: 500 
//                                     }}>
//                                       Available Qty
//                                     </small>
//                                     <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                       {productDetails.selectedGrade.totalQty}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <small style={{ 
//                                       color: '#6b7280', 
//                                       fontSize: isMobile ? '11px' : '12px',
//                                       fontWeight: 500 
//                                     }}>
//                                       Quantity Type
//                                     </small>
//                                     <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
//                                       {productDetails.selectedGrade.quantityType || "N/A"}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Crop Photos */}
//                             {productDetails.cropPhotos && productDetails.cropPhotos.length > 0 && (
//                               <div>
//                                 <small style={{ 
//                                   color: '#6b7280', 
//                                   fontSize: isMobile ? '11px' : '12px',
//                                   fontWeight: 500,
//                                   textTransform: 'uppercase' 
//                                 }}>
//                                   Product Images
//                                 </small>
//                                 <div style={{ 
//                                   display: 'flex', 
//                                   gap: 8, 
//                                   marginTop: 8, 
//                                   flexWrap: 'wrap',
//                                   justifyContent: isMobile ? 'center' : 'flex-start'
//                                 }}>
//                                   {productDetails.cropPhotos.slice(0, 4).map((photo, photoIdx) => (
//                                     <img 
//                                       key={photoIdx}
//                                       src={photo} 
//                                       alt={`Product ${photoIdx + 1}`}
//                                       style={{
//                                         width: isMobile ? 60 : 80,
//                                         height: isMobile ? 60 : 80,
//                                         objectFit: 'cover',
//                                         borderRadius: 6,
//                                         border: '1px solid #e5e7eb'
//                                       }}
//                                       onError={(e) => {
//                                         (e.target as HTMLImageElement).style.display = 'none';
//                                       }}
//                                     />
//                                   ))}
//                                   {productDetails.cropPhotos.length > 4 && (
//                                     <div style={{
//                                       width: isMobile ? 60 : 80,
//                                       height: isMobile ? 60 : 80,
//                                       display: "flex",
//                                       alignItems: "center",
//                                       justifyContent: "center",
//                                       background: "#f3f4f6",
//                                       borderRadius: 6,
//                                       fontSize: isMobile ? '10px' : '12px',
//                                       fontWeight: 600,
//                                       color: "#6b7280"
//                                     }}>
//                                       +{productDetails.cropPhotos.length - 4} more
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <div style={{ 
//                             padding: isMobile ? 12 : 20, 
//                             textAlign: 'center', 
//                             color: '#999',
//                             background: '#f9fafb',
//                             borderRadius: 6
//                           }}>
//                             <p style={{ margin: 0 }}>Product details not available</p>
//                             <small>Quantity: {item.quantity} units • Grade: {item.grade}</small>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div style={{ 
//                   padding: 20, 
//                   textAlign: 'center', 
//                   background: '#f5f5f5', 
//                   borderRadius: 8,
//                   color: '#666'
//                 }}>
//                   No product items found for this order
//                 </div>
//               )}
//             </div>

//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'flex-end',
//               marginTop: 24,
//               paddingTop: 16,
//               borderTop: '1px solid #e5e7eb'
//             }}>
//               <button
//                 onClick={() => setShowDetailsModal(false)}
//                 style={{
//                   padding: '10px 24px',
//                   background: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 6,
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   fontSize: isMobile ? '14px' : '16px'
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Generated Key Modal (Your existing modal - UNCHANGED) */}
//       {showKeyModal && selectedOrder && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0,0,0,0.8)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1001
//         }}>
//           <div style={{
//             background: 'white',
//             padding: isMobile ? 24 : 40,
//             borderRadius: 12,
//             minWidth: isMobile ? '90%' : 400,
//             maxWidth: 500,
//             textAlign: 'center'
//           }}>
//             <h2 style={{ marginTop: 0, color: '#4caf50', fontSize: isMobile ? '20px' : '24px' }}>✅ Pickup Key Generated!</h2>
            
//             <div style={{ 
//               margin: '24px 0',
//               padding: isMobile ? 16 : 20,
//               background: '#f5f5f5',
//               borderRadius: 8,
//               fontFamily: 'monospace',
//               fontSize: isMobile ? 16 : 20,
//               fontWeight: 'bold',
//               wordBreak: 'break-all'
//             }}>
//               {generatedKey}
//             </div>
            
//             <p style={{ marginBottom: 16, color: '#666', fontSize: isMobile ? '14px' : '16px' }}>
//               This key has been automatically sent to transporter:
//             </p>
            
//             {selectedOrder.marketToTraderTransport && (
//               <div style={{ 
//                 marginBottom: 24, 
//                 padding: isMobile ? 12 : 16, 
//                 background: '#e3f2fd', 
//                 borderRadius: 6,
//                 fontSize: isMobile ? '13px' : '14px'
//               }}>
//                 <strong>Transporter:</strong> {selectedOrder.marketToTraderTransport.transporterName}<br />
//                 <strong>Mobile:</strong> {selectedOrder.marketToTraderTransport.transporterMobile}
//               </div>
//             )}
            
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
//               <button
//                 onClick={() => {
//                   navigator.clipboard.writeText(generatedKey);
//                   alert('✅ Key copied to clipboard!');
//                 }}
//                 style={{
//                   padding: '12px 24px',
//                   background: '#1976d2',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 6,
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   fontSize: isMobile ? '14px' : '16px'
//                 }}
//               >
//                 📋 Copy Key
//               </button>
//               <button
//                 onClick={() => setShowKeyModal(false)}
//                 style={{
//                   padding: '12px 24px',
//                   border: '1px solid #ddd',
//                   background: 'none',
//                   borderRadius: 6,
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   fontSize: isMobile ? '14px' : '16px'
//                 }}
//               >
//                 Close
//               </button>
//             </div>
            
//             <div style={{ 
//               marginTop: 24, 
//               padding: isMobile ? 12 : 16, 
//               background: '#fff3cd', 
//               borderRadius: 6,
//               fontSize: isMobile ? '13px' : '14px',
//               color: '#856404'
//             }}>
//               <strong>Note:</strong> The transporter will enter this key to start their journey.
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Admin Instructions (Your existing section - UNCHANGED) */}
//       <div style={{ 
//         marginTop: 32, 
//         padding: isMobile ? 16 : 20, 
//         background: '#f0f7ff', 
//         borderRadius: 8,
//         border: '1px solid #bbdefb'
//       }}>
//         <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: isMobile ? '18px' : '20px' }}>📋 Admin Workflow:</h3>
//         <div style={{ display: 'grid', gap: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14,
//               flexShrink: 0
//             }}>1</div>
//             <div>
//               <div style={{ fontSize: isMobile ? '14px' : '16px' }}><strong>Order appears</strong> when transporter accepts it</div>
//               <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Status changes from "pending" to "accepted"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#1976d2', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14,
//               flexShrink: 0
//             }}>2</div>
//             <div>
//               <div style={{ fontSize: isMobile ? '14px' : '16px' }}><strong>Generate pickup key</strong> for transporter</div>
//               <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Key automatically appears on transporter's screen</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14,
//               flexShrink: 0
//             }}>3</div>
//             <div>
//               <div style={{ fontSize: isMobile ? '14px' : '16px' }}><strong>Transporter enters key</strong> and starts journey</div>
//               <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Status changes to "in_progress"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14,
//               flexShrink: 0
//             }}>4</div>
//             <div>
//               <div style={{ fontSize: isMobile ? '14px' : '16px' }}><strong>Trader generates delivery key</strong></div>
//               <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>When goods are delivered and verified</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 28, 
//               height: 28, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 14,
//               flexShrink: 0
//             }}>5</div>
//             <div>
//               <div style={{ fontSize: isMobile ? '14px' : '16px' }}><strong>Transporter enters delivery key</strong></div>
//               <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>Journey marked as completed</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMarkettoTrader;





//UPDATED BY SAGAR
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://kisan.etpl.ai';

interface ProductItem {
  productId: string;
  grade: string;
  quantity: number;
  nearestMarket: string;
}

interface MarketDetails {
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
}

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
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
  productItems?: ProductItem[];
  pickupMarket?: MarketDetails;
  traderDetails?: {
    location: TraderLocation;
    traderName: string;
    traderMobile: string;
  };
}

interface FullProductDetails {
  productId: string;
  categoryId?: {
    _id: string;
    name: string;
  };
  subCategoryId?: string | {
    _id: string;
    name: string;
  };
  cropBriefDetails?: string;
  farmingType?: string;
  typeOfSeeds?: string;
  packagingType?: string;
  packageMeasurement?: string;
  unitMeasurement?: string;
  gradePrices?: Array<{
    grade: string;
    pricePerUnit: number;
    totalQty: number;
    quantityType: string;
    priceType: string;
    status: string;
  }>;
  cropPhotos?: string[];
  status?: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image?: string;
}

const AdminMarkettoTrader: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/product/all`);
      if (res.data?.data) {
        setAllProducts(res.data.data);
        
        const names: Record<string, string> = {};
        res.data.data.forEach((product: FullProductDetails) => {
          let productName = "Product";
          if (product.subCategoryId) {
            if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
              productName = product.subCategoryId.name;
            }
          } else if (product.categoryId?.name) {
            productName = product.categoryId.name;
          }
          names[product.productId] = productName;
        });
        setProductNames(names);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/subcategory/all`);
      if (res.data?.data) {
        setSubCategories(res.data.data);
      }
    } catch (err) {
      console.error("SubCategories fetch error:", err);
    }
  };

  const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
    if (!product.subCategoryId) return "N/A";
    
    if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
      return (product.subCategoryId as { name: string }).name;
    }
    
    const subCatId = typeof product.subCategoryId === 'string' 
      ? product.subCategoryId 
      : (product.subCategoryId as { _id: string })._id;
    
    const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
    return subCat?.subCategoryName || "N/A";
  };

  const getProductDetails = (productId: string, grade: string) => {
    const product = allProducts.find(p => p.productId === productId);
    if (!product) return null;
    
    const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
    return {
      ...product,
      selectedGrade: gradeInfo
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      await fetchSubCategories();
      await fetchAllProducts();
      
      let url = `${API_BASE}/api/orders/market-to-trader/admin`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const res = await axios.get(url);
      
      const enrichedOrders = await Promise.all(
        (res.data.data || []).map(async (order: any) => {
          try {
            const orderDetailsRes = await axios.get(`${API_BASE}/api/orders/${order.orderId}`);
            const orderDetails = orderDetailsRes.data.data;
            
            let pickupMarket = null;
            if (orderDetails?.productItems?.[0]?.nearestMarket) {
              try {
                const marketRes = await axios.get(`${API_BASE}/api/market/${orderDetails.productItems[0].nearestMarket}`);
                pickupMarket = marketRes.data.data;
              } catch (marketErr) {
                console.error("Market fetch error:", marketErr);
              }
            }
            
            let traderDetails = null;
            if (order.traderId) {
              try {
                const traderRes = await axios.get(`${API_BASE}/farmer/register/all`, {
                  params: { traderId: order.traderId, role: "trader" }
                });
                
                if (traderRes.data.success && traderRes.data.data.length > 0) {
                  const trader = traderRes.data.data[0];
                  traderDetails = {
                    traderName: trader.personalInfo?.name || order.traderName,
                    traderMobile: trader.personalInfo?.mobileNo || order.traderMobile,
                    location: {
                      address: trader.personalInfo?.address || "",
                      state: trader.personalInfo?.state || "",
                      pincode: trader.personalInfo?.pincode || "",
                      district: trader.personalInfo?.district || "",
                      taluk: trader.personalInfo?.taluk || "",
                      villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat || "",
                    }
                  };
                }
              } catch (traderErr) {
                console.error("Trader fetch error:", traderErr);
              }
            }
            
            return {
              ...order,
              productItems: orderDetails?.productItems || [],
              pickupMarket,
              traderDetails: traderDetails || {
                traderName: order.traderName,
                traderMobile: order.traderMobile,
                location: {
                  address: '',
                  district: '',
                  state: '',
                  pincode: '',
                  taluk: '',
                  villageGramaPanchayat: ''
                }
              }
            };
          } catch (err) {
            console.error("Error enriching order:", err);
            return {
              ...order,
              productItems: [],
              traderDetails: {
                traderName: order.traderName,
                traderMobile: order.traderMobile,
                location: {
                  address: '',
                  district: '',
                  state: '',
                  pincode: '',
                  taluk: '',
                  villageGramaPanchayat: ''
                }
              }
            };
          }
        })
      );
      
      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const viewOrderDetails = (order: Order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

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
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: 24,
        gap: isMobile ? 16 : 0
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: isMobile ? '20px' : '24px'
        }}>
          Admin - Transport Management
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: 'white',
            width: isMobile ? '100%' : 'auto',
            fontSize: isMobile ? '14px' : '16px'
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
        padding: isMobile ? 12 : 16, 
        background: '#f5f5f5', 
        borderRadius: 8,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 8 : 16
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#1976d2' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'accepted').length}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Accepted (Need Key)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#ff9800' }}>
            {orders.filter(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending').length}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Pending</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#2196f3' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>In Transit</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#4caf50' }}>
            {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Completed</div>
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
      ) : isMobile ? (
        // Mobile Card View
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => {
            const transport = order.marketToTraderTransport;
            const isPending = !transport || transport.status === 'pending';
            const isAccepted = transport?.status === 'accepted';
            const isInProgress = transport?.status === 'in_progress';
            const isCompleted = transport?.status === 'completed';
            const hasKey = !!transport?.adminGeneratedKey;
            const keyUsed = !!transport?.pickupKeyEnteredAt;
            const itemsCount = order.productItems?.length || 0;

            return (
              <div key={order._id} style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                padding: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {/* Card Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: 14 }}>
                      {order.orderId}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: getStatusColor(transport?.status),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 'bold',
                      marginTop: 4
                    }}>
                      {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: 20, 
                      fontWeight: 'bold', 
                      color: '#1e40af' 
                    }}>
                      {itemsCount}
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      items
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: 8,
                    fontSize: 12
                  }}>
                    <div style={{ 
                      background: '#e3f2fd', 
                      borderRadius: 4, 
                      padding: '2px 6px',
                      marginRight: 8,
                      fontWeight: 'bold',
                      color: '#1976d2'
                    }}>
                      PICKUP
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {order.pickupMarket?.marketName || 'Not specified'}
                      </div>
                      <div style={{ color: '#666' }}>
                        {order.pickupMarket?.district || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', fontSize: 12 }}>
                    <div style={{ 
                      background: '#f0f9ff', 
                      borderRadius: 4, 
                      padding: '2px 6px',
                      marginRight: 8,
                      fontWeight: 'bold',
                      color: '#0369a1'
                    }}>
                      DELIVERY
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {order.traderDetails?.traderName || order.traderName}
                      </div>
                      <div style={{ color: '#666' }}>
                        {order.traderDetails?.location?.district || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transporter Info */}
                {transport?.transporterName && (
                  <div style={{ 
                    background: '#f9fafb', 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 12
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Transporter</div>
                    <div>{transport.transporterName}</div>
                    <div style={{ color: '#666' }}>{transport.transporterMobile}</div>
                  </div>
                )}

                {/* Key Details */}
                {hasKey ? (
                  <div style={{ 
                    background: '#f0f9ff', 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 12
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Pickup Key:</div>
                    <div style={{ 
                      fontFamily: 'monospace', 
                      background: '#ffffff', 
                      padding: '8px', 
                      borderRadius: 4,
                      fontSize: 11,
                      wordBreak: 'break-all',
                      marginBottom: 8
                    }}>
                      {transport.adminGeneratedKey}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        color: keyUsed ? '#4caf50' : '#ff9800',
                        fontWeight: 'bold',
                        fontSize: 11
                      }}>
                        {keyUsed ? '✅ USED' : '⏳ PENDING'}
                      </span>
                      {keyUsed && (
                        <span style={{ fontSize: 10, color: '#666' }}>
                          {formatDate(transport.pickupKeyEnteredAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : isAccepted ? (
                  <div style={{ 
                    background: '#ffebee', 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 16,
                    color: '#d32f2f',
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    ⚠️ Need to generate key
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {isAccepted && !hasKey && (
                    <>
                      <button
                        onClick={() => assignTransporter(order)}
                        style={{
                          padding: '12px',
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: 14
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
                        padding: '12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 14
                      }}
                    >
                      Expire Key
                    </button>
                  )}

                  <button
                    onClick={() => viewOrderDetails(order)}
                    style={{
                      padding: '12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 14
                    }}
                  >
                    View Full Details
                  </button>

                  {isCompleted && (
                    <button
                      disabled
                      style={{
                        padding: '12px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 'bold',
                        fontSize: 14,
                        opacity: 0.8
                      }}
                    >
                      ✅ Journey Completed
                    </button>
                  )}

                  {isPending && (
                    <button
                      disabled
                      style={{
                        padding: '12px',
                        background: '#9e9e9e',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 'bold',
                        fontSize: 14,
                        opacity: 0.8
                      }}
                    >
                      ⏳ Waiting for Transporter
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      disabled
                      style={{
                        padding: '12px',
                        background: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 'bold',
                        fontSize: 14,
                        opacity: 0.8
                      }}
                    >
                      🚚 In Transit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop Table View (unchanged)
        <div style={{ overflowX: 'auto', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Order ID</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Pickup Location</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Delivery Location</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Items Count</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Transporter Info</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Status</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Key Details</th>
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Actions</th>
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
                const itemsCount = order.productItems?.length || 0;

                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{order.orderId}</div>
                      <button
                        onClick={() => viewOrderDetails(order)}
                        style={{
                          marginTop: 8,
                          padding: '4px 8px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      {order.pickupMarket ? (
                        <div>
                          <div><strong>{order.pickupMarket.marketName}</strong></div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {order.pickupMarket.district && `${order.pickupMarket.district}, `}
                            {order.pickupMarket.state || 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic' }}>Not specified</div>
                      )}
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      <div>
                        <div><strong>{order.traderDetails?.traderName || order.traderName}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                          {order.traderDetails?.location?.district && `${order.traderDetails.location.district}, `}
                          {order.traderDetails?.location?.state || 'N/A'}
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e40af' }}>
                          {itemsCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {itemsCount === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      {transport?.transporterName ? (
                        <>
                          <div><strong>{transport.transporterName}</strong></div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {transport.transporterMobile}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic' }}>No transporter assigned</div>
                      )}
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      <span style={{
                        padding: '6px 12px',
                        background: getStatusColor(transport?.status),
                        color: 'white',
                        borderRadius: 4,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                      </span>
                      
                      {isAccepted && transport?.transporterName && (
                        <div style={{ marginTop: 8, padding: 8, background: '#e3f2fd', borderRadius: 4, fontSize: '12px' }}>
                          ⚡ ACTION REQUIRED
                        </div>
                      )}
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      {hasKey ? (
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '12px' }}>
                            Pickup Key:
                          </div>
                          <div style={{ 
                            fontFamily: 'monospace', 
                            background: '#f5f5f5', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: '12px',
                            wordBreak: 'break-all'
                          }}>
                            {transport.adminGeneratedKey}
                          </div>
                          <div style={{ marginTop: 8, fontSize: '12px' }}>
                            <span style={{ color: keyUsed ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
                              {keyUsed ? '✅ USED' : '⏳ PENDING'}
                            </span>
                          </div>
                          {keyUsed && (
                            <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                              Used: {formatDate(transport.pickupKeyEnteredAt)}
                            </div>
                          )}
                        </div>
                      ) : isAccepted ? (
                        <div style={{ padding: 8, background: '#ffebee', borderRadius: 4, color: '#d32f2f', fontSize: '12px' }}>
                          ⚠️ Need key
                        </div>
                      ) : (
                        <div style={{ color: '#999', fontStyle: 'italic', fontSize: '12px' }}>N/A</div>
                      )}
                    </td>
                    
                    <td style={{ padding: 16, verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {isAccepted && !hasKey && (
                          <>
                            <button
                              onClick={() => assignTransporter(order)}
                              style={{
                                padding: '8px 12px',
                                background: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              🔑 Generate Key
                            </button>
                            
                            <textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Admin notes"
                              rows={2}
                              style={{
                                width: '100%',
                                padding: 8,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                resize: 'vertical',
                                fontSize: '12px'
                              }}
                            />
                          </>
                        )}

                        {hasKey && !keyUsed && (
                          <button
                            onClick={() => expireKey(order.orderId)}
                            style={{
                              padding: '8px 12px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px',
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
                              padding: '8px 12px',
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: '12px',
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
                              padding: '8px 12px',
                              background: '#9e9e9e',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: '12px',
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
                              padding: '8px 12px',
                              background: '#2196f3',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontSize: '12px',
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

      {/* Details Modal (responsive version) */}
      {showDetailsModal && selectedOrderDetails && (
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
          zIndex: 1000,
          padding: isMobile ? 12 : 24
        }}>
          <div style={{
            background: 'white',
            padding: isMobile ? 16 : 32,
            borderRadius: 12,
            width: '100%',
            maxWidth: isMobile ? '100%' : 900,
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                position: 'absolute',
                top: isMobile ? 12 : 20,
                right: isMobile ? 12 : 20,
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                zIndex: 1001
              }}
            >
              ✕
            </button>
            
            <h2 style={{ 
              margin: '0 0 24px 0', 
              color: '#333',
              fontSize: isMobile ? '18px' : '24px',
              paddingRight: 32
            }}>
              Order Details: {selectedOrderDetails.orderId}
            </h2>

            {/* Mobile-optimized details layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Order Summary Card */}
              <div style={{ 
                background: '#f8fafc', 
                padding: 16, 
                borderRadius: 8,
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
                  gap: 12 
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Status</div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: getStatusColor(selectedOrderDetails.marketToTraderTransport?.status),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {selectedOrderDetails.marketToTraderTransport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Items</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {selectedOrderDetails.productItems?.length || 0}
                    </div>
                  </div>
                  {!isMobile && (
                    <>
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Trader</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {selectedOrderDetails.traderName}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Transporter</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {selectedOrderDetails.marketToTraderTransport?.transporterName || 'Not assigned'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pickup & Delivery Cards - Stacked on mobile */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Pickup Card */}
                <div style={{ 
                  background: '#f9fafb', 
                  padding: 16, 
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 12,
                    color: '#1e40af'
                  }}>
                    <div style={{ fontSize: 18 }}>📍</div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Pickup Location</h3>
                  </div>
                  
                  {selectedOrderDetails.pickupMarket ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937' }}>
                          {selectedOrderDetails.pickupMarket.marketName}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                          {selectedOrderDetails.pickupMarket.exactAddress}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 6 
                      }}>
                        {selectedOrderDetails.pickupMarket.district && (
                          <span style={{ 
                            background: '#dbeafe', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#1e40af'
                          }}>
                            {selectedOrderDetails.pickupMarket.district}
                          </span>
                        )}
                        {selectedOrderDetails.pickupMarket.state && (
                          <span style={{ 
                            background: '#dbeafe', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#1e40af'
                          }}>
                            {selectedOrderDetails.pickupMarket.state}
                          </span>
                        )}
                        {selectedOrderDetails.pickupMarket.pincode && (
                          <span style={{ 
                            background: '#dbeafe', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#1e40af'
                          }}>
                            Pincode: {selectedOrderDetails.pickupMarket.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>Pickup location not specified</div>
                  )}
                </div>

                {/* Delivery Card */}
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: 16, 
                  borderRadius: 8,
                  border: '1px solid #bae6fd'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 12,
                    color: '#0369a1'
                  }}>
                    <div style={{ fontSize: 18 }}>🏠</div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Delivery Location</h3>
                  </div>
                  
                  {selectedOrderDetails.traderDetails ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937' }}>
                          {selectedOrderDetails.traderDetails.traderName}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                          📱 {selectedOrderDetails.traderDetails.traderMobile}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: 12, color: '#374151' }}>
                        {selectedOrderDetails.traderDetails.location.address}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 6 
                      }}>
                        {selectedOrderDetails.traderDetails.location.district && (
                          <span style={{ 
                            background: '#bae6fd', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#0369a1'
                          }}>
                            {selectedOrderDetails.traderDetails.location.district}
                          </span>
                        )}
                        {selectedOrderDetails.traderDetails.location.state && (
                          <span style={{ 
                            background: '#bae6fd', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#0369a1'
                          }}>
                            {selectedOrderDetails.traderDetails.location.state}
                          </span>
                        )}
                        {selectedOrderDetails.traderDetails.location.pincode && (
                          <span style={{ 
                            background: '#bae6fd', 
                            padding: '4px 8px', 
                            borderRadius: 4,
                            fontSize: 11,
                            color: '#0369a1'
                          }}>
                            Pincode: {selectedOrderDetails.traderDetails.location.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>Trader details not available</div>
                  )}
                </div>
              </div>

              {/* Product Items */}
              <div>
                <h3 style={{ 
                  color: '#374151', 
                  marginBottom: 16,
                  fontSize: isMobile ? 16 : 18
                }}>
                  📦 Product Items ({selectedOrderDetails.productItems?.length || 0})
                </h3>
                
                {selectedOrderDetails.productItems && selectedOrderDetails.productItems.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedOrderDetails.productItems.map((item, idx) => {
                      const productDetails = getProductDetails(item.productId, item.grade);
                      
                      return (
                        <div key={idx} style={{ 
                          background: '#ffffff', 
                          padding: 16, 
                          borderRadius: 8,
                          border: '1px solid #e5e7eb'
                        }}>
                          {/* Product Header */}
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 12
                          }}>
                            <div>
                              <div style={{ 
                                fontWeight: 'bold', 
                                color: '#1f2937',
                                fontSize: 14
                              }}>
                                {productNames[item.productId] || "Product"}
                              </div>
                              <div style={{ fontSize: 11, color: '#6b7280' }}>
                                ID: {item.productId}
                              </div>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: 4
                            }}>
                              <span style={{ 
                                background: '#dbeafe', 
                                padding: '3px 8px', 
                                borderRadius: 4, 
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#1e40af'
                              }}>
                                Grade: {item.grade}
                              </span>
                              <span style={{ 
                                background: '#dcfce7', 
                                padding: '3px 8px', 
                                borderRadius: 4, 
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#166534'
                              }}>
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {productDetails ? (
                            <div>
                              {/* Product Type */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>
                                  Product Type
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                                  {getSubCategoryNameForProduct(productDetails)}
                                </div>
                              </div>

                              {/* Description */}
                              {productDetails.cropBriefDetails && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>
                                    Description
                                  </div>
                                  <div style={{ 
                                    fontSize: 12, 
                                    color: '#374151',
                                    lineHeight: 1.4
                                  }}>
                                    {productDetails.cropBriefDetails}
                                  </div>
                                </div>
                              )}

                              {/* Quick Details */}
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, 1fr)', 
                                gap: 8,
                                marginBottom: 12
                              }}>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Farming Type</div>
                                  <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    {productDetails.farmingType || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Seeds Type</div>
                                  <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    {productDetails.typeOfSeeds || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Packaging</div>
                                  <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    {productDetails.packagingType || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Unit</div>
                                  <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    {productDetails.unitMeasurement || "N/A"}
                                  </div>
                                </div>
                              </div>

                              {/* Price Info */}
                              {productDetails.selectedGrade && (
                                <div style={{ 
                                  background: '#f0f9ff', 
                                  padding: 12, 
                                  borderRadius: 6,
                                  marginBottom: 12
                                }}>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 8
                                  }}>
                                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#0369a1' }}>
                                      Price Details
                                    </div>
                                    <div style={{ 
                                      fontWeight: 'bold', 
                                      fontSize: 16,
                                      color: '#0369a1'
                                    }}>
                                      ₹{productDetails.selectedGrade.pricePerUnit}/unit
                                    </div>
                                  </div>
                                  <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                    gap: 8 
                                  }}>
                                    <div>
                                      <div style={{ fontSize: 11, color: '#6b7280' }}>Available Qty</div>
                                      <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                        {productDetails.selectedGrade.totalQty}
                                      </div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: 11, color: '#6b7280' }}>Quantity Type</div>
                                      <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                                        {productDetails.selectedGrade.quantityType || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ 
                              padding: 12, 
                              textAlign: 'center', 
                              color: '#999',
                              background: '#f9fafb',
                              borderRadius: 6
                            }}>
                              <div style={{ fontSize: 12 }}>Product details not available</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ 
                    padding: 20, 
                    textAlign: 'center', 
                    background: '#f5f5f5', 
                    borderRadius: 8,
                    color: '#666',
                    fontSize: 14
                  }}>
                    No product items found for this order
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: 8,
                paddingTop: 16,
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: '12px 32px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 14,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Key Modal (responsive) */}
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
          zIndex: 1001,
          padding: isMobile ? 16 : 24
        }}>
          <div style={{
            background: 'white',
            padding: isMobile ? 20 : 32,
            borderRadius: 12,
            width: '100%',
            maxWidth: 500,
            textAlign: 'center'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              color: '#4caf50',
              fontSize: isMobile ? 18 : 20 
            }}>
              ✅ Pickup Key Generated!
            </h2>
            
            <div style={{ 
              margin: '20px 0',
              padding: 16,
              background: '#f5f5f5',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: isMobile ? 14 : 18,
              fontWeight: 'bold',
              wordBreak: 'break-all'
            }}>
              {generatedKey}
            </div>
            
            <p style={{ 
              marginBottom: 16, 
              color: '#666',
              fontSize: isMobile ? 13 : 14 
            }}>
              This key has been sent to transporter:
            </p>
            
            {selectedOrder.marketToTraderTransport && (
              <div style={{ 
                marginBottom: 20, 
                padding: 12, 
                background: '#e3f2fd', 
                borderRadius: 6,
                fontSize: isMobile ? 12 : 13
              }}>
                <strong>Transporter:</strong> {selectedOrder.marketToTraderTransport.transporterName}<br />
                <strong>Mobile:</strong> {selectedOrder.marketToTraderTransport.transporterMobile}
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12, 
              justifyContent: 'center' 
            }}>
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
                  fontWeight: 'bold',
                  fontSize: isMobile ? 14 : 15,
                  flex: isMobile ? 1 : 'none'
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
                  fontWeight: 'bold',
                  fontSize: isMobile ? 14 : 15,
                  flex: isMobile ? 1 : 'none'
                }}
              >
                Close
              </button>
            </div>
            
            <div style={{ 
              marginTop: 20, 
              padding: 12, 
              background: '#fff3cd', 
              borderRadius: 6,
              fontSize: isMobile ? 12 : 13,
              color: '#856404'
            }}>
              <strong>Note:</strong> Transporter will use this key to start their journey.
            </div>
          </div>
        </div>
      )}

      {/* Admin Instructions (responsive) */}
      <div style={{ 
        marginTop: 32, 
        padding: isMobile ? 16 : 20, 
        background: '#f0f7ff', 
        borderRadius: 8,
        border: '1px solid #bbdefb'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          color: '#1976d2',
          fontSize: isMobile ? 16 : 18 
        }}>
          📋 Admin Workflow
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: '#ff9800', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 12,
              flexShrink: 0
            }}>1</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Order appears</strong> when transporter accepts it</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Status changes to "accepted"</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: '#1976d2', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 12,
              flexShrink: 0
            }}>2</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Generate pickup key</strong> for transporter</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Key appears on transporter's screen</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: '#ff9800', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 12,
              flexShrink: 0
            }}>3</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Transporter enters key</strong> to start journey</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Status changes to "in_progress"</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: '#4caf50', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 12,
              flexShrink: 0
            }}>4</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Trader generates delivery key</strong></div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>When goods are delivered and verified</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: '#4caf50', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 12,
              flexShrink: 0
            }}>5</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Transporter enters delivery key</strong></div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Journey marked as completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarkettoTrader;