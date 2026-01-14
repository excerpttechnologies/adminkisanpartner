




// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   DocumentTextIcon, 
//   ArrowLeftIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ArrowDownTrayIcon as DownloadIcon,
//   MagnifyingGlassIcon, 
//   FunnelIcon, 
//   XMarkIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   CurrencyRupeeIcon,
//   ShoppingBagIcon,
//   UserIcon,
//   CalendarIcon,
//   TagIcon
// } from '@heroicons/react/24/outline';
// import { useRouter } from 'next/navigation';

// interface ReportData {
//   _id: string;
//   productId: string;
//   farmerId: string;
//   traderId: string;
//   traderName: string;
//   quantity: number;
//   pricePerUnit: number;
//   totalAmount: number;
//   purchaseType: 'direct' | 'offer_accepted';
//   paymentStatus: 'pending' | 'paid';
//   purchaseDate: string;
//   orderCreated: boolean;
//   orderId: string | null;
//   grade: string;
//   createdAt: string;
// }

// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   limit: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// interface Filters {
//   search: string;
//   paymentStatus: string;
//   purchaseType: string;
//   dateFrom: string;
//   dateTo: string;
// }

// export default function FarmerAcceptReport() {
//   const router = useRouter();
//   const [reportData, setReportData] = useState<ReportData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     currentPage: 1,
//     totalPages: 1,
//     totalCount: 0,
//     limit: 10,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
//   const [limit, setLimit] = useState<number>(10);
//   const [stats, setStats] = useState({
//     totalAcceptedOffers: 0,
//     totalQuantity: 0,
//     totalAmount: 0,
//     paidAmount: 0,
//     pendingAmount: 0
//   });
//   const [filters, setFilters] = useState<Filters>({
//     search: '',
//     paymentStatus: 'all',
//     purchaseType: 'all',
//     dateFrom: '',
//     dateTo: ''
//   });
//   const [showFilters, setShowFilters] = useState<boolean>(false);

//   useEffect(() => {
//     fetchReportData(pagination.currentPage, limit);
//   }, [pagination.currentPage, limit]);

//   const fetchReportData = async (page: number, limit: number): Promise<void> => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString()
//       });

//       if (filters.search) params.append('search', filters.search);
//       if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
//       if (filters.purchaseType !== 'all') params.append('purchaseType', filters.purchaseType);
//       if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
//       if (filters.dateTo) params.append('dateTo', filters.dateTo);

//       const response = await fetch(`/api/farmer-accept-report?${params.toString()}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch report data');
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         setReportData(data.data);
//         setPagination(data.pagination);
//         calculateStats(data.data);
//         setError(null);
//       } else {
//         throw new Error(data.error || 'Failed to fetch report data');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       console.error('Error fetching report:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (data: ReportData[]): void => {
//     const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
//     const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
//     const paidAmount = data
//       .filter(item => item.paymentStatus === 'paid')
//       .reduce((sum, item) => sum + item.totalAmount, 0);
//     const pendingAmount = data
//       .filter(item => item.paymentStatus === 'pending')
//       .reduce((sum, item) => sum + item.totalAmount, 0);

//     setStats({
//       totalAcceptedOffers: data.length,
//       totalQuantity,
//       totalAmount,
//       paidAmount,
//       pendingAmount
//     });
//   };

//   const handlePageChange = (page: number): void => {
//     setPagination(prev => ({ ...prev, currentPage: page }));
//   };

//   const handleLimitChange = (newLimit: number): void => {
//     setLimit(newLimit);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = (): void => {
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchReportData(1, limit);
//     setShowFilters(false);
//   };

//   const resetFilters = (): void => {
//     setFilters({
//       search: '',
//       paymentStatus: 'all',
//       purchaseType: 'all',
//       dateFrom: '',
//       dateTo: ''
//     });
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//     setTimeout(() => fetchReportData(1, limit), 100);
//   };

//   const exportToCSV = (): void => {
//     const headers = [
//       'Product ID',
//       'Farmer ID',
//       'Trader ID',
//       'Trader Name',
//       'Quantity',
//       'Price Per Unit',
//       'Total Amount',
//       'Purchase Type',
//       'Payment Status',
//       'Purchase Date',
//       'Order Created',
//       'Order ID',
//       'Grade'
//     ];

//     const csvData = reportData.map(item => [
//       item.productId,
//       item.farmerId,
//       item.traderId,
//       `"${item.traderName}"`,
//       item.quantity,
//       item.pricePerUnit,
//       item.totalAmount,
//       item.purchaseType,
//       item.paymentStatus,
//       new Date(item.purchaseDate).toLocaleDateString('en-CA'),
//       item.orderCreated ? 'Yes' : 'No',
//       item.orderId || 'N/A',
//       item.grade
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...csvData.map(row => row.join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `farmer-accept-report-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case 'paid': return 'text-green-700 bg-green-100 border border-green-200';
//       case 'pending': return 'text-amber-700 bg-amber-100 border border-amber-200';
//       default: return 'text-gray-700 bg-gray-100 border border-gray-200';
//     }
//   };

//   const getTypeColor = (type: string): string => {
//     switch (type) {
//       case 'offer_accepted': return 'text-purple-700 bg-purple-100 border border-purple-200';
//       case 'direct': return 'text-blue-700 bg-blue-100 border border-blue-200';
//       default: return 'text-gray-700 bg-gray-100 border border-gray-200';
//     }
//   };

//   if (loading && reportData.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//         <div className="container mx-auto px-4">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading report...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
//           >
//             <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
//             <span className="font-medium">Back</span>
//           </button>
          
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//             <div>
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm">
//                   <DocumentTextIcon className="h-7 w-7 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">Accepted Offers Report</h1>
//                   <p className="text-gray-600 mt-1">
//                     Overview of farmer accepted offers and purchases
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
//               >
//                 <FunnelIcon className="h-5 w-5" />
//                 <span className="font-medium">Filters</span>
//                 {Object.values(filters).some(f => f !== '' && f !== 'all') && (
//                   <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
//                     Active
//                   </span>
//                 )}
//               </button>
              
//               <button
//                 onClick={exportToCSV}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow"
//               >
//                 <DownloadIcon className="h-5 w-5" />
//                 <span className="font-medium">Export CSV</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 animate-fadeIn">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
//               <button
//                 onClick={() => setShowFilters(false)}
//                 className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search
//                 </label>
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="search"
//                     value={filters.search}
//                     onChange={handleFilterChange}
//                     placeholder="Search by ID, trader name..."
//                     className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Status
//                 </label>
//                 <select
//                   name="paymentStatus"
//                   value={filters.paymentStatus}
//                   onChange={handleFilterChange}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="paid">Paid</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Purchase Type
//                 </label>
//                 <select
//                   name="purchaseType"
//                   value={filters.purchaseType}
//                   onChange={handleFilterChange}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="offer_accepted">Offer Accepted</option>
//                   <option value="direct">Direct Purchase</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date Range
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="date"
//                     name="dateFrom"
//                     value={filters.dateFrom}
//                     onChange={handleFilterChange}
//                     className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
//                   />
//                   <input
//                     type="date"
//                     name="dateTo"
//                     value={filters.dateTo}
//                     onChange={handleFilterChange}
//                     className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//               <button
//                 onClick={resetFilters}
//                 className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
//               >
//                 Reset Filters
//               </button>
//               <button
//                 onClick={applyFilters}
//                 className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5 animate-fadeIn">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
//                 <XCircleIcon className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-sm font-semibold text-red-800">Error loading report</h3>
//                 <p className="text-sm text-red-700 mt-1">{error}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => fetchReportData(pagination.currentPage, limit)}
//                   className="text-sm font-medium text-red-800 hover:text-red-900 underline"
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">Total Offers</p>
//                 <p className="text-3xl font-bold text-purple-600">{stats.totalAcceptedOffers}</p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">Accepted offers</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">Total Quantity</p>
//                 <p className="text-3xl font-bold text-blue-600">{stats.totalQuantity.toLocaleString()}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <TagIcon className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">Units sold</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">Total Amount</p>
//                 <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">Gross sales</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">Paid Amount</p>
//                 <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
//               </div>
//               <div className="p-3 bg-emerald-100 rounded-lg">
//                 <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">Received payments</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">Pending Amount</p>
//                 <p className="text-3xl font-bold text-amber-600">{formatCurrency(stats.pendingAmount)}</p>
//               </div>
//               <div className="p-3 bg-amber-100 rounded-lg">
//                 <CalendarIcon className="h-6 w-6 text-amber-600" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">Awaiting payment</p>
//           </div>
//         </div>

//         {/* Report Table */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                 <tr>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Transaction Details
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Trader & Product Info
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Amount Details
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Purchase Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {reportData.map((item, index) => (
//                   <tr 
//                     key={item._id || index} 
//                     className="hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
//                   >
//                     <td className="px-6 py-5">
//                       <div className="space-y-3">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-50 border border-blue-100">
//                               <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold text-gray-900">Product ID</p>
//                               <p className="text-xs text-gray-600 font-mono mt-0.5">{item.productId}</p>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-2 mt-3">
//                             <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-purple-50 border border-purple-100">
//                               <UserIcon className="h-4 w-4 text-purple-600" />
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold text-gray-900">Farmer ID</p>
//                               <p className="text-xs text-gray-600 font-mono mt-0.5">{item.farmerId}</p>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div>
//                           <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${getTypeColor(item.purchaseType)}`}>
//                             {item.purchaseType === 'offer_accepted' ? 'Offer Accepted' : 'Direct Purchase'}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-5">
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex items-center gap-2 mb-2">
//                             <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                             <p className="text-sm font-semibold text-gray-900">Trader Information</p>
//                           </div>
//                           <p className="text-sm text-gray-900 font-medium">{item.traderName}</p>
//                           <p className="text-xs text-gray-600 mt-1">ID: {item.traderId}</p>
//                         </div>
                        
