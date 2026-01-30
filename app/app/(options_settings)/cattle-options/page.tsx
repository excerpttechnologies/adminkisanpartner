




"use client";

import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaPlus,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Cattle {
  _id: string;
  name: string;
  sortOrder: number;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = "/api/cattle";

// API helper function
const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

export default function CattleOptionsPage() {
  const [cattles, setCattles] = useState<Cattle[]>([]);
  const [search, setSearch] = useState("");
  const [tableSortOrder, setTableSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsToShow, setRowsToShow] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCattles, setTotalCattles] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [name, setName] = useState("");
  const [sortInput, setSortInput] = useState<string>("");

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH DATA ---------- */
  const fetchCattles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search || "",
        page: page.toString(),
        limit: rowsToShow.toString(),
        sortBy: "sortOrder",
        sortOrder: tableSortOrder
      });
      
      const data = await apiCall(`${API_BASE_URL}?${params}`);
      
      if (data.success) {
        setCattles(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCattles(data.pagination.total);
      } else {
        showError(data.error || "Failed to load cattle");
      }
    } catch (error: any) {
      console.error("Error fetching cattle:", error);
      showError(error.message || "Failed to load cattle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCattles();
  }, [search, page, rowsToShow, tableSortOrder]);

  /* ---------- HELPERS ---------- */
  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const showError = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const toggleSort = () => {
    setTableSortOrder((p) => (p === "asc" ? "desc" : "asc"));
  };

  /* ---------- CRUD ---------- */
  const openAdd = () => {
    setEditId(null);
    setName("");
    setSortInput("");
    setShowAddEditModal(true);
  };

  const openEdit = (c: Cattle) => {
    setEditId(c._id);
    setName(c.name);
    setSortInput(c.sortOrder.toString());
    setShowAddEditModal(true);
  };

  const openDelete = (c: Cattle) => {
    setDeleteId(c._id);
    setDeleteName(c.name);
    setShowDeleteModal(true);
  };

  const save = async () => {
    if (!name.trim()) {
      showError("Please enter cattle name");
      return;
    }

    setLoading(true);
    try {
      const sortValue = parseInt(sortInput) || 0;
      const cattleData = {
        name: name.trim(),
        sortOrder: sortValue
      };

      if (editId) {
        const data = await apiCall(`${API_BASE_URL}/${editId}`, {
          method: "PUT",
          body: JSON.stringify(cattleData)
        });
        
        if (data.success) {
          showSuccess("Cattle updated successfully");
          setShowAddEditModal(false);
          fetchCattles();
        } else {
          showError(data.error || "Failed to update cattle");
        }
      } else {
        const data = await apiCall(API_BASE_URL, {
          method: "POST",
          body: JSON.stringify(cattleData)
        });
        
        if (data.success) {
          showSuccess("Cattle added successfully");
          setShowAddEditModal(false);
          fetchCattles();
        } else {
          showError(data.error || "Failed to add cattle");
        }
      }
    } catch (error: any) {
      console.error("Error saving cattle:", error);
      showError(error.message || "Failed to save cattle");
    } finally {
      setLoading(false);
    }
  };

  const deleteOne = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      const data = await apiCall(`${API_BASE_URL}/${deleteId}`, {
        method: "DELETE"
      });
      
      if (data.success) {
        showSuccess("Cattle deleted successfully");
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteName("");
        fetchCattles();
      } else {
        showError(data.error || "Failed to delete cattle");
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      console.error("Error deleting cattle:", error);
      showError(error.message || "Failed to delete cattle");
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setCattles((prev) => {
      const updated = prev.map((c) =>
        c._id === id ? { ...c, selected: !c.selected } : c
      );
      setSelectAll(updated.every((c) => c.selected));
      return updated;
    });
  };

  const toggleSelectAll = () => {
    setSelectAll((prev) => !prev);
    setCattles((prev) =>
      prev.map((c) => ({ ...c, selected: !selectAll }))
    );
  };

  const openBulkDelete = () => {
    const selectedIds = cattles.filter(c => c.selected).map(c => c._id);
    
    if (selectedIds.length === 0) {
      showError("Please select at least one cattle to delete");
      return;
    }

    setShowBulkDeleteModal(true);
  };

  const deleteSelected = async () => {
    const selectedIds = cattles.filter(c => c.selected).map(c => c._id);
    
    if (selectedIds.length === 0) {
      showError("Please select at least one cattle to delete");
      return;
    }

    setLoading(true);
    try {
      const data = await apiCall(`${API_BASE_URL}/bulk`, {
        method: "POST",
        body: JSON.stringify({ ids: selectedIds })
      });
      
      if (data.success) {
        showSuccess(data.message || `${selectedIds.length} cattle deleted successfully`);
        setSelectAll(false);
        setShowBulkDeleteModal(false);
        fetchCattles();
      } else {
        showError(data.error || "Failed to delete selected cattle");
        setShowBulkDeleteModal(false);
      }
    } catch (error: any) {
      console.error("Error deleting selected cattle:", error);
      showError(error.message || "Failed to delete selected cattle");
      setShowBulkDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- EXPORT DATA ---------- */
  const exportRows = cattles.map((c, index) => ({
    Sr: index + 1,
    Name: c.name,
    "Sort Order": c.sortOrder,
  }));

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // const copyData = () => {
  //   const text = [
  //     "Sr\tCattle Option\tSort Order",
  //     ...exportRows.map((r) => `${r.Sr}\t${r.Name}\t${r["Sort Order"]}`),
  //   ].join("\n");
  //   navigator.clipboard.writeText(text);
  //   showSuccess("Copied to clipboard");
  // };
 const copyData = async () => {
  try {
    if (!exportRows || exportRows.length === 0) {
      showError("No data available to copy");
      return;
    }

    // Calculate dynamic column widths for better alignment
    const maxSrLength = Math.max(2, Math.max(...exportRows.map(r => String(r.Sr).length)));
    const maxNameLength = Math.max("Cattle Option".length, ...exportRows.map(r => String(r.Name).length));
    const maxSortLength = Math.max("Sort Order".length, ...exportRows.map(r => String(r["Sort Order"]).length));

    // Create formatted table with proper alignment
    const headers = [
      "Sr".padEnd(maxSrLength),
      "Cattle Option".padEnd(maxNameLength),
      "Sort Order".padEnd(maxSortLength)
    ].join("\t");

    const separator = [
      "-".repeat(maxSrLength),
      "-".repeat(maxNameLength),
      "-".repeat(maxSortLength)
    ].join("\t");

    const rows = exportRows.map(row => [
      String(row.Sr).padEnd(maxSrLength),
      String(row.Name).padEnd(maxNameLength),
      String(row["Sort Order"]).padEnd(maxSortLength)
    ].join("\t")).join("\n");

    const text = `${headers}\n${separator}\n${rows}`;

    // Copy to clipboard
    await navigator.clipboard.writeText(text);
    showSuccess(`✅ Copied ${exportRows.length} row${exportRows.length !== 1 ? 's' : ''} to clipboard`);
  } catch (error) {
    console.error("Failed to copy data:", error);
    showError("Failed to copy to clipboard");
  }
};

  const downloadCSV = () => {
    const csv =
      "Sr,Cattle Option,Sort Order\n" +
      exportRows.map((r) => `${r.Sr},"${r.Name}",${r["Sort Order"]}`).join("\n");
    downloadFile(csv, "cattle-options.csv", "text/csv");
  };

  const downloadExcel = () => {
    const header = "Sr\tCattle Option\tSort Order\n";
    const rows = exportRows.map((r) => `${r.Sr}\t${r.Name}\t${r["Sort Order"]}`).join("\n");
    downloadFile(header + rows, "cattle-options.xls", "application/vnd.ms-excel");
  };

  const downloadPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const rows = exportRows
      .map(
        (r) => `
        <tr>
          <td>${r.Sr}</td>
          <td>${r.Name}</td>
          <td>${r["Sort Order"]}</td>
        </tr>`
      )
      .join("");

    w.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 40px; }
            table { width:100%; border-collapse:collapse; }
            th,td { border:1px solid #000; padding:8px; }
            th { background:#f3f3f3; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Cattle Options</h2>
          <table>
            <tr><th>Sr</th><th>Cattle Option</th><th>Sort Order</th></tr>
            ${rows}
          </table>
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  // Pagination functions
  // const getPageNumbers = () => {
  //   const delta = 2;
  //   const range = [];
  //   const rangeWithDots = [];
  //   let l;

  //   for (let i = 1; i <= totalPages; i++) {
  //     if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
  //       range.push(i);
  //     }
  //   }

  //   range.forEach((i) => {
  //     if (l) {
  //       if (i - l === 2) {
  //         rangeWithDots.push(l + 1);
  //       } else if (i - l !== 1) {
  //         rangeWithDots.push('...');
  //       }
  //     }
  //     rangeWithDots.push(i);
  //     l = i;
  //   });

  //   return rangeWithDots;
  // };

  /* ---------- UI ---------- */
  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
        </div>
      )}

      {/* Message Alert */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded text-sm ${
          message.includes("error") || message.includes("Failed") 
            ? "bg-red-100 text-red-800 border border-red-200" 
            : "bg-green-100 text-green-800 border border-green-200"
        }`}>
          {message}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Cattle Options</h1>
          <p className="text-gray-600 mt-1">
            Manage cattle options for your farm. {totalCattles} cattle options found.
          </p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={openAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
            disabled={loading}
          >
            <FaPlus className="text-sm" />
            Add Cattle Option
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow mb-4 border border-gray-200">
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          {/* Left Side: Selection Actions */}
          <div className="flex items-center gap-2">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                disabled={cattles.length === 0}
              />
              <span>Select All</span>
            </label>
            
            {cattles.some(c => c.selected) && (
              <button
                onClick={openBulkDelete}
                disabled={loading}
                className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Selected ({cattles.filter(c => c.selected).length})
              </button>
            )}
          </div>

          {/* Right Side: Export Buttons - Mobile */}
          <div className="lg:hidden flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: FaCopy, onClick: copyData, color: "bg-gray-100 hover:bg-gray-200", disabled: cattles.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: downloadExcel, color: "bg-green-100 hover:bg-green-200", disabled: cattles.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: downloadCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: cattles.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: downloadPDF, color: "bg-red-100 hover:bg-red-200", disabled: cattles.length === 0 },
              { label: "Print", icon: FaPrint, onClick: downloadPDF, color: "bg-purple-100 hover:bg-purple-200", disabled: cattles.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cattle options..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>
          <div className="lg:flex flex-wrap gap-2 hidden">
            {[
              { label: "Copy", icon: FaCopy, onClick: copyData, color: "bg-gray-100 hover:bg-gray-200", disabled: cattles.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: downloadExcel, color: "bg-green-100 hover:bg-green-200", disabled: cattles.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: downloadCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: cattles.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: downloadPDF, color: "bg-red-100 hover:bg-red-200", disabled: cattles.length === 0 },
              { label: "Print", icon: FaPrint, onClick: downloadPDF, color: "bg-purple-100 hover:bg-purple-200", disabled: cattles.length === 0 },
            ].map((btn, i) => (
              <div key={i} className="relative group" title={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <btn.icon />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={cattles.length === 0}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cattle Option Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cattles.map((c, index) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={!!c.selected}
                      onChange={() => toggleSelect(c._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1 + (page - 1) * rowsToShow}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">
                      Created: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEdit(c)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                          title="Edit"
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Edit
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => openDelete(c)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Delete"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Delete
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {cattles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🐄</div>
            <h3 className="text-lg font-semibold mb-2">No cattle options found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No results for "${search}". Try a different search.` : "Add your first cattle option to get started."}
            </p>
            <button
              onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
            >
              <FaPlus className="text-lg" />
              Add New Cattle Option
            </button>
          </div>
        )}

        {/* Pagination */}
        {cattles.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{1 + (page - 1) * rowsToShow}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(page * rowsToShow, totalCattles)}
                </span> of{" "}
                <span className="font-semibold">{totalCattles}</span> entries
              </div>
              {/* Rows Per Page Selector - MOVED TO BOTTOM */}
              <div className="relative">
                <select
                  value={rowsToShow}
                  onChange={(e) => {
                    setRowsToShow(Number(e.target.value));
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  disabled={loading}
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">First</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Last</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <div className={`fixed inset-0 z-50 ${showAddEditModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? "Edit Cattle Option" : "Add New Cattle Option"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cattle Option Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cow, Buffalo, Bull"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={sortInput}
                  onChange={(e) => setSortInput(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Leave empty for automatic ordering.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddEditModal(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={!name.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : editId ? "Save Changes" : "Add Option"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SINGLE DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Cattle Option?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteName}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                  setDeleteName("");
                }}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteOne}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BULK DELETE MODAL */}
      <div className={`fixed inset-0 z-50 ${showBulkDeleteModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Selected Options?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {cattles.filter(c => c.selected).length} selected cattle option(s)?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelected}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : `Delete ${cattles.filter(c => c.selected).length} Options`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}