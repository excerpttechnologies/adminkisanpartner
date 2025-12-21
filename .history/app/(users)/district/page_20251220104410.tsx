"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
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

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
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
        // Don't set default filter to first state - let user choose
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
      setMessage("Failed to load states");
    } finally {
      setStatesLoading(false);
    }
  };

  const fetchDistricts = async (page = 1, searchQuery = "", stateId = "") => {
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

      console.log("Fetching districts with params:", params);

      const response = await axios.get("/api/districts", { params });
      const data = response.data;

      if (data.success) {
        console.log("Districts data received:", data.data);
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
        console.error("API error:", data.message);
        setMessage(data.message || "Failed to fetch districts");
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch districts";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createDistrict = async () => {
    try {
      const response = await axios.post("/api/districts", {
        name: districtName,
        stateId: selectedStateId
      });
      
      showSuccess("District added successfully");
      fetchDistricts(pagination.page, search, filterStateId);
      return { success: true };
    } catch (error: any) {
      console.error("Error creating district:", error);
      const errorMsg = error.response?.data?.message || "Failed to add district";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const updateDistrict = async (id: string) => {
    try {
      const response = await axios.put(`/api/districts/${id}`, {
        name: districtName,
        stateId: selectedStateId
      });
      
      showSuccess("District updated successfully");
      fetchDistricts(pagination.page, search, filterStateId);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating district:", error);
      const errorMsg = error.response?.data?.message || "Failed to update district";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const deleteDistrict = async (id: string) => {
    try {
      await axios.delete(`/api/districts/${id}`);
      
      showSuccess("District deleted successfully");
      if (districts.length === 1 && pagination.page > 1) {
        fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        fetchDistricts(pagination.page, search, filterStateId);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting district:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete district";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const bulkDeleteDistricts = async (ids: string[]) => {
    try {
      await axios.delete("/api/districts", { data: { ids } });
      
      showSuccess("Selected districts deleted");
      if (districts.length === ids.length && pagination.page > 1) {
        fetchDistricts(pagination.page - 1, search, filterStateId);
      } else {
        fetchDistricts(pagination.page, search, filterStateId);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting districts:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete districts";
      setMessage(errorMsg);
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
  }, [states, filterStateId,search]);

  /* ---------- HELPERS ---------- */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const getStateNameById = (stateId: string) => {
    if (!stateId) return "All States";
    const state = states.find(s => s._id === stateId);
    return state?.name || "Unknown State";
  };

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
      if (window.confirm(`Delete ${selectedIds.length} selected district(s)?`)) {
        bulkDeleteDistricts(selectedIds);
      }
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setDistrictName("");
    // When adding a new district, require a state to be selected
    if (states.length > 0 && !filterStateId) {
      setMessage("Please select a state first to add a district");
      setShowModal(false);
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
      setMessage("Please enter district name");
      return;
    }
    
    if (!selectedStateId) {
      setMessage("Please select a state");
      return;
    }

    let result;
    if (editId) {
      result = await updateDistrict(editId);
    } else {
      result = await createDistrict();
    }

    if (result.success) {
      setShowModal(false);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (window.confirm(`Delete district "${name}"?`)) {
      deleteDistrict(id);
    }
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

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-4 md:p-6 text-black">
      {/* Message */}
      {message && (
        <div className={`mb-3 px-4 py-2 rounded ${
          message.includes("Failed") || message.includes("Please") 
            ? "bg-red-100 text-red-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {message}
        </div>
      )}

      {/* HEADER */}
      <h1 className="text-xl font-semibold mb-3">Districts</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Filter by State</label>
          <select
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Search Districts</label>
          <div className="flex gap-2">
            <input
              placeholder="Enter district name..."
              className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div className="flex gap-2 items-center">
          {districts.length > 0 && (
            <input
              type="checkbox"
              onChange={(e) => selectAll(e.target.checked)}
              checked={districts.length > 0 && districts.every(d => d.selected)}
              className="w-4 h-4"
            />
          )}

          <button
            onClick={handleDeleteSelected}
            disabled={!districts.some(d => d.selected)}
            className={`px-4 py-2 rounded text-white ${
              districts.some(d => d.selected)
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Delete Selected
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
            disabled={!filterStateId} // Disable if no state is selected (including "All")
          >
            <Plus size={16} /> Add New District
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Loading districts...</p>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && (
        <>
          {/* Always show table, not conditional on filterStateId */}
          <div className="hidden md:block bg-white rounded border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2">✓</th>
                  <th className="border px-3 py-2">Sr.</th>
                  <th className="border px-3 py-2">District Name</th>
                  <th className="border px-3 py-2">State</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {districts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border px-3 py-8 text-center text-gray-500">
                      {search 
                        ? `No districts found matching "${search}"`
                        : filterStateId 
                          ? `No districts found for ${getStateNameById(filterStateId)}. Click "Add New District" to create one.`
                          : "No districts found. Select a state to filter or add new districts."}
                    </td>
                  </tr>
                ) : (
                  districts.map((d, i) => (
                    <tr key={d._id}>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!d.selected}
                          onChange={() => toggleSelect(d._id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        {(pagination.page - 1) * pagination.limit + i + 1}
                      </td>
                      <td className="border px-3 py-2">{d.name}</td>
                      <td className="border px-3 py-2">{d.stateName}</td>
                      <td className="border px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEdit(d)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOne(d._id, d.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-3">
            {districts.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 rounded">
                <div className="text-gray-500 mb-2">
                  {search 
                    ? `No districts found matching "${search}"`
                    : filterStateId 
                      ? `No districts found for ${getStateNameById(filterStateId)}`
                      : "No districts found. Select a state to filter."}
                </div>
                {filterStateId && (
                  <button
                    onClick={openAdd}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1 mx-auto"
                  >
                    <Plus size={16} /> Add District
                  </button>
                )}
              </div>
            ) : (
              districts.map((d, i) => (
                <div key={d._id} className="bg-white border rounded p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">
                      #{(pagination.page - 1) * pagination.limit + i + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!d.selected}
                      onChange={() => toggleSelect(d._id)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <b>District:</b> {d.name}
                    </p>
                    <p className="text-sm">
                      <b>State:</b> {d.stateName}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(d)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOne(d._id, d.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION SECTION */}
          {districts.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-6 bg-white p-4 rounded-lg border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{" "}
                  <span className="font-semibold">{pagination.total}</span> districts
                  {filterStateId && (
                    <span> in <span className="font-semibold">{getStateNameById(filterStateId)}</span></span>
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
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#2563eb',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Page Size Selector (Optional) */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={pagination.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
                      fetchDistricts(1, search, filterStateId);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* For single page */}
          {districts.length > 0 && pagination.totalPages === 1 && (
            <div className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded text-center">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">
                {editId ? "Edit District" : "Add District"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-gray-100 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* District Name Input */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  District Name *
                </label>
                <input
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter district name"
                  value={districtName}
                  onChange={e => setDistrictName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <select
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                disabled={!districtName.trim() || !selectedStateId}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}