// "use client";

// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2, X } from "lucide-react";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import axios from "axios";

// interface DistrictItem {
//   _id: string;
//   name: string;
//   stateId: string;
//   stateName?: string;
//   selected?: boolean;
// }

// interface StateItem {
//   _id: string;
//   name: string;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export default function DistrictsPage() {
//   const [districts, setDistricts] = useState<DistrictItem[]>([]);
//   const [states, setStates] = useState<StateItem[]>([]);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [statesLoading, setStatesLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [districtName, setDistrictName] = useState("");
//   const [selectedStateId, setSelectedStateId] = useState("");

//   // Pagination and filter state
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   });
  
//   // State filter for districts
//   const [filterStateId, setFilterStateId] = useState<string>("");

//   /* ---------- API FUNCTIONS ---------- */
//   const fetchStates = async () => {
//     setStatesLoading(true);
//     try {
//       const response = await axios.get("/api/states", {
//         params: { page: 1, limit: 100 }
//       });
//       if (response.data.success) {
//         setStates(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching states:", error);
//       showMessage("Failed to load states", "error");
//     } finally {
//       setStatesLoading(false);
//     }
//   };

//   const fetchDistricts = async (page = 1, searchQuery = "", stateId = "") => {
//     setLoading(true);
//     try {
//       const params: any = {
//         page: page,
//         limit: pagination.limit,
//         search: searchQuery,
//       };

//       // Only add stateId if it's not empty (not "All")
//       if (stateId) {
//         params.stateId = stateId;
//       }

//       const response = await axios.get("/api/districts", { params });
//       const data = response.data;

//       if (data.success) {
//         // Enhance districts with state names
//         const districtsWithStateNames = data.data.map((district: any) => {
//           const state = states.find(s => s._id === district.stateId);
//           return {
//             ...district,
//             stateName: state?.name || "Unknown State",
//             selected: false
//           };
//         });
        
//         setDistricts(districtsWithStateNames);
//         setPagination(data.pagination);
//       } else {
//         showMessage(data.message || "Failed to fetch districts", "error");
//       }
//     } catch (error: any) {
//       console.error("Error fetching districts:", error);
//       const errorMsg = error.response?.data?.message || "Failed to fetch districts";
//       showMessage(errorMsg, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createDistrict = async () => {
//     setSaving(true);
//     try {
//       const response = await axios.post("/api/districts", {
//         name: districtName,
//         stateId: selectedStateId
//       });
      
