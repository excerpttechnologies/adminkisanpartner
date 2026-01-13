'use client';

import React, { useEffect, useState } from "react";
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

interface GradePrice {
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: string;
  priceType: string;
  status: string;
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
  deliveryDate?: string;
  deliveryTime?: string;
  nearestMarket?: string;
  cropPhotos?: string[];
  gradePrices?: GradePrice[];
  status?: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image?: string;
}

/* ================= Component ================= */

const AdminTransport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productNames, setProductNames] = useState<ProductDetails>({});
  const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch All Products ================= */
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/product/all`);
      if (res.data?.data) {
        setAllProducts(res.data.data);
        
        // Also extract product names
        const names: ProductDetails = {};
        res.data.data.forEach((product: FullProductDetails) => {
          // Get subcategory name if it's an object, otherwise use categoryId name
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

  /* ================= Fetch All SubCategories ================= */
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/subcategory/all`);
      if (res.data?.data) {
        setSubCategories(res.data.data);
      }
    } catch (err) {
      console.error("SubCategories fetch error:", err);
    }
  };

  /* ================= Get SubCategory Name Helper ================= */
  // const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
  //   if (!product.subCategoryId) return "N/A";

  //   // If backend already sent populated object with name
  //   if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
  //     return product.subCategoryId.name;
  //   }

  //   // If only ID string, match from subCategories array
  //   const subCatId = typeof product.subCategoryId === 'string' 
  //     ? product.subCategoryId 
  //     : product.subCategoryId._id;
    
  //   const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
  //   return subCat?.subCategoryName || "N/A";
  // };

  const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
  if (!product.subCategoryId) return "N/A";

  // If backend already sent populated object with name
  if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
    return (product.subCategoryId as { name: string }).name;
  }

  // If only ID string, match from subCategories array
  const subCatId = typeof product.subCategoryId === 'string' 
    ? product.subCategoryId 
    : (product.subCategoryId as { _id: string })._id;
  
  const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
  return subCat?.subCategoryName || "N/A";
};
  /* ================= Get Product Details by ID and Grade ================= */
  const getProductDetails = (productId: string, grade: string) => {
    const product = allProducts.find(p => p.productId === productId);
    if (!product) return null;

    const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
    return {
      ...product,
      selectedGrade: gradeInfo
    };
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

        // First fetch subcategories and products
        await fetchSubCategories();
        await fetchAllProducts();

        const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

        if (res.data.success) {
          const orderList = res.data.data;

          const enriched = await Promise.all(
            orderList.map(async (o: any) => {
              const marketId = o.productItems?.[0]?.nearestMarket;
              const pickupMarket = marketId ? await fetchMarket(marketId) : null;
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

      if (selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          adminPickupKey: res.data.pickupKey,
        });
      }

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

  /* ================= Styles ================= */
  const thStyle = {
    padding: "12px",
    textAlign: "left" as const,
    borderBottom: "2px solid #e5e7eb",
    fontWeight: 600,
    fontSize: "14px",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  };

  const modalOverlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalBoxStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "900px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  };

  const sectionStyle = {
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  };

  const boxStyle = {
    background: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  };

  const enhancedProductBoxStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const infoItemStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  };

  const labelStyle = {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  /* ================= UI ================= */
  if (loading) return <div style={{ padding: 40 }}>Loading Orders...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>🛠 Trader Transport Management </h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Pickup Location</th>
            <th style={thStyle}>Delivery Location</th>
            <th style={thStyle}>Transporter</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Items Count</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} style={{ background: "#fff" }}>
              <td style={tdStyle}>
                <strong>{o.orderId}</strong>
                <br />
                <small style={{ color: "#666" }}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </small>
              </td>
              <td style={tdStyle}>
                {o.pickupMarket ? (
                  <>
                    <strong>{o.pickupMarket.marketName}</strong>
                    <br />
                    <small>{o.pickupMarket.district}, {o.pickupMarket.state}</small>
                  </>
                ) : (
                  "Not specified"
                )}
              </td>
              <td style={tdStyle}>
                {o.traderDetails ? (
                  <>
                    <strong>{o.traderDetails.traderName}</strong>
                    <br />
                    <small>
                      {o.traderDetails.location.district}, {o.traderDetails.location.state}
                    </small>
                  </>
                ) : (
                  "Loading..."
                )}
              </td>
              <td style={tdStyle}>
                {o.transporterDetails ? (
                  <>
                    <strong>{o.transporterDetails.transporterName}</strong>
                    <br />
                    <small>{o.transporterDetails.vehicleType}</small>
                  </>
                ) : (
                  <span style={{ color: "#999" }}>Waiting for transporter</span>
                )}
              </td>
              <td style={tdStyle}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: "12px",
                  fontWeight: "bold",
                  background: 
                    o.transporterStatus === "completed" ? "#dcfce7" :
                    o.transporterStatus === "started" ? "#fef3c7" :
                    o.transporterStatus === "accepted" ? "#dbeafe" : "#f3f4f6",
                  color: 
                    o.transporterStatus === "completed" ? "#166534" :
                    o.transporterStatus === "started" ? "#92400e" :
                    o.transporterStatus === "accepted" ? "#1e40af" : "#6b7280",
                }}>
                  {o.transporterStatus || "pending"}
                </span>
              </td>
              <td style={tdStyle}>
                <div style={{ textAlign: "center" as const }}>
                  <strong>{o.productItems.length}</strong>
                  <br />
                  <small>items</small>
                </div>
              </td>
              <td style={tdStyle}>
                <button 
                  onClick={() => setSelectedOrder(o)}
                  style={{
                    padding: "6px 12px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Order Details: {selectedOrder.orderId}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              {/* Order Information */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>📋 Order Information</h4>
                <div style={gridStyle}>
                  <div>
                    <strong>Order ID:</strong> {selectedOrder.orderId}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Trader ID:</strong> {selectedOrder.traderId}
                  </div>
                </div>
              </div>

              {/* Pickup Details */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>📍 Pickup Location</h4>
                {selectedOrder.pickupMarket ? (
                  <div style={boxStyle}>
                    <strong>{selectedOrder.pickupMarket.marketName}</strong>
                    <p>{selectedOrder.pickupMarket.exactAddress}</p>
                    <p>
                      {selectedOrder.pickupMarket.district}, {selectedOrder.pickupMarket.state}
                      {selectedOrder.pickupMarket.pincode && ` - ${selectedOrder.pickupMarket.pincode}`}
                    </p>
                    {selectedOrder.pickupMarket.landmark && (
                      <p><small>Landmark: {selectedOrder.pickupMarket.landmark}</small></p>
                    )}
                  </div>
                ) : (
                  <p style={{ color: "#999" }}>No pickup location specified</p>
                )}
              </div>

              {/* Delivery Details */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>🏠 Delivery Location</h4>
                {selectedOrder.traderDetails ? (
                  <div style={boxStyle}>
                    <strong>{selectedOrder.traderDetails.traderName}</strong>
                    <p>📱 {selectedOrder.traderDetails.traderMobile}</p>
                    <p>{selectedOrder.traderDetails.location.address}</p>
                    <p>
                      {selectedOrder.traderDetails.location.taluk}, {selectedOrder.traderDetails.location.district}
                      <br />
                      {selectedOrder.traderDetails.location.state} - {selectedOrder.traderDetails.location.pincode}
                    </p>
                    {selectedOrder.traderDetails.location.villageGramaPanchayat && (
                      <p><small>Panchayat: {selectedOrder.traderDetails.location.villageGramaPanchayat}</small></p>
                    )}
                  </div>
                ) : (
                  <p style={{ color: "#999" }}>Loading trader details...</p>
                )}
              </div>

              {/* Product Items - ENHANCED */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>📦 Product Items ({selectedOrder.productItems.length})</h4>
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedOrder.productItems.map((item, idx) => {
                    const productDetails = getProductDetails(item.productId, item.grade);
                    
                    return (
                      <div key={idx} style={enhancedProductBoxStyle}>
                        {/* Product Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                          <div>
                            <h4 style={{ margin: 0, color: "#1f2937", fontSize: "16px" }}>
                              {productNames[item.productId] || "Product"}
                            </h4>
                            <small style={{ color: "#6b7280" }}>ID: {item.productId}</small>
                          </div>
                          <span style={{ 
                            background: "#dbeafe", 
                            padding: "4px 12px", 
                            borderRadius: 4, 
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1e40af"
                          }}>
                            Grade: {item.grade}
                          </span>
                        </div>

                        {productDetails ? (
                          <>
                            {/* Category Info */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Product Name </small>
                                <strong>{getSubCategoryNameForProduct(productDetails)}</strong>
                              </div>
                            </div>

                            {/* Product Description */}
                            {productDetails.cropBriefDetails && (
                              <div style={{ ...infoItemStyle, marginBottom: 12 }}>
                                <small style={labelStyle}>Description</small>
                                <p style={{ margin: "4px 0 0 0", color: "#374151" }}>
                                  {productDetails.cropBriefDetails}
                                </p>
                              </div>
                            )}

                            {/* Farming Details */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Farming Type</small>
                                <strong>{productDetails.farmingType || "N/A"}</strong>
                              </div>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Seeds Type</small>
                                <strong>{productDetails.typeOfSeeds || "N/A"}</strong>
                              </div>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Status</small>
                                <span style={{
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  background: productDetails.status === "active" ? "#dcfce7" : "#fee2e2",
                                  color: productDetails.status === "active" ? "#166534" : "#991b1b"
                                }}>
                                  {productDetails.status || "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Packaging Details */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Packaging Type</small>
                                <strong>{productDetails.packagingType || "N/A"}</strong>
                              </div>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Package Size</small>
                                <strong>{productDetails.packageMeasurement || "N/A"}</strong>
                              </div>
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Unit</small>
                                <strong>{productDetails.unitMeasurement || "N/A"}</strong>
                              </div>
                            </div>

                            {/* Order Specific Details */}
                            <div style={{ 
                              background: "#f0f9ff", 
                              padding: 12, 
                              borderRadius: 6,
                              marginBottom: 12
                            }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Ordered Quantity</small>
                                  <strong style={{ fontSize: "18px", color: "#0369a1" }}>
                                    {item.quantity} {productDetails.unitMeasurement || "units"}
                                  </strong>
                                </div>
                                {productDetails.selectedGrade && (
                                  <div style={infoItemStyle}>
                                    <small style={labelStyle}>Price per Unit</small>
                                    <strong style={{ fontSize: "18px", color: "#0369a1" }}>
                                      ₹{productDetails.selectedGrade.pricePerUnit}
                                    </strong>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Grade Specific Info */}
                            {productDetails.selectedGrade && (
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Quantity Type</small>
                                  <strong>{productDetails.selectedGrade.quantityType || "N/A"}</strong>
                                </div>
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Price Type</small>
                                  <strong>{productDetails.selectedGrade.priceType || "N/A"}</strong>
                                </div>
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Available Qty</small>
                                  <strong>{productDetails.selectedGrade.totalQty || "N/A"}</strong>
                                </div>
                              </div>
                            )}

                            {/* Delivery Info */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                              {productDetails.deliveryDate && (
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Delivery Date</small>
                                  <strong>{new Date(productDetails.deliveryDate).toLocaleDateString()}</strong>
                                </div>
                              )}
                              {productDetails.deliveryTime && (
                                <div style={infoItemStyle}>
                                  <small style={labelStyle}>Delivery Time</small>
                                  <strong>{productDetails.deliveryTime}</strong>
                                </div>
                              )}
                            </div>

                            {/* Crop Photos */}
                            {productDetails.cropPhotos && productDetails.cropPhotos.length > 0 && (
                              <div style={infoItemStyle}>
                                <small style={labelStyle}>Product Images</small>
                                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                  {productDetails.cropPhotos.slice(0, 4).map((photo, photoIdx) => (
                                    <img 
                                      key={photoIdx}
                                      src={photo} 
                                      alt={`Product ${photoIdx + 1}`}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                        border: "1px solid #e5e7eb"
                                      }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ))}
                                  {productDetails.cropPhotos.length > 4 && (
                                    <div style={{
                                      width: 80,
                                      height: 80,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "#f3f4f6",
                                      borderRadius: 6,
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#6b7280"
                                    }}>
                                      +{productDetails.cropPhotos.length - 4} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                            <p>Product details not available</p>
                            <small>Quantity: {item.quantity} units</small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transporter Details */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>🚚 Transporter Information</h4>
                {selectedOrder.transporterDetails ? (
                  <div style={boxStyle}>
                    <div style={gridStyle}>
                      <div>
                        <strong>Name:</strong> {selectedOrder.transporterDetails.transporterName}
                      </div>
                      <div>
                        <strong>Contact:</strong> {selectedOrder.transporterDetails.transporterMobile}
                      </div>
                      <div>
                        <strong>Vehicle:</strong> {selectedOrder.transporterDetails.vehicleType}
                      </div>
                      <div>
                        <strong>Vehicle No:</strong> {selectedOrder.transporterDetails.vehicleNumber}
                      </div>
                      <div>
                        <strong>Capacity:</strong> {selectedOrder.transporterDetails.vehicleCapacity}
                      </div>
                      <div>
                        <strong>Driver:</strong> {selectedOrder.transporterDetails.driverName}
                      </div>
                      <div>
                        <strong>Driver Contact:</strong> {selectedOrder.transporterDetails.driverMobile}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#999" }}>No transporter assigned yet</p>
                )}
              </div>

              {/* Admin Actions */}
              <div style={sectionStyle}>
                <h4 style={{ marginBottom: 10, color: "#374151" }}>🛠 Admin Actions</h4>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <strong>Status:</strong>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    background: "#f3f4f6",
                    fontWeight: "bold",
                  }}>
                    {selectedOrder.transporterStatus || "pending"}
                  </span>
                </div>

                {selectedOrder.transporterDetails && !selectedOrder.adminPickupKey && (
                  <button
                    onClick={() => handleSelectTransporter(selectedOrder.orderId)}
                    style={{
                      marginTop: 15,
                      padding: "10px 20px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Select Transporter & Generate Pickup Key
                  </button>
                )}

                {selectedOrder.adminPickupKey && (
                  <div style={{ marginTop: 15, padding: 15, background: "#f0f9ff", borderRadius: 8 }}>
                    <strong style={{ color: "#0369a1" }}>🔐 Pickup Key Generated</strong>
                    <p style={{ 
                      fontSize: "24px", 
                      fontWeight: "bold", 
                      letterSpacing: "2px",
                      background: "#1e40af",
                      color: "white",
                      padding: "10px",
                      borderRadius: 6,
                      textAlign: "center",
                      marginTop: 10
                    }}>
                      {selectedOrder.adminPickupKey}
                    </p>
                    <p style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                      Share this key with the transporter to start the journey
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransport;