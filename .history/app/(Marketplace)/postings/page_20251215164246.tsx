/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaSearch,
  FaFilter,
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaSeedling,
  FaLayerGroup,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

interface Posting {
  id: number;
  date: string;
  title: string;
  category: string;
  item: string;
  seed: string;
  acres: string;
  postedBy: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
}

/* ================= DATA ================= */

const initialData: Posting[] = [
  {
    id: 1,
    date: "2025-11-23",
    title: "Mango Harvest",
    category: "Fruits",
    item: "Mango",
    seed: "Alphonso",
    acres: "3 Acres",
    postedBy: "Chethan Kumar",
    status: "Pending",
  },
  {
    id: 2,
    date: "2025-09-21",
    title: "Tomato Season",
    category: "Vegetables",
    item: "Tomato",
    seed: "Hybrid 618",
    acres: "1.5 Acres",
    postedBy: "Suresh Reddy",
    status: "Approved",
  },
  {
    id: 3,
    date: "2025-12-01",
    title: "Wheat Field",
    category: "Grains",
    item: "Wheat",
    seed: "Durum",
    acres: "5 Acres",
    postedBy: "Priya Sharma",
    status: "Completed",
  },
  {
    id: 4,
    date: "2025-10-15",
    title: "Rice Paddy",
    category: "Grains",
    item: "Rice",
    seed: "Basmati",
    acres: "2 Acres",
    postedBy: "Raju Patel",
    status: "Rejected",
  },
  {
    id: 5,
    date: "2025-11-30",
    title: "Apple Orchard",
    category: "Fruits",
    item: "Apple",
    seed: "Fuji",
    acres: "4 Acres",
    postedBy: "Anil Verma",
    status: "Pending",
  },
  {
    id: 6,
    date: "2025-12-05",
    title: "Potato Farm",
    category: "Vegetables",
    item: "Potato",
    seed: "Kufri",
    acres: "2.5 Acres",
    postedBy: "Sunil Kumar",
    status: "Approved",
  },
  {
    id: 7,
    date: "2025-11-28",
    title: "Corn Field",
    category: "Grains",
    item: "Corn",
    seed: "Sweet Corn",
    acres: "3 Acres",
    postedBy: "Meera Singh",
    status: "Pending",
  },
];

/* ================= COMPONENT ================= */

