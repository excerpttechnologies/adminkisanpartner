






//this is still working latest\


'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://kisan.etpl.ai';
const ADMIN_API_BASE = '/api/'; // Admin API for vehicles

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

interface TransporterDetails {
  _id: string;
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
    location: string;
  };
  transportInfo: {
    vehicleType?: string;
    vehicleCapacity?: {
      value: number;
      unit: string;
    };
    vehicleNumber?: string;
    vehicleDocuments?: {
      rcBook?: string;
    };
    isCompany: boolean;
    driverInfo?: {
      driverName: string;
      driverMobileNo: string;
      driverAge: number;
    };
    vehicles: Array<{
      vehicleType: string;
      vehicleCapacity: {
        value: number;
        unit: string;
      };
      vehicleNumber: string;
      vehicleDocuments?: {
        rcBook?: string;
      };
      driverInfo?: {
        driverName: string;
        driverMobileNo: string;
        driverAge: number;
      };
      isActive: boolean;
      primaryVehicle: boolean;
      _id: string;
      addedAt: string;
    }>;
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  rating: number;
  totalTrips: number;
  registeredAt: string;
  isActive: boolean;
}

interface Vehicle {
  _id: string;
  type: string;
  pricePerKm: number;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
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
  const [transporterDetails, setTransporterDetails] = useState<TransporterDetails | null>(null);
  const [loadingTransporter, setLoadingTransporter] = useState(false);
  const [randomDistance, setRandomDistance] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate random distance between 15-80 km
  const generateRandomDistance = () => {
    const distances = [15, 18, 23, 28, 32, 37, 42, 48, 53, 58, 62, 67, 72, 78, 80];
    const randomIndex = Math.floor(Math.random() * distances.length);
    return `${distances[randomIndex]}`;
  };

  // Fetch vehicles from admin database - FIXED VERSION
  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      console.log('Fetching vehicles from admin database...');
      
      const response = await axios.get(`${ADMIN_API_BASE}/vehicles`);
      console.log('Vehicles fetched successfully:', response.data);

      
      
      if (Array.isArray(response.data)) {
        setVehicles(response.data);
        console.log(`Loaded ${response.data.length} vehicles from admin database`);
      } else {
        console.error('Expected array but got:', response.data);
        setVehicles([]);
      }
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };
  

  // Get transporter's primary vehicle type
  const getTransporterVehicleType = (): string => {
    if (!transporterDetails) return '';
    
    console.log('Transporter details for vehicle type:', transporterDetails);
    
    // Check if transporter has vehicles array
    if (transporterDetails.transportInfo.vehicles && transporterDetails.transportInfo.vehicles.length > 0) {
      // Find primary vehicle
      const primaryVehicle = transporterDetails.transportInfo.vehicles.find(v => v.primaryVehicle);
      if (primaryVehicle) {
        console.log('Found primary vehicle:', primaryVehicle.vehicleType);
        return primaryVehicle.vehicleType;
      }
      // If no primary vehicle found, take the first one
      if (transporterDetails.transportInfo.vehicles[0]) {
        console.log('Using first vehicle:', transporterDetails.transportInfo.vehicles[0].vehicleType);
        return transporterDetails.transportInfo.vehicles[0].vehicleType;
      }
    }
    
    // Fallback to old vehicleType field
    if (transporterDetails.transportInfo.vehicleType) {
      console.log('Using old vehicleType field:', transporterDetails.transportInfo.vehicleType);
      return transporterDetails.transportInfo.vehicleType;
    }
    
    console.log('No vehicle type found for transporter');
    return '';
  };

  // Find vehicle price by matching vehicle type (case-insensitive and partial match)
  const findVehiclePrice = (vehicleType: string): Vehicle | null => {
    if (!vehicleType || !vehicles.length) {
      console.log('No vehicle type or vehicles array is empty');
      console.log('Vehicle type:', vehicleType);
      console.log('Vehicles array length:', vehicles.length);
      
      return null;
    }
    
    const normalizedVehicleType = vehicleType.toLowerCase().trim();
    console.log('Looking for vehicle type:', normalizedVehicleType);
    console.log('Available vehicles:', vehicles.map(v => v.type));
    
    // Try exact match first
    let vehicle = vehicles.find(v => 
      v.type.toLowerCase().trim() === normalizedVehicleType
    );
    
    if (vehicle) {
      console.log('Exact match found:', vehicle);
      return vehicle;
    }
    
    // Try partial match
    vehicle = vehicles.find(v => 
      normalizedVehicleType.includes(v.type.toLowerCase().trim()) ||
      v.type.toLowerCase().trim().includes(normalizedVehicleType)
    );
    
    if (vehicle) {
      console.log('Partial match found:', vehicle);
      return vehicle;
    }
    
    // Try word-by-word matching for common vehicle types
    const vehicleWords = normalizedVehicleType.split(' ');
    vehicle = vehicles.find(v => {
      const vWords = v.type.toLowerCase().split(' ');
      return vehicleWords.some(word => 
        vWords.some(vWord => vWord.includes(word) || word.includes(vWord))
      );
    });
    
    if (vehicle) {
      console.log('Word-by-word match found:', vehicle);
    } else {
      console.log('No vehicle match found for:', vehicleType);
      console.log('Available types:', vehicles.map(v => v.type));
    }
    
    return vehicle || null;
  };

  // Calculate transporter charge
  const calculateTransporterCharge = (): string => {
    if (!randomDistance || !transporterDetails) {
      console.log('Missing data for calculation - Distance:', randomDistance, 'Transporter:', !!transporterDetails);
      return 'N/A';
    }
    
    const vehicleType = getTransporterVehicleType();
    if (!vehicleType) {
      console.log('No vehicle type found for transporter');
      return 'N/A';
    }
    
    console.log('Finding price for vehicle type:', vehicleType);
    const vehicle = findVehiclePrice(vehicleType);
    if (!vehicle) {
      console.log('No vehicle found in database for type:', vehicleType);
      console.log('Available vehicles in DB:', vehicles);
      return 'N/A';
    }
    
    const distance = parseFloat(randomDistance);
    if (isNaN(distance)) {
      console.log('Invalid distance:', randomDistance);
      return 'N/A';
    }
    
    const charge = distance * vehicle.pricePerKm;
    console.log(`Calculation: ${distance} km × ₹${vehicle.pricePerKm} = ₹${charge.toFixed(2)}`);
    return `₹${charge.toFixed(2)}`;
  };

  // Get vehicle price per km
  const getVehiclePricePerKm = (): string => {
    if (!transporterDetails) {
      console.log('No transporter details');
      return 'N/A';
    }
    
    const vehicleType = getTransporterVehicleType();
    if (!vehicleType) {
      console.log('No vehicle type found');
      return 'N/A';
    }
    
    console.log('Getting price for vehicle type:', vehicleType);
    const vehicle = findVehiclePrice(vehicleType);
    if (!vehicle) {
      console.log('No vehicle found for type:', vehicleType);
      return 'N/A';
    }
    
    console.log('Found vehicle price:', vehicle.pricePerKm);
    return `₹${vehicle.pricePerKm.toFixed(2)}`;
  };

  // Get transporter's vehicle type for display
  const getTransporterVehicleTypeDisplay = (): string => {
    if (!transporterDetails) return 'N/A';
    return getTransporterVehicleType() || 'N/A';
  };

  const fetchTransporterDetails = async (transporterId: string) => {
    if (!transporterId) return;
    
    try {
      setLoadingTransporter(true);
      const res = await axios.get(`${API_BASE}/api/transporter/profile/${transporterId}`);
      if (res.data.success && res.data.data) {
        setTransporterDetails(res.data.data);
        console.log('Transporter details loaded:', res.data.data);
        
        // Debug vehicle matching
        const vehicleType = getTransporterVehicleType();
        console.log('Extracted vehicle type:', vehicleType);
        if (vehicleType) {
          const vehicle = findVehiclePrice(vehicleType);
          console.log('Matched vehicle from DB:', vehicle);
          if (vehicle) {
            console.log('Vehicle price per km:', vehicle.pricePerKm);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching transporter details:', error);
      setTransporterDetails(null);
    } finally {
      setLoadingTransporter(false);
    }
  };

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
      await fetchVehicles(); // Fetch vehicle data from admin

      
      
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
    setRandomDistance(generateRandomDistance());
    
    // Fetch transporter details if available
    if (order.marketToTraderTransport?.transporterId) {
      fetchTransporterDetails(order.marketToTraderTransport.transporterId);
    } else {
      setTransporterDetails(null);
    }
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
              onClick={() => {
                setShowDetailsModal(false);
                setTransporterDetails(null);
              }}
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
              {/* Order Summary Card - Updated with Transporter Charge */}
              <div style={{ 
                background: '#f8fafc', 
                padding: 16, 
                borderRadius: 8,
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', 
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
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Distance</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1e40af' }}>
                      {randomDistance} km
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Transporter</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {selectedOrderDetails.marketToTraderTransport?.transporterName || 'Not assigned'}
                    </div>
                  </div>
                  {/* Transporter Charge Calculation */}
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Transporter Charge</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>
                      {calculateTransporterCharge()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Charge Calculation Details - Only show if we have vehicle data */}
              {getTransporterVehicleType() && (
                <div style={{ 
                  background: '#ecfdf5', 
                  padding: 16, 
                  borderRadius: 8,
                  border: '1px solid #a7f3d0'
                }}>
                  <h3 style={{ 
                    margin: '0 0 12px 0', 
                    color: '#065f46',
                    fontSize: isMobile ? 14 : 16
                  }}>
                    💰 Transporter Charge Calculation
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                      gap: 12 
                    }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Vehicle Type</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {getTransporterVehicleTypeDisplay()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Price per KM</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {getVehiclePricePerKm()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Distance</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {randomDistance} km
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#d1fae5',
                      borderRadius: 6,
                      marginTop: 8
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#065f46' }}>
                        Calculation:
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#065f46' }}>
                        {randomDistance} km × {getVehiclePricePerKm()} = {calculateTransporterCharge()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Transporter Details Section */}
              {selectedOrderDetails.marketToTraderTransport?.transporterId && (
                <div style={{ 
                  background: '#fefce8', 
                  padding: 16, 
                  borderRadius: 8,
                  border: '1px solid #fef08a'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 16,
                    color: '#854d0e'
                  }}>
                    <div style={{ fontSize: 18 }}>🚚</div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Transporter Details</h3>
                  </div>

                  {loadingTransporter ? (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                      <div style={{ fontSize: 14, color: '#666' }}>Loading transporter details...</div>
                    </div>
                  ) : transporterDetails ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {/* Personal Information */}
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Personal Information</h4>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                          gap: 12 
                        }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Name</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.personalInfo.name}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Mobile</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.personalInfo.mobileNo}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</div>
                            <div style={{ fontSize: 14 }}>{transporterDetails.personalInfo.email || 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Address</div>
                            <div style={{ fontSize: 14 }}>{transporterDetails.personalInfo.address}</div>
                          </div>
                        </div>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
                          gap: 12,
                          marginTop: 12
                        }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>District</div>
                            <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.district}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>State</div>
                            <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.state}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Pincode</div>
                            <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.pincode}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Taluk</div>
                            <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.taluk}</div>
                          </div>
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Bank Details</h4>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                          gap: 12 
                        }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Account Holder</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.bankDetails.accountHolderName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Bank Name</div>
                            <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.bankName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Account Number</div>
                            <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.accountNumber}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>IFSC Code</div>
                            <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.ifscCode}</div>
                          </div>
                        </div>
                      </div>

                      {/* Transport Information */}
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Transport Information</h4>
                        
                        {/* Vehicle Count and Rating */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
                          gap: 12,
                          marginBottom: 16
                        }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Vehicles</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.transportInfo.vehicles?.length || 0}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Rating</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#f59e0b' }}>⭐ {transporterDetails.rating.toFixed(1)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Trips</div>
                            <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.totalTrips}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Registered On</div>
                            <div style={{ fontSize: 13 }}>{formatDate(transporterDetails.registeredAt)}</div>
                          </div>
                        </div>

                        {/* Primary Vehicle Info */}
                        {transporterDetails.transportInfo.vehicles && transporterDetails.transportInfo.vehicles.length > 0 && (
                          <div>
                            <h5 style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: 13 }}>Primary Vehicle</h5>
                            {transporterDetails.transportInfo.vehicles.map((vehicle, index) => {
                              const matchedVehicle = findVehiclePrice(vehicle.vehicleType);
                              return (
                                <div key={index} style={{ 
                                  background: '#f9fafb', 
                                  padding: 12, 
                                  borderRadius: 6,
                                  marginBottom: 8,
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: 8
                                  }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 'bold' }}>
                                        {vehicle.vehicleType} - {vehicle.vehicleNumber}
                                      </div>
                                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                                        Capacity: {vehicle.vehicleCapacity.value} {vehicle.vehicleCapacity.unit}
                                      </div>
                                      {/* Display Price per KM for this vehicle */}
                                      <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>
                                        <strong>Price per KM:</strong> {matchedVehicle ? `₹${matchedVehicle.pricePerKm.toFixed(2)}` : 'N/A'}
                                      </div>
                                    </div>
                                    {vehicle.primaryVehicle && (
                                      <span style={{ 
                                        background: '#10b981', 
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: 4,
                                        fontSize: 10,
                                        fontWeight: 'bold'
                                      }}>
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  {vehicle.driverInfo && (
                                    <div style={{ 
                                      display: 'grid', 
                                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                                      gap: 8,
                                      marginTop: 8,
                                      paddingTop: 8,
                                      borderTop: '1px dashed #e5e7eb'
                                    }}>
                                      <div>
                                        <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Name</div>
                                        <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverName}</div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Mobile</div>
                                        <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverMobileNo}</div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Age</div>
                                        <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverAge}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* For backward compatibility - show single vehicle info if no vehicles array */}
                        {(!transporterDetails.transportInfo.vehicles || transporterDetails.transportInfo.vehicles.length === 0) && 
                          transporterDetails.transportInfo.vehicleNumber && (
                          <div style={{ 
                            background: '#f9fafb', 
                            padding: 12, 
                            borderRadius: 6,
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>
                              {transporterDetails.transportInfo.vehicleType} - {transporterDetails.transportInfo.vehicleNumber}
                            </div>
                            {transporterDetails.transportInfo.vehicleCapacity && (
                              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                                Capacity: {transporterDetails.transportInfo.vehicleCapacity.value} {transporterDetails.transportInfo.vehicleCapacity.unit}
                              </div>
                            )}
                            {/* Display Price per KM for this vehicle */}
                            <div style={{ fontSize: 11, color: '#059669', marginBottom: 4 }}>
                              <strong>Price per KM:</strong> {findVehiclePrice(transporterDetails.transportInfo.vehicleType || '') ? 
                                `₹${findVehiclePrice(transporterDetails.transportInfo.vehicleType || '')?.pricePerKm.toFixed(2)}` : 'N/A'}
                            </div>
                            {transporterDetails.transportInfo.driverInfo && (
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                                gap: 8,
                                marginTop: 8,
                                paddingTop: 8,
                                borderTop: '1px dashed #e5e7eb'
                              }}>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Name</div>
                                  <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverName}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Mobile</div>
                                  <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverMobileNo}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Age</div>
                                  <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverAge}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                      <div style={{ fontSize: 14 }}>Transporter details not available</div>
                    </div>
                  )}
                </div>
              )}

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
                  onClick={() => {
                    setShowDetailsModal(false);
                    setTransporterDetails(null);
                  }}
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






















// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';

// const API_BASE = 'https://kisan.etpl.ai';
// const ADMIN_API_BASE = '/api/';

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
//   taluk?: string;
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
//   productItems?: ProductItem[];
//   pickupMarket?: MarketDetails;
//   traderDetails?: {
//     location: TraderLocation;
//     traderName: string;
//     traderMobile: string;
//   };
//   transporterTaluk?: string; // Add transporter taluk
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

// interface TransporterDetails {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//     location: string;
//   };
//   transportInfo: {
//     vehicleType?: string;
//     vehicleCapacity?: {
//       value: number;
//       unit: string;
//     };
//     vehicleNumber?: string;
//     vehicleDocuments?: {
//       rcBook?: string;
//     };
//     isCompany: boolean;
//     driverInfo?: {
//       driverName: string;
//       driverMobileNo: string;
//       driverAge: number;
//     };
//     vehicles: Array<{
//       vehicleType: string;
//       vehicleCapacity: {
//         value: number;
//         unit: string;
//       };
//       vehicleNumber: string;
//       vehicleDocuments?: {
//         rcBook?: string;
//       };
//       driverInfo?: {
//         driverName: string;
//         driverMobileNo: string;
//         driverAge: number;
//       };
//       isActive: boolean;
//       primaryVehicle: boolean;
//       _id: string;
//       addedAt: string;
//     }>;
//   };
//   bankDetails: {
//     accountHolderName: string;
//     bankName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//     upiId: string;
//   };
//   rating: number;
//   totalTrips: number;
//   registeredAt: string;
//   isActive: boolean;
// }

// interface Vehicle {
//   _id: string;
//   type: string;
//   pricePerKm: number;
//   capacity: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface UserSession {
//   role: string;
//   taluka?: string;
//   name?: string;
// }

// const AdminMarkettoTrader: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showKeyModal, setShowKeyModal] = useState(false);
//   const [generatedKey, setGeneratedKey] = useState('');
//   const [adminNotes, setAdminNotes] = useState('');
//   const [filter, setFilter] = useState<string>('all');
  
//   const [productNames, setProductNames] = useState<Record<string, string>>({});
//   const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [transporterDetails, setTransporterDetails] = useState<TransporterDetails | null>(null);
//   const [loadingTransporter, setLoadingTransporter] = useState(false);
//   const [randomDistance, setRandomDistance] = useState<string>('');
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [loadingVehicles, setLoadingVehicles] = useState(false);
//   const [user, setUser] = useState<UserSession | null>(null);
//   const [talukFilter, setTalukFilter] = useState<string>('all');

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

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

//   // Filter orders by taluk when user role is subadmin
//   useEffect(() => {
//     if (!user) return;
    
//     if (user.role === 'admin') {
//       // Admin sees all orders
//       setFilteredOrders(orders);
//       setTalukFilter('all');
//     } else if (user.role === 'subadmin' && user.taluka) {
//       // Subadmin sees only orders from their taluk
//       const talukOrders = orders.filter(order => {
//         // Check trader taluk
//         const traderTaluk = order.traderDetails?.location?.taluk;
//         // Check pickup market taluk
//         const marketTaluk = order.pickupMarket?.taluk;
//         // Check transporter taluk
//         const transporterTaluk = order.transporterTaluk;
        
//         return traderTaluk === user.taluka || 
//                marketTaluk === user.taluka || 
//                transporterTaluk === user.taluka;
//       });
//       setFilteredOrders(talukOrders);
//       setTalukFilter(user.taluka);
//     } else {
//       setFilteredOrders(orders);
//     }
//   }, [orders, user]);