//       showMessage("District added successfully", "success");
//       fetchDistricts(pagination.page, search, filterStateId);
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error creating district:", error);
//       const errorMsg = error.response?.data?.message || "Failed to add district";
//       showMessage(errorMsg, "error");
//       return { success: false, message: errorMsg };
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateDistrict = async (id: string) => {
//     setSaving(true);
//     try {
//       const response = await axios.put(`/api/districts/${id}`, {
//         name: districtName,
//         stateId: selectedStateId
//       });
      
//       showMessage("District updated successfully", "success");
//       fetchDistricts(pagination.page, search, filterStateId);
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error updating district:", error);
//       const errorMsg = error.response?.data?.message || "Failed to update district";
//       showMessage(errorMsg, "error");
//       return { success: false, message: errorMsg };
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteDistrict = async (id: string) => {
//     try {
//       await axios.delete(`/api/districts/${id}`);
      
//       showMessage("District deleted successfully", "success");
//       if (districts.length === 1 && pagination.page > 1) {
//         fetchDistricts(pagination.page - 1, search, filterStateId);
//       } else {
//         fetchDistricts(pagination.page, search, filterStateId);
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error deleting district:", error);
//       const errorMsg = error.response?.data?.message || "Failed to delete district";
//       showMessage(errorMsg, "error");
//       return { success: false, message: errorMsg };
//     }
//   };

//   const bulkDeleteDistricts = async (ids: string[]) => {
//     try {
//       await axios.delete("/api/districts", { data: { ids } });
      
//       showMessage(`${ids.length} district(s) deleted successfully`, "success");
//       if (districts.length === ids.length && pagination.page > 1) {
//         fetchDistricts(pagination.page - 1, search, filterStateId);
//       } else {
//         fetchDistricts(pagination.page, search, filterStateId);
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error deleting districts:", error);
//       const errorMsg = error.response?.data?.message || "Failed to delete districts";
//       showMessage(errorMsg, "error");
//       return { success: false, message: errorMsg };
//     }
//   };

//   /* ---------- INITIAL FETCH ---------- */
//   useEffect(() => {
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     if (states.length > 0) {
//       fetchDistricts(1, search, filterStateId);
//     }
//   }, [states, filterStateId, search]);

//   /* ---------- HELPERS ---------- */
//   const showMessage = (text: string, type: "success" | "error" = "success") => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), 3000);
//   };

//   const getStateNameById = (stateId: string) => {
//     if (!stateId) return "All States";
//     const state = states.find(s => s._id === stateId);
//     return state?.name || "Unknown State";
//   };

//   /* ---------- SELECT HANDLERS ---------- */
//   const toggleSelect = (id: string) => {
//     setDistricts(prev =>
//       prev.map(d => d._id === id ? { ...d, selected: !d.selected } : d)
//     );
//   };

//   const selectAll = (checked: boolean) => {
//     setDistricts(prev => prev.map(d => ({ ...d, selected: checked })));
//   };

//   const getSelectedIds = () => {
//     return districts.filter(d => d.selected).map(d => d._id);
//   };

//   const handleDeleteSelected = () => {
//     const selectedIds = getSelectedIds();
//     if (selectedIds.length > 0) {
//       if (window.confirm(`Delete ${selectedIds.length} selected district(s)?`)) {
//         bulkDeleteDistricts(selectedIds);
//       }
//     }
//   };

//   /* ---------- CRUD HANDLERS ---------- */
//   const openAdd = () => {
//     setEditId(null);
//     setDistrictName("");
//     setSelectedStateId(""); // Reset to empty, user must select a state
//     setShowModal(true);
//   };

//   const openEdit = (d: DistrictItem) => {
//     setEditId(d._id);
//     setDistrictName(d.name);
//     setSelectedStateId(d.stateId);
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!districtName.trim()) {
//       showMessage("Please enter district name", "error");
//       return;
//     }
    
//     if (!selectedStateId) {
//       showMessage("Please select a state", "error");
//       return;
//     }

//     let result;
//     if (editId) {
//       result = await updateDistrict(editId);
//     } else {
//       result = await createDistrict();
//     }

//     if (result.success) {
//       setShowModal(false);
//     }
//   };

//   const handleDeleteOne = (id: string, name: string) => {
//     if (window.confirm(`Delete district "${name}"?`)) {
//       deleteDistrict(id);
//     }
//   };

//   /* ---------- PAGINATION & SEARCH ---------- */
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setPagination(prev => ({ ...prev, page }));
//     fetchDistricts(page, search, filterStateId);
//   };

//   const handleSearch = () => {
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchDistricts(1, search, filterStateId);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Handle state filter change
//   const handleStateFilterChange = (stateId: string) => {
//     setFilterStateId(stateId);
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchDistricts(1, search, stateId);
//   };

//   // Search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search !== "") {
//         handleSearch();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* Message */}
//       {message && (
//         <div className={`mb-3 px-4 py-2 rounded flex items-center justify-between ${
//           message.includes("Failed") || message.includes("Please") || message.includes("error")
//             ? "bg-red-100 text-red-800 border-l-4 border-red-500" 
//             : "bg-green-100 text-green-800 border-l-4 border-green-500"
//         }`}>
//           <span>{message}</span>
//           <button onClick={() => setMessage(null)} className="text-gray-500 hover:text-gray-700">
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Districts Management</h1>
//         <div className="text-sm text-gray-600">
//           Total: {pagination.total} districts
//         </div>
//       </div>

//       {/* FILTER BAR */}
//       <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow border">
//         <div className="flex-1 min-w-[200px]">
//           <label className="block text-sm font-medium mb-2">Filter by State</label>
//           <select
//             className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={filterStateId}
//             onChange={(e) => handleStateFilterChange(e.target.value)}
//             disabled={statesLoading}
//           >
//             {statesLoading ? (
//               <option>Loading states...</option>
//             ) : states.length === 0 ? (
//               <option value="">No states available</option>
//             ) : (
//               <>
//                 <option value="">All States</option>
//                 {states.map(state => (
//                   <option key={state._id} value={state._id}>
//                     {state.name}
//                   </option>
//                 ))}
//               </>
//             )}
//           </select>
//         </div>
        
//         <div className="flex-1 min-w-[200px]">
//           <label className="block text-sm font-medium mb-2">Search Districts</label>
//           <div className="flex gap-2">
//             <input
//               placeholder="Search district name..."
//               className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ACTION BAR */}
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//         <div className="flex items-center gap-3">
//           {districts.length > 0 && (
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 onChange={(e) => selectAll(e.target.checked)}
//                 checked={districts.length > 0 && districts.every(d => d.selected)}
//                 className="w-4 h-4 text-blue-600 rounded"
//               />
//               <span className="text-sm text-gray-600">
//                 {getSelectedIds().length} selected
//               </span>
//             </div>
//           )}

//           <button
//             onClick={handleDeleteSelected}
//             disabled={!districts.some(d => d.selected)}
//             className={`px-4 py-2 rounded font-medium ${
//               districts.some(d => d.selected)
//                 ? "bg-red-600 hover:bg-red-700 text-white"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Delete Selected
//           </button>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={openAdd}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2"
//           >
//             <Plus size={18} /> Add New District
//           </button>
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="text-center py-12">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading districts...</p>
//         </div>
//       )}

//       {/* DESKTOP TABLE */}
//       {!loading && (
//         <>
//           <div className="hidden md:block bg-white rounded-lg border shadow overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border-b px-4 py-3 text-left">
//                     <input
//                       type="checkbox"
//                       onChange={(e) => selectAll(e.target.checked)}
//                       checked={districts.length > 0 && districts.every(d => d.selected)}
//                       className="w-4 h-4 text-blue-600 rounded"
//                     />
//                   </th>
//                   <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Sr.</th>
//                   <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">District Name</th>
//                   <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
//                   <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {districts.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-4 py-12 text-center">
//                       <div className="text-gray-500 mb-4">
//                         {search 
//                           ? `No districts found matching "${search}"`
//                           : filterStateId 
//                             ? `No districts found for ${getStateNameById(filterStateId)}`
//                             : "No districts found. Select a state to filter or add new districts."}
//                       </div>
//                       <button
//                         onClick={openAdd}
//                         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 mx-auto"
//                       >
//                         <Plus size={16} /> Add District
//                       </button>
//                     </td>
//                   </tr>
//                 ) : (
//                   districts.map((d, i) => (
//                     <tr key={d._id} className="hover:bg-gray-50">
//                       <td className="border-b px-4 py-3">
//                         <input
//                           type="checkbox"
//                           checked={!!d.selected}
//                           onChange={() => toggleSelect(d._id)}
//                           className="w-4 h-4 text-blue-600 rounded"
//                         />
//                       </td>
//                       <td className="border-b px-4 py-3 text-sm text-gray-700">
//                         {(pagination.page - 1) * pagination.limit + i + 1}
//                       </td>
//                       <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
//                         {d.name}
//                       </td>
//                       <td className="border-b px-4 py-3 text-sm text-gray-700">
//                         {d.stateName}
//                       </td>
//                       <td className="border-b px-4 py-3">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => openEdit(d)}
//                             className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
//                           >
//                             <Pencil size={14} /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteOne(d._id, d.name)}
//                             className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
//                           >
//                             <Trash2 size={14} /> Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* MOBILE CARD VIEW */}
//           <div className="md:hidden space-y-4">
//             {districts.length === 0 ? (
//               <div className="text-center py-8 px-4 bg-white rounded-lg border shadow">
//                 <div className="text-gray-500 mb-4">
//                   {search 
//                     ? `No districts found matching "${search}"`
//                     : filterStateId 
//                       ? `No districts found for ${getStateNameById(filterStateId)}`
//                       : "No districts found. Select a state to filter."}
//                 </div>
//                 <button
//                   onClick={openAdd}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 mx-auto"
//                 >
//                   <Plus size={16} /> Add District
//                 </button>
//               </div>
//             ) : (
//               districts.map((d, i) => (
//                 <div key={d._id} className="bg-white border rounded-lg p-4 shadow">
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="font-semibold text-gray-900">
//                       #{(pagination.page - 1) * pagination.limit + i + 1}
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={!!d.selected}
//                       onChange={() => toggleSelect(d._id)}
//                       className="w-4 h-4 text-blue-600 rounded"
//                     />
//                   </div>

//                   <div className="space-y-3 mb-5">
//                     <div>
//                       <p className="text-xs text-gray-500 font-medium mb-1">District</p>
//                       <p className="text-gray-900 font-medium">{d.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 font-medium mb-1">State</p>
//                       <p className="text-gray-700">{d.stateName}</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => openEdit(d)}
//                       className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
//                     >
//                       <Pencil size={14} /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteOne(d._id, d.name)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION SECTION */}
//           {districts.length > 0 && (
//             <div className="mt-8 bg-white p-6 rounded-lg border shadow">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//                 {/* Pagination Info */}
//                 <div className="text-sm text-gray-600">
//                   <span className="font-semibold text-gray-900">
//                     Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
//                     {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
//                     {pagination.total} districts
//                   </span>
//                   {filterStateId && (
//                     <span className="text-gray-500">
//                       {" "}in <span className="font-semibold">{getStateNameById(filterStateId)}</span>
//                     </span>
//                   )}
//                 </div>

//                 {/* MUI Pagination Component */}
//                 <Stack spacing={2}>
//                   <Pagination
//                     count={pagination.totalPages}
//                     page={pagination.page}
//                     onChange={handlePageChange}
//                     color="primary"
//                     variant="outlined"
//                     shape="rounded"
//                     size="medium"
//                     showFirstButton
//                     showLastButton
//                     sx={{
//                       '& .MuiPaginationItem-root': {
//                         fontSize: '0.875rem',
//                         minWidth: '36px',
//                         height: '36px',
//                         '&.Mui-selected': {
//                           backgroundColor: '#2563eb',
//                           color: 'white',
//                           '&:hover': {
//                             backgroundColor: '#1d4ed8',
//                           },
//                         },
//                         '&:hover': {
//                           backgroundColor: '#f3f4f6',
//                         },
//                       },
//                     }}
//                   />
//                 </Stack>

//                 {/* Rows per page selector */}
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
//                   <select
//                     className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={pagination.limit}
//                     onChange={(e) => {
//                       const newLimit = Number(e.target.value);
//                       setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
//                       fetchDistricts(1, search, filterStateId);
//                     }}
//                   >
//                     {[5, 10, 20, 50].map(option => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* ADD/EDIT MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {editId ? "Edit District" : "Add New District"}
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* District Name Input */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   District Name *
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   placeholder="Enter district name"
//                   value={districtName}
//                   onChange={e => setDistrictName(e.target.value)}
//                   autoFocus
//                 />
//               </div>

//               {/* State Selection */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   State *
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   value={selectedStateId}
//                   onChange={(e) => setSelectedStateId(e.target.value)}
//                   disabled={statesLoading}
//                 >
//                   <option value="">Select a state</option>
//                   {states.map(state => (
//                     <option key={state._id} value={state._id}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={!districtName.trim() || !selectedStateId || saving}
//                 className={`px-5 py-2.5 rounded-lg font-medium ${
//                   !districtName.trim() || !selectedStateId || saving
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-green-600 hover:bg-green-700 text-white'
//                 }`}
//               >
//                 {saving ? 'Saving...' : editId ? 'Update District' : 'Add District'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaRedo, 
  FaCheck,
  FaCopy,
  FaPrint,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaFilter
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DistrictItem {
  _id: string;
  name: string;
  stateId: string;
  state?: {
    _id: string;
    name: string;
  };
  stateName?: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface StateItem {
  _id: string;
  name: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");

  // Bulk selection state
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // MUI Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deleteDistrictInfo, setDeleteDistrictInfo] = useState<{id: string | null, name: string}>({id: null, name: ""});

  // Pagination and filter state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  
  // State filter for districts
  const [filterStateId, setFilterStateId] = useState<string>("");

  /* ---------- API FUNCTIONS ---------- */
  const fetchStates = useCallback(async () => {
    setStatesLoading(true);
    try {
      const response = await axios.get("/api/states", {
        params: { page: 1, limit: 100 }
      });
      if (response.data.success) {
        setStates(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
      toast.error("Failed to load states");
    } finally {
      setStatesLoading(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (page = 1, searchQuery = "", stateId = "", limit?: number) => {
    try {
      const params: any = {
        page: page,
        limit: limit || pagination.limit,
        search: searchQuery,
      };

      // Only add stateId if it's not empty (not "All")
      if (stateId) {
        params.stateId = stateId;
      }

      const response = await axios.get("/api/districts", { params });
      const data = response.data;

      if (data.success) {
        // Enhance districts with state names from the API response
        const districtsWithStateNames = data.data.map((district: any) => {
          // Get state name from district.state object or fallback to finding from states list
          let stateName = "Unknown State";
          if (district.state && district.state.name) {
            stateName = district.state.name;
          } else if (district.stateId) {
            const state = states.find(s => s._id === district.stateId);
            stateName = state?.name || "Unknown State";
          }
          
          return {
            ...district,
            state: district.state || { _id: district.stateId, name: stateName },
            stateName: stateName,
            selected: false
          };
        });
        
        setDistricts(districtsWithStateNames);
        setPagination({
          total: data.pagination?.total || data.total || 0,
          page: data.pagination?.page || data.page || 1,
          limit: data.pagination?.limit || data.limit || (limit || pagination.limit),
          totalPages: data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / (data.pagination?.limit || data.limit || (limit || pagination.limit))),
        });
        setSelectedDistricts([]);
        setSelectAll(false);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch districts");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [pagination.limit, states]);

  const createDistrict = async () => {
    try {
      const response = await axios.post("/api/districts", {
        name: districtName,
        stateId: selectedStateId
      });
      
      if (response.data.success) {
        toast.success("District added successfully");
        await fetchDistricts(pagination.page, search, filterStateId);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add district");
      return false;
    }
  };

  const updateDistrict = async (id: string) => {
    try {
      const response = await axios.put(`/api/districts/${id}`, {
        name: districtName,
        stateId: selectedStateId
      });
      
      if (response.data.success) {
        toast.success("District updated successfully");
        await fetchDistricts(pagination.page, search, filterStateId);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update district");
      return false;
    }
  };

  const deleteDistrict = async (id: string) => {
    try {
      await axios.delete(`/api/districts/${id}`);
      toast.success("District deleted successfully");
      
      if (districts.length === 1 && pagination.page > 1) {
        await fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        await fetchDistricts(pagination.page, search, filterStateId);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete district");
      return false;
    }
  };

  const bulkDeleteDistricts = async (ids: string[]) => {
    try {
      await axios.delete("/api/districts", { data: { ids } });
      toast.success(`${ids.length} district(s) deleted successfully`);
      
      if (districts.length === ids.length && pagination.page > 1) {
        await fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        await fetchDistricts(pagination.page, search, filterStateId);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete districts");
      return false;
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    // Only fetch districts when states are loaded and initial loading is true
    if (states.length > 0 && initialLoading) {
      fetchDistricts(1, search, filterStateId);
    }
  }, [states, initialLoading]);

  /* ---------- SELECT HANDLERS ---------- */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allDistrictIds = districts.map(district => district._id);
      setSelectedDistricts(allDistrictIds);
      setSelectAll(true);
    } else {
      setSelectedDistricts([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDistricts([...selectedDistricts, id]);
    } else {
      setSelectedDistricts(selectedDistricts.filter(districtId => districtId !== id));
      setSelectAll(false);
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setDistrictName("");
    setSelectedStateId("");
    setShowModal(true);
  };

  const openEdit = (d: DistrictItem) => {
    setEditId(d._id);
    setDistrictName(d.name);
    setSelectedStateId(d.stateId);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!districtName.trim()) {
      toast.error("Please enter district name");
      return;
    }
    
    if (!selectedStateId) {
      toast.error("Please select a state");
      return;
    }

    setLoading(true);
    let success;
    if (editId) {
      success = await updateDistrict(editId);
    } else {
      success = await createDistrict();
    }

    if (success) {
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleDeleteClick = (district: DistrictItem) => {
    setDeleteDistrictInfo({ id: district._id, name: district.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDistrictInfo.id) return;
    
    setLoading(true);
    await deleteDistrict(deleteDistrictInfo.id);
    setDeleteDialogOpen(false);
    setDeleteDistrictInfo({ id: null, name: "" });
    setLoading(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedDistricts.length === 0) {
      toast.error("No districts selected");
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setLoading(true);
    await bulkDeleteDistricts(selectedDistricts);
    setBulkDeleteDialogOpen(false);
    setLoading(false);
  };

  /* ---------- EXPORT FUNCTIONS ---------- */
  const handleCopy = async () => {
    const text = districts.map((district, index) => 
      `${index + 1}\t${district.name}\t${district.stateName}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Districts data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    if (districts.length === 0) {
      toast.error("No districts to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(districts.map((district, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "District Name": district.name,
        "State": district.stateName,
        "Created At": district.createdAt ? new Date(district.createdAt).toLocaleDateString() : 'N/A',
        "Updated At": district.updatedAt ? new Date(district.updatedAt).toLocaleDateString() : 'N/A'
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Districts");
      XLSX.writeFile(wb, `districts-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportCSV = () => {
    if (districts.length === 0) {
      toast.error("No districts to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(districts.map((district, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "District Name": district.name,
        "State": district.stateName
      })));
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `districts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handleExportPDF = () => {
    if (districts.length === 0) {
      toast.error("No districts to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Districts Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "District Name", "State"];
      const tableRows: any = districts.map((district, index) => [
        index + 1 + (pagination.page - 1) * pagination.limit,
        district.name,
        district.stateName || 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`districts-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  const handlePrint = () => {
    if (districts.length === 0) {
      toast.error("No districts to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Districts Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🗺️ Districts Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Districts: ${pagination.total} | Showing: ${districts.length} districts</div>
          <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>District Name</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            ${districts.map((district, index) => `
              <tr>
                <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
                <td><strong>${district.name}</strong></td>
                <td>${district.stateName || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  /* ---------- PAGINATION ---------- */
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchDistricts(page, search, filterStateId);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchDistricts(1, search, filterStateId, newLimit);
  };

  /* ---------- SEARCH & FILTERS ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialLoading) {
        fetchDistricts(1, search, filterStateId);
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle state filter change
  useEffect(() => {
    if (!initialLoading) {
      fetchDistricts(1, search, filterStateId);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filterStateId]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterStateId("");
    setPagination(prev => ({ ...prev, page: 1 }));
    if (!initialLoading) {
      fetchDistricts(1, "", "");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Initial Loading Overlay */}
      {initialLoading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Districts Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all districts. {pagination.total} districts found.
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedDistricts.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedDistricts.length} district{selectedDistricts.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Mobile Export Buttons */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center justify-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 ${btn.color} font-medium`}
          >
            <btn.icon size={14} />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search districts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-72 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={filterStateId}
                onChange={(e) => setFilterStateId(e.target.value)}
                disabled={statesLoading}
              >
                {statesLoading ? (
                  <option>Loading states...</option>
                ) : states.length === 0 ? (
                  <option value="">No states available</option>
                ) : (
                  <>
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo size={14} /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon size={14} />
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <div className="md:col-span-2">
            <button
              onClick={openAdd}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaPlus size={14} /> Add District
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      {!initialLoading && districts.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Updated At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {districts.map((district, index) => (
                  <tr key={district._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDistricts.includes(district._id)}
                        onChange={(e) => handleSelectOne(district._id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{district.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="text-gray-700">{district.stateName || 'N/A'}</div>
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {district.createdAt ? new Date(district.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {district.updatedAt ? new Date(district.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => openEdit(district)}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit District"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(district)}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete District"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {districts.map((district, index) => (
              <div key={district._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(district._id)}
                      onChange={(e) => handleSelectOne(district._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{district.name}</div>
                      <div className="text-xs text-gray-500">Sr. {index + 1 + (pagination.page - 1) * pagination.limit}</div>
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => openEdit(district)} className="p-1.5 text-blue-600">
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(district)}
                      className="p-1.5 text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-xs text-gray-500">State</div>
                    <div className="text-xs font-medium">{district.stateName || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Created At</div>
                      <div className="text-xs">{district.createdAt ? new Date(district.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Updated At</div>
                      <div className="text-xs">{district.updatedAt ? new Date(district.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!initialLoading && districts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold mb-2">No districts found</h3>
          <p className="text-gray-500">
            {search 
              ? `No districts matching "${search}" found`
              : filterStateId 
                ? `No districts found for selected state`
                : "Try adjusting your search or filters"}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!initialLoading && districts.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
            <span className="font-semibold">{pagination.total}</span> districts
            <select
              value={pagination.limit}
              onChange={handleLimitChange}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl text-gray-800">
                {editId ? "Edit District" : "Add New District"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District Name *
                </label>
                <input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter district name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  disabled={statesLoading}
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : editId ? "Update" : "Add District"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE DELETE DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-semibold">
          Delete District?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the district "{deleteDistrictInfo.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* BULK DELETE DIALOG */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-semibold">
          Delete Selected Districts?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {selectedDistricts.length} selected district(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBulkDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete ({selectedDistricts.length})
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}