//                         <div>
//                           <div className="flex items-center gap-2 mb-2">
//                             <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                             <p className="text-sm font-semibold text-gray-900">Product Specifications</p>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <div className="text-center">
//                               <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
//                               <p className="text-xs text-gray-600">Quantity</p>
//                             </div>
//                             <div className="h-8 w-px bg-gray-200"></div>
//                             <div className="text-center">
//                               <p className="text-lg font-bold text-gray-900">₹{item.pricePerUnit.toLocaleString()}</p>
//                               <p className="text-xs text-gray-600">Price/Unit</p>
//                             </div>
//                             <div className="h-8 w-px bg-gray-200"></div>
//                             <div className="text-center">
//                               <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                                 {item.grade} Grade
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-5">
//                       <div className="space-y-4">
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900 mb-2">Total Amount</p>
//                           <div className="flex items-baseline gap-2">
//                             <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
//                             <p className="text-2xl font-bold text-green-600">
//                               {formatCurrency(item.totalAmount)}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="text-sm">
//                           <p className="text-gray-600 mb-1">Calculation</p>
//                           <p className="text-gray-800 font-medium">
//                             {item.quantity} × ₹{item.pricePerUnit.toLocaleString()}/unit
//                           </p>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-5">
//                       <div className="space-y-3">
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900 mb-2">Payment Status</p>
//                           <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(item.paymentStatus)}`}>
//                             {item.paymentStatus === 'paid' ? (
//                               <>
//                                 <CheckCircleIcon className="w-4 h-4 mr-1.5" />
//                                 Paid
//                               </>
//                             ) : (
//                               <>
//                                 <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></div>
//                                 Pending
//                               </>
//                             )}
//                           </span>
//                         </div>
                        
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900 mb-2">Order Status</p>
//                           <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
//                             item.orderCreated 
//                               ? 'bg-blue-50 text-blue-800 border border-blue-200'
//                               : 'bg-gray-100 text-gray-800 border border-gray-200'
//                           }`}>
//                             {item.orderCreated ? (
//                               <>
//                                 <CheckCircleIcon className="w-3 h-3 mr-1.5" />
//                                 Order Created
//                               </>
//                             ) : 'No Order'}
//                           </div>
//                           {item.orderId && (
//                             <p className="text-xs text-gray-600 mt-2 truncate max-w-[200px]" title={item.orderId}>
//                               Order ID: {item.orderId}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-5">
//                       <div className="space-y-3">
//                         <div>
//                           <div className="flex items-center gap-2 mb-2">
//                             <CalendarIcon className="h-4 w-4 text-gray-500" />
//                             <p className="text-sm font-semibold text-gray-900">Purchase Date</p>
//                           </div>
//                           <p className="text-sm text-gray-900 font-medium">
//                             {formatDate(item.purchaseDate)}
//                           </p>
//                         </div>
                        
