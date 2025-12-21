/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaUser,
  FaUserFriends,
  FaSeedling,
  FaTools,
  FaPlus,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import {
  Modal,
  Box,
  Pagination,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LabourFormModal from "@/app/_components/labour/LabourFormModal";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface LabourRequest {
  _id: string;
  farmer: {
    name: string;
    mobile: string;
    address?: string;
    state?: string;
  };
  requiredDate: string;
  male: number;
  female: number;
  crop: string;
  work: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
};

/* ================= COMPONENT ================= */

export default function LabourRequestsPage() {
  const [labours, setLabours] = useState<LabourRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLabours, setTotalLabours] = useState(0);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentLabour, setCurrentLabour] = useState<LabourRequest | null>(null);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  /* ================= GET LABOURS ================= */

  const getLabours = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/labours", {
        params: {
          search,
          status: status === "All" ? undefined : status,
          date: date || undefined,
          page,
          limit,
        },
      });
      setLabours(res.data.data || []);
      setTotalPages(Math.ceil(res.data.total / res.data.limit) || 1);
      setTotalLabours(res.data.total || 0);
    } catch (error) {
      console.error("Error fetching labours:", error);
      toast.error("Failed to fetch labour requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLabours();
  }, [search, status, date, page, limit]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!currentLabour) return;
    setLoading(true);
    try {
      setEditOpen(false);
      await axios.put(`/api/labours/${currentLabour._id}`, currentLabour);
      getLabours();
      toast.success("Labour request updated successfully!");
    } catch (error: any) {
      console.error("Error updating labour:", error);
      toast.error(`Failed to update: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setEditOpen(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!currentLabour) return;
    setLoading(true);
    try {
      await axios.delete(`/api/labours/${currentLabour._id}`);
      setDeleteOpen(false);
      getLabours();
      toast.success("Labour request deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting labour:", error);
      toast.error(`Failed to delete: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ================= */

  const handleCreate = async (data: any) => {
    try {
      await axios.post("/api/labours", data);
      setAddOpen(false);
      getLabours();
      toast.success("Labour request created successfully!");
    } catch (error: any) {
      console.error("Error creating labour:", error);
      toast.error(`Failed to create: ${error.response?.data?.message || error.message}`);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handleExportExcel = () => {
    if (labours.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = labours.map((labour, index) => ({
      "Sr.": index + 1 + (page - 1) * limit,
      "Farmer Name": labour.farmer.name,
      "Mobile": labour.farmer.mobile,
      "Address": labour.farmer.address || "",
      "State": labour.farmer.state || "",
      "Required Date": new Date(labour.requiredDate).toLocaleDateString(),
      "Male Workers": labour.male,
      "Female Workers": labour.female,
      "Total Workers": labour.male + labour.female,
      "Crop": labour.crop,
      "Work Type": labour.work,
      "Created Date": new Date(labour.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Labour Requests");
    writeFile(wb, `labour-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel exported successfully!");
  };

  const handleExportPDF = () => {
    if (labours.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("Labour Requests Report", 14, 16);
    
    const tableColumn = ["Sr.", "Farmer", "Mobile", "Date", "Male", "Female", "Crop", "Work"];
    const tableRows = labours.map((labour, index) => [
      index + 1 + (page - 1) * limit,
      labour.farmer.name,
      labour.farmer.mobile,
      new Date(labour.requiredDate).toLocaleDateString(),
      labour.male.toString(),
      labour.female.toString(),
      labour.crop,
      labour.work
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`labour-requests-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF exported successfully!");
  };

  /* ================= PRINT FUNCTION ================= */

  const handlePrint = () => {
    if (labours.length === 0) {
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
        <title>Labour Requests Report</title>
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
          .farmer-info {
            font-weight: 600;
            color: #1f2937;
          }
          .mobile-info {
            font-size: 11px;
            color: #6b7280;
          }
          .gender-count {
            display: flex;
            gap: 15px;
          }
          .gender-item {
            text-align: center;
          }
          .gender-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 2px;
          }
          .male-count {
            color: #3b82f6;
            font-weight: 600;
          }
          .female-count {
            color: #ec4899;
            font-weight: 600;
          }
          .total-count {
            color: #10b981;
            font-weight: 700;
            font-size: 14px;
          }
          .crop-work {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .crop-name {
            font-weight: 600;
            color: #1f2937;
          }
          .work-type {
            font-size: 11px;
            color: #6b7280;
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
              size: landscape;
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👷 Labour Requests Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Labour Requests: ${totalLabours} | Showing: ${labours.length} requests</div>
          <div class="header-info">Page: ${page} of ${totalPages}</div>
          <div class="header-info">Current Filters: ${status === "All" ? "All Statuses" : status} ${date ? `| Date: ${date}` : ''}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Farmer Details</th>
              <th>Mobile</th>
              <th>Required Date</th>
              <th>Male Workers</th>
              <th>Female Workers</th>
              <th>Total Workers</th>
              <th>Crop</th>
              <th>Work Type</th>
            </tr>
          </thead>
          <tbody>
            ${labours.map((labour, index) => {
              const requiredDate = new Date(labour.requiredDate).toLocaleDateString();
              const totalWorkers = labour.male + labour.female;
              
              return `
                <tr>
                  <td>${index + 1 + (page - 1) * limit}</td>
                  <td>
                    <div class="farmer-info">${labour.farmer.name}</div>
                    ${labour.farmer.address ? `<div class="mobile-info">${labour.farmer.address}</div>` : ''}
                    ${labour.farmer.state ? `<div class="mobile-info">${labour.farmer.state}</div>` : ''}
                  </td>
                  <td>${labour.farmer.mobile}</td>
                  <td><strong>${requiredDate}</strong></td>
                  <td class="male-count">${labour.male}</td>
                  <td class="female-count">${labour.female}</td>
                  <td class="total-count">${totalWorkers}</td>
                  <td>
                    <div class="crop-name">${labour.crop}</div>
                  </td>
                  <td>
                    <div class="work-type">${labour.work}</div>
                  </td>
                </tr>
              `;
            }).join('')}
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

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success("Print window opened!");
  };

  /* ================= FORMAT FUNCTIONS ================= */

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotalWorkers = (labour: LabourRequest) => {
    return labour.male + labour.female;
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 relative text-black text-sm overflow-x-auto min-h-screen">
      {/* Header Section */}
      {loading && labours.length === 0 && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb8c] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Labour Requests Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all labour requests from farmers. {totalLabours} requests found.
          </p>
        </div>
        <button 
          onClick={() => setAddOpen(true)} 
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          <FaPlus /> Add Request
        </button>
      </div>

      <LabourFormModal 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        onSubmit={handleCreate}
      />

      {/* Export Buttons Section - Mobile */}
      <div className="flex lg:hidden flex-wrap gap-2 text-sm bg-white p-3 rounded-lg shadow mb-4">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
        >
          <FaFileExcel className="text-sm" />
          Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
        >
          <FaFilePdf className="text-sm" />
          PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
        >
          <FaPrint className="text-sm" />
          Print
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 text-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by farmer, crop, work..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Export Buttons Section - Desktop */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
            >
              <FaFileExcel className="text-sm" />
              Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
            >
              <FaFilePdf className="text-sm" />
              PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
            >
              <FaPrint className="text-sm" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Sr.</th>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Farmer Details</th>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Required Date</th>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Workers</th>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Crop & Work</th>
              <th className="p-4 text-sm text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {labours.map((labour, index) => (
              <tr key={labour._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-600">{index + 1 + (page - 1) * limit}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{labour.farmer.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{labour.farmer.mobile}</div>
                  {labour.farmer.address && (
                    <div className="text-gray-500 text-xs mt-1">{labour.farmer.address}</div>
                  )}
                  {labour.farmer.state && (
                    <div className="text-gray-500 text-xs mt-1">{labour.farmer.state}</div>
                  )}
                </td>
                <td className="p-4 text-sm font-medium text-gray-700">
                  {formatDate(labour.requiredDate)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-blue-500" />
                        <span className="font-semibold text-gray-800">{labour.male}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Male</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <FaUserFriends className="text-pink-500" />
                        <span className="font-semibold text-gray-800">{labour.female}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Female</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-700 text-lg">
                        {calculateTotalWorkers(labour)}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaSeedling className="text-green-500" />
                    <span className="font-medium text-gray-800">{labour.crop}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTools className="text-gray-500" />
                    <span className="text-gray-600">{labour.work}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setViewOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setEditOpen(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Request"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setDeleteOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Request"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {labours.map((labour, index) => (
          <div key={labour._id} className="rounded-lg p-4 border border-gray-200 bg-white shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * limit}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCurrentLabour(labour); setViewOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <FaEye />
                </button>
                <button onClick={() => { setCurrentLabour(labour); setEditOpen(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded">
                  <FaEdit />
                </button>
                <button onClick={() => { setCurrentLabour(labour); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Farmer</div>
                <div className="font-medium text-gray-800">{labour.farmer.name}</div>
                <div className="text-xs text-gray-500 mt-1">{labour.farmer.mobile}</div>
                {labour.farmer.address && (
                  <div className="text-xs text-gray-500 mt-1">{labour.farmer.address}</div>
                )}
                {labour.farmer.state && (
                  <div className="text-xs text-gray-500 mt-1">{labour.farmer.state}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Required Date</div>
                  <div className="font-medium text-gray-700">{formatDate(labour.requiredDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Workers</div>
                  <div className="font-bold text-green-700 text-lg">{calculateTotalWorkers(labour)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Male Workers</div>
                  <div className="font-medium text-blue-600">{labour.male}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Female Workers</div>
                  <div className="font-medium text-pink-600">{labour.female}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Crop</div>
                  <div className="font-medium text-gray-800">{labour.crop}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Work Type</div>
                  <div className="text-gray-600">{labour.work}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {labours.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👷</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">No labour requests found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {labours.length > 0 && (
        <div className="flex flex-col md:flex-row bg-white p-4 rounded-lg shadow justify-between items-center gap-4 mt-6">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * limit}-{Math.min(page * limit, totalLabours)}</span> of{" "}
            <span className="font-semibold">{totalLabours}</span> requests
            <select 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))} 
              className="ml-3 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2,5,10,15,20,25,30,40,50].map((data, i) => (
                <option key={i} value={data}>{data} per page</option>
              ))}
            </select>
          </div>
          
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={modalStyle}>
          {currentLabour && (
            <>
              <Typography variant="h6" className="mb-6">
                Labour Request Details
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Request ID</div>
                    <div className="font-medium text-gray-800">{currentLabour._id.substring(0, 8)}...</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Created Date</div>
                    <div className="text-gray-800">{formatDate(currentLabour.createdAt)}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Farmer Details</div>
                  <div className="font-medium text-gray-800">{currentLabour.farmer.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{currentLabour.farmer.mobile}</div>
                  {currentLabour.farmer.address && (
                    <div className="text-sm text-gray-600 mt-1">{currentLabour.farmer.address}</div>
                  )}
                  {currentLabour.farmer.state && (
                    <div className="text-sm text-gray-600 mt-1">{currentLabour.farmer.state}</div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Required Date</div>
                  <div className="font-medium text-gray-800">{formatDate(currentLabour.requiredDate)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Male Workers</div>
                    <div className="font-bold text-blue-700 text-lg">{currentLabour.male}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Female Workers</div>
                    <div className="font-bold text-pink-700 text-lg">{currentLabour.female}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Total Workers</div>
                  <div className="font-bold text-green-700 text-2xl">{calculateTotalWorkers(currentLabour)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Work Details</div>
                  <div className="font-medium text-gray-800">{currentLabour.crop} - {currentLabour.work}</div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setViewOpen(false)} variant="contained" color="primary">
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-6">
            Edit Labour Request
          </Typography>
          {currentLabour && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Farmer Name"
                  value={currentLabour.farmer.name}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      farmer: { ...currentLabour.farmer, name: e.target.value },
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                />
                <TextField
                  label="Mobile"
                  value={currentLabour.farmer.mobile}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      farmer: { ...currentLabour.farmer, mobile: e.target.value },
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Address"
                  value={currentLabour.farmer.address || ""}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      farmer: { ...currentLabour.farmer, address: e.target.value },
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                />
                <TextField
                  label="State"
                  value={currentLabour.farmer.state || ""}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      farmer: { ...currentLabour.farmer, state: e.target.value },
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </div>
              <TextField
                label="Required Date"
                type="date"
                value={currentLabour.requiredDate.split('T')[0]}
                onChange={(e) =>
                  setCurrentLabour({
                    ...currentLabour,
                    requiredDate: e.target.value,
                  })
                }
                fullWidth
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Male Workers"
                  type="number"
                  value={currentLabour.male}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      male: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="Female Workers"
                  type="number"
                  value={currentLabour.female}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      female: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </div>
              <TextField
                label="Crop"
                value={currentLabour.crop}
                onChange={(e) =>
                  setCurrentLabour({
                    ...currentLabour,
                    crop: e.target.value,
                  })
                }
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Work Type"
                value={currentLabour.work}
                onChange={(e) =>
                  setCurrentLabour({
                    ...currentLabour,
                    work: e.target.value,
                  })
                }
                fullWidth
                size="small"
                variant="outlined"
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setEditOpen(false)} variant="outlined">
                  Cancel
                </Button>
                <Button onClick={handleUpdate} variant="contained" color="primary">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2 text-gray-800">
              Delete Labour Request?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete the request from{" "}
              <span className="font-medium">{currentLabour?.farmer.name}</span> for{" "}
              <span className="font-medium">{currentLabour?.crop}</span>? 
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setDeleteOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}