"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

interface DistrictItem {
  _id: string;
  name: string;
  stateId: string;
  stateName?: string;
  selected?: boolean;
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

const rowsPerPageOptions = [5, 10, 20, 50];

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");

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
  const fetchStates = async () => {
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
  };

  const fetchDistricts = useCallback(async (page = 1, searchQuery = "", stateId = "") => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
        limit: pagination.limit,
        search: searchQuery,
      };

      // Only add stateId if it's not empty (not "All")
      if (stateId) {
        params.stateId = stateId;
      }

      const response = await axios.get("/api/districts", { params });
      const data = response.data;

      if (data.success) {
        // Enhance districts with state names
        const districtsWithStateNames = data.data.map((district: any) => {
          const state = states.find(s => s._id === district.stateId);
          return {
            ...district,
            stateName: state?.name || "Unknown State",
            selected: false
          };
        });
        
        setDistricts(districtsWithStateNames);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch districts");
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch districts";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, states]);

  const createDistrict = async () => {
    try {
      const response = await axios.post("/api/districts", {
        name: districtName,
        stateId: selectedStateId
      });
      
      toast.success("District added successfully");
      fetchDistricts(pagination.page, search, filterStateId);
      return { success: true };
    } catch (error: any) {
      console.error("Error creating district:", error);
      const errorMsg = error.response?.data?.message || "Failed to add district";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const updateDistrict = async (id: string) => {
    try {
      const response = await axios.put(`/api/districts/${id}`, {
        name: districtName,
        stateId: selectedStateId
      });
      
      toast.success("District updated successfully");
      fetchDistricts(pagination.page, search, filterStateId);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating district:", error);
      const errorMsg = error.response?.data?.message || "Failed to update district";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const deleteDistrict = async (id: string) => {
    try {
      await axios.delete(`/api/districts/${id}`);
      
      toast.success("District deleted successfully");
      if (districts.length === 1 && pagination.page > 1) {
        fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        fetchDistricts(pagination.page, search, filterStateId);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting district:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete district";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const bulkDeleteDistricts = async (ids: string[]) => {
    try {
      await axios.delete("/api/districts", { data: { ids } });
      
      toast.success(`Deleted ${ids.length} district(s) successfully`);
      if (districts.length === ids.length && pagination.page > 1) {
        fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        fetchDistricts(pagination.page, search, filterStateId);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting districts:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete districts";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (states.length > 0) {
      fetchDistricts(1, search, filterStateId);
    }
  }, [states, filterStateId, search, fetchDistricts]);

  /* ---------- SELECT HANDLERS ---------- */
  const toggleSelect = (id: string) => {
    setDistricts(prev =>
      prev.map(d => d._id === id ? { ...d, selected: !d.selected } : d)
    );
  };

  const selectAll = (checked: boolean) => {
    setDistricts(prev => prev.map(d => ({ ...d, selected: checked })));
  };

  const getSelectedIds = () => {
    return districts.filter(d => d.selected).map(d => d._id);
  };

  const handleDeleteSelected = () => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length > 0) {
      const confirmDelete = async () => {
        await bulkDeleteDistricts(selectedIds);
      };
      
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Delete {selectedIds.length} selected district(s)?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ), {
        duration: 10000,
      });
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setDistrictName("");
    // When adding a new district, require a state to be selected
    if (states.length > 0 && !filterStateId) {
      toast.error("Please select a state first to add a district");
      return;
    }
    setSelectedStateId(filterStateId || "");
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

    const loadingToast = toast.loading("Saving district...");
    
    try {
      let result;
      if (editId) {
        result = await updateDistrict(editId);
      } else {
        result = await createDistrict();
      }

      if (result.success) {
        toast.dismiss(loadingToast);
        setShowModal(false);
      } else {
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete district "{name}"?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting district...");
              await deleteDistrict(id);
              toast.dismiss(loadingToast);
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  /* ---------- PAGINATION & SEARCH ---------- */
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchDistricts(page, search, filterStateId);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDistricts(1, search, filterStateId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle state filter change
  const handleStateFilterChange = (stateId: string) => {
    setFilterStateId(stateId);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDistricts(1, search, stateId);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1 
    }));
    fetchDistricts(1, search, filterStateId);
  };

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Get state name by ID
  const getStateNameById = (stateId: string) => {
    if (!stateId) return "All States";
    const state = states.find(s => s._id === stateId);
    return state?.name || "Unknown State";
  };

  return (
    <div className="p-4 md:p-6 text-black">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Districts Management</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium mb-2 text-gray-700">Filter by State</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={filterStateId}
            onChange={(e) => handleStateFilterChange(e.target.value)}
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
        
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium mb-2 text-gray-700">Search Districts</label>
          <div className="flex gap-2">
            <input
              placeholder="Search district name..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          {districts.length > 0 && (
            <input
              type="checkbox"
              onChange={(e) => selectAll(e.target.checked)}
              checked={districts.length > 0 && districts.every(d => d.selected)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          )}

          <button
            onClick={handleDeleteSelected}
            disabled={!districts.some(d => d.selected)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              districts.some(d => d.selected)
                ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Delete Selected ({getSelectedIds().length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            disabled={!filterStateId}
          >
            <Plus size={18} /> Add New District
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading districts...</p>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && (
        <>
          <div className="hidden md:block bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={(e) => selectAll(e.target.checked)}
                        checked={districts.length > 0 && districts.every(d => d.selected)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="border-b px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sr.
                    </th>
                    <th className="border-b px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      District Name
                    </th>
                    <th className="border-b px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      State
                    </th>
                    <th className="border-b px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {districts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500 mb-2">
                          {search 
                            ? `No districts found matching "${search}"`
                            : filterStateId 
                              ? `No districts found for ${getStateNameById(filterStateId)}.`
                              : "No districts found. Select a state to filter or add new districts."}
                        </div>
                        {filterStateId && (
                          <button
                            onClick={openAdd}
                            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
                          >
                            <Plus size={16} /> Add District
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    districts.map((d, i) => (
                      <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={!!d.selected}
                            onChange={() => toggleSelect(d._id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {(pagination.page - 1) * pagination.limit + i + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {d.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {d.stateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(d)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOne(d._id, d.name)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4">
            {districts.length === 0 ? (
              <div className="text-center py-8 px-4 bg-white rounded-lg border shadow-sm">
                <div className="text-gray-500 mb-4">
                  {search 
                    ? `No districts found matching "${search}"`
                    : filterStateId 
                      ? `No districts found for ${getStateNameById(filterStateId)}`
                      : "No districts found. Select a state to filter."}
                </div>
                {filterStateId && (
                  <button
                    onClick={openAdd}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} /> Add District
                  </button>
                )}
              </div>
            ) : (
              districts.map((d, i) => (
                <div key={d._id} className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900">
                      #{(pagination.page - 1) * pagination.limit + i + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!d.selected}
                      onChange={() => toggleSelect(d._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">District</p>
                      <p className="text-gray-900 font-medium">{d.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">State</p>
                      <p className="text-gray-700">{d.stateName}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(d)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOne(d._id, d.name)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION SECTION - Always show when there are districts */}
          {districts.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} districts
                  </span>
                  {filterStateId && (
                    <span className="text-gray-500">
                      {" "}in <span className="font-semibold">{getStateNameById(filterStateId)}</span>
                    </span>
                  )}
                </div>

                {/* MUI Pagination Component */}
                <Stack spacing={2}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    size="medium"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '0.875rem',
                        minWidth: '36px',
                        height: '36px',
                        '&.Mui-selected': {
                          backgroundColor: '#2563eb',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                          },
                        },
                        '&:hover': {
                          backgroundColor: '#f3f4f6',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Rows per page selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
                  <div className="flex items-center gap-2">
                    {rowsPerPageOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => handleRowsPerPageChange(option)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          pagination.limit === option
                            ? 'bg-blue-600 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* For single page */}
          {districts.length > 0 && pagination.totalPages === 1 && (
            <div className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg text-center border">
              Showing all {pagination.total} districts
              {filterStateId && (
                <span> in <span className="font-semibold">{getStateNameById(filterStateId)}</span></span>
              )}
            </div>
          )}
        </>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editId ? "Edit District" : "Add New District"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* District Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  District Name *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter district name"
                  value={districtName}
                  onChange={e => setDistrictName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  State *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!districtName.trim() || !selectedStateId}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  !districtName.trim() || !selectedStateId
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                }`}
              >
                {editId ? 'Update District' : 'Add District'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}