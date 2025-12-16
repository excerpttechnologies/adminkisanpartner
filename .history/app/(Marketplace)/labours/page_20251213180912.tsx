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
  const rowsPerPage = 5;

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

  /* Pagination */
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className=" mt-4  min-h-[80vh]">
      <div className="bg-white rounded shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-300">
          <h2 className="text-lg font-semibold text-gray-800">
            Labour Requests
          </h2>
          <span className="text-sm text-gray-600">
            Total: {rows.length}
          </span>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-zinc-300">
              <tr>
                <th className="px-4 py-3 text-left">Farmer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Male</th>
                <th className="px-4 py-3">Female</th>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Work</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 ">
                  <td className="px-4 py-2">
                    <div className="font-medium">{row.farmerName}</div>
                    <div className="text-xs text-gray-500">{row.mobile}</div>
                  </td>
                  <td className="px-4 py-2 w-4">{row.requiredDate}</td>
                  <td className="px-4 py-2">{row.male}</td>
                  <td className="px-4 py-2">{row.female}</td>
                  <td className="px-4 py-2">{row.crop}</td>
                  <td className="px-4 py-2">{row.work}</td>
                  <td className="px-4 py-2 text-center">
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

        {/* ================= MOBILE CARD VIEW ================= */}
        <div className="md:hidden p-3 space-y-2">
          {paginatedRows.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-lg border-zinc-300 shadow border p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{row.farmerName}</h3>
                  <p className="text-xs text-gray-500">{row.mobile}</p>
                </div>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <p><span className="text-gray-500">Date:</span> {row.requiredDate}</p>
                <p><span className="text-gray-500">Crop:</span> {row.crop}</p>
                <p><span className="text-gray-500">Male:</span> {row.male}</p>
                <p><span className="text-gray-500">Female:</span> {row.female}</p>
                <p className="col-span-2">
                  <span className="text-gray-500">Work:</span> {row.work}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {rows.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-zinc-200">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}–{Math.min(endIndex, rows.length)} of {rows.length}
            </span>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </div>
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="flex items-center justify-center h-full">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-md text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-semibold mb-2">Delete Request?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Delete request from{" "}
              <span className="font-medium">{selected?.farmerName}</span>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded"
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