//   // Generate random distance between 15-80 km
//   const generateRandomDistance = () => {
//     const distances = [15, 18, 23, 28, 32, 37, 42, 48, 53, 58, 62, 67, 72, 78, 80];
//     const randomIndex = Math.floor(Math.random() * distances.length);
//     return `${distances[randomIndex]}`;
//   };

//   // Fetch vehicles from admin database
//   const fetchVehicles = async () => {
//     try {
//       setLoadingVehicles(true);
//       const response = await axios.get(`${ADMIN_API_BASE}/vehicles`);
      
//       if (Array.isArray(response.data)) {
//         setVehicles(response.data);
//       } else {
//         setVehicles([]);
//       }
//     } catch (error: any) {
//       console.error('Error fetching vehicles:', error);
//       setVehicles([]);
//     } finally {
//       setLoadingVehicles(false);
//     }
//   };

//   // Get transporter's primary vehicle type
//   const getTransporterVehicleType = (): string => {
//     if (!transporterDetails) return '';
    
//     if (transporterDetails.transportInfo.vehicles && transporterDetails.transportInfo.vehicles.length > 0) {
//       const primaryVehicle = transporterDetails.transportInfo.vehicles.find(v => v.primaryVehicle);
//       if (primaryVehicle) {
//         return primaryVehicle.vehicleType;
//       }
//       if (transporterDetails.transportInfo.vehicles[0]) {
//         return transporterDetails.transportInfo.vehicles[0].vehicleType;
//       }
//     }
    
//     if (transporterDetails.transportInfo.vehicleType) {
//       return transporterDetails.transportInfo.vehicleType;
//     }
    
//     return '';
//   };

//   // Find vehicle price by matching vehicle type
//   const findVehiclePrice = (vehicleType: string): Vehicle | null => {
//     if (!vehicleType || !vehicles.length) return null;
    
//     const normalizedVehicleType = vehicleType.toLowerCase().trim();
    
//     let vehicle = vehicles.find(v => 
//       v.type.toLowerCase().trim() === normalizedVehicleType
//     );
    
//     if (vehicle) return vehicle;
    
//     vehicle = vehicles.find(v => 
//       normalizedVehicleType.includes(v.type.toLowerCase().trim()) ||
//       v.type.toLowerCase().trim().includes(normalizedVehicleType)
//     );
    
//     if (vehicle) return vehicle;
    
//     const vehicleWords = normalizedVehicleType.split(' ');
//     vehicle = vehicles.find(v => {
//       const vWords = v.type.toLowerCase().split(' ');
//       return vehicleWords.some(word => 
//         vWords.some(vWord => vWord.includes(word) || word.includes(vWord))
//       );
//     });
    
//     return vehicle || null;
//   };

//   // Calculate transporter charge
//   const calculateTransporterCharge = (): string => {
//     if (!randomDistance || !transporterDetails) return 'N/A';
    
//     const vehicleType = getTransporterVehicleType();
//     if (!vehicleType) return 'N/A';
    
//     const vehicle = findVehiclePrice(vehicleType);
//     if (!vehicle) return 'N/A';
    
//     const distance = parseFloat(randomDistance);
//     if (isNaN(distance)) return 'N/A';
    
//     const charge = distance * vehicle.pricePerKm;
//     return `₹${charge.toFixed(2)}`;
//   };

//   // Get vehicle price per km
//   const getVehiclePricePerKm = (): string => {
//     if (!transporterDetails) return 'N/A';
    
//     const vehicleType = getTransporterVehicleType();
//     if (!vehicleType) return 'N/A';
    
//     const vehicle = findVehiclePrice(vehicleType);
//     if (!vehicle) return 'N/A';
    
//     return `₹${vehicle.pricePerKm.toFixed(2)}`;
//   };

//   // Get transporter's vehicle type for display
//   const getTransporterVehicleTypeDisplay = (): string => {
//     if (!transporterDetails) return 'N/A';
//     return getTransporterVehicleType() || 'N/A';
//   };

//   const fetchTransporterDetails = async (transporterId: string) => {
//     if (!transporterId) return;
    
//     try {
//       setLoadingTransporter(true);
//       const res = await axios.get(`${API_BASE}/api/transporter/profile/${transporterId}`);
//       if (res.data.success && res.data.data) {
//         setTransporterDetails(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching transporter details:', error);
//       setTransporterDetails(null);
//     } finally {
//       setLoadingTransporter(false);
//     }
//   };

//   // Fetch transporter taluk information
//   // const fetchTransporterTaluk = async (transporterId: string): Promise<string> => {
//   //   if (!transporterId) return '';
    
//   //   try {
//   //     const res = await axios.get(`${API_BASE}/api/transporter/profile/${transporterId}`);
//   //     if (res.data.success && res.data.data) {
//   //       return res.data.data.personalInfo?.taluk || '';
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching transporter taluk:', error);
//   //   }
//   //   return '';
//   // };

// const fetchTransporterTaluk = async (transporterId: string): Promise<string> => {
//   if (!transporterId || transporterId === 'undefined') {
//     return '';
//   }
  
//   // Check if it's a test/mock ID
//   if (transporterId === 'transporter-001' || transporterId.startsWith('test-')) {
//     console.log(`Skipping test transporter ID: ${transporterId}`);
//     return '';
//   }
  
//   try {
//     console.log(`Fetching transporter taluk for ID: ${transporterId}`);
    
//     const res = await axios.get(`${API_BASE}/api/transporter/profile/${transporterId}`, {
//       timeout: 10000, // 10 second timeout
//       validateStatus: function (status) {
//         return status < 500; // Don't reject on 404, only on 500+
//       }
//     });
    
//     console.log(`API Response for ${transporterId}:`, {
//       status: res.status,
//       success: res.data?.success
//     });
    
//     if (res.data.success && res.data.data) {
//       const taluk = res.data.data.personalInfo?.taluk || '';
//       console.log(`Found taluk "${taluk}" for transporter ${transporterId}`);
//       return taluk;
//     } else if (res.status === 404) {
//       console.warn(`Transporter not found (404): ${transporterId}`);
//       return '';
//     } else {
//       console.warn(`API returned unsuccessful for ${transporterId}:`, res.data);
//       return '';
//     }
//   } catch (error: any) {
//     // Handle specific error cases
//     if (error.code === 'ECONNABORTED') {
//       console.error(`Timeout fetching transporter ${transporterId}:`, error.message);
//     } else if (error.response?.status === 500) {
//       console.error(`Server error (500) for transporter ${transporterId}:`, error.message);
//     } else {
//       console.error(`Error fetching transporter ${transporterId}:`, error.message);
//     }
    
//     return '';
//   }
// };


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

//   const getProductDetails = (productId: string, grade: string) => {
//     const product = allProducts.find(p => p.productId === productId);
//     if (!product) return null;
    
//     const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
//     return {
//       ...product,
//       selectedGrade: gradeInfo
//     };
//   };

//   // Fetch trader details with taluk information
// // Update the fetchTraderDetailsWithTaluk function with better logging
// const fetchTraderDetailsWithTaluk = async (traderId: string) => {
//   try {
//     console.log(`Fetching trader details for ID: ${traderId}`);
    
//     // Try the traders API endpoint
//     const res = await axios.get(`/api/farmers?search=${traderId}`);
//     console.log(`Trader API response for ${traderId}:`, {
//       success: res.data?.success,
//       hasData: !!res.data?.data,
//       status: res.status
//     });
    
//     if (res.data.success && res.data.data) {
//       const trader = res.data.data;
//       const traderDetails = {
//         traderName: trader.personalInfo?.name || 'N/A',
//         traderMobile: trader.personalInfo?.mobileNo || 'N/A',
//         location: {
//           address: trader.personalInfo?.address || "",
//           state: trader.personalInfo?.state || "",
//           pincode: trader.personalInfo?.pincode || "",
//           district: trader.personalInfo?.district || "",
//           taluk: trader.personalInfo?.taluk || "",
//           villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat || "",
//         }
//       };
      
//       console.log(`Found trader details for ${traderId}:`, traderDetails);
//       return traderDetails;
//     }
//   } catch (error: any) {
//     console.error(`Error fetching trader ${traderId}:`, {
//       message: error.message,
//       status: error.response?.status,
//       url: error.config?.url
//     });
    
//     // Try alternative endpoint if the first one fails
//     try {
//       console.log(`Trying alternative endpoint for trader ${traderId}`);
//       const altRes = await axios.get(`${API_BASE}/api/farmers/${traderId}?role=trader`);
      
//       if (altRes.data.success && altRes.data.data) {
//         const trader = altRes.data.data;
//         const traderDetails = {
//           traderName: trader.personalInfo?.name || 'N/A',
//           traderMobile: trader.personalInfo?.mobileNo || 'N/A',
//           location: {
//             address: trader.personalInfo?.address || "",
//             state: trader.personalInfo?.state || "",
//             pincode: trader.personalInfo?.pincode || "",
//             district: trader.personalInfo?.district || "",
//             taluk: trader.personalInfo?.taluk || "",
//             villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat || "",
//           }
//         };
        
