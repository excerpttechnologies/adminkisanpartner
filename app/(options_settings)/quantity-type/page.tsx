







// "use client";

// import React, { useState } from "react";
// import axios from "axios";

// const QuantityType: React.FC = () => {
//   const [packageType, setPackageType] = useState("");
//   const [measurements, setMeasurements] = useState<string[]>([""]);
//   const [loading, setLoading] = useState(false);

//   const addMeasurement = () => {
//     setMeasurements([...measurements, ""]);
//   };

//   const updateMeasurement = (index: number, value: string) => {
//     const updated = [...measurements];
//     updated[index] = value;
//     setMeasurements(updated);
//   };

//   const removeMeasurement = (index: number) => {
//     setMeasurements(measurements.filter((_, i) => i !== index));
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post("https://kisan.etpl.ai/api/packaging/save", {
//         packageType,
//         measurements: measurements.filter(Boolean),
//       });

//       alert("Packaging saved");
//       setPackageType("");
//       setMeasurements([""]);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
//             <h3 className="text-2xl font-bold text-white">Packaging Setup</h3>
//             <p className="text-emerald-100 text-sm mt-1">Define packaging types and their measurements</p>
//           </div>

//           <form onSubmit={submitHandler} className="p-8 space-y-8">
//             {/* Package Type Input */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Package Type *
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
//                 placeholder="Enter package type (Eg: KG, BOX, SACK, BAG)"
//                 value={packageType}
//                 onChange={(e) => setPackageType(e.target.value)}
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-2 ml-1">
//                 This is the main packaging category
//               </p>
//             </div>

//             {/* Measurements Section */}
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Measurements *
//                 </label>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
//                   {measurements.length} measurement(s)
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {measurements.map((m, index) => (
//                   <div key={index} className="flex items-center gap-3 group">
//                     <div className="flex-1">
//                       <div className="relative">
//                         <input
//                           className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
//                           placeholder="Eg: 10 KG / Medium / 25 KG Bag"
//                           value={m}
//                           onChange={(e) => updateMeasurement(index, e.target.value)}
//                           required
//                         />
//                         <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                           <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full">
//                             <span className="text-xs font-semibold">
//                               {index + 1}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {measurements.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeMeasurement(index)}
//                         className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200 group-hover:opacity-100 opacity-70"
//                         title="Remove measurement"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Add Measurement Button */}
//               <button
//                 type="button"
//                 onClick={addMeasurement}
//                 className="w-full py-3.5 border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full group-hover:bg-emerald-200 transition-colors">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                   </div>
//                   <span className="text-emerald-700 font-medium group-hover:text-emerald-800">
//                     Add Measurement
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Add another measurement variant for this package type
//                 </p>
//               </button>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Save Packaging
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Info Card */}
//         <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
//           <div className="flex items-start">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h4 className="text-sm font-semibold text-emerald-900">How Packaging Setup Works</h4>
//               <p className="mt-1 text-sm text-emerald-800">
//                 Define a package type (like &quot;KG&quot; or &quot;BOX&quot;) and add multiple measurements for that type.
//                 Each measurement represents a different size/variant of the same packaging type.
//                 Example: For &quot;BAG&quot; type, you could add measurements like &quot;5 KG Bag&quot;, &quot;10 KG Bag&quot;, &quot;25 KG Bag&quot;.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
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
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        setActiveTab("create");
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
    setError(null);
    setSuccess(null);
  };

  const cancelEdit = () => {
    resetForm();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Packaging Management {editingId && <span className="text-blue-600">(Editing)</span>}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create, view, edit, and delete packaging types in your system
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors ${
              activeTab === "create"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("create");
              setError(null);
              setSuccess(null);
            }}
          >
            {editingId ? "Edit Package" : "Create New"}
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors ${
              activeTab === "view"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("view");
              setError(null);
              setSuccess(null);
              fetchPackagingData();
            }}
          >
            View All ({packagingData.length})
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "create" ? (
          /* Create/Edit Form */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className={`px-8 py-6 ${editingId ? 'bg-gradient-to-r from-yellow-600 to-amber-600' : 'bg-gradient-to-r from-green-600 to-green-700'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {editingId ? 'Edit Packaging' : 'Create New Packaging'}
                    {editingId && <span className="block text-sm font-normal mt-1">Editing ID: {editingId.substring(0, 12)}...</span>}
                  </h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    {editingId ? 'Update existing packaging details' : 'Define packaging types and their measurements'}
                  </p>
                </div>
                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={submitHandler} className="p-8 space-y-8">
              {/* Package Type Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Package Type *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Enter package type (Eg: KG, BOX, SACK, BAG)"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  This will be automatically converted to uppercase
                </p>
              </div>

              {/* Measurements Section */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Measurements *
                  </label>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {measurements.length} measurement(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {measurements.map((m, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                            placeholder="Eg: 10 KG / Medium / 25 KG Bag"
                            value={m}
                            onChange={(e) => updateMeasurement(index, e.target.value)}
                            required
                            disabled={loading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full">
                              <span className="text-xs font-semibold">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {measurements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMeasurement(index)}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200 group-hover:opacity-100 opacity-70 disabled:opacity-50"
                          title="Remove measurement"
                          disabled={loading}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Measurement Button */}
                <button
                  type="button"
                  onClick={addMeasurement}
                  className="w-full py-3.5 border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full group-hover:bg-emerald-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-emerald-700 font-medium group-hover:text-emerald-800">
                      Add Measurement
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Add another measurement variant for this package type
                  </p>
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                    editingId 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 focus:ring-yellow-500'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingId ? 'Updating...' : 'Saving...'}
                    </span>
                  ) : (
                    editingId ? 'Update Packaging' : 'Save Packaging'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Data Section */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">All Packaging Types</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Total {packagingData.length} packaging types found
                  </p>
                </div>
                <button
                  onClick={fetchPackagingData}
                  disabled={fetchLoading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {fetchLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-8">
              {fetchLoading && packagingData.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : packagingData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No Packaging Found</h4>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    No packaging types have been created yet. Create your first packaging type to get started.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Packaging
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packagingData.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white group relative"
                    >
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => editPackage(item._id)}
                          disabled={loading}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deletePackage(item._id)}
                          disabled={loading}
                          className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-1 pr-12">
                          {item.packageType}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Created: {formatDate(item.createdAt)}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-700">Measurements:</h5>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.measurements.length} variants
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.measurements.map((measurement, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                            >
                              {measurement}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editPackage(item._id)}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePackage(item._id)}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantityType;