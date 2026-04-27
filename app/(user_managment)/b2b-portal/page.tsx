// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Users,
//   FileText,
//   Package,
//   ShoppingCart,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Eye,
//   Download,
//   Upload,
//   Plus,
//   Search,
//   Filter,
//   Truck,
//   Check,
//   AlertCircle,
//   Star,
//   MessageCircle,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   DollarSign,
//   TrendingUp,
//   Shield,
//   UserCheck,
//   FileCheck,
//   Send
// } from 'lucide-react';

// // ==================== TYPES ====================
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   businessName: string;
//   gstNumber: string;
//   documentType: 'Aadhar' | 'PAN' | 'GST' | 'Trade License';
//   documentUrl: string;
//   status: 'pending' | 'verified' | 'rejected';
//   submittedDate: string;
//   verifiedDate?: string;
//   rejectionReason?: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   imageUrl: string;
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   userName: string;
//   products: OrderProduct[];
//   totalAmount: number;
//   orderDate: string;
//   status: 'pending' | 'verified' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   shippingAddress: string;
//   trackingId?: string;
//   verifiedBy?: string;
//   verifiedDate?: string;
//   deliveredDate?: string;
// }

// interface OrderProduct {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
// }

// // ==================== SAMPLE DATA ====================
// const sampleUsers: User[] = [
//   {
//     id: '1',
//     name: 'Rajesh Kumar',
//     email: 'rajesh@agroshop.com',
//     phone: '+91 98765 43210',
//     address: '123, Green Field Road, Ludhiana, Punjab',
//     businessName: 'Agro Solutions Pvt Ltd',
//     gstNumber: '03AAACA1234R1ZR',
//     documentType: 'GST',
//     documentUrl: '/documents/gst-certificate.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-10',
//   },
//   {
//     id: '2',
//     name: 'Priya Sharma',
//     email: 'priya@greenfields.com',
//     phone: '+91 87654 32109',
//     address: '45, Farmers Market, Indore, MP',
//     businessName: 'Green Fields Trading Co',
//     gstNumber: '23ABCDE1234F1ZH',
//     documentType: 'PAN',
//     documentUrl: '/documents/pan-card.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-12',
//   },
//   {
//     id: '3',
//     name: 'Amit Patel',
//     email: 'amit@harvestfresh.com',
//     phone: '+91 76543 21098',
//     address: '78, Agri Complex, Ahmedabad, Gujarat',
//     businessName: 'Harvest Fresh Ltd',
//     gstNumber: '24XYZAB5678G1ZM',
//     documentType: 'Trade License',
//     documentUrl: '/documents/trade-license.pdf',
//     status: 'verified',
//     submittedDate: '2024-03-05',
//     verifiedDate: '2024-03-07',
//   },
//   {
//     id: '4',
//     name: 'Sunita Reddy',
//     email: 'sunita@organicmandi.com',
//     phone: '+91 65432 10987',
//     address: '12, Organic Valley, Hyderabad, Telangana',
//     businessName: 'Organic Mandi',
//     gstNumber: '36PQRST5678H1ZN',
//     documentType: 'Aadhar',
//     documentUrl: '/documents/aadhar-card.pdf',
//     status: 'rejected',
//     submittedDate: '2024-03-01',
//     verifiedDate: '2024-03-03',
//     rejectionReason: 'Document is not clearly visible. Please upload a clearer copy.',
//   }
// ];

// const sampleProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Organic Wheat Seeds',
//     price: 1850,
//     category: 'Seeds',
//     stock: 500,
//     description: 'High-yield organic wheat seeds, resistant to pests',
//     imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
//     minOrderQty: 10,
//     unit: 'kg',
//     status: 'active',
//     createdAt: '2024-01-15',
//   },
//   {
//     id: '2',
//     name: 'NPK Fertilizer 50kg',
//     price: 1250,
//     category: 'Fertilizers',
//     stock: 1000,
//     description: 'Balanced NPK 19:19:19 fertilizer for all crops',
//     imageUrl: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=200',
//     minOrderQty: 20,
//     unit: 'bag',
//     status: 'active',
//     createdAt: '2024-01-20',
//   },
//   {
//     id: '3',
//     name: 'Drip Irrigation Kit',
//     price: 3499,
//     category: 'Irrigation',
//     stock: 150,
//     description: 'Complete drip irrigation system for 1 acre',
//     imageUrl: 'https://images.unsplash.com/photo-1626808642875-0aa61e311a10?w=200',
//     minOrderQty: 1,
//     unit: 'set',
//     status: 'active',
//     createdAt: '2024-02-01',
//   },
//   {
//     id: '4',
//     name: 'Garden Hoe Tool',
//     price: 350,
//     category: 'Tools',
//     stock: 250,
//     description: 'Heavy duty garden hoe for weeding',
//     imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7a48?w=200',
//     minOrderQty: 5,
//     unit: 'piece',
//     status: 'inactive',
//     createdAt: '2024-02-10',
//   }
// ];

// const sampleOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     userId: '1',
//     userName: 'Rajesh Kumar',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 50, price: 1850 },
//       { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 20, price: 1250 }
//     ],
//     totalAmount: 117500,
//     orderDate: '2024-03-14',
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
//   },
//   {
//     id: 'ORD-002',
//     userId: '2',
//     userName: 'Priya Sharma',
//     products: [
//       { productId: '3', productName: 'Drip Irrigation Kit', quantity: 2, price: 3499 }
//     ],
//     totalAmount: 6998,
//     orderDate: '2024-03-13',
//     status: 'verified',
//     paymentStatus: 'paid',
//     shippingAddress: '45, Farmers Market, Indore, MP',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-13',
//   },
//   {
//     id: 'ORD-003',
//     userId: '3',
//     userName: 'Amit Patel',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 100, price: 1850 },
//       { productId: '3', productName: 'Drip Irrigation Kit', quantity: 5, price: 3499 }
//     ],
//     totalAmount: 202495,
//     orderDate: '2024-03-12',
//     status: 'processing',
//     paymentStatus: 'paid',
//     shippingAddress: '78, Agri Complex, Ahmedabad, Gujarat',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-12',
//   },
//   {
//     id: 'ORD-004',
//     userId: '1',
//     userName: 'Rajesh Kumar',
//     products: [
//       { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 30, price: 1250 }
//     ],
//     totalAmount: 37500,
//     orderDate: '2024-03-10',
//     status: 'shipped',
//     paymentStatus: 'paid',
//     shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-10',
//     trackingId: 'TRK123456789',
//   },
//   {
//     id: 'ORD-005',
//     userId: '4',
//     userName: 'Sunita Reddy',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 25, price: 1850 }
//     ],
//     totalAmount: 46250,
//     orderDate: '2024-03-08',
//     status: 'delivered',
//     paymentStatus: 'paid',
//     shippingAddress: '12, Organic Valley, Hyderabad, Telangana',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-08',
//     deliveredDate: '2024-03-11',
//   }
// ];

// // ==================== MAIN COMPONENT ====================
// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'verify' | 'products' | 'orders'>('verify');
//   const [users, setUsers] = useState<User[]>(sampleUsers);
//   const [products, setProducts] = useState<Product[]>(sampleProducts);
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setIsLoading(false), 1000);
//   }, []);

//   // Stats calculations
//   const stats = {
//     pendingVerifications: users.filter(u => u.status === 'pending').length,
//     verifiedUsers: users.filter(u => u.status === 'verified').length,
//     totalProducts: products.length,
//     activeProducts: products.filter(p => p.status === 'active').length,
//     pendingOrders: orders.filter(o => o.status === 'pending').length,
//     totalOrders: orders.length,
//     totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-gray-100 text-gray-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || colors.pending;
//   };

//   const handleVerifyUser = (userId: string, status: 'verified' | 'rejected', reason?: string) => {
//     setUsers(users.map(user => 
//       user.id === userId 
//         ? { 
//             ...user, 
//             status, 
//             verifiedDate: new Date().toISOString().split('T')[0],
//             rejectionReason: reason 
//           }
//         : user
//     ));
//     setShowVerifyModal(false);
//     setSelectedUser(null);
//   };

//   const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
//     const newProduct: Product = {
//       ...productData,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString().split('T')[0],
//     };
//     setProducts([newProduct, ...products]);
//     setShowProductModal(false);
//   };

//   const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
//     if (editingProduct) {
//       setProducts(products.map(p => 
//         p.id === editingProduct.id 
//           ? { ...productData, id: editingProduct.id, createdAt: editingProduct.createdAt }
//           : p
//       ));
//       setEditingProduct(null);
//       setShowProductModal(false);
//     }
//   };

//   const handleDeleteProduct = (id: string) => {
//     if (confirm('Are you sure you want to delete this product?')) {
//       setProducts(products.filter(p => p.id !== id));
//     }
//   };

//   const handleVerifyOrder = (orderId: string) => {
//     setOrders(orders.map(order =>
//       order.id === orderId
//         ? {
//             ...order,
//             status: 'verified',
//             verifiedBy: 'Admin',
//             verifiedDate: new Date().toISOString().split('T')[0],
//           }
//         : order
//     ));
//     setShowOrderModal(false);
//   };

//   const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
//     setOrders(orders.map(order =>
//       order.id === orderId
//         ? {
//             ...order,
//             status,
//             ...(status === 'delivered' ? { deliveredDate: new Date().toISOString().split('T')[0] } : {}),
//           }
//         : order
//     ));
//   };

//   const pendingUsers = users.filter(u => u.status === 'pending');
//   const pendingOrdersList = orders.filter(o => o.status === 'pending');

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage verifications, products, and orders</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <span className="text-sm font-medium text-blue-600">Admin Access</span>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//             <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('verify')}>
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-yellow-200 rounded-lg">
//                   <FileText className="w-6 h-6 text-yellow-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</span>
//               </div>
//               <p className="text-sm font-medium text-yellow-800 mt-2">Pending Verifications</p>
//               <p className="text-xs text-yellow-600">Awaiting document review</p>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-green-200 rounded-lg">
//                   <UserCheck className="w-6 h-6 text-green-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-green-900">{stats.verifiedUsers}</span>
//               </div>
//               <p className="text-sm font-medium text-green-800 mt-2">Verified Users</p>
//               <p className="text-xs text-green-600">Approved businesses</p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('orders')}>
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-blue-200 rounded-lg">
//                   <ShoppingCart className="w-6 h-6 text-blue-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</span>
//               </div>
//               <p className="text-sm font-medium text-blue-800 mt-2">Pending Orders</p>
//               <p className="text-xs text-blue-600">Need verification</p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-purple-200 rounded-lg">
//                   <DollarSign className="w-6 h-6 text-purple-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-purple-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
//               </div>
//               <p className="text-sm font-medium text-purple-800 mt-2">Total Revenue</p>
//               <p className="text-xs text-purple-600">From all orders</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 mt-6 border-b">
//             <button
//               onClick={() => setActiveTab('verify')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'verify'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <FileCheck className="w-4 h-4" />
//               <span>Verify Users</span>
//               {stats.pendingVerifications > 0 && (
//                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                   {stats.pendingVerifications}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'products'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Package className="w-4 h-4" />
//               <span>Products</span>
//             </button>
//             <button
//               onClick={() => setActiveTab('orders')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'orders'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Truck className="w-4 h-4" />
//               <span>Orders</span>
//               {stats.pendingOrders > 0 && (
//                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                   {stats.pendingOrders}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="p-6">
//         {/* ==================== VERIFY USERS TAB ==================== */}
//         {activeTab === 'verify' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-800">Document Verification</h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {pendingUsers.map((user) => (
//                 <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{user.businessName}</h3>
//                         <p className="text-sm text-gray-500">Requested by: {user.name}</p>
//                       </div>
//                       <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
//                         <Clock className="w-3 h-3 mr-1" />
//                         Pending
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="p-4 space-y-3">
//                     <div className="flex items-start space-x-3">
//                       <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-600">{user.email}</p>
//                         <p className="text-sm text-gray-600">{user.phone}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-start space-x-3">
//                       <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                       <p className="text-sm text-gray-600">{user.address}</p>
//                     </div>
                    
//                     <div className="flex items-start space-x-3">
//                       <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-700">GST Number:</p>
//                         <p className="text-sm text-gray-600">{user.gstNumber}</p>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-sm font-medium text-gray-700">Uploaded Document: {user.documentType}</span>
//                         <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                           <Download className="w-4 h-4 mr-1" />
//                           View
//                         </button>
//                       </div>
//                       <div className="bg-white border rounded p-2 text-center">
//                         <FileText className="w-12 h-12 text-gray-400 mx-auto" />
//                         <p className="text-xs text-gray-500 mt-1">{user.documentType} Certificate</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-3 pt-2">
//                       <button
//                         onClick={() => {
//                           setSelectedUser(user);
//                           setShowVerifyModal(true);
//                         }}
//                         className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
//                       >
//                         <CheckCircle className="w-4 h-4" />
//                         <span>Verify</span>
//                       </button>
//                       <button
//                         onClick={() => {
//                           const reason = prompt('Please enter rejection reason:');
//                           if (reason) handleVerifyUser(user.id, 'rejected', reason);
//                         }}
//                         className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
//                       >
//                         <XCircle className="w-4 h-4" />
//                         <span>Reject</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {pendingUsers.length === 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                 <FileCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-600 mb-2">All Clear!</h3>
//                 <p className="text-gray-400">No pending verifications at the moment</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ==================== PRODUCTS TAB ==================== */}
//         {activeTab === 'products' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
//               <button
//                 onClick={() => {
//                   setEditingProduct(null);
//                   setShowProductModal(true);
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add New Product</span>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => (
//                 <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
//                   <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
//                   <div className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-semibold text-gray-800">{product.name}</h3>
//                       <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {product.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                     <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//                     <div className="flex justify-between items-center mb-3">
//                       <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
//                       <span className="text-xs text-gray-500">Min: {product.minOrderQty} {product.unit}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <div className="text-sm">
//                         <span className="text-gray-500">Stock: </span>
//                         <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-900'}>
//                           {product.stock} {product.unit}s
//                         </span>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => {
//                             setEditingProduct(product);
//                             setShowProductModal(true);
//                           }}
//                           className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProduct(product.id)}
//                           className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ==================== ORDERS TAB ==================== */}
//         {activeTab === 'orders' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search orders..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               {orders.map((order) => (
//                 <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <div className="flex items-center space-x-3 mb-2">
//                         <span className="font-semibold text-gray-800">Order #{order.id}</span>
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                           {order.status.toUpperCase()}
//                         </span>
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
//                           {order.paymentStatus.toUpperCase()}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600">Customer: {order.userName}</p>
//                       <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
//                       {order.trackingId && (
//                         <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="border-t pt-4 mb-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
//                     <div className="space-y-2">
//                       {order.products.map((product, idx) => (
//                         <div key={idx} className="flex justify-between text-sm">
//                           <span>{product.productName} x {product.quantity}</span>
//                           <span className="font-medium">₹{(product.price * product.quantity).toLocaleString()}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="border-t pt-4">
//                     <div className="flex justify-between items-center">
//                       <div className="text-sm text-gray-600">
//                         <p>Shipping to: {order.shippingAddress}</p>
//                         {order.verifiedBy && (
//                           <p className="text-xs text-green-600 mt-1">✓ Verified by {order.verifiedBy} on {order.verifiedDate}</p>
//                         )}
//                         {order.deliveredDate && (
//                           <p className="text-xs text-blue-600 mt-1">✓ Delivered on {order.deliveredDate}</p>
//                         )}
//                       </div>
//                       <div className="flex space-x-2">
//                         {order.status === 'pending' && (
//                           <button
//                             onClick={() => handleVerifyOrder(order.id)}
//                             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                           >
//                             <CheckCircle className="w-4 h-4" />
//                             <span>Verify Order</span>
//                           </button>
//                         )}
//                         {order.status === 'verified' && (
//                           <button
//                             onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                           >
//                             Start Processing
//                           </button>
//                         )}
//                         {order.status === 'processing' && (
//                           <button
//                             onClick={() => {
//                               const trackingId = prompt('Enter tracking ID:');
//                               if (trackingId) {
//                                 setOrders(orders.map(o =>
//                                   o.id === order.id
//                                     ? { ...o, status: 'shipped', trackingId }
//                                     : o
//                                 ));
//                               }
//                             }}
//                             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//                           >
//                             Mark as Shipped
//                           </button>
//                         )}
//                         {order.status === 'shipped' && (
//                           <button
//                             onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
//                             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                           >
//                             Mark as Delivered
//                           </button>
//                         )}
//                         <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ==================== VERIFICATION MODAL ==================== */}
//       {showVerifyModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Verify User Documents</h2>
//               <p className="text-sm text-gray-500 mt-1">Review and verify business documents</p>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Business Information</h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-gray-500">Business Name</p>
//                     <p className="font-medium">{selectedUser.businessName}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">GST Number</p>
//                     <p className="font-medium">{selectedUser.gstNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Contact Person</p>
//                     <p className="font-medium">{selectedUser.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Phone</p>
//                     <p className="font-medium">{selectedUser.phone}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Submitted Document</h3>
//                 <p className="text-sm text-gray-600 mb-2">Document Type: {selectedUser.documentType}</p>
//                 <div className="bg-white border rounded-lg p-4 text-center">
//                   <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">{selectedUser.documentType} Certificate</p>
//                   <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center">
//                     <Download className="w-4 h-4 mr-1" />
//                     Download Document
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6 border-t flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowVerifyModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleVerifyUser(selectedUser.id, 'rejected', 'Document verification failed')}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Reject
//               </button>
//               <button
//                 onClick={() => handleVerifyUser(selectedUser.id, 'verified')}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Verify & Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== PRODUCT MODAL ==================== */}
//       {showProductModal && (
//         <ProductFormModal
//           product={editingProduct}
//           onSave={(productData) => {
//             if (editingProduct) {
//               handleEditProduct(productData);
//             } else {
//               handleAddProduct(productData);
//             }
//           }}
//           onClose={() => {
//             setShowProductModal(false);
//             setEditingProduct(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // ==================== PRODUCT FORM MODAL ====================
// function ProductFormModal({ product, onSave, onClose }: any) {
//   const [formData, setFormData] = useState({
//     name: product?.name || '',
//     price: product?.price || 0,
//     category: product?.category || '',
//     stock: product?.stock || 0,
//     description: product?.description || '',
//     imageUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
//     minOrderQty: product?.minOrderQty || 1,
//     unit: product?.unit || 'kg',
//     status: product?.status || 'active'
//   });

//   const categories = ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'];
//   const units = ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
//             <input
//               type="text"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
//               <input
//                 type="number"
//                 required
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
//               <input
//                 type="number"
//                 required
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select</option>
//                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
//               <select
//                 value={formData.unit}
//                 onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
//               </select>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity</label>
//             <input
//               type="number"
//               required
//               value={formData.minOrderQty}
//               onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               rows={3}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
//             <input
//               type="url"
//               value={formData.imageUrl}
//               onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
          
//           <div className="flex justify-end space-x-3 pt-4">
//             <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
//               Cancel
//             </button>
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//               {product ? 'Update Product' : 'Add Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




















// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Users,
//   FileText,
//   Package,
//   ShoppingCart,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Eye,
//   Download,
//   Plus,
//   Search,
//   Filter,
//   Truck,
//   Check,
//   AlertCircle,
//   Mail,
//   MapPin,
//   DollarSign,
//   Shield,
//   UserCheck,
//   FileCheck,
//   Edit,
//   Trash2,
//   X
// } from 'lucide-react';

// // Import the product service
// import { 
//   getProducts, 
//   createProduct, 
//   updateProduct, 
//   deleteProduct, 
//   getProductStats 
// } from '@/services/productService';

// // ==================== TYPES ====================
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   businessName: string;
//   gstNumber: string;
//   documentType: 'Aadhar' | 'PAN' | 'GST' | 'Trade License';
//   documentUrl: string;
//   status: 'pending' | 'verified' | 'rejected';
//   submittedDate: string;
//   verifiedDate?: string;
//   rejectionReason?: string;
// }

// interface Product {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   imageUrl: string;
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   userName: string;
//   products: OrderProduct[];
//   totalAmount: number;
//   orderDate: string;
//   status: 'pending' | 'verified' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   shippingAddress: string;
//   trackingId?: string;
//   verifiedBy?: string;
//   verifiedDate?: string;
//   deliveredDate?: string;
// }

// interface OrderProduct {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
// }

// // ==================== SAMPLE DATA (for users and orders) ====================
// const sampleUsers: User[] = [
//   {
//     id: '1',
//     name: 'Rajesh Kumar',
//     email: 'rajesh@agroshop.com',
//     phone: '+91 98765 43210',
//     address: '123, Green Field Road, Ludhiana, Punjab',
//     businessName: 'Agro Solutions Pvt Ltd',
//     gstNumber: '03AAACA1234R1ZR',
//     documentType: 'GST',
//     documentUrl: '/documents/gst-certificate.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-10',
//   },
//   {
//     id: '2',
//     name: 'Priya Sharma',
//     email: 'priya@greenfields.com',
//     phone: '+91 87654 32109',
//     address: '45, Farmers Market, Indore, MP',
//     businessName: 'Green Fields Trading Co',
//     gstNumber: '23ABCDE1234F1ZH',
//     documentType: 'PAN',
//     documentUrl: '/documents/pan-card.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-12',
//   },
// ];

// const sampleOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     userId: '1',
//     userName: 'Rajesh Kumar',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 50, price: 1850 },
//       { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 20, price: 1250 }
//     ],
//     totalAmount: 117500,
//     orderDate: '2024-03-14',
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
//   },
//   {
//     id: 'ORD-002',
//     userId: '2',
//     userName: 'Priya Sharma',
//     products: [
//       { productId: '3', productName: 'Drip Irrigation Kit', quantity: 2, price: 3499 }
//     ],
//     totalAmount: 6998,
//     orderDate: '2024-03-13',
//     status: 'verified',
//     paymentStatus: 'paid',
//     shippingAddress: '45, Farmers Market, Indore, MP',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-13',
//   },
// ];

// // ==================== MAIN COMPONENT ====================
// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'verify' | 'products' | 'orders'>('verify');
//   const [users, setUsers] = useState<User[]>(sampleUsers);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     activeProducts: 0,
//     lowStock: 0,
//     pendingVerifications: 2,
//     verifiedUsers: 0,
//     pendingOrders: 1,
//     totalRevenue: 124498
//   });

//   // Load products and stats from API
//   useEffect(() => {
//     loadProducts();
//     loadStats();
//   }, []);

//   const loadProducts = async () => {
//     setIsLoading(true);
//     try {
//       const result = await getProducts({ limit: 100 });
//       if (result.success) {
//         setProducts(result.data);
//       }
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const result = await getProductStats();
//       if (result.success) {
//         setStats(prev => ({
//           ...prev,
//           totalProducts: result.data.totalProducts,
//           activeProducts: result.data.activeProducts,
//           lowStock: result.data.lowStock
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading stats:', error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-gray-100 text-gray-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const handleVerifyUser = (userId: string, status: 'verified' | 'rejected', reason?: string) => {
//     setUsers(users.map(user => 
//       user.id === userId 
//         ? { 
//             ...user, 
//             status, 
//             verifiedDate: new Date().toISOString().split('T')[0],
//             rejectionReason: reason 
//           }
//         : user
//     ));
//     setShowVerifyModal(false);
//     setSelectedUser(null);
//   };

//   const handleAddProduct = async (productData: any) => {
//     try {
//       const result = await createProduct(productData);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowProductModal(false);
//         alert('Product added successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       alert('Error adding product');
//     }
//   };

