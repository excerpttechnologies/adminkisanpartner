"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog } from "@mui/material";
import axios from "axios";

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
}

/* ================= PAGE ================= */

export default function RequirementsPage() {
  const [rows, setRows] = useState<Requirement[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const rowsPerPage = 5;
  const tableRef = useRef<HTMLTableElement>(null);

  /* ================= API ================= */

  const getRequirements = async () => {
    const res = await axios.get("/api/requirements");
    setRows(res.data.data || []);
  };

  useEffect(() => {
    getRequirements();
  }, []);

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        row.category.toLowerCase().includes(search) ||
        row.subCategory.toLowerCase().includes(search) ||
        row.variety.toLowerCase().includes(search) ||
        row.location.toLowerCase().includes(search);

      const matchesStatus =
        filterStatus === "all" || row.status === filterStatus;

      const matchesCategory =
        filterCategory === "all" || row.category === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rows, searchTerm, filterStatus, filterCategory]);

  /* ================= PAGINATION ================= */

  const start = (page - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  /* ================= EXPORT ================= */

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");
    XLSX.writeFile(wb, "requirements.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "requirements.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Category", "SubCategory", "Variety", "Quantity", "Status"]],
      body: filteredRows.map((r) => [
        new Date(r.requirementDate).toLocaleDateString(),
        r.category,
        r.subCategory,
        r.variety,
        r.qualities.reduce((t, q) => t + q.quantity, 0),
        r.status,
      ]),
    });
    doc.save("requirements.pdf");
  };

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredRows, null, 2));
  };

  const printTable = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><body>${tableRef.current?.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!selected) return;
    await axios.delete(`/api/requirements/${selected._id}`);
    setRows(rows.filter((r) => r._id !== selected._id));
    setDeleteOpen(false);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white p-4 rounded shadow">

      {/* SEARCH + ACTIONS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 pr-3 py-2 border rounded"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={copyData} className="btn"><HiOutlineDocumentDuplicate /></button>
        <button onClick={exportExcel} className="btn"><FaFileExcel /></button>
        <button onClick={exportCSV} className="btn"><FaFileCsv /></button>
        <button onClick={exportPDF} className="btn"><FaFilePdf /></button>
        <button onClick={printTable} className="btn"><FaPrint /></button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              {["Date", "Category", "SubCategory", "Variety", "Quantity", "Status", "Action"].map(h => (
                <th key={h} className="px-3 py-2 text-left text-sm">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map(row => (
              <tr key={row._id} className="border-t">
                <td className="px-3 py-2">
                  <FaCalendarAlt className="inline mr-1" />
                  {new Date(row.requirementDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">{row.category}</td>
                <td className="px-3 py-2">{row.subCategory}</td>
                <td className="px-3 py-2">{row.variety}</td>
                <td className="px-3 py-2">
                  {row.qualities.reduce((t, q) => t + q.quantity, 0)}
                </td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => { setSelected(row); setEditOpen(true); }} className="text-blue-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => { setSelected(row); setDeleteOpen(true); }} className="text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <div className="p-6 space-y-4">
          <h3 className="font-semibold">Delete Requirement?</h3>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteOpen(false)}>Cancel</button>
            <button onClick={handleDelete} className="text-red-600">Delete</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
