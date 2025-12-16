"use client";

import { useState, useRef, useEffect } from "react";
import { FaTrash, FaEdit, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint, FaCopy, FaSearch, FaFilter, FaPlus, FaEye, FaChevronDown, FaCalendarAlt, FaSeedling, FaWeight, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog } from "@mui/material";
import axios from "axios";
import { FaArrowRight,FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface Quality {
  _id: string;
  grade: "A" | "B" | "C";
  pricePerPack: number;
  quantity: number;
}

export interface Requirement {
  _id: string;
  userType: "Trader" | "Farmer";
  category: string;
  subCategory: string;
  farmingType: string;
  variety: string;
  packType: string;
  weightPerPack: number;
  qualities: Quality[];
  requirementDate: string;
  location: string;
  status: "Active" | "Inactive";
  createdAt: string;
  __v: number;
  postedBy?: string;
}

type Cat={
  _id: string,
categoryName": "Veggies",
"categoryId": "CAT001",
}
/* ================= PAGE ================= */

export default function RequirementsPage() {
  const [rows, setRows] = useState<Requirement[]>([]);
  const [page, setPage] = useState(1);
  const [ID, setID] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowsPerPage,setrowsPerPage]=useState<number>(5)
  const [status,setStatus]=useState("Active")
  const[change,setChange]=useState<any>()
  const [category,setCategory]=useState<>([])
  
  
  const tableRef = useRef<HTMLTableElement>(null);

  /* ================= FILTERED DATA ================= */

  const filteredRows = rows.filter(row => {
    const matchesSearch = 
      row.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.postedBy && row.postedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || row.status === filterStatus;
    const matchesCategory = filterCategory === "all" || row.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  /* ================= EXPORT FUNCTIONS ================= */

  const exportExcel = () => {
    const exportData = filteredRows.map(row => ({
      Date: new Date(row.requirementDate).toLocaleDateString(),
      Category: row.category,
      "Sub-Category": row.subCategory,
      "Farming Type": row.farmingType,
      Variety: row.variety,
      "Pack Type": row.packType,
      "Weight per Pack": `${row.weightPerPack} kg`,
      "A Grade Qty": row.qualities.find(q => q.grade === "A")?.quantity || 0,
      "A Grade Price": row.qualities.find(q => q.grade === "A")?.pricePerPack || 0,
      "B Grade Qty": row.qualities.find(q => q.grade === "B")?.quantity || 0,
      "B Grade Price": row.qualities.find(q => q.grade === "B")?.pricePerPack || 0,
      Location: row.location,
      Status: row.status,
      "Posted Date": new Date(row.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");
    XLSX.writeFile(wb, "requirements.xlsx");
  };

  const exportCSV = () => {
    const exportData = filteredRows.map(row => ({
      Date: new Date(row.requirementDate).toLocaleDateString(),
      Category: row.category,
      "Sub-Category": row.subCategory,
      "Farming Type": row.farmingType,
      Variety: row.variety,
      "Pack Type": row.packType,
      "Weight per Pack": `${row.weightPerPack} kg`,
      "A Grade Qty": row.qualities.find(q => q.grade === "A")?.quantity || 0,
      "A Grade Price": row.qualities.find(q => q.grade === "A")?.pricePerPack || 0,
      "B Grade Qty": row.qualities.find(q => q.grade === "B")?.quantity || 0,
      "B Grade Price": row.qualities.find(q => q.grade === "B")?.pricePerPack || 0,
      Location: row.location,
      Status: row.status,
      "Posted Date": new Date(row.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "requirements.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Requirements Report", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableData = filteredRows.map(row => [
      new Date(row.requirementDate).toLocaleDateString(),
      row.category,
      row.subCategory,
      row.farmingType,
      row.variety || "N/A",
      `${row.weightPerPack} kg`,
      row.qualities.reduce((sum, q) => sum + q.quantity, 0),
      row.location,
      row.status
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Category", "Sub-Category", "Farming Type", "Variety", "Weight/Pack", "Total Qty", "Location", "Status"]],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 30 },
        8: { cellWidth: 20 }
      }
    });

    doc.save("requirements.pdf");
  };

  const copyData = () => {
    const dataToCopy = filteredRows.map(row => ({
      Category: row.category,
      "Sub-Category": row.subCategory,
      "Farming Type": row.farmingType,
      "Weight per Pack": row.weightPerPack,
      Location: row.location,
      Status: row.status,
      "Requirement Date": new Date(row.requirementDate).toLocaleDateString()
    }));
    
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
    showToast('Data copied to clipboard!', 'success');
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
              h1 { color: #1f2937; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background-color: #f3f4f6; text-align: left; padding: 12px 8px; border: 1px solid #e5e7eb; }
              td { padding: 10px 8px; border: 1px solid #e5e7eb; }
              .status-active { color: #10b981; background-color: #d1fae5; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
              .status-inactive { color: #ef4444; background-color: #fee2e2; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
              .quality-badge { background-color: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin: 2px; }
              .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <h1>Requirements Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Records: ${filteredRows.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Farming Type</th>
                  <th>Variety</th>
                  <th>Weight/Pack</th>
                  <th>Qualities</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRows.map(row => `
                  <tr>
                    <td>${new Date(row.requirementDate).toLocaleDateString()}</td>
                    <td>${row.category}</td>
                    <td>${row.subCategory}</td>
                    <td>${row.farmingType}</td>
                    <td>${row.variety || 'N/A'}</td>
                    <td>${row.weightPerPack} kg</td>
                    <td>${row.qualities.map(q => `<span class="quality-badge">${q.grade}: ${q.quantity} @ ₹${q.pricePerPack}</span>`).join('')}</td>
                    <td>${row.location}</td>
                    <td><span class="status-${row.status.toLowerCase()}">${row.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Requirements Management System</p>
            </div>
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
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTotalQuantity = (qualities: Quality[]) => {
    return qualities.reduce((sum, q) => sum + q.quantity, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /* ================= PAGINATION ================= */

  const start = (page - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  /* ================= MODAL HANDLERS ================= */

  const handleDelete = async (id:string) => {
    if (!id) return;
    
   try {
      setLoading(true);
      const response = await axios.delete(`/api/requirements/${id}`);
      if (response.data.success) {
        setError(null);
        toast.success("Requiremt delete success")
      } else {
        setError('Failed to delete');
        toast.error("Failed to delete")
      }
      setChange(response.data)
    } catch (err) {
      toast.error("failed to delete")
      console.error('delete error:', err);
      setError('Error loading delete. Please try again.');
    } finally {
      setLoading(false);
      setDeleteOpen(false)
    }
  };

  // const handleSave = async () => {
  //   if (!selected) return;
    
  //   try {
  //     const response = await axios.put(`/api/requirements?id=${selected._id}`, selected);
  //     if (response.data.success) {
  //       setRows(rows.map(row => row._id === selected._id ? response.data.data : row));
  //       setEditOpen(false);
  //       showToast('Changes saved successfully!', 'success');
  //     }
  //   } catch (err) {
  //     console.error('Update error:', err);
  //     showToast('Failed to save changes', 'error');
  //   }
  // };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  /* ================= DATA FETCHING ================= */

  const getRequirements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/requirements');
      if (response.data.success) {
        setRows(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch requirements');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error loading requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
 /* ================= GET CATEGORY ================= */

 const getCategory=async()=>{
  try {
      setLoading(true);
      const response = await axios.get('/api/category');
      if (response.data.success) {
       
        setError(null);
      } else {
        setError('Failed to fetch category');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error loading requirements. Please try again.');
    } finally {
      setLoading(false);
    }
 }

  useEffect(() => {
    getRequirements();
  }, [change]);

 /* ================= UPDATE STATUS ================= */

 const updateStatus=async(id:string)=>{
   try {
      setLoading(true);
      const response = await axios.put(`/api/requirements/${id}`,{status});
      if (response.data.success) {
        setError(null);
        toast.success("status update success")
      } else {
        setError('Failed to update status');
        toast.error("status update failed")
      }
      setChange(response.data)
    } catch (err) {
      toast.error("status update error")
      console.error('update error:', err);
      setError('Error loading status update. Please try again.');
    } finally {
      setLoading(false);
      setEditOpen(false)
    }
 }
 

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={getRequirements}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-auto bg-gray-50 text-gray-900  md:p-1">
      {/* Header */}
      <div className="mb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requirements Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all your requirements in one place</p>
          </div>
          {/* <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaPlus className="w-4 h-4" />
            Add New Requirement
          </button> */}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden">
        {/* Action Bar */}
        <div className="p-1 md:p-3 py-4  border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex gap-x-3 gap-y-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by category, variety, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="lg:w-[30vw] w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
               <select
                    value={rowsPerPage}
                    onChange={(e) => setrowsPerPage(Number(e.target.value))}
                    className="w-fit px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                     <option value={20}>20</option>
                    <option value={30}>30</option>
                     <option value={40}>40</option>
                    <option value={50}>50</option>
                     <option value={60}>60</option>
                    <option value={70}>70</option>
                     <option value={80}>80</option>
                    <option value={90}>90</option>
                     <option value={100}>100</option>
                  </select>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="w-4 h-4" />
                Filters
                <FaChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copyData}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group relative"
                  title="Copy Data"
                >
                  <FaCopy className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button
                  onClick={exportExcel}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group relative"
                  title="Export to Excel"
                >
                  <FaFileExcel className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                </button>
                <button
                  onClick={exportCSV}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group relative"
                  title="Export to CSV"
                >
                  <FaFileCsv className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </button>
                <button
                  onClick={exportPDF}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group relative"
                  title="Export to PDF"
                >
                  <FaFilePdf className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                </button>
                <button
                  onClick={printTable}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group relative"
                  title="Print"
                >
                  <FaPrint className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-5 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Nuts">Nuts</option>
                    <option value="Flowers">Flowers</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCategory("all");
                    }}
                    className="w-fit px-4 py-2.5 text-xs bg-green-600 text-white  border border-gray-300 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden xl:block overflow-x-auto">
          <table ref={tableRef} className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sub-Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Farming Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Weight/Pack</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualities</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                      <span className="text-sm">{formatDate(row.requirementDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.subCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.farmingType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {row.weightPerPack} kg
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.qualities.map((quality) => (
                        <span
                          key={quality._id}
                          className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                        >
                          {quality.grade}: {quality.quantity} @ ₹{quality.pricePerPack}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setID(row._id);
                          setEditOpen(true);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setDeleteOpen(true);
                        }}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Show only on mobile */}
        <div className="xl:hidden p-4">
          {paginatedRows.length === 0 ? (
            <div className="text-center py-16">
              <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600 text-lg mb-2">No requirements found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedRows.map((row) => (
                <div 
                  key={row._id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
                >
                  {/* Header with Status and Actions */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setID(row._id);
                          setEditOpen(true);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setID(row._id);
                          setDeleteOpen(true);
                        }}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Requirement Details */}
                  <div className="space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt className="text-gray-400 w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{formatDate(row.requirementDate)}</span>
                    </div>

                    {/* Category and Sub-category */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-blue-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="text-sm font-medium text-gray-800">{row.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaSeedling className="text-green-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Sub-Category</p>
                          <p className="text-sm font-medium text-gray-800">{row.subCategory}</p>
                        </div>
                      </div>
                    </div>

                    {/* Farming Type and Weight */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex-shrink-0 text-center text-yellow-500">🌱</div>
                        <div>
                          <p className="text-xs text-gray-500">Farming Type</p>
                          <p className="text-sm font-medium text-gray-800">{row.farmingType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaWeight className="text-purple-500 w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Weight/Pack</p>
                          <p className="text-sm font-medium text-gray-800">{row.weightPerPack} kg</p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-red-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-800">{row.location}</p>
                      </div>
                    </div>

                    {/* Qualities */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Qualities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {row.qualities.map((quality) => (
                          <span
                            key={quality._id}
                            className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
                          >
                            <span className="font-semibold">{quality.grade}</span>: {quality.quantity} packs @ ₹{quality.pricePerPack}/pack
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Variety (if exists) */}
                    {row.variety && (
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500">Variety</p>
                        <p className="text-sm font-medium text-gray-800">{row.variety}</p>
                      </div>
                    )}

                    {/* Total Quantity */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Total Quantity</span>
                      <span className="text-sm font-bold text-blue-600">
                        {row.qualities.reduce((sum, q) => sum + q.quantity, 0)} packs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State for Desktop */}
        {filteredRows.length === 0 && (
          <div className="hidden md:block text-center py-16">
            <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No requirements found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{start + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(start + rowsPerPage, filteredRows.length)}</span> of{" "}
                <span className="font-semibold">{filteredRows.length}</span> requirements
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaArrowLeft/>
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
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
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
                  className="px-4 py-2  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaArrowRight/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Requirement</h3>
          <p className="text-gray-600 text-sm mb-6">Update the requirement status</p>
          
          <div className="space-y-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={selected?.category || ''}
                onChange={(e) => setID(prev => prev ? {...prev, category: e.target.value} : null)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
             */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status || 'Active'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight per Pack (kg)</label>
              <input
                type="number"
                value={selected?.weightPerPack || ''}
                onChange={(e) => setID(prev => prev ? {...prev, weightPerPack: parseFloat(e.target.value)} : null)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min="0"
                step="0.1"
              />
            </div> */}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditOpen(false)}
              className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={()=>updateStatus(ID)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FaTrash className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Delete this requirement?</p>
              <p className="text-sm text-gray-600 mt-1">This action cannot be undone. All associated data will be permanently removed.</p>
            </div>
          </div>

          {/* {selected && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Category:</span> {selected.category}<br />
                <span className="font-semibold">Sub-Category:</span> {selected.subCategory}<br />
                <span className="font-semibold">Location:</span> {selected.location}<br />
                <span className="font-semibold">Requirement Date:</span> {formatDate(selected.requirementDate)}
              </p>
            </div>
          )} */}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={()=>handleDelete(ID)}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Requirement
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Requirement</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Select Category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Nuts">Nuts</option>
                  <option value="Flowers">Flowers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter sub-category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farming Type</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Select Farming Type</option>
                  <option value="Organic">Organic</option>
                  <option value="Inorganic">Inorganic</option>
                  <option value="Hydroponic">Hydroponic</option>
                  <option value="Polyhouse">Polyhouse</option>
                  <option value="Open Field">Open Field</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight per Pack (kg)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter weight"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter location (e.g., City, State)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setAddOpen(false)}
              className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle add logic here
                setAddOpen(false);
                showToast('Requirement added successfully!', 'success');
              }}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Requirement
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}