






// 'use client';

// import React, { useState, useEffect } from 'react';

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

// const Market: React.FC = () => {
//   const [markets, setMarkets] = useState<Market[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showAddModal, setShowAddModal] = useState<boolean>(false);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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

//   // SIMPLIFIED: Add Market - WILL WORK
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

//   // SIMPLIFIED: Edit Market
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

//   // SIMPLIFIED: Delete Market
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
//   };

//   const openDeleteModal = (market: Market) => {
//     console.log('Opening delete for market:', market);
//     setSelectedMarket(market);
//     setShowDeleteModal(true);
//     setOperationError(null);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Refresh function
//   const refreshData = () => {
//     fetchFromLocalAPI();
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '200px',
//         flexDirection: 'column',
//         gap: '16px'
//       }}>
//         <div style={{ 
//           width: '40px', 
//           height: '40px', 
//           border: '3px solid #f3f3f3',
//           borderTop: '3px solid #3498db',
//           borderRadius: '50%',
//           animation: 'spin 1s linear infinite'
//         }}></div>
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//         <span>Loading markets...</span>
//         <button
//           onClick={refreshData}
//           style={{
//             padding: '8px 16px',
//             fontSize: '14px',
//             color: '#2563eb',
//             background: 'none',
//             border: '1px solid #2563eb',
//             borderRadius: '6px',
//             cursor: 'pointer'
//           }}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         backgroundColor: '#fef2f2',
//         border: '1px solid #fecaca',
//         borderRadius: '8px',
//         padding: '20px',
//         margin: '16px 0'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
//           <div style={{ color: '#ef4444', marginRight: '12px' }}>
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//               <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div>
//             <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
//               Error loading markets
//             </h3>
//             <p style={{ marginTop: '4px', fontSize: '14px', color: '#b91c1c' }}>
//               {error}
//             </p>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
//           <button
//             onClick={refreshData}
//             style={{
//               padding: '8px 16px',
//               fontSize: '14px',
//               fontWeight: '500',
//               color: '#991b1b',
//               backgroundColor: '#fef2f2',
//               border: '1px solid #fecaca',
//               borderRadius: '6px',
//               cursor: 'pointer'
//             }}
//           >
//             Try Again
//           </button>
//           <button
//             onClick={openAddModal}
//             style={{
//               padding: '8px 16px',
//               fontSize: '14px',
//               fontWeight: '500',
//               color: 'white',
//               backgroundColor: '#2563eb',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer'
//             }}
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
//         <div style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           backgroundColor: '#10b981',
//           color: 'white',
//           padding: '12px 20px',
//           borderRadius: '8px',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//           zIndex: 1000,
//           animation: 'slideIn 0.3s ease-out'
//         }}>
//           <style jsx>{`
//             @keyframes slideIn {
//               from { transform: translateX(100%); opacity: 0; }
//               to { transform: translateX(0); opacity: 1; }
//             }
//           `}</style>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: '10px' }}>
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             {successMessage}
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div style={{
//         backgroundColor: 'white',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//         borderRadius: '8px',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           padding: '20px 24px',
//           borderBottom: '1px solid #e5e7eb',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div>
//             <h2 style={{
//               fontSize: '20px',
//               fontWeight: 'bold',
//               color: '#111827'
//             }}>
//               Market List
//             </h2>
//             <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
//               Total markets: <span style={{ fontWeight: '600' }}>{markets.length}</span>
//             </p>
//           </div>
//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button
//               onClick={openAddModal}
//               style={{
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: 'white',
//                 backgroundColor: '#2563eb',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer'
//               }}
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//               Add Market
//             </button>
//             <button
//               onClick={refreshData}
//               style={{
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: 'white',
//                 backgroundColor: '#16a34a',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer'
//               }}
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
//                 <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {/* Markets List */}
//         <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
//           {markets.length === 0 ? (
//             <div style={{ padding: '40px 24px', textAlign: 'center' }}>
//               <div style={{ 
//                 width: '48px', 
//                 height: '48px', 
//                 margin: '0 auto 16px',
//                 color: '#9ca3af'
//               }}>
//                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//               </div>
//               <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
//                 No markets found
//               </h3>
//               <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
//                 Start by adding your first market
//               </p>
//               <button
//                 onClick={openAddModal}
//                 style={{
//                   marginTop: '16px',
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   padding: '8px 16px',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: 'white',
//                   backgroundColor: '#2563eb',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
//                   <path d="M12 5v14M5 12h14" />
//                 </svg>
//                 Add First Market
//               </button>
//             </div>
//           ) : (
//             markets.map((market) => (
//               <div 
//                 key={market._id} 
//                 style={{
//                   padding: '20px 24px',
//                   borderBottom: '1px solid #e5e7eb',
//                   transition: 'background-color 0.15s ease-in-out',
//                   position: 'relative'
//                 }}
//               >
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <div style={{ flex: '1', minWidth: '0' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
//                       <h3 style={{
//                         fontSize: '18px',
//                         fontWeight: '500',
//                         color: '#059669',
//                         margin: '0',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         whiteSpace: 'nowrap'
//                       }}>
//                         {market.marketName}
//                       </h3>
//                       <span style={{
//                         marginLeft: '8px',
//                         padding: '2px 8px',
//                         fontSize: '12px',
//                         fontWeight: '600',
//                         backgroundColor: '#d1fae5',
//                         color: '#065f46',
//                         borderRadius: '9999px'
//                       }}>
//                         {market.marketId}
//                       </span>
//                     </div>
                    
//                     <div style={{ 
//                       display: 'grid',
//                       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//                       gap: '16px',
//                       marginBottom: '16px'
//                     }}>
//                       <div>
//                         <span style={{ fontSize: '14px', color: '#6b7280' }}>
//                           <strong>Location:</strong> {market.district}, {market.state}
//                         </span>
//                       </div>
//                       <div>
//                         <span style={{ fontSize: '14px', color: '#6b7280' }}>
//                           <strong>Pincode:</strong> {market.pincode}
//                         </span>
//                       </div>
//                       <div>
//                         <span style={{ fontSize: '14px', color: '#6b7280' }}>
//                           <strong>Created:</strong> {formatDate(market.createdAt)}
//                         </span>
//                       </div>
//                       <div>
//                         <span style={{ fontSize: '14px', color: '#6b7280' }}>
//                           <strong>Post Office:</strong> {market.postOffice}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
//                         <strong>Address:</strong> {market.exactAddress}
//                       </div>
//                       {market.landmark && (
//                         <div style={{ fontSize: '14px', color: '#6b7280' }}>
//                           <strong>Landmark:</strong> {market.landmark}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Action Buttons */}
//                   <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
//                     <button
//                       onClick={() => openEditModal(market)}
//                       style={{
//                         padding: '6px 12px',
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         color: '#2563eb',
//                         backgroundColor: '#eff6ff',
//                         border: '1px solid #bfdbfe',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '4px'
//                       }}
//                     >
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
//                         <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
//                       </svg>
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => openDeleteModal(market)}
//                       style={{
//                         padding: '6px 12px',
//                         fontSize: '14px',
//                         fontWeight: '500',
//                         color: '#dc2626',
//                         backgroundColor: '#fef2f2',
//                         border: '1px solid #fecaca',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '4px'
//                       }}
//                     >
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Add Market Modal */}
//       {showAddModal && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             padding: '24px',
//             width: '90%',
//             maxWidth: '500px',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Add New Market</h3>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M18 6L6 18M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {operationError && (
//               <div style={{
//                 backgroundColor: '#fef2f2',
//                 border: '1px solid #fecaca',
//                 borderRadius: '6px',
//                 padding: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
//                   <strong>Error:</strong> {operationError}
//                   <br />
//                   <small>Check browser console for details</small>
//                 </p>
//               </div>
//             )}

//             <form onSubmit={handleAddMarket}>
//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Market Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="marketName"
//                   value={formData.marketName}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     Pincode *
//                   </label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     Post Office *
//                   </label>
//                   <input
//                     type="text"
//                     name="postOffice"
//                     value={formData.postOffice}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     District *
//                   </label>
//                   <input
//                     type="text"
//                     name="district"
//                     value={formData.district}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Exact Address *
//                 </label>
//                 <textarea
//                   name="exactAddress"
//                   value={formData.exactAddress}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     resize: 'vertical'
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Landmark
//                 </label>
//                 <input
//                   type="text"
//                   name="landmark"
//                   value={formData.landmark}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   style={{
//                     padding: '8px 16px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     color: '#374151',
//                     backgroundColor: '#f3f4f6',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={operationLoading}
//                   style={{
//                     padding: '8px 16px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     color: 'white',
//                     backgroundColor: '#2563eb',
//                     border: 'none',
//                     borderRadius: '6px',
//                     cursor: operationLoading ? 'not-allowed' : 'pointer',
//                     opacity: operationLoading ? 0.7 : 1
//                   }}
//                 >
//                   {operationLoading ? 'Adding...' : 'Add Market'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Market Modal */}
//       {showEditModal && selectedMarket && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             padding: '24px',
//             width: '90%',
//             maxWidth: '500px',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Edit Market</h3>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M18 6L6 18M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {operationError && (
//               <div style={{
//                 backgroundColor: '#fef2f2',
//                 border: '1px solid #fecaca',
//                 borderRadius: '6px',
//                 padding: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{operationError}</p>
//               </div>
//             )}

//             <form onSubmit={handleEditMarket}>
//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Market Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="marketName"
//                   value={formData.marketName}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     Pincode *
//                   </label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     Post Office *
//                   </label>
//                   <input
//                     type="text"
//                     name="postOffice"
//                     value={formData.postOffice}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     District *
//                   </label>
//                   <input
//                     type="text"
//                     name="district"
//                     value={formData.district}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '8px 12px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '14px'
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Exact Address *
//                 </label>
//                 <textarea
//                   name="exactAddress"
//                   value={formData.exactAddress}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     resize: 'vertical'
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
//                   Landmark
//                 </label>
//                 <input
//                   type="text"
//                   name="landmark"
//                   value={formData.landmark}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: '8px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   style={{
//                     padding: '8px 16px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     color: '#374151',
//                     backgroundColor: '#f3f4f6',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={operationLoading}
//                   style={{
//                     padding: '8px 16px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     color: 'white',
//                     backgroundColor: '#2563eb',
//                     border: 'none',
//                     borderRadius: '6px',
//                     cursor: operationLoading ? 'not-allowed' : 'pointer',
//                     opacity: operationLoading ? 0.7 : 1
//                   }}
//                 >
//                   {operationLoading ? 'Updating...' : 'Update Market'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedMarket && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             padding: '24px',
//             width: '90%',
//             maxWidth: '400px'
//           }}>
//             <div style={{ marginBottom: '20px' }}>
//               <div style={{ 
//                 width: '48px', 
//                 height: '48px', 
//                 margin: '0 auto 16px',
//                 color: '#ef4444',
//                 backgroundColor: '#fef2f2',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.142 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', textAlign: 'center' }}>
//                 Delete Market
//               </h3>
//               <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
//                 Are you sure you want to delete "{selectedMarket.marketName}"? This action cannot be undone.
//               </p>
//             </div>

//             {operationError && (
//               <div style={{
//                 backgroundColor: '#fef2f2',
//                 border: '1px solid #fecaca',
//                 borderRadius: '6px',
//                 padding: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{operationError}</p>
//               </div>
//             )}

//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteModal(false)}
//                 style={{
//                   padding: '8px 16px',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: '#374151',
//                   backgroundColor: '#f3f4f6',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '6px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteMarket}
//                 disabled={operationLoading}
//                 style={{
//                   padding: '8px 16px',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: 'white',
//                   backgroundColor: '#dc2626',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: operationLoading ? 'not-allowed' : 'pointer',
//                   opacity: operationLoading ? 0.7 : 1
//                 }}
//               >
//                 {operationLoading ? 'Deleting...' : 'Delete Market'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Market;
















'use client';

import React, { useState, useEffect } from 'react';

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

  // SIMPLIFIED: Add Market - WILL WORK
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

  // SIMPLIFIED: Edit Market
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

  // SIMPLIFIED: Delete Market
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
  };

  const openDeleteModal = (market: Market) => {
    console.log('Opening delete for market:', market);
    setSelectedMarket(market);
    setShowDeleteModal(true);
    setOperationError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Refresh function
  const refreshData = () => {
    fetchFromLocalAPI();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading markets...</span>
        <button
          onClick={refreshData}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
        <div className="flex items-start">
          <div className="text-red-500 mr-3 mt-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800">
              Error loading markets
            </h3>
            <p className="mt-1 text-red-700">
              {error}
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={refreshData}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Market Manager</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your markets efficiently</p>
              </div>
              
              {/* Summary in one line */}
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-3 md:p-4 w-full md:w-auto">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1 md:flex-none">
                    <div className="text-lg md:text-xl font-bold text-blue-600">{markets.length}</div>
                    <div className="text-xs md:text-sm text-gray-600">Total Markets</div>
                  </div>
                  <div className="h-6 md:h-8 w-px bg-gray-300 mx-2"></div>
                  <div className="text-center flex-1 md:flex-none">
                    <div className="text-lg md:text-xl font-bold text-green-600">{filteredMarkets.length}</div>
                    <div className="text-xs md:text-sm text-gray-600">Filtered</div>
                  </div>
                  <div className="h-6 md:h-8 w-px bg-gray-300 mx-2"></div>
                  <button
                    onClick={refreshData}
                    className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 rounded-lg md:rounded-xl transition-all duration-200 border border-blue-200"
                    title="Refresh Data"
                  >
                    <svg className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Header with Add New Market button on right */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                {/* Search Input */}
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 text-sm md:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                  />
                  <svg className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Add New Market button on right */}
              <div className="flex justify-end">
                <button
                  onClick={openAddModal}
                  className="group relative px-4 py-2.5 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Market
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Markets List Table */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">All Markets</h3>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Showing {filteredMarkets.length} markets
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {currentMarkets.length === 0 ? (
                <div className="text-center py-12 md:py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4 md:mb-6">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Markets Found</h4>
                  <p className="text-gray-500 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                    {searchTerm ? 'No results found for your search. Try a different term.' : 'Get started by adding your first market.'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={openAddModal}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-md text-sm md:text-base"
                    >
                      Add First Market
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Market Details
                        </th>
                        <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Location
                        </th>
                        <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                          Created Date
                        </th>
                        <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentMarkets.map((market, index) => (
                        <tr key={market._id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200">
                          <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg md:rounded-xl">
                                <span className="text-xs md:text-sm font-bold text-blue-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                              <div>
                                <div className="font-bold text-gray-900 text-sm md:text-lg">{market.marketName}</div>
                                <div className="text-xs text-gray-500 md:hidden">
                                  {market.district}, {market.state}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {market.marketId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900">
                                {market.district}, {market.state}
                              </div>
                              <div className="text-xs text-gray-600">
                                {market.postOffice} - {market.pincode}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-xs md:text-sm text-gray-900 font-medium">{formatDate(market.createdAt)}</div>
                            <div className="text-xs text-gray-500">Updated: {formatDate(market.updatedAt)}</div>
                          </td>
                          <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
                            <div className="flex items-center gap-1 md:gap-2">
                              <button
                                onClick={() => handleViewMarket(market)}
                                className="p-1.5 md:p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                                title="View Details"
                              >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openEditModal(market)}
                                className="p-1.5 md:p-2.5 bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                                title="Edit"
                              >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openDeleteModal(market)}
                                className="p-1.5 md:p-2.5 bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                                title="Delete"
                              >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="px-4 md:px-8 py-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Items per page selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          {[5, 10, 20, 50].map(option => (
                            <option key={option} value={option}>
                              {option} per page
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Page information */}
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-semibold">
                          {Math.min(indexOfLastItem, filteredMarkets.length)}
                        </span>{" "}
                        of <span className="font-semibold">{filteredMarkets.length}</span> results
                      </div>

                      {/* Pagination buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Prev
                        </button>
                        
                        {/* Page numbers with ellipsis */}
                        <div className="flex items-center space-x-1">
                          {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            // Show first, last, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-lg min-w-[40px] ${
                                    currentPage === page
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="px-2 py-1.5 text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          Next
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Market Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-lg w-full transform animate-slideUp mx-2">
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold">Add New Market</h3>
                  <p className="text-gray-300 mt-1 text-xs md:text-sm">Add a new market to the system</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {operationError}
                  </p>
                </div>
              )}

              <form onSubmit={handleAddMarket} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Market Name *
                  </label>
                  <input
                    type="text"
                    name="marketName"
                    value={formData.marketName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Post Office *
                    </label>
                    <input
                      type="text"
                      name="postOffice"
                      value={formData.postOffice}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exact Address *
                  </label>
                  <textarea
                    name="exactAddress"
                    value={formData.exactAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-sm md:text-base"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-lg w-full transform animate-slideUp mx-2">
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold">Edit Market</h3>
                  <p className="text-gray-300 mt-1 text-xs md:text-sm">Update market details</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{operationError}</p>
                </div>
              )}

              <form onSubmit={handleEditMarket} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Market Name *
                  </label>
                  <input
                    type="text"
                    name="marketName"
                    value={formData.marketName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Post Office *
                    </label>
                    <input
                      type="text"
                      name="postOffice"
                      value={formData.postOffice}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exact Address *
                  </label>
                  <textarea
                    name="exactAddress"
                    value={formData.exactAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-sm md:text-base"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-lg w-full transform animate-slideUp mx-2">
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold">Market Details</h3>
                  <p className="text-gray-300 mt-1 text-xs md:text-sm">Complete information about this market</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 md:p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Market Name</label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-gray-900">{selectedMarket.marketName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Market ID</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-medium text-gray-900">{selectedMarket.marketId}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-medium text-gray-900">{selectedMarket.pincode}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Post Office</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-medium text-gray-900">{selectedMarket.postOffice}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-medium text-gray-900">{selectedMarket.district}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-lg font-medium text-gray-900">{selectedMarket.state}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exact Address</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-900">{selectedMarket.exactAddress}</div>
                  </div>
                </div>

                {selectedMarket.landmark && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-900">{selectedMarket.landmark}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm md:text-lg font-medium text-gray-900">{formatDate(selectedMarket.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm md:text-lg font-medium text-gray-900">{formatDate(selectedMarket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-md w-full transform animate-slideUp mx-2">
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold">Delete Market</h3>
                  <p className="text-gray-300 mt-1 text-xs md:text-sm">Confirm deletion</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-red-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Delete "{selectedMarket.marketName}"?
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  This action cannot be undone. All market data will be permanently removed.
                </p>
              </div>

              {operationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{operationError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMarket}
                  disabled={operationLoading}
                  className="flex-1 px-4 md:px-6 py-2.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 text-sm md:text-base"
                >
                  {operationLoading ? 'Deleting...' : 'Delete Market'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default Market;