//   const handleEditProduct = async (productData: any) => {
//     if (editingProduct && editingProduct._id) {
//       try {
//         const result = await updateProduct(editingProduct._id, productData);
//         if (result.success) {
//           await loadProducts();
//           await loadStats();
//           setShowProductModal(false);
//           setEditingProduct(null);
//           alert('Product updated successfully!');
//         } else {
//           alert('Error: ' + result.message);
//         }
//       } catch (error) {
//         console.error('Error updating product:', error);
//         alert('Error updating product');
//       }
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     try {
//       const result = await deleteProduct(id);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowDeleteConfirm(null);
//         alert('Product deleted successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       alert('Error deleting product');
//     }
//   };

//   const handleVerifyOrder = (orderId: string) => {
//     setOrders(orders.map(order =>
//       order.id === orderId
//         ? {
//             ...order,
//             status: 'verified',
//             verifiedBy: 'Admin',
//             verifiedDate: new Date().toISOString().split('T')[0],
//           }
//         : order
//     ));
//   };

//   const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
//     setOrders(orders.map(order =>
//       order.id === orderId
//         ? {
//             ...order,
//             status,
//             ...(status === 'delivered' ? { deliveredDate: new Date().toISOString().split('T')[0] } : {}),
//           }
//         : order
//     ));
//   };

//   const pendingUsers = users.filter(u => u.status === 'pending');
//   const filteredProducts = products.filter(p => 
//     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       {/* Header - Fixed */}
//       <div className="bg-white border-b shadow-sm flex-shrink-0">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage verifications, products, and orders</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <span className="text-sm font-medium text-blue-600">Admin Access</span>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//             <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('verify')}>
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-yellow-200 rounded-lg">
//                   <FileText className="w-6 h-6 text-yellow-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</span>
//               </div>
//               <p className="text-sm font-medium text-yellow-800 mt-2">Pending Verifications</p>
//               <p className="text-xs text-yellow-600">Awaiting document review</p>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-green-200 rounded-lg">
//                   <Package className="w-6 h-6 text-green-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-green-900">{stats.totalProducts}</span>
//               </div>
//               <p className="text-sm font-medium text-green-800 mt-2">Total Products</p>
//               <p className="text-xs text-green-600">{stats.activeProducts} active</p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('orders')}>
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-blue-200 rounded-lg">
//                   <ShoppingCart className="w-6 h-6 text-blue-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</span>
//               </div>
//               <p className="text-sm font-medium text-blue-800 mt-2">Pending Orders</p>
//               <p className="text-xs text-blue-600">Need verification</p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-purple-200 rounded-lg">
//                   <DollarSign className="w-6 h-6 text-purple-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-purple-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
//               </div>
//               <p className="text-sm font-medium text-purple-800 mt-2">Total Revenue</p>
//               <p className="text-xs text-purple-600">From all orders</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 mt-6 border-b">
//             <button
//               onClick={() => setActiveTab('verify')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'verify'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <FileCheck className="w-4 h-4" />
//               <span>Verify Users</span>
//               {stats.pendingVerifications > 0 && (
//                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                   {stats.pendingVerifications}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'products'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Package className="w-4 h-4" />
//               <span>Products</span>
//             </button>
//             <button
//               onClick={() => setActiveTab('orders')}
//               className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                 activeTab === 'orders'
//                   ? 'text-blue-600 border-b-2 border-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Truck className="w-4 h-4" />
//               <span>Orders</span>
//               {stats.pendingOrders > 0 && (
//                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                   {stats.pendingOrders}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content Area - Scrollable */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-6">
//           {/* ==================== VERIFY USERS TAB ==================== */}
//           {activeTab === 'verify' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Document Verification</h2>
//                 <div className="flex space-x-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {pendingUsers.map((user) => (
//                   <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{user.businessName}</h3>
//                           <p className="text-sm text-gray-500">Requested by: {user.name}</p>
//                         </div>
//                         <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
//                           <Clock className="w-3 h-3 mr-1" />
//                           Pending
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="p-4 space-y-3">
//                       <div className="flex items-start space-x-3">
//                         <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
//                         <div>
//                           <p className="text-sm text-gray-600">{user.email}</p>
//                           <p className="text-sm text-gray-600">{user.phone}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start space-x-3">
//                         <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                         <p className="text-sm text-gray-600">{user.address}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium text-gray-700">Uploaded Document: {user.documentType}</span>
//                           <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                             <Download className="w-4 h-4 mr-1" />
//                             View
//                           </button>
//                         </div>
//                         <div className="bg-white border rounded p-2 text-center">
//                           <FileText className="w-12 h-12 text-gray-400 mx-auto" />
//                           <p className="text-xs text-gray-500 mt-1">{user.documentType} Certificate</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex space-x-3 pt-2">
//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setShowVerifyModal(true);
//                           }}
//                           className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           <span>Verify</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             const reason = prompt('Please enter rejection reason:');
//                             if (reason) handleVerifyUser(user.id, 'rejected', reason);
//                           }}
//                           className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
//                         >
//                           <XCircle className="w-4 h-4" />
//                           <span>Reject</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {pendingUsers.length === 0 && (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                   <FileCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-600 mb-2">All Clear!</h3>
//                   <p className="text-gray-400">No pending verifications at the moment</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== PRODUCTS TAB ==================== */}
//           {activeTab === 'products' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
//                 <button
//                   onClick={() => {
//                     setEditingProduct(null);
//                     setShowProductModal(true);
//                   }}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add New Product</span>
//                 </button>
//               </div>

//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading products...</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredProducts.map((product) => (
//                     <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
//                       <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
//                       <div className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-gray-800">{product.name}</h3>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
//                             {product.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
//                           <span className="text-xs text-gray-500">Min: {product.minOrderQty} {product.unit}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm">
//                             <span className="text-gray-500">Stock: </span>
//                             <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-900'}>
//                               {product.stock} {product.unit}s
//                             </span>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setEditingProduct(product);
//                                 setShowProductModal(true);
//                               }}
//                               className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Edit className="w-3 h-3" />
//                               <span>Edit</span>
//                             </button>
//                             <button
//                               onClick={() => setShowDeleteConfirm(product._id!)}
//                               className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               <span>Delete</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {!isLoading && filteredProducts.length === 0 && (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                   <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
//                   <p className="text-gray-400 mb-4">Get started by adding your first product</p>
//                   <button
//                     onClick={() => {
//                       setEditingProduct(null);
//                       setShowProductModal(true);
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add Product</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== ORDERS TAB ==================== */}
//           {activeTab === 'orders' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search orders..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {orders.map((order) => (
//                   <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <div className="flex items-center space-x-3 mb-2">
//                           <span className="font-semibold text-gray-800">Order #{order.id}</span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                             {order.status.toUpperCase()}
//                           </span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
//                             {order.paymentStatus.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600">Customer: {order.userName}</p>
//                         <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
//                         {order.trackingId && (
//                           <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4 mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
//                       <div className="space-y-2">
//                         {order.products.map((product, idx) => (
//                           <div key={idx} className="flex justify-between text-sm">
//                             <span>{product.productName} x {product.quantity}</span>
//                             <span className="font-medium">₹{(product.price * product.quantity).toLocaleString()}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4">
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm text-gray-600">
//                           <p>Shipping to: {order.shippingAddress}</p>
//                           {order.verifiedBy && (
//                             <p className="text-xs text-green-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Verified by {order.verifiedBy} on {order.verifiedDate}
//                             </p>
//                           )}
//                           {order.deliveredDate && (
//                             <p className="text-xs text-blue-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Delivered on {order.deliveredDate}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex space-x-2">
//                           {order.status === 'pending' && (
//                             <button
//                               onClick={() => handleVerifyOrder(order.id)}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Verify Order</span>
//                             </button>
//                           )}
//                           {order.status === 'verified' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                             >
//                               <Package className="w-4 h-4" />
//                               <span>Start Processing</span>
//                             </button>
//                           )}
//                           {order.status === 'processing' && (
//                             <button
//                               onClick={() => {
//                                 const trackingId = prompt('Enter tracking ID:');
//                                 if (trackingId) {
//                                   setOrders(orders.map(o =>
//                                     o.id === order.id
//                                       ? { ...o, status: 'shipped', trackingId }
//                                       : o
//                                   ));
//                                 }
//                               }}
//                               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
//                             >
//                               <Truck className="w-4 h-4" />
//                               <span>Mark as Shipped</span>
//                             </button>
//                           )}
//                           {order.status === 'shipped' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Mark as Delivered</span>
//                             </button>
//                           )}
//                           <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
//                             <Eye className="w-4 h-4" />
//                             <span>View Details</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals - Keep the same as before */}
//       {showVerifyModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">Verify User Documents</h2>
//                 <p className="text-sm text-gray-500 mt-1">Review and verify business documents</p>
//               </div>
//               <button onClick={() => setShowVerifyModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Business Information</h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div><p className="text-gray-500">Business Name</p><p className="font-medium">{selectedUser.businessName}</p></div>
//                   <div><p className="text-gray-500">GST Number</p><p className="font-medium">{selectedUser.gstNumber}</p></div>
//                   <div><p className="text-gray-500">Contact Person</p><p className="font-medium">{selectedUser.name}</p></div>
//                   <div><p className="text-gray-500">Phone</p><p className="font-medium">{selectedUser.phone}</p></div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Submitted Document</h3>
//                 <p className="text-sm text-gray-600 mb-2">Document Type: {selectedUser.documentType}</p>
//                 <div className="bg-white border rounded-lg p-4 text-center">
//                   <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">{selectedUser.documentType} Certificate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t flex justify-end space-x-3">
//               <button onClick={() => setShowVerifyModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
//               <button onClick={() => handleVerifyUser(selectedUser.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
//               <button onClick={() => handleVerifyUser(selectedUser.id, 'verified')} className="px-4 py-2 bg-green-600 text-white rounded-lg">Verify & Approve</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Form Modal */}
//       {showProductModal && (
//         <ProductFormModal
//           product={editingProduct}
//           onSave={(productData: any) => {
//             if (editingProduct && editingProduct._id) {
//               handleEditProduct(productData);
//             } else {
//               handleAddProduct(productData);
//             }
//           }}
//           onClose={() => {
//             setShowProductModal(false);
//             setEditingProduct(null);
//           }}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="w-6 h-6 text-red-600" />
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Product</h3>
//               <p className="text-gray-500 text-center mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
//               <div className="flex space-x-3">
//                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
//                 <button onClick={() => handleDeleteProduct(showDeleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Product Form Modal Component
// function ProductFormModal({ product, onSave, onClose }: any) {
//   const [formData, setFormData] = useState({
//     name: product?.name || '',
//     price: product?.price || 0,
//     category: product?.category || '',
//     stock: product?.stock || 0,
//     description: product?.description || '',
//     imageUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
//     minOrderQty: product?.minOrderQty || 1,
//     unit: product?.unit || 'kg',
//     status: product?.status || 'active'
//   });

//   const categories = ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'];
//   const units = ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
//           <div><label className="block text-sm font-medium mb-1">Product Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className="block text-sm font-medium mb-1">Price (₹)</label><input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
//             <div><label className="block text-sm font-medium mb-1">Stock</label><input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className="block text-sm font-medium mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">Select</option>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
//             <div><label className="block text-sm font-medium mb-1">Unit</label><select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border rounded-lg">{units.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div>
//           </div>
//           <div><label className="block text-sm font-medium mb-1">Min Order Quantity</label><input type="number" required value={formData.minOrderQty} onChange={(e) => setFormData({...formData, minOrderQty: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
//           <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
//           <div><label className="block text-sm font-medium mb-1">Image URL</label><input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
//           <div><label className="block text-sm font-medium mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
//           <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{product ? 'Update' : 'Add'} Product</button></div>
//         </form>
//       </div>
//     </div>
//   );
// }











// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import {
//   FileText,
//   Package,
//   ShoppingCart,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Eye,
//   Download,
//   Plus,
//   Search,
//   Truck,
//   Check,
//   AlertCircle,
//   Mail,
//   MapPin,
//   DollarSign,
//   Shield,
//   FileCheck,
//   Edit,
//   Trash2,
//   X,
//   ImagePlus,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';

// import {
//   getProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductStats,
// } from '@/services/productService';

// // ==================== TYPES ====================
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   businessName: string;
//   gstNumber: string;
//   documentType: 'Aadhar' | 'PAN' | 'GST' | 'Trade License';
//   documentUrl: string;
//   status: 'pending' | 'verified' | 'rejected';
//   submittedDate: string;
//   verifiedDate?: string;
//   rejectionReason?: string;
// }

// interface Product {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   images: string[];
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   userName: string;
//   products: OrderProduct[];
//   totalAmount: number;
//   orderDate: string;
//   status: 'pending' | 'verified' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   shippingAddress: string;
//   trackingId?: string;
//   verifiedBy?: string;
//   verifiedDate?: string;
//   deliveredDate?: string;
// }

// interface OrderProduct {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
// }

// // ==================== SAMPLE DATA ====================
// const sampleUsers: User[] = [
//   {
//     id: '1',
//     name: 'Rajesh Kumar',
//     email: 'rajesh@agroshop.com',
//     phone: '+91 98765 43210',
//     address: '123, Green Field Road, Ludhiana, Punjab',
//     businessName: 'Agro Solutions Pvt Ltd',
//     gstNumber: '03AAACA1234R1ZR',
//     documentType: 'GST',
//     documentUrl: '/documents/gst-certificate.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-10',
//   },
//   {
//     id: '2',
//     name: 'Priya Sharma',
//     email: 'priya@greenfields.com',
//     phone: '+91 87654 32109',
//     address: '45, Farmers Market, Indore, MP',
//     businessName: 'Green Fields Trading Co',
//     gstNumber: '23ABCDE1234F1ZH',
//     documentType: 'PAN',
//     documentUrl: '/documents/pan-card.pdf',
//     status: 'pending',
//     submittedDate: '2024-03-12',
//   },
// ];