//                         <div className="pt-3 border-t border-gray-100">
//                           <p className="text-xs text-gray-500">Transaction ID</p>
//                           <p className="text-xs text-gray-700 font-mono mt-0.5 truncate max-w-[180px]" title={item._id}>
//                             {item._id}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Empty State */}
//           {reportData.length === 0 && !loading && (
//             <div className="py-16 text-center">
//               <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-6">
//                 <DocumentTextIcon className="h-12 w-12 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No accepted offers found</h3>
//               <p className="text-gray-600 max-w-md mx-auto mb-6">
//                 {Object.values(filters).some(f => f !== '' && f !== 'all')
//                   ? 'No results match your current filters. Try adjusting your search criteria.'
//                   : 'There are no offers accepted by farmers at the moment.'}
//               </p>
//               {Object.values(filters).some(f => f !== '' && f !== 'all') && (
//                 <button
//                   onClick={resetFilters}
//                   className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Pagination */}
//           {reportData.length > 0 && (
//             <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
//               <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Show</span>
//                   <select
//                     value={limit}
//                     onChange={(e) => handleLimitChange(Number(e.target.value))}
//                     className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={25}>25</option>
//                     <option value={50}>50</option>
//                     <option value={100}>100</option>
//                   </select>
//                   <span className="text-sm text-gray-700">entries per page</span>
//                 </div>

//                 <div className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
//                   Showing <span className="font-semibold">{(pagination.currentPage - 1) * limit + 1}</span> to{' '}
//                   <span className="font-semibold">
//                     {Math.min(pagination.currentPage * limit, pagination.totalCount)}
//                   </span>{' '}
//                   of <span className="font-semibold">{pagination.totalCount}</span> transactions
//                 </div>

//                 <div className="flex items-center space-x-1">
//                   <button
//                     onClick={() => handlePageChange(pagination.currentPage - 1)}
//                     disabled={!pagination.hasPrevPage}
//                     className={`p-2 rounded-lg transition-all ${
//                       pagination.hasPrevPage
//                         ? 'hover:bg-white hover:shadow text-gray-700'
//                         : 'text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     <ChevronLeftIcon className="h-5 w-5" />
//                   </button>

//                   {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (pagination.totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                       pageNum = pagination.totalPages - 4 + i;
//                     } else {
//                       pageNum = pagination.currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                           pagination.currentPage === pageNum
//                             ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
//                             : 'hover:bg-white hover:shadow text-gray-700'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}

//                   <button
//                     onClick={() => handlePageChange(pagination.currentPage + 1)}
//                     disabled={!pagination.hasNextPage}
//                     className={`p-2 rounded-lg transition-all ${
//                       pagination.hasNextPage
//                         ? 'hover:bg-white hover:shadow text-gray-700'
//                         : 'text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     <ChevronRightIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Loading overlay */}
//         {loading && reportData.length > 0 && (
//           <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600 font-medium">Updating data...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
























'use client';

