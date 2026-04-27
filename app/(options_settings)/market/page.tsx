



// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';

// // Add debounce utility
// const useDebounce = (value: string, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// interface Market {
//   _id: string;
//   marketId: string;
//   marketName: string;
//   pincode: string;
//   postOffice: string;
//   district: string;
//   state: string;
//   exactAddress: string;
//   landmark: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface MarketFormData {
//   marketName: string;
//   pincode: string;
//   postOffice: string;
//   district: string;
//   state: string;
//   exactAddress: string;
//   landmark: string;
// }

// // Interface for pincode API response
// interface PincodeData {
//   district: string;
//   state: string;
//   postOffice?: string;
//   taluk?: string;
// }

// const Market: React.FC = () => {
//   const [markets, setMarkets] = useState<Market[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddModal, setShowAddModal] = useState<boolean>(false);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
//   const [showViewModal, setShowViewModal] = useState<boolean>(false);
//   const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
//   const [formData, setFormData] = useState<MarketFormData>({
//     marketName: '',
//     pincode: '',
//     postOffice: '',
//     district: '',
//     state: '',
//     exactAddress: '',
//     landmark: '',
//   });
//   const [operationLoading, setOperationLoading] = useState<boolean>(false);
//   const [operationError, setOperationError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // State for pincode auto-fetch
//   const [isFetchingPincode, setIsFetchingPincode] = useState<boolean>(false);
//   const [pincodeError, setPincodeError] = useState<string | null>(null);
  
//   // Debounce pincode input
//   const debouncedPincode = useDebounce(formData.pincode, 800);

//   // Function to fetch location data from pincode
//   const fetchLocationFromPincode = useCallback(async (pincode: string) => {
//     if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
//       return;
//     }

//     setIsFetchingPincode(true);
//     setPincodeError(null);

//     try {
//       // India Post Pincode API
//       const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      
//       console.log(`Fetching pincode data from: ${apiUrl}`);
//       const response = await fetch(apiUrl, {
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API returned status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Pincode API response:', data);
      
//       // Parse India Post API response
//       if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
//         const postOffice = data[0].PostOffice[0];
//         const pincodeData: PincodeData = {
//           district: postOffice.District,
//           state: postOffice.State,
//           postOffice: postOffice.Name,
//           taluk: postOffice.Block || postOffice.District
//         };
        
//         // Update form data with fetched location
//         setFormData(prev => ({
//           ...prev,
//           district: pincodeData.district,
//           state: pincodeData.state,
//           postOffice: pincodeData.postOffice || prev.postOffice,
//         }));
//         setPincodeError(null);
//       } else {
//         setPincodeError('Could not fetch location for this pincode. Please enter manually.');
//       }
//     } catch (err: any) {
//       console.error('Pincode fetch error:', err);
//       setPincodeError('Failed to fetch location data. Please enter manually.');
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   }, []);

//   // Effect to trigger pincode lookup when debounced pincode changes
//   useEffect(() => {
//     if (debouncedPincode && debouncedPincode.length === 6 && /^\d+$/.test(debouncedPincode)) {
//       // Only fetch if district is not already filled (to avoid overwriting manual input)
//       if (!formData.district || formData.district.trim() === '') {
//         fetchLocationFromPincode(debouncedPincode);
//       }
//     }
//   }, [debouncedPincode, fetchLocationFromPincode, formData.district]);

//   // TEST: First check if our API is working
//   const testLocalAPI = async () => {
//     try {
//       console.log('Testing local API...');
//       const response = await fetch('/api/marketapi');
//       console.log('API Response status:', response.status);
//       const data = await response.json();
//       console.log('API Response data:', data);
//       return response.ok;
//     } catch (error) {
//       console.error('Local API test failed:', error);
//       return false;
//     }
//   };

//   // Fetch from local API
//   const fetchFromLocalAPI = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('Fetching from local API...');
//       const response = await fetch('/api/marketapi');
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Local API data:', data);
      
//       if (data.success && Array.isArray(data.markets)) {
//         setMarkets(data.markets);
//       } else {
//         setMarkets([]);
//         console.warn('No markets array in response:', data);
//       }
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch from local API');
//       console.error('Fetch error:', err);
      
//       // Fallback to external API if local fails
//       await fetchFromExternalAPI();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch from external API (fallback)
//   const fetchFromExternalAPI = async () => {
//     try {
//       console.log('Trying external API...');
//       const response = await fetch('https://kisan.etpl.ai/api/market/all');
      
//       if (!response.ok) {
//         throw new Error(`External API: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('External API data:', data);
      
