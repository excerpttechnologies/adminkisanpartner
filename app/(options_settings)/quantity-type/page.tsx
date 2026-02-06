






// "use client";

// import React, { useState, useEffect } from "react";

// interface PackagingData {
//   _id: string;
//   packageType: string;
//   measurements: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// const QuantityType: React.FC = () => {
//   // State for creating/editing packaging
//   const [packageType, setPackageType] = useState("");
//   const [measurements, setMeasurements] = useState<string[]>([""]);
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   // State for fetching and displaying data
//   const [packagingData, setPackagingData] = useState<PackagingData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [viewingItem, setViewingItem] = useState<PackagingData | null>(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch packaging data on component mount
//   useEffect(() => {
//     fetchPackagingData();
//   }, []);

//   const fetchPackagingData = async () => {
//     try {
//       setFetchLoading(true);
//       setError(null);
      
//       const response = await fetch("/api/packaging");
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         setPackagingData(data.data || []);
//         setCurrentPage(1); // Reset to first page on refresh
//       } else {
//         setError(data.error || "Failed to fetch data");
//       }
      
//     } catch (err: any) {
//       console.error("Error fetching packaging data:", err);
//       setError("Failed to fetch packaging data: " + err.message);
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // Filter data based on search term
//   const filteredData = packagingData.filter(item =>
//     item.packageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.measurements.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Pagination handlers
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (value: number) => {
//     setItemsPerPage(value);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   // Edit packaging function
//   const editPackage = async (id: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(null);
      
//       const response = await fetch(`/api/packaging/${id}`);
//       const data = await response.json();
      
//       if (data.success) {
//         const item = data.data;
//         setPackageType(item.packageType);
//         setMeasurements(item.measurements.length > 0 ? item.measurements : [""]);
//         setEditingId(id);
//         setIsFormVisible(true);
//         setSuccess("Package loaded for editing");
//       } else {
//         setError(data.error || "Failed to load package");
//       }
      
//     } catch (err: any) {
//       console.error("Error loading package for edit:", err);
//       setError("Failed to load package for editing: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // View packaging details
//   const viewPackage = (item: PackagingData) => {
//     setViewingItem(item);
//   };

//   // Close view modal
//   const closeViewModal = () => {
//     setViewingItem(null);
//   };

//   // Delete packaging function
//   const deletePackage = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this packaging?")) return;

//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(null);
      
//       const response = await fetch(`/api/packaging/${id}`, {
//         method: 'DELETE'
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         setSuccess(data.message || "Packaging deleted successfully!");
//         setPackagingData(packagingData.filter(item => item._id !== id));
//         setTimeout(() => fetchPackagingData(), 500);
//       } else {
//         setError(data.error || "Failed to delete packaging");
//       }
      
//     } catch (err: any) {
//       console.error("Error deleting packaging:", err);
//       setError("Failed to delete packaging: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addMeasurement = () => {
//     setMeasurements([...measurements, ""]);
//   };

//   const updateMeasurement = (index: number, value: string) => {
//     const updated = [...measurements];
//     updated[index] = value;
//     setMeasurements(updated);
//   };

//   const removeMeasurement = (index: number) => {
//     if (measurements.length > 1) {
//       setMeasurements(measurements.filter((_, i) => i !== index));
//     }
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const payload = {
//         packageType: packageType.trim(),
//         measurements: measurements.filter(m => m.trim() !== ""),
//       };

//       if (editingId) {
//         // Update existing packaging
//         const response = await fetch(`/api/packaging/${editingId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload)
//         });
        
//         const data = await response.json();
        
//         if (data.success) {
//           setSuccess(data.message || "Packaging updated successfully!");
//           setPackagingData(packagingData.map(item => 
//             item._id === editingId ? data.data : item
//           ));
//           resetForm();
//           setTimeout(() => fetchPackagingData(), 500);
//         } else {
//           setError(data.error || "Update failed");
//         }
//       } else {
//         // Create new packaging
//         const response = await fetch("/api/packaging", {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload)
//         });
        
//         const data = await response.json();
        
//         if (data.success) {
//           setSuccess(data.message || "Packaging created successfully!");
//           setPackagingData([...packagingData, data.data]);
//           resetForm();
//           setTimeout(() => fetchPackagingData(), 500);
//         } else {
//           setError(data.error || "Creation failed");
//         }
//       }
      
//     } catch (err: any) {
//       console.error("Error saving packaging:", err);
//       setError("Error saving packaging: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setPackageType("");
//     setMeasurements([""]);
//     setEditingId(null);
//     setIsFormVisible(false);
//     setError(null);
//     setSuccess(null);
//   };

//   const openForm = () => {
//     setIsFormVisible(true);
//     setEditingId(null);
//     resetForm();
//   };

//   const closeForm = () => {
//     setIsFormVisible(false);
//     resetForm();
//   };

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // Items per page options
//   const itemsPerPageOptions = [5, 10, 20, 50];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 md:mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Packaging Manager</h1>
//               <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your packaging types and measurements</p>
//             </div>
            
//             {/* Summary in one line */}
//             <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-3 md:p-4 w-full md:w-auto">
//               <div className="flex items-center justify-between">
//                 <div className="text-center flex-1 md:flex-none">
//                   <div className="text-lg md:text-xl font-bold text-blue-600">{packagingData.length}</div>
//                   <div className="text-xs md:text-sm text-gray-600">Total Packaging</div>
//                 </div>
//                 <div className="h-6 md:h-8 w-px bg-gray-300 mx-2"></div>
//                 <div className="text-center flex-1 md:flex-none">
//                   <div className="text-lg md:text-xl font-bold text-green-600">
//                     {packagingData.reduce((total, item) => total + item.measurements.length, 0)}
//                   </div>
//                   <div className="text-xs md:text-sm text-gray-600">Total Measurements</div>
//                 </div>
//                 <div className="h-6 md:h-8 w-px bg-gray-300 mx-2"></div>
//                 <button
//                   onClick={fetchPackagingData}
//                   disabled={fetchLoading}
//                   className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 rounded-lg md:rounded-xl transition-all duration-200 border border-blue-200"
//                   title="Refresh Data"
//                 >
//                   <svg className={`w-4 h-4 md:w-5 md:h-5 ${fetchLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Header with Add New Packaging button on right */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//             <div className="flex-1">
//               {/* Search Input */}
//               <div className="relative max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Search packaging or measurements..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full px-4 py-2.5 pl-10 text-sm md:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//                 />
//                 <svg className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
            
//             {/* Add New Packaging button on right */}
//             <div className="flex justify-end">
//               <button
//                 onClick={openForm}
//                 className="group relative px-4 py-2.5 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
//               >
//                 <span className="relative z-10 flex items-center gap-2">
//                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   Add New Packaging
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Success Alert */}
//         {success && (
//           <div className="mb-4 md:mb-6 animate-fadeIn">
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-3 md:p-4 rounded-r-lg shadow-sm">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <svg className="h-4 w-4 md:h-5 md:w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-2 md:ml-3 flex-1">
//                   <p className="text-xs md:text-sm font-medium text-green-800">{success}</p>
//                 </div>
//                 <div className="ml-2 md:ml-3">
//                   <button
//                     onClick={() => setSuccess(null)}
//                     className="inline-flex text-green-700 hover:text-green-900"
//                   >
//                     <span className="sr-only">Dismiss</span>
//                     <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-4 md:mb-6 animate-fadeIn">
//             <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-3 md:p-4 rounded-r-lg shadow-sm">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <svg className="h-4 w-4 md:h-5 md:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-2 md:ml-3 flex-1">
//                   <p className="text-xs md:text-sm font-medium text-red-800">{error}</p>
//                 </div>
//                 <div className="ml-2 md:ml-3">
//                   <button
//                     onClick={() => setError(null)}
//                     className="inline-flex text-red-700 hover:text-red-900"
//                   >
//                     <span className="sr-only">Dismiss</span>
//                     <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Form Section */}
//         {isFormVisible && (
//           <div className="mb-6 md:mb-8 animate-slideDown">
//             <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
//               <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-lg md:text-2xl font-bold text-gray-900">
//                       {editingId ? 'Edit Packaging' : 'Add New Packaging'}
//                     </h3>
//                     <p className="text-gray-600 mt-1 text-sm md:text-base">
//                       {editingId ? 'Update existing packaging details' : 'Add new packaging type and measurements'}
//                     </p>
//                   </div>
//                   <button
//                     onClick={closeForm}
//                     className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={submitHandler} className="p-4 md:p-8 space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Package Type <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 md:px-4 py-2.5 md:py-3.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                     placeholder="e.g., Box, Carton, Envelope"
//                     value={packageType}
//                     onChange={(e) => setPackageType(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
//                     <label className="block text-sm font-semibold text-gray-900">
//                       Measurements <span className="text-red-500">*</span>
//                     </label>
//                     <button
//                       type="button"
//                       onClick={addMeasurement}
//                       className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start md:self-auto"
//                       disabled={loading}
//                     >
//                       <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add Measurement
//                     </button>
//                   </div>
//                   <div className="space-y-2 md:space-y-3">
//                     {measurements.map((m, index) => (
//                       <div key={index} className="flex flex-col md:flex-row gap-2">
//                         <input
//                           className="flex-1 px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-sm md:text-base"
//                           placeholder="e.g., Small, Medium, Large"
//                           value={m}
//                           onChange={(e) => updateMeasurement(index, e.target.value)}
//                           required
//                           disabled={loading}
//                         />
//                         {measurements.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeMeasurement(index)}
//                             className="px-3 md:px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg md:rounded-xl transition-colors duration-200 flex items-center justify-center gap-1 font-medium text-sm md:text-base"
//                             disabled={loading}
//                           >
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={closeForm}
//                     disabled={loading}
//                     className="flex-1 px-4 md:px-6 py-2.5 md:py-3.5 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`flex-1 px-4 md:px-6 py-2.5 md:py-3.5 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${
//                       editingId 
//                         ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
//                         : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
//                     } disabled:opacity-50 text-sm md:text-base`}
//                   >
//                     {loading ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                         {editingId ? 'Updating...' : 'Creating...'}
//                       </span>
//                     ) : editingId ? 'Update Packaging' : 'Add Packaging'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Packaging List Table */}
//         <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//               <div>
//                 <h3 className="text-lg md:text-2xl font-bold text-gray-900">All Packaging Types</h3>
//                 <p className="text-gray-600 mt-1 text-sm md:text-base">
//                   Showing {filteredData.length} packaging types
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs md:text-sm font-medium text-gray-700">
//                   Page {currentPage} of {totalPages}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             {fetchLoading && packagingData.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 md:py-16">
//                 <div className="relative">
//                   <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="h-4 w-4 md:h-6 md:w-6 bg-blue-600 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <p className="mt-3 md:mt-4 text-gray-600 font-medium text-sm md:text-base">Loading packaging data...</p>
//               </div>
//             ) : filteredData.length === 0 ? (
//               <div className="text-center py-12 md:py-16">
//                 <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4 md:mb-6">
//                   <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                   </svg>
//                 </div>
//                 <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Packaging Found</h4>
//                 <p className="text-gray-500 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
//                   {searchTerm ? 'No results found for your search. Try a different term.' : 'Get started by adding your first packaging type.'}
//                 </p>
//                 {!searchTerm && (
//                   <button
//                     onClick={openForm}
//                     className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-md text-sm md:text-base"
//                   >
//                     Add First Packaging
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
//                       <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         #
//                       </th>
//                       <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Package Type
//                       </th>
//                       <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
//                         Measurements
//                       </th>
//                       <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
//                         Created Date
//                       </th>
//                       <th className="px-4 md:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {currentItems.map((item, index) => (
//                       <tr key={item._id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200">
//                         <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg md:rounded-xl">
//                               <span className="text-xs md:text-sm font-bold text-blue-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
//                           <div className="flex items-center gap-2 md:gap-3">
//                             <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
//                             <div>
//                               <div className="font-bold text-gray-900 text-sm md:text-lg">{item.packageType}</div>
//                               <div className="text-xs text-gray-500 md:hidden">
//                                 {item.measurements.slice(0, 2).join(', ')}
//                                 {item.measurements.length > 2 && '...'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 md:px-8 py-3 md:py-5 hidden md:table-cell">
//                           <div className="flex flex-wrap gap-1 md:gap-2">
//                             {item.measurements.map((measurement, idx) => (
//                               <span
//                                 key={idx}
//                                 className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
//                               >
//                                 {measurement}
//                               </span>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap hidden sm:table-cell">
//                           <div className="text-xs md:text-sm text-gray-900 font-medium">{formatDate(item.createdAt)}</div>
//                           <div className="text-xs text-gray-500">Updated: {formatDate(item.updatedAt)}</div>
//                         </td>
//                         <td className="px-4 md:px-8 py-3 md:py-5 whitespace-nowrap">
//                           <div className="flex items-center gap-1 md:gap-2">
//                             <button
//                               onClick={() => viewPackage(item)}
//                               className="p-1.5 md:p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
//                               title="View Details"
//                             >
//                               <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => editPackage(item._id)}
//                               disabled={loading}
//                               className="p-1.5 md:p-2.5 bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm disabled:opacity-50"
//                               title="Edit"
//                             >
//                               <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => deletePackage(item._id)}
//                               disabled={loading}
//                               className="p-1.5 md:p-2.5 bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 shadow-sm disabled:opacity-50"
//                               title="Delete"
//                             >
//                               <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Pagination Controls */}
//                 <div className="px-4 md:px-8 py-4 border-t border-gray-200">
//                   <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                     {/* Items per page selector */}
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-700">Show:</span>
//                       <select
//                         value={itemsPerPage}
//                         onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                         className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                       >
//                         {itemsPerPageOptions.map(option => (
//                           <option key={option} value={option}>
//                             {option} per page
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Page information */}
//                     <div className="text-sm text-gray-700">
//                       Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
//                       <span className="font-semibold">
//                         {Math.min(indexOfLastItem, filteredData.length)}
//                       </span>{" "}
//                       of <span className="font-semibold">{filteredData.length}</span> results
//                     </div>