//         console.log(`Found trader via alternative endpoint:`, traderDetails);
//         return traderDetails;
//       }
//     } catch (altError) {
//       console.warn(`Alternative endpoint also failed for trader ${traderId}:`);
//     }
//   }
//   return null;
// };
//   // Fetch market details with taluk information
//   const fetchMarketDetailsWithTaluk = async (marketId: string) => {
//     try {
//       const res = await axios.get(`${API_BASE}/api/market/${marketId}`);
//       if (res.data.success && res.data.data) {
//         const market = res.data.data;
//         return {
//           marketName: market.marketName || 'N/A',
//           exactAddress: market.address || "",
//           landmark: market.landmark || "",
//           district: market.district || "",
//           state: market.state || "",
//           pincode: market.pincode || "",
//           taluk: market.taluk || ""
//         };
//       }
//     } catch (error) {
//       console.error('Error fetching market details:', error);
//     }
//     return null;
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
      
//       await fetchSubCategories();
//       await fetchAllProducts();
//       await fetchVehicles();

//       let url = `${API_BASE}/api/orders/market-to-trader/admin`;
//       if (filter !== 'all') {
//         url += `?status=${filter}`;
//       }
//       const res = await axios.get(url);
      
//       const enrichedOrders = await Promise.all(
//         (res.data.data || []).map(async (order: any) => {
//           try {
//             const orderDetailsRes = await axios.get(`${API_BASE}/api/orders/${order.orderId}`);
//             const orderDetails = orderDetailsRes.data.data;
            
//             let pickupMarket = null;
//             if (orderDetails?.productItems?.[0]?.nearestMarket) {
//               pickupMarket = await fetchMarketDetailsWithTaluk(orderDetails.productItems[0].nearestMarket);
//             }
            
//             let traderDetails = null;
//             if (order.traderId) {
//               traderDetails = await fetchTraderDetailsWithTaluk(order.traderId);
//             }
            
//             // Fetch transporter taluk if transporter exists
//             let transporterTaluk = '';
//             if (order.marketToTraderTransport?.transporterId) {
//               transporterTaluk = await fetchTransporterTaluk(order.marketToTraderTransport.transporterId);
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
//               },
//               transporterTaluk
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
//               },
//               transporterTaluk: ''
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
//     if (user) {
//       fetchOrders();
//     }
//   }, [filter, user]);

//   const viewOrderDetails = (order: Order) => {
//     setSelectedOrderDetails(order);
//     setShowDetailsModal(true);
//     setRandomDistance(generateRandomDistance());
    
//     // Fetch transporter details if available
//     if (order.marketToTraderTransport?.transporterId) {
//       fetchTransporterDetails(order.marketToTraderTransport.transporterId);
//     } else {
//       setTransporterDetails(null);
//     }
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

//   if (loading && !user) return <div style={{ padding: 20 }}>Loading user session...</div>;
//   if (loading) return <div style={{ padding: 20 }}>Loading orders...</div>;

//   return (
//     <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1400, margin: '0 auto' }}>
//       {/* Header with user role info */}
//       <div style={{ 
//         display: 'flex', 
//         flexDirection: isMobile ? 'column' : 'row',
//         justifyContent: 'space-between', 
//         alignItems: isMobile ? 'flex-start' : 'center', 
//         marginBottom: 24,
//         gap: isMobile ? 16 : 0
//       }}>
//         <div>
//           <h1 style={{ 
//             margin: '0 0 8px 0', 
//             color: '#333',
//             fontSize: isMobile ? '20px' : '24px'
//           }}>
//             Admin - Transport Management
//           </h1>
//           {user && (
//             <div style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 12,
//               flexWrap: 'wrap'
//             }}>
//               <div style={{ 
//                 background: user.role === 'admin' ? '#1e40af' : '#059669',
//                 color: 'white',
//                 padding: '4px 12px',
//                 borderRadius: 20,
//                 fontSize: '12px',
//                 fontWeight: 'bold'
//               }}>
//                 {user.role.toUpperCase()}
//               </div>
//               {user.role === 'subadmin' && user.taluka && (
//                 <div style={{ 
//                   background: '#f0f9ff',
//                   color: '#0369a1',
//                   padding: '4px 12px',
//                   borderRadius: 20,
//                   fontSize: '12px',
//                   border: '1px solid #bae6fd'
//                 }}>
//                   🗺️ Taluk: {user.taluka}
//                 </div>
//               )}
//               {filteredOrders.length !== orders.length && (
//                 <div style={{ 
//                   background: '#fef3c7',
//                   color: '#92400e',
//                   padding: '4px 12px',
//                   borderRadius: 20,
//                   fontSize: '12px',
//                   border: '1px solid #fbbf24'
//                 }}>
//                   🔍 Filtered: {filteredOrders.length} of {orders.length} orders
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
        
