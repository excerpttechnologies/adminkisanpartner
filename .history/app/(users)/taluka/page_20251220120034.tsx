"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Filter } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

interface District {
  _id: string;
  name: string;
  state?: {
    _id: string;
    name: string;
  };
  stateName?: string;
}

interface Taluka {
  _id: string;
  name: string;
  district?: {
    _id: string;
    name: string;
    state?: {
      _id: string;
      name: string;
    };
  };
  districtName?: string;
  stateName?: string;
  selected?: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TalukaPage() {
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [talukaName, setTalukaName] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // Pagination and filter state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  
  // District filter for talukas
  const [filterDistrictId, setFilterDistrictId] = useState<string>("");

  /* ---------- API FUNCTIONS ---------- */
  const fetchDistricts = async () => {
    setDistrictsLoading(true);
    try {
      const response = await axios.get("/api/districts", {
        params: { 
          limit: 100,
          page: 1
        }
      });
      if (response.data.success) {
        const districtsWithStateName = response.data.data.map((district: any) => ({
          ...district,
          stateName: district.state?.name || "Unknown State"
        }));
        setDistricts(districtsWithStateName);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    } finally {
      setDistrictsLoading(false);
    }
  };

  const fetchTalukas = async (page = 1, searchQuery = "", districtId = "") => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
        limit: pagination.limit,
        search: searchQuery,
      };

      if (districtId) {
        params.districtId = districtId;
      }

      const response = await axios.get("/api/talukas", { params });
      const data = response.data;

      if (data.success) {
        // Format the talukas with district and state names
        const formattedTalukas = data.data.map((taluka: any) => ({
          _id: taluka._id,
          name: taluka.name,
          district: taluka.district,
          districtName: taluka.districtName || taluka.district?.name || "Unknown District",
          stateName: taluka.stateName || taluka.district?.state?.name || "Unknown State",
          selected: false
        }));
        
        setTalukas(formattedTalukas);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch talukas");
      }
    } catch (error: any) {
      console.error("Error fetching talukas:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch talukas";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createTaluka = async () => {
    setSaving(true);
    try {
      const response = await axios.post("/api/talukas", {
        name: talukaName,
        district: selectedDistrictId
      });
      
      if (response.data.success) {
        toast.success("Taluka added successfully");
        fetchTalukas(pagination.page, search, filterDistrictId);
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to add taluka");
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error creating taluka:", error);
      const errorMsg = error.response?.data?.message || "Failed to add taluka";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setSaving(false);
    }
  };

  const updateTaluka = async (id: string) => {
    setSaving(true);
    try {
      const response = await axios.put(`/api/talukas/${id}`, {
        name: talukaName,
        district: selectedDistrictId
      });
      
      if (response.data.success) {
        toast.success("Taluka updated successfully");
        fetchTalukas(pagination.page, search, filterDistrictId);
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to update taluka");
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating taluka:", error);
      const errorMsg = error.response?.data?.message || "Failed to update taluka";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setSaving(false);
    }
  };

  const deleteTaluka = async (id: string) => {
    try {
      const response = await axios.delete(`/api/talukas/${id}`);
      
      if (response.data.success) {
        toast.success("Taluka deleted successfully");
        if (talukas.length === 1 && pagination.page > 1) {
          fetchTalukas(pagination.page - 1, search, filterDistrictId);
        } else {
          fetchTalukas(pagination.page, search, filterDistrictId);
        }
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to delete taluka");
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error deleting taluka:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete taluka";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const bulkDeleteTalukas = async (ids: string[]) => {
    try {
      const response = await axios.delete("/api/talukas", { data: { ids } });
      
      if (response.data.success) {
        toast.success(`${ids.length} taluka(s) deleted successfully`);
        if (talukas.length === ids.length && pagination.page > 1) {
          fetchTalukas(pagination.page - 1, search, filterDistrictId);
        } else {
          fetchTalukas(pagination.page, search, filterDistrictId);
        }
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to delete talukas");
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error deleting talukas:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete talukas";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (districts.length > 0) {
      fetchTalukas(1, search, filterDistrictId);
    }
  }, [districts, filterDistrictId, search]);

  /* ---------- SELECT HANDLERS ---------- */
  const toggleSelect = (id: string) => {
    setTalukas(prev =>
      prev.map(t => t._id === id ? { ...t, selected: !t.selected } : t)
    );
  };

  const selectAll = (checked: boolean) => {
    setTalukas(prev => prev.map(t => ({ ...t, selected: checked })));
  };

  const getSelectedIds = () => {
    return talukas.filter(t => t.selected).map(t => t._id);
  };

  const handleDeleteSelected = () => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length > 0) {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Delete {selectedIds.length} selected taluka(s)?</p>
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
                const loadingToast = toast.loading("Deleting...");
                await bulkDeleteTalukas(selectedIds);
                toast.dismiss(loadingToast);
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    }
  };

  /* ---------- CRUD HANDLERS ---------- */
  const openAdd = () => {
    setEditId(null);
    setTalukaName("");
    setSelectedDistrictId("");
    setShowModal(true);
  };

  const openEdit = (t: Taluka) => {
    setEditId(t._id);
    setTalukaName(t.name);
    setSelectedDistrictId(t.district?._id || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!talukaName.trim()) {
      toast.error("Please enter taluka name");
      return;
    }
    
    if (!selectedDistrictId) {
      toast.error("Please select a district");
      return;
    }

    const loadingToast = toast.loading(editId ? "Updating taluka..." : "Adding taluka...");
    
    try {
      let result;
      if (editId) {
        result = await updateTaluka(editId);
      } else {
        result = await createTaluka();
      }

      toast.dismiss(loadingToast);
      
      if (result.success) {
        setShowModal(false);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete taluka "{name}"?</p>
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
              const loadingToast = toast.loading("Deleting taluka...");
              await deleteTaluka(id);
              toast.dismiss(loadingToast);
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  /* ---------- PAGINATION & SEARCH ---------- */
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchTalukas(page, search, filterDistrictId);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTalukas(1, search, filterDistrictId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDistrictFilterChange = (districtId: string) => {
    setFilterDistrictId(districtId);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTalukas(1, search, districtId);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1 
    }));
    fetchTalukas(1, search, filterDistrictId);
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

  const getDistrictNameById = (districtId: string) => {
    if (!districtId) return "All Districts";
    const district = districts.find(d => d._id === districtId);
    return district ? `${district.name} (${district.stateName})` : "Unknown District";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kisan Partner</h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-2">Taluka Management</h2>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* District Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline-block w-4 h-4 mr-1" />
              Select District
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={filterDistrictId}
              onChange={(e) => handleDistrictFilterChange(e.target.value)}
              disabled={districtsLoading}
            >
              {districtsLoading ? (
                <option>Loading districts...</option>
              ) : districts.length === 0 ? (
                <option value="">No districts available</option>
              ) : (
                <>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district._id} value={district._id}>
                      {district.name} ({district.stateName})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline-block w-4 h-4 mr-1" />
              Search Taluka
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Enter taluka name..."
                className="flex-1 border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          {talukas.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) => selectAll(e.target.checked)}
                checked={talukas.length > 0 && talukas.every(t => t.selected)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                {getSelectedIds().length} selected
              </span>
            </div>
          )}

          <button
            onClick={handleDeleteSelected}
            disabled={!talukas.some(t => t.selected)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              talukas.some(t => t.selected)
                ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Delete Selected
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Taluka
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading talukas...</p>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!loading && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="py-4 px-6 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => selectAll(e.target.checked)}
                        checked={talukas.length > 0 && talukas.every(t => t.selected)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Sr.</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Taluka Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">District</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {talukas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="text-gray-500 mb-4">
                          {search 
                            ? `No talukas found matching "${search}"`
                            : filterDistrictId 
                              ? `No talukas found for ${getDistrictNameById(filterDistrictId)}. Click "Add Taluka" to create one.`
                              : "No talukas found. Select a district to filter or add new talukas."}
                        </div>
                        <button
                          onClick={openAdd}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
                        >
                          <Plus size={16} /> Add Taluka
                        </button>
                      </td>
                    </tr>
                  ) : (
                    talukas.map((t, i) => (
                      <tr key={t._id} className="hover:bg-green-50 transition-colors border-t">
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={!!t.selected}
                            onChange={() => toggleSelect(t._id)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">
                          {(pagination.page - 1) * pagination.limit + i + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {t.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">
                          {t.districtName}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">
                          {t.stateName}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(t)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOne(t._id, t.name)}
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
            {talukas.length === 0 ? (
              <div className="text-center py-8 px-4 bg-white rounded-lg border shadow">
                <div className="text-gray-500 mb-4">
                  {search 
                    ? `No talukas found matching "${search}"`
                    : filterDistrictId 
                      ? `No talukas found for ${getDistrictNameById(filterDistrictId)}`
                      : "No talukas found. Select a district to filter."}
                </div>
                <button
                  onClick={openAdd}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} /> Add Taluka
                </button>
              </div>
            ) : (
              talukas.map((t, i) => (
                <div key={t._id} className="bg-white border rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900">
                      #{(pagination.page - 1) * pagination.limit + i + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!t.selected}
                      onChange={() => toggleSelect(t._id)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Taluka</p>
                      <p className="text-gray-900 font-medium">{t.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">District</p>
                      <p className="text-gray-700">{t.districtName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">State</p>
                      <p className="text-gray-700">{t.stateName}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(t)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOne(t._id, t.name)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION SECTION */}
          {talukas.length > 0 && (
            <div className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-lg border shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} talukas
                  </span>
                  {filterDistrictId && (
                    <span className="text-gray-500">
                      {" "}in <span className="font-semibold">{getDistrictNameById(filterDistrictId)}</span>
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
                        minWidth: '32px',
                        height: '32px',
                        '@media (min-width: 768px)': {
                          minWidth: '36px',
                          height: '36px',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#16a34a',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#15803d',
                          },
                        },
                        '&:hover': {
                          backgroundColor: '#f0fdf4',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Rows per page selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium hidden md:inline">Rows per page:</span>
                  <span className="text-sm text-gray-600 font-medium md:hidden">Rows:</span>
                  <select
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={pagination.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      handleRowsPerPageChange(newLimit);
                    }}
                  >
                    {[5, 10, 20, 50].map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 md:p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {editId ? "Edit Taluka" : "Add Taluka"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-5">
              {/* District Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Select District *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  disabled={districtsLoading || saving}
                >
                  <option value="">Select a district</option>
                  {districts.map(district => (
                    <option key={district._id} value={district._id}>
                      {district.name} ({district.stateName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Taluka Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Enter Taluka Name *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter taluka name"
                  value={talukaName}
                  onChange={e => setTalukaName(e.target.value)}
                  disabled={saving}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 md:p-6 border-t bg-gray-50 rounded-b-xl sticky bottom-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!talukaName.trim() || !selectedDistrictId || saving}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  !talukaName.trim() || !selectedDistrictId || saving
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : editId ? 'Update Taluka' : 'Add Taluka'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}