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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
            body { font-family: Arial, sans-serif; margin: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; }
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
    // You can implement a proper toast system here
    alert(`${type.toUpperCase()}: ${message}`);
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
    <div className="min-h-screen p-2 md:p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Postings Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all agricultural postings in one place
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[15px] text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-[15px] text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-[15px] text-gray-600">Rejected</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => showToast("Add new posting feature coming soon", "info")}
            className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-600 w-fit text-white font-medium rounded hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Add New Posting
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search postings by title, item, or posted by..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-base"
              />
            </div>

            {/* Filter and Export Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <FaFilter className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                <span className="font-medium">Filters</span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
                <TooltipButton
                  icon={<FaCopy className="w-5 h-5" />}
                  onClick={copyData}
                  tooltip="Copy Data"
                />
                <TooltipButton
                  icon={<FaFileExcel className="w-5 h-5" />}
                  onClick={exportExcel}
                  tooltip="Export Excel"
                />
                <TooltipButton
                  icon={<FaFileCsv className="w-5 h-5" />}
                  onClick={exportCSV}
                  tooltip="Export CSV"
                />
                <TooltipButton
                  icon={<FaFilePdf className="w-5 h-5" />}
                  onClick={exportPDF}
                  tooltip="Export PDF"
                />
                <TooltipButton
                  icon={<FaPrint className="w-5 h-5" />}
                  onClick={printTable}
                  tooltip="Print"
                />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[15px] font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[15px] font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCategory("all");
                      setSearchTerm("");
                    }}
                    className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {[
                  { label: "Date", icon: <FaCalendarAlt className="w-3.5 h-3.5" /> },
                  { label: "Title", icon: null },
                  { label: "Category", icon: <FaLayerGroup className="w-3.5 h-3.5" /> },
                  { label: "Item", icon: null },
                  { label: "Seed", icon: <FaSeedling className="w-3.5 h-3.5" /> },
                  { label: "Acres", icon: null },
                  { label: "Posted By", icon: <FaUser className="w-3.5 h-3.5" /> },
                  { label: "Status", icon: null },
                  { label: "Actions", icon: null },
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      {header.icon}
                      {header.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-32 h-4 text-gray-400" />
                      <span className="text-[13px] font-medium text-gray-900">
                        {row.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-[15px] font-semibold text-gray-900">
                      {row.title}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[15px] font-medium text-gray-900">
                    {row.item}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <FaSeedling className="w-4 h-4 text-emerald-500" />
                      <span className="text-[15px] text-gray-700">{row.seed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[15px] font-medium bg-amber-50 text-amber-700">
                      {row.acres}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[15px] font-semibold mr-3">
                        {row.postedBy.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium text-gray-900">
                          {row.postedBy}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <ActionButton
                        icon={<FaEye className="w-4 h-4" />}
                        color="gray"
                        onClick={() => setModal({ type: "view", row })}
                        tooltip="View Details"
                      />
                      <ActionButton
                        icon={<FaEdit className="w-4 h-4" />}
                        color="blue"
                        onClick={() => setModal({ type: "edit", row })}
                        tooltip="Edit Posting"
                      />
                      <ActionButton
                        icon={<FaTrash className="w-4 h-4" />}
                        color="red"
                        onClick={() => setModal({ type: "delete", row })}
                        tooltip="Delete Posting"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedData.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-5">
                <FaSearch className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No postings found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[15px] text-gray-600">
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors font-medium ${
                        page === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

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

const TooltipButton = ({ icon, onClick, tooltip }: any) => (
  <button
    onClick={onClick}
    className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative group"
  >
    {icon}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </span>
  </button>
);

const ActionButton = ({ icon, color, onClick, tooltip }: any) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-lg transition-colors relative group ${
      color === "gray"
        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
        : color === "blue"
        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
        : "bg-rose-100 text-rose-700 hover:bg-rose-200"
    }`}
  >
    {icon}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </span>
  </button>
);

/* ================= MODAL COMPONENTS ================= */

const ViewModal = ({ row, onClose }: { row: Posting; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Posting Details</h3>
            <p className="text-gray-600 text-[15px] mt-1">Complete information about this posting</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-6 overflow-y-auto">
        <div className="space-y-4">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-[15px] font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <span className="text-[15px] text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
        >
          Close Details
        </button>
      </div>
    </div>
  </div>
);

const EditModal = ({ row, onClose, onSave }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Edit Posting</h3>
        <p className="text-gray-600 text-[15px] mt-1">Update the posting information</p>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-[15px] font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            defaultValue={row.title}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[15px] font-medium text-gray-700 mb-2">Status</label>
          <select
            defaultValue={row.status}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-[15px] font-medium text-gray-700 mb-2">Acres</label>
          <input
            type="text"
            defaultValue={row.acres}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ row, onClose, onDelete }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <FaTrash className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Delete Posting</h3>
            <p className="text-gray-600 text-[15px] mt-1">This action cannot be undone</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700">
          Are you sure you want to delete the posting{" "}
          <span className="font-bold text-gray-900">"{row.title}"</span>?
        </p>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all font-medium"
        >
          Delete Posting
        </button>
      </div>
    </div>
  </div>
);