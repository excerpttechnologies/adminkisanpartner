"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Modal,
  Box,
  Pagination,
  Stack,
  Button,
} from "@mui/material";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

interface Posting {
  id: number;
  date: string;
  title: string;
  category: string;
  item: string;
  seed: string;
  acres: string;
  postedBy: string;
  status: string;
}

/* ================= DATA ================= */

const initialData: Posting[] = [
  {
    id: 1,
    date: "2025-11-23",
    title: "Mango",
    category: "Fruits",
    item: "Mango",
    seed: "undefined",
    acres: "Acre 3",
    postedBy: "Chethan",
    status: "Pending",
  },
  {
    id: 2,
    date: "2025-09-21",
    title: "Tomato",
    category: "Vegetables",
    item: "Tomato",
    seed: "Seed",
    acres: "Acre 1",
    postedBy: "Suresh",
    status: "Approved",
  },
];

/* ================= COMPONENT ================= */

export default function PostingTable() {
  const [data, setData] = useState<Posting[]>(initialData);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [modal, setModal] = useState<{
    type: "view" | "edit" | "delete" | null;
    row?: Posting;
  }>({ type: null });

  const tableRef = useRef<HTMLDivElement>(null);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [page, data]);

  /* ================= EXPORT FUNCTIONS ================= */

  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Copied to clipboard");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Posting");
    XLSX.writeFile(wb, "posting.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "posting.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[
        "Date",
        "Title",
        "Category",
        "Item",
        "Seed",
        "Acres",
        "Posted By",
        "Status",
      ]],
      body: data.map(d => [
        d.date,
        d.title,
        d.category,
        d.item,
        d.seed,
        d.acres,
        d.postedBy,
        d.status,
      ]),
    });
    doc.save("posting.pdf");
  };

  const printTable = () => {
    const content = tableRef.current?.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    if (!win) return;
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-2 mb-4">
        <ActionBtn icon={<FaCopy />} label="Copy" onClick={copyData} />
        <ActionBtn icon={<FaFileExcel />} label="Excel" onClick={exportExcel} />
        <ActionBtn icon={<FaFileCsv />} label="CSV" onClick={exportCSV} />
        <ActionBtn icon={<FaFilePdf />} label="PDF" onClick={exportPDF} />
        <ActionBtn icon={<FaPrint />} label="Print" onClick={printTable} />
      </div>

      {/* TABLE */}
      <div
        ref={tableRef}
        className="overflow-x-auto border rounded-lg"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Date",
                "Title",
                "Category",
                "Item",
                "Seed",
                "Acres",
                "Posted By",
                "Status",
                "Action",
              ].map(h => (
                <th key={h} className="px-3 py-2 text-left whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map(row => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2">{row.title}</td>
                <td className="px-3 py-2">{row.category}</td>
                <td className="px-3 py-2">{row.item}</td>
                <td className="px-3 py-2">{row.seed}</td>
                <td className="px-3 py-2">{row.acres}</td>
                <td className="px-3 py-2">{row.postedBy}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <IconBtn
                    color="blue"
                    onClick={() => setModal({ type: "view", row })}
                  >
                    <FaEye />
                  </IconBtn>
                  <IconBtn
                    color="indigo"
                    onClick={() => setModal({ type: "edit", row })}
                  >
                    <FaEdit />
                  </IconBtn>
                  <IconBtn
                    color="red"
                    onClick={() => setModal({ type: "delete", row })}
                  >
                    <FaTrash />
                  </IconBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
        />
      </Stack>

      {/* MODAL */}
      <Modal open={!!modal.type} onClose={() => setModal({ type: null })}>
        <Box className="bg-white p-6 rounded-xl w-[90%] max-w-md mx-auto mt-32">
          <h2 className="text-lg font-semibold mb-4 capitalize">
            {modal.type} Posting
          </h2>
          <pre className="text-sm bg-gray-100 p-3 rounded">
            {JSON.stringify(modal.row, null, 2)}
          </pre>
          <Button
            fullWidth
            variant="contained"
            className="mt-4"
            onClick={() => setModal({ type: null })}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

/* ================= REUSABLE ================= */

const ActionBtn = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100"
  >
    {icon}
    {label}
  </button>
);

const IconBtn = ({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded text-white bg-${color}-600 hover:bg-${color}-700`}
  >
    {children}
  </button>
);
