



// //CONVERTED INTO NEXT.JS

// "use client";

// import React, { useState } from "react";
// import axios from "axios";

// const AddMarket: React.FC = () => {
//   const [marketName, setMarketName] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [postOffice, setPostOffice] = useState("");
//   const [district, setDistrict] = useState("");
//   const [state, setState] = useState("");
//   const [exactAddress, setExactAddress] = useState("");
//   const [landmark, setLandmark] = useState("");

//   const fetchPincodeDetails = async (pin: string) => {
//     if (pin.length !== 6) return;

//     const res = await axios.get(
//       `https://api.postalpincode.in/pincode/${pin}`
//     );

//     if (res.data[0].Status === "Success") {
//       const po = res.data[0].PostOffice[0];
//       setPostOffice(po.Name);
//       setDistrict(po.District);
//       setState(po.State);
//     } else {
//       alert("Invalid Pincode");
//     }
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     await axios.post("https://kisan.etpl.ai/api/market/add-market", {
//       marketName,
//       pincode,
//       exactAddress,
//       landmark,
//     });

//     alert("Market added successfully");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
//             <h3 className="text-3xl font-bold text-white tracking-tight">
//               Add New Market
//             </h3>
//             <p className="text-blue-100 mt-2 text-sm">
//               Fill in the market details below
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={submitHandler} className="px-8 py-8 space-y-6">
//             {/* Market Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Market Name *
//               </label>
//               <input
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
//                 placeholder="Enter market name"
//                 value={marketName}
//                 onChange={(e) => setMarketName(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Pincode Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Pincode *
//                 </label>
//                 <input
//                   className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
//                   placeholder="Enter 6-digit pincode"
//                   value={pincode}
//                   onChange={(e) => {
//                     setPincode(e.target.value);
//                     fetchPincodeDetails(e.target.value);
//                   }}
//                   required
//                 />
//               </div>

//               {/* Auto-filled Address Details */}
//               <div className="space-y-6 md:col-span-2">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Post Office / Area
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={postOffice}
//                       disabled
//                       placeholder="Will auto-fill from pincode"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       District
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={district}
//                       disabled
//                       placeholder="Will auto-fill from pincode"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={state}
//                       disabled
//                       placeholder="Will auto-fill from pincode"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Exact Address */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Exact Address *
//               </label>
//               <textarea
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500 resize-none min-h-[120px]"
//                 placeholder="Enter complete address (Eg: Garudacharpalya, Mahadevapura)"
//                 value={exactAddress}
//                 onChange={(e) => setExactAddress(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Landmark */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Landmark <span className="text-gray-500 font-normal">(Optional)</span>
//               </label>
//               <input
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
//                 placeholder="Enter nearby landmark"
//                 value={landmark}
//                 onChange={(e) => setLandmark(e.target.value)}
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Add Market
//               </button>
//             </div>

//             {/* Required fields note */}
//             <p className="text-center text-sm text-gray-500 mt-4">
//               * Required fields
//             </p>
//           </form>
//         </div>

//         {/* Info Card */}
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
//           <div className="flex items-start">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h4 className="text-sm font-semibold text-blue-900">How it works</h4>
//               <p className="mt-1 text-sm text-blue-800">
//                 Enter a 6-digit pincode and the system will automatically fetch the corresponding 
//                 post office, district, and state details. Then provide the exact address and optional landmark.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMarket;










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
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span>Loading markets...</span>
        <button
          onClick={refreshData}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: '#2563eb',
            background: 'none',
            border: '1px solid #2563eb',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ color: '#ef4444', marginRight: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
              Error loading markets
            </h3>
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#b91c1c' }}>
              {error}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            onClick={refreshData}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#991b1b',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          <button
            onClick={openAddModal}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
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
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style jsx>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: '10px' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              Market List
            </h2>
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
              Total markets: <span style={{ fontWeight: '600' }}>{markets.length}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={openAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Market
            </button>
            <button
              onClick={refreshData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#16a34a',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {/* Markets List */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {markets.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#9ca3af'
              }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
                No markets found
              </h3>
              <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
                Start by adding your first market
              </p>
              <button
                onClick={openAddModal}
                style={{
                  marginTop: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add First Market
              </button>
            </div>
          ) : (
            markets.map((market) => (
              <div 
                key={market._id} 
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.15s ease-in-out',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#059669',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {market.marketName}
                      </h3>
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        borderRadius: '9999px'
                      }}>
                        {market.marketId}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Location:</strong> {market.district}, {market.state}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Pincode:</strong> {market.pincode}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Created:</strong> {formatDate(market.createdAt)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Post Office:</strong> {market.postOffice}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                        <strong>Address:</strong> {market.exactAddress}
                      </div>
                      {market.landmark && (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Landmark:</strong> {market.landmark}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button
                      onClick={() => openEditModal(market)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(market)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#dc2626',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Market Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Add New Market</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {operationError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
                  <strong>Error:</strong> {operationError}
                  <br />
                  <small>Check browser console for details</small>
                </p>
              </div>
            )}

            <form onSubmit={handleAddMarket}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Market Name *
                </label>
                <input
                  type="text"
                  name="marketName"
                  value={formData.marketName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Post Office *
                  </label>
                  <input
                    type="text"
                    name="postOffice"
                    value={formData.postOffice}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Exact Address *
                </label>
                <textarea
                  name="exactAddress"
                  value={formData.exactAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: operationLoading ? 'not-allowed' : 'pointer',
                    opacity: operationLoading ? 0.7 : 1
                  }}
                >
                  {operationLoading ? 'Adding...' : 'Add Market'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Market Modal */}
      {showEditModal && selectedMarket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Edit Market</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {operationError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{operationError}</p>
              </div>
            )}

            <form onSubmit={handleEditMarket}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Market Name *
                </label>
                <input
                  type="text"
                  name="marketName"
                  value={formData.marketName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Post Office *
                  </label>
                  <input
                    type="text"
                    name="postOffice"
                    value={formData.postOffice}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Exact Address *
                </label>
                <textarea
                  name="exactAddress"
                  value={formData.exactAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: operationLoading ? 'not-allowed' : 'pointer',
                    opacity: operationLoading ? 0.7 : 1
                  }}
                >
                  {operationLoading ? 'Updating...' : 'Update Market'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMarket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#ef4444',
                backgroundColor: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.142 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', textAlign: 'center' }}>
                Delete Market
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
                Are you sure you want to delete "{selectedMarket.marketName}"? This action cannot be undone.
              </p>
            </div>

            {operationError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{operationError}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMarket}
                disabled={operationLoading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: operationLoading ? 'not-allowed' : 'pointer',
                  opacity: operationLoading ? 0.7 : 1
                }}
              >
                {operationLoading ? 'Deleting...' : 'Delete Market'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Market;