//                     {/* Pagination buttons */}
//                     <div className="flex items-center space-x-1">
//                       <button
//                         onClick={prevPage}
//                         disabled={currentPage === 1}
//                         className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                         Prev
//                       </button>
                      
//                       {/* Page numbers with ellipsis */}
//                       <div className="flex items-center space-x-1">
//                         {[...Array(totalPages)].map((_, i) => {
//                           const page = i + 1;
//                           // Show first, last, and pages around current
//                           if (
//                             page === 1 ||
//                             page === totalPages ||
//                             (page >= currentPage - 1 && page <= currentPage + 1)
//                           ) {
//                             return (
//                               <button
//                                 key={page}
//                                 onClick={() => goToPage(page)}
//                                 className={`px-3 py-1.5 text-sm font-medium rounded-lg min-w-[40px] ${
//                                   currentPage === page
//                                     ? "bg-blue-600 text-white"
//                                     : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
//                                 }`}
//                               >
//                                 {page}
//                               </button>
//                             );
//                           } else if (
//                             page === currentPage - 2 ||
//                             page === currentPage + 2
//                           ) {
//                             return (
//                               <span key={page} className="px-2 py-1.5 text-gray-500">
//                                 ...
//                               </span>
//                             );
//                           }
//                           return null;
//                         })}
//                       </div>
                      
