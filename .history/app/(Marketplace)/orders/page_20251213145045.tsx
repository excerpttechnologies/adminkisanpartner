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
  Edit,
  Delete,
  ContentCopy,
  TableChart,
  PictureAsPdf,
  Print,
  Refresh,
  Search,
  MoreVert,
} from "@mui/icons-material";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- TYPES ---------------- */
type Status = "Pending" | "Processing" | "Delivered" | "Cancelled";
type Payment = "Pending" | "Paid" | "Failed";

interface Order {
  id: number;
  date: string;
  crop: string;
  farmer: string;
  orderBy: string;
  status: Status;
  payment: Payment;
  amount: number;
}

/* ---------------- DATA ---------------- */
const rowsPerPageOptions = [5, 8, 10, 15];

const initialRows: Order[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  date: "2025-12-02",
  crop: ["Tomato", "Wheat", "Rice", "Potato"][i % 4],
  farmer: ["Abhishek", "Rajesh", "Priya", "Amit"][i % 4],
  orderBy: ["CHETHAN", "AGRICO"][i % 2],
  status: ["Pending", "Processing", "Delivered", "Cancelled"][i % 4] as Status,
  payment: ["Pending", "Paid", "Failed"][i % 3] as Payment,
  amount: 200 + i * 10,
}));

export default function OrdersPage() {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState<Order | null>(null);
  const [deleteRow, setDeleteRow] = useState<Order | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [snackbar, setSnackbar] = useState(false);

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = rows.filter(
    (r) =>
      r.crop.toLowerCase().includes(search.toLowerCase()) ||
      r.farmer.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ---------------- HELPERS ---------------- */
  const statusColor = (s: Status) =>
    s === "Delivered" ? "success" : s === "Processing" ? "info" : s === "Cancelled" ? "error" : "warning";

  const paymentColor = (p: Payment) =>
    p === "Paid" ? "success" : p === "Failed" ? "error" : "warning";

  /* ---------------- EXPORTS ---------------- */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Date", "Crop", "Farmer", "Status", "Payment", "Amount"]],
      body: filtered.map((r) => [
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

  /* ---------------- UI ---------------- */
  return (
    <Box p={3} sx={{ WebkitOverflowScrolling: "touch" }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Orders Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Orders: {filtered.length}
          </Typography>
        </Box>

        <Button startIcon={<Refresh />} variant="outlined">
          Refresh
        </Button>
      </Stack>

      {/* SEARCH + ACTIONS */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Button size="small" startIcon={<ContentCopy />}>
              Copy
            </Button>
            <Button size="small" startIcon={<TableChart />} onClick={exportExcel}>
              Excel
            </Button>
            <Button size="small" startIcon={<PictureAsPdf />} onClick={exportPDF}>
              PDF
            </Button>
            <Button size="small" startIcon={<Print />} onClick={() => window.print()}>
              Print
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead sx={{ background: "#f3f4f6" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Crop</TableCell>

              {/* HIDDEN ON MOBILE */}
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
            {paginated.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Typography color="primary">{row.crop}</Typography>
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {row.farmer}
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={statusColor(row.status)}
                  />
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Chip
                    label={row.payment}
                    size="small"
                    color={paymentColor(row.payment)}
                  />
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography fontWeight="bold">${row.amount}</Typography>
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
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
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {rowsPerPageOptions.map((n) => (
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

      {/* ACTION MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* SNACKBAR */}
      <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}>
        <Alert severity="success">Action completed</Alert>
      </Snackbar>
    </Box>
  );
}