//       if (data.markets && Array.isArray(data.markets)) {
//         // Transform external API data to match our format
//         const transformedMarkets = data.markets.map((market: any) => ({
//           _id: market._id?.$oid || market.marketId,
//           marketId: market.marketId,
//           marketName: market.marketName,
//           pincode: market.pincode,
//           postOffice: market.postOffice,
//           district: market.district,
//           state: market.state,
//           exactAddress: market.exactAddress,
//           landmark: market.landmark || '',
//           createdAt: market.createdAt?.$date || new Date().toISOString(),
//           updatedAt: market.updatedAt?.$date || new Date().toISOString(),
//           __v: market.__v || 0
//         }));
//         setMarkets(transformedMarkets);
//       }
//     } catch (err: any) {
//       console.error('External API error:', err);
//       setError('Both local and external APIs failed');
//     }
//   };

//   useEffect(() => {
//     // Test API first
//     testLocalAPI().then(isWorking => {
//       if (isWorking) {
//         fetchFromLocalAPI();
//       } else {
//         setError('Local API not working. Check if MongoDB is connected.');
//         fetchFromExternalAPI();
//       }
//     });
//   }, []);

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       });
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };

//   // Filter and pagination logic
//   const filteredMarkets = markets.filter(market =>
//     market.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     market.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     market.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     market.pincode.includes(searchTerm)
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentMarkets = filteredMarkets.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage);

//   const handlePageChange = (page: number) => setCurrentPage(page);
//   const handleItemsPerPageChange = (value: number) => {
//     setItemsPerPage(value);
//     setCurrentPage(1);
//   };

//   const handleViewMarket = (market: Market) => {
//     setSelectedMarket(market);
//     setShowViewModal(true);
//   };

//   // Add Market
//   const handleAddMarket = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setOperationLoading(true);
//       setOperationError(null);

//       console.log('Adding market with data:', formData);
      
//       const response = await fetch('/api/marketapi', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       console.log('Add response status:', response.status);
//       const result = await response.json();
//       console.log('Add response data:', result);

//       if (!response.ok) {
//         throw new Error(result.error || result.details || 'Failed to add market');
//       }

//       setSuccessMessage('Market added successfully!');
//       setShowAddModal(false);
//       resetFormData();
      
//       // Refresh the list
//       fetchFromLocalAPI();
      
//       setTimeout(() => {
//         setSuccessMessage(null);
//       }, 3000);
//     } catch (err: any) {
//       const errorMsg = err.message || 'Failed to add market';
//       setOperationError(errorMsg);
//       console.error('Add market error:', err);
//     } finally {
//       setOperationLoading(false);
//     }
//   };

//   // Edit Market
//   const handleEditMarket = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedMarket) return;

//     try {
//       setOperationLoading(true);
//       setOperationError(null);

//       console.log('Editing market ID:', selectedMarket._id);
//       console.log('Edit data:', formData);
      
//       const response = await fetch(`/api/marketapi/${selectedMarket._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       console.log('Edit response status:', response.status);
//       const result = await response.json();
//       console.log('Edit response data:', result);

//       if (!response.ok) {
//         throw new Error(result.error || result.details || 'Failed to update market');
//       }

//       setSuccessMessage('Market updated successfully!');
//       setShowEditModal(false);
//       resetFormData();
//       fetchFromLocalAPI();
      
//       setTimeout(() => {
//         setSuccessMessage(null);
//       }, 3000);
//     } catch (err: any) {
//       setOperationError(err.message || 'Failed to update market');
//       console.error('Edit market error:', err);
//     } finally {
//       setOperationLoading(false);
//     }
//   };

//   // Delete Market
//   const handleDeleteMarket = async () => {
//     if (!selectedMarket) return;

//     try {
//       setOperationLoading(true);
//       setOperationError(null);

//       console.log('Deleting market ID:', selectedMarket._id);
      
//       const response = await fetch(`/api/marketapi/${selectedMarket._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Delete response status:', response.status);
//       const result = await response.json();
//       console.log('Delete response data:', result);

//       if (!response.ok) {
//         throw new Error(result.error || result.details || 'Failed to delete market');
//       }

//       setSuccessMessage('Market deleted successfully!');
//       setShowDeleteModal(false);
//       setSelectedMarket(null);
//       fetchFromLocalAPI();
      
//       setTimeout(() => {
//         setSuccessMessage(null);
//       }, 3000);
//     } catch (err: any) {
//       setOperationError(err.message || 'Failed to delete market');
//       console.error('Delete market error:', err);
//     } finally {
//       setOperationLoading(false);
//     }
//   };