// const sampleOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     userId: '1',
//     userName: 'Rajesh Kumar',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 50, price: 1850 },
//       { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 20, price: 1250 },
//     ],
//     totalAmount: 117500,
//     orderDate: '2024-03-14',
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
//   },
//   {
//     id: 'ORD-002',
//     userId: '2',
//     userName: 'Priya Sharma',
//     products: [
//       { productId: '3', productName: 'Drip Irrigation Kit', quantity: 2, price: 3499 },
//     ],
//     totalAmount: 6998,
//     orderDate: '2024-03-13',
//     status: 'verified',
//     paymentStatus: 'paid',
//     shippingAddress: '45, Farmers Market, Indore, MP',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-13',
//   },
// ];

// // ==================== IMAGE CAROUSEL ====================
// // ==================== IMAGE CAROUSEL ====================
// function ImageCarousel({ images, name }: { images: string[]; name: string }) {
//   const [current, setCurrent] = useState(0);
//   const validImages = (images || []).filter((img) => img && img.trim() !== '');

//   if (validImages.length === 0) {
//     return (
//       <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: '200px' }}>
//         <Package className="w-12 h-12 text-gray-300" />
//       </div>
//     );
//   }

//   if (validImages.length === 1) {
//     return (
//       <div className="w-full bg-gray-100" style={{ height: '200px' }}>
//         <img
//           src={validImages[0]}
//           alt={name}
//           style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
//         />
//       </div>
//     );
//   }

//   const prev = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1));
//   };

//   const next = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1));
//   };

//   return (
//     <div
//       className="relative bg-gray-100 overflow-hidden group"
//       style={{ width: '100%', height: '200px' }}
//     >
//       {/* Track */}
//       <div
//         style={{
//           display: 'flex',
//           width: `${validImages.length * 100}%`,
//           height: '200px',
//           transform: `translateX(-${(current * 100) / validImages.length}%)`,
//           transition: 'transform 0.3s ease-in-out',
//         }}
//       >
//         {validImages.map((img, idx) => (
//           <div
//             key={idx}
//             style={{ width: `${100 / validImages.length}%`, height: '200px', flexShrink: 0 }}
//           >
//             <img
//               src={img}
//               alt={`${name} ${idx + 1}`}
//               style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Left Arrow */}
//       <button
//         onClick={prev}
//         className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
//         style={{ width: '28px', height: '28px' }}
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </button>

//       {/* Right Arrow */}
//       <button
//         onClick={next}
//         className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
//         style={{ width: '28px', height: '28px' }}
//       >
//         <ChevronRight className="w-4 h-4" />
//       </button>

//       {/* Dots */}
//       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//         {validImages.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
//             style={{
//               width: '8px',
//               height: '8px',
//               borderRadius: '50%',
//               background: idx === current ? '#ffffff' : 'rgba(255,255,255,0.5)',
//               border: 'none',
//               cursor: 'pointer',
//               padding: 0,
//               transform: idx === current ? 'scale(1.3)' : 'scale(1)',
//               transition: 'all 0.2s',
//             }}
//           />
//         ))}
//       </div>

//       {/* Counter */}
//       <div
//         className="absolute top-2 right-2 z-10 text-white text-xs px-2 py-0.5 rounded-full"
//         style={{ background: 'rgba(0,0,0,0.5)' }}
//       >
//         {current + 1} / {validImages.length}
//       </div>
//     </div>
//   );
// }

// // ==================== MAIN COMPONENT ====================
// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'verify' | 'products' | 'orders'>('verify');
//   const [users, setUsers] = useState<User[]>(sampleUsers);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     activeProducts: 0,
//     lowStock: 0,
//     pendingVerifications: 2,
//     verifiedUsers: 0,
//     pendingOrders: 1,
//     totalRevenue: 124498,
//   });

//   useEffect(() => {
//     loadProducts();
//     loadStats();
//   }, []);

//   const loadProducts = async () => {
//     setIsLoading(true);
//     try {
//       const result = await getProducts({ limit: 100 });
//       if (result.success) setProducts(result.data);
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const result = await getProductStats();
//       if (result.success) {
//         setStats((prev) => ({
//           ...prev,
//           totalProducts: result.data.totalProducts,
//           activeProducts: result.data.activeProducts,
//           lowStock: result.data.lowStock,
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading stats:', error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-gray-100 text-gray-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-gray-100 text-gray-800',
//     };
//     return colors[status] || colors.pending;
//   };

//   const handleVerifyUser = (userId: string, status: 'verified' | 'rejected', reason?: string) => {
//     setUsers(
//       users.map((user) =>
//         user.id === userId
//           ? {
//               ...user,
//               status,
//               verifiedDate: new Date().toISOString().split('T')[0],
//               rejectionReason: reason,
//             }
//           : user
//       )
//     );
//     setShowVerifyModal(false);
//     setSelectedUser(null);
//   };

//   const handleAddProduct = async (productData: any) => {
//     try {
//       const result = await createProduct(productData);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowProductModal(false);
//         alert('Product added successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       alert('Error adding product');
//     }
//   };

//   const handleEditProduct = async (productData: any) => {
//     if (editingProduct && editingProduct._id) {
//       try {
//         const result = await updateProduct(editingProduct._id, productData);
//         if (result.success) {
//           await loadProducts();
//           await loadStats();
//           setShowProductModal(false);
//           setEditingProduct(null);
//           alert('Product updated successfully!');
//         } else {
//           alert('Error: ' + result.message);
//         }
//       } catch (error) {
//         console.error('Error updating product:', error);
//         alert('Error updating product');
//       }
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     try {
//       const result = await deleteProduct(id);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowDeleteConfirm(null);
//         alert('Product deleted successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       alert('Error deleting product');
//     }
//   };

//   const handleVerifyOrder = (orderId: string) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId
//           ? {
//               ...order,
//               status: 'verified',
//               verifiedBy: 'Admin',
//               verifiedDate: new Date().toISOString().split('T')[0],
//             }
//           : order
//       )
//     );
//   };

//   const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId
//           ? {
//               ...order,
//               status,
//               ...(status === 'delivered'
//                 ? { deliveredDate: new Date().toISOString().split('T')[0] }
//                 : {}),
//             }
//           : order
//       )
//     );
//   };

//   const pendingUsers = users.filter((u) => u.status === 'pending');
//   const filteredProducts = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       {/* Header */}
//       <div className="bg-white border-b shadow-sm flex-shrink-0">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage verifications, products, and orders</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <span className="text-sm font-medium text-blue-600">Admin Access</span>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//             <div
//               className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition"
//               onClick={() => setActiveTab('verify')}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-yellow-200 rounded-lg">
//                   <FileText className="w-6 h-6 text-yellow-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</span>
//               </div>
//               <p className="text-sm font-medium text-yellow-800 mt-2">Pending Verifications</p>
//               <p className="text-xs text-yellow-600">Awaiting document review</p>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-green-200 rounded-lg">
//                   <Package className="w-6 h-6 text-green-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-green-900">{stats.totalProducts}</span>
//               </div>
//               <p className="text-sm font-medium text-green-800 mt-2">Total Products</p>
//               <p className="text-xs text-green-600">{stats.activeProducts} active</p>
//             </div>

//             <div
//               className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition"
//               onClick={() => setActiveTab('orders')}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-blue-200 rounded-lg">
//                   <ShoppingCart className="w-6 h-6 text-blue-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</span>
//               </div>
//               <p className="text-sm font-medium text-blue-800 mt-2">Pending Orders</p>
//               <p className="text-xs text-blue-600">Need verification</p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-purple-200 rounded-lg">
//                   <DollarSign className="w-6 h-6 text-purple-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-purple-900">
//                   ₹{(stats.totalRevenue / 100000).toFixed(1)}L
//                 </span>
//               </div>
//               <p className="text-sm font-medium text-purple-800 mt-2">Total Revenue</p>
//               <p className="text-xs text-purple-600">From all orders</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 mt-6 border-b">
//             {(['verify', 'products', 'orders'] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                   activeTab === tab
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab === 'verify' && <FileCheck className="w-4 h-4" />}
//                 {tab === 'products' && <Package className="w-4 h-4" />}
//                 {tab === 'orders' && <Truck className="w-4 h-4" />}
//                 <span className="capitalize">{tab === 'verify' ? 'Verify Users' : tab}</span>
//                 {tab === 'verify' && stats.pendingVerifications > 0 && (
//                   <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                     {stats.pendingVerifications}
//                   </span>
//                 )}
//                 {tab === 'orders' && stats.pendingOrders > 0 && (
//                   <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                     {stats.pendingOrders}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-6">

//           {/* ==================== VERIFY USERS TAB ==================== */}
//           {activeTab === 'verify' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Document Verification</h2>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {pendingUsers.map((user) => (
//                   <div
//                     key={user.id}
//                     className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
//                   >
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{user.businessName}</h3>
//                           <p className="text-sm text-gray-500">Requested by: {user.name}</p>
//                         </div>
//                         <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
//                           <Clock className="w-3 h-3 mr-1" />
//                           Pending
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-4 space-y-3">
//                       <div className="flex items-start space-x-3">
//                         <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
//                         <div>
//                           <p className="text-sm text-gray-600">{user.email}</p>
//                           <p className="text-sm text-gray-600">{user.phone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                         <p className="text-sm text-gray-600">{user.address}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium text-gray-700">
//                             Uploaded Document: {user.documentType}
//                           </span>
//                           <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                             <Download className="w-4 h-4 mr-1" />
//                             View
//                           </button>
//                         </div>
//                         <div className="bg-white border rounded p-2 text-center">
//                           <FileText className="w-12 h-12 text-gray-400 mx-auto" />
//                           <p className="text-xs text-gray-500 mt-1">{user.documentType} Certificate</p>
//                         </div>
//                       </div>
//                       <div className="flex space-x-3 pt-2">
//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setShowVerifyModal(true);
//                           }}
//                           className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           <span>Verify</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             const reason = prompt('Please enter rejection reason:');
//                             if (reason) handleVerifyUser(user.id, 'rejected', reason);
//                           }}
//                           className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
//                         >
//                           <XCircle className="w-4 h-4" />
//                           <span>Reject</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {pendingUsers.length === 0 && (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                   <FileCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-600 mb-2">All Clear!</h3>
//                   <p className="text-gray-400">No pending verifications at the moment</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== PRODUCTS TAB ==================== */}
//           {activeTab === 'products' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//                     />
//                   </div>
//                   <button
//                     onClick={() => {
//                       setEditingProduct(null);
//                       setShowProductModal(true);
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add New Product</span>
//                   </button>
//                 </div>
//               </div>

//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading products...</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredProducts.map((product) => (
//                     <div
//                       key={product._id}
//                       className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
//                     >
//                       {/* Image Carousel */}
//                       <ImageCarousel images={product.images} name={product.name} />

