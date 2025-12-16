"use client";

import { useState, useRef } from "react";
import { Modal, Box, Pagination, Stack, TextField, Button } from "@mui/material";
import { FaTrash, FaEdit, FaFileExcel, FaFileCsv, FaFilePdf, FaPrint, FaCopy } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

interface Requirement {
  id: number;
  date: string;
  category: string;
  item: string;
  seed: string;
  quantity: string;
  quality: string;
  postedBy: string;
  status: string;
}

/* ================= DATA ================= */

const initialData: Requirement[] = [
  {
    id: 1,
    date: "2025-06-14",
    category: "Vegetables/Herbs",
    item: "Tomato",
    seed: "618",
    quantity: "Per Unit-25kg",
    quality: "Quality 1 : 1st",
    postedBy: "Chethan",
    status: "Pending",
  },
  {
    id: 2,
    date: "2025-04-01",
    category: "Vegetables/Herbs",
    item: "Onion",
    seed: "NAATI TOMATO",
    quantity: "Per Unit-25kg",
    quality: "Quality 1 : 1st, Quality 2 : 3rd",
    postedBy: "Raju H V",
    status: "Pending",
  },
];

/* ================= PAGE ================= */

export default function RequirementsPage() {
  const [rows, setRows] = useState(initialData);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const rowsPerPage = 5;

  const tableRef = useRef<HTMLTableElement>(null);

  /* ================= EXPORT FUNCTIONS ================= */

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");
    XLSX.writeFile(wb, "requirements.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "requirements.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Category", "Item", "Seed", "Qty", "Quality", "Status"]],
      body: rows.map(r => [
        r.date,
        r.category,
        r.item,
        r.seed,
        r.quantity,
        r.quality,
        r.status,
      ]),
    });
    doc.save("requirements.pdf");
  };

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    alert("Copied to clipboard");
  };

  const printTable = () => {
    window.print();
  };

  /* ================= PAGINATION ================= */

  const start = (page - 1) * rowsPerPage;
  const paginatedRows = rows.slice(start, start + rowsPerPage);

  /* ================= JSX ================= */

  return (
    <div className="bg-white rounded shadow p-4">
      
      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={copyData} className="btn"><FaCopy /> Copy</button>
        <button onClick={exportExcel} className="btn"><FaFileExcel /> Excel</button>
        <button onClick={exportCSV} className="btn"><FaFileCsv /> CSV</button>
        <button onClick={exportPDF} className="btn"><FaFilePdf /> PDF</button>
        <button onClick={printTable} className="btn"><FaPrint /> Print</button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table ref={tableRef} className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {["Date","Category","Item","Seed","Qty","Quality","Posted By","Status","Action"].map(h => (
                <th key={h} className="px-3 py-2 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="td">{row.date}</td>
                <td className="td">{row.category}</td>
                <td className="td">{row.item}</td>
                <td className="td">{row.seed}</td>
                <td className="td">{row.quantity}</td>
                <td className="td">{row.quality}</td>
                <td className="td">{row.postedBy}</td>
                <td className="td">{row.status}</td>
                <td className="td text-center">
                  <button onClick={() => {setSelected(row); setEditOpen(true);}} className="icon-btn blue">
                    <FaEdit />
                  </button>
                  <button onClick={() => {setSelected(row); setDeleteOpen(true);}} className="icon-btn red">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {paginatedRows.map(row => (
          <div key={row.id} className="border rounded p-3 shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{row.item}</h3>
                <p className="text-xs text-gray-500">{row.category}</p>
              </div>
              <div className="flex gap-2">
                <FaEdit onClick={() => {setSelected(row); setEditOpen(true);}} />
                <FaTrash onClick={() => {setSelected(row); setDeleteOpen(true);}} />
              </div>
            </div>
            <p className="text-sm mt-2"><b>Qty:</b> {row.quantity}</p>
            <p className="text-sm"><b>Status:</b> {row.status}</p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-4">
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </div>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box className="modal">
          <h3 className="font-semibold mb-3">Edit Requirement</h3>
          <TextField fullWidth label="Item" defaultValue={selected?.item} />
          <Button className="mt-4" variant="contained">Save</Button>
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box className="modal text-center">
          <p>Delete this record?</p>
          <Button color="error" variant="contained" className="mt-3">Delete</Button>
        </Box>
      </Modal>

      {/* TAILWIND HELPERS */}
      <style jsx>{`
        .btn { @apply flex items-center gap-2 border px-3 py-1 rounded text-sm hover:bg-gray-100 }
        .td { @apply px-3 py-2 border }
        .icon-btn { @apply p-2 rounded text-white }
        .blue { @apply bg-blue-500 }
        .red { @apply bg-red-500 }
        .modal { @apply bg-white p-6 rounded shadow max-w-md mx-auto mt-32 }
      `}</style>
    </div>
  );
}
