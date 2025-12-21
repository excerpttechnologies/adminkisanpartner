"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";

interface StateItem {
  _id: string;
  name: string;
  selected?: boolean;
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
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [stateName, setStateName] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  /* ---------- API FUNCTIONS WITH AXIOS ---------- */
  const fetchStates = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await axios.get("/api/states", { params });
      const data = response.data;

      if (data.success) {
        setStates(data.data.map((state: any) => ({ ...state, selected: false })));
        setPagination(data.pagination);
      }
    } catch (error: any) {
      console.error("Error fetching states:", error);
      setMessage(error.response?.data?.message || "Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  const createState = async () => {
    try {
      const response = await axios.post("/api/states", { name: stateName });
      const data = response.data;

      showSuccess("State added successfully");
      fetchStates(pagination.page, search);
      return { success: true };
    } catch (error: any) {
      console.error("Error creating state:", error);
      const errorMsg = error.response?.data?.message || "Failed to add state";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const updateState = async (id: string) => {
    try {
      const response = await axios.put(`/api/states/${id}`, { name: stateName });
      const data = response.data;

      showSuccess("State updated successfully");
      fetchStates(pagination.page, search);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating state:", error);
      const errorMsg = error.response?.data?.message || "Failed to update state";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const deleteState = async (id: string) => {
    try {
      await axios.delete(`/api/states/${id}`);
      
      showSuccess("State deleted successfully");
      // If last item on page is deleted, go to previous page
      if (states.length === 1 && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting state:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete state";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const bulkDeleteStates = async (ids: string[]) => {
    try {
      await axios.delete("/api/states", { data: { ids } });
      
      showSuccess("Selected states deleted");
      // If all items on page are deleted, go to previous page
      if (states.length === ids.length && pagination.page > 1) {
        fetchStates(pagination.page - 1, search);
      } else {
        fetchStates(pagination.page, search);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting states:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete states";
      setMessage(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /* ---------- INITIAL FETCH ---------- */
  useEffect(() => {
    fetchStates();
  }, []);

  /* ---------- HELPERS ---------- */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  /* ---------- SELECT HANDLERS ---------- */
  const toggleSelect = (id: string) => {
    setStates((prev) =>
      prev.map((s) => (s._id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const selectAll = (checked: boolean) => {
    setStates((prev) => prev.map((s) => ({ ...s, selected: checked })));
  };

  const getSelectedIds = () => {
    return states.filter((s) => s.selected).map((s) => s._id);
  };

  const handleDeleteSelected = () => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected state(s)?`)) {
        bulkDeleteStates(selectedIds);
      }
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
      setMessage("Please enter a state name");
      return;
    }

    let result;
    if (editId) {
      result = await updateState(editId);
    } else {
      result = await createState();
    }

    if (result.success) {
      setShowModal(false);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteState(id);
    }
  };

  /* ---------- PAGINATION HANDLERS ---------- */
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchStates(page, search);
  };

  const handleSearch = () => {
    // Reset to page 1 when searching
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchStates(1, search);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------- UI ---------- */
  return (
    <div className="p-4 md:p-6 text-black">
      {/* Success/Error Message */}
      {message && (
        <div className={`mb-3 px-4 py-2 rounded ${
          message.includes("Failed") || message.includes("Please enter") 
            ? "bg-red-100 text-red-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {message}
        </div>
      )}

      {/* HEADER */}
      <h1 className="text-xl font-semibold mb-3">States</h1>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div className="flex gap-2 items-center">
          {/* Select All Checkbox */}
          {states.length > 0 && (
            <input
              type="checkbox"
              onChange={(e) => selectAll(e.target.checked)}
              checked={states.length > 0 && states.every((s) => s.selected)}
              className="w-4 h-4"
            />
          )}

          <button
            onClick={handleDeleteSelected}
            disabled={!states.some((s) => s.selected)}
            className={`px-4 py-2 rounded text-white ${
              states.some((s) => s.selected)
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Delete Selected
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              placeholder="Search states..."
              className="border px-3 py-1 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="border px-3 py-1 rounded hover:bg-gray-50"
          >
            Search
          </button>
          <button
            onClick={openAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading states...</p>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && (
        <>
          <div className="hidden md:block bg-white rounded border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2">✓</th>
                  <th className="border px-3 py-2">Sr.</th>
                  <th className="border px-3 py-2">State Name</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {states.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border px-3 py-4 text-center text-gray-500">
                      {search ? "No states found matching your search" : "No states found"}
                    </td>
                  </tr>
                ) : (
                  states.map((s, i) => (
                    <tr key={s._id}>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!s.selected}
                          onChange={() => toggleSelect(s._id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        {(pagination.page - 1) * pagination.limit + i + 1}
                      </td>
                      <td className="border px-3 py-2">{s.name}</td>
                      <td className="border px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOne(s._id, s.name)}
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
            {states.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {search ? "No states found matching your search" : "No states found"}
              </div>
            ) : (
              states.map((s, i) => (
                <div key={s._id} className="bg-white border rounded p-3 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      #{(pagination.page - 1) * pagination.limit + i + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!s.selected}
                      onChange={() => toggleSelect(s._id)}
                      className="w-4 h-4"
                    />
                  </div>

                  <p className="text-sm mb-3">
                    <b>State:</b> {s.name}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOne(s._id, s.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          {states.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Stack spacing={2}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  size="medium"
                />
              </Stack>
            </div>
          )}

          {/* Pagination Info */}
          {states.length > 0 && (
            <div className="text-sm text-gray-600 mt-2 text-center">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} states
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
                {editId ? "Edit State" : "Add State"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-gray-100 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <input
              className="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter State Name"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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