//         <div style={{ 
//           display: 'flex', 
//           flexDirection: isMobile ? 'column' : 'row',
//           gap: 12,
//           width: isMobile ? '100%' : 'auto'
//         }}>
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             style={{
//               padding: '8px 16px',
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               background: 'white',
//               width: isMobile ? '100%' : 'auto',
//               fontSize: isMobile ? '14px' : '16px'
//             }}
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>
          
//           {user?.role === 'admin' && (
//            <select
//   value={talukFilter}
//   onChange={(e) => {
//     setTalukFilter(e.target.value);
//     if (e.target.value === 'all') {
//       setFilteredOrders(orders);
//     } else {
//       const filtered = orders.filter(order => 
//         order.traderDetails?.location?.taluk === e.target.value || 
//         order.pickupMarket?.taluk === e.target.value ||
//         order.transporterTaluk === e.target.value
//       );
//       setFilteredOrders(filtered);
//     }
//   }}
//   style={{
//     padding: '8px 16px',
//     border: '1px solid #ddd',
//     borderRadius: 4,
//     background: 'white',
//     width: isMobile ? '100%' : 'auto',
//     fontSize: isMobile ? '14px' : '16px'
//   }}
// >
//   <option value="all">All Taluks</option>
//   {Array.from(new Set(
//     orders
//       .flatMap(order => [
//         order.traderDetails?.location?.taluk,
//         order.pickupMarket?.taluk,
//         order.transporterTaluk
//       ])
//       .filter((taluk): taluk is string => 
//         typeof taluk === 'string' && taluk.trim() !== ''
//       )
//   )).map((taluk: string) => (
//     <option key={taluk} value={taluk}>{taluk}</option>
//   ))}
// </select>
//           )}
//         </div>
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
//             {filteredOrders.filter(o => o.marketToTraderTransport?.status === 'accepted').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Accepted (Need Key)</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#ff9800' }}>
//             {filteredOrders.filter(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Pending</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#2196f3' }}>
//             {filteredOrders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>In Transit</div>
//         </div>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#4caf50' }}>
//             {filteredOrders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
//           </div>
//           <div style={{ fontSize: isMobile ? 12 : 14, color: '#666' }}>Completed</div>
//         </div>
//       </div>

//       {filteredOrders.length === 0 ? (
//         <div style={{ 
//           padding: 40, 
//           textAlign: 'center', 
//           background: '#f5f5f5', 
//           borderRadius: 8,
//           color: '#666'
//         }}>
//           {user?.role === 'subadmin' && user.taluka ? (
//             <>
//               <div style={{ fontSize: 24, marginBottom: 16 }}>🗺️</div>
//               <h3>No orders found for your taluk: {user.taluka}</h3>
//               <p>There are currently no transport orders in your assigned taluk.</p>
//             </>
//           ) : (
//             <>
//               <div style={{ fontSize: 24, marginBottom: 16 }}>📭</div>
//               <h3>No transport orders found</h3>
//               <p>Try adjusting your filters or check back later.</p>
//             </>
//           )}
//         </div>
//       ) : isMobile ? (
//         // Mobile Card View
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           {filteredOrders.map((order) => {
//             const transport = order.marketToTraderTransport;
//             const isPending = !transport || transport.status === 'pending';
//             const isAccepted = transport?.status === 'accepted';
//             const isInProgress = transport?.status === 'in_progress';
//             const isCompleted = transport?.status === 'completed';
//             const hasKey = !!transport?.adminGeneratedKey;
//             const keyUsed = !!transport?.pickupKeyEnteredAt;
//             const itemsCount = order.productItems?.length || 0;

//             return (
//               <div key={order._id} style={{
//                 background: 'white',
//                 borderRadius: 12,
//                 border: '1px solid #e0e0e0',
//                 padding: 16,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//               }}>
//                 {/* Card Header */}
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   alignItems: 'flex-start',
//                   marginBottom: 12
//                 }}>
//                   <div>
//                     <div style={{ fontWeight: 'bold', color: '#333', fontSize: 14 }}>
//                       {order.orderId}
//                     </div>
//                     <div style={{ 
//                       display: 'inline-block',
//                       padding: '4px 8px',
//                       background: getStatusColor(transport?.status),
//                       color: 'white',
//                       borderRadius: 4,
//                       fontSize: 11,
//                       fontWeight: 'bold',
//                       marginTop: 4
//                     }}>
//                       {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                     </div>
//                   </div>
//                   <div style={{ textAlign: 'right' }}>
//                     <div style={{ 
//                       fontSize: 20, 
//                       fontWeight: 'bold', 
//                       color: '#1e40af' 
//                     }}>
//                       {itemsCount}
//                     </div>
//                     <div style={{ fontSize: 11, color: '#666' }}>
//                       items
//                     </div>
//                   </div>
//                 </div>

//                 {/* Taluk Info */}
//                 {(order.traderDetails?.location?.taluk || order.pickupMarket?.taluk || order.transporterTaluk) && (
//                   <div style={{ 
//                     background: '#f0f9ff', 
//                     padding: '4px 8px', 
//                     borderRadius: 4,
//                     marginBottom: 12,
//                     fontSize: 11,
//                     color: '#0369a1',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 4
//                   }}>
//                     <span>🗺️</span>
//                     <span>
//                       {order.traderDetails?.location?.taluk && `Trader: ${order.traderDetails.location.taluk}`}
//                       {order.pickupMarket?.taluk && ` | Market: ${order.pickupMarket.taluk}`}
//                       {order.transporterTaluk && ` | Transporter: ${order.transporterTaluk}`}
//                     </span>
//                   </div>
//                 )}

//                 {/* Locations */}
//                 <div style={{ marginBottom: 16 }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'flex-start', 
//                     marginBottom: 8,
//                     fontSize: 12
//                   }}>
//                     <div style={{ 
//                       background: '#e3f2fd', 
//                       borderRadius: 4, 
//                       padding: '2px 6px',
//                       marginRight: 8,
//                       fontWeight: 'bold',
//                       color: '#1976d2'
//                     }}>
//                       PICKUP
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 'bold' }}>
//                         {order.pickupMarket?.marketName || 'Not specified'}
//                       </div>
//                       <div style={{ color: '#666' }}>
//                         {order.pickupMarket?.district || 'N/A'}
//                         {order.pickupMarket?.taluk && ` (${order.pickupMarket.taluk})`}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div style={{ display: 'flex', alignItems: 'flex-start', fontSize: 12 }}>
//                     <div style={{ 
//                       background: '#f0f9ff', 
//                       borderRadius: 4, 
//                       padding: '2px 6px',
//                       marginRight: 8,
//                       fontWeight: 'bold',
//                       color: '#0369a1'
//                     }}>
//                       DELIVERY
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 'bold' }}>
//                         {order.traderDetails?.traderName || order.traderName}
//                       </div>
//                       <div style={{ color: '#666' }}>
//                         {order.traderDetails?.location?.district || 'N/A'}
//                         {order.traderDetails?.location?.taluk && ` (${order.traderDetails.location.taluk})`}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transporter Info */}
//                 {transport?.transporterName && (
//                   <div style={{ 
//                     background: '#f9fafb', 
//                     padding: 12, 
//                     borderRadius: 8,
//                     marginBottom: 16,
//                     fontSize: 12
//                   }}>
//                     <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Transporter</div>
//                     <div>{transport.transporterName}</div>
//                     <div style={{ color: '#666' }}>{transport.transporterMobile}</div>
//                     {order.transporterTaluk && (
//                       <div style={{ fontSize: 11, color: '#0369a1', marginTop: 4 }}>
//                         Taluk: {order.transporterTaluk}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Key Details */}
//                 {hasKey ? (
//                   <div style={{ 
//                     background: '#f0f9ff', 
//                     padding: 12, 
//                     borderRadius: 8,
//                     marginBottom: 16,
//                     fontSize: 12
//                   }}>
//                     <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Pickup Key:</div>
//                     <div style={{ 
//                       fontFamily: 'monospace', 
//                       background: '#ffffff', 
//                       padding: '8px', 
//                       borderRadius: 4,
//                       fontSize: 11,
//                       wordBreak: 'break-all',
//                       marginBottom: 8
//                     }}>
//                       {transport.adminGeneratedKey}
//                     </div>
//                     <div style={{ 
//                       display: 'flex', 
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <span style={{ 
//                         color: keyUsed ? '#4caf50' : '#ff9800',
//                         fontWeight: 'bold',
//                         fontSize: 11
//                       }}>
//                         {keyUsed ? '✅ USED' : '⏳ PENDING'}
//                       </span>
//                       {keyUsed && (
//                         <span style={{ fontSize: 10, color: '#666' }}>
//                           {formatDate(transport.pickupKeyEnteredAt)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ) : isAccepted ? (
//                   <div style={{ 
//                     background: '#ffebee', 
//                     padding: 12, 
//                     borderRadius: 8,
//                     marginBottom: 16,
//                     color: '#d32f2f',
//                     fontSize: 12,
//                     textAlign: 'center'
//                   }}>
//                     ⚠️ Need to generate key
//                   </div>
//                 ) : null}

//                 {/* Action Buttons */}
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   {isAccepted && !hasKey && (
//                     <>
//                       <button
//                         onClick={() => assignTransporter(order)}
//                         style={{
//                           padding: '12px',
//                           background: '#4caf50',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: 6,
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           fontSize: 14
//                         }}
//                       >
//                         🔑 Generate Pickup Key
//                       </button>
                      
//                       <textarea
//                         value={adminNotes}
//                         onChange={(e) => setAdminNotes(e.target.value)}
//                         placeholder="Admin notes (optional)"
//                         rows={2}
//                         style={{
//                           width: '100%',
//                           padding: 8,
//                           border: '1px solid #ddd',
//                           borderRadius: 4,
//                           resize: 'vertical',
//                           fontSize: 12
//                         }}
//                       />
//                     </>
//                   )}

//                   {hasKey && !keyUsed && (
//                     <button
//                       onClick={() => expireKey(order.orderId)}
//                       style={{
//                         padding: '12px',
//                         background: '#f44336',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: 6,
//                         cursor: 'pointer',
//                         fontWeight: 'bold',
//                         fontSize: 14
//                       }}
//                     >
//                       Expire Key
//                     </button>
//                   )}

//                   <button
//                     onClick={() => viewOrderDetails(order)}
//                     style={{
//                       padding: '12px',
//                       background: '#3b82f6',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: 6,
//                       cursor: 'pointer',
//                       fontWeight: 'bold',
//                       fontSize: 14
//                     }}
//                   >
//                     View Full Details
//                   </button>

//                   {isCompleted && (
//                     <button
//                       disabled
//                       style={{
//                         padding: '12px',
//                         background: '#4caf50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: 6,
//                         fontWeight: 'bold',
//                         fontSize: 14,
//                         opacity: 0.8
//                       }}
//                     >
//                       ✅ Journey Completed
//                     </button>
//                   )}

//                   {isPending && (
//                     <button
//                       disabled
//                       style={{
//                         padding: '12px',
//                         background: '#9e9e9e',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: 6,
//                         fontWeight: 'bold',
//                         fontSize: 14,
//                         opacity: 0.8
//                       }}
//                     >
//                       ⏳ Waiting for Transporter
//                     </button>
//                   )}

//                   {isInProgress && (
//                     <button
//                       disabled
//                       style={{
//                         padding: '12px',
//                         background: '#2196f3',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: 6,
//                         fontWeight: 'bold',
//                         fontSize: 14,
//                         opacity: 0.8
//                       }}
//                     >
//                       🚚 In Transit
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         // Desktop Table View
//         <div style={{ overflowX: 'auto', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', marginTop: 16 }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: '#f5f5f5' }}>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Order ID</th>
//                 {/* <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Taluks</th> */}
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Pickup Location</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Delivery Location</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Items Count</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Transporter Info</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Status</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Key Details</th>
//                 <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => {
//                 const transport = order.marketToTraderTransport;
//                 const isPending = !transport || transport.status === 'pending';
//                 const isAccepted = transport?.status === 'accepted';
//                 const isInProgress = transport?.status === 'in_progress';
//                 const isCompleted = transport?.status === 'completed';
//                 const hasKey = !!transport?.adminGeneratedKey;
//                 const keyUsed = !!transport?.pickupKeyEnteredAt;
//                 const itemsCount = order.productItems?.length || 0;
//                 const traderTaluk = order.traderDetails?.location?.taluk;
//                 const marketTaluk = order.pickupMarket?.taluk;
//                 const transporterTaluk = order.transporterTaluk;

//                 return (
//                   <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
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
//                           fontSize: '12px'
//                         }}
//                       >
//                         View Details
//                       </button>
//                     </td>
// {/*                     
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       <div style={{ fontSize: '12px', color: '#666' }}>
//                         <div style={{ marginBottom: 4 }}>
//                           <strong>Trader:</strong> {traderTaluk || 'N/A'}
//                         </div>
//                         <div style={{ marginBottom: 4 }}>
//                           <strong>Market:</strong> {marketTaluk || 'N/A'}
//                         </div>
//                         {transporterTaluk && (
//                           <div>
//                             <strong>Transporter:</strong> {transporterTaluk}
//                           </div>
//                         )}
//                       </div>
//                     </td> */}
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       {order.pickupMarket ? (
//                         <div>
//                           <div><strong>{order.pickupMarket.marketName}</strong></div>
//                           <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
//                             {order.pickupMarket.district && `${order.pickupMarket.district}`}
//                             {order.pickupMarket.taluk && `, ${order.pickupMarket.taluk}`}
//                           </div>
//                         </div>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>Not specified</div>
//                       )}
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       <div>
//                         <div><strong>{order.traderDetails?.traderName || order.traderName}</strong></div>
//                         <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
//                           {order.traderDetails?.location?.district && `${order.traderDetails.location.district}`}
//                           {order.traderDetails?.location?.taluk && `, ${order.traderDetails.location.taluk}`}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e40af' }}>
//                           {itemsCount}
//                         </div>
//                         <div style={{ fontSize: '12px', color: '#666' }}>
//                           {itemsCount === 1 ? 'item' : 'items'}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       {transport?.transporterName ? (
//                         <>
//                           <div><strong>{transport.transporterName}</strong></div>
//                           <div style={{ fontSize: '12px', color: '#666' }}>
//                             {transport.transporterMobile}
//                           </div>
//                           {transporterTaluk && (
//                             <div style={{ fontSize: '11px', color: '#0369a1', marginTop: 4 }}>
//                               Taluk: {transporterTaluk}
//                             </div>
//                           )}
//                         </>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic' }}>No transporter assigned</div>
//                       )}
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       <span style={{
//                         padding: '6px 12px',
//                         background: getStatusColor(transport?.status),
//                         color: 'white',
//                         borderRadius: 4,
//                         fontSize: '12px',
//                         fontWeight: 'bold',
//                         display: 'inline-block'
//                       }}>
//                         {transport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                       </span>
                      
//                       {isAccepted && transport?.transporterName && (
//                         <div style={{ marginTop: 8, padding: 8, background: '#e3f2fd', borderRadius: 4, fontSize: '12px' }}>
//                           ⚡ ACTION REQUIRED
//                         </div>
//                       )}
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
//                       {hasKey ? (
//                         <div>
//                           <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '12px' }}>
//                             Pickup Key:
//                           </div>
//                           <div style={{ 
//                             fontFamily: 'monospace', 
//                             background: '#f5f5f5', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: '12px',
//                             wordBreak: 'break-all'
//                           }}>
//                             {transport.adminGeneratedKey}
//                           </div>
//                           <div style={{ marginTop: 8, fontSize: '12px' }}>
//                             <span style={{ color: keyUsed ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
//                               {keyUsed ? '✅ USED' : '⏳ PENDING'}
//                             </span>
//                           </div>
//                           {keyUsed && (
//                             <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
//                               Used: {formatDate(transport.pickupKeyEnteredAt)}
//                             </div>
//                           )}
//                         </div>
//                       ) : isAccepted ? (
//                         <div style={{ padding: 8, background: '#ffebee', borderRadius: 4, color: '#d32f2f', fontSize: '12px' }}>
//                           ⚠️ Need key
//                         </div>
//                       ) : (
//                         <div style={{ color: '#999', fontStyle: 'italic', fontSize: '12px' }}>N/A</div>
//                       )}
//                     </td>
                    
//                     <td style={{ padding: 16, verticalAlign: 'top' }}>
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
//                                 fontSize: '12px',
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
//                                 fontSize: '12px'
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
//                               fontSize: '12px',
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
//                               fontSize: '12px',
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
//                               fontSize: '12px',
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
//                               fontSize: '12px',
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

//           {/* Details Modal (responsive version) */}
//      {showDetailsModal && selectedOrderDetails && (
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
//           padding: isMobile ? 12 : 24
//         }}>
//           <div style={{
//             background: 'white',
//             padding: isMobile ? 16 : 32,
//             borderRadius: 12,
//             width: '100%',
//             maxWidth: isMobile ? '100%' : 900,
//             maxHeight: '90vh',
//             overflowY: 'auto',
//             position: 'relative'
//           }}>
//             <button
//               onClick={() => {
//                 setShowDetailsModal(false);
//                 setTransporterDetails(null);
//               }}
//               style={{
//                 position: 'absolute',
//                 top: isMobile ? 12 : 20,
//                 right: isMobile ? 12 : 20,
//                 background: 'none',
//                 border: 'none',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 color: '#666',
//                 zIndex: 1001
//               }}
//             >
//               ✕
//             </button>
            
//             <h2 style={{ 
//               margin: '0 0 24px 0', 
//               color: '#333',
//               fontSize: isMobile ? '18px' : '24px',
//               paddingRight: 32
//             }}>
//               Order Details: {selectedOrderDetails.orderId}
//             </h2>

//             {/* Mobile-optimized details layout */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//               {/* Order Summary Card - Updated with Transporter Charge */}
//               <div style={{ 
//                 background: '#f8fafc', 
//                 padding: 16, 
//                 borderRadius: 8,
//                 border: '1px solid #e2e8f0'
//               }}>
//                 <div style={{ 
//                   display: 'grid', 
//                   gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', 
//                   gap: 12 
//                 }}>
//                   <div>
//                     <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Status</div>
//                     <div style={{ 
//                       display: 'inline-block',
//                       padding: '4px 8px',
//                       background: getStatusColor(selectedOrderDetails.marketToTraderTransport?.status),
//                       color: 'white',
//                       borderRadius: 4,
//                       fontSize: 12,
//                       fontWeight: 'bold'
//                     }}>
//                       {selectedOrderDetails.marketToTraderTransport?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                     </div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Items</div>
//                     <div style={{ fontSize: 16, fontWeight: 'bold' }}>
//                       {selectedOrderDetails.productItems?.length || 0}
//                     </div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Distance</div>
//                     <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1e40af' }}>
//                       {randomDistance} km
//                     </div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Transporter</div>
//                     <div style={{ fontSize: 14, fontWeight: 'bold' }}>
//                       {selectedOrderDetails.marketToTraderTransport?.transporterName || 'Not assigned'}
//                     </div>
//                   </div>
//                   {/* Transporter Charge Calculation */}
//                   <div>
//                     <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Transporter Charge</div>
//                     <div style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>
//                       {calculateTransporterCharge()}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Charge Calculation Details - Only show if we have vehicle data */}
//               {getTransporterVehicleType() && (
//                 <div style={{ 
//                   background: '#ecfdf5', 
//                   padding: 16, 
//                   borderRadius: 8,
//                   border: '1px solid #a7f3d0'
//                 }}>
//                   <h3 style={{ 
//                     margin: '0 0 12px 0', 
//                     color: '#065f46',
//                     fontSize: isMobile ? 14 : 16
//                   }}>
//                     💰 Transporter Charge Calculation
//                   </h3>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                     <div style={{ 
//                       display: 'grid', 
//                       gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
//                       gap: 12 
//                     }}>
//                       <div>
//                         <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Vehicle Type</div>
//                         <div style={{ fontSize: 14, fontWeight: 'bold' }}>
//                           {getTransporterVehicleTypeDisplay()}
//                         </div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Price per KM</div>
//                         <div style={{ fontSize: 14, fontWeight: 'bold' }}>
//                           {getVehiclePricePerKm()}
//                         </div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: 12, color: '#047857', marginBottom: 4 }}>Distance</div>
//                         <div style={{ fontSize: 14, fontWeight: 'bold' }}>
//                           {randomDistance} km
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{ 
//                       display: 'flex', 
//                       alignItems: 'center', 
//                       justifyContent: 'space-between',
//                       padding: '12px 16px',
//                       background: '#d1fae5',
//                       borderRadius: 6,
//                       marginTop: 8
//                     }}>
//                       <div style={{ fontSize: 14, fontWeight: 'bold', color: '#065f46' }}>
//                         Calculation:
//                       </div>
//                       <div style={{ fontSize: 16, fontWeight: 'bold', color: '#065f46' }}>
//                         {randomDistance} km × {getVehiclePricePerKm()} = {calculateTransporterCharge()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Pickup & Delivery Cards - Stacked on mobile */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                 {/* Pickup Card */}
//                 <div style={{ 
//                   background: '#f9fafb', 
//                   padding: 16, 
//                   borderRadius: 8,
//                   border: '1px solid #e5e7eb'
//                 }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 8, 
//                     marginBottom: 12,
//                     color: '#1e40af'
//                   }}>
//                     <div style={{ fontSize: 18 }}>📍</div>
//                     <h3 style={{ margin: 0, fontSize: 16 }}>Pickup Location</h3>
//                   </div>
                  
//                   {selectedOrderDetails.pickupMarket ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                       <div>
//                         <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937' }}>
//                           {selectedOrderDetails.pickupMarket.marketName}
//                         </div>
//                         <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
//                           {selectedOrderDetails.pickupMarket.exactAddress}
//                         </div>
//                       </div>
                      
//                       <div style={{ 
//                         display: 'flex', 
//                         flexWrap: 'wrap', 
//                         gap: 6 
//                       }}>
//                         {selectedOrderDetails.pickupMarket.district && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#1e40af'
//                           }}>
//                             {selectedOrderDetails.pickupMarket.district}
//                           </span>
//                         )}
//                         {selectedOrderDetails.pickupMarket.state && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#1e40af'
//                           }}>
//                             {selectedOrderDetails.pickupMarket.state}
//                           </span>
//                         )}
//                         {selectedOrderDetails.pickupMarket.pincode && (
//                           <span style={{ 
//                             background: '#dbeafe', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#1e40af'
//                           }}>
//                             Pincode: {selectedOrderDetails.pickupMarket.pincode}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div style={{ color: '#999', fontStyle: 'italic' }}>Pickup location not specified</div>
//                   )}
//                 </div>

//                 {/* Delivery Card */}
//                 <div style={{ 
//                   background: '#f0f9ff', 
//                   padding: 16, 
//                   borderRadius: 8,
//                   border: '1px solid #bae6fd'
//                 }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 8, 
//                     marginBottom: 12,
//                     color: '#0369a1'
//                   }}>
//                     <div style={{ fontSize: 18 }}>🏠</div>
//                     <h3 style={{ margin: 0, fontSize: 16 }}>Delivery Location</h3>
//                   </div>
                  
//                   {selectedOrderDetails.traderDetails ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                       <div>
//                         <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937' }}>
//                           {selectedOrderDetails.traderDetails.traderName}
//                         </div>
//                         <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
//                           📱 {selectedOrderDetails.traderDetails.traderMobile}
//                         </div>
//                       </div>
                      
//                       <div style={{ fontSize: 12, color: '#374151' }}>
//                         {selectedOrderDetails.traderDetails.location.address}
//                       </div>
                      
//                       <div style={{ 
//                         display: 'flex', 
//                         flexWrap: 'wrap', 
//                         gap: 6 
//                       }}>
//                         {selectedOrderDetails.traderDetails.location.district && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#0369a1'
//                           }}>
//                             {selectedOrderDetails.traderDetails.location.district}
//                           </span>
//                         )}
//                         {selectedOrderDetails.traderDetails.location.state && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#0369a1'
//                           }}>
//                             {selectedOrderDetails.traderDetails.location.state}
//                           </span>
//                         )}
//                         {selectedOrderDetails.traderDetails.location.pincode && (
//                           <span style={{ 
//                             background: '#bae6fd', 
//                             padding: '4px 8px', 
//                             borderRadius: 4,
//                             fontSize: 11,
//                             color: '#0369a1'
//                           }}>
//                             Pincode: {selectedOrderDetails.traderDetails.location.pincode}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div style={{ color: '#999', fontStyle: 'italic' }}>Trader details not available</div>
//                   )}
//                 </div>
//               </div>

//               {/* Transporter Details Section */}
//               {selectedOrderDetails.marketToTraderTransport?.transporterId && (
//                 <div style={{ 
//                   background: '#fefce8', 
//                   padding: 16, 
//                   borderRadius: 8,
//                   border: '1px solid #fef08a'
//                 }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 8, 
//                     marginBottom: 16,
//                     color: '#854d0e'
//                   }}>
//                     <div style={{ fontSize: 18 }}>🚚</div>
//                     <h3 style={{ margin: 0, fontSize: 16 }}>Transporter Details</h3>
//                   </div>

//                   {loadingTransporter ? (
//                     <div style={{ textAlign: 'center', padding: 20 }}>
//                       <div style={{ fontSize: 14, color: '#666' }}>Loading transporter details...</div>
//                     </div>
//                   ) : transporterDetails ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//                       {/* Personal Information */}
//                       <div>
//                         <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Personal Information</h4>
//                         <div style={{ 
//                           display: 'grid', 
//                           gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
//                           gap: 12 
//                         }}>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Name</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.personalInfo.name}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Mobile</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.personalInfo.mobileNo}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</div>
//                             <div style={{ fontSize: 14 }}>{transporterDetails.personalInfo.email || 'N/A'}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Address</div>
//                             <div style={{ fontSize: 14 }}>{transporterDetails.personalInfo.address}</div>
//                           </div>
//                         </div>
//                         <div style={{ 
//                           display: 'grid', 
//                           gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
//                           gap: 12,
//                           marginTop: 12
//                         }}>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>District</div>
//                             <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.district}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>State</div>
//                             <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.state}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Pincode</div>
//                             <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.pincode}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Taluk</div>
//                             <div style={{ fontSize: 13 }}>{transporterDetails.personalInfo.taluk}</div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Bank Details */}
//                       <div>
//                         <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Bank Details</h4>
//                         <div style={{ 
//                           display: 'grid', 
//                           gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
//                           gap: 12 
//                         }}>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Account Holder</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.bankDetails.accountHolderName}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Bank Name</div>
//                             <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.bankName}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Account Number</div>
//                             <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.accountNumber}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>IFSC Code</div>
//                             <div style={{ fontSize: 14 }}>{transporterDetails.bankDetails.ifscCode}</div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Transport Information */}
//                       <div>
//                         <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: 14 }}>Transport Information</h4>
                        
//                         {/* Vehicle Count and Rating */}
//                         <div style={{ 
//                           display: 'grid', 
//                           gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
//                           gap: 12,
//                           marginBottom: 16
//                         }}>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Vehicles</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.transportInfo.vehicles?.length || 0}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Rating</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold', color: '#f59e0b' }}>⭐ {transporterDetails.rating.toFixed(1)}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Trips</div>
//                             <div style={{ fontSize: 14, fontWeight: 'bold' }}>{transporterDetails.totalTrips}</div>
//                           </div>
//                           <div>
//                             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Registered On</div>
//                             <div style={{ fontSize: 13 }}>{formatDate(transporterDetails.registeredAt)}</div>
//                           </div>
//                         </div>

//                         {/* Primary Vehicle Info */}
//                         {transporterDetails.transportInfo.vehicles && transporterDetails.transportInfo.vehicles.length > 0 && (
//                           <div>
//                             <h5 style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: 13 }}>Primary Vehicle</h5>
//                             {transporterDetails.transportInfo.vehicles.map((vehicle, index) => {
//                               const matchedVehicle = findVehiclePrice(vehicle.vehicleType);
//                               return (
//                                 <div key={index} style={{ 
//                                   background: '#f9fafb', 
//                                   padding: 12, 
//                                   borderRadius: 6,
//                                   marginBottom: 8,
//                                   border: '1px solid #e5e7eb'
//                                 }}>
//                                   <div style={{ 
//                                     display: 'flex', 
//                                     justifyContent: 'space-between',
//                                     alignItems: 'flex-start',
//                                     marginBottom: 8
//                                   }}>
//                                     <div>
//                                       <div style={{ fontSize: 13, fontWeight: 'bold' }}>
//                                         {vehicle.vehicleType} - {vehicle.vehicleNumber}
//                                       </div>
//                                       <div style={{ fontSize: 11, color: '#6b7280' }}>
//                                         Capacity: {vehicle.vehicleCapacity.value} {vehicle.vehicleCapacity.unit}
//                                       </div>
//                                       {/* Display Price per KM for this vehicle */}
//                                       <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>
//                                         <strong>Price per KM:</strong> {matchedVehicle ? `₹${matchedVehicle.pricePerKm.toFixed(2)}` : 'N/A'}
//                                       </div>
//                                     </div>
//                                     {vehicle.primaryVehicle && (
//                                       <span style={{ 
//                                         background: '#10b981', 
//                                         color: 'white',
//                                         padding: '2px 8px',
//                                         borderRadius: 4,
//                                         fontSize: 10,
//                                         fontWeight: 'bold'
//                                       }}>
//                                         Primary
//                                       </span>
//                                     )}
//                                   </div>
//                                   {vehicle.driverInfo && (
//                                     <div style={{ 
//                                       display: 'grid', 
//                                       gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
//                                       gap: 8,
//                                       marginTop: 8,
//                                       paddingTop: 8,
//                                       borderTop: '1px dashed #e5e7eb'
//                                     }}>
//                                       <div>
//                                         <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Name</div>
//                                         <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverName}</div>
//                                       </div>
//                                       <div>
//                                         <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Mobile</div>
//                                         <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverMobileNo}</div>
//                                       </div>
//                                       <div>
//                                         <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Age</div>
//                                         <div style={{ fontSize: 12 }}>{vehicle.driverInfo.driverAge}</div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )}

//                         {/* For backward compatibility - show single vehicle info if no vehicles array */}
//                         {(!transporterDetails.transportInfo.vehicles || transporterDetails.transportInfo.vehicles.length === 0) && 
//                           transporterDetails.transportInfo.vehicleNumber && (
//                           <div style={{ 
//                             background: '#f9fafb', 
//                             padding: 12, 
//                             borderRadius: 6,
//                             border: '1px solid #e5e7eb'
//                           }}>
//                             <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>
//                               {transporterDetails.transportInfo.vehicleType} - {transporterDetails.transportInfo.vehicleNumber}
//                             </div>
//                             {transporterDetails.transportInfo.vehicleCapacity && (
//                               <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
//                                 Capacity: {transporterDetails.transportInfo.vehicleCapacity.value} {transporterDetails.transportInfo.vehicleCapacity.unit}
//                               </div>
//                             )}
//                             {/* Display Price per KM for this vehicle */}
//                             <div style={{ fontSize: 11, color: '#059669', marginBottom: 4 }}>
//                               <strong>Price per KM:</strong> {findVehiclePrice(transporterDetails.transportInfo.vehicleType || '') ? 
//                                 `₹${findVehiclePrice(transporterDetails.transportInfo.vehicleType || '')?.pricePerKm.toFixed(2)}` : 'N/A'}
//                             </div>
//                             {transporterDetails.transportInfo.driverInfo && (
//                               <div style={{ 
//                                 display: 'grid', 
//                                 gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
//                                 gap: 8,
//                                 marginTop: 8,
//                                 paddingTop: 8,
//                                 borderTop: '1px dashed #e5e7eb'
//                               }}>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Name</div>
//                                   <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverName}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Mobile</div>
//                                   <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverMobileNo}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Driver Age</div>
//                                   <div style={{ fontSize: 12 }}>{transporterDetails.transportInfo.driverInfo.driverAge}</div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
//                       <div style={{ fontSize: 14 }}>Transporter details not available</div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Product Items */}
//               <div>
//                 <h3 style={{ 
//                   color: '#374151', 
//                   marginBottom: 16,
//                   fontSize: isMobile ? 16 : 18
//                 }}>
//                   📦 Product Items ({selectedOrderDetails.productItems?.length || 0})
//                 </h3>
                
//                 {selectedOrderDetails.productItems && selectedOrderDetails.productItems.length > 0 ? (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                     {selectedOrderDetails.productItems.map((item, idx) => {
//                       const productDetails = getProductDetails(item.productId, item.grade);
                      
//                       return (
//                         <div key={idx} style={{ 
//                           background: '#ffffff', 
//                           padding: 16, 
//                           borderRadius: 8,
//                           border: '1px solid #e5e7eb'
//                         }}>
//                           {/* Product Header */}
//                           <div style={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between',
//                             alignItems: 'flex-start',
//                             marginBottom: 12
//                           }}>
//                             <div>
//                               <div style={{ 
//                                 fontWeight: 'bold', 
//                                 color: '#1f2937',
//                                 fontSize: 14
//                               }}>
//                                 {productNames[item.productId] || "Product"}
//                               </div>
//                               <div style={{ fontSize: 11, color: '#6b7280' }}>
//                                 ID: {item.productId}
//                               </div>
//                             </div>
//                             <div style={{ 
//                               display: 'flex', 
//                               flexDirection: 'column',
//                               alignItems: 'flex-end',
//                               gap: 4
//                             }}>
//                               <span style={{ 
//                                 background: '#dbeafe', 
//                                 padding: '3px 8px', 
//                                 borderRadius: 4, 
//                                 fontSize: 11,
//                                 fontWeight: 600,
//                                 color: '#1e40af'
//                               }}>
//                                 Grade: {item.grade}
//                               </span>
//                               <span style={{ 
//                                 background: '#dcfce7', 
//                                 padding: '3px 8px', 
//                                 borderRadius: 4, 
//                                 fontSize: 11,
//                                 fontWeight: 600,
//                                 color: '#166534'
//                               }}>
//                                 Qty: {item.quantity}
//                               </span>
//                             </div>
//                           </div>

//                           {productDetails ? (
//                             <div>
//                               {/* Product Type */}
//                               <div style={{ marginBottom: 12 }}>
//                                 <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>
//                                   Product Type
//                                 </div>
//                                 <div style={{ fontWeight: 'bold', fontSize: 13 }}>
//                                   {getSubCategoryNameForProduct(productDetails)}
//                                 </div>
//                               </div>

//                               {/* Description */}
//                               {productDetails.cropBriefDetails && (
//                                 <div style={{ marginBottom: 12 }}>
//                                   <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>
//                                     Description
//                                   </div>
//                                   <div style={{ 
//                                     fontSize: 12, 
//                                     color: '#374151',
//                                     lineHeight: 1.4
//                                   }}>
//                                     {productDetails.cropBriefDetails}
//                                   </div>
//                                 </div>
//                               )}

//                               {/* Quick Details */}
//                               <div style={{ 
//                                 display: 'grid', 
//                                 gridTemplateColumns: 'repeat(2, 1fr)', 
//                                 gap: 8,
//                                 marginBottom: 12
//                               }}>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Farming Type</div>
//                                   <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                     {productDetails.farmingType || "N/A"}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Seeds Type</div>
//                                   <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                     {productDetails.typeOfSeeds || "N/A"}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Packaging</div>
//                                   <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                     {productDetails.packagingType || "N/A"}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div style={{ fontSize: 11, color: '#6b7280' }}>Unit</div>
//                                   <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                     {productDetails.unitMeasurement || "N/A"}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Price Info */}
//                               {productDetails.selectedGrade && (
//                                 <div style={{ 
//                                   background: '#f0f9ff', 
//                                   padding: 12, 
//                                   borderRadius: 6,
//                                   marginBottom: 12
//                                 }}>
//                                   <div style={{ 
//                                     display: 'flex', 
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center',
//                                     marginBottom: 8
//                                   }}>
//                                     <div style={{ fontSize: 12, fontWeight: 'bold', color: '#0369a1' }}>
//                                       Price Details
//                                     </div>
//                                     <div style={{ 
//                                       fontWeight: 'bold', 
//                                       fontSize: 16,
//                                       color: '#0369a1'
//                                     }}>
//                                       ₹{productDetails.selectedGrade.pricePerUnit}/unit
//                                     </div>
//                                   </div>
//                                   <div style={{ 
//                                     display: 'grid', 
//                                     gridTemplateColumns: 'repeat(2, 1fr)', 
//                                     gap: 8 
//                                   }}>
//                                     <div>
//                                       <div style={{ fontSize: 11, color: '#6b7280' }}>Available Qty</div>
//                                       <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                         {productDetails.selectedGrade.totalQty}
//                                       </div>
//                                     </div>
//                                     <div>
//                                       <div style={{ fontSize: 11, color: '#6b7280' }}>Quantity Type</div>
//                                       <div style={{ fontSize: 12, fontWeight: 'bold' }}>
//                                         {productDetails.selectedGrade.quantityType || "N/A"}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div style={{ 
//                               padding: 12, 
//                               textAlign: 'center', 
//                               color: '#999',
//                               background: '#f9fafb',
//                               borderRadius: 6
//                             }}>
//                               <div style={{ fontSize: 12 }}>Product details not available</div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div style={{ 
//                     padding: 20, 
//                     textAlign: 'center', 
//                     background: '#f5f5f5', 
//                     borderRadius: 8,
//                     color: '#666',
//                     fontSize: 14
//                   }}>
//                     No product items found for this order
//                   </div>
//                 )}
//               </div>

//               {/* Close Button */}
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center',
//                 marginTop: 8,
//                 paddingTop: 16,
//                 borderTop: '1px solid #e5e7eb'
//               }}>
//                 <button
//                   onClick={() => {
//                     setShowDetailsModal(false);
//                     setTransporterDetails(null);
//                   }}
//                   style={{
//                     padding: '12px 32px',
//                     background: '#3b82f6',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: 6,
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                     fontSize: 14,
//                     width: isMobile ? '100%' : 'auto'
//                   }}
//                 >
//                   Close Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Generated Key Modal (responsive) */}
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
//           zIndex: 1001,
//           padding: isMobile ? 16 : 24
//         }}>
//           <div style={{
//             background: 'white',
//             padding: isMobile ? 20 : 32,
//             borderRadius: 12,
//             width: '100%',
//             maxWidth: 500,
//             textAlign: 'center'
//           }}>
//             <h2 style={{ 
//               marginTop: 0, 
//               color: '#4caf50',
//               fontSize: isMobile ? 18 : 20 
//             }}>
//               ✅ Pickup Key Generated!
//             </h2>
            
//             <div style={{ 
//               margin: '20px 0',
//               padding: 16,
//               background: '#f5f5f5',
//               borderRadius: 8,
//               fontFamily: 'monospace',
//               fontSize: isMobile ? 14 : 18,
//               fontWeight: 'bold',
//               wordBreak: 'break-all'
//             }}>
//               {generatedKey}
//             </div>
            
//             <p style={{ 
//               marginBottom: 16, 
//               color: '#666',
//               fontSize: isMobile ? 13 : 14 
//             }}>
//               This key has been sent to transporter:
//             </p>
            
//             {selectedOrder.marketToTraderTransport && (
//               <div style={{ 
//                 marginBottom: 20, 
//                 padding: 12, 
//                 background: '#e3f2fd', 
//                 borderRadius: 6,
//                 fontSize: isMobile ? 12 : 13
//               }}>
//                 <strong>Transporter:</strong> {selectedOrder.marketToTraderTransport.transporterName}<br />
//                 <strong>Mobile:</strong> {selectedOrder.marketToTraderTransport.transporterMobile}
//               </div>
//             )}
            
//             <div style={{ 
//               display: 'flex', 
//               flexDirection: isMobile ? 'column' : 'row',
//               gap: 12, 
//               justifyContent: 'center' 
//             }}>
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
//                   fontSize: isMobile ? 14 : 15,
//                   flex: isMobile ? 1 : 'none'
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
//                   fontSize: isMobile ? 14 : 15,
//                   flex: isMobile ? 1 : 'none'
//                 }}
//               >
//                 Close
//               </button>
//             </div>
            
//             <div style={{ 
//               marginTop: 20, 
//               padding: 12, 
//               background: '#fff3cd', 
//               borderRadius: 6,
//               fontSize: isMobile ? 12 : 13,
//               color: '#856404'
//             }}>
//               <strong>Note:</strong> Transporter will use this key to start their journey.
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Admin Instructions (responsive) */}
//       <div style={{ 
//         marginTop: 32, 
//         padding: isMobile ? 16 : 20, 
//         background: '#f0f7ff', 
//         borderRadius: 8,
//         border: '1px solid #bbdefb'
//       }}>
//         <h3 style={{ 
//           marginTop: 0, 
//           color: '#1976d2',
//           fontSize: isMobile ? 16 : 18 
//         }}>
//           📋 Admin Workflow
//         </h3>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 24, 
//               height: 24, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 12,
//               flexShrink: 0
//             }}>1</div>
//             <div>
//               <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Order appears</strong> when transporter accepts it</div>
//               <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Status changes to "accepted"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 24, 
//               height: 24, 
//               borderRadius: '50%', 
//               background: '#1976d2', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 12,
//               flexShrink: 0
//             }}>2</div>
//             <div>
//               <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Generate pickup key</strong> for transporter</div>
//               <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Key appears on transporter's screen</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 24, 
//               height: 24, 
//               borderRadius: '50%', 
//               background: '#ff9800', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 12,
//               flexShrink: 0
//             }}>3</div>
//             <div>
//               <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Transporter enters key</strong> to start journey</div>
//               <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Status changes to "in_progress"</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 24, 
//               height: 24, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 12,
//               flexShrink: 0
//             }}>4</div>
//             <div>
//               <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Trader generates delivery key</strong></div>
//               <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>When goods are delivered and verified</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//             <div style={{ 
//               width: 24, 
//               height: 24, 
//               borderRadius: '50%', 
//               background: '#4caf50', 
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: 'bold',
//               fontSize: 12,
//               flexShrink: 0
//             }}>5</div>
//             <div>
//               <div style={{ fontSize: isMobile ? 13 : 14 }}><strong>Transporter enters delivery key</strong></div>
//               <div style={{ fontSize: isMobile ? 11 : 12, color: '#666' }}>Journey marked as completed</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMarkettoTrader;