//                       <button
//                         onClick={nextPage}
//                         disabled={currentPage === totalPages}
//                         className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                       >
//                         Next
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       {viewingItem && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
//           <div className="bg-white rounded-xl md:rounded-2xl max-w-full md:max-w-lg w-full transform animate-slideUp mx-2">
//             <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-xl md:rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg md:text-2xl font-bold">Package Details</h3>
//                   <p className="text-gray-300 mt-1 text-xs md:text-sm">Complete information about this packaging</p>
//                 </div>
//                 <button
//                   onClick={closeViewModal}
//                   className="p-1 md:p-2 hover:bg-gray-700/50 rounded-lg md:rounded-xl transition-colors"
//                 >
//                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 md:p-8">
//               <div className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Package Type</label>
//                   <div className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl border border-blue-200">
//                     <div className="text-lg md:text-2xl font-bold text-gray-900">{viewingItem.packageType}</div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Measurements</label>
//                   <div className="flex flex-wrap gap-2 md:gap-3">
//                     {viewingItem.measurements.map((measurement, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-2 border-blue-300"
//                       >
//                         <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         {measurement}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-gray-200">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
//                     <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2">
//                         <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <span className="text-sm md:text-lg font-medium text-gray-900">{formatDate(viewingItem.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
//                     <div className="p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-2">
//                         <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         <span className="text-sm md:text-lg font-medium text-gray-900">{formatDate(viewingItem.updatedAt)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 md:mt-8 flex justify-end gap-2 md:gap-3">
//                 <button
//                   onClick={closeViewModal}
//                   className="px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm md:text-base"
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={closeViewModal}
//                   className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg text-sm md:text-base"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add custom animations */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
//         .animate-slideDown { animation: slideDown 0.4s ease-out; }
//         .animate-slideUp { animation: slideUp 0.4s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default QuantityType;












"use client";

import React, { useState, useEffect } from "react";

interface PackagingData {
  _id: string;
  packageType: string;
  measurements: string[];
  createdAt: string;
  updatedAt: string;
}

const QuantityType: React.FC = () => {
  // State for creating/editing packaging
  const [packageType, setPackageType] = useState("");
  const [measurements, setMeasurements] = useState<string[]>([""]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for fetching and displaying data
  const [packagingData, setPackagingData] = useState<PackagingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<PackagingData | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch packaging data on component mount
  useEffect(() => {
    fetchPackagingData();
  }, []);

  const fetchPackagingData = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      
      const response = await fetch("/api/packaging");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackagingData(data.data || []);
        setCurrentPage(1); // Reset to first page on refresh
      } else {
        setError(data.error || "Failed to fetch data");
      }
      
    } catch (err: any) {
      console.error("Error fetching packaging data:", err);
      setError("Failed to fetch packaging data: " + err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  // Filter data based on search term
  const filteredData = packagingData.filter(item =>
    item.packageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.measurements.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Edit packaging function
  const editPackage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/packaging/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const item = data.data;
        setPackageType(item.packageType);
        setMeasurements(item.measurements.length > 0 ? item.measurements : [""]);
        setEditingId(id);
        setIsFormVisible(true);
        setSuccess("Package loaded for editing");
      } else {
        setError(data.error || "Failed to load package");
      }
      
    } catch (err: any) {
      console.error("Error loading package for edit:", err);
      setError("Failed to load package for editing: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // View packaging details
  const viewPackage = (item: PackagingData) => {
    setViewingItem(item);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewingItem(null);
  };

  // Delete packaging function
  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this packaging?")) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/packaging/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message || "Packaging deleted successfully!");
        setPackagingData(packagingData.filter(item => item._id !== id));
        setTimeout(() => fetchPackagingData(), 500);
      } else {
        setError(data.error || "Failed to delete packaging");
      }
      
    } catch (err: any) {
      console.error("Error deleting packaging:", err);
      setError("Failed to delete packaging: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = () => {
    setMeasurements([...measurements, ""]);
  };

  const updateMeasurement = (index: number, value: string) => {
    const updated = [...measurements];
    updated[index] = value;
    setMeasurements(updated);
  };

  const removeMeasurement = (index: number) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter((_, i) => i !== index));
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        packageType: packageType.trim(),
        measurements: measurements.filter(m => m.trim() !== ""),
      };

      if (editingId) {
        // Update existing packaging
        const response = await fetch(`/api/packaging/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(data.message || "Packaging updated successfully!");
          setPackagingData(packagingData.map(item => 
            item._id === editingId ? data.data : item
          ));
          resetForm();
          setTimeout(() => fetchPackagingData(), 500);
        } else {
          setError(data.error || "Update failed");
        }
      } else {
        // Create new packaging
        const response = await fetch("/api/packaging", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(data.message || "Packaging created successfully!");
          setPackagingData([...packagingData, data.data]);
          resetForm();
          setTimeout(() => fetchPackagingData(), 500);
        } else {
          setError(data.error || "Creation failed");
        }
      }
      
    } catch (err: any) {
      console.error("Error saving packaging:", err);
      setError("Error saving packaging: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPackageType("");
    setMeasurements([""]);
    setEditingId(null);
    setIsFormVisible(false);
    setError(null);
    setSuccess(null);
  };

  const openForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    resetForm();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Items per page options
  const itemsPerPageOptions = [5, 10, 20, 50];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header - Stacked layout for better mobile view */}
        <div className="mb-6 md:mb-8">
          {/* Title and Stats - Stack on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Packaging Manager</h1>
              <p className="text-gray-600 text-sm md:text-base">Manage packaging types and measurements</p>
            </div>
            
            {/* Stats Cards - Grid on mobile, flex on desktop */}
            <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 text-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900">{packagingData.length}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Total</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 text-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  {packagingData.reduce((total, item) => total + item.measurements.length, 0)}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Measurements</div>
              </div>
              <button
                onClick={fetchPackagingData}
                disabled={fetchLoading}
                className="col-span-2 md:col-auto p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                title="Refresh Data"
              >
                <svg className={`w-5 h-5 ${fetchLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Add Button - Full width on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input - Full width on mobile */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search packaging or measurements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-11 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Add Button - Full width on mobile, auto width on larger screens */}
            <button
              onClick={openForm}
              className="px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 sm:w-auto w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Alerts - Better mobile spacing */}
        {success && (
          <div className="mb-4 animate-fadeIn">
            <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="ml-3 text-green-700 hover:text-green-900"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 animate-fadeIn">
            <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-3 text-red-700 hover:text-red-900"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section - Better mobile form */}
        {isFormVisible && (
          <div className="mb-6 md:mb-8 animate-slideDown">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="px-4 py-4 md:px-6 md:py-5 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {editingId ? 'Edit Packaging' : 'New Packaging'}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {editingId ? 'Update existing details' : 'Add new packaging type'}
                    </p>
                  </div>
                  <button
                    onClick={closeForm}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={submitHandler} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Package Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-gray-50 hover:bg-white text-base"
                    placeholder="e.g., Box, Carton, Envelope"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Measurements <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addMeasurement}
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {measurements.map((m, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-gray-50 hover:bg-white text-base"
                          placeholder="e.g., Small, Medium, Large"
                          value={m}
                          onChange={(e) => updateMeasurement(index, e.target.value)}
                          required
                          disabled={loading}
                        />
                        {measurements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMeasurement(index)}
                            className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center"
                            disabled={loading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {editingId ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Packaging List - Mobile-friendly cards and table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-4 md:px-6 md:py-5 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Packaging Types</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredData.length} total • Page {currentPage} of {totalPages}
                </p>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
          </div>

          <div className="overflow-x-auto">
            {fetchLoading && packagingData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading packaging data...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Packaging Found</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm ? 'No results found for your search.' : 'Get started by adding your first packaging type.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={openForm}
                    className="px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                  >
                    Add First Packaging
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <div key={item._id} className="p-4 hover:bg-gray-50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                              <span className="text-sm font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                            </div>
                            <h4 className="font-bold text-gray-900">{item.packageType}</h4>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.measurements.slice(0, 3).map((measurement, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                              >
                                {measurement}
                              </span>
                            ))}
                            {item.measurements.length > 3 && (
                              <span className="text-xs text-gray-500">+{item.measurements.length - 3} more</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {formatDate(item.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => viewPackage(item)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => editPackage(item._id)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deletePackage(item._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Package Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Measurements
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                            <span className="text-sm font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{item.packageType}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {item.measurements.map((measurement, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                              >
                                {measurement}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{formatDate(item.createdAt)}</div>
                          <div className="text-xs text-gray-500">Updated: {formatDate(item.updatedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewPackage(item)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => editPackage(item._id)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deletePackage(item._id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Pagination at bottom left side */}
          {filteredData.length > 0 && (
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left side - Items per page and showing info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
                    >
                      {itemsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-semibold">{Math.min(indexOfLastItem, filteredData.length)}</span>{" "}
                    of <span className="font-semibold">{filteredData.length}</span> items
                  </div>
                </div>

                {/* Right side - Page navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {totalPages <= 5 ? (
                      // Show all pages if 5 or less
                      [...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg min-w-[36px] ${
                              currentPage === page
                                ? "bg-gray-900 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })
                    ) : (
                      // Show limited pages with ellipsis
                      <>
                        {[1, currentPage - 1, currentPage, currentPage + 1, totalPages]
                          .filter((page, index, array) => 
                            page && page >= 1 && page <= totalPages && array.indexOf(page) === index
                          )
                          .sort((a, b) => a - b)
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && page - array[index - 1] > 1 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg min-w-[36px] ${
                                  currentPage === page
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))
                        }
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal - Mobile optimized */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-full w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="px-4 py-4 bg-gray-900 text-white rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Package Details</h3>
                  <p className="text-gray-300 text-sm mt-1">Complete information</p>
                </div>
                <button
                  onClick={closeViewModal}
                  className="p-2 hover:bg-gray-700/50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Package Type</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                    <div className="text-lg font-bold text-gray-900">{viewingItem.packageType}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Measurements</label>
                  <div className="flex flex-wrap gap-2">
                    {viewingItem.measurements.map((measurement, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-800 border-2 border-gray-400"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {measurement}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{formatDate(viewingItem.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{formatDate(viewingItem.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                >
                  Close
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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default QuantityType;
