//                       <div className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-gray-800">{product.name}</h3>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
//                             {product.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="text-xl font-bold text-blue-600">
//                             ₹{product.price.toLocaleString()}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             Min: {product.minOrderQty} {product.unit}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm">
//                             <span className="text-gray-500">Stock: </span>
//                             <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-900'}>
//                               {product.stock} {product.unit}s
//                             </span>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setEditingProduct(product);
//                                 setShowProductModal(true);
//                               }}
//                               className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Edit className="w-3 h-3" />
//                               <span>Edit</span>
//                             </button>
//                             <button
//                               onClick={() => setShowDeleteConfirm(product._id!)}
//                               className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               <span>Delete</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {!isLoading && filteredProducts.length === 0 && (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                   <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
//                   <p className="text-gray-400 mb-4">Get started by adding your first product</p>
//                   <button
//                     onClick={() => {
//                       setEditingProduct(null);
//                       setShowProductModal(true);
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add Product</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== ORDERS TAB ==================== */}
//           {activeTab === 'orders' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search orders..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {orders.map((order) => (
//                   <div
//                     key={order.id}
//                     className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <div className="flex items-center space-x-3 mb-2">
//                           <span className="font-semibold text-gray-800">Order #{order.id}</span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                             {order.status.toUpperCase()}
//                           </span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
//                             {order.paymentStatus.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600">Customer: {order.userName}</p>
//                         <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-2xl font-bold text-gray-800">
//                           ₹{order.totalAmount.toLocaleString()}
//                         </p>
//                         {order.trackingId && (
//                           <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4 mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
//                       <div className="space-y-2">
//                         {order.products.map((product, idx) => (
//                           <div key={idx} className="flex justify-between text-sm">
//                             <span>{product.productName} x {product.quantity}</span>
//                             <span className="font-medium">
//                               ₹{(product.price * product.quantity).toLocaleString()}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4">
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm text-gray-600">
//                           <p>Shipping to: {order.shippingAddress}</p>
//                           {order.verifiedBy && (
//                             <p className="text-xs text-green-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Verified by {order.verifiedBy} on {order.verifiedDate}
//                             </p>
//                           )}
//                           {order.deliveredDate && (
//                             <p className="text-xs text-blue-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Delivered on {order.deliveredDate}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex space-x-2">
//                           {order.status === 'pending' && (
//                             <button
//                               onClick={() => handleVerifyOrder(order.id)}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Verify Order</span>
//                             </button>
//                           )}
//                           {order.status === 'verified' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                             >
//                               <Package className="w-4 h-4" />
//                               <span>Start Processing</span>
//                             </button>
//                           )}
//                           {order.status === 'processing' && (
//                             <button
//                               onClick={() => {
//                                 const trackingId = prompt('Enter tracking ID:');
//                                 if (trackingId) {
//                                   setOrders(
//                                     orders.map((o) =>
//                                       o.id === order.id ? { ...o, status: 'shipped', trackingId } : o
//                                     )
//                                   );
//                                 }
//                               }}
//                               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
//                             >
//                               <Truck className="w-4 h-4" />
//                               <span>Mark as Shipped</span>
//                             </button>
//                           )}
//                           {order.status === 'shipped' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Mark as Delivered</span>
//                             </button>
//                           )}
//                           <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
//                             <Eye className="w-4 h-4" />
//                             <span>View Details</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Verify Modal */}
//       {showVerifyModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">Verify User Documents</h2>
//                 <p className="text-sm text-gray-500 mt-1">Review and verify business documents</p>
//               </div>
//               <button onClick={() => setShowVerifyModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Business Information</h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-gray-500">Business Name</p>
//                     <p className="font-medium">{selectedUser.businessName}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">GST Number</p>
//                     <p className="font-medium">{selectedUser.gstNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Contact Person</p>
//                     <p className="font-medium">{selectedUser.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Phone</p>
//                     <p className="font-medium">{selectedUser.phone}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Submitted Document</h3>
//                 <p className="text-sm text-gray-600 mb-2">Document Type: {selectedUser.documentType}</p>
//                 <div className="bg-white border rounded-lg p-4 text-center">
//                   <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">{selectedUser.documentType} Certificate</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t flex justify-end space-x-3">
//               <button onClick={() => setShowVerifyModal(false)} className="px-4 py-2 border rounded-lg">
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleVerifyUser(selectedUser.id, 'rejected')}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg"
//               >
//                 Reject
//               </button>
//               <button
//                 onClick={() => handleVerifyUser(selectedUser.id, 'verified')}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Verify & Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Modal */}
//       {showProductModal && (
//         <ProductFormModal
//           product={editingProduct}
//           onSave={(productData: any) => {
//             if (editingProduct && editingProduct._id) {
//               handleEditProduct(productData);
//             } else {
//               handleAddProduct(productData);
//             }
//           }}
//           onClose={() => {
//             setShowProductModal(false);
//             setEditingProduct(null);
//           }}
//         />
//       )}

//       {/* Delete Confirm Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="w-6 h-6 text-red-600" />
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Product</h3>
//               <p className="text-gray-500 text-center mb-6">
//                 Are you sure you want to delete this product? This action cannot be undone.
//               </p>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="flex-1 px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeleteProduct(showDeleteConfirm)}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ==================== PRODUCT FORM MODAL ====================
// function ProductFormModal({ product, onSave, onClose }: any) {
//   const [formData, setFormData] = useState({
//     name: product?.name || '',
//     price: product?.price || 0,
//     category: product?.category || '',
//     stock: product?.stock || 0,
//     description: product?.description || '',
//     images: product?.images?.length ? [...product.images, '', ''].slice(0, 3) : ['', '', ''],
//     minOrderQty: product?.minOrderQty || 1,
//     unit: product?.unit || 'kg',
//     status: product?.status || 'active',
//   });

//   const fileInputRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];

//   const categories = ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'];
//   const units = ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'];

//   const handleImageUrlChange = (index: number, value: string) => {
//     const updated = [...formData.images];
//     updated[index] = value;
//     setFormData({ ...formData, images: updated });
//   };

//   const handleFileChange = (index: number, file: File | null) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const updated = [...formData.images];
//       updated[index] = reader.result as string;
//       setFormData({ ...formData, images: updated });
//     };
//     reader.readAsDataURL(file);
//   };

//   const clearImage = (index: number) => {
//     const updated = [...formData.images];
//     updated[index] = '';
//     setFormData({ ...formData, images: updated });
//     if (fileInputRefs[index].current) {
//       fileInputRefs[index].current!.value = '';
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const filledImages = formData.images.filter((img) => img.trim() !== '');
//     if (filledImages.length === 0) {
//       alert('Please add at least one image (URL or upload).');
//       return;
//     }
//     onSave({ ...formData, images: filledImages });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Product Name *</label>
//             <input
//               type="text"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Price & Stock */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Price (₹) *</label>
//               <input
//                 type="number"
//                 required
//                 min={0}
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Stock *</label>
//               <input
//                 type="number"
//                 required
//                 min={0}
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Category & Unit */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Category *</label>
//               <select
//                 required
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Unit</label>
//               <select
//                 value={formData.unit}
//                 onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {units.map((unit) => (
//                   <option key={unit} value={unit}>{unit}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Min Order Qty */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Min Order Quantity</label>
//             <input
//               type="number"
//               required
//               min={1}
//               value={formData.minOrderQty}
//               onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               rows={3}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Images */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Images{' '}
//               <span className="text-gray-400 font-normal text-xs">(up to 3 — paste URL or upload file)</span>
//             </label>

//             <div className="space-y-3">
//               {[0, 1, 2].map((index) => (
//                 <div key={index} className="border rounded-xl p-3 bg-gray-50">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                       Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
//                     </span>
//                     {formData.images[index] && (
//                       <button
//                         type="button"
//                         onClick={() => clearImage(index)}
//                         className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
//                       >
//                         <X className="w-3 h-3" /> Clear
//                       </button>
//                     )}
//                   </div>

//                   {/* Preview */}
//                   {formData.images[index] && (
//                     <div className="mb-2 rounded-lg overflow-hidden border bg-white h-28 flex items-center justify-center">
//                       <img
//                         src={formData.images[index]}
//                         alt={`Preview ${index + 1}`}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                   )}

//                   {/* URL input */}
//                   <input
//                     type="url"
//                     placeholder="Paste image URL (https://...)"
//                     value={formData.images[index].startsWith('data:') ? '' : formData.images[index]}
//                     onChange={(e) => handleImageUrlChange(index, e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   />

//                   {/* Divider */}
//                   <div className="flex items-center gap-2 my-2">
//                     <div className="flex-1 border-t border-gray-200" />
//                     <span className="text-xs text-gray-400">or</span>
//                     <div className="flex-1 border-t border-gray-200" />
//                   </div>

//                   {/* File upload */}
//                   <input
//                     ref={fileInputRefs[index]}
//                     type="file"
//                     accept="image/png,image/jpeg,image/jpg,image/webp"
//                     className="hidden"
//                     onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRefs[index].current?.click()}
//                     className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition flex items-center justify-center gap-2"
//                   >
//                     <ImagePlus className="w-4 h-4" />
//                     Upload PNG / JPG / WEBP
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               {product ? 'Update Product' : 'Add Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Package,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Plus,
  Search,
  Truck,
  Check,
  AlertCircle,
  Mail,
  MapPin,
  DollarSign,
  Shield,
  FileCheck,
  Edit,
  Trash2,
  X,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building2,
  RefreshCw,
} from 'lucide-react';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from '@/services/productService';

import { getUsers, updateUserVerificationStatus, IUser } from '@/services/userVerificationService';
interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  images: string[];
  minOrderQty: number;
  unit: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  products: OrderProduct[];
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'verified' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  trackingId?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  deliveredDate?: string;
}

interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// ==================== SAMPLE ORDERS ====================
const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    userName: 'Rajesh Kumar',
    products: [
      { productId: '1', productName: 'Organic Wheat Seeds', quantity: 50, price: 1850 },
      { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 20, price: 1250 },
    ],
    totalAmount: 117500,
    orderDate: '2024-03-14',
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
  },
  {
    id: 'ORD-002',
    userId: '2',
    userName: 'Priya Sharma',
    products: [
      { productId: '3', productName: 'Drip Irrigation Kit', quantity: 2, price: 3499 },
    ],
    totalAmount: 6998,
    orderDate: '2024-03-13',
    status: 'verified',
    paymentStatus: 'paid',
    shippingAddress: '45, Farmers Market, Indore, MP',
    verifiedBy: 'Admin',
    verifiedDate: '2024-03-13',
  },
];

