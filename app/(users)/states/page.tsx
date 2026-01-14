// "use client";

// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2, X } from "lucide-react";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import axios from "axios";

// interface StateItem {
//   _id: string;
//   name: string;
//   selected?: boolean;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export default function StatesPage() {
//   const [states, setStates] = useState<StateItem[]>([]);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [stateName, setStateName] = useState("");

//   // Pagination state
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//   });

//   /* ---------- API FUNCTIONS WITH AXIOS ---------- */
//   const fetchStates = async (page = 1, searchQuery = "") => {
//     setLoading(true);
//     try {
//       const params = {
//         page: page,
//         limit: pagination.limit,
//         ...(searchQuery && { search: searchQuery }),
//       };

//       const response = await axios.get("/api/states", { params });
//       const data = response.data;

//       if (data.success) {
//         setStates(data.data.map((state: any) => ({ ...state, selected: false })));
//         setPagination(data.pagination);
//       }
//     } catch (error: any) {
//       console.error("Error fetching states:", error);
//       setMessage(error.response?.data?.message || "Failed to fetch states");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createState = async () => {
//     try {
//       const response = await axios.post("/api/states", { name: stateName });
//       const data = response.data;

//       showSuccess("State added successfully");
//       fetchStates(pagination.page, search);
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error creating state:", error);
//       const errorMsg = error.response?.data?.message || "Failed to add state";
//       setMessage(errorMsg);
//       return { success: false, message: errorMsg };
//     }
//   };

//   const updateState = async (id: string) => {
//     try {
//       const response = await axios.put(`/api/states/${id}`, { name: stateName });
//       const data = response.data;

//       showSuccess("State updated successfully");
//       fetchStates(pagination.page, search);
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error updating state:", error);
//       const errorMsg = error.response?.data?.message || "Failed to update state";
//       setMessage(errorMsg);
//       return { success: false, message: errorMsg };
//     }
//   };

//   const deleteState = async (id: string) => {
//     try {
//       await axios.delete(`/api/states/${id}`);
      
//       showSuccess("State deleted successfully");
//       // If last item on page is deleted, go to previous page
//       if (states.length === 1 && pagination.page > 1) {
//         fetchStates(pagination.page - 1, search);
//       } else {
//         fetchStates(pagination.page, search);
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error deleting state:", error);
//       const errorMsg = error.response?.data?.message || "Failed to delete state";
//       setMessage(errorMsg);
//       return { success: false, message: errorMsg };
//     }
//   };

//   const bulkDeleteStates = async (ids: string[]) => {
//     try {
//       await axios.delete("/api/states", { data: { ids } });
      
//       showSuccess("Selected states deleted");
//       // If all items on page are deleted, go to previous page
//       if (states.length === ids.length && pagination.page > 1) {
//         fetchStates(pagination.page - 1, search);
//       } else {
//         fetchStates(pagination.page, search);
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error("Error deleting states:", error);
//       const errorMsg = error.response?.data?.message || "Failed to delete states";
//       setMessage(errorMsg);
//       return { success: false, message: errorMsg };
//     }
//   };

//   /* ---------- INITIAL FETCH ---------- */
//   useEffect(() => {
//     fetchStates();
//   }, []);

//   /* ---------- HELPERS ---------- */
//   const showSuccess = (text: string) => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), 2500);
//   };

//   /* ---------- SELECT HANDLERS ---------- */
//   const toggleSelect = (id: string) => {
//     setStates((prev) =>
//       prev.map((s) => (s._id === id ? { ...s, selected: !s.selected } : s))
//     );
//   };

//   const selectAll = (checked: boolean) => {
//     setStates((prev) => prev.map((s) => ({ ...s, selected: checked })));
//   };

//   const getSelectedIds = () => {
//     return states.filter((s) => s.selected).map((s) => s._id);
//   };

//   const handleDeleteSelected = () => {
//     const selectedIds = getSelectedIds();
//     if (selectedIds.length > 0) {
//       if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected state(s)?`)) {
//         bulkDeleteStates(selectedIds);
//       }
//     }
//   };

//   /* ---------- CRUD HANDLERS ---------- */
//   const openAdd = () => {
//     setEditId(null);
//     setStateName("");
//     setShowModal(true);
//   };