export default function PostingTable() {
  const [data, setData] = useState<Posting[]>(initialData);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const rowsPerPage = 5;

  const [modal, setModal] = useState<{
    type: "view" | "edit" | "delete" | null;
    row?: Posting;
  }>({ type: null });

  const tableRef = useRef<HTMLDivElement>(null);

  /* ================= FILTERING ================= */

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.postedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.seed.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || row.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || row.category === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [data, searchTerm, filterStatus, filterCategory]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* ================= STATUS COLORS ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-rose-100 text-rose-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
    showToast("Data copied to clipboard!", "success");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Postings");
    XLSX.writeFile(wb, `postings_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `postings_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ["Date", "Title", "Category", "Item", "Seed", "Acres", "Posted By", "Status"],
      ],
      body: filteredData.map((d) => [
        d.date,
        d.title,
        d.category,
        d.item,
        d.seed,
        d.acres,
        d.postedBy,
        d.status,
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    doc.save(`postings_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const printTable = () => {
    const printContent = tableRef.current?.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Postings Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Postings Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    // Simple toast implementation
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
      type === "success" ? "bg-green-500" : 
      type === "error" ? "bg-red-500" : "bg-blue-500"
    } text-white font-medium`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  /* ================= MODAL HANDLERS ================= */

  const handleDelete = () => {
    if (modal.row) {
      setData(data.filter((item) => item.id !== modal.row!.id));
      setModal({ type: null });
      showToast("Posting deleted successfully", "success");
    }
  };

  const handleSave = () => {
    // Implement save logic here
    setModal({ type: null });
    showToast("Changes saved successfully", "success");
  };

  /* ================= JSX ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b overflow-x-scroll from-gray-50 to-white text-black p-2 ">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setShowMobileMenu(false)} />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button onClick={() => setShowMobileMenu(false)} className="p-2">
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium">
            <FaPlus className="w-4 h-4" />
            Add New Posting
          </button>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Filters</h3>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
            </select>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Fruits</option>
              <option>Vegetables</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-3 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900">
                Postings Management
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                Track and manage all agricultural postings
              </p>
            </div>
          </div>
          
          {/* Desktop Add Button */}
          
          {/* <button
            onClick={() => showToast("Add new posting feature coming soon", "info")}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            <FaPlus className="w-4 h-4" />
            Add New
          </button> */}
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["Approved", "Pending", "Rejected", "Completed"].map((status) => (
            <div key={status} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border shadow-xs">
              <div className={`w-2 h-2 rounded-full ${
                status === "Approved" ? "bg-emerald-500" :
                status === "Pending" ? "bg-amber-500" :
                status === "Rejected" ? "bg-rose-500" : "bg-blue-500"
              }`} />
              <span className="text-xs font-medium text-gray-700">{status}</span>
              <span className="text-xs font-bold text-gray-900">
                ({filteredData.filter(d => d.status === status).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search postings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Toolbar Buttons Row */}
            <div className="flex items-center justify-between">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium hidden sm:inline">Filters</span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Export & Print Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="bg-[#E5E7EB]">
                  <TooltipButton
                  icon={<FaCopy className="w-4 text-gray-500  h-4 sm:w-5 sm:h-5" />}
                  onClick={copyData}
                  tooltip="Copy Data"
                  mobile
                />
                </button>
                <button className="bg-[#B9F8CF]">
                  <TooltipButton
                  icon={<FaFileExcel className="w-4 text-green-500 h-4 sm:w-5 sm:h-5" />}
                  onClick={exportExcel}
                  tooltip="Export Excel"
                  mobile
                />
                </button>
                <button className="bg-[#BEDBFF]">
                  <TooltipButton
                  icon={<FaFilePdf className="w-4 text-blue-600 h-4 sm:w-5 sm:h-5" />}
                  onClick={exportPDF}
                  tooltip="Export PDF"
                  mobile
                />
                </button>
                <button className="bg-[#E9D4FF]">
                  <TooltipButton
                  icon={<FaPrint className="w-4 text-violet-600 h-4 sm:w-5 sm:h-5" />}
                  onClick={printTable}
                  tooltip="Print"
                  mobile
                />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Grains">Grains</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterCategory("all");
                        setSearchTerm("");
                      }}
                      className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
       <div className="relative">
         <div ref={tableRef} className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full hidden lg:table">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Title", "Category", "Item", "Seed", "Acres", "Posted By", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {row.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {row.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.item}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaSeedling className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-700">{row.seed}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-sm font-medium bg-amber-50 text-amber-700">
                      {row.acres}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {row.postedBy.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {row.postedBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ActionButton
                        icon={<FaEye className="w-4 h-4" />}
                        color="gray"
                        onClick={() => setModal({ type: "view", row })}
                        tooltip="View"
                      />
                      <ActionButton
                        icon={<FaEdit className="w-4 h-4" />}
                        color="blue"
                        onClick={() => setModal({ type: "edit", row })}
                        tooltip="Edit"
                      />
                      <ActionButton
                        icon={<FaTrash className="w-4 h-4" />}
                        color="red"
                        onClick={() => setModal({ type: "delete", row })}
                        tooltip="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3 p-4">
            {paginatedData.map((row) => (
              <div key={row.id} className="bg-white border border-gray-200 rounded-xl shadow-xs p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                        {row.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{row.title}</h3>
                    <p className="text-sm text-gray-600">{row.item} • {row.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <ActionButton
                      icon={<FaEye className="w-3.5 h-3.5" />}
                      color="gray"
                      onClick={() => setModal({ type: "view", row })}
                      mobile
                    />
                    <ActionButton
                      icon={<FaEdit className="w-3.5 h-3.5" />}
                      color="blue"
                      onClick={() => setModal({ type: "edit", row })}
                      mobile
                    />
                    <ActionButton
                      icon={<FaTrash className="w-3.5 h-3.5" />}
                      color="red"
                      onClick={() => setModal({ type: "delete", row })}
                      mobile
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FaSeedling className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Seed:</span>
                    <span className="text-gray-700">{row.seed}</span>
                  </div>
                  <div>
                    <span className="font-medium">Acres:</span>
                    <span className="ml-2 font-bold text-gray-900">{row.acres}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      {row.postedBy.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{row.postedBy}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {paginatedData.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No postings found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
       </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {Math.min((page - 1) * rowsPerPage + 1, filteredData.length)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(page * rowsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{filteredData.length}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (page <= 2) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 1) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = page - 1 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-colors text-sm font-medium ${
                        page === pageNum
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Add Button (FAB) */}
      <button
        onClick={() => showToast("Add new posting feature coming soon", "info")}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-30"
      >
        <FaPlus className="w-6 h-6" />
      </button>

      {/* Modals */}
      {modal.type === "view" && modal.row && (
        <ViewModal row={modal.row} onClose={() => setModal({ type: null })} />
      )}

      {modal.type === "edit" && modal.row && (
        <EditModal row={modal.row} onClose={() => setModal({ type: null })} onSave={handleSave} />
      )}

      {modal.type === "delete" && modal.row && (
        <DeleteModal
          row={modal.row}
          onClose={() => setModal({ type: null })}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TooltipButton = ({ icon, onClick, tooltip, mobile }: any) => (
  <button
    onClick={onClick}
    className={`relative group ${mobile ? 'p-2' : 'p-2 sm:p-2.5'} border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
  >
    {icon}
    <span className={`absolute ${mobile ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'} px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-40`}>
      {tooltip}
    </span>
  </button>
);

const ActionButton = ({ icon, color, onClick, tooltip, mobile }: any) => (
  <button
    onClick={onClick}
    className={`relative group ${mobile ? 'p-1.5' : 'p-2'} rounded-lg transition-colors ${
      color === "gray" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" :
      color === "blue" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
      "bg-rose-100 text-rose-700 hover:bg-rose-200"
    }`}
  >
    {icon}
    <span className={`absolute ${mobile ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'} px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-40`}>
      {tooltip}
    </span>
  </button>
);

/* ================= MODAL COMPONENTS ================= */

const ViewModal = ({ row, onClose }: { row: Posting; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#3b3b3b43] bg-opacity-50">
    <div className="bg-white rounded-xl sm:rounded shadow-xl max-w-md w-full max-h-[90vh] overflow-scroll">
      <div className="p-2 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Posting Details</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Complete information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-2">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize mb-1 sm:mb-0">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <span className="text-sm sm:text-base text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm sm:text-base"
        >
          Close Details
        </button>
      </div>
    </div>
  </div>
);

const EditModal = ({ row, onClose, onSave }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#3b3b3b43] bg-opacity-50">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Posting</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Update the information</p>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            defaultValue={row.title}
            className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            defaultValue={row.status}
            className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Acres</label>
          <input
            type="text"
            defaultValue={row.acres}
            className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ row, onClose, onDelete }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#3b3b3b43] bg-opacity-50">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <FaTrash className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Delete Posting</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">This action cannot be undone</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-sm sm:text-base text-gray-700">
          Are you sure you want to delete the posting{" "}
          <span className="font-bold text-gray-900">{row.title}</span>?
        </p>
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2.5 text-sm bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all font-medium"
        >
          Delete Posting
        </button>
      </div>
    </div>
  </div>
);