"use client";

import React, { useState } from "react";
import {
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";

/* ---------------- TYPES ---------------- */
interface OrderRow {
  id: number;
  date: string;
  crop: string;
  farmer: string;
  orderBy: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  payment: "Pending" | "Paid" | "Failed";
  amount: number;
  quantity: number;
}

/* ---------------- MOCK DATA ---------------- */
const initialRows: OrderRow[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  date: `2025-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
  crop: ["Tomato", "Wheat", "Rice", "Corn"][i % 4],
  farmer: ["Abhishek", "Rajesh", "Priya", "Amit"][i % 4],
  orderBy: ["AGRICO", "FARMART", "GROWMAX"][i % 3],
  status: ["Pending", "Processing", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)] as any,
  payment: ["Pending", "Paid", "Failed"][Math.floor(Math.random() * 3)] as any,
  amount: Math.floor(Math.random() * 1000) + 100,
  quantity: Math.floor(Math.random() * 100) + 1,
}));

export default function OrdersPage() {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRow, setActiveRow] = useState<OrderRow | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const statusColor = (s: string) =>
    s === "Delivered"
      ? "success"
      : s === "Processing"
      ? "info"
      : s === "Cancelled"
      ? "error"
      : "warning";

  return (
    <Box className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Crop</th>
              <th className="px-4 py-3 hidden md:table-cell">Farmer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden md:table-cell">Payment</th>
              <th className="px-4 py-3 hidden md:table-cell">Amount</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.date}</td>

                <td className="px-4 py-3">
                  <p className="font-medium text-blue-600">{row.crop}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {row.quantity}
                  </p>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {row.farmer}
                </td>

                <td className="px-4 py-3">
                  <Chip
                    label={row.status}
                    size="small"
                    color={statusColor(row.status)}
                  />
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <Chip
                    label={row.payment}
                    size="small"
                    color={statusColor(row.payment)}
                  />
                </td>

                <td className="px-4 py-3 hidden md:table-cell font-semibold text-green-600">
                  ₹{row.amount}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setActiveRow(row);
                    }}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVert fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (ONLY MUI COMPONENT USED) */}
      <div className="flex justify-center mt-6">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
          shape="rounded"
        />
      </div>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            setAnchorEl(null);
          }}
        >
          <Edit fontSize="small" className="mr-2" /> Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            setAnchorEl(null);
          }}
        >
          <Delete fontSize="small" className="mr-2" /> Delete
        </MenuItem>
      </Menu>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent className="space-y-3 mt-2">
          <TextField label="Crop" fullWidth defaultValue={activeRow?.crop} />
          <TextField label="Farmer" fullWidth defaultValue={activeRow?.farmer} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenEdit(false);
              setSnackbar(true);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setRows(rows.filter(r => r.id !== activeRow?.id));
              setOpenDelete(false);
              setSnackbar(true);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >
        <Alert severity="success">Action completed successfully</Alert>
      </Snackbar>
    </Box>
  );
}
