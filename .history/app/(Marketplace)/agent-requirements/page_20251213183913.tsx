"use client";

import { useState, useRef, useEffect } from "react";
import { FaTrash, FaEdit, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint, FaCopy, FaSearch, FaFilter, FaPlus, FaEye, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog } from "@mui/material";

/* ================= TYPES ================= */

interface Requirement {
  id: number;
  date: string;
  category: string;
  item: string;
  seed: string;
  quantity: string;
  quality: string;
  postedBy: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
}

/* ================= DATA ================= */

const initialData: Requirement[] = [
  {
    id: 1,
    date: "2025-06-14",
    category: "Vegetables/Herbs",
    item: "Tomato",
    seed: "618",
    quantity: "25 kg",
    quality: "Grade A",
    postedBy: "Chethan",
    status: "Pending",
  },
  {
    id: 2,
    date: "2025-04-01",
    category: "Vegetables/Herbs",
    item: "Onion",
    seed: "NAATI TOMATO",
    quantity: "50 kg",
    quality: "Grade B",
    postedBy: "Raju H V",
    status: "Approved",
  },
  {
    id: 3,
    date: "2025-05-15",
    category: "Fruits",
    item: "Apple",
    seed: "Gala",
    quantity: "100 kg",
    quality: "Premium",
    postedBy: "Aarav",
    status: "Completed",
  },
  {
    id: 4,
    date: "2025-03-22",
    category: "Grains",
    item: "Rice",
    seed: "Basmati",
    quantity: "200 kg",
    quality: "Export Quality",
    postedBy: "Priya",
    status: "Rejected",
  },
  {
    id: 5,
    date: "2025-06-10",
    category: "Vegetables/Herbs",
    item: "Potato",
    seed: "Kufri",
    quantity: "75 kg",
    quality: "Grade A",
    postedBy: "Suresh",
    status: "Pending",
  },
];

/* ================= PAGE ================= */

export default function RequirementsPage() {
  const [rows, setRows] = useState<Requirement[]>(initialData);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [addOpen,setaddOpen]=useState(false)
  const rowsPerPage = 5;

  const tableRef = useRef<HTMLTableElement>(null);

  /* ================= FILTERED DATA ================= */

  const filteredRows = rows.filter(row => {
    const matchesSearch = 
      row.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.seed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.postedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || row.status === filterStatus;
    const matchesCategory = filterCategory === "all" || row.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  /* ================= EXPORT FUNCTIONS ================= */

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");
    XLSX.writeFile(wb, "requirements.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "requirements.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Category", "Item", "Seed", "Qty", "Quality", "Status"]],
      body: filteredRows.map(r => [
        r.date,
        r.category,
        r.item,
        r.seed,
        r.quantity,
        r.quality,
        r.status,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    doc.save("requirements.pdf");
  };

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredRows, null, 2));
    // Show toast notification
    const event = new CustomEvent('toast', { detail: { message: 'Data copied to clipboard!', type: 'success' } });
    window.dispatchEvent(event);
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Requirements Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f8fafc; }
              .status-pending { color: #f59e0b; }
              .status-approved { color: #10b981; }
              .status-rejected { color: #ef4444; }
              .status-completed { color: #3b82f6; }
            </style>
          </head>
          <body>
            <h2>Requirements Report</h2>
            ${tableRef.current?.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  /* ================= STATUS BADGE ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Completed": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  /* ================= PAGINATION ================= */

  const start = (page - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  /* ================= MODAL HANDLERS ================= */

  const handleDelete = () => {
    if (selected) {
      setRows(rows.filter(row => row.id !== selected.id));
      setDeleteOpen(false);
      const event = new CustomEvent('toast', { detail: { message: 'Record deleted successfully!', type: 'success' } });
      window.dispatchEvent(event);
    }
  };

  const handleSave = () => {
    // Implement save logic here
    setEditOpen(false);
    const event = new CustomEvent('toast', { detail: { message: 'Changes saved successfully!', type: 'success' } });
    window.dispatchEvent(event);
  };

  const handleAdd=()=>{

  }
  return (
    <div className="min-h-screen  p-4 md:p-1">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Requirements Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all your requirements in one place</p>
          </div>
          <button onClick={()=>setaddOpen(!addOpen)} className="inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <FaPlus className="w-4 h-4" />
            Add New Requirement
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        {/* Action Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="w-4 h-4" />
                Filters
                <FaChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copyData}
                  className="p-2.5 border border-gray-300 bg-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors group relative"
                  title="Copy Data"
                >
                  <HiOutlineDocumentDuplicate className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button
                  onClick={exportExcel}
                  className="p-2.5 border border-gray-300 bg-[] rounded-lg hover:bg-gray-50 transition-colors group relative"
                  title="Export to Excel"
                >
                  <FaFileExcel className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button
                  onClick={exportCSV}
                  className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group relative"
                  title="Export to CSV"
                >
                  <FaFileCsv className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button
                  onClick={exportPDF}
                  className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group relative"
                  title="Export to PDF"
                >
                  <FaFilePdf className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button
                  onClick={printTable}
                  className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group relative"
                  title="Print"
                >
                  <FaPrint className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Vegetables/Herbs">Vegetables/Herbs</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCategory("all");
                    }}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {["Date", "Category", "Item", "Seed", "Quantity", "Quality", "Posted By", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{row.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{row.item}</div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{row.seed}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{row.quantity}</span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{row.quality}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {row.postedBy.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{row.postedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelected(row);
                          setEditOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                       
                      </button>
                      <button
                        onClick={() => {
                          setSelected(row);
                          setDeleteOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                       
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedRows.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requirements found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="px-6 py-2 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{start + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(start + rowsPerPage, filteredRows.length)}</span> of{" "}
              <span className="font-semibold">{filteredRows.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
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
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {/* {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Requirement</h3>
              <p className="text-gray-600 text-sm mt-1">Update the requirement details</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  defaultValue={selected?.item}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  defaultValue={selected?.quantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selected?.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )} */}
      <Dialog open={editOpen}>
<div className="flex items-center justify-center p-4">
          <div className="  max-w-md w-96">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Requirement</h3>
              <p className="text-gray-600 text-sm mt-1">Update the requirement details</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  defaultValue={selected?.item}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  defaultValue={selected?.quantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selected?.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Dialog>

{/* /////add model */}
      <Dialog open={addOpen}>
<div className="flex items-center justify-center p-4">
          <div className="  max-w-md w-96">
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  defaultValue={selected?.item}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  defaultValue={selected?.quantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selected?.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setaddOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all"
              >
                Add New
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Modal */}
      {/* {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <FaTrash className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete this requirement?</p>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selected?.item}</span> requirement?
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all"
              >
                Delete Requirement
              </button>
            </div>
          </div>
        </div>
      )} */}

      <Dialog  open={deleteOpen}>
 <div className="  z-50 flex items-center justify-center p-4  bg-none">
          <div className="  max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <FaTrash className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delete this requirement?</p>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selected?.item}</span> requirement?
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all"
              >
                Delete Requirement
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}