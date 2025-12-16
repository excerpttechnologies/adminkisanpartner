"use client";

import { useState, useRef } from "react";
import {
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaPrint,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  Backdrop,
} from "@mui/material";

import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- TYPES ---------------- */

type OrderStatus = "Pending" | "Processing" | "Delivered";

interface Order {
  id: number;
  date: string;
  crop: string;
  orderedBy: string;
  status: OrderStatus;
  delivery: string;
  payment: string;
  amount: string;
}

/* ---------------- DATA ---------------- */

const initialOrders: Order[] = [
  {
    id: 1,
    date: "2024-07-20",
    crop: "Organic Wheat (50kg bags)",
    orderedBy: "John Doe (Farmer)",
    status: "Delivered",
    delivery: "123 Farm Rd",
    payment: "Card (TXN2345)",
    amount: "$120",
  },
  {
    id: 2,
    date: "2024-07-19",
    crop: "Fresh Tomatoes (20kg)",
    orderedBy: "AgroSupply Co.",
    status: "Processing",
    delivery: "456 Market St",
    payment: "Bank Transfer",
    amount: "$90",
  },
  {
    id: 3,
    date: "2024-07-18",
    crop: "Red Potatoes (30kg)",
    orderedBy: "Jane Smith",
    status: "Pending",
    delivery: "789 Green Ln",
    payment: "Cash",
    amount: "$75",
  },
];

/* ---------------- MODAL STYLE ---------------- */

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

/* ---------------- PAGE ---------------- */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">("All");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [current, setCurrent] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

  const tableRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FILTER ---------------- */

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.crop.toLowerCase().includes(search.toLowerCase()) ||
      o.orderedBy.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);

    const matchStatus = status === "All" || o.status === status;

    return matchSearch && matchStatus;
  });

  /* ---------------- ACTIONS ---------------- */

  const handleEdit = (order: Order) => {
    setCurrent(order);
    setEditForm(order);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!current) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === current.id ? { ...current, ...editForm } as Order : o))
    );
    setEditOpen(false);
  };

  const handleDelete = (order: Order) => {
    setCurrent(order);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!current) return;
    setOrders((prev) => prev.filter((o) => o.id !== current.id));
    setDeleteOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "Orders Report",
  });

  /* ---------------- EXPORT ---------------- */

  const exportExcel = () => {
    const ws = utils.json_to_sheet(filtered);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, "orders.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Crop", "Ordered By", "Status", "Amount"]],
      body: filtered.map((o) => [
        o.id,
        o.crop,
        o.orderedBy,
        o.status,
        o.amount,
      ]),
    });
    doc.save("orders.pdf");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 py-2 border rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-48">
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
          <select
            className="w-full pl-10 py-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={exportExcel} className="btn">Excel</button>
        <button onClick={exportPDF} className="btn">PDF</button>
        <button onClick={handlePrint} className="btn">Print</button>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Crop</th>
              <th>Ordered By</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td>{o.crop}</td>
                <td>{o.orderedBy}</td>
                <td>{o.status}</td>
                <td className="font-bold">{o.amount}</td>
                <td className="flex gap-2 p-2">
                  <FaEye onClick={() => { setCurrent(o); setViewOpen(true); }} />
                  <FaEdit onClick={() => handleEdit(o)} />
                  <FaTrash onClick={() => handleDelete(o)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} closeAfterTransition BackdropComponent={Backdrop}>
        <Fade in={deleteOpen}>
          <Box sx={modalStyle}>
            <Typography variant="h6">Delete Order?</Typography>
            <Button color="error" onClick={confirmDelete}>Delete</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
