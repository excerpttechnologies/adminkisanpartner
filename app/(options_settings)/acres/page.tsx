/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Pagination,
  Checkbox,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
} from "@mui/material";
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

interface Acre {
  _id: string;
  name: string;
  createdAt: string;
}

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute" as const,
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

export default function AcresPage() {
  // State
  const [acres, setAcres] = useState<Acre[]>([
    {
      _id: "A001",
      name: "Acre 1",
      createdAt: new Date().toISOString()
    },
    {
      _id: "A002",
      name: "Acre 2",
      createdAt: new Date().toISOString()
    },
    {
      _id: "A003",
      name: "Acre 3",
      createdAt: new Date().toISOString()
    }
  ]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAcres, setTotalAcres] = useState(3);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentAcre, setCurrentAcre] = useState<Acre | null>(null);

  // Form states
  const [newName, setNewName] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  /* ================= FILTERED DATA ================= */

  const filteredAcres = acres.filter(acre =>
    acre.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination
  const paginatedAcres = filteredAcres.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalFilteredAcres = filteredAcres.length;
  const calculatedTotalPages = Math.ceil(totalFilteredAcres / rowsPerPage);

  /* ================= FETCH DATA (Simulated) ================= */

  const fetchAcres = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real app, you would use:
      // const res = await axios.get("/api/acres", {
      //   params: { search, page, limit: rowsPerPage }
      // });

      setTotalPages(calculatedTotalPages);
      setTotalAcres(totalFilteredAcres);
    } catch (error) {
      console.error("Error fetching acres:", error);
      toast.error("Failed to load acres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcres();
  }, [search, page, rowsPerPage]);

  /* ================= CRUD OPERATIONS ================= */

  const handleAddAcre = async () => {
    if (!newName.trim()) {
      toast.error("Please enter an acre name");
      return;
    }

    setLoading(true);
    try {
      const newAcre: Acre = {
        _id: `A${Date.now()}`,
        name: newName,
        createdAt: new Date().toISOString()
      };

      setAcres([...acres, newAcre]);
      toast.success("Acre added successfully");
      setAddOpen(false);
      setNewName("");
      fetchAcres();
    } catch (error: any) {
      console.error("Error adding acre:", error);
      toast.error(error.response?.data?.message || "Failed to add acre");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAcre = async () => {
    if (!currentAcre || !newName.trim()) return;

    setLoading(true);
    try {
      const updatedAcres = acres.map(acre =>
        acre._id === currentAcre._id
          ? { ...acre, name: newName }
          : acre
      );

      setAcres(updatedAcres);
      toast.success("Acre updated successfully");
      setEditOpen(false);
      setCurrentAcre(null);
      fetchAcres();
    } catch (error: any) {
      console.error("Error updating acre:", error);
      toast.error(error.response?.data?.message || "Failed to update acre");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAcre = async () => {
    if (!currentAcre) return;

    setLoading(true);
    try {
      const filteredAcres = acres.filter(acre => acre._id !== currentAcre._id);
      setAcres(filteredAcres);
      toast.success("Acre deleted successfully");
      setDeleteOpen(false);
      setCurrentAcre(null);
      fetchAcres();
    } catch (error: any) {
      console.error("Error deleting acre:", error);
      toast.error(error.response?.data?.message || "Failed to delete acre");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one acre to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected acre(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const filteredAcres = acres.filter(acre => !selectedIds.includes(acre._id));
      setAcres(filteredAcres);
      toast.success(`${selectedIds.length} acre(s) deleted successfully`);
      setSelectedIds([]);
      fetchAcres();
    } catch (error: any) {
      console.error("Error deleting selected acres:", error);
      toast.error(error.response?.data?.message || "Failed to delete acres");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedAcres.map(acre => acre._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(acreId => acreId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const handleCopyToClipboard = async () => {
    const headers = ["Sr.", "Acre Name", "Created Date"];
    const csvContent = [
      headers.join("\t"),
      ...paginatedAcres.map((acre, index) => [
        index + 1 + (page - 1) * rowsPerPage,
        acre.name,
        new Date(acre.createdAt).toLocaleDateString(),
      ].join("\t"))
    ].join("\n");

    try {
      await navigator.clipboard.writeText(csvContent);
      toast.success("Data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    const data = paginatedAcres.map((acre, index) => ({
      "Sr.": index + 1 + (page - 1) * rowsPerPage,
      "Acre Name": acre.name,
      "Created Date": new Date(acre.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Acres");
    writeFile(wb, `acres-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  };

  const handleExportCSV = () => {
    const headers = ["Sr.", "Acre Name", "Created Date"];

    const csvContent = [
      headers.join(","),
      ...paginatedAcres.map((acre, index) => [
        index + 1 + (page - 1) * rowsPerPage,
        `"${acre.name}"`,
        `"${new Date(acre.createdAt).toLocaleDateString()}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `acres-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file downloaded successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Acres Management Report", 14, 16);

    const tableColumn = ["Sr.", "Acre Name", "Created Date"];
    const tableRows: any = paginatedAcres.map((acre, index) => [
      index + 1 + (page - 1) * rowsPerPage,
      acre.name,
      new Date(acre.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [76, 175, 80] },
    });

    doc.save(`acres-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file downloaded successfully!");
  };

  const handlePrint = () => {
    if (paginatedAcres.length === 0) {
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
        <title>Acres Management Report</title>
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
          <h1>🌱 Acres Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Acres: ${totalFilteredAcres} | Showing: ${paginatedAcres.length} acres</div>
          <div class="header-info">Page: ${page} of ${calculatedTotalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Acre Name</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedAcres.map((acre, index) => {
      return `
                <tr>
                  <td>${index + 1 + (page - 1) * rowsPerPage}</td>
                  <td><strong>${acre.name}</strong></td>
                  <td>${new Date(acre.createdAt).toLocaleDateString()}</td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Acres Management System | ${window.location.hostname}</p>
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
    toast.success("Print window opened!");
  };

  /* ================= MODAL HANDLERS ================= */

  const openEditModal = (acre: Acre) => {
    setCurrentAcre(acre);
    setNewName(acre.name);
    setEditOpen(true);
  };

  const openDeleteModal = (acre: Acre) => {
    setCurrentAcre(acre);
    setDeleteOpen(true);
  };

  const openAddModal = () => {
    setNewName("");
    setAddOpen(true);
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
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Acres</h1>
          <p className="text-gray-600 mt-1">
            Manage land acres for your farm. {totalFilteredAcres} acres found.
          </p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={openAddModal}
            startIcon={<span className="text-xs">+</span>}
            className="bg-green-600 hover:bg-green-700"
            color="success"
            sx={{ paddingY: 0 }}
          >
            Add New Acre
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded shadow mb-4">
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          {/* Left Side: Selection Actions */}
          <div className="flex items-center gap-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedIds.length === paginatedAcres.length && paginatedAcres.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedAcres.length}
                  onChange={handleSelectAll}
                  size="small"
                />
              }
              label="Select All"
            />

            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<FaTrash />}
                onClick={handleDeleteSelected}
                className="ml-2"
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>

          {/* Right Side: Export Buttons */}
          <div className="lg:hidden flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200" },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200" },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200" },
            ].map((btn, i) => (
              <Tooltip key={i} title={btn.label}>
                <button
                  onClick={btn.onClick}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700`}
                >
                  <btn.icon />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search acres..."
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
              { label: "Copy", icon: FaCopy, onClick: handleCopyToClipboard, color: "bg-gray-100 hover:bg-gray-200" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExportExcel, color: "bg-green-100 hover:bg-green-200" },
              { label: "CSV", icon: FaFileCsv, onClick: handleExportCSV, color: "bg-blue-100 hover:bg-blue-200" },
              { label: "PDF", icon: FaFilePdf, onClick: handleExportPDF, color: "bg-red-100 hover:bg-red-200" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200" },
            ].map((btn, i) => (
              <Tooltip key={i} title={btn.label}>
                <button
                  onClick={btn.onClick}
                  className={`p-2 rounded transition-colors ${btn.color} text-gray-700`}
                >
                  <btn.icon />
                </button>
              </Tooltip>
            ))}

            {/* Rows Per Page Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Show</InputLabel>
              <Select
                value={rowsPerPage}
                label="Show"
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={10}>10 rows</MenuItem>
                <MenuItem value={25}>25 rows</MenuItem>
                <MenuItem value={50}>50 rows</MenuItem>
                <MenuItem value={100}>100 rows</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.length === paginatedAcres.length && paginatedAcres.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedAcres.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acre Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAcres.map((acre, index) => (
                <tr key={acre._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.includes(acre._id)}
                      onChange={() => handleSelectOne(acre._id)}
                      size="small"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1 + (page - 1) * rowsPerPage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{acre.name}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(acre.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => openEditModal(acre)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => openDeleteModal(acre)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedAcres.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold mb-2">No acres found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or add a new acre</p>
            <Button
              variant="contained"
              onClick={openAddModal}
              startIcon={<span className="text-lg">+</span>}
            >
              Add New Acre
            </Button>
          </div>
        )}

        {/* Pagination */}
        {paginatedAcres.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{1 + (page - 1) * rowsPerPage}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * rowsPerPage, totalFilteredAcres)}
              </span> of{" "}
              <span className="font-semibold">{totalFilteredAcres}</span> entries
            </div>

            <Pagination
              count={calculatedTotalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
              size="medium"
            />
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            Add New Acre
          </Typography>

          <TextField
            fullWidth
            label="Acre Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
            required
            placeholder="e.g., Acre 1, North Field, South Farm"
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddAcre}
              disabled={!newName.trim() || loading}
            >
              Add Acre
            </Button>
          </div>
        </Box>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            Edit Acre
          </Typography>

          <TextField
            fullWidth
            label="Acre Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
            required
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpdateAcre}
              disabled={!newName.trim() || loading}
            >
              Save Changes
            </Button>
          </div>
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>
            <Typography variant="h6" className="mb-2">
              Delete Acre?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentAcre?.name}"?
              This action cannot be undone.
            </Typography>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setDeleteOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAcre}
                variant="contained"
                color="error"
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}




















