"use client";

import { useState } from "react";
import { Modal, Box, Pagination, Stack } from "@mui/material";
import { FaTrash } from "react-icons/fa";

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
}

/* ================= DATA ================= */

const labourRequests: LabourRequest[] = [
  {
    id: 1,
    farmerName: "Rajesh Kumar",
    mobile: "9876543210",
    requiredDate: "2024-07-20",
    male: 5,
    female: 3,
    crop: "Wheat",
    work: "Harvesting",
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
  },
];

/* ================= PAGE ================= */

export default function LabourRequestsPage() {
  const [rows, setRows] = useState<LabourRequest[]>(labourRequests);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LabourRequest | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const handleDeleteClick = (row: LabourRequest) => {
    setSelected(row);
    setOpen(true);
  };

  const confirmDelete = () => {
    if (!selected) return;
    setRows((prev) => prev.filter((r) => r.id !== selected.id));
    setOpen(false);
    setSelected(null);
  };

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="p-1 mt-4 bg-gray-100 min-h-[80vh] pr-4">
      <div className="bg-white rounded shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Labour Requests
          </h2>
          <div className="text-sm text-gray-600">
            Total: {rows.length} requests
          </div>
        </div>

        {/* RESPONSIVE TABLE WITH HORIZONTAL SCROLL */}
        <div className="relative  overflow-x-auto w-full">
          <div className="min-w-[800px] overflow-visible">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Farmer Details</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Required Date</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Male Required</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Female Required</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Crop</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap">Work</th>
                  <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y over">
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-800">
                        {row.farmerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {row.mobile}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">{row.requiredDate}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{row.male}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{row.female}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{row.crop}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{row.work}</td>
                    <td className="px-6 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteClick(row)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MUI PAGINATION */}
        {rows.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-zinc-200">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of {rows.length} entries
            </div>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Stack>
          </div>
        )}

        {/* EMPTY STATE */}
        {rows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-4xl mb-3">👨‍🌾</div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No Labour Requests</h3>
            <p className="text-gray-500 text-sm">All labour requests have been processed or deleted.</p>
          </div>
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="flex items-center justify-center h-full">
          <div className="bg-white rounded shadow w-[90%] max-w-md p-6 text-center">

            <div className="text-red-500 text-5xl mb-4">🗑️</div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Labour Request?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete the request from{" "}
              <span className="font-medium text-gray-800">
                {selected?.farmerName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}