//   const resetFormData = () => {
//     setFormData({
//       marketName: '',
//       pincode: '',
//       postOffice: '',
//       district: '',
//       state: '',
//       exactAddress: '',
//       landmark: '',
//     });
//     setPincodeError(null);
//   };

//   const openAddModal = () => {
//     resetFormData();
//     setShowAddModal(true);
//     setOperationError(null);
//   };

//   const openEditModal = (market: Market) => {
//     console.log('Opening edit for market:', market);
//     setSelectedMarket(market);
//     setFormData({
//       marketName: market.marketName,
//       pincode: market.pincode,
//       postOffice: market.postOffice,
//       district: market.district,
//       state: market.state,
//       exactAddress: market.exactAddress,
//       landmark: market.landmark || '',
//     });
//     setShowEditModal(true);
//     setOperationError(null);
//     setPincodeError(null);
//   };

//   const openDeleteModal = (market: Market) => {
//     console.log('Opening delete for market:', market);
//     setSelectedMarket(market);
//     setShowDeleteModal(true);
//     setOperationError(null);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // Clear pincode error when user starts typing
//     if (name === 'pincode') {
//       setPincodeError(null);
//       // Clear location fields if pincode is being cleared or changed
//       if (!value && formData.pincode.length === 6) {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value,
//           district: '',
//           state: '',
//           postOffice: ''
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // Manual fetch location button handler
//   const handleManualFetchLocation = () => {
//     if (formData.pincode && formData.pincode.length === 6 && /^\d+$/.test(formData.pincode)) {
//       fetchLocationFromPincode(formData.pincode);
//     } else {
//       setPincodeError('Please enter a valid 6-digit pincode');
//     }
//   };

//   // Refresh function
//   const refreshData = () => {
//     fetchFromLocalAPI();
//     setCurrentPage(1);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
//         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//         <span className="text-gray-600">Loading markets...</span>
//         <button
//           onClick={refreshData}
//           className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
//         <div className="flex items-start">
//           <div className="text-red-500 mr-3 mt-1">
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//               <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-red-800">
//               Error loading markets
//             </h3>
//             <p className="mt-1 text-red-700">
//               {error}
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={refreshData}
//             className="px-4 py-2 text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
//           >
//             Try Again
//           </button>
//           <button
//             onClick={openAddModal}
//             className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Add First Market
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Success Message */}
//       {successMessage && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             {successMessage}
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//         <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold">Market Management</h2>
//               <p className="text-gray-300 mt-2">Manage all markets in the system</p>
//             </div>
//             <button
//               onClick={openAddModal}
//               className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
//             >
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add New Market
//               </div>
//             </button>
//           </div>
//         </div>

//         <div className="px-4 md:px-6 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//             <div className="flex-1">
//               <div className="relative">
//                 <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search by market name, district, state, or pincode..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={refreshData}
//                 className="px-4 py-2.5 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//               {/* <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">Show:</span>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                 </select>
//                 <span className="text-sm text-gray-600">entries</span>
//               </div> */}
//             </div>
//           </div>

