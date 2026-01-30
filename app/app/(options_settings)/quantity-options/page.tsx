



"use client";

import { useEffect, useState, useRef } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

interface QuantityOption {
  _id: string;
  name: string;
  sort: number;
  createdAt: string;
}

/* ================= COMPONENT ================= */

export default function QuantityOptionsPage() {
  // State
  const [options, setOptions] = useState<QuantityOption[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOptions, setTotalOptions] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState<QuantityOption | null>(null);
  
  // Form states
  const [newName, setNewName] = useState("");
  const [newSort, setNewSort] = useState(0);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // Ref for print
  const printRef = useRef<HTMLDivElement>(null);

  /* ================= FETCH DATA ================= */

  const fetchQuantityOptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: rowsPerPage.toString(),
        sort: 'sort',
        order: 'asc'
      });
      
      const res = await axios.get(`/api/quantity-options?${params}`);
      
      if (res.data.success) {
        setOptions(res.data.data.options);
        setTotalPages(res.data.data.totalPages);
        setTotalOptions(res.data.data.total);
      } else {
        toast.error(res.data.error || "Failed to load quantity options");
      }
    } catch (error: any) {
      console.error("Error fetching quantity options:", error);
      toast.error(error.response?.data?.error || "Failed to load quantity options");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuantityOptions();
  }, [search, page, rowsPerPage]);

  /* ================= CRUD OPERATIONS ================= */

  const handleAddOption = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a quantity option name");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/quantity-options", {
        name: newName,
        sort: newSort || 0
      });
      
      if (res.data.success) {
        toast.success(res.data.message || "Quantity option added successfully");
        setAddOpen(false);
        setNewName("");
        setNewSort(0);
        fetchQuantityOptions(); // Refresh the list
      } else {
        toast.error(res.data.error || "Failed to add option");
      }
    } catch (error: any) {
      console.error("Error adding option:", error);
      toast.error(error.response?.data?.error || "Failed to add option");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOption = async () => {
    if (!currentOption || !newName.trim()) return;

    setLoading(true);
    try {
      const res = await axios.put(`/api/quantity-options/${currentOption._id}`, {
        name: newName,
        sort: newSort
      });
      
      if (res.data.success) {
        toast.success(res.data.message || "Quantity option updated successfully");
        setEditOpen(false);
        setCurrentOption(null);
        fetchQuantityOptions(); // Refresh the list
      } else {
        toast.error(res.data.error || "Failed to update option");
      }
    } catch (error: any) {
      console.error("Error updating option:", error);
      toast.error(error.response?.data?.error || "Failed to update option");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async () => {
    if (!currentOption) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/api/quantity-options/${currentOption._id}`);
      
      if (res.data.success) {
        toast.success(res.data.message || "Quantity option deleted successfully");
        setDeleteOpen(false);
        setCurrentOption(null);
        fetchQuantityOptions(); // Refresh the list
      } else {
        toast.error(res.data.error || "Failed to delete option");
      }
    } catch (error: any) {
      console.error("Error deleting option:", error);
      toast.error(error.response?.data?.error || "Failed to delete option");
    } finally {
      setLoading(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one option to delete");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/quantity-options/bulk", {
        ids: selectedIds
      });
      
      if (res.data.success) {
        toast.success(res.data.message || `${selectedIds.length} option(s) deleted successfully`);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
        fetchQuantityOptions(); // Refresh the list
      } else {
        toast.error(res.data.error || "Failed to delete options");
      }
    } catch (error: any) {
      console.error("Error deleting selected options:", error);
      toast.error(error.response?.data?.error || "Failed to delete options");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(options.map(option => option._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(optionId => optionId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  // const handleCopyToClipboard = async () => {
  //   if (options.length === 0) {
  //     toast.error("No data to copy");
  //     return;
  //   }

  //   const headers = ["Sr.", "Quantity Option Name", "Sort", "Created Date"];
  //   const csvContent = [
  //     headers.join("\t"),
  //     ...options.map((option, index) => [
  //       index + 1 + (page - 1) * rowsPerPage,
  //       option.name,
  //       option.sort,
  //       new Date(option.createdAt).toLocaleDateString(),
  //     ].join("\t"))
  //   ].join("\n");
    
  //   try {
  //     await navigator.clipboard.writeText(csvContent);
  //     toast.success("Data copied to clipboard!");
  //   } catch (err) {
  //     console.error("Failed to copy: ", err);
  //     toast.error("Failed to copy to clipboard");
  //   }
  // };
const handleCopyToClipboard = async () => {
  try {
    if (options.length === 0) {
      toast.error("No data to copy");
      return;
    }

    // Calculate dynamic column widths for better alignment
    const maxSrLength = Math.max(3, 
      Math.max(...options.map((_, index) => 
        String(index + 1 + (page - 1) * rowsPerPage).length
      ))
    );
    const maxNameLength = Math.max("Quantity Option Name".length, 
      Math.max(...options.map(option => option.name?.length || 0))
    );
    const maxSortLength = Math.max(4, 
      Math.max(...options.map(option => String(option.sort || "").length))
    );
    const maxDateLength = Math.max("Created Date".length, 10);

    // Create formatted table with headers
    const headers = [
      "Sr.".padEnd(maxSrLength),
      "Quantity Option Name".padEnd(maxNameLength),
      "Sort".padEnd(maxSortLength),
      "Created Date".padEnd(maxDateLength)
    ].join("\t");

    // Add separator line
    const separator = [
      "-".repeat(maxSrLength),
      "-".repeat(maxNameLength),
      "-".repeat(maxSortLength),
      "-".repeat(maxDateLength)
    ].join("\t");

    // Create rows with proper formatting
    const rows = options.map((option, index) => {
      const rowNumber = index + 1 + (page - 1) * rowsPerPage;
      const formattedDate = option.createdAt 
        ? new Date(option.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : "N/A";

      return [
        String(rowNumber).padEnd(maxSrLength),
        (option.name || "").padEnd(maxNameLength),
        String(option.sort || "").padEnd(maxSortLength),
        formattedDate.padEnd(maxDateLength)
      ].join("\t");
    }).join("\n");

    // Combine everything
    const tableContent = `${headers}\n${separator}\n${rows}`;

    // Add metadata if needed
    const metadata = `\n\nPage: ${page}, Items per page: ${rowsPerPage}\nTotal items in view: ${options.length}`;
    
    const finalContent = tableContent + metadata;

    await navigator.clipboard.writeText(finalContent);
    toast.success(`✅ Copied ${options.length} option${options.length !== 1 ? 's' : ''} to clipboard`);
    
  } catch (err) {
    console.error("Failed to copy: ", err);
    toast.error("Failed to copy to clipboard");
  }
};

  const handleExportExcel = () => {
    if (options.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = options.map((option, index) => ({
      "Sr.": index + 1 + (page - 1) * rowsPerPage,
      "Quantity Option Name": option.name,
      "Sort Order": option.sort,
      "Created Date": new Date(option.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Quantity Options");
    writeFile(wb, `quantity-options-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  };

  const handleExportCSV = () => {
    if (options.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Sr.", "Quantity Option Name", "Sort", "Created Date"];
    
    const csvContent = [
      headers.join(","),
      ...options.map((option, index) => [
        index + 1 + (page - 1) * rowsPerPage,
        `"${option.name.replace(/"/g, '""')}"`,
        option.sort,
        `"${new Date(option.createdAt).toLocaleDateString()}"`,
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quantity-options-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV file downloaded successfully!");
  };

  const handleExportPDF = () => {
    if (options.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("Quantity Options Report", 14, 16);
    
    const tableColumn = ["Sr.", "Option Name", "Sort", "Created Date"];
    const tableRows: any = options.map((option, index) => [
      index + 1 + (page - 1) * rowsPerPage,
      option.name,
      option.sort,
      new Date(option.createdAt).toLocaleDateString(),
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [76, 175, 80] },
    });
    
    doc.save(`quantity-options-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file downloaded successfully!");
  };

  const handlePrint = () => {
    if (options.length === 0) {
      toast.error("No data to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quantity Options Report</title>
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
          .sort-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
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
          <h1>📦 Quantity Options Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Options: ${totalOptions} | Showing: ${options.length} options</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
          ${search ? `<div class="header-info">Search filter: "${search}"</div>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Quantity Option Name</th>
              <th>Sort Order</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${options.map((option, index) => {
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * rowsPerPage}</td>
                  <td><strong>${option.name}</strong></td>
                  <td><span class="sort-badge">${option.sort}</span></td>
                  <td>${new Date(option.createdAt).toLocaleDateString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Quantity Options Management System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    toast.success("Print window opened!");
  };

  /* ================= MODAL HANDLERS ================= */

  const openEditModal = (option: QuantityOption) => {
    setCurrentOption(option);
    setNewName(option.name);
    setNewSort(option.sort);
    setEditOpen(true);
  };

  const openDeleteModal = (option: QuantityOption) => {
    setCurrentOption(option);
    setDeleteOpen(true);
  };

  const openAddModal = () => {
    setNewName("");
    setNewSort(0);
    setAddOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one option to delete");
      return;
    }
    setBulkDeleteOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Quantity Options</h1>
          <p className="text-gray-600 mt-1">
            Manage quantity options for your products. {totalOptions} options found.
          </p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xs">+</span>
            Add Quantity Option
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
                checked={selectedIds.length === options.length && options.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Select All</span>
            </label>
            
            {selectedIds.length > 0 && (
              <button
                onClick={openBulkDeleteModal}
                className="ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          {/* Right Side: Export Buttons */}
          <div className="lg:hidden flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: options.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: options.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: options.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: options.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: options.length === 0 },
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
              placeholder="Search quantity options..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="lg:flex flex-wrap gap-2 hidden">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200", disabled: options.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200", disabled: options.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200", disabled: options.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200", disabled: options.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200", disabled: options.length === 0 },
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
                    checked={selectedIds.length === options.length && options.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Option Name
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
              {options.map((option, index) => (
                <tr key={option._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option._id)}
                      onChange={() => handleSelectOne(option._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1 + (page - 1) * rowsPerPage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(option.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {option.sort}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEditModal(option)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Edit
                        </div>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => openDeleteModal(option)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Delete"
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
        {options.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">No quantity options found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No results for "${search}". Try a different search.` : "Add your first quantity option to get started."}
            </p>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto"
            >
              <span className="text-lg">+</span>
              Add New Quantity Option
            </button>
          </div>
        )}

        {/* Pagination */}
        {options.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{1 + (page - 1) * rowsPerPage}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(page * rowsPerPage, totalOptions)}
                </span> of{" "}
                <span className="font-semibold">{totalOptions}</span> entries
              </div>
              {/* Rows Per Page Selector */}
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
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

      {/* ADD MODAL */}
      <div className={`fixed inset-0 z-50 ${addOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Quantity Option
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Option Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., 20 Box, 23kg Box, Bag"
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
                  value={newSort}
                  onChange={(e) => setNewSort(Number(e.target.value))}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setAddOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOption}
                disabled={!newName.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Option"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div className={`fixed inset-0 z-50 ${editOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Quantity Option
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Option Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  value={newSort}
                  onChange={(e) => setNewSort(Number(e.target.value))}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOption}
                disabled={!newName.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <div className={`fixed inset-0 z-50 ${deleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Quantity Option?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentOption?.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOption}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BULK DELETE CONFIRMATION MODAL */}
      <div className={`fixed inset-0 z-50 ${bulkDeleteOpen ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/50`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Selected Options?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedIds.length} selected quantity option(s)? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setBulkDeleteOpen(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : `Delete ${selectedIds.length} Options`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