import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon as DownloadIcon,
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ReportData {
  _id: string;
  productId: string;
  farmerId: string;
  traderId: string;
  traderName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  purchaseType: 'direct' | 'offer_accepted';
  paymentStatus: 'pending' | 'paid';
  purchaseDate: string;
  orderCreated: boolean;
  orderId: string | null;
  grade: string;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Filters {
  search: string;
  paymentStatus: string;
  purchaseType: string;
  dateFrom: string;
  dateTo: string;
}

export default function FarmerAcceptReport() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [limit, setLimit] = useState<number>(10);
  const [stats, setStats] = useState({
    totalAcceptedOffers: 0,
    totalQuantity: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    paymentStatus: 'all',
    purchaseType: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    fetchReportData(pagination.currentPage, limit);
  }, [pagination.currentPage, limit]);

  const fetchReportData = async (page: number, limit: number): Promise<void> => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      if (filters.purchaseType !== 'all') params.append('purchaseType', filters.purchaseType);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/farmer-accept-report?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.data);
        setPagination(data.pagination);
        calculateStats(data.data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch report data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: ReportData[]): void => {
    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
    const paidAmount = data
      .filter(item => item.paymentStatus === 'paid')
      .reduce((sum, item) => sum + item.totalAmount, 0);
    const pendingAmount = data
      .filter(item => item.paymentStatus === 'pending')
      .reduce((sum, item) => sum + item.totalAmount, 0);

    setStats({
      totalAcceptedOffers: data.length,
      totalQuantity,
      totalAmount,
      paidAmount,
      pendingAmount
    });
  };

  const handlePageChange = (page: number): void => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (newLimit: number): void => {
    setLimit(newLimit);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (): void => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchReportData(1, limit);
    setShowFilters(false);
  };

  const resetFilters = (): void => {
    setFilters({
      search: '',
      paymentStatus: 'all',
      purchaseType: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setTimeout(() => fetchReportData(1, limit), 100);
  };

  const exportToCSV = (): void => {
    const headers = [
      'Product ID',
      'Farmer ID',
      'Trader ID',
      'Trader Name',
      'Quantity',
      'Price Per Unit',
      'Total Amount',
      'Purchase Type',
      'Payment Status',
      'Purchase Date',
      'Order Created',
      'Order ID',
      'Grade'
    ];

    const csvData = reportData.map(item => [
      item.productId,
      item.farmerId,
      item.traderId,
      `"${item.traderName}"`,
      item.quantity,
      item.pricePerUnit,
      item.totalAmount,
      item.purchaseType,
      item.paymentStatus,
      new Date(item.purchaseDate).toLocaleDateString('en-CA'),
      item.orderCreated ? 'Yes' : 'No',
      item.orderId || 'N/A',
      item.grade
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmer-accept-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): { bg: string; text: string; border: string } => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getTypeColor = (type: string): { bg: string; text: string; border: string } => {
    switch (type) {
      case 'offer_accepted':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'direct':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  if (loading && reportData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-sm">
                  <DocumentTextIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Accepted Offers Report</h1>
                  <p className="text-gray-600 mt-1">
                    Overview of farmer accepted offers and purchases
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
              >
                <FunnelIcon className="h-5 w-5" />
                <span className="font-medium">Filters</span>
                {Object.values(filters).some(f => f !== '' && f !== 'all') && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Active
                  </span>
                )}
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow"
              >
                <DownloadIcon className="h-5 w-5" />
                <span className="font-medium">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by ID, trader name..."
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Type
                </label>
                <select
                  name="purchaseType"
                  value={filters.purchaseType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Types</option>
                  <option value="offer_accepted">Offer Accepted</option>
                  <option value="direct">Direct Purchase</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
                  />
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5 animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-red-800">Error loading report</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => fetchReportData(pagination.currentPage, limit)}
                  className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Offers</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalAcceptedOffers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Accepted offers</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Quantity</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalQuantity.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Units sold</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Gross sales</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Paid Amount</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Received payments</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Pending Amount</p>
                <p className="text-3xl font-bold text-amber-600">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Awaiting payment</p>
          </div>
        </div>

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Transaction Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trader & Product Info
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reportData.map((item, index) => (
                  <tr 
                    key={item._id || index} 
                    className="hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-50 border border-blue-100">
                              <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Product ID</p>
                              <p className="text-xs text-gray-600 font-mono mt-0.5">{item.productId}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-purple-50 border border-purple-100">
                              <UserIcon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Farmer ID</p>
                              <p className="text-xs text-gray-600 font-mono mt-0.5">{item.farmerId}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${getTypeColor(item.purchaseType).bg} ${getTypeColor(item.purchaseType).text} ${getTypeColor(item.purchaseType).border}`}>
                            {item.purchaseType === 'offer_accepted' ? 'Offer Accepted' : 'Direct Purchase'}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <p className="text-sm font-semibold text-gray-900">Trader Information</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium">{item.traderName}</p>
                          <p className="text-xs text-gray-600 mt-1">ID: {item.traderId}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <p className="text-sm font-semibold text-gray-900">Product Specifications</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
                              <p className="text-xs text-gray-600">Quantity</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-900">₹{item.pricePerUnit.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">Price/Unit</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                {item.grade} Grade
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Total Amount</p>
                          <div className="flex items-baseline gap-2">
                            <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(item.totalAmount)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-gray-600 mb-1">Calculation</p>
                          <p className="text-gray-800 font-medium">
                            {item.quantity} × ₹{item.pricePerUnit.toLocaleString()}/unit
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Payment Status</p>
                          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(item.paymentStatus).bg} ${getStatusColor(item.paymentStatus).text} ${getStatusColor(item.paymentStatus).border}`}>
                            {item.paymentStatus === 'paid' ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                                Paid
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></div>
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Order Status</p>
                          <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                            item.orderCreated 
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {item.orderCreated ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                                Order Created
                              </>
                            ) : 'No Order'}
                          </div>
                          {item.orderId && (
                            <p className="text-xs text-gray-600 mt-2 truncate max-w-[200px]" title={item.orderId}>
                              Order ID: {item.orderId}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <p className="text-sm font-semibold text-gray-900">Purchase Date</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatDate(item.purchaseDate)}
                          </p>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Transaction ID</p>
                          <p className="text-xs text-gray-700 font-mono mt-0.5 truncate max-w-[180px]" title={item._id}>
                            {item._id}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards (visible only on mobile) */}
        <div className="lg:hidden space-y-4">
          {reportData.map((item, index) => (
            <div 
              key={item._id || index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                    <ShoppingBagIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Transaction #{index + 1}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.purchaseDate)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.paymentStatus).bg} ${getStatusColor(item.paymentStatus).text}`}>
                  {item.paymentStatus === 'paid' ? (
                    <>
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Paid
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Product ID</p>
                  <p className="text-sm font-semibold text-gray-900 truncate" title={item.productId}>
                    {item.productId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Farmer ID</p>
                  <p className="text-sm font-semibold text-gray-900 truncate" title={item.farmerId}>
                    {item.farmerId}
                  </p>
                </div>
              </div>

              {/* Trader Info */}
              <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Trader</p>
                </div>
                <p className="text-sm text-gray-900 font-medium">{item.traderName}</p>
                <p className="text-xs text-gray-600 mt-1">ID: {item.traderId}</p>
              </div>

              {/* Product Details */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <TagIcon className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-900">Product Details</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
                    <p className="text-xs text-gray-600">Quantity</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">₹{item.pricePerUnit.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Price/Unit</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{item.grade}</p>
                    <p className="text-xs text-gray-600">Grade</p>
                  </div>
                </div>
              </div>

              {/* Amount Section */}
              <div className="mb-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-semibold text-gray-900">Total Amount</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getTypeColor(item.purchaseType).bg} ${getTypeColor(item.purchaseType).text}`}>
                    {item.purchaseType === 'offer_accepted' ? 'Offer Accepted' : 'Direct'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(item.totalAmount)}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {item.quantity} × ₹{item.pricePerUnit.toLocaleString()}/unit
                </p>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Order Status</p>
                    <p className="text-xs text-gray-600">
                      {item.orderCreated ? 'Order Created' : 'No Order Created'}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${item.orderCreated ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                  {item.orderCreated ? '✓ Active' : 'Inactive'}
                </div>
              </div>

              {/* Transaction ID */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-gray-700 truncate max-w-[70%]" title={item._id}>
                    {item._id}
                  </p>
                  {item.orderId && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.orderId!)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="Copy Order ID"
                    >
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                      Copy ID
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {reportData.length === 0 && !loading && (
          <div className="py-16 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-6">
              <DocumentTextIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accepted offers found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {Object.values(filters).some(f => f !== '' && f !== 'all')
                ? 'No results match your current filters. Try adjusting your search criteria.'
                : 'There are no offers accepted by farmers at the moment.'}
            </p>
            {Object.values(filters).some(f => f !== '' && f !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {reportData.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 rounded-xl border border-gray-200 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">entries per page</span>
              </div>

              <div className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                Showing <span className="font-semibold">{(pagination.currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(pagination.currentPage * limit, pagination.totalCount)}
                </span>{' '}
                of <span className="font-semibold">{pagination.totalCount}</span> transactions
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`p-2 rounded-lg transition-all ${
                    pagination.hasPrevPage
                      ? 'hover:bg-white hover:shadow text-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        pagination.currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                          : 'hover:bg-white hover:shadow text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`p-2 rounded-lg transition-all ${
                    pagination.hasNextPage
                      ? 'hover:bg-white hover:shadow text-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && reportData.length > 0 && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Updating data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



