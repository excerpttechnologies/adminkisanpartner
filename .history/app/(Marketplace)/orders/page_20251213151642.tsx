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
} from "@mui/material";

import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { useReactToPrint } from "react-to-print";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= TYPES ================= */

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

/* ================= DATA ================= */

const initialOrders: Order[] = [
  {
    id: 1,
    date: "2024-07-20",
    crop: "Organic Wheat (50kg bags)",
    orderedBy: "John Doe (Farmer)",
    status: "Delivered",
    delivery: "123 Farm Rd, Ruralville, ETA",
    payment: "Card (TXN2345)",
    amount: "$120",
  },
  {
    id: 2,
    date: "2024-07-19",
    crop: "Fresh Tomatoes (20kg)",
    orderedBy: "AgroSupply Co. (Agent)",
    status: "Processing",
    delivery: "456 Market St, City, ETA",
    payment: "Bank Transfer (TXN2346)",
    amount: "$90",
  },
  {
    id: 3,
    date: "2024-07-18",
    crop: "Red Potatoes (30kg)",
    orderedBy: "Jane Smith (Farmer)",
    status: "Pending",
    delivery: "789 Green Ln, Village",
    payment: "Cash",
    amount: "$75",
  },
];

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

/* ================= PAGE ================= */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

  const tableRef = useRef<HTMLDivElement | null>(null);

  /* ================= FILTER ================= */

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    const matchesDate =
      dateFilter === "" || order.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  /* ================= HANDLERS ================= */

  const handleEditClick = (order: Order) => {
    setCurrentOrder(order);
    setEditForm(order);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentOrder) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === currentOrder.id
          ? { ...order, ...editForm }
          : order
      )
    );

    setEditModalOpen(false);
    setCurrentOrder(null);
    setEditForm({});
  };

  const handleDeleteClick = (order: Order) => {
    setCurrentOrder(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentOrder) return;

    setOrders((prev) =>
      prev.filter((order) => order.id !== currentOrder.id)
    );

    setDeleteModalOpen(false);
    setCurrentOrder(null);
  };

  const handleViewClick = (order: Order) => {
    setCurrentOrder(order);
    setViewModalOpen(true);
  };

  /* ================= EXPORT ================= */

  const handleCopyToClipboard = async (): Promise<void> => {
    const text = filteredOrders
      .map((order) => Object.values(order).join("\t"))
      .join("\n");

    await navigator.clipboard.writeText(text);
  };

  const handleExportExcel = (): void => {
    const ws = utils.json_to_sheet(filteredOrders);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, "orders.xlsx");
  };

  const handleExportPDF = (): void => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Crop", "Ordered By", "Status", "Amount"]],
      body: filteredOrders.map((o) => [
        o.id,
        o.crop,
        o.orderedBy,
        o.status,
        o.amount,
      ]),
    });
    doc.save("orders.pdf");
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "Orders Report",
  });

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button onClick={handleCopyToClipboard}><FaCopy /></button>
        <button onClick={handleExportExcel}><FaFileExcel /></button>
        <button onClick={handleExportPDF}><FaFilePdf /></button>
        <button onClick={handlePrint}><FaPrint /></button>
      </div>

      {/* TABLE */}
      <div ref={tableRef} className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Crop</th>
              <th>Ordered By</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">{order.id}</td>
                <td>{order.crop}</td>
                <td>{order.orderedBy}</td>
                <td>{order.status}</td>
                <td className="font-bold">{order.amount}</td>
                <td className="flex gap-2 p-2">
                  <FaEye onClick={() => handleViewClick(order)} />
                  <FaEdit onClick={() => handleEditClick(order)} />
                  <FaTrash onClick={() => handleDeleteClick(order)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
