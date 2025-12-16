"use client";

import { useState } from "react";
import { Modal, Box } from "@mui/material";
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
];

/* ================= PAGE ================= */

export default function LabourRequestsPage() {
  const [rows, setRows] = useState<LabourRequest[]>(labourRequests);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<LabourRequest | null>(null);

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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Labour Requests
          </h2>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Farmer Details</th>
                <th className="px-6 py-3">Required Date</th>
                <th className="px-6 py-3">Male</th>
                <th className="px-6 py-3">Female</th>
                <th className="px-6 py-3">Crop</th>
                <th className="px-6 py-3">Work</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="font-medium">{row.farmerName}</div>
                    <div className="text-xs text-gray-500">{row.mobile}</div>
                  </td>
                  <td className="px-6 py-3">{row.requiredDate}</td>
                  <td className="px-6 py-3">{row.male}</td>
                  <td className="px-6 py-3">{row.female}</td>
                  <td className="px-6 py-3">{row.crop}</td>
                  <td className="px-6 py-3">{row.work}</td>
                  <td className="px-6 py-3 text-center">
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

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden p-4 space-y-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-800">
                    {row.farmerName}
                  </div>
                  <div className="text-xs text-gray-500">{row.mobile}</div>
                </div>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p>{row.requiredDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Crop</p>
                  <p>{row.crop}</p>
                </div>
                <div>
                  <p className="text-gray-500">Male</p>
                  <p>{row.male}</p>
                </div>
                <div>
                  <p className="text-gray-500">Female</p>
                  <p>{row.female}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Work</p>
                  <p>{row.work}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="flex items-center justify-center h-full">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">🗑️</div>

            <h3 className="text-lg font-semibold mb-2">
              Delete Labour Request?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete request from{" "}
              <span className="font-medium">
                {selected?.farmerName}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md"
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
