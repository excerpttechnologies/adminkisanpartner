"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Stack,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy,
  TableChart,
  PictureAsPdf,
  Print,
  FileDownload,
  DeleteForever,
  Refresh,
  Search,
  MoreVert,
} from "@mui/icons-material";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

type OrderStatus = OrderRow["status"];
type PaymentStatus = OrderRow["payment"];

/* ---------------- DATA ---------------- */
const initialRows: OrderRow[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  date: `2025-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
  crop: ["Tomato", "Wheat", "Rice", "Corn", "Potato", "Soybean", "Cotton"][i % 7],
  farmer: ["Abhishek", "Rajesh", "Priya", "Amit", "Sneha", "Kumar", "Anjali"][i % 7],
  orderBy: ["CHETHAN", "AGRICO", "FARMART", "GROWMAX", "CROPIO"][i % 5],
  status: ["Pending", "Processing", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)] as OrderStatus,
  payment: ["Pending", "Paid", "Failed"][Math.floor(Math.random() * 3)] as PaymentStatus,
  amount: Math.floor(Math.random() * 1000) + 100,
  quantity: Math.floor(Math.random() * 100) + 10,
}));

const rowsPerPageOptions = [5, 8, 10, 15];

export default function OrdersPage() {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuRow, setActionMenuRow] = useState<OrderRow | null>(null);

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filteredRows = rows.filter(
    r =>
      r.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ---------------- HELPERS ---------------- */
  const getStatusColor = (s: OrderStatus) =>
    s === "Delivered" ? "success" : s === "Processing" ? "info" : s === "Cancelled" ? "error" : "warning";

  const getPaymentColor = (p: PaymentStatus) =>
    p === "Paid" ? "success" : p === "Failed" ? "error" : "warning";

  /* ---------------- EXPORTS ---------------- */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Date", "Crop", "Farmer", "Status", "Payment", "Amount"]],
      body: filteredRows.map(r => [
        r.id,
        r.date,
        r.crop,
        r.farmer,
        r.status,
        r.payment,
        `$${r.amount}`,
      ]),
    });
    doc.save("orders.pdf");
  };

  return (
    <Box p={3} sx={{ WebkitOverflowScrolling: "touch" }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Orders Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Orders: {filteredRows.length}
          </Typography>
        </Box>

        <Button startIcon={<Refresh />} variant="outlined">
          Refresh
        </Button>
      </Stack>

      {/* SEARCH + ACTIONS */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button size="small" startIcon={<ContentCopy />}>Copy</Button>
            <Button size="small" startIcon={<TableChart />} onClick={exportExcel}>Excel</Button>
            <Button size="small" startIcon={<PictureAsPdf />} onClick={exportPDF}>PDF</Button>
            <Button size="small" startIcon={<Print />} onClick={() => window.print()}>Print</Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflowX: "auto", position: "relative" }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table size="small">
          <TableHead sx={{ background: "#f3f4f6" }}>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Crop</TableCell>

              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Farmer
              </TableCell>

              <TableCell>Status</TableCell>

              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Payment
              </TableCell>

              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Amount
              </TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Typography color="primary">{row.crop}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty: {row.quantity}
                  </Typography>
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {row.farmer}
                </TableCell>

                <TableCell>
                  <Chip label={row.status} size="small" color={getStatusColor(row.status)} />
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Chip label={row.payment} size="small" color={getPaymentColor(row.payment)} />
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography fontWeight="bold">${row.amount}</Typography>
                </TableCell>

                <TableCell align="center">
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {rowsPerPageOptions.map(n => (
                <MenuItem key={n} value={n}>
                  {n} / page
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
