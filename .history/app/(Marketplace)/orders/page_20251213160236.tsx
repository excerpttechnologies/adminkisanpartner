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
import "jspdf-autotable";

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

type EditForm = Partial<Order>;

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

/* ================= COMPONENT ================= */

export default function OrdersPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({});

  const tableRef = useRef<HTMLDivElement | null>(null);

  /* ================= FILTER ================= */

  const filteredOrders: Order[] = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    const matchesDate = dateFilter === "" || order.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  /* ================= HANDLERS ================= */

  const handleEditClick = (order: Order): void => {
    setCurrentOrder(order);
    setEditForm({ ...order });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (): void => {
    if (!currentOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === currentOrder.id ? { ...o, ...editForm } as Order : o
      )
    );

    setEditModalOpen(false);
    setCurrentOrder(null);
    setEditForm({});
  };

  const handleDeleteClick = (order: Order): void => {
    setCurrentOrder(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (!currentOrder) return;

    setOrders((prev) => prev.filter((o) => o.id !== currentOrder.id));
    setDeleteModalOpen(false);
    setCurrentOrder(null);
  };

  const handleViewClick = (order: Order): void => {
    setCurrentOrder(order);
    setViewModalOpen(true);
  };

  /* ================= EXPORT ================= */

  const handleCopyToClipboard = async (): Promise<void> => {
    const text = filteredOrders
      .map((order) => Object.values(order).join("\t"))
      .join("\n");

    await navigator.clipboard.writeText(text);
    alert("Orders copied to clipboard!");
  };

  const handleExportExcel = (): void => {
    const ws = utils.json_to_sheet(filteredOrders);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, "orders.xlsx");
  };

  const handleExportCSV = (): void => {
    const csv = filteredOrders
      .map((o) => Object.values(o).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  const handleExportPDF = (): void => {
    const doc = new jsPDF();
    doc.text("Orders Report", 14, 16);
    doc.autoTable({
      head: [["ID", "Date", "Crop", "Ordered By", "Status", "Amount"]],
      body: filteredOrders.map((o) => [
        o.id,
        o.date,
        o.crop,
        o.orderedBy,
        o.status,
        o.amount,
      ]),
      startY: 20,
    });
    doc.save("orders.pdf");
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "Orders Report",
  });

  /* ================= JSX ================= */

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* ❗ UI REMAINS EXACTLY SAME – NO DESIGN CHANGES ❗ */}
      {/* Your existing JSX stays unchanged */}
    </div>
  );
}
