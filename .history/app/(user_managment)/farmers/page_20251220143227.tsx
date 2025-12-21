"use client";

import { useMemo, useState, useEffect, ReactNode, MouseEventHandler, useCallback } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaFilter,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface Farmer {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
    taluk?: string;
    post?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Farmer[];
  page: number;
  limit: number;
  total: number;
}

interface District {
  _id: string;
  name: string;
}

/* ================= PAGE ================= */

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [disName, setDisName] = useState("");

  /* ================= FETCH FARMERS ================= */

  const fetchFarmers = async (page: number = 1, searchQuery: string = "", districtName: string = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
        district: districtName
      });

      const res = await axios.get<ApiResponse>(`/api/farmers?${params}`);
      
      if (res.data.success) {
        setFarmers(res.data.data);
        setTotalFarmers(res.data.total);
        // Calculate total pages correctly
        const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
        setTotalPages(calculatedTotalPages);
        setCurrentPage(res.data.page);
      }
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
      setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
      setFarmers([]);
      toast.error(err.response?.data?.message || "Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    try {
      const response = await axios.get("/api/districts", {
        params: { 
          limit: 100,
          page: 1
        }
      });
      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    fetchFarmers(currentPage, search, disName);
  }, [currentPage, rowsPerPage, disName]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFarmers(1, search, disName);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= DELETE FARMER ================= */

  const handleDelete = async () => {
    if (!selectedFarmer) return;
   
    try {
      await axios.delete(`/api/farmers/${selectedFarmer._id}`);
      toast.success("Farmer deleted successfully!");
      setDeleteOpen(false);
      fetchFarmers(currentPage, search, disName);
    } catch (error: any) {
      console.error("Error deleting farmer:", error);
      toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = farmers.map((farmer, index) => ({
    "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
    "Name": farmer.personalInfo.name,
    "Mobile": farmer.personalInfo.mobileNo,
    "Email": farmer.personalInfo.email || 'N/A',
    "Village": farmer.personalInfo.villageGramaPanchayat || 'N/A',
    "District": farmer.personalInfo.district || 'N/A',
    "State": farmer.personalInfo.state || 'N/A',
    "Address": farmer.personalInfo.address || 'N/A',
    "Taluk": farmer.personalInfo.taluk || 'N/A',
    "Post": farmer.personalInfo.post || 'N/A',
    "Pincode": farmer.personalInfo.pincode || 'N/A',
  }));

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farmers Report</title>
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
          <h1>👨‍🌾 Farmers Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            ${farmers.map((farmer, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${farmer.personalInfo.name}</strong></td>
                <td>${farmer.personalInfo.mobileNo}</td>
                <td>${farmer.personalInfo.email || 'N/A'}</td>
                <td>${farmer.personalInfo.villageGramaPanchayat || 'N/A'}</td>
                <td>${farmer.personalInfo.district || 'N/A'}</td>
                <td>${farmer.personalInfo.state || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to print");
    }
  };

  const handleCopy = async () => {
    const text = exportData.map(f => 
      `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Village}\t${f.District}\t${f.State}`
    ).join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Farmers data copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Farmers");
      XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Farmers Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State"];
      const tableRows: any = exportData.map(f => [
        f["Sr."],
        f.Name,
        f.Mobile,
        f.Email,
        f.Village,
        f.District,
        f.State,
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setDisName("");
    fetchFarmers(1, "", "");
  };

  /* ================= PAGINATION HELPER ================= */

  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 bg-white min-h-screen text-black">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading farmers...</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Farmers Management</h1>
        <p className="text-gray-600 mt-2">
          Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, mobile, email, or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={disName}
              onChange={(e) => setDisName(e.target.value)}
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
                    <option key={district._id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Export Buttons - Desktop */}
          <div className="md:col-span-3 flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleCopy}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title="Copy"
            >
              <FaCopy className="text-gray-600" />
            </button>
            <button
              onClick={handleExcel}
              className="px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
              title="Excel"
            >
              <FaFileExcel className="text-green-600" />
            </button>
            <button
              onClick={handleCSV}
              className="px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              title="CSV"
            >
              <FaFileCsv className="text-blue-600" />
            </button>
            <button
              onClick={handlePDF}
              className="px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              title="PDF"
            >
              <FaFilePdf className="text-red-600" />
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              title="Print"
            >
              <FaPrint className="text-purple-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && farmers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farmers.map((farmer, index) => (
                  <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{farmer.personalInfo.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.personalInfo.mobileNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.personalInfo.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.personalInfo.villageGramaPanchayat || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.personalInfo.district || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.personalInfo.state || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Farmer"
                        >
                          <FaTrash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && farmers.length > 0 && (
        <div className="lg:hidden space-y-3 mb-4">
          {farmers.map((farmer, index) => (
            <div key={farmer._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{farmer.personalInfo.name}</div>
                  <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Farmer"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Mobile</div>
                  <div>{farmer.personalInfo.mobileNo}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-gray-700">{farmer.personalInfo.email || 'No email'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Village</div>
                  <div>{farmer.personalInfo.villageGramaPanchayat || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">District</div>
                  <div>{farmer.personalInfo.district || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">State</div>
                  <div>{farmer.personalInfo.state || 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && farmers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-5xl mb-4">👨‍🌾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {search || disName ? "Try adjusting your search or filters" : "No farmers are registered yet"}
          </p>
          {(search || disName) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && farmers.length > 0 && totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-semibold">{Math.min((currentPage - 1) * rowsPerPage + 1, totalFarmers)}</span> to{" "}
              <span className="font-semibold">{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
              <span className="font-semibold">{totalFarmers}</span> farmers
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-3 p-1 border border-gray-300 rounded text-sm"
              >
                {[10, 25, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex space-x-1">
                {generatePagination().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Next
                <FaChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Farmer Details</h3>
                <button
                  onClick={() => setViewOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Name" value={selectedFarmer.personalInfo.name} />
                <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo} />
                <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
                <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
                <DetailRow label="Village" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
                <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
                <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
                <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
                <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
                <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-end">
                <button
                  onClick={() => setViewOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FaTrash className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Farmer</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-center space-x-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Farmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
);