//           {/* Market Table */}
//           <div className="overflow-x-auto rounded-xl border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Market</th>
//                   <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
//                   <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
//                   <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
//                   <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentMarkets.length > 0 ? (
//                   currentMarkets.map((market) => (
//                     <tr key={market._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 md:px-6 py-4">
//                         <div>
//                           <div className="font-semibold text-gray-900">{market.marketName}</div>
//                           <div className="text-sm text-gray-500">ID: {market.marketId}</div>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-4">
//                         <div>
//                           <div className="font-medium text-gray-900">{market.district}, {market.state}</div>
//                           <div className="text-sm text-gray-500">
//                             {market.postOffice} - {market.pincode}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-4">
//                         <div className="max-w-xs">
//                           <div className="text-sm text-gray-900 truncate">{market.exactAddress}</div>
//                           {market.landmark && (
//                             <div className="text-sm text-gray-500">Landmark: {market.landmark}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
//                         {formatDate(market.createdAt)}
//                       </td>
//                       <td className="px-4 md:px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleViewMarket(market)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="View"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => openEditModal(market)}
//                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => openDeleteModal(market)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-4 md:px-6 py-12 text-center">
//                       <div className="text-gray-500">
//                         <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                         </svg>
//                         <p className="mt-4 text-lg">No markets found</p>
//                         <p className="mt-2">Try adding a new market or adjust your search</p>
//                         <button
//                           onClick={openAddModal}
//                           className="mt-4 px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                           Add First Market
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {filteredMarkets.length > 0 && (
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
//               {/* Bottom Left: Items Per Page Control */}
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <span>Show</span>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//                 <span>entries per page</span>
//               </div>
              
//               {/* Bottom Right: Page Info and Navigation */}
//               <div className="flex flex-col md:flex-row items-center gap-4">
//                 <div className="text-sm text-gray-600">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMarkets.length)} of {filteredMarkets.length} entries
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1.5 min-w-[40px] border rounded-lg transition-colors ${
//                         currentPage === page
//                           ? 'bg-blue-600 text-white border-blue-600'
//                           : 'border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Market Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
//           <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-lg w-full transform animate-slideUp mx-2">
//             <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg md:text-2xl font-bold">Add New Market</h3>
//                   <p className="text-gray-300 mt-1 text-xs md:text-sm">Add a new market to the system</p>
//                 </div>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
//                 >
//                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 md:p-8">
//               {operationError && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm">
//                     <strong>Error:</strong> {operationError}
//                   </p>
//                 </div>
//               )}

//               <form onSubmit={handleAddMarket} className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Market Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="marketName"
//                     value={formData.marketName}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Pincode *
//                       <span className="ml-2 text-xs text-blue-600">
//                         (Auto-fetches location)
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={formData.pincode}
//                         onChange={handleInputChange}
//                         required
//                         maxLength={6}
//                         pattern="\d{6}"
//                         className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base pr-24"
//                         placeholder="6-digit pincode"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleManualFetchLocation}
//                         disabled={isFetchingPincode || !formData.pincode || formData.pincode.length !== 6}
//                         className="absolute right-1 top-1 px-2 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         {isFetchingPincode ? 'Fetching...' : 'Fetch Location'}
//                       </button>
//                     </div>
//                     {isFetchingPincode && (
//                       <div className="mt-1 text-xs text-blue-600 flex items-center">
//                         <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         Fetching location...
//                       </div>
//                     )}
//                     {pincodeError && (
//                       <div className="mt-1 text-xs text-red-600 flex items-center">
//                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                         </svg>
//                         {pincodeError}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Post Office *
//                     </label>
//                     <input
//                       type="text"
//                       name="postOffice"
//                       value={formData.postOffice}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       District *
//                     </label>
//                     <input
//                       type="text"
//                       name="district"
//                       value={formData.district}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Exact Address *
//                   </label>
//                   <textarea
//                     name="exactAddress"
//                     value={formData.exactAddress}
//                     onChange={handleInputChange}
//                     required
//                     rows={2}
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Landmark
//                   </label>
//                   <input
//                     type="text"
//                     name="landmark"
//                     value={formData.landmark}
//                     onChange={handleInputChange}
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={operationLoading}
//                     className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm md:text-base"
//                   >
//                     {operationLoading ? 'Adding...' : 'Add Market'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Market Modal */}
//       {showEditModal && selectedMarket && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
// <div className="bg-white rounded-xl md:rounded-2xl 
//   max-w-full md:max-w-lg w-full 
//   max-h-[85vh] overflow-hidden 
//   transform animate-slideUp mx-2">            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg md:text-2xl font-bold">Edit Market</h3>
//                   <p className="text-gray-300 mt-1 text-xs md:text-sm">Update market details</p>
//                 </div>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
//                 >
//                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

// <div className="p-4 md:p-6 overflow-y-auto max-h-[70vh]">              {operationError && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm">{operationError}</p>
//                 </div>
//               )}

//               <form onSubmit={handleEditMarket} className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Market Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="marketName"
//                     value={formData.marketName}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Pincode *
//                       <span className="ml-2 text-xs text-blue-600">
//                         (Auto-fetches location)
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={formData.pincode}
//                         onChange={handleInputChange}
//                         required
//                         maxLength={6}
//                         pattern="\d{6}"
//                         className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base pr-24"
//                         placeholder="6-digit pincode"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleManualFetchLocation}
//                         disabled={isFetchingPincode || !formData.pincode || formData.pincode.length !== 6}
//                         className="absolute right-1 top-1 px-2 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         {isFetchingPincode ? 'Fetching...' : 'Fetch Location'}
//                       </button>
//                     </div>
//                     {isFetchingPincode && (
//                       <div className="mt-1 text-xs text-blue-600 flex items-center">
//                         <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         Fetching location...
//                       </div>
//                     )}
//                     {pincodeError && (
//                       <div className="mt-1 text-xs text-red-600 flex items-center">
//                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                         </svg>
//                         {pincodeError}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Post Office *
//                     </label>
//                     <input
//                       type="text"
//                       name="postOffice"
//                       value={formData.postOffice}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       District *
//                     </label>
//                     <input
//                       type="text"
//                       name="district"
//                       value={formData.district}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Exact Address *
//                   </label>
//                   <textarea
//                     name="exactAddress"
//                     value={formData.exactAddress}
//                     onChange={handleInputChange}
//                     required
//                     rows={2}
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Landmark
//                   </label>
//                   <input
//                     type="text"
//                     name="landmark"
//                     value={formData.landmark}
//                     onChange={handleInputChange}
//                     className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={operationLoading}
//                     className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm md:text-base"
//                   >
//                     {operationLoading ? 'Updating...' : 'Update Market'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Market Modal */}
//       {showViewModal && selectedMarket && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
//          <div className="bg-white rounded-xl md:rounded-2xl 
//   max-w-full md:max-w-lg w-full 
//   max-h-[85vh] overflow-hidden 
//   transform animate-slideUp mx-2">
//             <div className="px-4 md:px-8 py-4 md:py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg md:text-2xl font-bold">Market Details</h3>
//                   <p className="text-gray-300 mt-1 text-xs md:text-sm">View complete market information</p>
//                 </div>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
//                 >
//                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

// <div className="p-4 md:p-6 overflow-y-auto max-h-[70vh]">              <div className="space-y-6">
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">Basic Information</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Market Name</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.marketName}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Market ID</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.marketId}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">Location Details</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Pincode</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.pincode}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Post Office</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.postOffice}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">District</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.district}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">State</label>
//                       <p className="text-gray-900 font-medium">{selectedMarket.state}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">Address</h4>
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Exact Address</label>
//                     <p className="text-gray-900">{selectedMarket.exactAddress}</p>
//                   </div>
//                   {selectedMarket.landmark && (
//                     <div className="mt-3">
//                       <label className="block text-sm text-gray-600 mb-1">Landmark</label>
//                       <p className="text-gray-900">{selectedMarket.landmark}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">Metadata</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Created Date</label>
//                       <p className="text-gray-900">{formatDate(selectedMarket.createdAt)}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Last Updated</label>
//                       <p className="text-gray-900">{formatDate(selectedMarket.updatedAt)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="w-full px-6 py-3 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedMarket && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
//           <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-md w-full transform animate-slideUp mx-2">
//             <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-xl md:rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg md:text-2xl font-bold">Delete Market</h3>
//                   <p className="text-red-200 mt-1 text-xs md:text-sm">This action cannot be undone</p>
//                 </div>
//                 <button
//                   onClick={() => setShowDeleteModal(false)}
//                   className="p-1 md:p-2 hover:bg-red-700/50 rounded-lg md:rounded-xl transition-colors"
//                 >
//                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 md:p-8">
//               {operationError && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm">{operationError}</p>
//                 </div>
//               )}

//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//                   <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                 </div>
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h4>
//                 <p className="text-gray-600">
//                   You are about to delete <span className="font-semibold text-red-600">{selectedMarket.marketName}</span>.
//                   This action cannot be undone.
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h5 className="font-medium text-gray-700 mb-2">Market Details:</h5>
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="text-gray-600">Name:</div>
//                     <div className="font-medium">{selectedMarket.marketName}</div>
//                     <div className="text-gray-600">Location:</div>
//                     <div className="font-medium">{selectedMarket.district}, {selectedMarket.state}</div>
//                     <div className="text-gray-600">Pincode:</div>
//                     <div className="font-medium">{selectedMarket.pincode}</div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleDeleteMarket}
//                     disabled={operationLoading}
//                     className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 text-sm md:text-base"
//                   >
//                     {operationLoading ? 'Deleting...' : 'Delete Market'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Market;



















//updated by sagar
'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Add debounce utility
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface Market {
  _id: string;
  marketId: string;
  marketName: string;
  pincode: string;
  postOffice: string;
  district: string;
  state: string;
  exactAddress: string;
  landmark: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MarketFormData {
  marketName: string;
  pincode: string;
  postOffice: string;
  district: string;
  state: string;
  exactAddress: string;
  landmark: string;
}

// Interface for pincode API response
interface PincodeData {
  district: string;
  state: string;
  postOffice?: string;
  taluk?: string;
}

const Market: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [formData, setFormData] = useState<MarketFormData>({
    marketName: '',
    pincode: '',
    postOffice: '',
    district: '',
    state: '',
    exactAddress: '',
    landmark: '',
  });
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // State for pincode auto-fetch
  const [isFetchingPincode, setIsFetchingPincode] = useState<boolean>(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  
  // Debounce pincode input
  const debouncedPincode = useDebounce(formData.pincode, 800);

  // Function to fetch location data from pincode
  const fetchLocationFromPincode = useCallback(async (pincode: string) => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return;
    }

    setIsFetchingPincode(true);
    setPincodeError(null);

    try {
      // India Post Pincode API
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      
      console.log(`Fetching pincode data from: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Pincode API response:', data);
      
      // Parse India Post API response
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const pincodeData: PincodeData = {
          district: postOffice.District,
          state: postOffice.State,
          postOffice: postOffice.Name,
          taluk: postOffice.Block || postOffice.District
        };
        
        // Update form data with fetched location
        setFormData(prev => ({
          ...prev,
          district: pincodeData.district,
          state: pincodeData.state,
          postOffice: pincodeData.postOffice || prev.postOffice,
        }));
        setPincodeError(null);
      } else {
        setPincodeError('Could not fetch location for this pincode. Please enter manually.');
      }
    } catch (err: any) {
      console.error('Pincode fetch error:', err);
      setPincodeError('Failed to fetch location data. Please enter manually.');
    } finally {
      setIsFetchingPincode(false);
    }
  }, []);

  // Effect to trigger pincode lookup when debounced pincode changes
  useEffect(() => {
    if (debouncedPincode && debouncedPincode.length === 6 && /^\d+$/.test(debouncedPincode)) {
      // Only fetch if district is not already filled (to avoid overwriting manual input)
      if (!formData.district || formData.district.trim() === '') {
        fetchLocationFromPincode(debouncedPincode);
      }
    }
  }, [debouncedPincode, fetchLocationFromPincode, formData.district]);

  // TEST: First check if our API is working
  const testLocalAPI = async () => {
    try {
      console.log('Testing local API...');
      const response = await fetch('/api/marketapi');
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      return response.ok;
    } catch (error) {
      console.error('Local API test failed:', error);
      return false;
    }
  };

  // Fetch from local API
  const fetchFromLocalAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from local API...');
      const response = await fetch('/api/marketapi');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Local API data:', data);
      
      if (data.success && Array.isArray(data.markets)) {
        setMarkets(data.markets);
      } else {
        setMarkets([]);
        console.warn('No markets array in response:', data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch from local API');
      console.error('Fetch error:', err);
      
      // Fallback to external API if local fails
      await fetchFromExternalAPI();
    } finally {
      setLoading(false);
    }
  };

  // Fetch from external API (fallback)
  const fetchFromExternalAPI = async () => {
    try {
      console.log('Trying external API...');
      const response = await fetch('https://kisan.etpl.ai/api/market/all');
      
      if (!response.ok) {
        throw new Error(`External API: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('External API data:', data);
      
      if (data.markets && Array.isArray(data.markets)) {
        // Transform external API data to match our format
        const transformedMarkets = data.markets.map((market: any) => ({
          _id: market._id?.$oid || market.marketId,
          marketId: market.marketId,
          marketName: market.marketName,
          pincode: market.pincode,
          postOffice: market.postOffice,
          district: market.district,
          state: market.state,
          exactAddress: market.exactAddress,
          landmark: market.landmark || '',
          createdAt: market.createdAt?.$date || new Date().toISOString(),
          updatedAt: market.updatedAt?.$date || new Date().toISOString(),
          __v: market.__v || 0
        }));
        setMarkets(transformedMarkets);
      }
    } catch (err: any) {
      console.error('External API error:', err);
      setError('Both local and external APIs failed');
    }
  };

  useEffect(() => {
    // Test API first
    testLocalAPI().then(isWorking => {
      if (isWorking) {
        fetchFromLocalAPI();
      } else {
        setError('Local API not working. Check if MongoDB is connected.');
        fetchFromExternalAPI();
      }
    });
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Filter and pagination logic
  const filteredMarkets = markets.filter(market =>
    market.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.pincode.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMarkets = filteredMarkets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleViewMarket = (market: Market) => {
    setSelectedMarket(market);
    setShowViewModal(true);
  };

  // Add Market
  const handleAddMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setOperationLoading(true);
      setOperationError(null);

      console.log('Adding market with data:', formData);
      
      const response = await fetch('/api/marketapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Add response status:', response.status);
      const result = await response.json();
      console.log('Add response data:', result);

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to add market');
      }

      setSuccessMessage('Market added successfully!');
      setShowAddModal(false);
      resetFormData();
      
      // Refresh the list
      fetchFromLocalAPI();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add market';
      setOperationError(errorMsg);
      console.error('Add market error:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  // Edit Market
  const handleEditMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarket) return;

    try {
      setOperationLoading(true);
      setOperationError(null);

      console.log('Editing market ID:', selectedMarket._id);
      console.log('Edit data:', formData);
      
      const response = await fetch(`/api/marketapi/${selectedMarket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Edit response status:', response.status);
      const result = await response.json();
      console.log('Edit response data:', result);

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to update market');
      }

      setSuccessMessage('Market updated successfully!');
      setShowEditModal(false);
      resetFormData();
      fetchFromLocalAPI();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setOperationError(err.message || 'Failed to update market');
      console.error('Edit market error:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete Market
  const handleDeleteMarket = async () => {
    if (!selectedMarket) return;

    try {
      setOperationLoading(true);
      setOperationError(null);

      console.log('Deleting market ID:', selectedMarket._id);
      
      const response = await fetch(`/api/marketapi/${selectedMarket._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      const result = await response.json();
      console.log('Delete response data:', result);

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to delete market');
      }

      setSuccessMessage('Market deleted successfully!');
      setShowDeleteModal(false);
      setSelectedMarket(null);
      fetchFromLocalAPI();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setOperationError(err.message || 'Failed to delete market');
      console.error('Delete market error:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      marketName: '',
      pincode: '',
      postOffice: '',
      district: '',
      state: '',
      exactAddress: '',
      landmark: '',
    });
    setPincodeError(null);
  };

  const openAddModal = () => {
    resetFormData();
    setShowAddModal(true);
    setOperationError(null);
  };

  const openEditModal = (market: Market) => {
    console.log('Opening edit for market:', market);
    setSelectedMarket(market);
    setFormData({
      marketName: market.marketName,
      pincode: market.pincode,
      postOffice: market.postOffice,
      district: market.district,
      state: market.state,
      exactAddress: market.exactAddress,
      landmark: market.landmark || '',
    });
    setShowEditModal(true);
    setOperationError(null);
    setPincodeError(null);
  };

  const openDeleteModal = (market: Market) => {
    console.log('Opening delete for market:', market);
    setSelectedMarket(market);
    setShowDeleteModal(true);
    setOperationError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear pincode error when user starts typing
    if (name === 'pincode') {
      setPincodeError(null);
      // Clear location fields if pincode is being cleared or changed
      if (!value && formData.pincode.length === 6) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          district: '',
          state: '',
          postOffice: ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manual fetch location button handler
  const handleManualFetchLocation = () => {
    if (formData.pincode && formData.pincode.length === 6 && /^\d+$/.test(formData.pincode)) {
      fetchLocationFromPincode(formData.pincode);
    } else {
      setPincodeError('Please enter a valid 6-digit pincode');
    }
  };

  // Refresh function
  const refreshData = () => {
    fetchFromLocalAPI();
    setCurrentPage(1);
  };

  // Shared form fields JSX (used in both Add and Edit modals)
  const renderFormFields = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Market Name *
        </label>
        <input
          type="text"
          name="marketName"
          value={formData.marketName}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
          placeholder="Enter market name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Pincode *
            <span className="ml-1 text-xs font-normal text-blue-600">(Auto-fetches location)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
              maxLength={6}
              pattern="\d{6}"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm pr-[90px]"
              placeholder="6-digit pincode"
            />
            <button
              type="button"
              onClick={handleManualFetchLocation}
              disabled={isFetchingPincode || !formData.pincode || formData.pincode.length !== 6}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isFetchingPincode ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
          {isFetchingPincode && (
            <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
              <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Fetching location...
            </div>
          )}
          {pincodeError && (
            <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{pincodeError}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Post Office *
          </label>
          <input
            type="text"
            name="postOffice"
            value={formData.postOffice}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            placeholder="Post office name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            District *
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            placeholder="District"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            placeholder="State"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Exact Address *
        </label>
        <textarea
          name="exactAddress"
          value={formData.exactAddress}
          onChange={handleInputChange}
          required
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm resize-none"
          placeholder="Full address"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Landmark
        </label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
          placeholder="Nearby landmark (optional)"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4 px-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-gray-600 text-sm">Loading markets...</span>
        <button
          onClick={refreshData}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4 mx-2">
        <div className="flex items-start gap-3">
          <div className="text-red-500 mt-0.5 flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-red-800">Error loading markets</h3>
            <p className="mt-1 text-sm text-red-700 break-words">{error}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={refreshData}
            className="w-full sm:w-auto px-4 py-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Market Management</h2>
              <p className="text-gray-300 mt-1 text-sm">Manage all markets in the system</p>
            </div>
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg text-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Market
            </button>
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {/* Search + Refresh Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
              />
            </div>
            <button
              onClick={refreshData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-sm flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Market</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMarkets.length > 0 ? (
                  currentMarkets.map((market) => (
                    <tr key={market._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{market.marketName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">ID: {market.marketId}</div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{market.district}, {market.state}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{market.postOffice} - {market.pincode}</div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm text-gray-900 truncate">{market.exactAddress}</div>
                          {market.landmark && (
                            <div className="text-xs text-gray-500 mt-0.5">Landmark: {market.landmark}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(market.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewMarket(market)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(market)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(market)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-lg font-medium">No markets found</p>
                        <p className="mt-1 text-sm">Try adding a new market or adjust your search</p>
                        <button
                          onClick={openAddModal}
                          className="mt-4 px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add First Market
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {currentMarkets.length > 0 ? (
              currentMarkets.map((market) => (
                <div key={market._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{market.marketName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {market.marketId}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleViewMarket(market)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(market)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(market)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{market.district}, {market.state} — <span className="font-medium">{market.pincode}</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 line-clamp-2">{market.exactAddress}</span>
                    </div>
                    {market.landmark && (
                      <div className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>{market.landmark}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(market.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="font-medium">No markets found</p>
                <p className="mt-1 text-sm">Try adding a new market or adjust your search</p>
                <button
                  onClick={openAddModal}
                  className="mt-4 px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add First Market
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredMarkets.length > 0 && (
            <div className="flex flex-col gap-3 mt-5">
              {/* Items per page + count row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>per page</span>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredMarkets.length)} of {filteredMarkets.length} entries
                </div>
              </div>

              {/* Page buttons */}
              <div className="flex items-center justify-center gap-1 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 min-w-[36px] border rounded-lg transition-colors text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Market Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:w-full sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex-shrink-0 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Add New Market</h3>
                  <p className="text-gray-300 mt-0.5 text-xs">Add a new market to the system</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm"><strong>Error:</strong> {operationError}</p>
                </div>
              )}
              <form onSubmit={handleAddMarket}>
                {renderFormFields()}
                <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm"
                  >
                    {operationLoading ? 'Adding...' : 'Add Market'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Market Modal */}
      {showEditModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:w-full sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex-shrink-0 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Edit Market</h3>
                  <p className="text-gray-300 mt-0.5 text-xs">Update market details</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{operationError}</p>
                </div>
              )}
              <form onSubmit={handleEditMarket}>
                {renderFormFields()}
                <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm"
                  >
                    {operationLoading ? 'Updating...' : 'Update Market'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Market Modal */}
      {showViewModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:w-full sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex-shrink-0 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Market Details</h3>
                  <p className="text-gray-300 mt-0.5 text-xs">View complete market information</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Market Name</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.marketName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Market ID</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.marketId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Location Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Pincode</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.pincode}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Post Office</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.postOffice}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">District</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.district}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">State</label>
                      <p className="text-gray-900 font-medium text-sm">{selectedMarket.state}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Address</h4>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <label className="block text-xs text-gray-500 mb-1">Exact Address</label>
                    <p className="text-gray-900 text-sm">{selectedMarket.exactAddress}</p>
                  </div>
                  {selectedMarket.landmark && (
                    <div className="bg-gray-50 rounded-xl p-3 mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Landmark</label>
                      <p className="text-gray-900 text-sm">{selectedMarket.landmark}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Metadata</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Created Date</label>
                      <p className="text-gray-900 text-sm">{formatDate(selectedMarket.createdAt)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="block text-xs text-gray-500 mb-1">Last Updated</label>
                      <p className="text-gray-900 text-sm">{formatDate(selectedMarket.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:w-full sm:rounded-2xl rounded-t-2xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Delete Market</h3>
                  <p className="text-red-200 mt-0.5 text-xs">This action cannot be undone</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-red-700/50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{operationError}</p>
                </div>
              )}

              <div className="text-center mb-5">
                <div className="w-14 h-14 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-800 mb-1">Are you sure?</h4>
                <p className="text-gray-600 text-sm">
                  You are about to delete <span className="font-semibold text-red-600">{selectedMarket.marketName}</span>. This action cannot be undone.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <h5 className="font-medium text-gray-700 mb-2 text-sm">Market Details:</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="text-gray-500">Name:</div>
                  <div className="font-medium text-gray-800 truncate">{selectedMarket.marketName}</div>
                  <div className="text-gray-500">Location:</div>
                  <div className="font-medium text-gray-800 truncate">{selectedMarket.district}, {selectedMarket.state}</div>
                  <div className="text-gray-500">Pincode:</div>
                  <div className="font-medium text-gray-800">{selectedMarket.pincode}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMarket}
                  disabled={operationLoading}
                  className="flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 text-sm"
                >
                  {operationLoading ? 'Deleting...' : 'Delete Market'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Market;