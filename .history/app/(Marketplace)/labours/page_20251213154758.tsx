"use client";

import { useState } from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaFileExport,
  FaPlus,
  FaMale,
  FaFemale,
  FaSeedling
} from "react-icons/fa";

/* ================= TYPES ================= */
interface LabourRequest {
  id: number;
  farmerName: string;
  mobile: string;
  requiredDate: string;
  male: number;
  female: number;
  crop: string;
  work: string;
  status: "Pending" | "Approved" | "Rejected";
  location: string;
}

/* ================= DATA ================= */
const initialLabourRequests: LabourRequest[] = [
  {
    id: 1,
    farmerName: "Rajesh Kumar",
    mobile: "9876543210",
    requiredDate: "2024-07-20",
    male: 5,
    female: 3,
    crop: "Wheat",
    work: "Harvesting",
    status: "Approved",
    location: "Punjab"
  },
  {
    id: 2,
    farmerName: "Priya Sharma",
    mobile: "8765432109",
    requiredDate: "2024-07-22",
    male: 2,
    female: 4,
    crop: "Rice",
    work: "Weeding",
    status: "Pending",
    location: "Kerala"
  },
  {
    id: 3,
    farmerName: "Amit Singh",
    mobile: "7654321098",
    requiredDate: "2024-07-25",
    male: 8,
    female: 0,
    crop: "Corn",
    work: "Plowing",
    status: "Rejected",
    location: "Uttar Pradesh"
  },
  {
    id: 4,
    farmerName: "Deepa Devi",
    mobile: "6543210987",
    requiredDate: "2024-07-28",
    male: 3,
    female: 5,
    crop: "Potatoes",
    work: "Planting",
    status: "Approved",
    location: "West Bengal"
  },
  {
    id: 5,
    farmerName: "Sanjay Yadav",
    mobile: "5432109876",
    requiredDate: "2024-08-01",
    male: 6,
    female: 2,
    crop: "Sugarcane",
    work: "Cutting",
    status: "Pending",
    location: "Maharashtra"
  },
];

/* ================= MODAL STYLE ================= */
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
};

/* ================= PAGE ================= */
export default function LabourRequestsPage() {
  const [rows, setRows] = useState<LabourRequest[]>(initialLabourRequests);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<LabourRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cropFilter, setCropFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Get unique crops for filter
  const uniqueCrops = Array.from(new Set(rows.map(row => row.crop)));

  /* ================= FILTERING ================= */
  const filteredRows = rows.filter(row => {
    const matchesSearch = 
      searchTerm === "" ||
      row.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile.includes(searchTerm) ||
      row.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      row.status === statusFilter;
    
    const matchesCrop = 
      cropFilter === "All" || 
      row.crop === cropFilter;
    
    const matchesDate = 
      dateFilter === "" || 
      row.requiredDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesCrop && matchesDate;
  });

  /* ================= DELETE FUNCTIONALITY ================= */
  const handleDeleteClick = (row: LabourRequest) => {
    setSelected(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selected) return;
    setRows(prev => prev.filter(r => r.id !== selected.id));
    setDeleteModalOpen(false);
    setSelected(null);
  };

  /* ================= RESET FILTERS ================= */
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCropFilter("All");
    setDateFilter("");
  };

  /* ================= STATUS BADGE STYLE ================= */
  const getStatusBadge = (status: string) => {
    const styles = {
      "Pending": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "Approved": "bg-green-100 text-green-800 border border-green-200",
      "Rejected": "bg-red-100 text-red-800 border border-red-200"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-3 md:p-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Labour Requests</h1>
            <p className="text-gray-600 mt-1 md:mt-2">
              Manage and track all labour requests from farmers. <span className="font-semibold text-blue-600">{filteredRows.length}</span> requests found
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium shadow-sm">
              <FaFileExport className="text-gray-500" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
              <FaPlus />
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERS SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search farmer, crop, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-sm"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Crop Filter */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSeedling className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-sm"
              >
                <option value="All">All Crops</option>
                {uniqueCrops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-2 flex gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Active Filters Badges */}
        {(searchTerm || statusFilter !== "All" || cropFilter !== "All" || dateFilter) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="text-blue-500 hover:text-blue-700">×</button>
              </span>
            )}
            {statusFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("All")} className="text-purple-500 hover:text-purple-700">×</button>
              </span>
            )}
            {cropFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Crop: {cropFilter}
                <button onClick={() => setCropFilter("All")} className="text-green-500 hover:text-green-700">×</button>
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Date: {dateFilter}
                <button onClick={() => setDateFilter("")} className="text-yellow-500 hover:text-yellow-700">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Desktop Table (Hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Farmer Details</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Required Date</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Labour Required</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Crop & Work</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Location</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Status</th>
                <th className="p-4 text-left text-gray-700 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{row.farmerName}</div>
                    <div className="text-xs text-gray-500 mt-1">{row.mobile}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-700">{row.requiredDate}</div>
                    <div className="text-xs text-gray-400 mt-1">Required</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <FaMale className="text-blue-500" />
                          <span className="font-bold text-gray-800">{row.male}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Male</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <FaFemale className="text-pink-500" />
                          <span className="font-bold text-gray-800">{row.female}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Female</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{row.crop}</div>
                    <div className="text-sm text-gray-600 mt-1">{row.work}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {row.location}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteClick(row)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      <button
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (Visible on mobile) */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredRows.map((row) => (
            <div key={row.id} className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-gray-800">{row.farmerName}</div>
                  <div className="text-xs text-gray-500">{row.mobile}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(row.status)}`}>
                  {row.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Required Date</div>
                  <div className="font-medium flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500 text-xs" />
                    {row.requiredDate}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="font-medium">{row.location}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Crop</div>
                  <div className="font-medium flex items-center gap-1">
                    <FaSeedling className="text-green-500 text-xs" />
                    {row.crop}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Work</div>
                  <div className="font-medium">{row.work}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Labour Required</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <FaMale className="text-blue-500" />
                        <span className="font-bold">{row.male}</span>
                      </div>
                      <div className="text-xs text-gray-500">Male</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <FaFemale className="text-pink-500" />
                        <span className="font-bold">{row.female}</span>
                      </div>
                      <div className="text-xs text-gray-500">Female</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
                <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                  <FaEye className="inline mr-1" /> View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-6xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No labour requests found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {filteredRows.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 gap-4">
          <div className="text-gray-600 text-sm">
            Showing <span className="font-semibold">1-{filteredRows.length}</span> of{" "}
            <span className="font-semibold">{filteredRows.length}</span> requests
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              ← Previous
            </button>
            <span className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">1</span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={deleteModalOpen}>
          <Box sx={modalStyle}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Labour Request?
              </h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the request from{" "}
                <span className="font-semibold text-gray-800">
                  {selected?.farmerName}
                </span>
                ? This action cannot be undone.
              </p>

              {selected && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Crop</div>
                      <div className="font-medium">{selected.crop}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Required Date</div>
                      <div className="font-medium">{selected.requiredDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Labour Required</div>
                      <div className="font-medium">{selected.male + selected.female} workers</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(selected.status)}`}>
                          {selected.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Yes, Delete Request
                </button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}