//   const openEdit = (s: StateItem) => {
//     setEditId(s._id);
//     setStateName(s.name);
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!stateName.trim()) {
//       setMessage("Please enter a state name");
//       return;
//     }

//     let result;
//     if (editId) {
//       result = await updateState(editId);
//     } else {
//       result = await createState();
//     }

//     if (result.success) {
//       setShowModal(false);
//     }
//   };

//   const handleDeleteOne = (id: string, name: string) => {
//     if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
//       deleteState(id);
//     }
//   };

//   /* ---------- PAGINATION HANDLERS ---------- */
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setPagination((prev) => ({ ...prev, page }));
//     fetchStates(page, search);
//   };

//   const handleSearch = () => {
//     // Reset to page 1 when searching
//     setPagination((prev) => ({ ...prev, page: 1 }));
//     fetchStates(1, search);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Handle search input change with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search !== "") {
//         handleSearch();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-4 md:p-6 text-black">
//       {/* Success/Error Message */}
//       {message && (
//         <div className={`mb-3 px-4 py-2 rounded ${
//           message.includes("Failed") || message.includes("Please enter") 
//             ? "bg-red-100 text-red-800" 
//             : "bg-green-100 text-green-800"
//         }`}>
//           {message}
//         </div>
//       )}

//       {/* HEADER */}
//       <h1 className="text-xl font-semibold mb-3">States</h1>

//       {/* ACTION BAR */}
//       <div className="flex flex-wrap justify-between gap-3 mb-3">
//         <div className="flex gap-2 items-center">
//           {/* Select All Checkbox */}
//           {states.length > 0 && (
//             <input
//               type="checkbox"
//               onChange={(e) => selectAll(e.target.checked)}
//               checked={states.length > 0 && states.every((s) => s.selected)}
//               className="w-4 h-4"
//             />
//           )}

//           <button
//             onClick={handleDeleteSelected}
//             disabled={!states.some((s) => s.selected)}
//             className={`px-4 py-2 rounded text-white ${
//               states.some((s) => s.selected)
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Delete Selected
//           </button>
//         </div>

//         <div className="flex gap-2">
//           <div className="relative">
//             <input
//               placeholder="Search states..."
//               className="border px-3 py-1 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//           <button
//             onClick={handleSearch}
//             className="border px-3 py-1 rounded hover:bg-gray-50"
//           >
//             Search
//           </button>
//           <button
//             onClick={openAdd}
//             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
//           >
//             <Plus size={16} /> Add New
//           </button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-4">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           <p className="mt-2">Loading states...</p>
//         </div>
//       )}

//       {/* DESKTOP TABLE */}
//       {!loading && (
//         <>
//           <div className="hidden md:block bg-white rounded border">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border px-3 py-2">✓</th>
//                   <th className="border px-3 py-2">Sr.</th>
//                   <th className="border px-3 py-2">State Name</th>
//                   <th className="border px-3 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {states.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="border px-3 py-4 text-center text-gray-500">
//                       {search ? "No states found matching your search" : "No states found"}
//                     </td>
//                   </tr>
//                 ) : (
//                   states.map((s, i) => (
//                     <tr key={s._id}>
//                       <td className="border px-3 py-2 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!s.selected}
//                           onChange={() => toggleSelect(s._id)}
//                           className="w-4 h-4"
//                         />
//                       </td>
//                       <td className="border px-3 py-2">
//                         {(pagination.page - 1) * pagination.limit + i + 1}
//                       </td>
//                       <td className="border px-3 py-2">{s.name}</td>
//                       <td className="border px-3 py-2 text-center">
//                         <div className="flex justify-center gap-2">
//                           <button
//                             onClick={() => openEdit(s)}
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                           >
//                             <Pencil size={12} /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteOne(s._id, s.name)}
//                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                           >
//                             <Trash2 size={12} /> Delete
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
//           <div className="md:hidden space-y-3">
//             {states.length === 0 ? (
//               <div className="text-center py-4 text-gray-500">
//                 {search ? "No states found matching your search" : "No states found"}
//               </div>
//             ) : (
//               states.map((s, i) => (
//                 <div key={s._id} className="bg-white border rounded p-3 shadow-sm">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-semibold">
//                       #{(pagination.page - 1) * pagination.limit + i + 1}
//                     </span>
//                     <input
//                       type="checkbox"
//                       checked={!!s.selected}
//                       onChange={() => toggleSelect(s._id)}
//                       className="w-4 h-4"
//                     />
//                   </div>

//                   <p className="text-sm mb-3">
//                     <b>State:</b> {s.name}
//                   </p>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => openEdit(s)}
//                       className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
//                     >
//                       <Pencil size={12} /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteOne(s._id, s.name)}
//                       className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
//                     >
//                       <Trash2 size={12} /> Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION */}
//           {states.length > 0 && pagination.totalPages > 1 && (
//             <div className="flex justify-center mt-4">
//               <Stack spacing={2}>
//                 <Pagination
//                   count={pagination.totalPages}
//                   page={pagination.page}
//                   onChange={handlePageChange}
//                   color="primary"
//                   showFirstButton
//                   showLastButton
//                   size="medium"
//                 />
//               </Stack>
//             </div>
//           )}

//           {/* Pagination Info */}
//           {states.length > 0 && (
//             <div className="text-sm text-gray-600 mt-2 text-center">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
//               {pagination.total} states
//             </div>
//           )}
//         </>
//       )}

//       {/* ADD/EDIT MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-sm rounded p-4">
//             <div className="flex justify-between mb-3">
//               <h2 className="font-semibold">
//                 {editId ? "Edit State" : "Add State"}
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="hover:bg-gray-100 p-1 rounded"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <input
//               className="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter State Name"
//               value={stateName}
//               onChange={(e) => setStateName(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSave()}
//               autoFocus
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="border px-4 py-2 rounded hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 {loading ? "Saving..." : "Save"}
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
  FaFilePdf
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

interface StateItem {
  _id: string;
  name: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StatesPage() {
  const [states, setStates] = useState<StateItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [stateName, setStateName] = useState("");

  // Bulk selection state
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // MUI Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deleteStateInfo, setDeleteStateInfo] = useState<{id: string | null, name: string}>({id: null, name: ""});

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  /* ---------- API FUNCTIONS ---------- */
  const fetchStates = useCallback(async (page = 1, searchQuery = "", limit?: number) => {
    try {
      const params = {
        page: page,
        limit: limit || pagination.limit,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await axios.get("/api/states", { params });
      const data = response.data;

      if (data.success) {
        setStates(data.data.map((state: any) => ({ ...state, selected: false })));
        setPagination({
          total: data.pagination?.total || data.total || 0,
          page: data.pagination?.page || data.page || 1,
          limit: data.pagination?.limit || data.limit || (limit || pagination.limit),
          totalPages: data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / (data.pagination?.limit || data.limit || (limit || pagination.limit))),
        });
        setSelectedStates([]);
        setSelectAll(false);
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
      toast.error(error.response?.data?.message || "Failed to fetch states");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [pagination.limit]);

  const createState = async () => {
    try {
      const response = await axios.post("/api/states", { name: stateName });
      if (response.data.success) {
        toast.success("State added successfully");
        fetchStates(pagination.page, search);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add state");
      return false;
    }
  };

  const updateState = async (id: string) => {
    try {
      const response = await axios.put(`/api/states/${id}`, { name: stateName });
      if (response.data.success) {
        toast.success("State updated successfully");
        fetchStates(pagination.page, search);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update state");
      return false;
    }
  };

  const deleteState = async (id: string) => {
    try {
      await axios.delete(`/api/states/${id}`);
      toast.success("State deleted successfully");
      
      if (states.length === 1 && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete state");
      return false;
    }
  };

  const bulkDeleteStates = async (ids: string[]) => {
    try {
      await axios.delete("/api/states", { data: { ids } });
      toast.success(`${ids.length} state(s) deleted successfully`);
      
      if (states.length === ids.length && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete states");
      return false;
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  /* ---------- SELECT HANDLERS ---------- */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allStateIds = states.map(state => state._id);
      setSelectedStates(allStateIds);
      setSelectAll(true);
    } else {
      setSelectedStates([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStates([...selectedStates, id]);
    } else {
      setSelectedStates(selectedStates.filter(stateId => stateId !== id));
      setSelectAll(false);
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setStateName("");
    setShowModal(true);
  };

  const openEdit = (s: StateItem) => {
    setEditId(s._id);
    setStateName(s.name);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!stateName.trim()) {
      toast.error("Please enter a state name");
      return;
    }

    setLoading(true);
    let success;
    if (editId) {
      success = await updateState(editId);
    } else {
      success = await createState();
    }

    if (success) {
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleDeleteClick = (state: StateItem) => {
    setDeleteStateInfo({ id: state._id, name: state.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStateInfo.id) return;
    
    setLoading(true);
    await deleteState(deleteStateInfo.id);
    setDeleteDialogOpen(false);
    setDeleteStateInfo({ id: null, name: "" });
    setLoading(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedStates.length === 0) {
      toast.error("No states selected");
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setLoading(true);
    await bulkDeleteStates(selectedStates);
    setBulkDeleteDialogOpen(false);
    setLoading(false);
  };

  /* ---------- EXPORT FUNCTIONS ---------- */
  // const handleCopy = async () => {
  //   const text = states.map((state, index) => 
  //     `${index + 1}\t${state.name}`
  //   ).join("\n");
    
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     toast.success("States data copied to clipboard!");
  //   } catch (err) {
  //     toast.error("Failed to copy to clipboard");
  //   }
  // };
 const handleCopy = async () => {
  // Calculate column widths based on content
  const maxIndexLength = states.length.toString().length + 1;
  const maxNameLength = Math.max(...states.map(state => state.name.length), 12);
  
  // Create table header
  const headerNumber = "No.".padEnd(maxIndexLength);
  const headerName = "State Name".padEnd(maxNameLength);
  const tableHeader = `${headerNumber}\t${headerName}`;
  
  // Create separator
  const separator = "-".repeat(maxIndexLength) + "\t" + "-".repeat(maxNameLength);
  
  // Create table rows
  const tableRows = states.map((state, index) => {
    const number = (index + 1).toString().padEnd(maxIndexLength);
    const name = state.name.padEnd(maxNameLength);
    return `${number}\t${name}`;
  }).join("\n");
  
  const text = `${tableHeader}\n${separator}\n${tableRows}`;
  
  try {
    await navigator.clipboard.writeText(text);
    toast.success("States table copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy to clipboard");
  }
};
  const handleExportExcel = () => {
    if (states.length === 0) {
      toast.error("No states to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(states.map((state, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "State Name": state.name,
        "Created At": state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A',
        "Updated At": state.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "States");
      XLSX.writeFile(wb, `states-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportCSV = () => {
    if (states.length === 0) {
      toast.error("No states to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(states.map((state, index) => ({
        "Sr.": index + 1 + (pagination.page - 1) * pagination.limit,
        "State Name": state.name
      })));
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `states-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handleExportPDF = () => {
    if (states.length === 0) {
      toast.error("No states to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("States Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "State Name", "Created At"];
      const tableRows: any = states.map((state, index) => [
        index + 1 + (pagination.page - 1) * pagination.limit,
        state.name,
        state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`states-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  const handlePrint = () => {
    if (states.length === 0) {
      toast.error("No states to print");
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
        <title>States Report</title>
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
          <h1>📋 States Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total States: ${pagination.total} | Showing: ${states.length} states</div>
          <div class="header-info">Page: ${pagination.page} of ${pagination.totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>State Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${states.map((state, index) => `
              <tr>
                <td>${index + 1 + (pagination.page - 1) * pagination.limit}</td>
                <td><strong>${state.name}</strong></td>
                <td>${state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</td>
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
    fetchStates(page, search);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchStates(1, search, newLimit);
  };

  /* ---------- SEARCH ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStates(1, search);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchStates]);

  const handleResetFilters = () => {
    setSearch("");
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStates(1, "");
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
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">States Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all states. {pagination.total} states found.
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedStates.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedStates.length} state{selectedStates.length !== 1 ? 's' : ''} selected
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
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
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
              <FaPlus size={14} /> Add State
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      {!initialLoading && states.length > 0 && (
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
                  <th className="p-[.6rem] text-sm text-left font-semibold">State Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Created At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Updated At</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {states.map((state, index) => (
                  <tr key={state._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-[.6rem] text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state._id)}
                        onChange={(e) => handleSelectOne(state._id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{state.name}</div>
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm text-gray-600">
                      {state.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => openEdit(state)}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit State"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(state)}
                          className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete State"
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
            {states.map((state, index) => (
              <div key={state._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStates.includes(state._id)}
                      onChange={(e) => handleSelectOne(state._id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{state.name}</div>
                      <div className="text-xs text-gray-500">Sr. {index + 1 + (pagination.page - 1) * pagination.limit}</div>
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => openEdit(state)} className="p-1.5 text-blue-600">
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(state)}
                      className="p-1.5 text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Created At</div>
                      <div className="text-xs">{state.createdAt ? new Date(state.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Updated At</div>
                      <div className="text-xs">{state.updatedAt ? new Date(state.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!initialLoading && states.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold mb-2">No states found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!initialLoading && states.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (pagination.page - 1) * pagination.limit}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
            <span className="font-semibold">{pagination.total}</span> states
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
                {editId ? "Edit State" : "Add New State"}
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
                  State Name *
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter state name"
                  autoFocus
                />
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
                {loading ? "Saving..." : editId ? "Update" : "Add State"}
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
          Delete State?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the state "{deleteStateInfo.name}"? This action cannot be undone.
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
          Delete Selected States?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {selectedStates.length} selected state(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBulkDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete ({selectedStates.length})
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}