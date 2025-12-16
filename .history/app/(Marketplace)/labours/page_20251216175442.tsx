/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect,useRef } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaFilter,
  FaUser,
  FaUserFriends,
  FaCalendarAlt,
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
  Stack,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
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
  };
  requiredDate: string;
  male: number;
  female: number;
  crop: string;
  work: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  notes?: string;
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
  const[limit,setLimit]=useState(10)
  
  const tableRef = useRef<HTMLDivElement>(null);

  /* ================= GET LABOURS ================= */

  const getLabours = async () => {
    try {
      const res = await axios.get("/api/labours", {
        params: {
          search,
          status: status === "All" ? undefined : status,
          date: date || undefined,
          page,
          limit: limit,
        },
      });

      setLabours(res.data.data || []);
      setTotalPages(Math.ceil(res.data.total / res.data.limit) || 1);
      setTotalLabours(res.data.total || 0);
    } catch (error) {
      console.error("Error fetching labours:", error);
    }
  };

  useEffect(() => {
    getLabours();
  }, [search, status, date, page]);

  /* ================= UPDATE ================= */

  const handleUpdate = async (data: any) => {
    if (!currentLabour) return;

    try {
      await axios.put(`/api/labours/${currentLabour._id}`, data);
      setEditOpen(false);
      getLabours();
      toast.success("Labour request updated successfully!");
    } catch (error: any) {
      console.error("Error updating labour:", error);
      toast.error(`Failed to update: ${error.response?.data?.message || error.message}`);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!currentLabour) return;

    try {
      await axios.delete(`/api/labours/${currentLabour._id}`);
      setDeleteOpen(false);
      getLabours();
      toast.success("Labour request deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting labour:", error);
      toast.error(`Failed to delete: ${error.response?.data?.message || error.message}`);
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
    const data = labours.map((labour, index) => ({
      "Sr.": index + 1 + (page - 1) * 10,
      "Farmer Name": labour.farmer.name,
      "Mobile": labour.farmer.mobile,
      "Required Date": new Date(labour.requiredDate).toLocaleDateString(),
      "Male Workers": labour.male,
      "Female Workers": labour.female,
      "Total Workers": labour.male + labour.female,
      "Crop": labour.crop,
      "Work Type": labour.work,
      "Status": labour.status,
      "Notes": labour.notes || "",
      "Created Date": new Date(labour.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Labour Requests");
    writeFile(wb, `labour-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Labour Requests Report", 14, 16);
    
    const tableColumn = ["Sr.", "Farmer", "Date", "Male", "Female", "Crop", "Work", "Status"];
    const tableRows = labours.map((labour, index) => [
      index + 1 + (page - 1) * 10,
      labour.farmer.name,
      new Date(labour.requiredDate).toLocaleDateString(),
      labour.male,
      labour.female,
      labour.crop,
      labour.work,
      labour.status
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`labour-requests-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "Labour Requests Report",
  });

  /* ================= FORMAT FUNCTIONS ================= */

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const calculateTotalWorkers = (labour: LabourRequest) => {
    //console.log(labour)
    return labour.male + labour.female;
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Labour Requests Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all labour requests from farmers. {totalLabours} requests found.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setAddOpen(true)} 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            <FaPlus /> Add Request
          </button>
        </div>
      </div>

      <LabourFormModal 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        onSubmit={handleCreate}
      />

      {/* Export Buttons Section */}
      <div className="flex flex-wrap gap-[.6rem] text-sm mb-6 bg-white p-[.6rem] text-sm rounded shadow">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-green-100 hover:bg-green-200 text-green-800 font-medium"
        >
          <FaFileExcel className="text-sm" />
          <span>Excel</span>
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200 text-red-800 font-medium"
        >
          <FaFilePdf className="text-sm" />
          <span>PDF</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium"
        >
          <FaPrint className="text-sm" />
          <span>Print</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded shadow p-[.6rem] text-sm md:p-6 mb-3">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="flex justify-between gap-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by farmer, crop, work..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-96 w-72 pl-10 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <select value={limit} onChange={(e)=>setLimit(Number(e.target.value))} className="p-3 border border-zinc-300 rounded">
              {
                [3,5,10,15,20,25,30,40,50,60,70,80,90,100].map((data,i)=>(
                  <option value={data}>{data}</option>
                ))
              }
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            {/* <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div> */}

          {/* Date Filter */}
          {/* <div className="md:col-span-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            /> */}
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-[.6rem] text-sm">
            <button
              onClick={() => {
                setSearch("");
                setStatus("All");
                setDate("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={() => getLabours()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded shadow" ref={tableRef}>
        <table className="min-w-full">
          <thead className="border-b border-zinc-200">
            <tr className="*:text-zinc-800">
              <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Farmer Details</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Required Date</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Workers</th>
              <th className="p-[.6rem] text-sm text-left font-semibold">Crop & Work</th>
              {/* <th className="p-[.6rem] text-sm text-left font-semibold">Status</th> */}
              <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {labours.map((labour, index) => (
              <tr key={labour._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-[.6rem] text-sm">{index + 1 + (page - 1) * 10}</td>
                <td className="p-[.6rem] text-sm">
                  <div className="font-semibold">{labour.farmer.name}</div>
                  <div className="text-gray-500 text-xs">{labour.farmer.mobile}</div>
                </td>
                <td className="p-[.6rem] text-sm font-medium">
                  {formatDate(labour.requiredDate)}
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <FaUser className="text-blue-500" />
                        <span className="font-semibold">{labour.male}</span>
                      </div>
                      <div className="text-xs text-gray-500">Male</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <FaUserFriends className="text-pink-500" />
                        <span className="font-semibold">{labour.female}</span>
                      </div>
                      <div className="text-xs text-gray-500">Female</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-700">
                        {calculateTotalWorkers(labour)}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </td>
                <td className="p-[.6rem] text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <FaSeedling className="text-green-500" />
                    <span className="font-medium">{labour.crop}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTools className="text-gray-500" />
                    <span className="text-gray-600">{labour.work}</span>
                  </div>
                </td>
                {/* <td className="p-[.6rem] text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(labour.status)}`}>
                    {labour.status}
                  </span>
                </td> */}
                <td className="p-[.6rem] text-sm">
                  <div className="flex gap-[.6rem] text-sm">
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setViewOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setEditOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Request"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLabour(labour);
                        setDeleteOpen(true);
                      }}
                      className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Mobile Cards (visible only on small devices) */}
      <div className="lg:hidden space-y-2 p-[.6rem] text-sm">
        {labours.map((labour, index) => (
          <div key={labour._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold text-gray-800">#{index + 1 + (page - 1) * 10}</span>
                {/* <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(labour.status)}`}>
                  {labour.status}
                </span> */}
              </div>
              <div className="flex gap-[.6rem] text-sm">
                <button onClick={() => { setCurrentLabour(labour); setViewOpen(true); }} className="p-1.5 text-blue-600">
                  <FaEye />
                </button>
                <button onClick={() => { setCurrentLabour(labour); setEditOpen(true); }} className="p-1.5 text-green-600">
                  <FaEdit />
                </button>
                <button onClick={() => { setCurrentLabour(labour); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Farmer</div>
                <div className="font-medium">{labour.farmer.name}</div>
                <div className="text-xs text-gray-500">{labour.farmer.mobile}</div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Required Date</div>
                  <div>{formatDate(labour.requiredDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Workers</div>
                  <div className="font-bold text-green-700">{calculateTotalWorkers(labour)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Male Workers</div>
                  <div>{labour.male}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Female Workers</div>
                  <div>{labour.female}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                <div>
                  <div className="text-sm text-gray-500">Crop</div>
                  <div>{labour.crop}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Work Type</div>
                  <div>{labour.work}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {labours.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👷</div>
          <h3 className="text-xl font-semibold mb-2">No labour requests found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Material-UI Pagination */}
      {labours.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between rounded items-center mt-5 gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (page - 1) * 10}-{Math.min(page * 10, totalLabours)}</span> of{" "}
            <span className="font-semibold">{totalLabours}</span> requests
          </div>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
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
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Request ID</div>
                    <div className="font-medium">{currentLabour._id.substring(0, 8)}...</div>
                  </div>
                  {/* <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(currentLabour.status)}`}>
                        {currentLabour.status}
                      </span>
                    </div>
                  </div> */}
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Farmer Details</div>
                  <div className="font-medium">{currentLabour.farmer.name}</div>
                  <div className="text-sm text-gray-600">{currentLabour.farmer.mobile}</div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Required Date</div>
                  <div className="font-medium">{formatDate(currentLabour.requiredDate)}</div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Male Workers</div>
                    <div className="font-bold text-blue-700">{currentLabour.male}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Female Workers</div>
                    <div className="font-bold text-pink-700">{currentLabour.female}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[.6rem] text-sm">
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Total Workers</div>
                    <div className="font-bold text-green-700 text-lg">{calculateTotalWorkers(currentLabour)}</div>
                  </div>
                  <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                    <div className="text-sm text-gray-500">Created Date</div>
                    <div>{formatDate(currentLabour.createdAt)}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-[.6rem] text-sm rounded-lg">
                  <div className="text-sm text-gray-500">Work Details</div>
                  <div className="font-medium">{currentLabour.crop} - {currentLabour.work}</div>
                  {currentLabour.notes && (
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Notes: </span>{currentLabour.notes}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setViewOpen(false)} variant="contained">
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
          <Typography variant="h6" className="mb-4">
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
                InputLabelProps={{ shrink: true }}
              />
              <div className="grid grid-cols-2 gap-4 my-4">
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
              />
              <div className="my-4">
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
              />
              </div>
             <div>
               {/* <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentLabour.status}
                  onChange={(e) =>
                    setCurrentLabour({
                      ...currentLabour,
                      status: e.target.value as any,
                    })
                  }
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl> */}
             </div>
              {/* <TextField
                label="Notes"
                value={currentLabour.notes || ""}
                onChange={(e) =>
                  setCurrentLabour({
                    ...currentLabour,
                    notes: e.target.value,
                  })
                }
                fullWidth
                size="small"
                multiline
                rows={2}
              /> */}
              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => handleUpdate(currentLabour)}>
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
            <Typography variant="h6" className="mb-2">
              Delete Labour Request?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete the request from{" "}
              <span className="font-medium">{currentLabour?.farmer.name}</span> for{" "}
              <span className="font-medium">{currentLabour?.crop}</span>? 
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-[.6rem] text-sm">
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