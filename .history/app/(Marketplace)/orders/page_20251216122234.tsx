/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

/* ================= TYPES ================= */

interface Order {
  _id: string;
  orderId: string;
  cropDetail: {
    cropName: string;
    category: string;
  };
  farmer: { name?: string } | string;
  trader: { name?: string } | string;
  status: {
    admin: "Pending" | "Approved" | "Rejected";
    farmer: "Pending" | "Approved" | "Rejected";
  };
  delivery: {
    date: string;
    time: string;
  };
  payment: {
    status: "Pending" | "Completed" | "Failed";
    paymentId: string;
    payDate: string;
  };
}

/* ================= MODAL STYLE ================= */

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  p: 4,
};

/* ================= COMPONENT ================= */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  /* ================= GET ORDERS ================= */

  const getOrders = async () => {
    const res = await axios.get("/api/order", {
      params: {
        search,
        status: status || undefined,
        date: date || undefined,
        page,
        limit: 10,
      },
    });

    setOrders(res.data.data);
  };

  useEffect(() => {
    getOrders();
  }, [search, status, date, page]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!currentOrder) return;

    await axios.put(`/api/order/${currentOrder._id}`, {
      status: currentOrder.status,
    });

    setEditOpen(false);
    getOrders();
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!currentOrder) return;

    await axios.delete(`/api/order/${currentOrder._id}`);
    setDeleteOpen(false);
    getOrders();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-white rounded shadow min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order / crop"
            className="pl-10 border p-2 rounded w-full"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={() => {
            setSearch("");
            setStatus("");
            setDate("");
          }}
          className="bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Crop</th>
              <th className="p-2">Farmer</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{o.orderId}</td>
                <td className="p-2">{o.cropDetail.cropName}</td>
                <td className="p-2">
                  {typeof o.farmer === "string" ? o.farmer : o.farmer?.name}
                </td>
                <td className="p-2">{o.status.admin}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentOrder(o);
                      setEditOpen(true);
                    }}
                    className="text-green-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentOrder(o);
                      setDeleteOpen(true);
                    }}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Update Status</Typography>
          <FormControl fullWidth className="mt-4">
            <InputLabel>Status</InputLabel>
            <Select
              value={currentOrder?.status.admin || ""}
              label="Status"
              onChange={(e) =>
                setCurrentOrder((prev: any) => ({
                  ...prev,
                  status: { ...prev.status, admin: e.target.value },
                }))
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <Typography>
            Delete order <b>{currentOrder?.orderId}</b> ?
          </Typography>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