// ==================== IMAGE CAROUSEL ====================
function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const validImages = (images || []).filter((img) => img && img.trim() !== '');

  if (validImages.length === 0) {
    return (
      <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: '200px' }}>
        <Package className="w-12 h-12 text-gray-300" />
      </div>
    );
  }

  if (validImages.length === 1) {
    return (
      <div className="w-full bg-gray-100" style={{ height: '200px' }}>
        <img src={validImages[0]} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1)); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1)); };

  return (
    <div className="relative bg-gray-100 overflow-hidden group" style={{ width: '100%', height: '200px' }}>
      <div style={{ display: 'flex', width: `${validImages.length * 100}%`, height: '200px', transform: `translateX(-${(current * 100) / validImages.length}%)`, transition: 'transform 0.3s ease-in-out' }}>
        {validImages.map((img, idx) => (
          <div key={idx} style={{ width: `${100 / validImages.length}%`, height: '200px', flexShrink: 0 }}>
            <img src={img} alt={`${name} ${idx + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ width: '28px', height: '28px' }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ width: '28px', height: '28px' }}>
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {validImages.map((_, idx) => (
          <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === current ? '#ffffff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transform: idx === current ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.2s' }}
          />
        ))}
      </div>
      <div className="absolute top-2 right-2 z-10 text-white text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
        {current + 1} / {validImages.length}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verify' | 'products' | 'orders'>('verify');

  // ── Real users from DB ──
  const [users, setUsers] = useState<IUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
    pendingVerifications: 0,
    verifiedUsers: 0,
    pendingOrders: 1,
    totalRevenue: 124498,
  });

  useEffect(() => {
    fetchUsers();
    loadProducts();
    loadStats();
  }, []);

  // ── Fetch all users from /api/users ──
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.data);
        const pending = (result.data as IUser[]).filter(
          (u) => !u.verificationStatus || u.verificationStatus === 'pending'
        ).length;
        setStats((prev) => ({ ...prev, pendingVerifications: pending }));
      } else {
        setUsersError(result.message || 'Failed to load users');
      }
    } catch (err: any) {
      setUsersError('Error: ' + err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await getProducts({ limit: 100 });
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getProductStats();
      if (result.success) {
        setStats((prev) => ({
          ...prev,
          totalProducts: result.data.totalProducts,
          activeProducts: result.data.activeProducts,
          lowStock: result.data.lowStock,
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.pending;
  };

  // ── Verify / Reject via PATCH /api/users/:id/verify ──
  const handleVerifyUser = async (userId: string, status: 'verified' | 'rejected', reason?: string) => {
    console.log('Verifying userId:', userId); 
    try {
      const result = await updateUserVerificationStatus(userId, status, reason);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, verificationStatus: status, rejectionReason: reason, verifiedDate: new Date().toISOString() }
              : u
          )
        );
        setStats((prev) => ({ ...prev, pendingVerifications: Math.max(0, prev.pendingVerifications - 1) }));
        setShowVerifyModal(false);
        setSelectedUser(null);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const result = await createProduct(productData);
      if (result.success) {
        await loadProducts();
        await loadStats();
        setShowProductModal(false);
        alert('Product added successfully!');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const handleEditProduct = async (productData: any) => {
    if (editingProduct && editingProduct._id) {
      try {
        const result = await updateProduct(editingProduct._id, productData);
        if (result.success) {
          await loadProducts();
          await loadStats();
          setShowProductModal(false);
          setEditingProduct(null);
          alert('Product updated successfully!');
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        await loadProducts();
        await loadStats();
        setShowDeleteConfirm(null);
        alert('Product deleted successfully!');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleVerifyOrder = (orderId: string) => {
    setOrders(orders.map((order) =>
      order.id === orderId
        ? { ...order, status: 'verified', verifiedBy: 'Admin', verifiedDate: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map((order) =>
      order.id === orderId
        ? { ...order, status, ...(status === 'delivered' ? { deliveredDate: new Date().toISOString().split('T')[0] } : {}) }
        : order
    ));
  };

  // Pending = no verificationStatus field OR explicitly 'pending'
  const pendingUsers = users.filter(
    (u) => !u.verificationStatus || u.verificationStatus === 'pending'
  );

  const filteredPendingUsers = pendingUsers.filter((u) =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobileNumber || '').includes(searchTerm)
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage verifications, products, and orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Admin Access</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('verify')}>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-yellow-200 rounded-lg"><FileText className="w-6 h-6 text-yellow-700" /></div>
                <span className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</span>
              </div>
              <p className="text-sm font-medium text-yellow-800 mt-2">Pending Verifications</p>
              <p className="text-xs text-yellow-600">Awaiting document review</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-200 rounded-lg"><Package className="w-6 h-6 text-green-700" /></div>
                <span className="text-2xl font-bold text-green-900">{stats.totalProducts}</span>
              </div>
              <p className="text-sm font-medium text-green-800 mt-2">Total Products</p>
              <p className="text-xs text-green-600">{stats.activeProducts} active</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('orders')}>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-200 rounded-lg"><ShoppingCart className="w-6 h-6 text-blue-700" /></div>
                <span className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</span>
              </div>
              <p className="text-sm font-medium text-blue-800 mt-2">Pending Orders</p>
              <p className="text-xs text-blue-600">Need verification</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-200 rounded-lg"><DollarSign className="w-6 h-6 text-purple-700" /></div>
                <span className="text-2xl font-bold text-purple-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
              </div>
              <p className="text-sm font-medium text-purple-800 mt-2">Total Revenue</p>
              <p className="text-xs text-purple-600">From all orders</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 border-b">
            {(['verify', 'products', 'orders'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab === 'verify' && <FileCheck className="w-4 h-4" />}
                {tab === 'products' && <Package className="w-4 h-4" />}
                {tab === 'orders' && <Truck className="w-4 h-4" />}
                <span className="capitalize">{tab === 'verify' ? 'Verify Users' : tab}</span>
                {tab === 'verify' && stats.pendingVerifications > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">{stats.pendingVerifications}</span>
                )}
                {tab === 'orders' && stats.pendingOrders > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">{stats.pendingOrders}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">

          {/* ==================== VERIFY USERS TAB ==================== */}
          {activeTab === 'verify' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">Document Verification</h2>
                  <button onClick={fetchUsers} title="Refresh"
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search by name, business, mobile..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>
              </div>

              {/* Loading */}
              {usersLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
              )}

              {/* Error */}
              {!usersLoading && usersError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-700 font-medium mb-1">Failed to load users</p>
                  <p className="text-red-500 text-sm mb-4">{usersError}</p>
                  <button onClick={fetchUsers} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Retry</button>
                </div>
              )}

              {/* Cards */}
              {!usersLoading && !usersError && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredPendingUsers.map((user) => (
                      <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">{user.businessName || 'Unnamed Business'}</h3>
                              <p className="text-sm text-gray-500">Requested by: {user.name || '—'}</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </span>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">{user.mobileNumber || '—'}</p>
                              {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 capitalize">{user.businessType || '—'}</p>
                              {user.gstNumber
                                ? <p className="text-xs text-gray-500">GST: {user.gstNumber}</p>
                                : <p className="text-xs text-gray-400 italic">No GST provided</p>}
                            </div>
                          </div>
                          {(user.village || user.district || user.state || user.address) && (
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-600">
                                {[user.village, user.taluk, user.district, user.state].filter(Boolean).join(', ') || user.address}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-400">
                            Registered: {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </p>
                          <div className="flex space-x-3 pt-2">
                            <button onClick={() => { setSelectedUser(user); setShowVerifyModal(true); }}
                              className="flex-1 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                              <Eye className="w-4 h-4" /><span>Review</span>
                            </button>
                            <button onClick={() => handleVerifyUser(user._id, 'verified')}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4" /><span>Verify</span>
                            </button>
                            <button onClick={() => {
                              const reason = prompt('Please enter rejection reason:');
                              if (reason) handleVerifyUser(user._id, 'rejected', reason);
                            }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredPendingUsers.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                      <FileCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        {searchTerm ? 'No matching users found' : 'All Clear!'}
                      </h3>
                      <p className="text-gray-400">
                        {searchTerm ? 'Try a different search term' : 'No pending verifications at the moment'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== PRODUCTS TAB ==================== */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                  </div>
                  <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <Plus className="w-4 h-4" /><span>Add New Product</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                      <ImageCarousel images={product.images} name={product.name} />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">Min: {product.minOrderQty} {product.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-gray-500">Stock: </span>
                            <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-900'}>{product.stock} {product.unit}s</span>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => { setEditingProduct(product); setShowProductModal(true); }} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition flex items-center space-x-1">
                              <Edit className="w-3 h-3" /><span>Edit</span>
                            </button>
                            <button onClick={() => setShowDeleteConfirm(product._id!)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition flex items-center space-x-1">
                              <Trash2 className="w-3 h-3" /><span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-4">Get started by adding your first product</p>
                  <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
                    <Plus className="w-4 h-4" /><span>Add Product</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================== ORDERS TAB ==================== */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80" />
                </div>
              </div>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-gray-800">Order #{order.id}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>{order.status.toUpperCase()}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus.toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-gray-600">Customer: {order.userName}</p>
                        <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
                        {order.trackingId && <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>}
                      </div>
                    </div>
                    <div className="border-t pt-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
                      <div className="space-y-2">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{product.productName} x {product.quantity}</span>
                            <span className="font-medium">₹{(product.price * product.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <p>Shipping to: {order.shippingAddress}</p>
                          {order.verifiedBy && <p className="text-xs text-green-600 mt-1"><Check className="w-3 h-3 inline mr-1" />Verified by {order.verifiedBy} on {order.verifiedDate}</p>}
                          {order.deliveredDate && <p className="text-xs text-blue-600 mt-1"><Check className="w-3 h-3 inline mr-1" />Delivered on {order.deliveredDate}</p>}
                        </div>
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button onClick={() => handleVerifyOrder(order.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" /><span>Verify Order</span>
                            </button>
                          )}
                          {order.status === 'verified' && (
                            <button onClick={() => handleUpdateOrderStatus(order.id, 'processing')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                              <Package className="w-4 h-4" /><span>Start Processing</span>
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button onClick={() => { const t = prompt('Enter tracking ID:'); if (t) setOrders(orders.map((o) => o.id === order.id ? { ...o, status: 'shipped', trackingId: t } : o)); }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2">
                              <Truck className="w-4 h-4" /><span>Mark as Shipped</span>
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" /><span>Mark as Delivered</span>
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                            <Eye className="w-4 h-4" /><span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== VERIFY MODAL ==================== */}
      {showVerifyModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Verify User Documents</h2>
                <p className="text-sm text-gray-500 mt-1">Review and verify business documents</p>
              </div>
              <button onClick={() => { setShowVerifyModal(false); setSelectedUser(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Business Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-500">Business Name</p><p className="font-medium">{selectedUser.businessName || '—'}</p></div>
                  <div><p className="text-gray-500">Business Type</p><p className="font-medium capitalize">{selectedUser.businessType || '—'}</p></div>
                  <div><p className="text-gray-500">GST Number</p><p className="font-medium">{selectedUser.gstNumber || <span className="italic text-gray-400">Not provided</span>}</p></div>
                  <div><p className="text-gray-500">Mobile</p><p className="font-medium">{selectedUser.mobileNumber || '—'}</p></div>
                  <div><p className="text-gray-500">Contact Person</p><p className="font-medium">{selectedUser.name || '—'}</p></div>
                  <div><p className="text-gray-500">Email</p><p className="font-medium">{selectedUser.email || <span className="italic text-gray-400">Not provided</span>}</p></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedUser.village && <div><p className="text-gray-500">Village</p><p className="font-medium">{selectedUser.village}</p></div>}
                  {selectedUser.taluk && <div><p className="text-gray-500">Taluk</p><p className="font-medium">{selectedUser.taluk}</p></div>}
                  {selectedUser.district && <div><p className="text-gray-500">District</p><p className="font-medium">{selectedUser.district}</p></div>}
                  {selectedUser.state && <div><p className="text-gray-500">State</p><p className="font-medium">{selectedUser.state}</p></div>}
                  {!selectedUser.village && !selectedUser.district && !selectedUser.state && (
                    <p className="text-gray-400 italic col-span-2">No location provided</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Document</h3>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 italic">No document uploaded</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-right">
                Registered: {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button onClick={() => { setShowVerifyModal(false); setSelectedUser(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleVerifyUser(selectedUser._id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
              <button onClick={() => handleVerifyUser(selectedUser._id, 'verified')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Verify & Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onSave={(productData: any) => {
            if (editingProduct && editingProduct._id) handleEditProduct(productData);
            else handleAddProduct(productData);
          }}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Product</h3>
              <p className="text-gray-500 text-center mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={() => handleDeleteProduct(showDeleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PRODUCT FORM MODAL (unchanged) ====================
function ProductFormModal({ product, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    description: product?.description || '',
    images: product?.images?.length ? [...product.images, '', ''].slice(0, 3) : ['', '', ''],
    minOrderQty: product?.minOrderQty || 1,
    unit: product?.unit || 'kg',
    status: product?.status || 'active',
  });

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const categories = ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'];
  const units = ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'];

  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...formData.images]; updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.images]; updated[index] = reader.result as string;
      setFormData({ ...formData, images: updated });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (index: number) => {
    const updated = [...formData.images]; updated[index] = '';
    setFormData({ ...formData, images: updated });
    if (fileInputRefs[index].current) fileInputRefs[index].current!.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledImages = formData.images.filter((img) => img.trim() !== '');
    if (filledImages.length === 0) { alert('Please add at least one image (URL or upload).'); return; }
    onSave({ ...formData, images: filledImages });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input type="number" required min={0} value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input type="number" required min={0} value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Order Quantity</label>
            <input type="number" required min={1} value={formData.minOrderQty} onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images <span className="text-gray-400 font-normal text-xs">(up to 3 — paste URL or upload file)</span></label>
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="border rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}</span>
                    {formData.images[index] && <button type="button" onClick={() => clearImage(index)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
                  </div>
                  {formData.images[index] && (
                    <div className="mb-2 rounded-lg overflow-hidden border bg-white h-28 flex items-center justify-center">
                      <img src={formData.images[index]} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input type="url" placeholder="Paste image URL (https://...)" value={formData.images[index].startsWith('data:') ? '' : formData.images[index]} onChange={(e) => handleImageUrlChange(index, e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  <div className="flex items-center gap-2 my-2"><div className="flex-1 border-t border-gray-200" /><span className="text-xs text-gray-400">or</span><div className="flex-1 border-t border-gray-200" /></div>
                  <input ref={fileInputRefs[index]} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)} />
                  <button type="button" onClick={() => fileInputRefs[index].current?.click()} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition flex items-center justify-center gap-2">
                    <ImagePlus className="w-4 h-4" /> Upload PNG / JPG / WEBP
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{product ? 'Update Product' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}










// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import {
//   FileText,
//   Package,
//   ShoppingCart,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Eye,
//   Download,
//   Plus,
//   Search,
//   Truck,
//   Check,
//   AlertCircle,
//   Mail,
//   MapPin,
//   DollarSign,
//   Shield,
//   FileCheck,
//   Edit,
//   Trash2,
//   X,
//   ImagePlus,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';

// import {
//   getProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductStats,
// } from '@/services/productService';

// import {
//   getUsers,
//   updateUserVerificationStatus,
// } from '@/services/userVerificationService';

// // ==================== TYPES ====================
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   businessName: string;
//   gstNumber: string;
//   documentType: 'Aadhar' | 'PAN' | 'GST' | 'Trade License';
//   documentUrl: string;
//   status: 'pending' | 'verified' | 'rejected';
//   submittedDate: string;
//   verifiedDate?: string;
//   rejectionReason?: string;
//   verifiedBy?: string;
// }

// interface Product {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   images: string[];
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   userName: string;
//   products: OrderProduct[];
//   totalAmount: number;
//   orderDate: string;
//   status: 'pending' | 'verified' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   shippingAddress: string;
//   trackingId?: string;
//   verifiedBy?: string;
//   verifiedDate?: string;
//   deliveredDate?: string;
// }

// interface OrderProduct {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
// }

// // ==================== SAMPLE ORDERS ====================
// const sampleOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     userId: '1',
//     userName: 'Rajesh Kumar',
//     products: [
//       { productId: '1', productName: 'Organic Wheat Seeds', quantity: 50, price: 1850 },
//       { productId: '2', productName: 'NPK Fertilizer 50kg', quantity: 20, price: 1250 },
//     ],
//     totalAmount: 117500,
//     orderDate: '2024-03-14',
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: '123, Green Field Road, Ludhiana, Punjab',
//   },
//   {
//     id: 'ORD-002',
//     userId: '2',
//     userName: 'Priya Sharma',
//     products: [
//       { productId: '3', productName: 'Drip Irrigation Kit', quantity: 2, price: 3499 },
//     ],
//     totalAmount: 6998,
//     orderDate: '2024-03-13',
//     status: 'verified',
//     paymentStatus: 'paid',
//     shippingAddress: '45, Farmers Market, Indore, MP',
//     verifiedBy: 'Admin',
//     verifiedDate: '2024-03-13',
//   },
// ];

// // ==================== IMAGE CAROUSEL ====================
// function ImageCarousel({ images, name }: { images: string[]; name: string }) {
//   const [current, setCurrent] = useState(0);
//   const validImages = (images || []).filter((img) => img && img.trim() !== '');

//   if (validImages.length === 0) {
//     return (
//       <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: '200px' }}>
//         <Package className="w-12 h-12 text-gray-300" />
//       </div>
//     );
//   }

//   if (validImages.length === 1) {
//     return (
//       <div className="w-full bg-gray-100" style={{ height: '200px' }}>
//         <img
//           src={validImages[0]}
//           alt={name}
//           style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
//         />
//       </div>
//     );
//   }

//   const prev = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1));
//   };

//   const next = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1));
//   };

//   return (
//     <div
//       className="relative bg-gray-100 overflow-hidden group"
//       style={{ width: '100%', height: '200px' }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           width: `${validImages.length * 100}%`,
//           height: '200px',
//           transform: `translateX(-${(current * 100) / validImages.length}%)`,
//           transition: 'transform 0.3s ease-in-out',
//         }}
//       >
//         {validImages.map((img, idx) => (
//           <div
//             key={idx}
//             style={{ width: `${100 / validImages.length}%`, height: '200px', flexShrink: 0 }}
//           >
//             <img
//               src={img}
//               alt={`${name} ${idx + 1}`}
//               style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
//             />
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={prev}
//         className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
//         style={{ width: '28px', height: '28px' }}
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </button>

//       <button
//         onClick={next}
//         className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
//         style={{ width: '28px', height: '28px' }}
//       >
//         <ChevronRight className="w-4 h-4" />
//       </button>

//       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//         {validImages.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
//             style={{
//               width: '8px',
//               height: '8px',
//               borderRadius: '50%',
//               background: idx === current ? '#ffffff' : 'rgba(255,255,255,0.5)',
//               border: 'none',
//               cursor: 'pointer',
//               padding: 0,
//               transform: idx === current ? 'scale(1.3)' : 'scale(1)',
//               transition: 'all 0.2s',
//             }}
//           />
//         ))}
//       </div>

//       <div
//         className="absolute top-2 right-2 z-10 text-white text-xs px-2 py-0.5 rounded-full"
//         style={{ background: 'rgba(0,0,0,0.5)' }}
//       >
//         {current + 1} / {validImages.length}
//       </div>
//     </div>
//   );
// }

// // ==================== REJECTION MODAL ====================
// function RejectionModal({
//   user,
//   onConfirm,
//   onClose,
// }: {
//   user: User;
//   onConfirm: (reason: string) => void;
//   onClose: () => void;
// }) {
//   const [reason, setReason] = useState('');

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-800">Reject Verification</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="p-6 space-y-4">
//           <p className="text-sm text-gray-600">
//             Please provide a reason for rejecting <strong>{user.businessName}</strong>'s verification request.
//           </p>
//           <textarea
//             rows={4}
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="Enter rejection reason..."
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//           />
//         </div>
//         <div className="p-6 border-t flex justify-end space-x-3">
//           <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               if (!reason.trim()) {
//                 alert('Please enter a rejection reason.');
//                 return;
//               }
//               onConfirm(reason.trim());
//             }}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
//           >
//             Confirm Rejection
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================== MAIN COMPONENT ====================
// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'verify' | 'products' | 'orders'>('verify');

//   // Users state
//   const [users, setUsers] = useState<User[]>([]);
//   const [usersLoading, setUsersLoading] = useState(true);
//   const [usersError, setUsersError] = useState('');
//   const [actionLoading, setActionLoading] = useState<string | null>(null); // userId being actioned

//   // Modals
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectingUser, setRejectingUser] = useState<User | null>(null);

//   // Products state
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     activeProducts: 0,
//     lowStock: 0,
//     pendingVerifications: 0,
//     verifiedUsers: 0,
//     pendingOrders: 1,
//     totalRevenue: 124498,
//   });

//   useEffect(() => {
//     loadUsers();
//     loadProducts();
//     loadStats();
//   }, []);

//   // ── Load users from backend ──
//   const loadUsers = async () => {
//     setUsersLoading(true);
//     setUsersError('');
//     try {
//       const result = await getUsers('pending');
//       if (result.success) {
//         setUsers(result.data);
//         setStats((prev) => ({ ...prev, pendingVerifications: result.data.length }));
//       } else {
//         setUsersError(result.message || 'Failed to load users');
//       }
//     } catch (err) {
//       setUsersError('Failed to load users');
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const loadProducts = async () => {
//     setIsLoading(true);
//     try {
//       const result = await getProducts({ limit: 100 });
//       if (result.success) setProducts(result.data);
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const result = await getProductStats();
//       if (result.success) {
//         setStats((prev) => ({
//           ...prev,
//           totalProducts: result.data.totalProducts,
//           activeProducts: result.data.activeProducts,
//           lowStock: result.data.lowStock,
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading stats:', error);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-gray-100 text-gray-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-gray-100 text-gray-800',
//     };
//     return colors[status] || colors.pending;
//   };

//   // ── Verify user (backend) ──
//   const handleVerifyUser = async (userId: string, status: 'verified' | 'rejected', reason?: string) => {
//     setActionLoading(userId);
//     try {
//       const result = await updateUserVerificationStatus(userId, status, reason);
//       if (result.success) {
//         // Remove from pending list
//         setUsers((prev) => prev.filter((u) => u._id !== userId));
//         setStats((prev) => ({
//           ...prev,
//           pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
//         }));
//         setShowVerifyModal(false);
//         setShowRejectModal(false);
//         setSelectedUser(null);
//         setRejectingUser(null);
//         alert(`User ${status === 'verified' ? 'verified' : 'rejected'} successfully!`);
//       } else {
//         alert('Error: ' + (result.message || 'Something went wrong'));
//       }
//     } catch (err) {
//       alert('Failed to update user status. Please try again.');
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ── Product handlers ──
//   const handleAddProduct = async (productData: any) => {
//     try {
//       const result = await createProduct(productData);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowProductModal(false);
//         alert('Product added successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       alert('Error adding product');
//     }
//   };

//   const handleEditProduct = async (productData: any) => {
//     if (editingProduct && editingProduct._id) {
//       try {
//         const result = await updateProduct(editingProduct._id, productData);
//         if (result.success) {
//           await loadProducts();
//           await loadStats();
//           setShowProductModal(false);
//           setEditingProduct(null);
//           alert('Product updated successfully!');
//         } else {
//           alert('Error: ' + result.message);
//         }
//       } catch (error) {
//         alert('Error updating product');
//       }
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     try {
//       const result = await deleteProduct(id);
//       if (result.success) {
//         await loadProducts();
//         await loadStats();
//         setShowDeleteConfirm(null);
//         alert('Product deleted successfully!');
//       } else {
//         alert('Error: ' + result.message);
//       }
//     } catch (error) {
//       alert('Error deleting product');
//     }
//   };

//   // ── Order handlers ──
//   const handleVerifyOrder = (orderId: string) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId
//           ? { ...order, status: 'verified', verifiedBy: 'Admin', verifiedDate: new Date().toISOString().split('T')[0] }
//           : order
//       )
//     );
//   };

//   const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId
//           ? { ...order, status, ...(status === 'delivered' ? { deliveredDate: new Date().toISOString().split('T')[0] } : {}) }
//           : order
//       )
//     );
//   };

//   const filteredProducts = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredUsers = users.filter(
//     (u) =>
//       u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       {/* Header */}
//       <div className="bg-white border-b shadow-sm flex-shrink-0">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage verifications, products, and orders</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <span className="text-sm font-medium text-blue-600">Admin Access</span>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//             <div
//               className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition"
//               onClick={() => setActiveTab('verify')}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-yellow-200 rounded-lg">
//                   <FileText className="w-6 h-6 text-yellow-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</span>
//               </div>
//               <p className="text-sm font-medium text-yellow-800 mt-2">Pending Verifications</p>
//               <p className="text-xs text-yellow-600">Awaiting document review</p>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-green-200 rounded-lg">
//                   <Package className="w-6 h-6 text-green-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-green-900">{stats.totalProducts}</span>
//               </div>
//               <p className="text-sm font-medium text-green-800 mt-2">Total Products</p>
//               <p className="text-xs text-green-600">{stats.activeProducts} active</p>
//             </div>

//             <div
//               className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition"
//               onClick={() => setActiveTab('orders')}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-blue-200 rounded-lg">
//                   <ShoppingCart className="w-6 h-6 text-blue-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-blue-900">{stats.pendingOrders}</span>
//               </div>
//               <p className="text-sm font-medium text-blue-800 mt-2">Pending Orders</p>
//               <p className="text-xs text-blue-600">Need verification</p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-purple-200 rounded-lg">
//                   <DollarSign className="w-6 h-6 text-purple-700" />
//                 </div>
//                 <span className="text-2xl font-bold text-purple-900">
//                   ₹{(stats.totalRevenue / 100000).toFixed(1)}L
//                 </span>
//               </div>
//               <p className="text-sm font-medium text-purple-800 mt-2">Total Revenue</p>
//               <p className="text-xs text-purple-600">From all orders</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 mt-6 border-b">
//             {(['verify', 'products', 'orders'] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
//                 className={`px-6 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
//                   activeTab === tab
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab === 'verify' && <FileCheck className="w-4 h-4" />}
//                 {tab === 'products' && <Package className="w-4 h-4" />}
//                 {tab === 'orders' && <Truck className="w-4 h-4" />}
//                 <span className="capitalize">{tab === 'verify' ? 'Verify Users' : tab}</span>
//                 {tab === 'verify' && stats.pendingVerifications > 0 && (
//                   <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                     {stats.pendingVerifications}
//                   </span>
//                 )}
//                 {tab === 'orders' && stats.pendingOrders > 0 && (
//                   <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
//                     {stats.pendingOrders}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-6">

//           {/* ==================== VERIFY USERS TAB ==================== */}
//           {activeTab === 'verify' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Document Verification</h2>
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                     />
//                   </div>
//                   <button
//                     onClick={loadUsers}
//                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
//                   >
//                     Refresh
//                   </button>
//                 </div>
//               </div>

//               {/* Loading */}
//               {usersLoading && (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading pending verifications...</p>
//                 </div>
//               )}

//               {/* Error */}
//               {!usersLoading && usersError && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//                   <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
//                   <p className="text-red-700 font-medium">{usersError}</p>
//                   <button
//                     onClick={loadUsers}
//                     className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               )}

//               {/* User cards */}
//               {!usersLoading && !usersError && (
//                 <>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {filteredUsers.map((user) => (
//                       <div
//                         key={user._id}
//                         className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
//                       >
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h3 className="font-semibold text-gray-800">{user.businessName}</h3>
//                               <p className="text-sm text-gray-500">Requested by: {user.name}</p>
//                             </div>
//                             <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
//                               <Clock className="w-3 h-3 mr-1" />
//                               Pending
//                             </span>
//                           </div>
//                         </div>

//                         <div className="p-4 space-y-3">
//                           <div className="flex items-start space-x-3">
//                             <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
//                             <div>
//                               <p className="text-sm text-gray-600">{user.email}</p>
//                               <p className="text-sm text-gray-600">{user.phone}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-start space-x-3">
//                             <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                             <p className="text-sm text-gray-600">{user.address}</p>
//                           </div>

//                           {/* GST */}
//                           <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
//                             <span className="text-gray-500">GST: </span>
//                             <span className="font-medium text-gray-800">{user.gstNumber}</span>
//                           </div>

//                           {/* Document */}
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium text-gray-700">
//                                 Uploaded Document: {user.documentType}
//                               </span>
//                               {user.documentUrl && (
//                                 <a
//                                   href={user.documentUrl}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
//                                 >
//                                   <Download className="w-4 h-4 mr-1" />
//                                   View
//                                 </a>
//                               )}
//                             </div>
//                             <div className="bg-white border rounded p-2 text-center">
//                               <FileText className="w-12 h-12 text-gray-400 mx-auto" />
//                               <p className="text-xs text-gray-500 mt-1">{user.documentType} Certificate</p>
//                             </div>
//                           </div>

//                           {/* Submitted date */}
//                           <p className="text-xs text-gray-400">
//                             Submitted: {new Date(user.submittedDate).toLocaleDateString('en-IN')}
//                           </p>

//                           {/* Action buttons */}
//                           <div className="flex space-x-3 pt-2">
//                             <button
//                               disabled={actionLoading === user._id}
//                               onClick={() => {
//                                 setSelectedUser(user);
//                                 setShowVerifyModal(true);
//                               }}
//                               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2 disabled:opacity-60"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>{actionLoading === user._id ? 'Processing...' : 'Verify'}</span>
//                             </button>
//                             <button
//                               disabled={actionLoading === user._id}
//                               onClick={() => {
//                                 setRejectingUser(user);
//                                 setShowRejectModal(true);
//                               }}
//                               className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:opacity-60"
//                             >
//                               <XCircle className="w-4 h-4" />
//                               <span>Reject</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {filteredUsers.length === 0 && (
//                     <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                       <FileCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-600 mb-2">All Clear!</h3>
//                       <p className="text-gray-400">No pending verifications at the moment</p>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== PRODUCTS TAB ==================== */}
//           {activeTab === 'products' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//                     />
//                   </div>
//                   <button
//                     onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add New Product</span>
//                   </button>
//                 </div>
//               </div>

//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading products...</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredProducts.map((product) => (
//                     <div
//                       key={product._id}
//                       className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
//                     >
//                       <ImageCarousel images={product.images} name={product.name} />
//                       <div className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-gray-800">{product.name}</h3>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
//                             {product.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="text-xl font-bold text-blue-600">
//                             ₹{product.price.toLocaleString()}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             Min: {product.minOrderQty} {product.unit}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm">
//                             <span className="text-gray-500">Stock: </span>
//                             <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-900'}>
//                               {product.stock} {product.unit}s
//                             </span>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
//                               className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Edit className="w-3 h-3" />
//                               <span>Edit</span>
//                             </button>
//                             <button
//                               onClick={() => setShowDeleteConfirm(product._id!)}
//                               className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition flex items-center space-x-1"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               <span>Delete</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {!isLoading && filteredProducts.length === 0 && (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//                   <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
//                   <p className="text-gray-400 mb-4">Get started by adding your first product</p>
//                   <button
//                     onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add Product</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== ORDERS TAB ==================== */}
//           {activeTab === 'orders' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search orders..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {orders.map((order) => (
//                   <div
//                     key={order.id}
//                     className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <div className="flex items-center space-x-3 mb-2">
//                           <span className="font-semibold text-gray-800">Order #{order.id}</span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                             {order.status.toUpperCase()}
//                           </span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
//                             {order.paymentStatus.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600">Customer: {order.userName}</p>
//                         <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-2xl font-bold text-gray-800">
//                           ₹{order.totalAmount.toLocaleString()}
//                         </p>
//                         {order.trackingId && (
//                           <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingId}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4 mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
//                       <div className="space-y-2">
//                         {order.products.map((product, idx) => (
//                           <div key={idx} className="flex justify-between text-sm">
//                             <span>{product.productName} x {product.quantity}</span>
//                             <span className="font-medium">
//                               ₹{(product.price * product.quantity).toLocaleString()}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="border-t pt-4">
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm text-gray-600">
//                           <p>Shipping to: {order.shippingAddress}</p>
//                           {order.verifiedBy && (
//                             <p className="text-xs text-green-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Verified by {order.verifiedBy} on {order.verifiedDate}
//                             </p>
//                           )}
//                           {order.deliveredDate && (
//                             <p className="text-xs text-blue-600 mt-1">
//                               <Check className="w-3 h-3 inline mr-1" />
//                               Delivered on {order.deliveredDate}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex space-x-2">
//                           {order.status === 'pending' && (
//                             <button
//                               onClick={() => handleVerifyOrder(order.id)}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Verify Order</span>
//                             </button>
//                           )}
//                           {order.status === 'verified' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                             >
//                               <Package className="w-4 h-4" />
//                               <span>Start Processing</span>
//                             </button>
//                           )}
//                           {order.status === 'processing' && (
//                             <button
//                               onClick={() => {
//                                 const trackingId = prompt('Enter tracking ID:');
//                                 if (trackingId) {
//                                   setOrders(orders.map((o) =>
//                                     o.id === order.id ? { ...o, status: 'shipped', trackingId } : o
//                                   ));
//                                 }
//                               }}
//                               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
//                             >
//                               <Truck className="w-4 h-4" />
//                               <span>Mark as Shipped</span>
//                             </button>
//                           )}
//                           {order.status === 'shipped' && (
//                             <button
//                               onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               <span>Mark as Delivered</span>
//                             </button>
//                           )}
//                           <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
//                             <Eye className="w-4 h-4" />
//                             <span>View Details</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Verify Confirm Modal ── */}
//       {showVerifyModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">Verify User Documents</h2>
//                 <p className="text-sm text-gray-500 mt-1">Review and verify business documents</p>
//               </div>
//               <button onClick={() => { setShowVerifyModal(false); setSelectedUser(null); }} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">Business Information</h3>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-gray-500">Business Name</p>
//                     <p className="font-medium">{selectedUser.businessName}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">GST Number</p>
//                     <p className="font-medium">{selectedUser.gstNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Contact Person</p>
//                     <p className="font-medium">{selectedUser.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Phone</p>
//                     <p className="font-medium">{selectedUser.phone}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-gray-500">Email</p>
//                     <p className="font-medium">{selectedUser.email}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-gray-500">Address</p>
//                     <p className="font-medium">{selectedUser.address}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-medium text-gray-800 mb-2">Submitted Document</h3>
//                 <p className="text-sm text-gray-600 mb-2">Document Type: {selectedUser.documentType}</p>
//                 <div className="bg-white border rounded-lg p-4 text-center">
//                   <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">{selectedUser.documentType} Certificate</p>
//                   {selectedUser.documentUrl && (
//                     <a
//                       href={selectedUser.documentUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="mt-2 inline-flex items-center text-blue-600 text-sm hover:underline"
//                     >
//                       <Download className="w-4 h-4 mr-1" /> View Document
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t flex justify-end space-x-3">
//               <button
//                 onClick={() => { setShowVerifyModal(false); setSelectedUser(null); }}
//                 className="px-4 py-2 border rounded-lg text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={actionLoading === selectedUser._id}
//                 onClick={() => handleVerifyUser(selectedUser._id, 'verified')}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-60 flex items-center gap-2"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {actionLoading === selectedUser._id ? 'Processing...' : 'Verify & Approve'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Rejection Modal ── */}
//       {showRejectModal && rejectingUser && (
//         <RejectionModal
//           user={rejectingUser}
//           onConfirm={(reason) => handleVerifyUser(rejectingUser._id, 'rejected', reason)}
//           onClose={() => { setShowRejectModal(false); setRejectingUser(null); }}
//         />
//       )}

//       {/* ── Product Modal ── */}
//       {showProductModal && (
//         <ProductFormModal
//           product={editingProduct}
//           onSave={(productData: any) => {
//             if (editingProduct && editingProduct._id) {
//               handleEditProduct(productData);
//             } else {
//               handleAddProduct(productData);
//             }
//           }}
//           onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
//         />
//       )}

//       {/* ── Delete Confirm Modal ── */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="w-6 h-6 text-red-600" />
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Product</h3>
//               <p className="text-gray-500 text-center mb-6">
//                 Are you sure you want to delete this product? This action cannot be undone.
//               </p>
//               <div className="flex space-x-3">
//                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg">
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeleteProduct(showDeleteConfirm)}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ==================== PRODUCT FORM MODAL ====================
// function ProductFormModal({ product, onSave, onClose }: any) {
//   const [formData, setFormData] = useState({
//     name: product?.name || '',
//     price: product?.price || 0,
//     category: product?.category || '',
//     stock: product?.stock || 0,
//     description: product?.description || '',
//     images: product?.images?.length ? [...product.images, '', ''].slice(0, 3) : ['', '', ''],
//     minOrderQty: product?.minOrderQty || 1,
//     unit: product?.unit || 'kg',
//     status: product?.status || 'active',
//   });

//   const fileInputRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];

//   const categories = ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'];
//   const units = ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'];

//   const handleImageUrlChange = (index: number, value: string) => {
//     const updated = [...formData.images];
//     updated[index] = value;
//     setFormData({ ...formData, images: updated });
//   };

//   const handleFileChange = (index: number, file: File | null) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const updated = [...formData.images];
//       updated[index] = reader.result as string;
//       setFormData({ ...formData, images: updated });
//     };
//     reader.readAsDataURL(file);
//   };

//   const clearImage = (index: number) => {
//     const updated = [...formData.images];
//     updated[index] = '';
//     setFormData({ ...formData, images: updated });
//     if (fileInputRefs[index].current) fileInputRefs[index].current!.value = '';
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const filledImages = formData.images.filter((img) => img.trim() !== '');
//     if (filledImages.length === 0) {
//       alert('Please add at least one image (URL or upload).');
//       return;
//     }
//     onSave({ ...formData, images: filledImages });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
//           <div>
//             <label className="block text-sm font-medium mb-1">Product Name *</label>
//             <input
//               type="text"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Price (₹) *</label>
//               <input
//                 type="number"
//                 required
//                 min={0}
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Stock *</label>
//               <input
//                 type="number"
//                 required
//                 min={0}
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Category *</label>
//               <select
//                 required
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select</option>
//                 {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Unit</label>
//               <select
//                 value={formData.unit}
//                 onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Min Order Quantity</label>
//             <input
//               type="number"
//               required
//               min={1}
//               value={formData.minOrderQty}
//               onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               rows={3}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Images <span className="text-gray-400 font-normal text-xs">(up to 3 — paste URL or upload file)</span>
//             </label>
//             <div className="space-y-3">
//               {[0, 1, 2].map((index) => (
//                 <div key={index} className="border rounded-xl p-3 bg-gray-50">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                       Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
//                     </span>
//                     {formData.images[index] && (
//                       <button
//                         type="button"
//                         onClick={() => clearImage(index)}
//                         className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
//                       >
//                         <X className="w-3 h-3" /> Clear
//                       </button>
//                     )}
//                   </div>
//                   {formData.images[index] && (
//                     <div className="mb-2 rounded-lg overflow-hidden border bg-white h-28 flex items-center justify-center">
//                       <img src={formData.images[index]} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
//                     </div>
//                   )}
//                   <input
//                     type="url"
//                     placeholder="Paste image URL (https://...)"
//                     value={formData.images[index].startsWith('data:') ? '' : formData.images[index]}
//                     onChange={(e) => handleImageUrlChange(index, e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   />
//                   <div className="flex items-center gap-2 my-2">
//                     <div className="flex-1 border-t border-gray-200" />
//                     <span className="text-xs text-gray-400">or</span>
//                     <div className="flex-1 border-t border-gray-200" />
//                   </div>
//                   <input
//                     ref={fileInputRefs[index]}
//                     type="file"
//                     accept="image/png,image/jpeg,image/jpg,image/webp"
//                     className="hidden"
//                     onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRefs[index].current?.click()}
//                     className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition flex items-center justify-center gap-2"
//                   >
//                     <ImagePlus className="w-4 h-4" />
//                     Upload PNG / JPG / WEBP
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           <div className="flex justify-end space-x-3 pt-2">
//             <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//               Cancel
//             </button>
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//               {product ? 'Update Product' : 'Add Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }